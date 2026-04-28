# VRB (Volatility Range Breakout) Algorithm — MES & MNQ
# QuantConnect LEAN · Python · Option B (backtest + signal generation)
#
# Logic:
#   1. Build opening range from 8:00–9:00 AM ET (first 60 min of RTH)
#   2. After 9:00 AM, wait for price to break above range high (long)
#      or below range low (short) — first signal only per session
#   3. Stop = opposite side of the range
#   4. Target = entry ± (range_size × RR_RATIO)
#   5. Hard EOD close at 3:00 PM ET

from AlgorithmImports import *
from datetime import time as dtime

class VRBAlgorithm(QCAlgorithm):

    # ── Parameters ─────────────────────────────────────────────────────────
    RANGE_START  = dtime(8,  0)   # ET — opening range begin
    RANGE_END    = dtime(9,  0)   # ET — range locked, entries open
    SESSION_CLOSE= dtime(15, 0)   # ET — hard flatten
    RR_RATIO     = 3.0            # reward-to-risk multiplier
    CONTRACTS    = 1              # contracts per signal

    def Initialize(self):
        self.SetStartDate(2024, 9, 1)
        self.SetEndDate(2026, 4, 28)
        self.SetCash(25000)
        self.SetTimeZone("America/New_York")
        self.SetBrokerageModel(BrokerageName.InteractiveBrokersBrokerage,
                               AccountType.Margin)

        # ── Instruments ─────────────────────────────────────────────────────
        mes = self.AddFuture(Futures.Indices.MicroSP500EMini,
                             Resolution.Minute,
                             extendedMarketHours=True)
        mes.SetFilter(0, 90)

        mnq = self.AddFuture(Futures.Indices.MicroNASDAQ100EMini,
                             Resolution.Minute,
                             extendedMarketHours=True)
        mnq.SetFilter(0, 90)

        self._futures = [mes, mnq]

        # ── Per-symbol daily state ──────────────────────────────────────────
        # keyed by continuous contract Symbol
        self._state = {}

        # Track active front-month contracts: continuous → mapped symbol
        self._contracts = {}

        self.Schedule.On(
            self.DateRules.EveryDay(),
            self.TimeRules.At(7, 55),
            self._reset_daily
        )
        self.Schedule.On(
            self.DateRules.EveryDay(),
            self.TimeRules.At(15, 0),
            self._eod_close
        )

    # ── Daily reset at 7:55 AM ──────────────────────────────────────────────
    def _reset_daily(self):
        for k in list(self._state.keys()):
            self._state[k] = self._blank_state()
        self.Log(f"[{self.Time:%Y-%m-%d}] Daily state reset")

    def _blank_state(self):
        return {
            "rng_hi":    None,
            "rng_lo":    None,
            "locked":    False,   # range is finalised at RANGE_END
            "traded":    False,   # one signal per session
            "long_oco":  [],      # order ids for long OCO pair
            "short_oco": [],
        }

    # ── EOD flatten at 3:00 PM ──────────────────────────────────────────────
    def _eod_close(self):
        invested = [s for s in self.Portfolio.Keys if self.Portfolio[s].Invested]
        for sym in invested:
            self.Liquidate(sym)
            self.Log(f"EOD close: {sym}")
        # Cancel any open orders
        self.Transactions.CancelOpenOrders()

    # ── Main data handler ───────────────────────────────────────────────────
    def OnData(self, data):
        now = self.Time.time()

        for future in self._futures:
            chain_key = future.Symbol
            if chain_key not in data.FutureChains:
                continue
            chain = data.FutureChains[chain_key]

            # Pick front-month contract
            contracts = sorted(
                [c for c in chain if c.Expiry > self.Time],
                key=lambda x: x.Expiry
            )
            if not contracts:
                continue
            front = contracts[0]
            sym   = front.Symbol
            price = front.LastPrice
            if price <= 0:
                continue

            # Map continuous → front month for liquidation
            self._contracts[chain_key] = sym

            # Ensure state exists
            if chain_key not in self._state:
                self._state[chain_key] = self._blank_state()
            st = self._state[chain_key]

            # ── 1. Build opening range ──────────────────────────────────────
            if self.RANGE_START <= now < self.RANGE_END:
                if st["rng_hi"] is None:
                    st["rng_hi"] = price
                    st["rng_lo"] = price
                else:
                    st["rng_hi"] = max(st["rng_hi"], price)
                    st["rng_lo"] = min(st["rng_lo"], price)

            # ── 2. Lock range at RANGE_END ──────────────────────────────────
            elif now >= self.RANGE_END and not st["locked"]:
                if st["rng_hi"] and st["rng_lo"]:
                    st["locked"] = True
                    rng = st["rng_hi"] - st["rng_lo"]
                    self.Log(
                        f"[{sym.Value}] Range locked "
                        f"H={st['rng_hi']:.2f} L={st['rng_lo']:.2f} "
                        f"Size={rng:.2f}"
                    )

            # ── 3. Signal detection ─────────────────────────────────────────
            if (st["locked"]
                    and not st["traded"]
                    and self.RANGE_END <= now < self.SESSION_CLOSE
                    and not self.Portfolio[sym].Invested):

                rng = st["rng_hi"] - st["rng_lo"]
                if rng <= 0:
                    continue

                # Long breakout
                if price > st["rng_hi"]:
                    stop   = st["rng_lo"]
                    target = price + rng * self.RR_RATIO
                    self._enter_long(sym, stop, target, st)

                # Short breakout
                elif price < st["rng_lo"]:
                    stop   = st["rng_hi"]
                    target = price - rng * self.RR_RATIO
                    self._enter_short(sym, stop, target, st)

    # ── Entry helpers ───────────────────────────────────────────────────────
    def _enter_long(self, sym, stop, target, st):
        qty = self.CONTRACTS
        entry = self.MarketOrder(sym,  qty)
        sl    = self.StopMarketOrder(sym, -qty, stop)
        tp    = self.LimitOrder(sym,    -qty, target)
        st["traded"]   = True
        st["long_oco"] = [sl.OrderId, tp.OrderId]
        self.Log(f"LONG  {sym.Value} | Stop={stop:.2f} Target={target:.2f}")

    def _enter_short(self, sym, stop, target, st):
        qty = self.CONTRACTS
        entry = self.MarketOrder(sym,  -qty)
        sl    = self.StopMarketOrder(sym,  qty, stop)
        tp    = self.LimitOrder(sym,    qty, target)
        st["traded"]    = True
        st["short_oco"] = [sl.OrderId, tp.OrderId]
        self.Log(f"SHORT {sym.Value} | Stop={stop:.2f} Target={target:.2f}")

    # ── Cancel opposite leg when one fills ─────────────────────────────────
    def OnOrderEvent(self, orderEvent):
        if orderEvent.Status != OrderStatus.Filled:
            return

        filled_id = orderEvent.OrderId

        for chain_key, st in self._state.items():
            for oco_key in ("long_oco", "short_oco"):
                pair = st[oco_key]
                if filled_id in pair:
                    cancel_id = [i for i in pair if i != filled_id]
                    for oid in cancel_id:
                        self.Transactions.CancelOrder(oid)
                    self.Log(
                        f"OCO fill id={filled_id} | cancelled {cancel_id}"
                    )
                    return
