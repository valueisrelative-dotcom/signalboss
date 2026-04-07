import { useState, useEffect, useRef } from "react";
import {
  ClerkProvider, SignIn, SignUp,
  useUser, useAuth, UserButton,
  SignedIn, SignedOut,
} from "@clerk/clerk-react";
import emailjs from "@emailjs/browser";

const clerkDark = {
  variables: {
    colorBackground: "#0e1929",
    colorText: "#e8f0f0",
    colorTextSecondary: "#b8cccc",
    colorPrimary: "#c9a84c",
    colorNeutral: "#1a2e48",
    colorInputBackground: "#090e18",
    colorInputText: "#e8f0f0",
  },
  elements: {
    card:                             { background: "#0e1929", border: "1px solid #1a2e48", boxShadow: "0 16px 48px #000c" },
    headerTitle:                      { color: "#e8f0f0" },
    formFieldInput:                   { background: "#090e18", border: "1px solid #243c5e", color: "#e8f0f0", borderRadius: "7px" },
    formFieldInput__focus:            { border: "1px solid #c9a84c88" },
    otpCodeField:                     { gap: "10px" },
    otpCodeFieldInput:                { background: "#090e18", border: "2px solid #243c5e", color: "#e8f0f0", borderRadius: "8px", fontSize: "20px", width: "44px", height: "52px" },
    userButtonPopoverCard:            { background: "#0e1929", border: "1px solid #1a2e48", boxShadow: "0 8px 32px #000a" },
    userButtonPopoverActionButton:    { color: "#e8f0f0" },
    userButtonPopoverActionButtonText:{ color: "#e8f0f0" },
    userButtonPopoverActionButtonIcon:{ color: "#b8cccc" },
    userButtonPopoverFooter:          { display: "none" },
    footer:                           { display: "none" },
    badge:                            { display: "none" },
    identityPreview:                  { background: "#090e18", border: "1px solid #1a2e48" },
  },
};

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const API_URL   = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:4242" : "/vps");

const LANGS = {
  en: { label: "EN", name: "English",   flag: "🇺🇸" },
  es: { label: "ES", name: "Español",   flag: "🇪🇸" },
  pt: { label: "PT", name: "Português", flag: "🇧🇷" },
  fr: { label: "FR", name: "Français",  flag: "🇫🇷" },
};

const T = {
  en: {
    tagline: "Institutional-Grade Trade Signals · Live",
    heroTitle1: "Your kitchen table is a fine place", heroTitle2: "to change your financial picture.",
    heroSub: "Millions of people are done waiting for a real opportunity — one that isn't a scheme, a course, or another indicator that goes nowhere. Signal Boss delivers institutional-grade trade signals with a clear entry, a defined stop, and a profit target. Built on the same frameworks professional trading desks use, but for those of us who don't have a Wall Street address.\n\nYou don't need another idea. You just need something that actually works.\n\nFollow the signal. Take the trade.",
    engineTagline: "Institutional-Grade Signal Engine · Live",
    chooserTitle1: "Your kitchen table is a fine place", chooserTitle2: "", chooserTitle3: "to change your financial picture.",
    chooserSub: "People today are looking for a real opportunity — not some expensive course or indicator, no 'get rich' promise that goes nowhere.\n\nIf you can commit to following a proven trade blueprint, the Signal Boss Platform will help you create additional monthly income - or grow your funds for that vacation, day care expenses or supplement your retirement income.\n\nWe provide more than just signals; we provide a clear path forward. Our Members learn a simple, straightforward way to profit by using a professional, institutional-grade investment method that works in all economic conditions.\n\nTake your time to explore the site and feel free to Contact us to learn more.",
    whyBuilt: "WHY WE BUILT SIGNAL BOSS",
    whyP1: "Imagine joining a gym where 98% of members get weaker and fatter following the same workout plan. You'd find a different gym.",
    whyP2: "Chart-based trading is that workout plan. And the numbers prove it — financial regulators in Europe tracked retail traders across thousands of accounts and found that between 74% and 89% lose money consistently. In some markets, that number approaches 98%.",
    whyP3a: "The common thread? ", whyP3b: "Charts.", whyP3c: "",
    whyP4: "Charts show you what already happened. They don't show you why it happened, or when conditions are right for it to happen again. Trading off a chart is like driving by staring at the rearview mirror — you can see exactly where you've been, and nothing about where you're going.",
    whyP5a: "Signal Boss is built on the institutional frameworks that professional trading desks actually use — ", whyP5b: "volatility conditions, momentum cycles, and institutional money flow.", whyP5c: " When those align in a specific way, the signal fires. You get the entry, the stop, and the target.",
    whyP6: "You don't need to understand how the engine works. You just need to know when to drive.",
    whyHeadline: "If Charts Worked, 98% of Traders Wouldn't Be Losing.",
    whyGym: "Imagine joining a gym where 98% of members get weaker and fatter following the same workout plan. You'd find a different gym. Chart-based trading is that workout plan. And the numbers prove it — financial regulators in Europe tracked retail traders across thousands of accounts and found that between 74% and 89% lose money consistently. In some markets, that number approaches 98%. The common thread? Charts.",
    whyChartsShowa: "Charts show you what already happened.",
    whyChartsShowb: "They Don't Show Conditions.",
    whyProblemTitle: "The Problem Isn't Charts. It's Using Them Without The Right Context.",
    whyProblemBody: "The problem is that charts alone don't tell you if the market is in a condition where a large, sustained move is statistically likely.",
    whyIntuitive: "Intuitively, you already know this.",
    whyVolatility: "That information doesn't live on a chart. It lives in volatility — specifically, in implied volatility derived from exchange-traded futures, where institutional positioning is expressed first and retail traders rarely look.",
    whyRhythm: ["Price action tells you what the market already did.", "Market structure tells you where it's been.", "Volatility tells you what it's preparing to do right now."],
    whyForwardLooking: "Only one of those is forward-looking.",
    whyReplace: "Signal Boss doesn't replace your chart process. It gives you the layer that's been missing from it.",
    whyWhenFires: "When a Signal Boss alert fires, it means volatility has reached an inflection point — the condition under which large price movement statistically occurs. If you still want to look at your chart before you pull the trigger, look. Most of the time, you'll see the chart confirming what the volatility already told you.",
    whyThreeComponents: "Every Signal Boss alert delivers three components:",
    whyThreeItems: ["Entry Price", "Smart Stop", "Smart Take Profit"],
    whyNotJust: "Not just an entry and a wish. A complete trade — built from the same volatility data that institutions use to price risk.",
    whyQuote: "\"Correct volatility regime + defined risk + proper sizing = professional trading. Get the Signal, confirm with your chart.\"",
    whyAskSimple: "Ask yourself a simple question:",
    whyAskQuestion: "If charts alone were the answer… why are you not already generating consistent wealth using them?",
    whyDoesNotPredict: "Signal Boss does not predict candles. It allows you to focus on what actually makes money:",
    whyRisk: "managing your risk",
    whyProfits: "managing your profits",
    whyIdentify: "We identify volatility expansion conditions — the environment where large, sustained price movement statistically occurs. Trade with the context your charts were never designed to give you.",
    whyGymClosing: "The gym is still full. You don't have to stay on the same plan.",
    teamName: "The Signal Boss Team", teamSub: "Built by traders, for traders",
    calcLabel: "FREE TOOL FOR PROP FIRM & RETAIL TRADERS",
    calcTitle: "The Calculator That Prop Firm Traders Say Is Worth the Subscription Alone.",
    calcP1a: "A \"$50,000 funded account\" gives you roughly ", calcP1b: "$2,500–$3,000 before you breach drawdown and lose the account.", calcP1c: " That's your true trading capital — whether it's a prop challenge or your own money.",
    calcP2: "Position sizing, loss to ruin, daily drawdown limits, pip values, tick values — for futures and forex. Know your worst case before the market shows it to you. Enter your email and get instant access, free.",
    calcCta: "Get Free Access →",
    calcFeatures: [
      ["Position Sizing",   "Size correctly for your true trading capital"],
      ["Trades to Ruin",    "Know your worst-case scenario upfront"],
      ["Days to Goal",      "Project how long reaching your profit target takes"],
      ["Daily Loss Limits", "Never accidentally breach a daily loss rule"],
    ],
    exploreFuturesLabel: "EXPLORE FUTURES", exploreForexLabel: "EXPLORE FOREX",
    futuresDesc: "ES, NQ, CL, GC, RTY, ZN and currency futures /6E. Multi-cycle momentum signals with VWAP confirmation on the contracts where institutional positioning is most transparent.",
    futuresFeatures: ["ES · NQ · CL · GC · RTY", "ZN · /6E", "Account Risk Calculator included", "Smart Stop & Take Profit on every signal"],
    forexLabel: "FOREX TRADERS", forexHeadline: "Trade the intelligence.",
    forexDesc: "EUR/USD. Multi-cycle momentum signals derived from /6E currency futures — where institutional price discovery actually begins.",
    forexFeatures: ["EUR/USD · via /6E futures", "Derived from exchange-traded /6E futures", "Account Risk Calculator included", "Smart Stop & Take Profit on every signal"],
    trialNote: "30-day money-back guarantee · Cancel anytime",
    exploreFutures: "Explore Futures →", exploreForex: "Explore Forex →",
    forexTagline: "Forex Signal Intelligence · Live",
    forexHeroTitle1: "No charts. No noise.", forexHeroTitle2: "The Inflection Point.",
    forexHeroSub: "Currency futures are where institutions show their hand. Signal Boss reads cycle momentum on /6E — giving forex traders institutional-grade intelligence on EUR/USD.",
    methodologyLabel: "THE METHODOLOGY",
    methodologyTitle: "The market tells you where price is going.",
    methodologyAccent: "We just listen.",
    methodologyQuote: "Not just when to enter. Where to stop. When to take profit. All from the same source — what the market is actually implying about its own expected range.",
    methodology: [
      { icon:"◈", color:"long",  label:"Implied Volatility", title:"The Market Tells You When Something Is About to Move", body:"Every big price move starts with a volatility shift. Signal Boss reads that shift in real time — so you're positioned before the crowd reacts. No guessing. No lagging indicators. Just the market telling you what's next." },
      { icon:"◎", color:"accent", label:"VWAP", title:"Know Whose Side the Market Is On", body:"VWAP tells you where the big money is positioned right now. Signal Boss uses it as a filter — so every signal comes with built-in context. Are you trading with the institutions or against them? Now you'll always know." },
      { icon:"◉", color:"prop",   label:"Mean Reversion", title:"The Market Always Snaps Back", body:"When volatility spikes, price follows. Every time. Signal Boss catches that moment — right before the move — and hands you a clean entry, a defined stop, and a target. You just take the trade." },
    ],
    startTrial: "Get Started", viewDemo: "Try the Demo →",
    backtestLabel: "BACKTEST RESULTS",
    backtestHeadline: "How the ES signal performed", backtestSub: "over 30 days.",
    realNumbers: "Real numbers.", realData: "Real historical data.",
    backtestSubtitle: "Walk-forward backtest · 5-min bars",
    chooseTrackLabel: "CHOOSE YOUR TRACK", chooseTrackTitle: "Futures or Forex — same intelligence, same edge.",
    methodologyTitle: "How Signal Boss Works",
    earlyUsersLabel: "EARLY USERS", earlyUsersTitle: "What traders are saying", earlyUsersSub: "From our beta group — real traders, real feedback.",
    knowYourFitLabel: "KNOW YOUR FIT", knowYourFitTitle: "Signal Boss is built for some traders.", knowYourFitSub: "Not all of them.",
    fitForLabel: "THIS IS FOR YOU IF...", fitNotLabel: "THIS IS NOT FOR YOU IF...",
    fitFor: ["You trade futures actively and want confluence-based signals, not noise","You're working through a prop firm challenge or protecting your own trading account","You understand that signals are tools, not guarantees — and trade accordingly","You want to know why a signal fired, not just that it did","You're comfortable making your own trading decisions with better information","You value clean, minimal interfaces over cluttered dashboards"],
    fitNot: ["You're looking for a fully automated system that trades for you","You expect signals to be profitable without your own risk management","You're a complete beginner with no understanding of futures markets","You want passive investing or long-only equity strategies","You're not prepared to lose capital — trading involves real financial risk","You need someone else to be responsible for your trading decisions"],
    fitForForex: ["You trade major forex pairs or crosses and want institutional signal intelligence","You're working through an FTMO, FundedNext, or other forex prop challenge","You understand that currency futures are a leading indicator for spot forex","You want to know why a signal fired — derived from which futures, at what confluence","You're comfortable making your own trading decisions with better information","You value clean, transparent methodology over black-box arrows on a chart"],
    fitNotForex: ["You're looking for a fully automated system that trades for you","You expect signals to be profitable without your own risk management","You're a complete beginner with no understanding of forex or currency markets","You want a copy-trading or managed account service","You're not prepared to lose capital — trading involves real financial risk","You need someone else to be responsible for your trading decisions"],
    backtestDesc: "Full trade-by-trade log available inside the dashboard",
    backtestDescSub: "Every entry, stop, target, exit price, hold time, and result — with live forward tracking as new signals fire.",
    exampleSignal: "EXAMPLE SIGNAL", howItWorks: "The Edge",
    pricing: "Pricing", pricingNote: "30-day money-back guarantee.",
    getStarted: "Get Started", signIn: "Sign In", signUp: "Sign Up",
    signInTitle: "Sign in", signUpTitle: "Create account",
    signInSub: "Welcome back to Signal Boss", signUpSub: "30-day money-back guarantee",
    fullName: "FULL NAME", email: "EMAIL", password: "PASSWORD", plan: "PLAN",
    createAccount: "Create Account", noAccount: "No account? ", haveAccount: "Have an account? ",
    engineActive: "ENGINE ACTIVE", active: "ACTIVE",
    liveSignals: "Live Signals", configuration: "Configuration",
    account: "Account", propCalc: "Risk Calculator", home: "← Home",
    direction: "DIRECTION", strength: "STRENGTH",
    cyclesConfirming: "cycles confirming", vwapsConfirming: "VWAPs confirming",
    entryPrice: "Entry price", exit: "EXIT", dismiss: "dismiss",
    vwapAbove: "above ✓", vwapBelow: "below ✓", vwapFail: "unconfirmed ⚠",
    resetsAt: "Resets at", aboveZero: "above zero", belowZero: "below zero",
    activeSignals: "Active Signals", long: "Long", short: "Short",
    strongSig: "Strong", threeCycles: "3/3 cycles",
    timeframe: "Chart Timeframe", exitMode: "Exit Mode",
    exitModeQ: "A signal is cancelled when the position narrative changes — conditions that supported the trade direction are no longer valid.",
    exitRule: "Hard Exit", exitRuleDesc: "Signal cancelled when the triggering cycle crosses back through its initial inflection point. The trade narrative has changed.",
    cycleSettings: "Cycle Settings", cycleSub: "Your three momentum cycles",
    vwapSettings: "VWAP Confirmation Rule", vwapSettingsSub: "Which VWAPs must confirm for a signal?",
    subscription: "Subscription", alertDelivery: "Alert Delivery",
    instruments: "Instruments", manage: "Manage",
    configSub: "Adjust signal behavior and cycle settings",
    accountSub: "Manage your subscription and preferences",
    noSignals: "No signals match your filter",
    propTitle: "Account Risk Calculator",
    propSub: "Position sizing and risk management for every serious trader — prop challenge or personal account",
    features: {
      "01": { title: "The Signal Fires", desc: "When the market sets up, you get an alert. No waiting. No watching. No staring at charts. Just a clean notification the moment conditions align — with everything you need already included." },
      "02": { title: "Everything You Need Is In the Alert", desc: "Every Signal Boss alert delivers three things:\n\n◆ Entry Price — exactly where to get in. No guesswork.\n◆ Smart Stop — where to exit if the trade goes wrong, so you always know your max loss before you're in.\n◆ Smart Take Profit — where to take your money off the table. Typically 3 to 4 times what you risked.\n\nNothing to calculate. Nothing to interpret. Just act.\n\nIf you're just getting started (or still wondering why you're not making serious money with charts), this matters.\nThe single biggest trap new traders fall into is trading off charts — reacting to price after it's already moved. It looks logical. It feels professional. And it has cost countless traders everything. Signal Boss is built on what actually moves markets, not what already happened. We'll show you the difference — and keep you on the right side of it." },
      "03": { title: "You Always Know What You're Walking Into", desc: "Every signal tells you whether you're trading with or against institutional money flow. That context is built in — you never have to wonder if the setup is real." },
      "04": { title: "Just Take the Trade", desc: "No charts. No noise. A clean card with everything you need — the moment conditions align." },
    },
    futuresPlans: [
      { name: "Starter", price: 149, features: ["Futures Trade Signals — Equity index, Treasury, Energy & Metals", "Smart Stop & Take Profit on every signal", "Risk/Money Management Calculator", "Real-time dashboard", "Email alerts"] },
      { name: "Pro",     price: 249, features: ["Everything in Starter + Currency Futures", "Telegram & Email alerts on every signal", "1 Standard Deviation of Intraday IV on every signal"] },
      { name: "Elite",   price: 449, features: ["Everything in Pro", "1 & 2 Standard Deviations of Intraday IV on every signal", "Compression/Expansion signals", "Treasury bond spread analysis", "Contact us for full details →"] },
    ],
    forexPlans: [
      { name: "Major Pairs", price: 129, features: ["Forex Trade Signals", "Smart Stop & Take Profit on every signal", "Risk/Money Management Calculator", "Real-time dashboard", "Email alerts"] },
      { name: "Full Coverage", price: 249, features: ["All Major Pairs instruments + expanded coverage", "Telegram & Email alerts on every signal", "Additional indicator signals"] },
    ],
  },
  es: {
    tagline: "Motor de Señales Multi-Ciclo · En Vivo",
    heroTitle1: "Sin gráficos. Sin ruido.", heroTitle2: "El Punto de Inflexión.",
    heroSub: "Solo lo que importa — señales de inflexión IV basadas en confluencia multi-ciclo y confirmación VWAP.",
    engineTagline: "Motor de Señales Institucional · En Vivo",
    chooserTitle1: "Sin gráficos. Sin ruido.", chooserTitle2: "Solo lo que importa...", chooserTitle3: "El Punto de Inflexión.",
    chooserSub: "La gente hoy busca una oportunidad real — no un curso caro ni un indicador más, sin promesas de 'hacerse rico' que no llevan a ningún lado.\n\nSi te comprometes a seguir un plan de trading probado, la Plataforma Signal Boss te ayudará a generar ingresos mensuales adicionales - o hacer crecer tus fondos para esas vacaciones, gastos de guardería o complementar tu jubilación.\n\nOfrecemos más que señales; ofrecemos un camino claro hacia adelante. Nuestros Miembros aprenden una forma simple y directa de generar ganancias usando un método de inversión institucional que funciona en todas las condiciones del mercado.\n\nTómate tu tiempo para explorar el sitio y no dudes en Contactarnos para saber más.",
    whyBuilt: "LA MAYORÍA DE LAS SEÑALES TE DICEN CUÁNDO. NO DÓNDE.",
    whyP1: "El 98% de los traders pierden dinero. Casi el 100% de ellos toman decisiones con gráficos.",
    whyP2: "Piensa en eso un segundo. Es como unirse a un gimnasio donde el 99% de los miembros siguen un plan que los hace más débiles. ¿Tiene sentido eso?",
    whyP3a: "Los gráficos te dicen lo que ya ocurrió. Signal Boss te dice cuándo ", whyP3b: "las condiciones son correctas", whyP3c: " — y esa diferencia importa enormemente.",
    whyP4: "La entrada es solo el 20% de la ecuación. Un 20% esencial, sí — pero solo el 20%. El otro 80% es gestión de riesgo, tamaño de posición y toma de ganancias inteligente. La mayoría de servicios te dan una entrada y se van. Eso no es un sistema. Eso es media frase.",
    whyP5a: "Cada alerta de Signal Boss incluye tres cosas: ", whyP5b: "Precio de Entrada. Stop Inteligente. Toma de Ganancias Inteligente.", whyP5c: " Dónde entrar. Dónde cortar pérdidas. Dónde comenzar a tomar ganancias. Ese es el trade completo.",
    whyP6: "Lo construimos porque las condiciones correctas, bien dimensionadas, con riesgo definido, es lo que el trading realmente es. Todo lo demás es ruido.",
    whyHeadline: "Si los gráficos funcionaran, el 98% no estaría perdiendo.",
    whyGym: "Imagina unirte a un gimnasio y seguir un plan de entrenamiento que deja al 98% de sus miembros más débiles y con más grasa. El trading basado en gráficos es ese 'plan de entrenamiento' para muchos traders, y simplemente los está empobreciendo financieramente. Signal Boss permite a los traders obtener señales institucionales válidas, activadas por las condiciones que realmente mueven los mercados.",
    whyChartsShowa: "Los gráficos te muestran lo que ya ocurrió.",
    whyChartsShowb: "No muestran las condiciones.",
    whyProblemTitle: "El problema no son los gráficos. Es usarlos sin el contexto adecuado.",
    whyProblemBody: "El problema es que los gráficos solos no te dicen si el mercado está en una condición donde un movimiento grande y sostenido es estadísticamente probable.",
    whyIntuitive: "Intuitivamente, ya lo sabes.",
    whyVolatility: "Esa información no vive en un gráfico. Vive en la volatilidad — específicamente, en la volatilidad implícita derivada de los futuros cotizados en bolsa, donde el posicionamiento institucional se expresa primero y los traders minoristas raramente miran.",
    whyRhythm: ["La acción del precio te dice lo que el mercado ya hizo.", "La estructura del mercado te dice dónde ha estado.", "La volatilidad te dice lo que está preparando para hacer ahora mismo."],
    whyForwardLooking: "Solo uno de ellos es prospectivo.",
    whyReplace: "Signal Boss no reemplaza tu proceso de gráficos. Te da la capa que le ha faltado.",
    whyWhenFires: "Cuando una alerta de Signal Boss se activa, significa que la volatilidad ha alcanzado un punto de inflexión — la condición bajo la cual el gran movimiento de precios ocurre estadísticamente. Si aún quieres mirar tu gráfico antes de ejecutar, míralo. La mayoría de las veces, verás el gráfico confirmando lo que la volatilidad ya te dijo.",
    whyThreeComponents: "Cada alerta de Signal Boss entrega tres componentes:",
    whyThreeItems: ["Precio de Entrada", "Stop Inteligente", "Toma de Ganancias Inteligente"],
    whyNotJust: "No solo una entrada y un deseo. Un trade completo — construido con los mismos datos de volatilidad que las instituciones usan para calcular el riesgo.",
    whyQuote: "\"Régimen de volatilidad correcto + riesgo definido + tamaño adecuado = trading profesional. Obtén la Señal, confirma con tu gráfico.\"",
    whyAskSimple: "Hazte una pregunta simple:",
    whyAskQuestion: "Si los gráficos solos fueran la respuesta… ¿por qué no estás generando riqueza consistente con ellos?",
    whyDoesNotPredict: "Signal Boss no predice velas. Te permite enfocarte en lo que realmente hace ganar dinero:",
    whyRisk: "gestionar tu riesgo",
    whyProfits: "gestionar tus ganancias",
    whyIdentify: "Identificamos condiciones de expansión de volatilidad — el entorno donde el gran movimiento de precios sostenido ocurre estadísticamente. Opera con el contexto que tus gráficos nunca fueron diseñados para darte.",
    whyGymClosing: "El gimnasio sigue lleno. No tienes que quedarte en el mismo plan.",
    teamName: "El Equipo de Signal Boss", teamSub: "Construido por traders, para traders",
    calcLabel: "PARA CADA TRADER SERIO",
    calcTitle: "Conoce tus Números Antes de Operar",
    calcP1a: "Una \"cuenta fondeada de $50,000\" te da aproximadamente ", calcP1b: "$2,500–$3,000 antes de superar el drawdown y perder la cuenta.", calcP1c: " Ese es tu capital real de trading.",
    calcP2: "La Calculadora de Riesgo cubre futuros y forex, desafío prop o cuenta personal. Tamaño de posición, pérdidas hasta la ruina, límites diarios — conoce tu peor caso antes de que el mercado te lo muestre.",
    calcCta: "Prueba la Calculadora Gratis →",
    calcFeatures: [
      ["Tamaño de Posición",    "Dimensiona correctamente para tu capital real"],
      ["Trades hasta la Ruina", "Conoce tu peor escenario de antemano"],
      ["Días para la Meta",     "Proyecta cuánto tardas en alcanzar tu objetivo"],
      ["Límites de Pérdida Diaria", "Nunca incumplas accidentalmente una regla diaria"],
    ],
    exploreFuturesLabel: "EXPLORAR FUTUROS", exploreForexLabel: "EXPLORAR FOREX",
    futuresDesc: "ES, NQ, CL, GC, RTY, ZN y futuros de divisas /6E. Señales de momentum multi-ciclo con confirmación VWAP en los contratos donde el posicionamiento institucional es más transparente.",
    futuresFeatures: ["ES · NQ · CL · GC · RTY", "ZN · /6E", "Calculadora de Riesgo incluida", "Stop Inteligente y Toma de Ganancias en cada señal"],
    forexLabel: "TRADERS DE FOREX", forexHeadline: "Opera con la inteligencia.",
    forexDesc: "EUR/USD. Señales de momentum multi-ciclo derivadas de futuros /6E — donde comienza realmente el descubrimiento de precios institucional.",
    forexFeatures: ["EUR/USD · via futuros /6E", "Derivado de futuros /6E", "Calculadora de Riesgo incluida", "Stop Inteligente y Toma de Ganancias en cada señal"],
    trialNote: "Garantía de devolución 30 días · Cancela cuando quieras",
    exploreFutures: "Explorar Futuros →", exploreForex: "Explorar Forex →",
    forexHeroTitle1: "Sin gráficos. Sin ruido.", forexHeroTitle2: "El Punto de Inflexión.",
    forexHeroSub: "Los futuros de divisas son donde las instituciones muestran su mano. Signal Boss lee el momentum de ciclos en /6E, /6B y /6A — dando a los traders de forex inteligencia institucional en EUR/USD, GBP/USD y AUD/USD.",
    methodologyLabel: "LA METODOLOGÍA",
    methodologyTitle: "El mercado te dice hacia dónde va el precio.",
    methodologyAccent: "Nosotros solo escuchamos.",
    methodologyQuote: "No solo cuándo entrar. Dónde hacer stop. Cuándo tomar ganancias. Todo de la misma fuente — lo que el mercado está implicando sobre su propio rango esperado.",
    methodology: [
      { icon:"◈", color:"long",  label:"Volatilidad Implícita", title:"El Pronóstico del Propio Mercado", body:"La VI no es ruido — es la estimación de consenso del mercado sobre el movimiento esperado. Cuando la VI a corto plazo alcanza un punto de inflexión en un cierre, el mercado te dice que algo ha cambiado." },
      { icon:"◎", color:"accent", label:"VWAP",                 title:"Donde Operan las Instituciones", body:"Todo escritorio institucional compara su ejecución contra el VWAP. Precio sobre VWAP significa compradores en control. Debajo, vendedores. Simple. Poderoso. Probado." },
      { icon:"◉", color:"prop",   label:"Reversión a la Media",  title:"La VI Siempre Regresa", body:"La volatilidad implícita revierte a la media. Siempre. Cuando la VI llega a extremos, la pregunta no es si el precio revertirá — es cuándo. Ahí vive la ventaja." },
    ],
    startTrial: "Comenzar", viewDemo: "Ver Demo →",
    backtestLabel: "RESULTADOS DEL BACKTEST",
    backtestHeadline: "Cómo se desempeñó la señal ES", backtestSub: "en 30 días.",
    realNumbers: "Números reales.", realData: "Datos históricos reales.",
    backtestSubtitle: "Backtest walk-forward · barras de 5 min",
    chooseTrackLabel: "ELIGE TU TRACK", chooseTrackTitle: "Futuros o Forex — la misma inteligencia, la misma ventaja.",
    methodologyTitle: "Cómo Funciona Signal Boss",
    earlyUsersLabel: "PRIMEROS USUARIOS", earlyUsersTitle: "Lo que dicen los traders", earlyUsersSub: "De nuestro grupo beta — traders reales, comentarios reales.",
    knowYourFitLabel: "CONÓCETE", knowYourFitTitle: "Signal Boss está hecho para algunos traders.", knowYourFitSub: "No para todos.",
    fitForLabel: "ES PARA TI SI...", fitNotLabel: "NO ES PARA TI SI...",
    fitFor: ["Operas futuros activamente y quieres señales basadas en confluencia, no ruido","Estás pasando un desafío de prop firm o protegiendo tu cuenta propia","Entiendes que las señales son herramientas, no garantías — y operas en consecuencia","Quieres saber por qué se activó una señal, no solo que se activó","Te sientes cómodo tomando tus propias decisiones con mejor información","Valoras interfaces limpias y mínimas sobre paneles recargados"],
    fitNot: ["Buscas un sistema totalmente automatizado que opere por ti","Esperas que las señales sean rentables sin tu propia gestión de riesgo","Eres un principiante sin conocimiento de mercados de futuros","Quieres inversión pasiva o estrategias solo de acciones","No estás preparado para perder capital — operar implica riesgo real","Necesitas que alguien más sea responsable de tus decisiones"],
    fitForForex: ["Operas pares de forex mayores y quieres inteligencia de señales institucional","Estás pasando un desafío FTMO, FundedNext u otro de forex","Entiendes que los futuros de divisas son un indicador adelantado del spot forex","Quieres saber por qué se activó una señal — de qué futuros, con qué confluencia","Te sientes cómodo tomando tus propias decisiones con mejor información","Valoras metodología clara y transparente sobre flechas en un gráfico"],
    fitNotForex: ["Buscas un sistema totalmente automatizado","Esperas señales rentables sin tu propia gestión de riesgo","Eres principiante sin conocimiento de forex o divisas","Quieres un servicio de copy-trading o cuenta gestionada","No estás preparado para perder capital","Necesitas que alguien más sea responsable de tus decisiones"],
    backtestDesc: "Registro completo operación por operación dentro del panel",
    backtestDescSub: "Cada entrada, stop, objetivo, precio de salida, tiempo de holding y resultado — con seguimiento en tiempo real de nuevas señales.",
    exampleSignal: "SEÑAL DE EJEMPLO", howItWorks: "La Ventaja",
    pricing: "Precios", pricingNote: "Garantía de devolución 30 días.",
    getStarted: "Comenzar", signIn: "Iniciar Sesión", signUp: "Registrarse",
    signInTitle: "Iniciar sesión", signUpTitle: "Crear cuenta",
    signInSub: "Bienvenido de vuelta", signUpSub: "Garantía de devolución 30 días",
    fullName: "NOMBRE COMPLETO", email: "CORREO", password: "CONTRASEÑA", plan: "PLAN",
    createAccount: "Crear Cuenta", noAccount: "¿Sin cuenta? ", haveAccount: "¿Ya tienes? ",
    engineActive: "MOTOR ACTIVO", active: "ACTIVO",
    liveSignals: "Señales en Vivo", configuration: "Configuración",
    account: "Cuenta", propCalc: "Calculadora de Riesgo", home: "← Inicio",
    direction: "DIRECCIÓN", strength: "FUERZA",
    cyclesConfirming: "ciclos confirmando", vwapsConfirming: "VWAPs confirmando",
    entryPrice: "Precio de entrada", exit: "SALIDA", dismiss: "descartar",
    vwapAbove: "arriba ✓", vwapBelow: "abajo ✓", vwapFail: "no confirmado ⚠",
    resetsAt: "Reinicia", aboveZero: "sobre cero", belowZero: "bajo cero",
    activeSignals: "Señales Activas", long: "Largo", short: "Corto",
    strongSig: "Fuerte", threeCycles: "3/3 ciclos",
    timeframe: "Marco Temporal", exitMode: "Modo de Salida",
    exitModeQ: "Una señal se cancela cuando cambia la narrativa de la posición — las condiciones que la respaldaban ya no son válidas.",
    exitRule: "Salida Definitiva", exitRuleDesc: "Señal cancelada cuando el ciclo disparador cruza de vuelta su punto de inflexión inicial.",
    cycleSettings: "Configuración de Ciclos", cycleSub: "Tus tres ciclos de momentum",
    vwapSettings: "Regla de Confirmación VWAP", vwapSettingsSub: "¿Qué VWAPs deben confirmar?",
    subscription: "Suscripción", alertDelivery: "Entrega de Alertas",
    instruments: "Instrumentos", manage: "Gestionar",
    configSub: "Ajusta señales y ciclos", accountSub: "Gestiona tu suscripción",
    noSignals: "Sin señales para este filtro",
    propTitle: "Calculadora de Riesgo de Cuenta", propSub: "Gestión de riesgo para todo trader serio — desafío prop o cuenta personal",
    features: {
      "01": { title: "Señales de Inflexión IV", desc: "Las señales se activan cuando la volatilidad implícita alcanza un punto de inflexión, confirmado por el precio ponderado por volumen. Sin ambigüedad." },
      "02": { title: "Filtro VWAP", desc: "El precio debe estar del lado correcto del VWAP. Sin señales contra tendencia." },
      "03": { title: "Puntuación de Confluencia", desc: "1 ciclo = entrada temprana. 2 ciclos = moderado. 3 ciclos = máxima fuerza." },
      "04": { title: "Tarjetas Limpias", desc: "Sin gráficos. Sin desorden. Alertas precisas cuando las condiciones se alinean." },
    },
    futuresPlans: [
      { name: "Inicial",       price: 149, features: ["Señales de Futuros — Índices, Tesoro, Energía y Metales", "Stop Inteligente y Toma de Ganancias en cada señal", "Calculadora de Riesgo/Gestión de Capital", "Panel en tiempo real", "Alertas email"] },
      { name: "Pro",           price: 249, features: ["Todo en Inicial + Futuros de Divisas", "Alertas Telegram y Email en cada señal", "1 Desviación Estándar de IV Intraday en cada señal"] },
      { name: "Elite",         price: 449, features: ["Todo en Pro", "1 y 2 Desviaciones Estándar de IV Intraday en cada señal", "Señales de Compresión/Expansión", "Análisis de spreads de bonos del tesoro", "Contáctanos para más detalles →"] },
    ],
    forexPlans: [
      { name: "Pares Principales", price: 129, features: ["EUR/USD · GBP/USD · AUD/USD", "Derivado de futuros /6E · /6B · /6A", "3 ciclos", "Panel en tiempo real", "Email", "Calculadora de Riesgo"] },
      { name: "Cobertura Total",   price: 249, features: ["Todo en Principales", "Stop Inteligente y Toma de Ganancias en cada señal", "Telegram · Webhook"] },
    ],
  },
  pt: {
    tagline: "Motor de Sinais Multi-Ciclo · Ao Vivo",
    heroTitle1: "Sem gráficos. Sem ruído.", heroTitle2: "O Ponto de Inflexão.",
    heroSub: "Só o que importa — sinais de inflexão IV baseados em confluência multi-ciclo e confirmação VWAP.",
    engineTagline: "Motor de Sinais Institucional · Ao Vivo",
    chooserTitle1: "Sem gráficos. Sem ruído.", chooserTitle2: "Só o que importa...", chooserTitle3: "O Ponto de Inflexão.",
    chooserSub: "As pessoas hoje buscam uma oportunidade real — não um curso caro ou mais um indicador, sem promessas de 'ficar rico' que não levam a lugar nenhum.\n\nSe você se comprometer a seguir um plano de trading comprovado, a Plataforma Signal Boss vai te ajudar a criar uma renda mensal adicional - ou aumentar seus fundos para aquelas férias, despesas com creche ou complementar sua aposentadoria.\n\nOferecemos mais do que sinais; oferecemos um caminho claro à frente. Nossos Membros aprendem uma forma simples e direta de gerar lucros usando um método de investimento institucional que funciona em todas as condições de mercado.\n\nExplore o site com calma e fique à vontade para nos Contatar para saber mais.",
    whyBuilt: "A MAIORIA DOS SINAIS TE DIZ QUANDO. NÃO ONDE.",
    whyP1: "98% dos traders perdem dinheiro. Quase 100% deles tomam decisões com gráficos.",
    whyP2: "Pense nisso por um segundo. É como entrar numa academia onde 99% dos membros seguem um plano que os deixa mais fracos. Isso faz sentido?",
    whyP3a: "Gráficos mostram o que já aconteceu. Signal Boss diz quando ", whyP3b: "as condições estão certas", whyP3c: " — e essa diferença importa enormemente.",
    whyP4: "A entrada é apenas 20% da equação. Um 20% essencial, sim — mas ainda 20%. Os outros 80% são gestão de risco, dimensionamento de posição e realização de lucros inteligente. A maioria dos serviços te dá uma entrada e vai embora. Isso não é um sistema. É meia frase.",
    whyP5a: "Cada alerta do Signal Boss inclui três coisas: ", whyP5b: "Preço de Entrada. Stop Inteligente. Take Profit Inteligente.", whyP5c: " Onde entrar. Onde cortar perdas. Onde começar a realizar lucros. Esse é o trade completo.",
    whyP6: "Construímos isso porque as condições certas, bem dimensionadas, com risco definido, é o que o trading realmente é. Todo o resto é ruído.",
    whyHeadline: "Se os gráficos funcionassem, 98% não estariam perdendo.",
    whyGym: "Imagine entrar numa academia e seguir um plano de treino que deixa 98% dos seus membros mais fracos e mais gordos. O trading baseado em gráficos é esse 'plano de treino' para muitos traders, e simplesmente está os empobrecendo financeiramente. O Signal Boss permite que traders obtenham sinais institucionais válidos, acionados pelas condições que realmente movem os mercados.",
    whyChartsShowa: "Os gráficos mostram o que já aconteceu.",
    whyChartsShowb: "Eles não mostram as condições.",
    whyProblemTitle: "O problema não são os gráficos. É usá-los sem o contexto certo.",
    whyProblemBody: "O problema é que os gráficos sozinhos não dizem se o mercado está numa condição onde um movimento grande e sustentado é estatisticamente provável.",
    whyIntuitive: "Intuitivamente, você já sabe disso.",
    whyVolatility: "Essa informação não está num gráfico. Ela vive na volatilidade — especificamente, na volatilidade implícita derivada de futuros negociados em bolsa, onde o posicionamento institucional se expressa primeiro e os traders de varejo raramente olham.",
    whyRhythm: ["A ação do preço te diz o que o mercado já fez.", "A estrutura do mercado te diz onde ele esteve.", "A volatilidade te diz o que ele está se preparando para fazer agora."],
    whyForwardLooking: "Apenas um desses é prospectivo.",
    whyReplace: "O Signal Boss não substitui seu processo de gráficos. Ele te dá a camada que tem faltado.",
    whyWhenFires: "Quando um alerta do Signal Boss é disparado, significa que a volatilidade atingiu um ponto de inflexão — a condição sob a qual o grande movimento de preço ocorre estatisticamente. Se ainda quiser olhar seu gráfico antes de executar, olhe. Na maioria das vezes, você verá o gráfico confirmando o que a volatilidade já te disse.",
    whyThreeComponents: "Cada alerta do Signal Boss entrega três componentes:",
    whyThreeItems: ["Preço de Entrada", "Stop Inteligente", "Take Profit Inteligente"],
    whyNotJust: "Não apenas uma entrada e um desejo. Um trade completo — construído com os mesmos dados de volatilidade que as instituições usam para calcular o risco.",
    whyQuote: "\"Regime de volatilidade correto + risco definido + tamanho adequado = trading profissional. Obtenha o Sinal, confirme com seu gráfico.\"",
    whyAskSimple: "Faça a si mesmo uma pergunta simples:",
    whyAskQuestion: "Se os gráficos sozinhos fossem a resposta… por que você ainda não está gerando riqueza consistente com eles?",
    whyDoesNotPredict: "O Signal Boss não prevê velas. Ele permite que você se concentre no que realmente gera dinheiro:",
    whyRisk: "gerenciar seu risco",
    whyProfits: "gerenciar seus lucros",
    whyIdentify: "Identificamos condições de expansão de volatilidade — o ambiente onde o grande movimento de preço sustentado ocorre estatisticamente. Opere com o contexto que seus gráficos nunca foram projetados para te dar.",
    whyGymClosing: "A academia ainda está cheia. Você não precisa continuar no mesmo plano.",
    teamName: "A Equipe Signal Boss", teamSub: "Construído por traders, para traders",
    calcLabel: "PARA TODO TRADER SÉRIO",
    calcTitle: "Conheça Seus Números Antes de Operar",
    calcP1a: "Uma \"conta financiada de $50.000\" te dá aproximadamente ", calcP1b: "$2.500–$3.000 antes de violar o drawdown e perder a conta.", calcP1c: " Esse é seu capital real de trading.",
    calcP2: "A Calculadora de Risco cobre futuros e forex, desafio prop ou conta pessoal. Dimensionamento de posição, perdas até a ruína, limites diários — conheça seu pior caso antes que o mercado te mostre.",
    calcCta: "Experimente a Calculadora Grátis →",
    calcFeatures: [
      ["Dimensionamento de Posição", "Dimensione corretamente para seu capital real"],
      ["Trades até a Ruína",         "Conheça seu pior cenário antecipadamente"],
      ["Dias para a Meta",           "Projete quanto tempo leva para atingir seu objetivo"],
      ["Limites de Perda Diária",    "Nunca viole acidentalmente uma regra de perda diária"],
    ],
    exploreFuturesLabel: "EXPLORAR FUTUROS", exploreForexLabel: "EXPLORAR FOREX",
    futuresDesc: "ES, NQ, CL, GC, RTY, ZN e futuros de moedas /6E. Sinais de momentum multi-ciclo com confirmação VWAP nos contratos onde o posicionamento institucional é mais transparente.",
    futuresFeatures: ["ES · NQ · CL · GC · RTY", "ZN · /6E", "Calculadora de Risco incluída", "Stop Inteligente e Take Profit em cada sinal"],
    forexLabel: "TRADERS DE FOREX", forexHeadline: "Opere com a inteligência.",
    forexDesc: "EUR/USD. Sinais de momentum multi-ciclo derivados de futuros /6E — onde começa realmente a descoberta de preços institucional.",
    forexFeatures: ["EUR/USD · via futuros /6E", "Derivado de futuros /6E", "Calculadora de Risco incluída", "Stop Inteligente e Take Profit em cada sinal"],
    trialNote: "Garantia de devolução 30 dias · Cancele quando quiser",
    exploreFutures: "Explorar Futuros →", exploreForex: "Explorar Forex →",
    forexHeroTitle1: "Sem gráficos. Sem ruído.", forexHeroTitle2: "O Ponto de Inflexão.",
    forexHeroSub: "Futuros de moedas são onde as instituições mostram suas cartas. Signal Boss lê o momentum de ciclos em /6E, /6B e /6A — dando aos traders forex inteligência institucional em EUR/USD, GBP/USD e AUD/USD.",
    methodologyLabel: "A METODOLOGIA",
    methodologyTitle: "O mercado diz para onde o preço vai.",
    methodologyAccent: "Nós apenas ouvimos.",
    methodologyQuote: "Não apenas quando entrar. Onde parar. Quando realizar lucros. Tudo da mesma fonte — o que o mercado está implicando sobre seu próprio intervalo esperado.",
    methodology: [
      { icon:"◈", color:"long",  label:"Volatilidade Implícita", title:"A Previsão do Próprio Mercado", body:"VI não é ruído — é a estimativa de consenso do mercado sobre o movimento esperado. Quando a VI de curto prazo atinge um ponto de inflexão no fechamento, o mercado diz que algo mudou." },
      { icon:"◎", color:"accent", label:"VWAP",                  title:"Onde as Instituições Operam", body:"Toda mesa institucional compara sua execução com o VWAP. Preço acima do VWAP significa compradores no controle. Abaixo, vendedores. Simples. Poderoso. Comprovado." },
      { icon:"◉", color:"prop",   label:"Reversão à Média",       title:"A VI Sempre Volta", body:"A volatilidade implícita reverte à média. Sempre. Quando a VI atinge extremos, a questão não é se o preço vai reverter — é quando. Aí está a vantagem." },
    ],
    startTrial: "Começar", viewDemo: "Ver Demo →",
    backtestLabel: "RESULTADOS DO BACKTEST",
    backtestHeadline: "Como o sinal ES se saiu", backtestSub: "em 30 dias.",
    realNumbers: "Números reais.", realData: "Dados históricos reais.",
    backtestSubtitle: "Backtest walk-forward · barras de 5 min",
    chooseTrackLabel: "ESCOLHA SEU TRACK", chooseTrackTitle: "Futuros ou Forex — a mesma inteligência, a mesma vantagem.",
    methodologyTitle: "Como o Signal Boss Funciona",
    earlyUsersLabel: "PRIMEIROS USUÁRIOS", earlyUsersTitle: "O que os traders estão dizendo", earlyUsersSub: "Do nosso grupo beta — traders reais, feedback real.",
    knowYourFitLabel: "CONHEÇA SEU PERFIL", knowYourFitTitle: "Signal Boss é feito para alguns traders.", knowYourFitSub: "Não para todos.",
    fitForLabel: "É PARA VOCÊ SE...", fitNotLabel: "NÃO É PARA VOCÊ SE...",
    fitFor: ["Você opera futuros ativamente e quer sinais baseados em confluência, não ruído","Você está passando por um desafio de prop firm ou protegendo sua conta","Você entende que sinais são ferramentas, não garantias","Você quer saber por que um sinal foi ativado, não apenas que foi","Você se sente confortável tomando suas próprias decisões com melhor informação","Você valoriza interfaces limpas e simples"],
    fitNot: ["Você busca um sistema totalmente automatizado","Você espera sinais rentáveis sem sua própria gestão de risco","Você é iniciante sem conhecimento de mercados futuros","Você quer investimento passivo ou estratégias de renda variável","Você não está preparado para perder capital","Você precisa que outra pessoa seja responsável pelas suas decisões"],
    fitForForex: ["Você opera pares de forex principais e quer inteligência de sinais institucional","Você está passando por um desafio FTMO, FundedNext ou similar","Você entende que futuros de moedas são um indicador antecedente do forex spot","Você quer saber por que um sinal foi ativado — de quais futuros, com qual confluência","Você se sente confortável tomando suas próprias decisões","Você valoriza metodologia clara e transparente"],
    fitNotForex: ["Você busca um sistema totalmente automatizado","Você espera sinais rentáveis sem gestão de risco própria","Você é iniciante sem conhecimento de forex","Você quer copy-trading ou conta gerenciada","Você não está preparado para perder capital","Você precisa que outra pessoa seja responsável pelas suas decisões"],
    backtestDesc: "Registro completo operação por operação dentro do painel",
    backtestDescSub: "Cada entrada, stop, alvo, preço de saída, tempo de holding e resultado — com rastreamento em tempo real de novos sinais.",
    exampleSignal: "SINAL DE EXEMPLO", howItWorks: "A Vantagem",
    pricing: "Preços", pricingNote: "Garantia de devolução 30 dias.",
    getStarted: "Começar", signIn: "Entrar", signUp: "Cadastrar",
    signInTitle: "Entrar", signUpTitle: "Criar conta",
    signInSub: "Bem-vindo de volta", signUpSub: "Garantia de devolução 30 dias",
    fullName: "NOME COMPLETO", email: "EMAIL", password: "SENHA", plan: "PLANO",
    createAccount: "Criar Conta", noAccount: "Sem conta? ", haveAccount: "Já tem? ",
    engineActive: "MOTOR ATIVO", active: "ATIVO",
    liveSignals: "Sinais ao Vivo", configuration: "Configuração",
    account: "Conta", propCalc: "Calculadora de Risco", home: "← Início",
    direction: "DIREÇÃO", strength: "FORÇA",
    cyclesConfirming: "ciclos confirmando", vwapsConfirming: "VWAPs confirmando",
    entryPrice: "Preço de entrada", exit: "SAÍDA", dismiss: "dispensar",
    vwapAbove: "acima ✓", vwapBelow: "abaixo ✓", vwapFail: "não confirmado ⚠",
    resetsAt: "Reinicia", aboveZero: "acima do zero", belowZero: "abaixo do zero",
    activeSignals: "Sinais Ativos", long: "Compra", short: "Venda",
    strongSig: "Forte", threeCycles: "3/3 ciclos",
    timeframe: "Período", exitMode: "Modo de Saída",
    exitModeQ: "Um sinal é cancelado quando a narrativa da posição muda — as condições que o suportavam já não são válidas.",
    exitRule: "Saída Definitiva", exitRuleDesc: "Sinal cancelado quando o ciclo disparador cruza de volta pelo seu ponto de inflexão inicial.",
    cycleSettings: "Ciclos", cycleSub: "Seus três ciclos de momentum",
    vwapSettings: "Regra VWAP", vwapSettingsSub: "Quais VWAPs devem confirmar?",
    subscription: "Assinatura", alertDelivery: "Alertas",
    instruments: "Instrumentos", manage: "Gerenciar",
    configSub: "Ajuste sinais e ciclos", accountSub: "Gerencie sua assinatura",
    noSignals: "Nenhum sinal encontrado",
    propTitle: "Calculadora de Risco de Conta", propSub: "Gestão de risco para todo trader sério — desafio prop ou conta pessoal",
    features: {
      "01": { title: "Sinais de Inflexão IV", desc: "Sinais disparam quando a volatilidade implícita atinge um ponto de inflexão, confirmado pelo preço ponderado por volume." },
      "02": { title: "Filtro VWAP", desc: "O preço deve estar do lado correto do VWAP. Sem sinais contra tendência." },
      "03": { title: "Pontuação de Confluência", desc: "1 ciclo = entrada antecipada. 2 = moderado. 3 = força máxima." },
      "04": { title: "Cards Limpos", desc: "Sem gráficos. Alertas precisos quando as condições se alinham." },
    },
    futuresPlans: [
      { name: "Inicial",        price: 149, features: ["Sinais de Futuros — Índices, Tesouro, Energia e Metais", "Stop Inteligente e Take Profit em cada sinal", "Calculadora de Risco/Gestão de Capital", "Painel em tempo real", "Alertas email"] },
      { name: "Pro",            price: 249, features: ["Tudo no Inicial + Futuros de Moedas", "Alertas Telegram e Email em cada sinal", "1 Desvio Padrão de IV Intraday em cada sinal"] },
      { name: "Elite",          price: 449, features: ["Tudo no Pro", "1 e 2 Desvios Padrão de IV Intraday em cada sinal", "Sinais de Compressão/Expansão", "Análise de spreads de títulos do tesouro", "Fale conosco para mais detalhes →"] },
    ],
    forexPlans: [
      { name: "Pares Principais", price: 129, features: ["EUR/USD · GBP/USD · AUD/USD", "Derivado de futuros /6E · /6B · /6A", "3 ciclos", "Painel em tempo real", "Email", "Calculadora de Risco"] },
      { name: "Cobertura Total",  price: 249, features: ["Tudo nos Principais", "Stop Inteligente e Take Profit em cada sinal", "Telegram · Webhook"] },
    ],
  },
  fr: {
    tagline: "Moteur de Signaux Multi-Cycles · En Direct",
    heroTitle1: "Pas de graphiques. Pas de bruit.", heroTitle2: "Le Point d'Inflexion.",
    heroSub: "Juste ce qui compte — signaux d'inflexion IV basés sur la confluence multi-cycles et la confirmation VWAP.",
    engineTagline: "Moteur de Signaux Institutionnel · En Direct",
    chooserTitle1: "Pas de graphiques. Pas de bruit.", chooserTitle2: "Juste ce qui compte...", chooserTitle3: "Le Point d'Inflexion.",
    chooserSub: "La volatilité mène. Le prix suit. Signal Boss lit l'état dans lequel le marché se trouve réellement — pour que vos décisions soient fondées sur ce qui le fait vraiment bouger.",
    whyBuilt: "LA PLUPART DES SIGNAUX VOUS DISENT QUAND. PAS OÙ.",
    whyP1: "98% des traders perdent de l'argent. Presque 100% d'entre eux prennent des décisions avec des graphiques.",
    whyP2: "Réfléchissez-y une seconde. C'est comme rejoindre une salle de sport où 99% des membres suivent un programme qui les rend plus faibles. C'est logique ?",
    whyP3a: "Les graphiques vous disent ce qui s'est déjà passé. Signal Boss vous dit quand ", whyP3b: "les conditions sont réunies", whyP3c: " — et cette différence compte énormément.",
    whyP4: "L'entrée ne représente que 20% de l'équation. Un 20% essentiel, certes — mais seulement 20%. Les 80% restants sont la gestion du risque, le dimensionnement des positions et la prise de profits intelligente. La plupart des services vous donnent une entrée et s'en vont. Ce n'est pas un système. C'est une demi-phrase.",
    whyP5a: "Chaque alerte Signal Boss inclut trois choses : ", whyP5b: "Prix d'Entrée. Stop Intelligent. Prise de Profit Intelligente.", whyP5c: " Où entrer. Où couper les pertes. Où commencer à prendre des profits. C'est le trade complet.",
    whyP6: "Nous l'avons construit parce que les bonnes conditions, bien dimensionnées, avec un risque défini, c'est ce qu'est réellement le trading. Tout le reste est du bruit.",
    whyHeadline: "Si les graphiques fonctionnaient, 98% ne seraient pas en train de perdre.",
    whyGym: "Imaginez rejoindre une salle de sport et suivre un programme qui rend 98% de ses membres plus faibles et plus gros. Le trading basé sur les graphiques est ce 'programme' pour beaucoup de traders, et simplement dit, il les appauvrit financièrement. Signal Boss permet aux traders d'obtenir des signaux institutionnels valides, déclenchés par les conditions qui font vraiment bouger les marchés.",
    whyChartsShowa: "Les graphiques vous montrent ce qui s'est déjà passé.",
    whyChartsShowb: "Ils ne montrent pas les conditions.",
    whyProblemTitle: "Le problème n'est pas les graphiques. C'est les utiliser sans le bon contexte.",
    whyProblemBody: "Le problème est que les graphiques seuls ne vous disent pas si le marché est dans une condition où un mouvement important et soutenu est statistiquement probable.",
    whyIntuitive: "Intuitivement, vous le savez déjà.",
    whyVolatility: "Cette information ne vit pas dans un graphique. Elle vit dans la volatilité — spécifiquement dans la volatilité implicite dérivée des contrats à terme négociés en bourse, où le positionnement institutionnel s'exprime en premier et où les traders particuliers regardent rarement.",
    whyRhythm: ["L'action des prix vous dit ce que le marché a déjà fait.", "La structure du marché vous dit où il a été.", "La volatilité vous dit ce qu'il se prépare à faire maintenant."],
    whyForwardLooking: "Un seul d'entre eux est prospectif.",
    whyReplace: "Signal Boss ne remplace pas votre processus de graphiques. Il vous donne la couche qui lui manquait.",
    whyWhenFires: "Quand une alerte Signal Boss se déclenche, cela signifie que la volatilité a atteint un point d'inflexion — la condition sous laquelle un grand mouvement de prix se produit statistiquement. Si vous souhaitez encore consulter votre graphique avant d'exécuter, regardez. La plupart du temps, vous verrez le graphique confirmer ce que la volatilité vous avait déjà dit.",
    whyThreeComponents: "Chaque alerte Signal Boss fournit trois composantes :",
    whyThreeItems: ["Prix d'Entrée", "Stop Intelligent", "Prise de Profit Intelligente"],
    whyNotJust: "Pas seulement une entrée et un vœu. Un trade complet — construit à partir des mêmes données de volatilité que les institutions utilisent pour calculer le risque.",
    whyQuote: "\"Régime de volatilité correct + risque défini + dimensionnement approprié = trading professionnel. Obtenez le Signal, confirmez avec votre graphique.\"",
    whyAskSimple: "Posez-vous une question simple :",
    whyAskQuestion: "Si les graphiques seuls étaient la réponse… pourquoi ne générez-vous pas déjà une richesse régulière avec eux ?",
    whyDoesNotPredict: "Signal Boss ne prédit pas les chandeliers. Il vous permet de vous concentrer sur ce qui fait vraiment gagner de l'argent :",
    whyRisk: "gérer votre risque",
    whyProfits: "gérer vos profits",
    whyIdentify: "Nous identifions les conditions d'expansion de la volatilité — l'environnement où le grand mouvement de prix soutenu se produit statistiquement. Tradez avec le contexte que vos graphiques n'ont jamais été conçus pour vous donner.",
    whyGymClosing: "La salle de sport est toujours pleine. Vous n'êtes pas obligé de rester sur le même programme.",
    teamName: "L'Équipe Signal Boss", teamSub: "Construit par des traders, pour des traders",
    calcLabel: "POUR CHAQUE TRADER SÉRIEUX",
    calcTitle: "Connaissez Vos Chiffres Avant de Trader",
    calcP1a: "Un \"compte financé de 50 000 $\" vous donne environ ", calcP1b: "2 500–3 000 $ avant de dépasser le drawdown et de perdre le compte.", calcP1c: " C'est votre vrai capital de trading.",
    calcP2: "La Calculatrice de Risque couvre les futures et le forex, défi prop ou compte personnel. Dimensionnement des positions, pertes jusqu'à la ruine, limites journalières — connaissez votre pire cas avant que le marché vous le montre.",
    calcCta: "Essayez la Calculatrice Gratuitement →",
    calcFeatures: [
      ["Dimensionnement",        "Dimensionnez correctement pour votre capital réel"],
      ["Trades jusqu'à la Ruine","Connaissez votre pire scénario à l'avance"],
      ["Jours pour l'Objectif",  "Projetez combien de temps pour atteindre votre cible"],
      ["Limites de Perte Journalière", "Ne dépassez jamais accidentellement une règle journalière"],
    ],
    exploreFuturesLabel: "EXPLORER FUTURES", exploreForexLabel: "EXPLORER FOREX",
    futuresDesc: "ES, NQ, CL, GC, RTY, ZN et futures de devises /6E. Signaux de momentum multi-cycle avec confirmation VWAP sur les contrats où le positionnement institutionnel est le plus transparent.",
    futuresFeatures: ["ES · NQ · CL · GC · RTY", "ZN · /6E", "Calculateur de Risque inclus", "Stop Intelligent et Prise de Profit sur chaque signal"],
    forexLabel: "TRADERS FOREX", forexHeadline: "Tradez avec l'intelligence.",
    forexDesc: "EUR/USD. Signaux de momentum multi-cycle dérivés des futures /6E — là où la découverte des prix institutionnels commence vraiment.",
    forexFeatures: ["EUR/USD · via futures /6E", "Dérivé des futures /6E", "Calculateur de Risque inclus", "Stop Intelligent et Prise de Profit sur chaque signal"],
    trialNote: "Garantie de remboursement 30 jours · Annulez à tout moment",
    exploreFutures: "Explorer Futures →", exploreForex: "Explorer Forex →",
    forexHeroTitle1: "Pas de graphiques. Pas de bruit.", forexHeroTitle2: "Le Point d'Inflexion.",
    forexHeroSub: "Les futures sur devises, c'est là où les institutions montrent leur jeu. Signal Boss lit le momentum des cycles sur /6E, /6B et /6A — offrant aux traders forex une intelligence institutionnelle sur EUR/USD, GBP/USD et AUD/USD.",
    methodologyLabel: "LA MÉTHODOLOGIE",
    methodologyTitle: "Le marché vous dit où va le prix.",
    methodologyAccent: "Nous écoutons simplement.",
    methodologyQuote: "Pas seulement quand entrer. Où stopper. Quand prendre des profits. Tout depuis la même source — ce que le marché implique sur son propre range attendu.",
    methodology: [
      { icon:"◈", color:"long",  label:"Volatilité Implicite", title:"La Prévision du Marché Lui-Même", body:"La VI n'est pas du bruit — c'est l'estimation consensus du marché sur le mouvement attendu. Quand la VI court terme atteint un point d'inflexion à la clôture, le marché vous dit que quelque chose a changé." },
      { icon:"◎", color:"accent", label:"VWAP",                title:"Là Où Opèrent les Institutions", body:"Chaque desk institutionnel compare son exécution au VWAP. Prix au-dessus du VWAP signifie acheteurs aux commandes. En-dessous, vendeurs. Simple. Puissant. Éprouvé." },
      { icon:"◉", color:"prop",   label:"Retour à la Moyenne", title:"La VI Revient Toujours", body:"La volatilité implicite revient à la moyenne. Toujours. Quand la VI atteint des extrêmes, la question n'est pas si le prix va revenir — c'est quand. C'est là que réside l'avantage." },
    ],
    startTrial: "Commencer", viewDemo: "Voir la Démo →",
    backtestLabel: "RÉSULTATS DU BACKTEST",
    backtestHeadline: "Performance du signal ES", backtestSub: "sur 30 jours.",
    realNumbers: "Chiffres réels.", realData: "Données historiques réelles.",
    backtestSubtitle: "Backtest walk-forward · barres de 5 min",
    chooseTrackLabel: "CHOISISSEZ VOTRE TRACK", chooseTrackTitle: "Futures ou Forex — la même intelligence, le même avantage.",
    methodologyTitle: "Comment Fonctionne Signal Boss",
    earlyUsersLabel: "PREMIERS UTILISATEURS", earlyUsersTitle: "Ce que disent les traders", earlyUsersSub: "De notre groupe bêta — de vrais traders, de vrais retours.",
    knowYourFitLabel: "VOTRE PROFIL", knowYourFitTitle: "Signal Boss est conçu pour certains traders.", knowYourFitSub: "Pas pour tous.",
    fitForLabel: "C'EST POUR VOUS SI...", fitNotLabel: "CE N'EST PAS POUR VOUS SI...",
    fitFor: ["Vous tradez les futures activement et voulez des signaux basés sur la confluence","Vous passez un défi prop firm ou protégez votre compte","Vous comprenez que les signaux sont des outils, pas des garanties","Vous voulez savoir pourquoi un signal s'est déclenché, pas seulement qu'il l'a fait","Vous êtes à l'aise pour prendre vos propres décisions avec de meilleures informations","Vous préférez les interfaces épurées aux tableaux de bord surchargés"],
    fitNot: ["Vous cherchez un système entièrement automatisé","Vous attendez des signaux rentables sans votre propre gestion du risque","Vous êtes un débutant sans connaissance des marchés à terme","Vous voulez un investissement passif ou des stratégies actions uniquement","Vous n'êtes pas prêt à perdre du capital","Vous avez besoin que quelqu'un d'autre soit responsable de vos décisions"],
    fitForForex: ["Vous tradez les paires forex majeures et voulez une intelligence de signaux institutionnelle","Vous passez un défi FTMO, FundedNext ou similaire","Vous comprenez que les futures de devises sont un indicateur avancé du forex spot","Vous voulez savoir pourquoi un signal s'est déclenché","Vous êtes à l'aise pour prendre vos propres décisions","Vous préférez une méthodologie claire à des flèches sur un graphique"],
    fitNotForex: ["Vous cherchez un système entièrement automatisé","Vous attendez des signaux rentables sans gestion du risque","Vous êtes débutant sans connaissance du forex","Vous voulez du copy-trading ou un compte géré","Vous n'êtes pas prêt à perdre du capital","Vous avez besoin que quelqu'un d'autre soit responsable de vos décisions"],
    backtestDesc: "Journal complet trade par trade dans le tableau de bord",
    backtestDescSub: "Chaque entrée, stop, objectif, prix de sortie, durée et résultat — avec suivi en temps réel des nouveaux signaux.",
    exampleSignal: "SIGNAL EXEMPLE", howItWorks: "L'Avantage",
    pricing: "Tarifs", pricingNote: "Garantie de remboursement 30 jours.",
    getStarted: "Commencer", signIn: "Connexion", signUp: "S'inscrire",
    signInTitle: "Connexion", signUpTitle: "Créer un compte",
    signInSub: "Bienvenue sur Signal Boss", signUpSub: "Garantie de remboursement 30 jours",
    fullName: "NOM COMPLET", email: "EMAIL", password: "MOT DE PASSE", plan: "PLAN",
    createAccount: "Créer un Compte", noAccount: "Pas de compte ? ", haveAccount: "Déjà un compte ? ",
    engineActive: "MOTEUR ACTIF", active: "ACTIF",
    liveSignals: "Signaux en Direct", configuration: "Configuration",
    account: "Compte", propCalc: "Calculateur de Risque", home: "← Accueil",
    direction: "DIRECTION", strength: "FORCE",
    cyclesConfirming: "cycles confirmés", vwapsConfirming: "VWAPs confirmés",
    entryPrice: "Prix d'entrée", exit: "SORTIE", dismiss: "ignorer",
    vwapAbove: "au-dessus ✓", vwapBelow: "en-dessous ✓", vwapFail: "non confirmé ⚠",
    resetsAt: "Réinitialise à", aboveZero: "au-dessus de zéro", belowZero: "en-dessous de zéro",
    activeSignals: "Signaux Actifs", long: "Achat", short: "Vente",
    strongSig: "Fort", threeCycles: "3/3 cycles",
    timeframe: "Unité de Temps", exitMode: "Mode de Sortie",
    exitModeQ: "Un signal est annulé quand la narrative de la position change — les conditions qui la soutenaient ne sont plus valides.",
    exitRule: "Sortie Définitive", exitRuleDesc: "Signal annulé quand le cycle déclencheur repasse par son point d'inflexion initial.",
    cycleSettings: "Paramètres des Cycles", cycleSub: "Vos trois cycles de momentum",
    vwapSettings: "Règle de Confirmation VWAP", vwapSettingsSub: "Quels VWAPs doivent confirmer ?",
    subscription: "Abonnement", alertDelivery: "Livraison des Alertes",
    instruments: "Instruments", manage: "Gérer",
    configSub: "Ajustez les signaux et les cycles", accountSub: "Gérez votre abonnement",
    noSignals: "Aucun signal ne correspond à votre filtre",
    propTitle: "Calculateur de Risque de Compte", propSub: "Dimensionnement des positions et gestion du risque pour tout trader sérieux — défi prop ou compte personnel",
    features: {
      "01": { title: "Signaux d'Inflexion IV", desc: "Les signaux se déclenchent quand la volatilité implicite atteint un point d'inflexion, confirmé par le prix pondéré par le volume. Aucune ambiguïté." },
      "02": { title: "Filtre VWAP", desc: "Le prix doit être confirmé par le prix pondéré par le volume, vous maintenant dans les trades gagnants plus longtemps." },
      "03": { title: "Score de Confluence", desc: "1 cycle = entrée précoce. 2 cycles = conviction modérée. 3 cycles = force maximale." },
      "04": { title: "Cartes de Signal Claires", desc: "Pas de graphiques. Pas de désordre. Alertes précises dès que les conditions sont réunies." },
    },
    futuresPlans: [
      { name: "Starter",          price: 149, features: ["Signaux Futures — Indices, Obligations, Énergie & Métaux", "Stop Intelligent et Prise de Profit sur chaque signal", "Calculateur de Risque/Gestion du Capital", "Tableau de bord temps réel", "Alertes email"] },
      { name: "Pro",              price: 249, features: ["Tout Starter + Futures de Devises", "Alertes Telegram & Email sur chaque signal", "1 Écart-type de la IV Intraday sur chaque signal"] },
      { name: "Elite",            price: 449, features: ["Tout Pro inclus", "1 & 2 Écarts-types de la IV Intraday sur chaque signal", "Signaux Compression/Expansion", "Analyse des spreads obligataires", "Contactez-nous pour plus de détails →"] },
    ],
    forexPlans: [
      { name: "Paires Majeures",  price: 129, features: ["EUR/USD · GBP/USD · AUD/USD", "Dérivé des futures /6E · /6B · /6A", "3 cycles", "Tableau de bord temps réel", "Email", "Calculateur de Risque"] },
      { name: "Couverture Totale",price: 249, features: ["Tout Paires Majeures inclus", "Stop Intelligent et Prise de Profit sur chaque signal", "Telegram · Webhook"] },
    ],
  },
};

const C = {
  bg: "#090e18", surface: "#0e1929", surfaceUp: "#0f2019", surfaceDn: "#200f14",
  silver: "#131e2e", silverUp: "#192840", silverBorder: "#274060",
  border: "#1a2e48", borderHi: "#243c5e",
  long: "#00e5a0", longDim: "#00e5a012", longGlow: "#00e5a030",
  short: "#ff4560", shortDim: "#ff456012", shortGlow: "#ff456030",
  neutral: "#4a5568", accent: "#c8a96e", accentDim: "#c8a96e18",
  text: "#eaeeee", textMid: "#b8cccc", textDim: "#6a8888",
  weak: "#c8a96e", mod: "#e8c97e", strong: "#ffffff",
  warn: "#f59e0b", warnDim: "#f59e0b15",
  prop: "#a78bfa", propDim: "#a78bfa15",
};

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; font-size: 15px; }
  .mono { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
  ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes glow-long { 0%,100%{box-shadow:0 0 20px ${C.longGlow}} 50%{box-shadow:0 0 40px ${C.longGlow},0 0 80px ${C.longDim}} }
  @keyframes glow-short { 0%,100%{box-shadow:0 0 20px ${C.shortGlow}} 50%{box-shadow:0 0 40px ${C.shortGlow},0 0 80px ${C.shortDim}} }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  .card-long { animation: glow-long 3s ease-in-out infinite; }
  .card-short { animation: glow-short 3s ease-in-out infinite; }
  .signal-new { animation: fadeUp 0.5s ease forwards; }
  input[type=range] { -webkit-appearance:none; width:100%; height:2px; background:${C.border}; border-radius:1px; outline:none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:12px; height:12px; border-radius:50%; background:${C.accent}; cursor:pointer; }
  input[type=number], input[type=text], input[type=email], input[type=password] { background:${C.bg}; color:${C.text}; border:1px solid ${C.border}; border-radius:6px; padding:9px 12px; font-family:'IBM Plex Mono','Courier New',monospace; font-size:14px; outline:none; width:100%; }
  input[type=number]:focus, input[type=text]:focus, input[type=email]:focus, input[type=password]:focus { border-color:${C.accent}44; }
  select { background:${C.surface}; color:${C.text}; border:1px solid ${C.border}; border-radius:6px; padding:8px 12px; font-family:'IBM Plex Mono','Courier New',monospace; font-size:14px; cursor:pointer; outline:none; width:100%; }
  .tab-btn { background:transparent; border:none; cursor:pointer; font-family:'DM Sans','Segoe UI',sans-serif; transition:all 0.15s; }
  .tab-btn:hover { opacity:0.8; }
  .nav-item { padding:10px 14px; border-radius:6px; cursor:pointer; font-size:15px; font-weight:500; transition:all 0.15s; display:flex; align-items:center; gap:10px; border-left:2px solid transparent; }
  .nav-item:hover { background:${C.border}; }
  .nav-item.active { background:${C.accentDim}; border-left-color:${C.accent}; color:${C.accent}; }
`;

// ── SB Monogram Logo ──────────────────────────────────────────────────────────
// sb-icon.png is 453×376 — just the hexagon on dark bg. We display it square
// and use mix-blend-mode:screen on black so only the bright gold/green shows.
function SBMonogram({ size = 32 }) {
  return (
    <div style={{ width:size, height:size, overflow:"hidden", flexShrink:0, background:"#000", borderRadius:4 }}>
      <img
        src="/sb-icon.png"
        alt="SB"
        style={{
          width: `${size}px`,
          height: `${Math.round(size * 376 / 453)}px`,
          marginTop: `${Math.round(size * 0.04)}px`,
          display: "block",
          mixBlendMode: "lighten",
        }}
      />
    </div>
  );
}

// ── Live signal feed ──────────────────────────────────────────────────────────
// After creating your GitHub Gist, paste the raw URL here:
// https://gist.githubusercontent.com/YOUR_USERNAME/YOUR_GIST_ID/raw/signals.json
const SIGNALS_URL     = 'https://gist.githubusercontent.com/valueisrelative-dotcom/336ce62861f67be83d1fdbd34576f4c5/raw/signals.json';
const BACKTEST_URL    = 'https://gist.githubusercontent.com/valueisrelative-dotcom/336ce62861f67be83d1fdbd34576f4c5/raw/backtest.json';
const CYCLE_STATE_URL = 'https://gist.githubusercontent.com/valueisrelative-dotcom/336ce62861f67be83d1fdbd34576f4c5/raw/cycle_state.json';
const CHART_DATA_URL  = 'https://gist.githubusercontent.com/valueisrelative-dotcom/336ce62861f67be83d1fdbd34576f4c5/raw/chart_data.json';

const TICKER_ITEMS = [
  { sym: "ES",  price: "5,247.25",  chg: "+8.50",   up: true  },
  { sym: "NQ",  price: "18,420.50", chg: "+42.25",  up: true  },
  { sym: "CL",  price: "78.42",     chg: "-0.31",   up: false },
  { sym: "GC",  price: "2,318.40",  chg: "+12.80",  up: true  },
  { sym: "RTY", price: "2,048.10",  chg: "-3.20",   up: false },
  { sym: "ZB",  price: "115.50",    chg: "+0.18",   up: true  },
  { sym: "6E",  price: "1.0842",    chg: "+0.0012", up: true  },
  { sym: "ZN",  price: "108.24",    chg: "-0.06",   up: false },
];

const GIST_URL = "https://gist.githubusercontent.com/raw/336ce62861f67be83d1fdbd34576f4c5/signals.json";
const MICROS   = { ES:"MES", NQ:"MNQ", YM:"MYM", RTY:"M2K", CL:"MCL", GC:"MGC" };

const INST_TICK = {
  ES:  { size: 0.25,       value: 12.50   },
  NQ:  { size: 0.25,       value:  5.00   },
  CL:  { size: 0.01,       value: 10.00   },
  GC:  { size: 0.10,       value: 10.00   },
  RTY: { size: 0.10,       value:  5.00   },
  ZB:  { size: 0.03125,    value: 31.25   },
  ZN:  { size: 0.015625,   value: 15.625  },  // 10-Year T-Note
  ZF:  { size: 0.0078125,  value:  7.8125 },  // 5-Year T-Note
  "6E": { size: 0.00005,   value:  6.25   },  // EUR/USD futures
};

const SESSIONS = ["Asian","London","Bond Open","NY Open","NY Midday","Overnight"];
function getSessionLabel() {
  const h = new Date().getHours(), m = new Date().getMinutes(), t = h*60+m;
  if (t >= 17*60) return "Overnight";
  if (t >= 16*60) return "NY Close";
  if (t >= 12*60) return "NY Midday";
  if (t >= 9*60+30) return "NY Open";
  if (t >= 8*60+20) return "Bond Open";
  if (t >= 3*60)  return "London";
  return "Asian";
}

function LiveSignalCard({ signal }) {
  const isLong   = signal.direction === "LONG";
  const dirColor = isLong ? C.long : C.short;
  const sym      = signal.instrument;
  const micro    = MICROS[sym];
  const symLine  = micro ? `${sym} / ${micro}` : sym;
  const microStop = micro ? Math.round(signal.risk.stopUsd / 10) : null;
  const microTp   = micro ? Math.round(signal.risk.firstTpUsd / 10) : null;

  const fmt = v => {
    const n = Number(v);
    if (n >= 1000) return n.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 });
    return n.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:4 });
  };

  const dateStr = signal.date
    ? new Date(signal.date + "T12:00:00").toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })
    : "";

  return (
    <div style={{ background:isLong?C.surfaceUp:C.surfaceDn, border:`1px solid ${dirColor}33`, borderRadius:12, padding:20, position:"relative", overflow:"hidden", fontFamily:"'IBM Plex Mono','Courier New',monospace" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:dirColor }} />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <LiveDot color={dirColor} size={7} />
          <span style={{ fontSize:17, fontWeight:700, color:dirColor }}>{signal.direction}</span>
          <span style={{ fontSize:14, fontWeight:700, color:C.text }}>· {symLine}</span>
        </div>
        <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, background:dirColor+"22", color:dirColor, letterSpacing:"0.08em" }}>ACTIVE</span>
      </div>
      <div style={{ height:1, background:C.border, marginBottom:12 }} />
      <div style={{ marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0" }}>
          <span style={{ fontSize:12, color:"#60a5fa" }}>🔵 ENTRY</span>
          <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{fmt(signal.price)}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0" }}>
          <span style={{ fontSize:12, color:"#f87171" }}>🔴 STOP</span>
          <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{fmt(signal.risk.stopPrice)}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"5px 0" }}>
          <span style={{ fontSize:12, color:"#4ade80" }}>🟢 1ST TARGET</span>
          <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{fmt(signal.risk.firstTpPrice)} <span style={{ fontSize:10, color:C.textDim, fontWeight:400 }}>(optional exit)</span></span>
        </div>
        <div style={{ fontSize:10, color:C.textDim, marginTop:2, paddingLeft:4 }}>Exit: End of hour at market</div>
      </div>
      <div style={{ height:1, background:C.border, marginBottom:12 }} />
      <div style={{ marginBottom:10 }}>
        <div style={{ fontSize:10, color:C.textDim, marginBottom:4 }}>Risk per contract</div>
        <div style={{ fontSize:12 }}>
          &nbsp;&nbsp;<span style={{ color:C.text }}>{sym}:</span> <span style={{ color:C.short, fontWeight:600 }}>${Math.round(signal.risk.stopUsd).toLocaleString()}</span>
          {micro && <span>  |  <span style={{ color:C.text }}>{micro}:</span> <span style={{ color:C.short, fontWeight:600 }}>${microStop}</span></span>}
        </div>
        <div style={{ fontSize:10, color:C.textDim, marginTop:8, marginBottom:4 }}>1st Target</div>
        <div style={{ fontSize:12 }}>
          &nbsp;&nbsp;<span style={{ color:C.text }}>{sym}:</span> <span style={{ color:C.long, fontWeight:600 }}>${Math.round(signal.risk.firstTpUsd).toLocaleString()}</span>
          {micro && <span>  |  <span style={{ color:C.text }}>{micro}:</span> <span style={{ color:C.long, fontWeight:600 }}>${microTp}</span></span>}
        </div>
      </div>
      <div style={{ height:1, background:C.border, marginBottom:10 }} />
      <div style={{ fontSize:11, color:C.textMid }}>⏱ {dateStr}&nbsp;&nbsp;{signal.time} ET</div>
    </div>
  );
}


function LiveDot({ color, size = 7 }) {
  return (
    <span style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", width:size+6, height:size+6 }}>
      <span style={{ position:"absolute", width:size+6, height:size+6, borderRadius:"50%", background:color, opacity:0.2, animation:"pulse 2s infinite" }} />
      <span style={{ width:size, height:size, borderRadius:"50%", background:color, display:"block", flexShrink:0 }} />
    </span>
  );
}


// ---------------------------------------------------------------------------
// Admin-only: Oscillator Chart (Cycle A / B / C)
// ---------------------------------------------------------------------------

function OscillatorPanel({ bars, pnlKey, resetKey, label, height=160 }) {
  if (!bars || bars.length === 0) return (
    <div style={{ height, background:"#050a0f", borderRadius:8, marginBottom:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ color:"#2a4a5a", fontFamily:"monospace", fontSize:11 }}>Waiting for data…</span>
    </div>
  );
  const vals   = bars.map(b => b[pnlKey] || 0);
  const maxAbs = Math.max(...vals.map(Math.abs), 1);
  const n      = vals.length;
  const bw     = 100 / n;
  const mid    = height / 2;
  const curr   = vals[n - 1];
  const isPos  = curr >= 0;

  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <span style={{ fontSize:10, color:"#4a6a7a", fontFamily:"monospace", letterSpacing:"0.1em" }}>{label}</span>
        <span style={{ fontSize:12, fontFamily:"monospace", fontWeight:700, color: isPos?"#22c55e":"#ef4444" }}>
          {isPos?"+":""}${curr.toLocaleString()}
        </span>
      </div>
      <svg width="100%" height={height} style={{ display:"block", background:"#050a0f", borderRadius:8 }}>
        {/* Zero line */}
        <line x1="0" y1={mid} x2="100%" y2={mid} stroke="#1a3a4a" strokeWidth="1" strokeDasharray="3 3" />
        {/* Cycle reset verticals */}
        {bars.map((b, i) => b[resetKey] ? (
          <line key={`r${i}`} x1={`${i*bw}%`} y1="0" x2={`${i*bw}%`} y2={height}
            stroke="#263444" strokeWidth="1" strokeDasharray="4 3" />
        ) : null)}
        {/* P&L bars */}
        {vals.map((v, i) => {
          const pos  = v >= 0;
          const barH = Math.max(1, Math.abs(v) / maxAbs * (mid - 2));
          const y    = pos ? mid - barH : mid;
          return (
            <rect key={i} x={`${i*bw}%`} y={y} width={`${bw*0.88}%`} height={barH}
              fill={pos ? "#22c55e" : "#ef4444"} opacity={0.78} />
          );
        })}
      </svg>
    </div>
  );
}

function useChartData() {
  const [chartData, setChart] = useState(null);
  const [updated, setUpdated] = useState(null);
  useEffect(() => {
    const load = () => {
      fetch(`${CHART_DATA_URL}?t=${Date.now()}`)
        .then(r => r.json())
        .then(d => { setChart(d.instruments || {}); setUpdated(d.updated || null); })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);
  return { chartData, updated };
}

const INST_LIST = ['ES','NQ','CL','GC','RTY','ZN','6E'];

// ── Full-page multi-chart view ────────────────────────────────────────────────
function ChartFullPage({ onClose }) {
  const { chartData, updated } = useChartData();
  const [selected, setSelected] = useState(['ES','NQ','GC','RTY']);
  const [cols, setCols] = useState(2);

  const toggle = (inst) => {
    setSelected(prev => {
      if (prev.includes(inst)) return prev.length > 1 ? prev.filter(i => i !== inst) : prev;
      return [...prev, inst];
    });
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:C.bg, zIndex:9999,
      overflowY:"auto", padding:24,
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em" }}>
            CYCLE OSCILLATOR — FULL VIEW
            {updated && <span style={{ color:C.textDim }}> · updated {updated}</span>}
          </div>
          <div style={{ fontSize:11, color:C.textDim, fontFamily:"monospace", marginTop:4 }}>
            Select up to 4 instruments · PULSE · WAVE · FORCE
          </div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {/* Layout toggle */}
          {[1,2,3,4].map(n => (
            <button key={n} onClick={() => setCols(n)} style={{
              padding:"5px 12px", borderRadius:6, cursor:"pointer",
              fontFamily:"monospace", fontSize:11, fontWeight:cols===n?700:400,
              background: cols===n ? C.accent : C.surface,
              color:      cols===n ? "#000"    : C.textMid,
              border:    `1px solid ${cols===n ? C.accent : C.border}`,
            }}>{n} col{n>1?"s":""}</button>
          ))}
          <button onClick={onClose} style={{
            padding:"6px 16px", borderRadius:6, cursor:"pointer",
            background:C.surface, color:C.textMid, border:`1px solid ${C.border}`,
            fontFamily:"monospace", fontSize:12,
          }}>✕ Close</button>
        </div>
      </div>

      {/* Instrument selector */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
        {INST_LIST.map(inst => {
          const on = selected.includes(inst);
          return (
            <button key={inst} onClick={() => toggle(inst)} style={{
              padding:"5px 14px", borderRadius:6, cursor:"pointer",
              fontFamily:"monospace", fontSize:11, fontWeight:on?700:400,
              background: on ? C.accent : C.surface,
              color:      on ? "#000"    : C.textMid,
              border:    `1px solid ${on ? C.accent : C.border}`,
              opacity: 1,
            }}>{inst}</button>
          );
        })}
        <span style={{ fontSize:11, color:C.textDim, fontFamily:"monospace", alignSelf:"center", marginLeft:8 }}>
          {selected.length} selected
        </span>
      </div>

      {/* Chart grid */}
      <div style={{
        display:"grid",
        gridTemplateColumns:`repeat(${cols}, 1fr)`,
        gap:20,
      }}>
        {selected.map(inst => {
          const bars = chartData?.[inst] || [];
          return (
            <div key={inst} style={{
              background:C.surface, border:`1px solid #3a4a5a`,
              borderRadius:12, padding:16,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:14, color:C.accent }}>{inst}</span>
                <span style={{ fontFamily:"monospace", fontSize:10, color:C.textDim }}>
                  {bars.length > 0 ? `${bars[0].t} → ${bars[bars.length-1].t}` : "waiting…"}
                </span>
              </div>
              <OscillatorPanel bars={bars} pnlKey="a" resetKey="r1" label="PULSE — 1-Day"  height={120} />
              <OscillatorPanel bars={bars} pnlKey="b" resetKey="r3" label="WAVE — 3-Day"   height={120} />
              <OscillatorPanel bars={bars} pnlKey="c" resetKey="r6" label="FORCE — 6-Day"  height={120} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminCharts() {
  const { chartData, updated } = useChartData();
  const [sel, setSel]     = useState('ES');
  const [fullPage, setFullPage] = useState(false);

  const bars = chartData?.[sel] || [];

  return (
    <>
      {fullPage && <ChartFullPage onClose={() => setFullPage(false)} />}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em" }}>
            CYCLE OSCILLATOR {updated && <span style={{ color:C.textDim }}>· updated {updated}</span>}
          </div>
          <button onClick={() => setFullPage(true)} style={{
            padding:"5px 14px", borderRadius:6, cursor:"pointer",
            background:C.accent, color:"#000", border:"none",
            fontFamily:"monospace", fontSize:11, fontWeight:700,
          }}>⛶ Full View</button>
        </div>

        {/* Instrument selector */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          {INST_LIST.map(inst => (
            <button key={inst} onClick={() => setSel(inst)} style={{
              padding:"5px 13px", borderRadius:6, cursor:"pointer", fontFamily:"monospace", fontSize:11, fontWeight:sel===inst?700:400,
              background: sel===inst ? C.accent : C.surface,
              color:      sel===inst ? "#000"    : C.textMid,
              border:    `1px solid ${sel===inst ? C.accent : C.border}`,
            }}>{inst}</button>
          ))}
        </div>

        <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:10 }}>
          {bars.length} bars · {bars.length > 0 ? `${bars[0].t} → ${bars[bars.length-1].t}` : "—"}
        </div>

        <OscillatorPanel bars={bars} pnlKey="a" resetKey="r1" label="PULSE — 1-Day"  height={160} />
        <OscillatorPanel bars={bars} pnlKey="b" resetKey="r3" label="WAVE — 3-Day"   height={160} />
        <OscillatorPanel bars={bars} pnlKey="c" resetKey="r6" label="FORCE — 6-Day"  height={160} />
      </div>
    </>
  );
}

function StatTile({ label, value, color, sub }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"18px 20px" }}>
      <div style={{ fontSize:10, color:C.textMid, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8, fontFamily:"monospace" }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:700, color:color||C.text, fontFamily:"monospace" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:C.textDim, marginTop:4, fontFamily:"monospace" }}>{sub}</div>}
    </div>
  );
}

function PriceTicker() {
  const [prices, setPrices] = useState({});
  const [prev,   setPrev]   = useState({});

  useEffect(() => {
    const load = () => {
      fetch(CYCLE_STATE_URL + '?t=' + Date.now())
        .then(r => r.json())
        .then(d => {
          const insts = d.instruments || {};
          setPrev(p => ({ ...p, ...prices }));
          const next = {};
          Object.entries(insts).forEach(([sym, v]) => {
            if (v.price != null) next[sym] = v.price;
          });
          if (Object.keys(next).length > 0) setPrices(next);
        })
        .catch(() => {});
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  const SYMS = ['ES','NQ','CL','GC','RTY','ZN','6E'];
  const fmt = (sym, price) => {
    if (price == null) return TICKER_ITEMS.find(t => t.sym === sym)?.price ?? '—';
    if (['6E'].includes(sym)) return price.toFixed(4);
    if (['ZN'].includes(sym))           return price.toFixed(5);
    if (['CL'].includes(sym))           return price.toFixed(2);
    if (['GC'].includes(sym))           return price.toFixed(1);
    return price.toLocaleString(undefined, { minimumFractionDigits:2, maximumFractionDigits:2 });
  };

  const items = [...SYMS, ...SYMS].map((sym, i) => {
    const cur = prices[sym];
    const prv = prev[sym];
    const up  = cur != null && prv != null ? cur >= prv : true;
    const chg = cur != null && prv != null ? (cur - prv) : null;
    const chgStr = chg != null ? (chg >= 0 ? '+' : '') + chg.toFixed(['6E'].includes(sym) ? 4 : 2) : '';
    return { sym, price: fmt(sym, cur), up, chgStr, i };
  });

  return (
    <div style={{ overflow:"hidden", background:C.surface, borderBottom:`1px solid ${C.border}`, height:32, display:"flex", alignItems:"center", position:"relative" }}>
      <div style={{ display:"flex", gap:0, animation:"ticker 30s linear infinite", whiteSpace:"nowrap" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"0 28px", borderRight:`1px solid ${C.border}` }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.text, fontFamily:"monospace" }}>{item.sym}</span>
            <span style={{ fontSize:11, color:C.textMid, fontFamily:"monospace" }}>{item.price}</span>
            {item.chgStr && <span style={{ fontSize:11, color:item.up?C.long:C.short, fontFamily:"monospace" }}>{item.chgStr}</span>}
          </div>
        ))}
      </div>
      <div style={{ position:"absolute", right:0, top:0, bottom:0, display:"flex", alignItems:"center", paddingRight:10, paddingLeft:20, background:`linear-gradient(to right, transparent, ${C.surface} 30%)`, pointerEvents:"none" }}>
        <span style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>Delayed Quotes · Check signal card for current price</span>
      </div>
    </div>
  );
}

function SignalCounter({ count }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", background:C.accentDim, border:`1px solid ${C.accent}33`, borderRadius:20 }}>
      <LiveDot color={C.accent} size={5} />
      <span style={{ fontSize:12, color:C.accent, fontFamily:"monospace", fontWeight:600 }}>{count} signals today</span>
    </div>
  );
}

// Defined outside PropCalc so component identity is stable across re-renders
const CalcRow = ({ label, value, onChange, prefix, suffix, hint, mode = "decimal" }) => (
  <div style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontSize:12, color:C.textMid }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {prefix && <span style={{ fontSize:12, color:C.textDim, fontFamily:"monospace" }}>{prefix}</span>}
        <input
          type="text"
          inputMode={mode}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width:90, textAlign:"right", padding:"5px 8px",
            background:C.bg, border:`1px solid ${C.border}`, borderRadius:6,
            color:C.text, fontFamily:"monospace", fontSize:13,
            outline:"none", WebkitAppearance:"none", MozAppearance:"textfield" }}
        />
        {suffix && <span style={{ fontSize:12, color:C.textDim, fontFamily:"monospace" }}>{suffix}</span>}
      </div>
    </div>
    {hint && <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginTop:4 }}>{hint}</div>}
  </div>
);

const CalcResultRow = ({ label, value, color, big }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
    <span style={{ fontSize:12, color:C.textMid }}>{label}</span>
    <span style={{ fontSize:big?18:14, fontWeight:big?700:600, color:color||C.text, fontFamily:"monospace" }}>{value}</span>
  </div>
);

function PropCalc({ t }) {
  // All state stored as strings — prevents controlled-input reset bug
  const [qty, setQty]               = useState("1");
  const [tickVal, setTickVal]       = useState("12.50");
  const [stopTicks, setStop]        = useState("8");
  const [tgtTicks, setTgt]          = useState("20");
  const [wins, setWins]             = useState("5");
  const [losses, setLosses]         = useState("7");
  const [commissions, setComm]      = useState("0");
  const [profitGoal, setProfitGoal] = useState("2500");
  const [currentBal, setCurrentBal] = useState("300");
  const [maxDD, setMaxDD]           = useState("2000");
  const [dailyLimit, setDailyLimit] = useState("1000");
  const [dailyTrades, setDailyTrades] = useState("3");

  // Parse all values once
  const q  = parseFloat(qty)        || 0;
  const tv = parseFloat(tickVal)    || 0;
  const st = parseFloat(stopTicks)  || 0;
  const tt = parseFloat(tgtTicks)   || 0;
  const w  = parseFloat(wins)       || 0;
  const l  = parseFloat(losses)     || 0;
  const pg = parseFloat(profitGoal) || 0;
  const cb = parseFloat(currentBal) || 0;
  const md = parseFloat(maxDD)      || 0;
  const dl = parseFloat(dailyLimit) || 0;
  const comm = parseFloat(commissions) || 0;
  const dt = parseFloat(dailyTrades)   || 1;

  const totalTrades    = w + l;
  const wr             = totalTrades > 0 ? w / totalTrades : 0;
  const winRatePct     = totalTrades > 0 ? ((w / totalTrades) * 100).toFixed(1) : "0.0";
  const lossPerTrade   = q * st * tv;
  const profitPerTrade = q * tt * tv;
  const rr             = st > 0 ? tt / st : 0;
  const grossWins      = w * profitPerTrade;
  const grossLosses    = l * lossPerTrade;
  const totalComm      = totalTrades * comm;
  const netPnL         = grossWins - grossLosses - totalComm;
  const expectedVal    = (wr * profitPerTrade) - ((1 - wr) * lossPerTrade) - comm;
  const neededToPass   = pg - cb;
  const dailyAvg       = expectedVal * dt;
  const tradesNeeded   = expectedVal > 0 ? Math.ceil(neededToPass / expectedVal) : "∞";
  const daysToPass     = dailyAvg > 0 ? (neededToPass / dailyAvg).toFixed(1) : "∞";
  const maxTradesToDD  = lossPerTrade > 0 ? Math.floor(md / lossPerTrade) : "∞";
  const maxTradesToDaily = lossPerTrade > 0 ? Math.floor(dl / lossPerTrade) : "∞";

  const dangerColor = (val, threshold) => val <= threshold * 1.5 ? C.short : val <= threshold * 2.5 ? C.warn : C.long;

  return (
    <div style={{ padding:24, maxWidth:800 }}>
      <h2 style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>{t.propTitle}</h2>
      <p style={{ color:C.textMid, fontSize:13, marginBottom:24 }}>{t.propSub}</p>
      <div style={{ background:C.propDim, border:`1px solid ${C.prop}33`, borderRadius:10, padding:"12px 16px", marginBottom:24, display:"flex", gap:10, alignItems:"flex-start" }}>
        <span style={{ fontSize:16 }}>⚠️</span>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:C.prop, marginBottom:4 }}>Account Reality Check</div>
          <div style={{ fontSize:12, color:C.textMid, lineHeight:1.6 }}>
            A "$50,000 funded account" gives you roughly <strong style={{ color:C.text }}>$2,500–$3,000 before you breach drawdown and lose the account.</strong> That's your true trading capital — whether it's a prop challenge or your own money. Size accordingly.
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* Row 1 Left — Trade Parameters */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Trade Parameters</div>
          <CalcRow label="Contracts / Qty"     value={qty}         onChange={setQty}         mode="numeric" />
          <CalcRow label="Tick / Pip Value"    value={tickVal}     onChange={setTickVal}     prefix="$"
            hint="ES=12.50 · NQ=5.00 · CL=10.00 · GC=10.00 · /6E=6.25" />
          <CalcRow label="Stop Loss"           value={stopTicks}   onChange={setStop}        suffix="ticks" mode="numeric" />
          <CalcRow label="Profit Target"       value={tgtTicks}    onChange={setTgt}         suffix="ticks" mode="numeric" />
          <CalcRow label="Commissions / trade" value={commissions} onChange={setComm}        prefix="$"
            hint="Round-trip commissions per contract" />
        </div>

        {/* Row 1 Right — Funded Trader Goal Tracker */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Funded Trader Goal Tracker</div>
          <CalcRow label="Profit Goal"    value={profitGoal}  onChange={setProfitGoal} prefix="$" />
          <CalcRow label="Current P&L"   value={currentBal}  onChange={setCurrentBal} prefix="$" />
          <CalcResultRow label="Needed to Pass"               value={`$${neededToPass.toFixed(2)}`}  color={neededToPass>0?C.warn:C.long} big />
          <CalcRow label="Avg Trades Per Day" value={dailyTrades} onChange={setDailyTrades} mode="numeric" />
          <CalcResultRow label="Daily Avg (EV × trades/day)" value={`$${dailyAvg.toFixed(2)}`}       color={C.accent} />
          <CalcResultRow label="Trades to Goal"              value={tradesNeeded}                     color={C.accent} />
          <CalcResultRow label="Est. Days to Goal"           value={daysToPass}                       color={C.long} />
        </div>

        {/* Row 2 Left — Win / Loss Record */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Win / Loss Record</div>
          <CalcRow label="Winning Trades" value={wins}   onChange={setWins}   mode="numeric" />
          <CalcRow label="Losing Trades"  value={losses} onChange={setLosses} mode="numeric" />
          <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:12, color:C.textMid }}># of Trades</span>
            <span style={{ fontSize:13, fontWeight:600, color:C.text, fontFamily:"monospace" }}>{totalTrades}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:12, color:C.textMid }}>Win Rate</span>
            <span style={{ fontSize:13, fontWeight:700, color:C.accent, fontFamily:"monospace" }}>{winRatePct}%</span>
          </div>
        </div>

        {/* Row 2 Right — Account Settings */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Account Settings</div>
          <CalcRow label="Max Drawdown / Loss to Ruin" value={maxDD}      onChange={setMaxDD}      prefix="$"
            hint="Prop challenge breach limit or total account loss" />
          <CalcRow label="Daily Loss Limit"            value={dailyLimit} onChange={setDailyLimit} prefix="$" />
        </div>

        {/* Row 3 Left — Risk Limits */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>⚠ Risk Limits</div>
          <div style={{ fontSize:12, color:C.textMid, marginBottom:14 }}>Max consecutive losses before hitting limit</div>
          <CalcResultRow label="Trades until ruin"        value={maxTradesToDD}    color={dangerColor(maxTradesToDD, 3)} big />
          <CalcResultRow label="Trades until daily limit" value={maxTradesToDaily} color={dangerColor(maxTradesToDaily, 2)} />
          <div style={{ marginTop:14 }}>
            <div style={{ fontSize:10, color:C.textMid, marginBottom:6, fontFamily:"monospace" }}>DRAWDOWN BUFFER</div>
            <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
              <div style={{
                height:"100%", borderRadius:4, transition:"width 0.5s",
                width:`${Math.min((cb/md)*100,100)}%`,
                background: cb/md > 0.5 ? C.long : cb/md > 0.25 ? C.warn : C.short,
              }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.textDim, marginTop:4, fontFamily:"monospace" }}>
              <span>$0</span><span>${md.toLocaleString()} limit</span>
            </div>
          </div>
        </div>

        {/* Row 3 Right — Summary */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Summary</div>
          <CalcResultRow label="Loss per trade"     value={`$${lossPerTrade.toFixed(2)}`}   color={C.short} />
          <CalcResultRow label="Profit per trade"   value={`$${profitPerTrade.toFixed(2)}`} color={C.long} />
          <CalcResultRow label="Risk : Reward"      value={`${rr.toFixed(2)} : 1`}          color={C.accent} />
          <CalcResultRow label="Win Rate"           value={`${winRatePct}%`}                color={C.accent} />
          <CalcResultRow label="Gross Wins"         value={`$${grossWins.toFixed(2)}`}      color={C.long} />
          <CalcResultRow label="Gross Losses"       value={`-$${grossLosses.toFixed(2)}`}   color={C.short} />
          {totalComm > 0 && <CalcResultRow label="Commissions" value={`-$${totalComm.toFixed(2)}`} color={C.textMid} />}
          <CalcResultRow label="Net P&L"            value={`$${netPnL.toFixed(2)}`}         color={netPnL>=0?C.long:C.short} big />
          <CalcResultRow label="Exp. Value / trade" value={`$${expectedVal.toFixed(2)}`}    color={expectedVal>=0?C.long:C.short} />
        </div>

      </div>
    </div>
  );
}

function LangSwitcher({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:"relative" }}>
      <button onClick={() => setOpen(o=>!o)} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", background:C.surface, border:`1px solid ${C.borderHi}`, borderRadius:6, color:"#c9cdd6", cursor:"pointer", fontFamily:"monospace", fontSize:13, fontWeight:600 }}>
        <span>{LANGS[lang].flag}</span><span>{LANGS[lang].label}</span><span style={{ fontSize:10, opacity:0.8 }}>▼</span>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0, background:C.surface, border:`1px solid ${C.borderHi}`, borderRadius:8, overflow:"hidden", zIndex:200, minWidth:150, boxShadow:"0 8px 24px #00000044" }}>
          {Object.entries(LANGS).map(([code, info]) => (
            <div key={code} onClick={() => { setLang(code); setOpen(false); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", cursor:"pointer", background:lang===code?C.accentDim:"transparent", color:lang===code?C.accent:"#c9cdd6", fontSize:14, fontWeight: lang===code?600:400 }}>
              <span>{info.flag}</span><span>{info.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(null);
  const faqs = [
    ["How are signals delivered?", "Signals appear in real-time on your Signal Boss dashboard. Alert delivery via email, SMS, and webhook (for automation) is available on Pro and Elite plans. You can also configure which instruments and timeframes trigger alerts."],
    ["Do I need to be at my desk all day?", "No. Signal Boss is designed around close-confirmed signals — meaning a signal fires when a candle closes with all conditions met, not on intraday noise. You can check in at key times rather than watching a screen all day."],
    ["What markets does Signal Boss cover?", "Signal Boss covers ES (S&P 500), NQ (Nasdaq-100), CL (Crude Oil), GC (Gold), RTY (Russell 2000), ZN (10-Year T-Note), and currency futures /6E (EUR/USD)."],
    ["Is this suitable for beginners?", "Signal Boss is suited for traders who already understand futures basics — margin, leverage, tick values, and position sizing. If you're brand new to futures, we'd recommend building a foundation first. Our Account Risk Calculator and methodology documentation can help bridge that gap, but newer traders can benefit from the direct signal approach and have the opportunity to bypass the long, arduous, often painful exercise of 'finding entries' and charting methods that prove to be unprofitable, year after year."],
    ["Can I cancel anytime?", "Yes. All plans are month-to-month with no long-term contracts. You can cancel anytime from your account settings and you'll retain access through the end of your billing period."],
    ["How is this different from other signal services?", "Most signal services give you arrows on a chart and call it a day. They're based on chart patterns and oscillators that are 'yesterday's news'. Signal Boss gives you clear, concise signals with actual entry points, suggested stop losses and take profit levels. Institutional traders know what really moves markets — volatility-driven momentum and volume. We give you those professional grade signals, you do the rest: get in the trade, after you've defined your risk and set your take-profit!"],
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      {faqs.map(([q, a], i) => (
        <div key={i} style={{ background:C.surface, border:`1px solid ${open===i ? C.accent+"44" : C.border}`, borderRadius:10, overflow:"hidden", transition:"border-color 0.2s" }}>
          <button onClick={() => setOpen(open===i ? null : i)}
            style={{ width:"100%", textAlign:"left", padding:"18px 20px", background:"transparent", border:"none", color:C.text, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
            <span style={{ fontSize:16, fontWeight:600, lineHeight:1.5 }}>{q}</span>
            <span style={{ color:C.accent, fontSize:20, flexShrink:0, transform:open===i?"rotate(45deg)":"none", transition:"transform 0.2s" }}>+</span>
          </button>
          {open===i && (
            <div style={{ padding:"0 20px 20px", fontSize:15, color:"#9ca3b8", lineHeight:1.85 }}>{a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function FAQSectionForex() {
  const [open, setOpen] = useState(null);
  const faqs = [
    ["What forex pairs does Signal Boss cover?", "Signal Boss currently covers EUR/USD (/6E) — derived directly from exchange-traded currency futures where institutional price discovery begins."],
    ["Why use currency futures signals for spot forex trading?", "Currency futures are exchange-traded, fully transparent, and reflect institutional positioning in real time. The implied volatility data derived from futures options is a leading indicator for spot forex price movement. The directional correlation between a futures IV signal and the equivalent spot pair is approximately 99% — meaning the signal intelligence is identical whether you execute in futures or spot forex."],
    ["Does this work for FTMO, FundedNext, and other forex prop firms?", "Yes. Signal Boss includes the Account Risk Calculator covering FTMO, FundedNext, MyFundedFX, and all major forex evaluation firms. The calculator handles pip-based risk, lot sizing, leverage ratios, and daily drawdown rules — the same logic applies whether you're protecting a prop challenge or your own capital."],
    ["How are pip-based stop and target levels calculated?", "Smart Stop and Smart Take Profit levels on forex signals are derived from the same IV mean-reversion methodology used for futures tick-based levels. The calculation accounts for the pip value of each specific pair, producing actionable levels you can enter directly into your broker platform."],
    ["Do I need to understand futures markets to use the forex track?", "No. You trade spot forex — Signal Boss handles the futures intelligence layer. All signal cards are presented in familiar forex terms (pips, entry price, pair name). The futures reference (e.g., 'Derived from /6E') is shown for transparency but you don't need to trade futures to benefit from the signals."],
    ["What timeframes are covered?", "Signals are available on the 5-minute, 15-minute, 1-hour, 4-hour, and Daily timeframes — consistent across all pairs including crosses."],
    ["Can I cancel anytime?", "Yes. Signal Boss is month-to-month with no long-term commitment. Cancel anytime from your account dashboard with no fees or penalties. Every subscription includes a 30-day money-back guarantee — if you're not satisfied, contact us within 30 days for a full refund."],
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      {faqs.map(([q, a], i) => (
        <div key={i} style={{ background:C.surface, border:`1px solid ${open===i ? C.accent+"44" : C.border}`, borderRadius:10, overflow:"hidden", transition:"border-color 0.2s" }}>
          <button onClick={() => setOpen(open===i ? null : i)}
            style={{ width:"100%", textAlign:"left", padding:"18px 20px", background:"transparent", border:"none", color:C.text, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
            <span style={{ fontSize:16, fontWeight:600, lineHeight:1.5 }}>{q}</span>
            <span style={{ color:C.accent, fontSize:20, flexShrink:0, transform:open===i?"rotate(45deg)":"none", transition:"transform 0.2s" }}>+</span>
          </button>
          {open===i && (
            <div style={{ padding:"0 20px 20px", fontSize:15, color:"#9ca3b8", lineHeight:1.85 }}>{a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function ForexDemo({ onNavigate, t }) {
  const [activeTab, setActiveTab] = useState("signals");

  const tabs = [
    { id:"signals", label:"Live Signals",    icon:"◉" },
    { id:"pnl",     label:"P&L Tracker",     icon:"◈" },
    { id:"config",  label:"Configuration",   icon:"⚙" },
    { id:"prop",    label:"Risk Calculator", icon:"⬡" },
    { id:"account", label:"Account",         icon:"◎" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      {/* Sidebar */}
      <div style={{ width:215, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"20px 18px 16px", borderBottom:`1px solid ${C.border}` }}>
          <div onClick={() => onNavigate("landing")} style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
              <rect width="28" height="28" rx="6" fill={C.accent} fillOpacity="0.12"/>
              <rect x="0.5" y="0.5" width="27" height="27" rx="5.5" stroke={C.accent} strokeOpacity="0.35"/>
              <path d="M16 4L9 15.5h6L11 24l10-13h-6L16 4z" fill={C.accent}/>
            </svg>
            <div style={{ lineHeight:1 }}>
              <div style={{ fontWeight:800, fontSize:14, fontFamily:"monospace", letterSpacing:"0.06em", color:C.text }}>SIGNAL<span style={{ color:C.accent }}>BOSS</span></div>
              <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.12em", marginTop:2 }}>FOREX · LIVE</div>
            </div>
          </div>
          <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:6 }}>
            <LiveDot color={C.accent} size={5} />
            <span style={{ fontSize:10, color:C.textMid, fontFamily:"monospace" }}>FOREX ENGINE ACTIVE</span>
          </div>
          <div style={{ marginTop:12, display:"flex", gap:4, background:C.bg, borderRadius:7, padding:3 }}>
            <button onClick={() => onNavigate("dashboard")} style={{ flex:1, padding:"5px 0", borderRadius:5, border:"none", background:"transparent", color:C.textMid, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"monospace" }}>FUTURES</button>
            <button style={{ flex:1, padding:"5px 0", borderRadius:5, border:"none", background:C.accentDim, color:C.accent, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"monospace" }}>FOREX</button>
          </div>
        </div>
        <nav style={{ padding:"12px 10px", flex:1 }}>
          {tabs.map(tab => (
            <div key={tab.id} onClick={() => tab.id === "prop" ? onNavigate("calc") : setActiveTab(tab.id)} className={`nav-item ${activeTab===tab.id?"active":""}`} style={{ color:activeTab===tab.id?C.accent:C.textMid }}>
              <span style={{ fontSize:12 }}>{tab.icon}</span>{tab.label}
            </div>
          ))}
        </nav>
        <div style={{ padding:"10px 18px", borderTop:`1px solid ${C.border}` }}>
          <div onClick={() => onNavigate("landing")} style={{ fontSize:11, color:C.textDim, cursor:"pointer", marginBottom:6, fontFamily:"monospace" }}>← Home</div>
          <button onClick={() => onNavigate("signup")} style={{ width:"100%", padding:"9px", background:C.accent, color:"#080909", border:"none", borderRadius:7, fontWeight:700, fontSize:12, cursor:"pointer" }}>Get Started →</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflow:"auto", background:C.bg }}>
        <PriceTicker />

        {activeTab==="signals" && (
          <div style={{ padding:22 }}>
            <div style={{ background:C.surface, border:`1px solid ${C.accent}33`, borderRadius:12, padding:"40px 28px", textAlign:"center", marginTop:20 }}>
              <div style={{ fontSize:24, marginBottom:12 }}>◈</div>
              <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>Forex Signals</div>
              <div style={{ fontSize:13, color:C.textMid, lineHeight:1.7, maxWidth:400, margin:"0 auto" }}>
                Currency futures IV signals are in development.<br />
                Futures signals are live on the FUTURES track.
              </div>
              <button onClick={() => onNavigate("dashboard")} style={{ marginTop:24, padding:"11px 28px", background:C.accent, color:"#080909", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer" }}>
                Go to Futures Dashboard →
              </button>
            </div>
          </div>
        )}

        {activeTab==="pnl" && <PositionTracker />}

        {activeTab==="config" && (
          <div style={{ padding:22, maxWidth:500 }}>
            <h2 style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>Configuration</h2>
            <p style={{ color:C.textMid, fontSize:13, marginBottom:22 }}>Signal filters and display preferences for your forex track.</p>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
              <div style={{ fontSize:13, color:C.textMid, lineHeight:1.8 }}>
                Full configuration options — timeframe selection, pair filtering, VWAP rules, and alert preferences — are available with a live subscription.
              </div>
              <button onClick={() => onNavigate("signup")} style={{ marginTop:16, padding:"10px 24px", background:C.accent, color:"#080909", border:"none", borderRadius:7, fontWeight:600, fontSize:13, cursor:"pointer" }}>Get Started →</button>
            </div>
          </div>
        )}

        {activeTab==="account" && (
          <div style={{ padding:22, maxWidth:500 }}>
            <h2 style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>Account</h2>
            <p style={{ color:C.textMid, fontSize:13, marginBottom:22 }}>Manage your Signal Boss subscription and preferences.</p>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
              <div style={{ fontSize:13, color:C.textMid, lineHeight:1.8 }}>Account management is available once you have an active subscription.</div>
              <button onClick={() => onNavigate("signup")} style={{ marginTop:16, padding:"10px 24px", background:C.accent, color:"#080909", border:"none", borderRadius:7, fontWeight:600, fontSize:13, cursor:"pointer" }}>Get Started →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const FALLBACK_BACKTEST = {
  instrument: "ES (S&P 500 Futures)",
  name: "Rotation Signal · 2.5:1 R:R · 7:30–17:00 ET",
  period: "30-day walk-forward",
  stats: { trades:11, winRate:72.7, breakEven:28.6, profitFactor:7.22, totalPnlUsd:3962.50, maxDrawdownUsd:350, avgHoldMin:13, wins:8, losses:3, avgWin:575, avgLoss:-212.50 },
  params: { window: "30-day walk-forward" },
  disclaimer: "Hypothetical results based on walk-forward backtesting on historical data. Past performance is not indicative of future results. All trading involves risk of loss.",
  equity: [0,575,1150,937.5,1512.5,2087.5,1875,2450,3025,3600,3387.5,3962.5],
  trades: [
    { date:"2025-05-02", dir:"LONG",  entry:5221.25, stop:5213.00, tp:5242.75, exit:5242.75, ticks:70,  pnl:875.00,   duration:11, reason:"TP" },
    { date:"2025-05-05", dir:"LONG",  entry:5244.50, stop:5236.25, tp:5265.00, exit:5265.00, ticks:66,  pnl:825.00,   duration:14, reason:"TP" },
    { date:"2025-05-06", dir:"SHORT", entry:5261.00, stop:5269.25, tp:5240.50, exit:5269.25, ticks:-66, pnl:-206.25,  duration:8,  reason:"SL" },
    { date:"2025-05-08", dir:"LONG",  entry:5238.75, stop:5230.50, tp:5259.25, exit:5259.25, ticks:66,  pnl:825.00,   duration:12, reason:"TP" },
    { date:"2025-05-09", dir:"LONG",  entry:5252.00, stop:5243.75, tp:5272.50, exit:5272.50, ticks:66,  pnl:825.00,   duration:16, reason:"TP" },
    { date:"2025-05-12", dir:"SHORT", entry:5271.50, stop:5279.75, tp:5251.00, exit:5279.75, ticks:-66, pnl:-206.25,  duration:9,  reason:"SL" },
    { date:"2025-05-13", dir:"LONG",  entry:5248.00, stop:5239.75, tp:5268.50, exit:5248.00, ticks:-66, pnl:-206.25,  duration:7,  reason:"SL" },
    { date:"2025-05-15", dir:"LONG",  entry:5263.25, stop:5255.00, tp:5283.75, exit:5283.75, ticks:66,  pnl:825.00,   duration:18, reason:"TP" },
    { date:"2025-05-19", dir:"LONG",  entry:5277.50, stop:5269.25, tp:5298.00, exit:5298.00, ticks:66,  pnl:825.00,   duration:13, reason:"TP" },
    { date:"2025-05-21", dir:"SHORT", entry:5291.00, stop:5299.25, tp:5270.50, exit:5270.50, ticks:66,  pnl:825.00,   duration:15, reason:"TP" },
    { date:"2025-05-22", dir:"LONG",  entry:5284.75, stop:5276.50, tp:5305.25, exit:5305.25, ticks:66,  pnl:825.00,   duration:11, reason:"TP" },
  ],
};

const BACKTEST_STATIC = {
  "ES": {
    "symbol": "ES",
    "name": "E-mini S&P 500",
    "period": "45 trading days",
    "rr": 5.0,
    "exit_strategy": "Scaled Exit \u00b7 TP1 2.0:1 (50% off) \u00b7 TP2 5.0:1 \u00b7 Stop \u2192 BE at TP1",
    "overall": {
      "trades": 137,
      "wins": 71,
      "partials": 0,
      "losses": 66,
      "win_rate": 51.8,
      "full_tp_rate": 51.8,
      "total_pnl": 6031.25,
      "profit_factor": 1.63,
      "avg_win": 219.63,
      "avg_loss": -144.89,
      "avg_hold_min": 42.2,
      "max_drawdown": 850.0,
      "equity": [
        0,
        75.0,
        150.0,
        -50.0,
        25.0,
        287.5,
        200.0,
        50.0,
        187.5,
        800.0,
        1062.5,
        1325.0,
        1587.5,
        1487.5,
        1562.5,
        1512.5,
        1487.5,
        1387.5,
        1462.5,
        1725.0,
        2118.75,
        2193.75,
        1993.75,
        2256.25,
        2156.25,
        2056.25,
        1956.25,
        2218.75,
        2118.75,
        2600.0,
        2862.5,
        2762.5,
        3025.0,
        2925.0,
        2825.0,
        3087.5,
        3162.5,
        3556.25,
        3218.75,
        3068.75,
        3168.75,
        3068.75,
        3331.25,
        3231.25,
        3131.25,
        2968.75,
        3068.75,
        3168.75,
        3293.75,
        3181.25,
        3443.75,
        3706.25,
        3968.75,
        3868.75,
        3606.25,
        3868.75,
        3956.25,
        4068.75,
        3843.75,
        4106.25,
        3918.75,
        3743.75,
        3631.25,
        3531.25,
        3431.25,
        3506.25,
        3812.5,
        3737.5,
        3637.5,
        3712.5,
        3800.0,
        4281.25,
        4406.25,
        4306.25,
        4206.25,
        4281.25,
        4356.25,
        4156.25,
        4593.75,
        4793.75,
        4256.25,
        4518.75,
        4243.75,
        4681.25,
        4606.25,
        4693.75,
        4856.25,
        4743.75,
        5006.25,
        4906.25,
        4806.25,
        4581.25,
        4356.25,
        4618.75,
        4781.25,
        4681.25,
        4943.75,
        4843.75,
        5106.25,
        5231.25,
        5006.25,
        4906.25,
        4981.25,
        4918.75,
        4818.75,
        4731.25,
        4993.75,
        5256.25,
        5156.25,
        5343.75,
        5143.75,
        4906.25,
        4993.75,
        4893.75,
        4781.25,
        5218.75,
        5118.75,
        4981.25,
        4693.75,
        4493.75,
        4843.75,
        5106.25,
        5193.75,
        5981.25,
        6243.75,
        6506.25,
        6343.75,
        6243.75,
        6118.75,
        5981.25,
        5768.75,
        5906.25,
        6056.25,
        6193.75,
        5968.75,
        6106.25,
        6218.75,
        6031.25
      ]
    },
    "by_trigger": {
      "AAA+": {
        "trades": 20,
        "wins": 12,
        "partials": 0,
        "losses": 8,
        "win_rate": 60.0,
        "full_tp_rate": 60.0,
        "total_pnl": 775.0,
        "profit_factor": 1.67,
        "avg_win": 160.42,
        "avg_loss": -143.75,
        "avg_hold_min": 41.5
      },
      "A": {
        "trades": 80,
        "wins": 40,
        "partials": 0,
        "losses": 40,
        "win_rate": 50.0,
        "full_tp_rate": 50.0,
        "total_pnl": 4075.0,
        "profit_factor": 1.79,
        "avg_win": 230.31,
        "avg_loss": -128.44,
        "avg_hold_min": 29.2
      },
      "AA": {
        "trades": 36,
        "wins": 18,
        "partials": 0,
        "losses": 18,
        "win_rate": 50.0,
        "full_tp_rate": 50.0,
        "total_pnl": 918.75,
        "profit_factor": 1.28,
        "avg_win": 232.99,
        "avg_loss": -181.94,
        "avg_hold_min": 71.2
      },
      "AAA": {
        "trades": 1,
        "wins": 1,
        "partials": 0,
        "losses": 0,
        "win_rate": 100.0,
        "full_tp_rate": 100.0,
        "total_pnl": 262.5,
        "profit_factor": 999.0,
        "avg_win": 262.5,
        "avg_loss": 0,
        "avg_hold_min": 55.0
      }
    },
    "trades": [
      {
        "n": 1,
        "trigger": "AAA+",
        "dir": "LONG",
        "date": "2026-01-07",
        "time": "08:25",
        "entry": 6986.25,
        "stop": 6984.0,
        "tp": 6993.75,
        "exit": 6986.0,
        "ticks": 6,
        "pnl": 75.0,
        "duration": 45,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 2,
        "trigger": "AAA+",
        "dir": "SHORT",
        "date": "2026-01-07",
        "time": "10:10",
        "entry": 6983.0,
        "stop": 6987.5,
        "tp": 6975.5,
        "exit": 6983.5,
        "ticks": 6,
        "pnl": 75.0,
        "duration": 15,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 3,
        "trigger": "AAA+",
        "dir": "LONG",
        "date": "2026-01-07",
        "time": "10:30",
        "entry": 6988.0,
        "stop": 6982.5,
        "tp": 6995.5,
        "exit": 6984.0,
        "ticks": -22,
        "pnl": -200.0,
        "duration": 10,
        "reason": "CYC",
        "win": false,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 4,
        "trigger": "AAA+",
        "dir": "LONG",
        "date": "2026-01-07",
        "time": "10:45",
        "entry": 6990.75,
        "stop": 6984.25,
        "tp": 6998.7375,
        "exit": 6990.75,
        "ticks": 6,
        "pnl": 75.0,
        "duration": 35,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 5,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-08",
        "time": "19:50",
        "entry": 6962.75,
        "stop": 6964.75,
        "tp": 6955.25,
        "exit": 6955.25,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 40,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 6,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-09",
        "time": "08:40",
        "entry": 6986.0,
        "stop": 6984.0,
        "tp": 6993.5,
        "exit": 6984.25,
        "ticks": -8,
        "pnl": -87.5,
        "duration": 5,
        "reason": "CYC",
        "win": false,
        "cycles": "3-Day, 6-Day"
      },
      {
        "n": 7,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-09",
        "time": "10:05",
        "entry": 6959.75,
        "stop": 6962.75,
        "tp": 6947.6375,
        "exit": 6977.0,
        "ticks": -12,
        "pnl": -150.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 8,
        "trigger": "AAA+",
        "dir": "LONG",
        "date": "2026-01-09",
        "time": "10:20",
        "entry": 6989.5,
        "stop": 6977.25,
        "tp": 7004.425,
        "exit": 6981.25,
        "ticks": 11,
        "pnl": 137.5,
        "duration": 20,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 9,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-09",
        "time": "11:00",
        "entry": 6990.5,
        "stop": 6982.5,
        "tp": 7008.1625,
        "exit": 7009.25,
        "ticks": 14,
        "pnl": 612.5,
        "duration": 90,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 10,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-11",
        "time": "19:00",
        "entry": 6996.75,
        "stop": 6998.75,
        "tp": 6989.25,
        "exit": 6986.25,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 30,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 11,
        "trigger": "AAA",
        "dir": "SHORT",
        "date": "2026-01-11",
        "time": "19:35",
        "entry": 6979.25,
        "stop": 6982.75,
        "tp": 6971.75,
        "exit": 6969.25,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 55,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 12,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-12",
        "time": "09:35",
        "entry": 6990.0,
        "stop": 6988.0,
        "tp": 6997.5,
        "exit": 6997.75,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 15,
        "reason": "TP",
        "win": true,
        "cycles": "6-Day"
      },
      {
        "n": 13,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-12",
        "time": "19:00",
        "entry": 7004.0,
        "stop": 7006.0,
        "tp": 6996.5,
        "exit": 7006.5,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 15,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 14,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-12",
        "time": "20:50",
        "entry": 7006.5,
        "stop": 7004.5,
        "tp": 7014.0,
        "exit": 7006.25,
        "ticks": 6,
        "pnl": 75.0,
        "duration": 395,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "3-Day"
      },
      {
        "n": 15,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-13",
        "time": "05:05",
        "entry": 7005.5,
        "stop": 7007.5,
        "tp": 6998.0,
        "exit": 7006.5,
        "ticks": -8,
        "pnl": -50.0,
        "duration": 30,
        "reason": "CYC",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 16,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-13",
        "time": "05:40",
        "entry": 7004.75,
        "stop": 7006.75,
        "tp": 6997.25,
        "exit": 7005.25,
        "ticks": -8,
        "pnl": -25.0,
        "duration": 10,
        "reason": "CYC",
        "win": false,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 17,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-13",
        "time": "06:05",
        "entry": 7007.25,
        "stop": 7005.25,
        "tp": 7014.75,
        "exit": 7005.0,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 25,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 18,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-13",
        "time": "06:45",
        "entry": 7008.0,
        "stop": 7006.0,
        "tp": 7015.5,
        "exit": 7007.5,
        "ticks": 6,
        "pnl": 75.0,
        "duration": 65,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 19,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-13",
        "time": "08:25",
        "entry": 7007.75,
        "stop": 7005.75,
        "tp": 7015.25,
        "exit": 7030.5,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 5,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 20,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-13",
        "time": "10:00",
        "entry": 7000.5,
        "stop": 7003.5,
        "tp": 6988.7625,
        "exit": 6986.75,
        "ticks": 9,
        "pnl": 393.75,
        "duration": 20,
        "reason": "TP",
        "win": true,
        "cycles": "3-Day"
      },
      {
        "n": 21,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-13",
        "time": "11:40",
        "entry": 7008.75,
        "stop": 7006.5,
        "tp": 7017.3375,
        "exit": 7005.75,
        "ticks": 6,
        "pnl": 75.0,
        "duration": 35,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "3-Day"
      },
      {
        "n": 22,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-13",
        "time": "12:20",
        "entry": 7010.5,
        "stop": 7006.5,
        "tp": 7019.35,
        "exit": 7004.5,
        "ticks": -16,
        "pnl": -200.0,
        "duration": 15,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 23,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-13",
        "time": "23:05",
        "entry": 6995.5,
        "stop": 6997.5,
        "tp": 6988.0,
        "exit": 6988.0,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 85,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 24,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-14",
        "time": "20:00",
        "entry": 6964.25,
        "stop": 6962.25,
        "tp": 6971.75,
        "exit": 6961.5,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 10,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 25,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-14",
        "time": "20:30",
        "entry": 6954.0,
        "stop": 6956.0,
        "tp": 6946.5,
        "exit": 6958.5,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 26,
        "trigger": "AAA+",
        "dir": "SHORT",
        "date": "2026-01-14",
        "time": "22:25",
        "entry": 6958.75,
        "stop": 6960.75,
        "tp": 6951.25,
        "exit": 6961.25,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 95,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 27,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-16",
        "time": "09:50",
        "entry": 6988.25,
        "stop": 6990.25,
        "tp": 6980.75,
        "exit": 6979.0,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 5,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 28,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-16",
        "time": "14:00",
        "entry": 6994.5,
        "stop": 6992.5,
        "tp": 7002.0,
        "exit": 6985.75,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 10,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 29,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-18",
        "time": "23:35",
        "entry": 6917.75,
        "stop": 6924.0,
        "tp": 6903.8375,
        "exit": 6903.5,
        "ticks": 11,
        "pnl": 481.25,
        "duration": 80,
        "reason": "TP",
        "win": true,
        "cycles": "3-Day, 6-Day"
      },
      {
        "n": 30,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-21",
        "time": "06:45",
        "entry": 6829.0,
        "stop": 6831.0,
        "tp": 6821.5,
        "exit": 6819.5,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 10,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 31,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-21",
        "time": "18:00",
        "entry": 6925.75,
        "stop": 6923.75,
        "tp": 6933.25,
        "exit": 6923.75,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 10,
        "reason": "SL",
        "win": false,
        "cycles": "3-Day"
      },
      {
        "n": 32,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-22",
        "time": "00:40",
        "entry": 6922.75,
        "stop": 6924.75,
        "tp": 6915.25,
        "exit": 6913.0,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 30,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 33,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-22",
        "time": "12:30",
        "entry": 6965.5,
        "stop": 6963.5,
        "tp": 6973.0,
        "exit": 6963.5,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 34,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-22",
        "time": "14:00",
        "entry": 6963.0,
        "stop": 6961.0,
        "tp": 6970.5,
        "exit": 6960.75,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 30,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 35,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-22",
        "time": "19:05",
        "entry": 6943.0,
        "stop": 6940.75,
        "tp": 6950.5,
        "exit": 6952.75,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 55,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day, 6-Day"
      },
      {
        "n": 36,
        "trigger": "AAA+",
        "dir": "SHORT",
        "date": "2026-01-23",
        "time": "06:40",
        "entry": 6938.5,
        "stop": 6942.25,
        "tp": 6931.0,
        "exit": 6939.25,
        "ticks": 6,
        "pnl": 75.0,
        "duration": 60,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 37,
        "trigger": "AAA+",
        "dir": "LONG",
        "date": "2026-01-23",
        "time": "10:20",
        "entry": 6949.0,
        "stop": 6939.5,
        "tp": 6960.5125,
        "exit": 6962.25,
        "ticks": 9,
        "pnl": 393.75,
        "duration": 40,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 38,
        "trigger": "AAA+",
        "dir": "SHORT",
        "date": "2026-01-23",
        "time": "12:50",
        "entry": 6935.25,
        "stop": 6943.5,
        "tp": 6925.0875,
        "exit": 6942.0,
        "ticks": -33,
        "pnl": -337.5,
        "duration": 15,
        "reason": "CYC",
        "win": false,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 39,
        "trigger": "AAA+",
        "dir": "SHORT",
        "date": "2026-01-23",
        "time": "13:10",
        "entry": 6938.5,
        "stop": 6947.25,
        "tp": 6928.0,
        "exit": 6941.5,
        "ticks": -35,
        "pnl": -150.0,
        "duration": 5,
        "reason": "CYC",
        "win": false,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 40,
        "trigger": "AAA+",
        "dir": "LONG",
        "date": "2026-01-23",
        "time": "13:35",
        "entry": 6945.0,
        "stop": 6936.5,
        "tp": 6955.3125,
        "exit": 6942.5,
        "ticks": 8,
        "pnl": 100.0,
        "duration": 90,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 41,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-26",
        "time": "01:00",
        "entry": 6935.75,
        "stop": 6933.75,
        "tp": 6943.25,
        "exit": 6933.75,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 40,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 42,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-26",
        "time": "01:45",
        "entry": 6935.0,
        "stop": 6933.0,
        "tp": 6942.5,
        "exit": 6943.25,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 75,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 43,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-26",
        "time": "08:05",
        "entry": 6944.5,
        "stop": 6942.5,
        "tp": 6952.0,
        "exit": 6940.75,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 30,
        "reason": "SL",
        "win": false,
        "cycles": "3-Day, 6-Day"
      },
      {
        "n": 44,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-26",
        "time": "19:00",
        "entry": 6977.75,
        "stop": 6979.75,
        "tp": 6970.25,
        "exit": 6981.75,
        "ticks": -8,
        "pnl": -100.0,
        "duration": 15,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 45,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-28",
        "time": "10:40",
        "entry": 7010.25,
        "stop": 7015.25,
        "tp": 6999.525,
        "exit": 7013.5,
        "ticks": -20,
        "pnl": -162.5,
        "duration": 25,
        "reason": "CYC",
        "win": false,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 46,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-28",
        "time": "11:30",
        "entry": 7005.75,
        "stop": 7010.5,
        "tp": 6995.2875,
        "exit": 7006.5,
        "ticks": 8,
        "pnl": 100.0,
        "duration": 40,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 47,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-28",
        "time": "15:25",
        "entry": 7006.25,
        "stop": 7011.0,
        "tp": 6995.5625,
        "exit": 7009.75,
        "ticks": 8,
        "pnl": 100.0,
        "duration": 25,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 48,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-28",
        "time": "18:05",
        "entry": 7009.75,
        "stop": 7016.0,
        "tp": 6996.1,
        "exit": 7009.75,
        "ticks": 10,
        "pnl": 125.0,
        "duration": 15,
        "reason": "TP1+BE",
        "win": true,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 49,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-28",
        "time": "19:55",
        "entry": 6999.0,
        "stop": 6996.75,
        "tp": 7008.0375,
        "exit": 6994.25,
        "ticks": -9,
        "pnl": -112.5,
        "duration": 20,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 50,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-28",
        "time": "21:00",
        "entry": 6998.25,
        "stop": 6996.25,
        "tp": 7005.75,
        "exit": 7006.0,
        "ticks": 6,
        "pnl": 262.5,
        "duration": 70,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      }
    ]
  },
  "NQ": {
    "symbol": "NQ",
    "name": "E-mini Nasdaq-100",
    "period": "47 trading days",
    "rr": 5.0,
    "exit_strategy": "Single Target \u00b7 5.0:1 R:R \u00b7 Tier-based stop",
    "overall": {
      "trades": 130,
      "wins": 55,
      "partials": 0,
      "losses": 75,
      "win_rate": 42.3,
      "full_tp_rate": 42.3,
      "total_pnl": 22225.0,
      "profit_factor": 1.97,
      "avg_win": 819.09,
      "avg_loss": -304.33,
      "avg_hold_min": 33.7,
      "max_drawdown": 4510.0,
      "equity": [
        0,
        -155.0,
        170.0,
        370.0,
        260.0,
        65.0,
        640.0,
        565.0,
        340.0,
        80.0,
        -570.0,
        -950.0,
        1050.0,
        1450.0,
        2225.0,
        2145.0,
        2470.0,
        2350.0,
        2265.0,
        2590.0,
        3465.0,
        4490.0,
        4405.0,
        4605.0,
        5055.0,
        4895.0,
        4780.0,
        4650.0,
        4950.0,
        4745.0,
        5595.0,
        6795.0,
        5930.0,
        6430.0,
        8255.0,
        8480.0,
        8195.0,
        7850.0,
        7640.0,
        7495.0,
        7050.0,
        6435.0,
        6245.0,
        6130.0,
        6025.0,
        5940.0,
        6315.0,
        6210.0,
        5775.0,
        5490.0,
        4865.0,
        4310.0,
        3970.0,
        4445.0,
        4320.0,
        4895.0,
        5395.0,
        5845.0,
        6595.0,
        6455.0,
        6350.0,
        6270.0,
        6845.0,
        6360.0,
        6170.0,
        5890.0,
        6515.0,
        7415.0,
        8065.0,
        7855.0,
        7345.0,
        6385.0,
        8110.0,
        7705.0,
        7410.0,
        7935.0,
        7815.0,
        8265.0,
        8140.0,
        8490.0,
        8940.0,
        9765.0,
        10940.0,
        10055.0,
        12605.0,
        12055.0,
        11970.0,
        11540.0,
        11890.0,
        11730.0,
        12355.0,
        11945.0,
        13595.0,
        14395.0,
        14150.0,
        13950.0,
        13840.0,
        13720.0,
        14020.0,
        14770.0,
        14600.0,
        14130.0,
        14880.0,
        15180.0,
        16005.0,
        17380.0,
        18955.0,
        18120.0,
        19970.0,
        19850.0,
        19615.0,
        20715.0,
        20520.0,
        20365.0,
        21790.0,
        21200.0,
        22500.0,
        22210.0,
        21860.0,
        20610.0,
        22185.0,
        21970.0,
        22895.0,
        23495.0,
        23285.0,
        22825.0,
        22715.0,
        23390.0,
        23105.0,
        22615.0,
        22225.0
      ]
    },
    "by_trigger": {
      "AAA+": {
        "trades": 18,
        "wins": 10,
        "partials": 0,
        "losses": 8,
        "win_rate": 55.6,
        "full_tp_rate": 55.6,
        "total_pnl": 3730.0,
        "profit_factor": 1.81,
        "avg_win": 832.5,
        "avg_loss": -574.38,
        "avg_hold_min": 23.9
      },
      "A": {
        "trades": 82,
        "wins": 33,
        "partials": 0,
        "losses": 49,
        "win_rate": 40.2,
        "full_tp_rate": 40.2,
        "total_pnl": 14395.0,
        "profit_factor": 2.48,
        "avg_win": 730.3,
        "avg_loss": -198.06,
        "avg_hold_min": 19.3
      },
      "AA": {
        "trades": 30,
        "wins": 12,
        "partials": 0,
        "losses": 18,
        "win_rate": 40.0,
        "full_tp_rate": 40.0,
        "total_pnl": 4100.0,
        "profit_factor": 1.48,
        "avg_win": 1052.08,
        "avg_loss": -473.61,
        "avg_hold_min": 79.0
      }
    },
    "trades": [
      {
        "n": 1,
        "trigger": "AAA+",
        "dir": "LONG",
        "date": "2026-01-07",
        "time": "08:40",
        "entry": 25790.75,
        "stop": 25779.25,
        "tp": 25804.8125,
        "exit": 25783.0,
        "ticks": -46,
        "pnl": -155.0,
        "duration": 5,
        "reason": "CYC",
        "win": false,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 2,
        "trigger": "AAA+",
        "dir": "LONG",
        "date": "2026-01-07",
        "time": "09:25",
        "entry": 25790.75,
        "stop": 25776.25,
        "tp": 25808.15,
        "exit": 25822.0,
        "ticks": 13,
        "pnl": 325.0,
        "duration": 5,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 3,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-07",
        "time": "19:35",
        "entry": 25830.75,
        "stop": 25828.0,
        "tp": 25841.85,
        "exit": 25842.5,
        "ticks": 8,
        "pnl": 200.0,
        "duration": 20,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 4,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-07",
        "time": "22:35",
        "entry": 25777.5,
        "stop": 25783.0,
        "tp": 25765.6125,
        "exit": 25783.25,
        "ticks": -22,
        "pnl": -110.0,
        "duration": 35,
        "reason": "SL",
        "win": false,
        "cycles": "3-Day, 6-Day"
      },
      {
        "n": 5,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-08",
        "time": "08:15",
        "entry": 25796.75,
        "stop": 25787.0,
        "tp": 25817.7125,
        "exit": 25780.5,
        "ticks": -39,
        "pnl": -195.0,
        "duration": 65,
        "reason": "SL",
        "win": false,
        "cycles": "3-Day, 6-Day"
      },
      {
        "n": 6,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-08",
        "time": "09:30",
        "entry": 25706.0,
        "stop": 25719.75,
        "tp": 25676.075,
        "exit": 25621.25,
        "ticks": 23,
        "pnl": 575.0,
        "duration": 10,
        "reason": "TP",
        "win": true,
        "cycles": "3-Day, 6-Day"
      },
      {
        "n": 7,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-09",
        "time": "00:55",
        "entry": 25693.5,
        "stop": 25689.75,
        "tp": 25707.7875,
        "exit": 25685.5,
        "ticks": -15,
        "pnl": -75.0,
        "duration": 10,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 8,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-09",
        "time": "08:35",
        "entry": 25790.75,
        "stop": 25779.5,
        "tp": 25815.3125,
        "exit": 25768.0,
        "ticks": -45,
        "pnl": -225.0,
        "duration": 35,
        "reason": "SL",
        "win": false,
        "cycles": "3-Day, 6-Day"
      },
      {
        "n": 9,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-09",
        "time": "09:35",
        "entry": 25756.0,
        "stop": 25743.0,
        "tp": 25805.1625,
        "exit": 25706.0,
        "ticks": -52,
        "pnl": -260.0,
        "duration": 10,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 10,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-09",
        "time": "10:05",
        "entry": 25643.25,
        "stop": 25675.75,
        "tp": 25573.425,
        "exit": 25747.5,
        "ticks": -130,
        "pnl": -650.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 11,
        "trigger": "AAA+",
        "dir": "LONG",
        "date": "2026-01-09",
        "time": "10:20",
        "entry": 25799.75,
        "stop": 25728.75,
        "tp": 25885.175,
        "exit": 25780.75,
        "ticks": -284,
        "pnl": -380.0,
        "duration": 20,
        "reason": "CYC",
        "win": false,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 12,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-09",
        "time": "10:55",
        "entry": 25812.25,
        "stop": 25765.5,
        "tp": 25912.9,
        "exit": 25915.5,
        "ticks": 80,
        "pnl": 2000.0,
        "duration": 55,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 13,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-11",
        "time": "19:00",
        "entry": 25888.25,
        "stop": 25898.0,
        "tp": 25867.175,
        "exit": 25860.5,
        "ticks": 16,
        "pnl": 400.0,
        "duration": 10,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 14,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-12",
        "time": "09:30",
        "entry": 25855.5,
        "stop": 25845.25,
        "tp": 25894.3875,
        "exit": 25901.0,
        "ticks": 31,
        "pnl": 775.0,
        "duration": 25,
        "reason": "TP",
        "win": true,
        "cycles": "6-Day"
      },
      {
        "n": 15,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-13",
        "time": "00:25",
        "entry": 25905.25,
        "stop": 25901.25,
        "tp": 25920.325,
        "exit": 25890.0,
        "ticks": -16,
        "pnl": -80.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 16,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-13",
        "time": "00:40",
        "entry": 25898.5,
        "stop": 25894.0,
        "tp": 25915.5625,
        "exit": 25917.5,
        "ticks": 13,
        "pnl": 325.0,
        "duration": 45,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 17,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-13",
        "time": "05:05",
        "entry": 25892.0,
        "stop": 25898.0,
        "tp": 25869.05,
        "exit": 25900.5,
        "ticks": -24,
        "pnl": -120.0,
        "duration": 110,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 18,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-13",
        "time": "08:00",
        "entry": 25906.25,
        "stop": 25902.0,
        "tp": 25922.525,
        "exit": 25900.0,
        "ticks": -17,
        "pnl": -85.0,
        "duration": 10,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 19,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-13",
        "time": "08:25",
        "entry": 25911.75,
        "stop": 25907.5,
        "tp": 25928.3625,
        "exit": 26017.0,
        "ticks": 13,
        "pnl": 325.0,
        "duration": 5,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 20,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-13",
        "time": "10:15",
        "entry": 25883.25,
        "stop": 25895.0,
        "tp": 25839.0,
        "exit": 25837.5,
        "ticks": 35,
        "pnl": 875.0,
        "duration": 5,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 21,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-13",
        "time": "12:50",
        "entry": 25901.5,
        "stop": 25915.25,
        "tp": 25849.375,
        "exit": 25839.75,
        "ticks": 41,
        "pnl": 1025.0,
        "duration": 65,
        "reason": "TP",
        "win": true,
        "cycles": "3-Day"
      },
      {
        "n": 22,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-13",
        "time": "20:45",
        "entry": 25885.25,
        "stop": 25889.5,
        "tp": 25869.05,
        "exit": 25890.25,
        "ticks": -17,
        "pnl": -85.0,
        "duration": 25,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 23,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-13",
        "time": "23:45",
        "entry": 25886.75,
        "stop": 25889.5,
        "tp": 25876.175,
        "exit": 25875.75,
        "ticks": 8,
        "pnl": 200.0,
        "duration": 15,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 24,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-14",
        "time": "05:20",
        "entry": 25773.25,
        "stop": 25779.5,
        "tp": 25749.5125,
        "exit": 25746.0,
        "ticks": 18,
        "pnl": 450.0,
        "duration": 10,
        "reason": "TP",
        "win": true,
        "cycles": "6-Day"
      },
      {
        "n": 25,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-14",
        "time": "08:30",
        "entry": 25765.5,
        "stop": 25773.5,
        "tp": 25734.825,
        "exit": 25779.75,
        "ticks": -32,
        "pnl": -160.0,
        "duration": 60,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 26,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-14",
        "time": "20:00",
        "entry": 25640.5,
        "stop": 25634.75,
        "tp": 25662.7,
        "exit": 25632.5,
        "ticks": -23,
        "pnl": -115.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 27,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-14",
        "time": "20:30",
        "entry": 25575.75,
        "stop": 25582.25,
        "tp": 25551.1125,
        "exit": 25600.75,
        "ticks": -26,
        "pnl": -130.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 28,
        "trigger": "AAA+",
        "dir": "SHORT",
        "date": "2026-01-14",
        "time": "22:25",
        "entry": 25597.75,
        "stop": 25611.25,
        "tp": 25581.55,
        "exit": 25581.5,
        "ticks": 12,
        "pnl": 300.0,
        "duration": 30,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 29,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-16",
        "time": "09:55",
        "entry": 25728.5,
        "stop": 25738.75,
        "tp": 25689.6875,
        "exit": 25755.25,
        "ticks": -41,
        "pnl": -205.0,
        "duration": 10,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 30,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-16",
        "time": "10:10",
        "entry": 25721.0,
        "stop": 25732.25,
        "tp": 25678.25,
        "exit": 25676.0,
        "ticks": 34,
        "pnl": 850.0,
        "duration": 5,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 31,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-18",
        "time": "23:35",
        "entry": 25393.0,
        "stop": 25421.5,
        "tp": 25331.8375,
        "exit": 25326.75,
        "ticks": 48,
        "pnl": 1200.0,
        "duration": 95,
        "reason": "TP",
        "win": true,
        "cycles": "3-Day, 6-Day"
      },
      {
        "n": 32,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-20",
        "time": "10:40",
        "entry": 25412.25,
        "stop": 25369.0,
        "tp": 25505.0625,
        "exit": 25351.0,
        "ticks": -173,
        "pnl": -865.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 33,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-21",
        "time": "06:45",
        "entry": 25089.5,
        "stop": 25096.0,
        "tp": 25064.3,
        "exit": 25045.5,
        "ticks": 20,
        "pnl": 500.0,
        "duration": 10,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 34,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-21",
        "time": "14:25",
        "entry": 25429.25,
        "stop": 25404.75,
        "tp": 25521.3875,
        "exit": 25548.25,
        "ticks": 73,
        "pnl": 1825.0,
        "duration": 15,
        "reason": "TP",
        "win": true,
        "cycles": "3-Day"
      },
      {
        "n": 35,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-22",
        "time": "00:40",
        "entry": 25544.0,
        "stop": 25547.0,
        "tp": 25532.45,
        "exit": 25517.0,
        "ticks": 9,
        "pnl": 225.0,
        "duration": 25,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 36,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-22",
        "time": "09:45",
        "entry": 25575.0,
        "stop": 25589.25,
        "tp": 25521.1125,
        "exit": 25621.75,
        "ticks": -57,
        "pnl": -285.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 37,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-22",
        "time": "09:55",
        "entry": 25578.0,
        "stop": 25595.25,
        "tp": 25513.05,
        "exit": 25623.0,
        "ticks": -69,
        "pnl": -345.0,
        "duration": 35,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 38,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-22",
        "time": "18:00",
        "entry": 25590.75,
        "stop": 25601.25,
        "tp": 25550.775,
        "exit": 25617.0,
        "ticks": -42,
        "pnl": -210.0,
        "duration": 20,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 39,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-22",
        "time": "19:00",
        "entry": 25610.5,
        "stop": 25617.75,
        "tp": 25582.675,
        "exit": 25622.25,
        "ticks": -29,
        "pnl": -145.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "6-Day"
      },
      {
        "n": 40,
        "trigger": "AAA+",
        "dir": "SHORT",
        "date": "2026-01-23",
        "time": "06:55",
        "entry": 25606.75,
        "stop": 25629.0,
        "tp": 25579.9375,
        "exit": 25629.25,
        "ticks": -89,
        "pnl": -445.0,
        "duration": 50,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 41,
        "trigger": "AAA+",
        "dir": "SHORT",
        "date": "2026-01-25",
        "time": "19:00",
        "entry": 25570.0,
        "stop": 25600.75,
        "tp": 25532.9125,
        "exit": 25607.0,
        "ticks": -123,
        "pnl": -615.0,
        "duration": 25,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day, 3-Day, 6-Day"
      },
      {
        "n": 42,
        "trigger": "AA",
        "dir": "LONG",
        "date": "2026-01-25",
        "time": "22:00",
        "entry": 25637.0,
        "stop": 25627.5,
        "tp": 25657.775,
        "exit": 25627.25,
        "ticks": -38,
        "pnl": -190.0,
        "duration": 65,
        "reason": "SL",
        "win": false,
        "cycles": "3-Day, 6-Day"
      },
      {
        "n": 43,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-26",
        "time": "01:00",
        "entry": 25685.75,
        "stop": 25680.0,
        "tp": 25707.575,
        "exit": 25678.25,
        "ticks": -23,
        "pnl": -115.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 44,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-26",
        "time": "01:10",
        "entry": 25687.25,
        "stop": 25682.0,
        "tp": 25707.2375,
        "exit": 25678.5,
        "ticks": -21,
        "pnl": -105.0,
        "duration": 20,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 45,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-26",
        "time": "07:00",
        "entry": 25695.0,
        "stop": 25690.75,
        "tp": 25711.3875,
        "exit": 25685.0,
        "ticks": -17,
        "pnl": -85.0,
        "duration": 20,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 46,
        "trigger": "A",
        "dir": "LONG",
        "date": "2026-01-26",
        "time": "08:45",
        "entry": 25697.25,
        "stop": 25692.25,
        "tp": 25716.375,
        "exit": 25727.25,
        "ticks": 15,
        "pnl": 375.0,
        "duration": 15,
        "reason": "TP",
        "win": true,
        "cycles": "1-Day"
      },
      {
        "n": 47,
        "trigger": "A",
        "dir": "SHORT",
        "date": "2026-01-26",
        "time": "19:00",
        "entry": 25877.5,
        "stop": 25882.75,
        "tp": 25856.95,
        "exit": 25884.5,
        "ticks": -21,
        "pnl": -105.0,
        "duration": 10,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day"
      },
      {
        "n": 48,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-28",
        "time": "11:40",
        "entry": 26122.5,
        "stop": 26144.25,
        "tp": 26075.6625,
        "exit": 26151.75,
        "ticks": -87,
        "pnl": -435.0,
        "duration": 30,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 49,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-28",
        "time": "14:25",
        "entry": 26122.75,
        "stop": 26137.0,
        "tp": 26091.775,
        "exit": 26151.25,
        "ticks": -57,
        "pnl": -285.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day, 3-Day"
      },
      {
        "n": 50,
        "trigger": "AA",
        "dir": "SHORT",
        "date": "2026-01-28",
        "time": "16:00",
        "entry": 26048.25,
        "stop": 26079.5,
        "tp": 25980.75,
        "exit": 26150.0,
        "ticks": -125,
        "pnl": -625.0,
        "duration": 5,
        "reason": "SL",
        "win": false,
        "cycles": "1-Day, 3-Day"
      }
    ]
  }
};

const ORB_BACKTESTS = [
  {
    id: "es-30m", label: "ES", sub: "380 Day", instrument: "ES",
    name: "E-mini S&P 500", timeframe: "30-min bars",
    period: "380 trading days", dates: "Sep 2025 – Apr 2026",
    netPnl: 261788, trades: 707, wins: 298, losses: 409,
    winRate: 42.2, profitFactor: 4.05, avgWin: 1147, avgLoss: 484,
    maxDrawdown: 12473, expectancy: 369, riskNote: null,
    curve: [3855,5319,14828,22012,69366,82240,91868,88781,93176,106297,104632,112786,110738,126890,138911,144463,154277,157290,158659,163335,172287,191920,207236,208368,235847,242438,251570,246532,240347,262890,261788],
  },
  {
    id: "nq-30m", label: "NQ", sub: "380 Day", instrument: "NQ",
    name: "E-mini Nasdaq-100", timeframe: "30-min bars",
    period: "380 trading days", dates: "Sep 2025 – Apr 2026",
    netPnl: 465796, trades: 477, wins: 196, losses: 281,
    winRate: 41.1, profitFactor: 3.60, avgWin: 1787, avgLoss: 826,
    maxDrawdown: 19186, expectancy: 684, riskNote: null,
    curve: [5353,6937,20915,29064,104119,118764,134559,133968,158398,175544,182979,199215,192865,231769,257508,261158,289742,287508,288295,301523,317758,357428,380712,386524,414760,435160,462424,454356,447714,467711,465796],
  },
  {
    id: "nq-1h", label: "NQ", sub: "360 Day", instrument: "NQ",
    name: "E-mini Nasdaq-100", timeframe: "60-min bars",
    period: "360 trading days", dates: "Jul 2024 – Mar 2026",
    netPnl: 1513320, trades: 1034, wins: 677, losses: 357,
    winRate: 65.5, profitFactor: 5.72, avgWin: 2708, avgLoss: 897,
    maxDrawdown: 13635, expectancy: 1464,
    riskNote: "Stop size is proportionally larger in dollar terms. Verify this fits within your maximum risk per trade before sizing your position.",
    curve: [-785,11915,39220,56065,63280,108935,137730,160395,186440,233285,240605,261845,291160,299020,324665,344920,357555,375640,397845,428060,433395,457855,476080,488790,520430,573960,648170,655890,715040,728635,750065,786245,836680,870905,882865,901345,940395,959530,992560,1034935,1073220,1162115,1215745,1259215,1302115,1339280,1410370,1440425,1474410,1499940,1498390,1512610,1513320],
  },
  {
    id: "rty-30m", label: "RTY", sub: "180 Day", instrument: "RTY",
    name: "E-mini Russell 2000", timeframe: "30-min bars",
    period: "180 trading days", dates: "Jul 10, 2025 – Mar 26, 2026",
    netPnl: 223060, trades: 734, wins: 418, losses: 316,
    winRate: 56.9, profitFactor: 3.50, avgWin: 748, avgLoss: 283,
    maxDrawdown: 4260, expectancy: 304, riskNote: null,
    curve: [-215,4735,8845,9095,16710,16385,22990,22270,25750,38310,41295,46830,50185,53305,56500,60580,61485,64195,69510,72450,77760,81690,83005,85950,92960,97400,99635,104885,106540,110835,113315,116900,125270,131550,135585,137805,142365,148730,149320,155480,160115,164990,166365,172835,187760,192540,198775,206375,212080,213790,218575,220290,220310,223060],
  },
  {
    id: "cl-1h", label: "CL", sub: "360 Day", instrument: "CL",
    name: "Crude Oil Futures", timeframe: "60-min bars",
    period: "360 trading days", dates: "Oct 2024 – Mar 2026",
    netPnl: 449750, trades: 1389, wins: 901, losses: 488,
    winRate: 64.9, profitFactor: 4.07, avgWin: 662, avgLoss: 300,
    maxDrawdown: 7960, expectancy: 324,
    riskNote: "Stop size is proportionally larger in dollar terms. Verify this fits within your maximum risk per trade before sizing your position.",
    curve: [-240,9960,22650,30110,47790,54760,60290,63950,72000,83040,85270,97920,105640,114180,121570,128810,137620,144330,151140,166920,176380,185920,197890,205880,210820,220670,228110,232640,250760,253560,266630,269200,271830,277570,281120,286340,294050,298950,303710,307140,315180,322210,323450,329240,331120,336440,350340,350350,346130,358590,359720,373220,437620,443450,449750],
  },
  {
    id: "vol-filtered", label: "VOL", sub: "Filtered", instrument: null,
    name: "Volatility Filtered", timeframe: null,
    comingSoon: true,
    description: [
      { heading: "What is Volatility Filtering?", body: "Not every breakout is worth taking. Volatility filtering screens each opening range for expansion conditions — entries are only triggered when intraday volatility confirms a directional move is underway, not just noise." },
      { heading: "Why it matters", body: "Fixed stops on a volatile day get wiped by normal price movement. Volatility-adjusted sizing respects what the market is actually doing — keeping risk consistent as a percentage of the move, not as an arbitrary number of ticks." },
    ],
    riskNote: null, curve: null,
  },
];

const BACKTEST_130D = {
  "ES": {
    "name": "E-mini S&P 500",
    "period": "130 trading days (Nov 2025 – Mar 2026)",
    "stop_ticks": 14, "tp_ticks": 25, "rr": 1.79,
    "overall": {
      "trades": 310, "wins": 137, "losses": 173,
      "win_rate": 44.2, "profit_factor": 1.41,
      "total_pnl": 12537.5, "max_drawdown": 2262.5,
      "equity": [0,-175,-350,-525,-700,-875,-562.5,-737.5,-425,-112.5,200,25,-150,-325,-500,-675,-362.5,-537.5,-712.5,-400,-575,-262.5,50,-125,-300,12.5,-162.5,-337.5,-25,-200,-375,-550,-237.5,-412.5,-587.5,-762.5,-937.5,-1112.5,-1287.5,-975,-1150,-1325,-1500,-1675,-1362.5,-1050,-737.5,-425,-112.5,-287.5,-462.5,-150,162.5,-12.5,300,125,-50,-225,-400,-575,-750,-925,-612.5,-787.5,-475,-162.5,-337.5,-512.5,-687.5,-375,-62.5,-237.5,75,-100,212.5,525,837.5,662.5,975,800,625,450,762.5,1075,1387.5,1212.5,1037.5,1350,1662.5,1487.5,1312.5,1137.5,962.5,787.5,612.5,437.5,750,575,400,225,537.5,362.5,187.5,500,325,637.5,462.5,287.5,112.5,425,250,562.5,875,700,1012.5,837.5,1150,1462.5,1775,1600,1425,1737.5,1562.5,1387.5,1700,2012.5,2325,2637.5,2950,3262.5,3087.5,3400,3712.5,3537.5,3362.5,3187.5,3012.5,2837.5,2662.5,2487.5,2312.5,2137.5,1962.5,1787.5,1612.5,1925,2237.5,2550,2375,2200,2512.5,2337.5,2162.5,2475,2300,2125,2437.5,2262.5,2087.5,1912.5,2225,2050,1875,1700,1525,1837.5,1662.5,1487.5,1800,1625,1450,1762.5,2075,2387.5,2700,2525,2837.5,2662.5,2487.5,2312.5,2137.5,1962.5,2275,2587.5,2900,2725,3037.5,2862.5,2687.5,3000,3312.5,3625,3450,3762.5,3587.5,3900,4212.5,4037.5,3862.5,3687.5,4000,3825,3650,3475,3300,3612.5,3925,3750,4062.5,3887.5,3712.5,4025,4337.5,4650,4962.5,4787.5,4612.5,4925,5237.5,5062.5,5375,5687.5,6000,6312.5,6137.5,5962.5,6275,6100,5925,5750,6062.5,6375,6687.5,6512.5,6825,6650,6962.5,6787.5,6612.5,6925,7237.5,7062.5,6887.5,7200,7025,7337.5,7162.5,6987.5,6812.5,6637.5,6950,6775,6600,6912.5,6737.5,6562.5,6387.5,6700,7012.5,7325,7150,7462.5,7287.5,7112.5,6937.5,6762.5,7075,7387.5,7212.5,7525,7350,7662.5,7487.5,7312.5,7625,7937.5,7762.5,7587.5,7900,8212.5,8037.5,8350,8662.5,8975,9287.5,9600,9912.5,10225,10537.5,10362.5,10675,10987.5,11300,11612.5,11437.5,11750,12062.5,12375,12200,12025,11850,11675,11500,11812.5,11637.5,11950,12262.5,12087.5,12400,12712.5,12537.5]
    }
  },
  "NQ": {
    "name": "E-mini Nasdaq-100",
    "period": "130 trading days (Nov 2025 – Mar 2026)",
    "stop_ticks": 16, "tp_ticks": 83, "rr": 5.19,
    "overall": {
      "trades": 320, "wins": 118, "losses": 202,
      "win_rate": 36.9, "profit_factor": 3.03,
      "total_pnl": 32810, "max_drawdown": 1810,
      "equity": [0,415,335,255,175,590,1005,1420,1835,1755,1675,1595,1515,1930,1850,1770,2185,2600,3015,2935,3350,3765,3685,4100,4515,4435,4850,4770,4690,4610,5025,4945,4865,4785,4705,4625,4545,4465,4385,4305,4225,4145,4065,3985,3905,4320,4240,4160,4080,4495,4415,4335,4255,4175,4095,4015,3935,3855,3775,3695,3615,3535,3455,3375,3295,3215,3630,3550,3965,4380,4795,4715,5130,5050,5465,5385,5305,5225,5145,5560,5975,5895,6310,6230,6150,6565,6980,6900,6820,6740,6660,6580,6500,6420,6340,6260,6675,6595,6515,6435,6355,6275,6690,6610,6530,6450,6370,6290,6210,6130,6545,6960,7375,7295,7215,7630,7550,7470,7390,7310,7230,7150,7070,6990,6910,6830,6750,7165,7085,7005,7420,7835,7755,7675,7595,7515,7435,7850,7770,7690,8105,8025,7945,8360,8280,8200,8120,8040,7960,7880,8295,8215,8135,8055,7975,7895,8310,8230,8150,8565,8485,8405,8325,8245,8165,8580,8500,8915,9330,9250,9170,9585,10000,10415,10830,10750,11165,11085,11500,11915,12330,12745,12665,13080,13495,13910,13830,14245,14660,14580,14500,14915,14835,15250,15170,15090,15505,15920,16335,16750,17165,17085,17500,17915,17835,18250,18665,18585,18505,18425,18345,18265,18680,18600,19015,18935,18855,18775,19190,19110,19525,19445,19860,19780,20195,20610,20530,20945,20865,21280,21695,22110,22525,22940,22860,23275,23195,23610,23530,23450,23370,23290,23705,24120,24040,24455,24870,24790,24710,25125,25045,24965,24885,24805,24725,24645,24565,24485,24405,24820,24740,25155,25570,25985,25905,26320,26240,26655,26575,26990,27405,27325,27740,27660,27580,27500,27420,27340,27755,28170,28585,28505,28425,28345,28760,29175,29590,29510,29925,29845,29765,30180,30100,30515,30930,31345,31265,31680,31600,31520,31440,31360,31280,31695,31615,31535,31455,31375,31790,32205,32125,32045,31965,31885,32300,32220,32140,32060,32475,32890,32810]
    }
  }
};

function LandingPage({ onNavigate, onNavigateCalc, t, track, setTrack }) {
  const [signalCount] = useState(47 + Math.floor(Math.random() * 12));
  const [demoRR, setDemoRR]         = useState("2.5");
  const [lpBtInst, setLpBtInst]     = useState("ES");
  const [lpBt130Inst, setLpBt130Inst] = useState("NQ");
  const [calcEmail, setCalcEmail]   = useState("");
  const [calcSent, setCalcSent]     = useState(false);
  const [heroPhase, setHeroPhase]   = useState(0); // 0=question, 1=headline A, 2=headline B, 3=headline C

  useEffect(() => {
    const t1 = setTimeout(() => setHeroPhase(1), 4500);
    const t2 = setTimeout(() => setHeroPhase(2), 9500);
    const t3 = setTimeout(() => setHeroPhase(3), 14500);
    const iv = setInterval(() => {
      setHeroPhase(p => p === 1 ? 2 : p === 2 ? 3 : 1);
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(iv); };
  }, []);

  return (
    <div style={{ width:"100%", overflowX:"hidden" }}>
      <PriceTicker />

      {/* Hero — always shown first */}
      <div style={{ minHeight:"92vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"80px 24px" }}>
        <div style={{ fontSize:15, letterSpacing:"0.15em", color:track==="forex"?C.accent:C.long, textTransform:"uppercase", marginBottom:20, display:"flex", alignItems:"center", gap:10, fontFamily:"monospace", fontWeight:600 }}>
          <LiveDot color={track==="forex"?C.accent:C.long} size={8} />
          {track==="forex" ? t.forexTagline : track==="futures" ? t.tagline : t.engineTagline}
        </div>
        <div style={{ marginBottom:24, transition:"opacity 0.8s ease", opacity: heroPhase===1 ? 1 : 0 }}><SignalCounter count={signalCount} /></div>
        <div style={{ display:"grid", placeItems:"center", width:"100%", maxWidth:800, marginBottom:24 }}>
          {/* Phase 0 — Question */}
          <div style={{ gridArea:"1/1", width:"100%", textAlign:"center", transition:"opacity 0.8s ease", opacity: heroPhase===0 ? 1 : 0, pointerEvents: heroPhase===0 ? "auto" : "none" }}>
            <p style={{ fontSize:"clamp(13px,1.4vw,17px)", color:C.accent, fontStyle:"italic", marginBottom:16, letterSpacing:"0.08em", fontFamily:"monospace", textTransform:"uppercase" }}>Ask yourself a simple question:</p>
            <h1 style={{ fontSize:"clamp(28px,4vw,54px)", fontWeight:700, lineHeight:1.2, letterSpacing:"-0.03em", color:"#ffffff" }}>
              If charts alone were the answer…<br />why are you not already generating<br /><span style={{ color:C.long }}>consistent wealth</span> using them?
            </h1>
          </div>
          {/* Phase 1 — Headline A */}
          <div style={{ gridArea:"1/1", width:"100%", textAlign:"center", transition:"opacity 0.8s ease", opacity: heroPhase===1 ? 1 : 0, pointerEvents: heroPhase===1 ? "auto" : "none" }}>
            <h1 style={{ fontSize: !track ? "clamp(28px,4vw,54px)" : "clamp(44px,6.5vw,86px)", fontWeight:700, lineHeight:1.15, letterSpacing:"-0.04em" }}>
              {track==="forex"
                ? <>{t.forexHeroTitle1}<br /><span style={{ color:C.accent }}>{t.forexHeroTitle2}</span></>
                : track==="futures"
                ? <>{t.heroTitle1}<br /><span style={{ color:C.accent }}>{t.heroTitle2}</span></>
                : <>{t.chooserTitle1}<br /><span style={{ color:C.accent }}>{t.chooserTitle3}</span></>}
            </h1>
          </div>
          {/* Phase 2 — Headline B */}
          <div style={{ gridArea:"1/1", width:"100%", textAlign:"center", transition:"opacity 0.8s ease", opacity: heroPhase===2 ? 1 : 0, pointerEvents: heroPhase===2 ? "auto" : "none" }}>
            <h1 style={{ fontSize:"clamp(28px,4vw,54px)", fontWeight:700, lineHeight:1.2, letterSpacing:"-0.04em" }}>
              If charts aren't making you consistently profitable...<br />
              <span style={{ color:C.long }}>don't worry — we have a solution.</span>
            </h1>
          </div>
          {/* Phase 3 — Headline C */}
          <div style={{ gridArea:"1/1", width:"100%", textAlign:"center", transition:"opacity 0.8s ease", opacity: heroPhase===3 ? 1 : 0, pointerEvents: heroPhase===3 ? "auto" : "none" }}>
            <h1 style={{ fontSize:"clamp(28px,4vw,54px)", fontWeight:700, lineHeight:1.2, letterSpacing:"-0.04em" }}>
              Simplified for people with real lives,<br />
              <span style={{ color:C.long }}>real bills, and real reasons to get this right.</span>
            </h1>
          </div>
        </div>
        <div style={{ fontSize:"clamp(15px,1.6vw,19px)", color:"#d0e4e4", maxWidth:660, lineHeight:1.85, marginBottom:48, fontWeight:400, textAlign:"center", whiteSpace:"pre-line" }}>
          {t.chooserSub}
        </div>
        <div style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={() => window.location.href="mailto:info@signalboss.net?subject=Signal%20Boss%20Inquiry"} style={{ padding:"15px 42px", background:C.accent, color:"#080909", border:"none", borderRadius:8, fontWeight:700, fontSize:15, cursor:"pointer", letterSpacing:"0.06em" }}>LET'S TALK</button>
          <button onClick={() => onNavigate(track==="forex" ? "forex-demo" : track==="futures" ? "futures-demo" : "demo-chooser")} style={{ padding:"15px 36px", background:"transparent", color:C.long, border:`1px solid ${C.long}`, borderRadius:8, fontWeight:500, fontSize:14, cursor:"pointer" }}>{t.viewDemo}</button>
        </div>

      </div>

      {/* ── Backtest Results ──────────────────────────────────────────── */}
      {(() => {
        const _orbMap = { ES: ORB_BACKTESTS.find(b=>b.id==="es-30m"), NQ: ORB_BACKTESTS.find(b=>b.id==="nq-30m") };
        const lpBt = _orbMap[lpBtInst];
        const pts  = lpBt.curve || [];
        return (
        <div style={{ background:`linear-gradient(180deg, ${C.bg} 0%, ${C.silver} 8%, ${C.silver} 92%, ${C.bg} 100%)`, width:"100%", borderTop:`1px solid ${C.silverBorder}`, borderBottom:`1px solid ${C.silverBorder}` }}>
        <div style={{ maxWidth:960, margin:"0 auto", padding:"60px 24px 80px" }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ fontSize:10, letterSpacing:"0.25em", color:C.accent, fontFamily:"monospace", marginBottom:14 }}>{t.backtestLabel}</div>
            <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.03em", marginBottom:12 }}>
              {t.realNumbers}<br/><span style={{ color:C.long }}>{t.realData}</span>
            </h2>
            <p style={{ color:C.textMid, fontSize:14, maxWidth:560, margin:"0 auto 24px", lineHeight:1.7 }}>
              Signal performance · 380 trading days · Sep 2025 – Apr 2026
            </p>
            {/* Instrument cards */}
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              {[
                { sym:"ES", label:"E-mini S&P 500",   pnl:"+$261,788", wr:"42.2%", pf:"4.05x", dd:"$12,473", ev:"+$369", color:C.accent },
                { sym:"NQ", label:"E-mini Nasdaq-100", pnl:"+$465,796", wr:"41.1%", pf:"3.60x", dd:"$19,186", ev:"+$684", color:C.long },
              ].map(({ sym, label, pnl, wr, pf, dd, ev, color }) => {
                const active = lpBtInst === sym;
                return (
                  <button key={sym} onClick={() => setLpBtInst(sym)} style={{
                    padding:"20px 24px", borderRadius:14, cursor:"pointer", textAlign:"left",
                    background: active ? `linear-gradient(135deg, ${color}12, ${color}08)` : C.silverUp,
                    border: `1.5px solid ${active ? color : C.silverBorder}`,
                    boxShadow: active ? `0 0 28px ${color}30, 0 4px 16px ${color}18, inset 0 1px 0 ${color}20` : `inset 0 1px 0 ${C.silverBorder}`,
                    transition:"all 0.18s", minWidth:200, flex:"1 1 200px", maxWidth:300,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:18, fontWeight:800, fontFamily:"monospace", color: active ? color : C.text }}>{sym}</span>
                      <span style={{ fontSize:9, fontFamily:"monospace", fontWeight:700, color, background:color+"1a", padding:"2px 8px", borderRadius:4, border:`1px solid ${color}33` }}>180-Day Backtest</span>
                    </div>
                    <div style={{ fontSize:11, color:C.textDim, marginBottom:10 }}>{label}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 14px" }}>
                      {[
                        { l:"NET P&L",      v:pnl, c:C.long },
                        { l:"WIN RATE",     v:wr,  c:active ? color : C.text },
                        { l:"PROF. FACTOR", v:pf,  c:active ? color : C.text },
                        { l:"EXPECTANCY",   v:ev,  c:C.long },
                      ].map(({ l, v, c }) => (
                        <div key={l}>
                          <div style={{ fontSize:8, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.08em" }}>{l}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:c, fontFamily:"monospace" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {active && (
                      <div style={{ marginTop:10, fontSize:9, color:color, fontFamily:"monospace", fontWeight:600, letterSpacing:"0.06em" }}>● VIEWING RESULTS BELOW</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stat callouts */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:36 }}>
            {[
              { label:"EXPECTANCY / SIGNAL", value: lpBtInst==="ES" ? "+$369" : "+$684",   sub:"avg $ captured per signal taken",   color:C.long },
              { label:"PROFIT FACTOR",       value:`${lpBt.profitFactor}x`,                sub:"gross wins ÷ gross losses",         color:C.accent },
              { label:"NET P&L",             value:`+$${lpBt.netPnl.toLocaleString()}`,    sub:`${lpBt.trades} signals · 380 days`, color:C.long },
              { label:"MAX DRAWDOWN",        value:`$${lpBt.maxDrawdown.toLocaleString()}`,sub:"peak-to-trough",                    color:C.warn },
              { label:"WIN RATE",            value:`${lpBt.winRate}%`,                     sub:`${lpBt.wins}W / ${lpBt.losses}L`,   color:C.textMid },
            ].map(s => (
              <div key={s.label} style={{ background:C.silverUp, border:`1px solid ${C.silverBorder}`, borderRadius:12, padding:"18px 20px", textAlign:"center", boxShadow:`inset 0 1px 0 ${C.silverBorder}` }}>
                <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize:26, fontWeight:700, color:s.color, fontFamily:"monospace", letterSpacing:"-0.02em" }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.textDim, marginTop:5 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Micro toggle */}
          {(() => {
            const microMap = { ES:"MES", NQ:"MNQ" };
            const micro = microMap[lpBtInst];
            const fullPnl = lpBtInst==="ES" ? 261788 : 465796;
            const fullDd  = lpBtInst==="ES" ? 12473  : 19186;
            const fullEv  = lpBtInst==="ES" ? 369    : 684;
            return (
              <div style={{ marginTop:16, background:C.accentDim, border:`1px solid ${C.accent}33`, borderRadius:10, padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
                <div>
                  <span style={{ fontSize:11, color:C.accent, fontFamily:"monospace", fontWeight:700, letterSpacing:"0.1em" }}>MICRO CONTRACT ({micro})</span>
                  <span style={{ fontSize:12, color:C.textMid, marginLeft:12, fontFamily:"monospace" }}>Same signals · 1/10 the size</span>
                </div>
                <div style={{ display:"flex", gap:20 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:3 }}>NET P&L</div>
                    <div style={{ fontSize:15, fontWeight:700, color:C.long, fontFamily:"monospace" }}>+${Math.round(fullPnl/10).toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:3 }}>MAX DD</div>
                    <div style={{ fontSize:15, fontWeight:700, color:C.short, fontFamily:"monospace" }}>${Math.round(fullDd/10).toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:3 }}>EXPECTANCY</div>
                    <div style={{ fontSize:15, fontWeight:700, color:C.long, fontFamily:"monospace" }}>+${Math.round(fullEv/10)}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Equity curve */}
          {pts.length > 1 && (() => {
            const lo    = Math.min(0, ...pts);
            const hi    = Math.max(...pts);
            const span  = hi - lo || 1;
            const W = 880, H = 180, pad = 10;
            const xStep = (W - pad*2) / (pts.length - 1);
            const toY   = v => H - pad - ((v - lo) / span) * (H - pad*2);
            const zero  = toY(0);
            const pathD = pts.map((v,i) => `${i===0?"M":"L"}${pad+i*xStep},${toY(v)}`).join(" ");
            const fillD = `${pathD} L${pad+(pts.length-1)*xStep},${H-pad} L${pad},${H-pad} Z`;
            return (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 28px", marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>Equity Curve</div>
                    <div style={{ fontSize:12, color:C.textMid, marginTop:3 }}>Cumulative P&L · 1 contract · {lpBt.period}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:20, fontWeight:700, color:C.long, fontFamily:"monospace" }}>+${lpBt.netPnl.toLocaleString()}</div>
                    <div style={{ fontSize:11, color:C.textDim }}>{lpBt.dates}</div>
                  </div>
                </div>
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:H, display:"block" }}>
                  <defs>
                    <linearGradient id="lp-eq-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.long} stopOpacity="0.20"/>
                      <stop offset="100%" stopColor={C.long} stopOpacity="0.02"/>
                    </linearGradient>
                  </defs>
                  <line x1={pad} y1={zero} x2={W-pad} y2={zero} stroke={C.border} strokeWidth="1" strokeDasharray="4,4"/>
                  <text x={pad+2} y={zero-5} fontSize="9" fill={C.textDim} fontFamily="monospace">$0</text>
                  <path d={fillD} fill="url(#lp-eq-fill)"/>
                  <path d={pathD} fill="none" stroke={C.long} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
                <div style={{ display:"flex", gap:16, marginTop:10, fontSize:11, color:C.textDim, fontFamily:"monospace" }}>
                  <span style={{ color:C.long }}>● {lpBt.wins} wins</span>
                  <span style={{ color:C.short }}>● {lpBt.losses} losses</span>
                  <span style={{ marginLeft:"auto" }}>Zero line = breakeven · {lpBt.trades} total signals</span>
                </div>
              </div>
            );
          })()}

          {/* Teaser row + CTA */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:28 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{t.backtestDesc}</div>
              <div style={{ fontSize:12, color:C.textMid }}>{t.backtestDescSub}</div>
            </div>
            <button onClick={() => onNavigate("signup")} style={{ padding:"12px 28px", background:C.accent, color:"#080909", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
              Get Started →
            </button>
          </div>

          {/* Disclaimer */}
          <div style={{ fontSize:11, color:C.textDim, lineHeight:1.7, textAlign:"center", maxWidth:720, margin:"0 auto" }}>
            <strong>Hypothetical performance disclosure:</strong> These backtests do not factor in commissions or slippage. The Signal Boss methodology has shown comparable performance in live market conditions — we attribute this in large part to volatility-based stop and target placement. Most trading systems rely on ATR, fixed percentages, or dollar amounts: risk parameters anchored to backward-facing data. Signal Boss derives stop and target levels from current market conditions — what the market is actually doing right now. Past performance is not indicative of future results. All trading involves risk of loss. For educational purposes only. Not financial advice.
          </div>
        </div>
        </div>
        );
      })()}

      {/* ── Extended Backtest — 130 Days ──────────────────────────────────── */}
      {(() => {
        const _360Map = { NQ: ORB_BACKTESTS.find(b=>b.id==="nq-1h"), CL: ORB_BACKTESTS.find(b=>b.id==="cl-1h") };
        const bt  = _360Map[lpBt130Inst] || _360Map["NQ"];
        const pts = bt.curve || [];
        return (
        <div style={{ background:`linear-gradient(180deg, ${C.bg} 0%, #0d1a28 8%, #0d1a28 92%, ${C.bg} 100%)`, width:"100%", borderTop:`1px solid #1a3050`, borderBottom:`1px solid #1a3050` }}>
        <div style={{ maxWidth:960, margin:"0 auto", padding:"60px 24px 80px" }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ fontSize:10, letterSpacing:"0.25em", color:C.accent, fontFamily:"monospace", marginBottom:14 }}>EXTENDED BACKTEST — 360 DAYS</div>
            <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.03em", marginBottom:12 }}>
              Deeper Data. Wider Picture.<br/><span style={{ color:C.long }}>NQ &amp; CL · Jul 2024 – Mar 2026</span>
            </h2>
            <p style={{ color:C.textMid, fontSize:14, maxWidth:600, margin:"0 auto 24px", lineHeight:1.7 }}>
              Full-year signal performance across two uncorrelated futures markets — equity index and energy.<br/>
              <span style={{ color:C.accent, fontWeight:600 }}>Results based on 1 contract.</span> Prop firm traders: consider micro contracts (MNQ/MCL) to manage evaluation risk.
            </p>
            {/* Instrument selector */}
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              {[
                { sym:"NQ", label:"E-mini Nasdaq-100", pnl:"+$1,513,320", ev:"+$1,464", pf:"5.72x", dd:"$13,635", wr:"65.5%", color:C.long },
                { sym:"CL", label:"Crude Oil Futures",  pnl:"+$449,750",   ev:"+$324",   pf:"4.07x", dd:"$7,960",  wr:"64.9%", color:C.accent },
              ].map(({ sym, label, pnl, ev, pf, dd, wr, color }) => {
                const active = lpBt130Inst === sym;
                return (
                  <button key={sym} onClick={() => setLpBt130Inst(sym)} style={{
                    padding:"20px 24px", borderRadius:14, cursor:"pointer", textAlign:"left",
                    background: active ? `linear-gradient(135deg, ${color}12, ${color}08)` : "#101e2e",
                    border: `1.5px solid ${active ? color : "#1a3050"}`,
                    boxShadow: active ? `0 0 28px ${color}30, 0 4px 16px ${color}18, inset 0 1px 0 ${color}20` : `inset 0 1px 0 #1a3050`,
                    transition:"all 0.18s", minWidth:200, flex:"1 1 200px", maxWidth:320,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:18, fontWeight:800, fontFamily:"monospace", color: active ? color : C.text }}>{sym}</span>
                      <span style={{ fontSize:9, fontFamily:"monospace", fontWeight:700, color, background:color+"1a", padding:"2px 8px", borderRadius:4, border:`1px solid ${color}33` }}>360-Day Backtest</span>
                    </div>
                    <div style={{ fontSize:11, color:C.textDim, marginBottom:10 }}>{label}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 14px" }}>
                      {[
                        { l:"NET P&L",     v:pnl, c:C.long },
                        { l:"EXP. VALUE",  v:ev,  c:active ? color : C.text },
                        { l:"PROF. FACTOR",v:pf,  c:active ? color : C.text },
                        { l:"MAX DD",      v:dd,  c:C.warn },
                      ].map(({ l, v, c }) => (
                        <div key={l}>
                          <div style={{ fontSize:8, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.08em" }}>{l}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:c, fontFamily:"monospace" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {active && <div style={{ marginTop:10, fontSize:9, color, fontFamily:"monospace", fontWeight:600, letterSpacing:"0.06em" }}>● VIEWING RESULTS BELOW</div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stat callouts */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:36 }}>
            {[
              { label:"EXPECTANCY / SIGNAL", value:`+$${bt.expectancy.toLocaleString()}`,  sub:"avg $ captured per signal taken",  color:C.long },
              { label:"PROFIT FACTOR",       value:`${bt.profitFactor}x`,                  sub:"gross wins ÷ gross losses",        color:C.accent },
              { label:"NET P&L",             value:`+$${bt.netPnl.toLocaleString()}`,      sub:`${bt.trades} signals · 360 days`,  color:C.long },
              { label:"MAX DRAWDOWN",        value:`$${bt.maxDrawdown.toLocaleString()}`,  sub:"peak-to-trough",                   color:C.warn },
              { label:"WIN RATE",            value:`${bt.winRate}%`,                       sub:`${bt.wins}W / ${bt.losses}L`,      color:C.textMid },
            ].map(s => (
              <div key={s.label} style={{ background:"#101e2e", border:`1px solid #1a3050`, borderRadius:12, padding:"18px 20px", textAlign:"center", boxShadow:`inset 0 1px 0 #1a3050` }}>
                <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize: s.value.length > 8 ? 19 : 26, fontWeight:700, color:s.color, fontFamily:"monospace", letterSpacing:"-0.02em" }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.textDim, marginTop:5 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Equity curve */}
          {pts.length > 1 && (() => {
            const lo    = Math.min(0, ...pts);
            const hi    = Math.max(...pts);
            const span  = hi - lo || 1;
            const W = 880, H = 200, pad = 10;
            const xStep = (W - pad*2) / (pts.length - 1);
            const toY   = v => H - pad - ((v - lo) / span) * (H - pad*2);
            const zero  = toY(0);
            const pathD = pts.map((v,i) => `${i===0?"M":"L"}${pad+i*xStep},${toY(v)}`).join(" ");
            const fillD = `${pathD} L${pad+(pts.length-1)*xStep},${H-pad} L${pad},${H-pad} Z`;
            return (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 28px", marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>Equity Curve</div>
                    <div style={{ fontSize:12, color:C.textMid, marginTop:3 }}>Cumulative P&L · 1 contract · {bt.period}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:20, fontWeight:700, color:C.long, fontFamily:"monospace" }}>+${bt.netPnl.toLocaleString()}</div>
                    <div style={{ fontSize:11, color:C.textDim }}>{bt.dates}</div>
                  </div>
                </div>
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:H, display:"block" }}>
                  <defs>
                    <linearGradient id="bt130-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.long} stopOpacity="0.18"/>
                      <stop offset="100%" stopColor={C.long} stopOpacity="0.02"/>
                    </linearGradient>
                  </defs>
                  <line x1={pad} y1={zero} x2={W-pad} y2={zero} stroke={C.border} strokeWidth="1" strokeDasharray="4,4"/>
                  <text x={pad+2} y={zero-5} fontSize="9" fill={C.textDim} fontFamily="monospace">$0</text>
                  <path d={fillD} fill="url(#bt130-fill)"/>
                  <path d={pathD} fill="none" stroke={C.long} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
                <div style={{ display:"flex", gap:16, marginTop:10, fontSize:11, color:C.textDim, fontFamily:"monospace" }}>
                  <span style={{ color:C.long }}>● {bt.wins} wins</span>
                  <span style={{ color:C.short }}>● {bt.losses} losses</span>
                  <span style={{ marginLeft:"auto" }}>Zero line = breakeven · {bt.trades} total signals</span>
                </div>
              </div>
            );
          })()}

          {/* Disclaimer */}
          <div style={{ fontSize:11, color:C.textDim, lineHeight:1.7, textAlign:"center", maxWidth:720, margin:"0 auto" }}>
            These backtests do not factor in commissions or slippage. The Signal Boss methodology has shown comparable performance in live market conditions — we attribute this in large part to volatility-based stop and target placement. Most trading systems rely on ATR, fixed percentages, or dollar amounts: risk parameters anchored to backward-facing data. Signal Boss derives stop and target levels from what the market is doing right now — not what it did last week. Forward performance will vary. Past results do not guarantee future returns.
          </div>
        </div>
        </div>
        );
      })()}

      {/* ── Calculator Lead Banner ─────────────────────────────────────────── */}
      {!calcSent && (
        <div style={{ maxWidth:880, margin:"0 auto", padding:"0 24px 40px" }}>
          <div style={{ background:`linear-gradient(135deg, #0d0f14, #0a1628)`, border:`1px solid ${C.prop}44`, borderRadius:14, padding:"24px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div style={{ flex:1, minWidth:260 }}>
              <div style={{ fontSize:10, color:C.prop, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:6 }}>FREE FOR PROP FIRM & RETAIL TRADERS</div>
              <div style={{ fontSize:17, fontWeight:700, marginBottom:4 }}>Risk Management Calculator — <span style={{ color:C.prop }}>No subscription required.</span></div>
              <div style={{ fontSize:12, color:C.textMid }}>Position sizing · Drawdown limits · Loss to ruin · Pip & tick values · For futures and forex prop challenges</div>
            </div>
            <form onSubmit={e => { e.preventDefault(); setCalcSent(true); onNavigateCalc(calcEmail); }} style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap" }}>
              <input type="email" required value={calcEmail} onChange={e => setCalcEmail(e.target.value)} placeholder="your@email.com"
                style={{ padding:"10px 14px", background:"#0d1117", border:`1px solid ${C.prop}66`, borderRadius:7, color:C.text, fontSize:13, fontFamily:"monospace", outline:"none", width:220 }} />
              <button type="submit" style={{ padding:"10px 20px", background:C.prop, color:"#fff", border:"none", borderRadius:7, fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
                Get Free Access →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Choose Your Track — moved below hero */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"0 24px 100px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:12 }}>{t.chooseTrackLabel}</div>
          <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.03em" }}>{t.chooseTrackTitle}</h2>
        </div>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center" }}>
          {/* Futures */}
          <div onClick={() => { setTrack("futures"); window.scrollTo({top:0, behavior:"smooth"}); }}
            style={{ flex:1, minWidth:300, background:C.surface, border:`1px solid ${C.long}44`, borderRadius:16, padding:36, cursor:"pointer", textAlign:"left", transition:"all 0.2s", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${C.long}, ${C.accent})` }} />
            <div style={{ fontSize:13, fontWeight:700, color:C.long, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:16 }}>{t.exploreFuturesLabel}</div>
            <h3 style={{ fontSize:22, fontWeight:700, marginBottom:14, letterSpacing:"-0.02em" }}>{t.futuresHeadline}</h3>
            <p style={{ fontSize:14, color:C.textMid, lineHeight:1.75, marginBottom:24 }}>{t.futuresDesc}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
              {t.futuresFeatures.map(item => (
                <div key={item} style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ color:C.long, fontSize:12 }}>✓</span>
                  <span style={{ fontSize:13, color:"#c9cdd6", fontFamily:"monospace" }}>{item}</span>
                </div>
              ))}
            </div>
            <span style={{ fontSize:16, color:C.long, fontWeight:700 }}>{t.exploreFutures}</span>
          </div>
          {/* Forex */}
          <div onClick={() => { setTrack("forex"); window.scrollTo({top:0, behavior:"smooth"}); }}
            style={{ flex:1, minWidth:300, background:C.surface, border:`1px solid ${C.accent}44`, borderRadius:16, padding:36, cursor:"pointer", textAlign:"left", transition:"all 0.2s", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${C.accent}, #a78bfa)` }} />
            <div style={{ fontSize:13, fontWeight:700, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:16 }}>{t.exploreForexLabel}</div>
            <h3 style={{ fontSize:22, fontWeight:700, marginBottom:14, letterSpacing:"-0.02em" }}>{t.forexHeadline}</h3>
            <p style={{ fontSize:14, color:C.textMid, lineHeight:1.75, marginBottom:24 }}>{t.forexDesc}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
              {t.forexFeatures.map(item => (
                <div key={item} style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ color:C.accent, fontSize:12 }}>✓</span>
                  <span style={{ fontSize:13, color:"#c9cdd6", fontFamily:"monospace" }}>{item}</span>
                </div>
              ))}
            </div>
            <span style={{ fontSize:16, color:C.accent, fontWeight:700 }}>{t.exploreForex}</span>
          </div>
        </div>
        <p style={{ fontSize:12, color:C.textDim, marginTop:28, textAlign:"center" }}>{t.trialNote}</p>
      </div>

      {/* Methodology */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"0 24px 80px" }}>
        <div style={{ background:`linear-gradient(135deg, #0c0e10, #0a0e0c)`, border:`1px solid ${C.long}22`, borderRadius:16, padding:40 }}>
          <div style={{ fontSize:10, color:C.long, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:16 }}>{t.methodologyLabel}</div>
          <h2 style={{ fontSize:26, fontWeight:700, letterSpacing:"-0.03em", marginBottom:20, maxWidth:600 }}>
            {t.methodologyTitle}<br /><span style={{ color:C.accent }}>{t.methodologyAccent}</span>
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", gap:24, marginBottom:32 }}>
            {t.methodology.map(m => {
              const colMap = { long: C.long, accent: C.accent, prop: C.prop };
              const col = colMap[m.color] || m.color;
              return (
                <div key={m.label} style={{ borderLeft:`2px solid ${col}44`, paddingLeft:16 }}>
                  <div style={{ fontSize:10, color:col, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:8 }}>{m.icon} {m.label.toUpperCase()}</div>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:8, color:C.text }}>{m.title}</div>
                  <div style={{ fontSize:13, color:C.textMid, lineHeight:1.75 }}>{m.body}</div>
                </div>
              );
            })}
          </div>
          <div style={{ background:C.bg, borderRadius:10, padding:"16px 20px", borderLeft:`3px solid ${C.accent}` }}>
            <p style={{ fontSize:14, color:C.text, lineHeight:1.8, fontStyle:"italic" }}>
              "{t.methodologyQuote}"
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" style={{ maxWidth:880, margin:"0 auto", padding:"0 24px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:14 }}>{t.methodologyLabel}</div>
          <h2 style={{ fontSize:32, fontWeight:700, letterSpacing:"-0.03em", marginBottom:0 }}>{t.methodologyTitle}</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", gap:16 }}>
          {["01","02","03","04"].map(n => (
            <div key={n} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontSize:11, color:C.accent, fontFamily:"monospace", marginBottom:10 }}>{n}</div>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:8 }}>{t.features[n].title}</div>
              <div style={{ color:C.textMid, fontSize:13, lineHeight:1.7, whiteSpace:"pre-line" }}>{t.features[n].desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Founder Section */}
      <div style={{ background:`linear-gradient(180deg, ${C.bg} 0%, ${C.silver} 10%, ${C.silver} 90%, ${C.bg} 100%)`, width:"100%", borderTop:`1px solid ${C.silverBorder}`, borderBottom:`1px solid ${C.silverBorder}` }}>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"60px 24px 100px" }}>
        <div style={{ borderLeft:`3px solid ${C.accent}`, paddingLeft:32 }}>
          <div style={{ fontSize:22, fontWeight:800, color:C.accent, fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:28, textTransform:"uppercase" }}>{t.whyBuilt}</div>

          {/* Opening punch */}
          <p style={{ fontSize:28, fontWeight:700, color:C.text, lineHeight:1.5, marginBottom:24, letterSpacing:"-0.02em" }}>
            {t.whyHeadline}
          </p>

          {/* Gym analogy */}
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:28 }}>
            {t.whyGym}
          </p>

          <p style={{ fontSize:20, fontWeight:600, color:"#c9cdd6", lineHeight:1.6, marginBottom:8, letterSpacing:"-0.01em" }}>
            {t.whyChartsShowa}<br />
            <span style={{ color:C.text }}>{t.whyChartsShowb}</span>
          </p>

          <p style={{ fontSize:18, fontWeight:600, color:C.accent, lineHeight:1.6, marginBottom:32, letterSpacing:"-0.01em" }}>
            {t.whyProblemTitle}
          </p>

          {/* The reframe */}
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:16 }}>
            {t.whyProblemBody}
          </p>
          <p style={{ fontSize:17, color:C.text, fontWeight:600, lineHeight:1.9, marginBottom:32 }}>
            {t.whyIntuitive}
          </p>
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:32 }}>
            {t.whyVolatility}
          </p>

          {/* Stacked rhythm lines */}
          <div style={{ margin:"0 0 28px 0", paddingLeft:20, borderLeft:`2px solid ${C.border}` }}>
            {(t.whyRhythm || []).map(line => (
              <p key={line} style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.7, marginBottom:6 }}>{line}</p>
            ))}
            <p style={{ fontSize:17, color:C.text, fontWeight:600, lineHeight:1.7, marginTop:10 }}>{t.whyForwardLooking}</p>
          </div>

          {/* How Signal Boss fits */}
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:8 }}>
            {t.whyReplace}
          </p>
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:28 }}>
            {t.whyWhenFires}
          </p>

          {/* Three components */}
          <p style={{ fontSize:17, color:C.text, fontWeight:600, lineHeight:1.9, marginBottom:14 }}>
            {t.whyThreeComponents}
          </p>
          <div style={{ margin:"0 0 28px 0", display:"flex", flexDirection:"column", gap:10 }}>
            {(t.whyThreeItems || []).map(item => (
              <div key={item} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ color:C.accent, fontSize:14 }}>◆</span>
                <span style={{ fontSize:16, fontWeight:600, color:C.text, fontFamily:"monospace" }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize:15, color:C.textMid, lineHeight:1.9, marginBottom:32 }}>
            {t.whyNotJust}
          </p>

          {/* Premise */}
          <div style={{ background:C.bg, borderRadius:10, padding:"18px 22px", borderLeft:`3px solid ${C.accent}`, marginBottom:32 }}>
            <p style={{ fontSize:15, color:C.text, lineHeight:1.8, fontStyle:"italic", margin:0 }}>
              {t.whyQuote}
            </p>
          </div>

          {/* The gut-punch question */}
          <div style={{ background:`linear-gradient(135deg, #0c0e10, #0a0c0e)`, border:`1px solid ${C.accent}22`, borderRadius:12, padding:"24px 28px", marginBottom:28 }}>
            <p style={{ fontSize:15, color:C.textMid, lineHeight:1.8, marginBottom:10 }}>{t.whyAskSimple}</p>
            <p style={{ fontSize:18, fontWeight:600, color:C.text, lineHeight:1.7, marginBottom:0, fontStyle:"italic" }}>
              {t.whyAskQuestion}
            </p>
          </div>

          {/* Closing */}
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:8 }}>
            {t.whyDoesNotPredict}{" "}
            <span style={{ color:C.long, fontWeight:700 }}>{t.whyRisk}</span> and{" "}
            <span style={{ color:C.long, fontWeight:700 }}>{t.whyProfits}</span>.
          </p>
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:8 }}>
            {t.whyIdentify}
          </p>
          <p style={{ fontSize:17, color:C.textMid, lineHeight:1.9, marginBottom:36, fontStyle:"italic" }}>
            {t.whyGymClosing}
          </p>

          {/* Signature */}
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg, ${C.accent}, ${C.long})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#080909" }}>S</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{t.teamName}</div>
              <div style={{ fontSize:11, color:C.textMid, marginTop:2, fontFamily:"monospace" }}>{t.teamSub}</div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Account Risk Calculator Section */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"0 24px 80px" }}>
        <div style={{ background:`linear-gradient(135deg, ${C.surface}, #0d0a1a)`, border:`1px solid ${C.prop}33`, borderRadius:16, padding:32 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:24, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:260 }}>
              <div style={{ fontSize:11, color:C.prop, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:10 }}>{t.calcLabel}</div>
              <h3 style={{ fontSize:22, fontWeight:700, marginBottom:12 }}>{t.calcTitle}</h3>
              <p style={{ color:C.textMid, fontSize:14, lineHeight:1.7, marginBottom:8 }}>
                {t.calcP1a}<strong style={{ color:C.text }}>{t.calcP1b}</strong>{t.calcP1c}
              </p>
              <p style={{ color:C.textMid, fontSize:14, lineHeight:1.7, marginBottom:20 }}>{t.calcP2}</p>
              {calcSent ? (
                <div style={{ marginTop:20, padding:"12px 18px", background:C.prop+"22", border:`1px solid ${C.prop}44`, borderRadius:8, fontSize:13, color:C.prop }}>
                  ✓ Creating your account — the calculator will open right after.
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setCalcSent(true); onNavigateCalc(calcEmail); }}
                  style={{ marginTop:20 }}>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <input
                      type="email" required
                      value={calcEmail}
                      onChange={e => setCalcEmail(e.target.value)}
                      placeholder="Enter your email"
                      style={{ flex:1, minWidth:200, padding:"11px 14px", background:C.bg,
                        border:`1px solid ${C.prop}66`, borderRadius:7, color:C.text,
                        fontSize:13, outline:"none", fontFamily:"monospace" }}
                    />
                    <button type="submit"
                      style={{ padding:"11px 22px", background:C.prop, color:"#fff", border:"none",
                        borderRadius:7, fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
                      Get Free Access →
                    </button>
                  </div>
                  <div style={{ fontSize:11, color:C.textDim, marginTop:8 }}>
                    ✓ Instant access &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Google sign-in accepted
                  </div>
                </form>
              )}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, minWidth:220 }}>
              {t.calcFeatures.map(([title,desc]) => (
                <div key={title} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 14px", background:C.bg, borderRadius:8 }}>
                  <span style={{ color:C.prop, marginTop:1 }}>✓</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{title}</div>
                    <div style={{ fontSize:12, color:C.textMid, marginTop:2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ maxWidth:960, margin:"0 auto", padding:"0 24px 100px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <h2 style={{ fontSize:28, fontWeight:600, letterSpacing:"-0.03em" }}>{t.pricing}</h2>
          <p style={{ color:C.textMid, marginTop:8, fontSize:13 }}>{t.pricingNote}</p>
          {track==="forex" && (
            <div style={{ marginTop:14, fontSize:13, color:C.accent, fontFamily:"monospace" }}>
              Signals derived from currency futures · ~99% directional correlation to spot pairs
            </div>
          )}
        </div>
        {track==="forex" ? (
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
            {t.forexPlans.map((plan, i) => {
              const colors = [C.textMid, C.accent];
              const color = colors[i];
              const popular = i === 1;
              return (
                <div key={i} style={{ flex:1, minWidth:280, maxWidth:380, background:C.surface, border:`1px solid ${popular?color+"44":C.border}`, borderRadius:14, padding:26, position:"relative" }}>
                  {popular && <div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:color, color:"#080909", fontSize:9, fontWeight:700, padding:"3px 14px", borderRadius:20, letterSpacing:"0.12em", fontFamily:"monospace" }}>MOST POPULAR</div>}
                  <div style={{ color, fontWeight:600, marginBottom:6, fontSize:12, fontFamily:"monospace" }}>{plan.name.toUpperCase()}</div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:18 }}>
                    <span style={{ fontSize:36, fontWeight:700, fontFamily:"monospace" }}>${plan.price}</span>
                    <span style={{ color:C.textMid, fontSize:12 }}>/mo</span>
                  </div>
                  {plan.features.map(f => (
                    <div key={f} style={{ display:"flex", gap:8, padding:"6px 0", fontSize:13 }}>
                      <span style={{ color }}>✓</span><span style={{ color:C.textMid }}>{f}</span>
                    </div>
                  ))}
                  <button onClick={() => onNavigate("signup")} style={{ width:"100%", marginTop:18, padding:"11px", borderRadius:7, fontWeight:600, fontSize:13, cursor:"pointer", background:popular?color:"transparent", color:popular?"#080909":color, border:`1px solid ${color}` }}>
                    {t.getStarted}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:16 }}>
            {t.futuresPlans.map((plan, i) => {
              const colors = [C.textMid, C.accent, C.long];
              const color = colors[i];
              const popular = i === 1;
              return (
                <div key={i} style={{ background:C.surface, border:`1px solid ${popular?color+"44":C.border}`, borderRadius:14, padding:26, position:"relative" }}>
                  {popular && <div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:color, color:"#080909", fontSize:9, fontWeight:700, padding:"3px 14px", borderRadius:20, letterSpacing:"0.12em", fontFamily:"monospace" }}>POPULAR</div>}
                  <div style={{ color, fontWeight:600, marginBottom:6, fontSize:12, fontFamily:"monospace" }}>{plan.name.toUpperCase()}</div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:18 }}>
                    <span style={{ fontSize:36, fontWeight:700, fontFamily:"monospace" }}>${plan.price}</span>
                    <span style={{ color:C.textMid, fontSize:12 }}>/mo</span>
                  </div>
                  {plan.features.map(f => (
                    <div key={f} style={{ display:"flex", gap:8, padding:"6px 0", fontSize:13 }}>
                      <span style={{ color }}>✓</span><span style={{ color:C.textMid }}>{f}</span>
                    </div>
                  ))}
                  <button onClick={() => onNavigate("signup")} style={{ width:"100%", marginTop:18, padding:"11px", borderRadius:7, fontWeight:600, fontSize:13, cursor:"pointer", background:popular?color:"transparent", color:popular?"#080909":color, border:`1px solid ${color}` }}>
                    {t.getStarted}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ textAlign:"center", marginTop:32 }}>
          <span style={{ fontSize:13, color:C.textMid }}>Serious about institutional access? </span>
          <span onClick={() => onNavigate("curveshift")} style={{ fontSize:13, color:C.accent, cursor:"pointer", textDecoration:"underline" }}>Institutional Access →</span>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"0 24px 100px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:12 }}>{t.earlyUsersLabel}</div>
          <h2 style={{ fontSize:28, fontWeight:600, letterSpacing:"-0.03em" }}>{t.earlyUsersTitle}</h2>
          <p style={{ color:C.textMid, marginTop:8, fontSize:13 }}>{t.earlyUsersSub}</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:20 }}>
          {(track==="forex" ? [
            { quote:"I trade EUR/USD on FTMO and never thought to look at the underlying futures contract. Signal Boss changed that entirely. Seeing the /6E IV signal before I enter a EUR/USD trade feels like having information nobody else at my level has.", name:"P.M.", detail:"EUR/USD forex trader · Paris, FR", stars:5 },
            { quote:"The FTMO calculator finally made the risk real for me. I was treating a $100K account like I had $100K. I didn't. Signal Boss and the calculator together completely changed how I size positions.", name:"A.L.", detail:"FTMO challenge trader · London, UK", stars:5 },
            { quote:"I trade GBP/USD and AUD/USD. The fact that Signal Boss reads /6B and /6A and shows me the institutional positioning before I trade the spot pair — that's not something any other signal service offers. It's a completely different level.", name:"T.H.", detail:"Forex trader · Toronto, CA", stars:5 },
            { quote:"EUR/USD is my main pair. Most tools give you a chart arrow with zero context. Signal Boss derives the signal directly from /6E and shows you the futures reference on the card. That transparency alone is worth it.", name:"C.V.", detail:"Forex trader · Brussels, BE", stars:5 },
            { quote:"I was skeptical that futures IV would apply to my spot forex trades. The correlation is real. I've been tracking it for two months and the directional alignment is remarkable. Exactly what they say.", name:"R.K.", detail:"Forex prop trader · Amsterdam, NL", stars:5 },
            { quote:"The methodology explanation is what sold me. Not the signals — the explanation. I understood why it worked before I subscribed. That kind of transparency is unheard of in this space.", name:"S.D.", detail:"Forex & CFD trader · Sydney, AU", stars:5 },
          ] : [
            { quote:"I've tried a dozen signal services. Most give you arrows on a chart with zero context. Signal Boss gives me a clean entry, a defined stop, and a defined target — on every single alert. That's what I actually needed.", name:"R.T.", detail:"ES & NQ trader · Chicago, IL", stars:5 },
            { quote:"The Account Risk Calculator alone is worth the subscription. I finally understand my true trading capital on a $100K funded account. Passed my FTMO challenge on the second attempt after using it.", name:"M.K.", detail:"Prop trader · Dallas, TX", stars:5 },
            { quote:"Clean, no noise. I get the signal, I see the confluence, I make the call. No second-guessing the setup because the methodology is transparent. That's rare.", name:"D.L.", detail:"Futures trader · Austin, TX", stars:5 },
            { quote:"I was skeptical of another signal tool, but the IV inflection approach actually makes sense. It's grounded in something real, not just a black box. First week using it I avoided two bad trades.", name:"S.W.", detail:"Options & futures · New York, NY", stars:5 },
            { quote:"Setup took five minutes. Signals come through clean. The vol rotation filter cuts out so much of the noise I used to trade through. My win rate isn't magic — I'm just trading better setups.", name:"J.A.", detail:"Day trader · Phoenix, AZ", stars:5 },
            { quote:"Love that it tells me when NOT to trade. Most tools just fire signals constantly. Signal Boss only fires when all the conditions are right. That patience is built in — which is exactly what I needed.", name:"C.R.", detail:"Retail futures trader · Denver, CO", stars:5 },
          ]).map((item, i) => (
            <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:24, display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"flex", gap:3 }}>
                {Array.from({length:item.stars}).map((_,s) => <span key={s} style={{ color:"#f59e0b", fontSize:13 }}>★</span>)}
              </div>
              <p style={{ fontSize:14, color:"#c9cdd6", lineHeight:1.8, margin:0, flex:1, fontStyle:"italic" }}>"{item.quote}"</p>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{item.name}</div>
                <div style={{ fontSize:11, color:C.textMid, marginTop:3, fontFamily:"monospace" }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:32 }}>
          <p style={{ fontSize:12, color:C.textDim, fontStyle:"italic" }}>Testimonials from real beta users. Individual results vary. Past experience does not guarantee future performance.</p>
        </div>
      </div>

      {/* Who It's For / Not For */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"0 24px 100px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:12 }}>{t.knowYourFitLabel}</div>
          <h2 style={{ fontSize:28, fontWeight:600, letterSpacing:"-0.03em" }}>{t.knowYourFitTitle}<br /><span style={{ color:C.textMid }}>{t.knowYourFitSub}</span></h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px,1fr))", gap:20 }}>
          <div style={{ background:"#0b130e", border:`1px solid ${C.long}33`, borderRadius:14, padding:28 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.long, fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:20 }}>{t.fitForLabel}</div>
            {(track==="forex" ? t.fitForForex : t.fitFor).map((item, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"flex-start" }}>
                <span style={{ color:C.long, marginTop:2, flexShrink:0 }}>✓</span>
                <span style={{ fontSize:13, color:"#c9cdd6", lineHeight:1.7 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ background:"#130b0b", border:`1px solid ${C.short}22`, borderRadius:14, padding:28 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#f87171", fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:20 }}>{t.fitNotLabel}</div>
            {(track==="forex" ? t.fitNotForex : t.fitNot).map((item, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"flex-start" }}>
                <span style={{ color:"#f87171", marginTop:2, flexShrink:0 }}>✗</span>
                <span style={{ fontSize:13, color:C.textMid, lineHeight:1.7 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth:680, margin:"0 auto", padding:"0 24px 100px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:12 }}>FAQ</div>
          <h2 style={{ fontSize:28, fontWeight:600, letterSpacing:"-0.03em" }}>Common questions</h2>
        </div>
        {track==="forex" ? <FAQSectionForex /> : <FAQSection />}
      </div>

      {/* Disclaimer Footer */}
      <div style={{ borderTop:`1px solid ${C.border}44`, background:"#0b0c0f", padding:"56px 24px 48px" }}>
        <div style={{ maxWidth:880, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
            <span style={{ fontSize:16, color:"#9ca3af" }}>⚠</span>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", fontFamily:"monospace", color:"#9ca3af" }}>LEGAL DISCLAIMER</span>
          </div>
          {[
            ["For Informational and Educational Purposes Only", "Signal Boss provides analytical tools, regime diagnostics, and relative value signals for informational and educational purposes only. No content on this website or within the Signal Boss platform constitutes investment advice, a recommendation to buy or sell any security, or an offer or solicitation with respect to any financial instrument."],
            ["Not Licensed Investment Advisers", "Signal Boss, its officers, employees, and affiliates are not registered as investment advisers with the U.S. Securities and Exchange Commission (SEC), broker-dealers with the Financial Industry Regulatory Authority (FINRA), or commodity trading advisors with the Commodity Futures Trading Commission (CFTC). We do not provide individualized investment advice or make personalized recommendations tailored to your financial situation."],
            ["Substantial Risk of Loss", "Trading futures, derivatives, and other instruments involves substantial risk of loss and is not suitable for all investors. You may lose some or all of your invested capital. Leverage, if employed, magnifies both gains and losses. Past performance of any trading strategy, signal, or analytical framework does not guarantee future results."],
            ["No Guarantee of Accuracy or Performance", "While Signal Boss employs institutional-grade analytical methodologies, no representation or warranty is made regarding the accuracy, completeness, or timeliness of any volatility or regime classification, trade signal, calculation, or other analytical output. Market conditions change rapidly, and historical relationships may not persist. Signals may be subject to data errors, calculation errors, or model limitations."],
            ["User Responsibility and Release of Liability", "By accessing this website or using the Signal Boss platform, you acknowledge and agree that: (a) you understand the risks inherent in trading financial instruments; (b) all trading decisions are your sole responsibility; (c) you will conduct your own due diligence and consult qualified financial, legal, and tax professionals before making any investment decisions; and (d) you release and hold harmless Signal Boss, its officers, employees, affiliates, and representatives from any and all liability, claims, damages, or losses arising from your use of our services or reliance on any information provided. Furthermore, you understand that stop loss and other Risk Management mechanisms are a critical part of any trading or investing strategy or system."],
            ["Independent Decision-Making Required", "Signal Boss signals and regime classifications are analytical frameworks, not trading instructions. Users must independently evaluate each opportunity, assess their own risk tolerance, and execute trades according to their own strategy and judgment. Do not trade with capital you cannot afford to lose."],
            ["Hypothetical and Illustrative Examples", "Any examples, demos, case studies, sample signals, or analytical outputs shown on this website (including but not limited to the \"Sample Analysis\" section and demo platform) are illustrative, hypothetical, or based on historical data. Hypothetical performance results have inherent limitations and do not represent actual trading. Actual results will vary and may differ materially from examples shown."],
            ["Regulatory Compliance", "Users are solely responsible for ensuring their trading activities comply with all applicable laws and regulations in their jurisdiction. Signal Boss does not determine whether any user is qualified or suitable to trade any particular instrument."],
          ].map(([title, body]) => (
            <div key={title} style={{ marginBottom:20, paddingBottom:20, borderBottom:`1px solid ${C.border}33` }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#c9cdd6", marginBottom:6, fontFamily:"monospace", letterSpacing:"0.02em" }}>{title}</div>
              <p style={{ fontSize:13, color:"#8b9099", lineHeight:1.8, margin:0 }}>{body}</p>
            </div>
          ))}
          <div style={{ marginTop:28, display:"flex", justifyContent:"center", gap:24, flexWrap:"wrap", fontSize:12, color:"#6b7280", fontFamily:"monospace" }}>
            <span style={{ cursor:"pointer", color:"#6b7280" }}>Terms of Service</span>
            <span style={{ color:"#2a3030" }}>·</span>
            <span style={{ cursor:"pointer", color:"#6b7280" }}>Privacy Policy</span>
            <span style={{ color:"#2a3030" }}>·</span>
            <span style={{ cursor:"pointer", color:"#6b7280" }} onClick={() => onNavigate("contact")}>Contact</span>
            <span style={{ color:"#2a3030" }}>·</span>
            <span style={{ cursor:"pointer", color:C.accent }}>Affiliates</span>
            <span style={{ color:"#2a3030" }}>·</span>
            <span style={{ cursor:"pointer", color:C.accent }} onClick={() => onNavigate("curveshift")}>Institutional Access</span>
          </div>
          <div style={{ marginTop:16, fontSize:12, color:"#4b5563", fontFamily:"monospace", textAlign:"center" }}>
            © {new Date().getFullYear()} Signal Boss · All rights reserved
          </div>
          <div style={{ marginTop:10, fontSize:11, color:"#374151", fontFamily:"monospace", textAlign:"center", letterSpacing:"0.04em" }}>
            For institutional fixed income analytics —{" "}
            <span onClick={() => onNavigate("curveshift")} style={{ color:"#4b5563", cursor:"pointer", borderBottom:"1px solid #374151", paddingBottom:1 }}>
              CurveShift Analytics ↗
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthPage({ mode, onNavigate, onAuth, t, track }) {
  const [email, setEmail]       = useState("");
  const [name, setName]         = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan]         = useState("pro");
  const [signupTrack, setSignupTrack] = useState(track || "futures");
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const isLogin = mode === "login";
  const inputStyle = { width:"100%", padding:"11px 14px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:13, fontFamily:"monospace", outline:"none" };
  const labelStyle = { fontSize:10, color:C.textMid, letterSpacing:"0.12em", display:"block", marginBottom:7, fontFamily:"monospace" };

  const handleSignup = async () => {
    if (!email || !email.includes("@")) return;
    setSubmitting(true);
    try {
      await fetch("https://formspree.io/f/xdalyedn", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          name, email, plan,
          track: signupTrack,
          _subject: `🚀 New Signal Boss Trial Signup — ${signupTrack.toUpperCase()} — ${plan}`,
        }),
      });
    } catch(e) { /* silent fail — don't block the user */ }
    setSubmitting(false);
    onAuth({email, plan});
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:400, background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:36 }}>
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:20, fontWeight:600, marginBottom:6 }}>{isLogin?t.signInTitle:t.signUpTitle}</div>
          <div style={{ color:C.textMid, fontSize:13 }}>{isLogin?t.signInSub:t.signUpSub}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {!isLogin && <div><label style={labelStyle}>{t.fullName}</label><input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="John Smith" /></div>}
          <div><label style={labelStyle}>{t.email}</label><input style={inputStyle} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email" /></div>
          <div><label style={labelStyle}>{t.password}</label><input style={inputStyle} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type="password" /></div>
          {!isLogin && (
            <>
              <div>
                <label style={labelStyle}>MARKET TRACK</label>
                <div style={{ display:"flex", gap:8 }}>
                  {[["futures","Futures"],["forex","Forex"]].map(([val,label]) => (
                    <button key={val} onClick={() => setSignupTrack(val)} type="button"
                      style={{ flex:1, padding:"10px", borderRadius:7, border:`1px solid ${signupTrack===val?C.long:C.border}`, background:signupTrack===val?C.longDim:"transparent", color:signupTrack===val?C.long:C.textMid, fontSize:13, fontWeight:signupTrack===val?600:400, cursor:"pointer", fontFamily:"monospace" }}>
                      {label}
                    </button>
                  ))}
                </div>
                {signupTrack && <div style={{ fontSize:11, color:C.textDim, marginTop:6, fontFamily:"monospace" }}>{signupTrack==="futures" ? "ES · NQ · CL · GC · RTY · ZN · /6E" : "EUR/USD · via /6E"}</div>}
              </div>
              <div><label style={labelStyle}>{t.plan}</label>
                <select value={plan} onChange={e=>setPlan(e.target.value)} style={{ width:"100%", padding:"11px 14px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:13, fontFamily:"monospace" }}>
                  {signupTrack === "forex" ? <>
                    <option value="major">Major Pairs — $129/mo</option>
                    <option value="full">Full Coverage — $249/mo</option>
                  </> : <>
                    <option value="starter">Starter — $149/mo</option>
                    <option value="pro">Pro — $249/mo</option>
                    <option value="elite">Elite — $449/mo</option>
                  </>}
                </select>
              </div>
            </>
          )}
          <button
            onClick={isLogin ? () => onAuth({email,plan}) : handleSignup}
            disabled={submitting}
            style={{ width:"100%", padding:"13px", background:C.accent, color:"#080909", border:"none", borderRadius:8, fontWeight:600, fontSize:14, cursor:"pointer", marginTop:4, opacity:submitting?0.7:1 }}>
            {submitting ? "Submitting..." : isLogin ? t.signIn : t.createAccount}
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:C.textMid }}>
          {isLogin?t.noAccount:t.haveAccount}
          <span onClick={() => onNavigate(isLogin?"signup":"login")} style={{ color:C.accent, cursor:"pointer" }}>{isLogin?t.signUp:t.signIn}</span>
        </div>
      </div>
    </div>
  );
}

const TICK_VALUES = {
  ES: { tick: 0.25, tickVal: 12.50, unit: "pts",  label: "ES (S&P 500)"    },
  NQ: { tick: 0.25, tickVal: 5.00,  unit: "pts",  label: "NQ (Nasdaq)"     },
  RTY:{ tick: 0.10, tickVal: 5.00,  unit: "pts",  label: "RTY (Russell)"   },
  YM: { tick: 1.00, tickVal: 5.00,  unit: "pts",  label: "YM (Dow)"        },
  CL: { tick: 0.01, tickVal: 10.00, unit: "pts",  label: "CL (Crude Oil)"  },
  GC: { tick: 0.10, tickVal: 10.00, unit: "pts",  label: "GC (Gold)"       },
  SI: { tick: 0.005,tickVal: 25.00, unit: "pts",  label: "SI (Silver)"     },
  ZB: { tick: 0.03125,   tickVal: 31.25,  unit: "pts",  label: "ZB (30-Yr T-Bond)" },
  ZN: { tick: 0.015625,  tickVal: 15.625, unit: "pts",  label: "ZN (10-Yr T-Note)" },
  ZF: { tick: 0.0078125, tickVal:  7.8125,unit: "pts",  label: "ZF (5-Yr T-Note)"  },
  "EUR/USD": { tick:0.0001, tickVal:10.00, unit:"pips", label:"EUR/USD"    },
  "GBP/USD": { tick:0.0001, tickVal:10.00, unit:"pips", label:"GBP/USD"    },
  "USD/JPY": { tick:0.01,   tickVal:9.09,  unit:"pips", label:"USD/JPY"    },
  "EUR/JPY": { tick:0.01,   tickVal:9.09,  unit:"pips", label:"EUR/JPY"    },
  "EUR/GBP": { tick:0.0001, tickVal:10.00, unit:"pips", label:"EUR/GBP"    },
};

function PositionTracker() {
  const [instrument, setInstrument] = useState("ES");
  const [direction, setDirection]   = useState("LONG");
  const [entryPrice, setEntryPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [size, setSize]             = useState(1);
  const [positions, setPositions]   = useState([]);
  const [entryErr, setEntryErr]     = useState(false);
  const [currentErr, setCurrentErr] = useState(false);

  const inst = TICK_VALUES[instrument] || TICK_VALUES["ES"];
  const entry  = parseFloat(entryPrice);
  const current = parseFloat(currentPrice);
  const isLong  = direction === "LONG";
  const isForex = inst.unit === "pips";

  const rawMove   = (!isNaN(entry) && !isNaN(current)) ? (current - entry) : null;
  const directedMove = rawMove !== null ? (isLong ? rawMove : -rawMove) : null;
  const ticks     = rawMove !== null ? Math.round(rawMove / inst.tick * (isLong?1:-1)) : null;
  const pnl       = ticks !== null ? ticks * inst.tickVal * size : null;
  const isProfit  = pnl !== null && pnl >= 0;

  const addPosition = () => {
    if (isNaN(entry) || entry <= 0) { setEntryErr(true); return; }
    if (isNaN(current) || current <= 0) { setCurrentErr(true); return; }
    const pos = {
      id: Date.now(), instrument, direction, entry, current, size,
      pnl, ticks, isProfit, time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
    };
    setPositions(prev => [pos, ...prev.slice(0, 9)]);
  };

  const clearAll = () => setPositions([]);

  const totalPnl = positions.reduce((sum, p) => sum + (p.pnl || 0), 0);

  return (
    <div style={{ padding:22, maxWidth:860 }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
          <h2 style={{ fontSize:18, fontWeight:600 }}>Position P&amp;L Tracker</h2>
          <span style={{ fontSize:10, color:C.accent, fontFamily:"monospace", background:C.accentDim, padding:"2px 10px", borderRadius:10, border:`1px solid ${C.accent}33` }}>VOLATILITY STATE TRADING</span>
        </div>
        <p style={{ color:C.textMid, fontSize:13 }}>Enter your position manually to see hypothetical P&amp;L in real time.</p>
      </div>

      {/* Input Panel */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:24, marginBottom:20 }}>

        {/* Instrument + Direction row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:8 }}>INSTRUMENT</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {Object.keys(TICK_VALUES).map(sym => (
                <button key={sym} onClick={() => { setInstrument(sym); setEntryPrice(""); setCurrentPrice(""); }}
                  style={{ padding:"5px 11px", borderRadius:5, fontSize:11, fontFamily:"monospace", fontWeight:600, cursor:"pointer",
                    background: instrument===sym ? C.accentDim : C.bg,
                    color:      instrument===sym ? C.accent    : C.textMid,
                    border:    `1px solid ${instrument===sym ? C.accent+"55" : C.border}` }}>
                  {sym}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:8 }}>DIRECTION</div>
            <div style={{ display:"flex", gap:8 }}>
              {["LONG","SHORT"].map(d => (
                <button key={d} onClick={() => setDirection(d)}
                  style={{ flex:1, padding:"10px", borderRadius:7, fontSize:13, fontWeight:700, fontFamily:"monospace", cursor:"pointer",
                    background: direction===d ? (d==="LONG"?C.longDim:C.shortDim) : C.bg,
                    color:      direction===d ? (d==="LONG"?C.long:C.short)       : C.textMid,
                    border:    `1px solid ${direction===d ? (d==="LONG"?C.long+"55":C.short+"55") : C.border}` }}>
                  {d==="LONG" ? "▲ LONG" : "▼ SHORT"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price + Size row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
          <div>
            <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:8 }}>ENTRY PRICE</div>
            <input type="number" value={entryPrice} step={inst.tick}
              onChange={e => { setEntryPrice(e.target.value); setEntryErr(false); }}
              placeholder={isForex ? "e.g. 1.0842" : "e.g. 5247.25"}
              style={{ width:"100%", padding:"10px 12px", background:C.bg,
                border:`1px solid ${entryErr ? C.short : C.border}`, borderRadius:7,
                color:C.text, fontSize:13, fontFamily:"monospace", outline:"none" }} />
            {entryErr && <div style={{ fontSize:10, color:C.short, marginTop:4, fontFamily:"monospace" }}>Enter a valid price</div>}
          </div>
          <div>
            <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:8 }}>CURRENT PRICE</div>
            <input type="number" value={currentPrice} step={inst.tick}
              onChange={e => { setCurrentPrice(e.target.value); setCurrentErr(false); }}
              placeholder={isForex ? "e.g. 1.0865" : "e.g. 5261.00"}
              style={{ width:"100%", padding:"10px 12px", background:C.bg,
                border:`1px solid ${currentErr ? C.short : C.border}`, borderRadius:7,
                color:C.text, fontSize:13, fontFamily:"monospace", outline:"none" }} />
            {currentErr && <div style={{ fontSize:10, color:C.short, marginTop:4, fontFamily:"monospace" }}>Enter a valid price</div>}
          </div>
          <div>
            <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:8 }}>SIZE {isForex?"(LOTS)":"(CONTRACTS)"}</div>
            <input type="number" value={size} min={1} step={isForex?0.01:1}
              onChange={e => setSize(parseFloat(e.target.value)||1)}
              style={{ width:"100%", padding:"10px 12px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:13, fontFamily:"monospace", outline:"none" }} />
          </div>
        </div>

        {/* Live P&L Preview */}
        {pnl !== null && (
          <div style={{ background: isProfit ? C.longDim : C.shortDim,
            border:`1px solid ${isProfit ? C.long+"44" : C.short+"44"}`,
            borderRadius:10, padding:"16px 20px", marginBottom:20,
            display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:10, color:isProfit?C.long:C.short, fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:4 }}>
                {isProfit ? "▲ UNREALIZED PROFIT" : "▼ UNREALIZED LOSS"}
              </div>
              <div style={{ fontSize:36, fontWeight:700, color:isProfit?C.long:C.short, fontFamily:"monospace", lineHeight:1 }}>
                {isProfit?"+":""}{pnl.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2})}
              </div>
            </div>
            <div style={{ display:"flex", gap:24 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", marginBottom:4 }}>MOVE</div>
                <div style={{ fontSize:16, fontWeight:700, fontFamily:"monospace", color:C.text }}>
                  {isLong ? (rawMove >= 0 ? "+" : "") : (rawMove <= 0 ? "+" : "-")}{Math.abs(rawMove).toFixed(isForex?4:2)}
                </div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", marginBottom:4 }}>{inst.unit.toUpperCase()}</div>
                <div style={{ fontSize:16, fontWeight:700, fontFamily:"monospace", color:isProfit?C.long:C.short }}>
                  {isProfit?"+":""}{ticks}
                </div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", marginBottom:4 }}>SIZE</div>
                <div style={{ fontSize:16, fontWeight:700, fontFamily:"monospace", color:C.text }}>
                  ×{size}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={addPosition}
            style={{ flex:1, padding:"12px", background:C.accent, color:"#080909", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"monospace", letterSpacing:"0.05em" }}>
            + SAVE POSITION
          </button>
        </div>
      </div>

      {/* Saved Positions */}
      {positions.length > 0 && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:13, fontWeight:600 }}>Saved Positions</span>
              <span style={{ fontSize:12, color:C.textMid, fontFamily:"monospace" }}>{positions.length} position{positions.length!==1?"s":""}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", marginBottom:2 }}>TOTAL P&amp;L</div>
                <div style={{ fontSize:18, fontWeight:700, fontFamily:"monospace", color:totalPnl>=0?C.long:C.short }}>
                  {totalPnl>=0?"+":""}{totalPnl.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2})}
                </div>
              </div>
              <button onClick={clearAll} style={{ padding:"6px 14px", background:"transparent", border:`1px solid ${C.border}`, borderRadius:6, color:C.textDim, cursor:"pointer", fontSize:11, fontFamily:"monospace" }}>Clear All</button>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {positions.map(pos => (
              <div key={pos.id} style={{ background:C.surface,
                border:`1px solid ${pos.isProfit ? C.long+"33" : C.short+"33"}`,
                borderRadius:10, padding:"14px 18px",
                display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:3, height:36, borderRadius:2, background:pos.isProfit?C.long:C.short, flexShrink:0 }} />
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:14, fontWeight:700, fontFamily:"monospace", color:pos.direction==="LONG"?C.long:C.short }}>
                        {pos.direction==="LONG"?"▲":"▼"} {pos.direction}
                      </span>
                      <span style={{ fontSize:14, fontWeight:700, fontFamily:"monospace" }}>{pos.instrument}</span>
                      <span style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", background:C.border, padding:"1px 7px", borderRadius:4 }}>×{pos.size}</span>
                    </div>
                    <div style={{ fontSize:11, color:C.textMid, fontFamily:"monospace" }}>
                      Entry: {pos.entry} → Current: {pos.current}
                      <span style={{ marginLeft:10, color:C.textDim }}>{pos.time}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:20, fontWeight:700, fontFamily:"monospace", color:pos.isProfit?C.long:C.short }}>
                    {pos.isProfit?"+":""}{pos.pnl?.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2})}
                  </div>
                  <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace" }}>
                    {pos.isProfit?"+":""}{pos.ticks} {TICK_VALUES[pos.instrument]?.unit||"pts"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {positions.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 0", color:C.textDim, fontFamily:"monospace", fontSize:12 }}>
          No saved positions yet — enter a trade above and hit Save Position
        </div>
      )}
    </div>
  );
}

function Dashboard({ user, onNavigate, t, lang, setLang }) {
  const isAdmin      = user?.publicMetadata?.role === "admin";
  const isSubscribed = user?.publicMetadata?.subscribed === true;
  const [signals, setSignals]     = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cycleState, setCycleState] = useState({});   // live dots per instrument
  const [activeTab, setActiveTab] = useState("signals");
  const [adminStats, setAdminStats] = useState(null);
  const [history, setHistory]       = useState([]);
  const [manualForm, setManualForm] = useState({ instrument:"NQ", direction:"LONG", price:"", stop:"", tp:"", note:"" });
  const [manualStatus, setManualStatus] = useState(null);  // null | {ok, msg}
  const [histTypeFilter, setHistTypeFilter] = useState("ALL");
  const [exitMode, setExitMode]   = useState("INFLECTION");
  const [timeframe, setTimeframe] = useState("5m");
  const [filterDir, setFilterDir] = useState("ALL");
  const [filterStr, setFilterStr] = useState("ALL");
  const ALL_INSTS = ['ES','NQ','CL','GC','RTY','ZN','6E'];
  const [filterInst, setFilterInst] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("sb_inst_filter")) || ALL_INSTS); }
    catch { return new Set(ALL_INSTS); }
  });
  const toggleInst = (sym) => {
    setFilterInst(prev => {
      const next = new Set(prev);
      if (next.has(sym)) { if (next.size > 1) next.delete(sym); }
      else next.add(sym);
      localStorage.setItem("sb_inst_filter", JSON.stringify([...next]));
      return next;
    });
  };
  const [vwapRule, setVwapRule]   = useState("daily");
  const [rrPref, setRrPref]       = useState(() => {
    const saved = localStorage.getItem("sb_rr_pref");
    return saved ? parseFloat(saved) : 2.5;
  });
  const [cycleConfig, setCycleConfig] = useState({
    daily:   { enabled:true, label:"1-Day",  resetTime:"9:30 AM", every:"1 trading day" },
    twoDay:  { enabled:true, label:"3-Day",  resetTime:"8:20 AM", every:"3 trading days" },
    fourDay: { enabled:true, label:"6-Day",  resetTime:"8:20 AM", every:"6 trading days" },
  });
  const [todayCount, setTodayCount] = useState(47);
  const [backtest,   setBacktest]   = useState(FALLBACK_BACKTEST);
  const [btOrbIdx, setBtOrbIdx] = useState(0);

  useEffect(() => {
    const url = SIGNALS_URL || GIST_URL;
    const load = () => {
      fetch(`${url}?t=${Date.now()}`)
        .then(r => r.json())
        .then(data => {
          setSignals(data.signals || []);
          setLastUpdated(new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }));
        })
        .catch(() => {});
    };
    load();
    const iv = setInterval(load, 60000);
    return () => clearInterval(iv);
  }, []);

  // Fetch live cycle dot state + current prices every 60s
  useEffect(() => {
    if (!CYCLE_STATE_URL) return;
    const loadDots = () => {
      fetch(`${CYCLE_STATE_URL}?t=${Date.now()}`)
        .then(r => r.json())
        .then(data => { if (data.instruments) setCycleState(data.instruments); })
        .catch(() => {});
    };
    loadDots();
    const iv = setInterval(loadDots, 60000);
    return () => clearInterval(iv);
  }, [isAdmin]);

  useEffect(() => {
    if (!BACKTEST_URL) return;
    fetch(`${BACKTEST_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then(data => setBacktest(data))
      .catch(() => {});
  }, []);

  const fetchHistory = () =>
    fetch(`${API_URL}/history?t=${Date.now()}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setHistory(data); })
      .catch(() => {});

  useEffect(() => {
    fetchHistory();
    const iv = setInterval(fetchHistory, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  const dismiss  = id => setSignals(prev => prev.map(s => s.id===id?{...s,status:"CANCELLED"}:s));
  const active   = signals.filter(s => s.status==="ACTIVE");
  const longs    = active.filter(s => s.direction==="LONG").length;
  const shorts   = active.filter(s => s.direction==="SHORT").length;
  const strong   = active.filter(s => s.trigger==="AAA" || s.trigger==="AAA+").length;
  // One card per instrument — keep only the most recent card per symbol
  const deduped = signals.filter((s, i, arr) =>
    arr.findIndex(x => (x.instrument||x.symbol) === (s.instrument||s.symbol)) === i
  );
  const filtered = deduped.filter(s => {
    if (filterDir!=="ALL" && s.direction!==filterDir) return false;
    if (filterStr!=="ALL" && s.trigger!==filterStr) return false;
    if (!filterInst.has(s.instrument || s.symbol)) return false;
    return true;
  });

  const tabs = [
    { id:"signals",  label:t.liveSignals,   icon:"◉" },
    { id:"history",  label:"History",        icon:"◷" },
    { id:"backtest", label:"Backtest",       icon:"◫" },
    { id:"pnl",      label:"P&L Tracker",   icon:"◈" },
    { id:"config",   label:"Playbook",      icon:"◧" },
    { id:"prop",     label:t.propCalc,       icon:"⬡" },
    { id:"account",  label:t.account,        icon:"◎" },
    ...(isAdmin ? [{ id:"admin", label:"Admin", icon:"⬛" }] : []),
  ];

  const VWAP_RULES = [
    { id:"daily",  label:"Daily VWAP only",     desc:"Price must be above/below Daily VWAP" },
    { id:"weekly", label:"Weekly VWAP only",    desc:"Price must be above/below Weekly VWAP" },
    { id:"both",   label:"Daily + Weekly both", desc:"Both VWAPs must confirm direction" },
    { id:"either", label:"Either one confirms", desc:"At least one VWAP must confirm" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      {/* Sidebar */}
      <div style={{ width:215, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"20px 18px 16px", borderBottom:`1px solid ${C.border}` }}>
          <div onClick={() => onNavigate("landing")} style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0 }}>
              <rect width="28" height="28" rx="6" fill={C.accent} fillOpacity="0.12"/>
              <rect x="0.5" y="0.5" width="27" height="27" rx="5.5" stroke={C.accent} strokeOpacity="0.35"/>
              <path d="M16 4L9 15.5h6L11 24l10-13h-6L16 4z" fill={C.accent}/>
            </svg>
            <div style={{ lineHeight:1 }}>
              <div style={{ fontWeight:800, fontSize:14, fontFamily:"monospace", letterSpacing:"0.06em", color:C.text }}>SIGNAL<span style={{ color:C.accent }}>BOSS</span></div>
              <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.12em", marginTop:2 }}>FUTURES · LIVE</div>
            </div>
          </div>
          <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:6 }}>
            <LiveDot color={C.long} size={5} />
            <span style={{ fontSize:10, color:C.textMid, fontFamily:"monospace" }}>{t.engineActive}</span>
          </div>
          <div style={{ marginTop:12, display:"flex", gap:4, background:C.bg, borderRadius:7, padding:3 }}>
            <button style={{ flex:1, padding:"5px 0", borderRadius:5, border:"none", background:C.longDim, color:C.long, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"monospace" }}>FUTURES</button>
            <button onClick={() => onNavigate("forex-demo")} style={{ flex:1, padding:"5px 0", borderRadius:5, border:"none", background:"transparent", color:C.textMid, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"monospace" }}>FOREX</button>
          </div>
          <div style={{ marginTop:10 }}><LangSwitcher lang={lang} setLang={setLang} /></div>
        </div>
        <nav style={{ padding:"12px 10px", flex:1 }}>
          {tabs.map(tab => (
            <div key={tab.id} onClick={() => tab.id === "prop" ? onNavigate("calc") : setActiveTab(tab.id)} className={`nav-item ${activeTab===tab.id?"active":""}`} style={{ color:activeTab===tab.id?C.accent:C.textMid }}>
              <span style={{ fontSize:12 }}>{tab.icon}</span>{tab.label}
            </div>
          ))}
        </nav>
        <div style={{ padding:"12px 18px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:10, color:C.textDim, letterSpacing:"0.1em", marginBottom:8, fontFamily:"monospace" }}>ACTIVE</div>
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ flex:1, textAlign:"center", background:C.longDim, border:`1px solid ${C.long}22`, borderRadius:6, padding:"7px 0" }}>
              <div style={{ fontSize:16, fontWeight:700, color:C.long, fontFamily:"monospace" }}>{longs}</div>
              <div style={{ fontSize:9, color:C.textMid, marginTop:1, fontFamily:"monospace" }}>LONG</div>
            </div>
            <div style={{ flex:1, textAlign:"center", background:C.shortDim, border:`1px solid ${C.short}22`, borderRadius:6, padding:"7px 0" }}>
              <div style={{ fontSize:16, fontWeight:700, color:C.short, fontFamily:"monospace" }}>{shorts}</div>
              <div style={{ fontSize:9, color:C.textMid, marginTop:1, fontFamily:"monospace" }}>SHORT</div>
            </div>
          </div>
          <div style={{ marginTop:10, textAlign:"center" }}><SignalCounter count={signals.length} /></div>
        </div>
        <div style={{ padding:"12px 18px", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10 }}>
          <UserButton afterSignOutUrl="/" appearance={clerkDark} />
          <div style={{ overflow:"hidden" }}>
            <div style={{ fontSize:11, color:C.text, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {user?.firstName || user?.primaryEmailAddress?.emailAddress || "Trader"}
            </div>
            <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", marginTop:1 }}>
              {user?.publicMetadata?.plan?.toUpperCase() || "PRO"} ·{" "}
              <span onClick={() => onNavigate("landing")} style={{ cursor:"pointer", color:C.textDim }}>{t.home}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflow:"auto", background:C.bg }}>
        <PriceTicker />

        {activeTab==="signals" && (
          <div style={{ padding:22 }}>
            {/* Live status bar */}
            <div style={{ marginBottom:18, background:C.surface, border:`1px solid ${C.long}33`, borderRadius:10, padding:"10px 18px", display:"flex", alignItems:"center", gap:10 }}>
              <LiveDot color={C.long} size={6} />
              <span style={{ fontSize:12, color:C.long, fontFamily:"monospace", fontWeight:600, letterSpacing:"0.08em" }}>LIVE SIGNALS</span>
              <span style={{ fontSize:12, color:C.textMid }}>· Updating every minute</span>
              {lastUpdated && <span style={{ fontSize:11, color:C.textDim, marginLeft:"auto", fontFamily:"monospace" }}>Last fetch: {lastUpdated}</span>}
            </div>
            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:18 }}>
              <StatTile label={t.activeSignals} value={active.length} color={C.accent} />
              <StatTile label={t.long}  value={longs}  color={C.long}  sub={t.active.toLowerCase()} />
              <StatTile label={t.short} value={shorts} color={C.short} sub={t.active.toLowerCase()} />
            </div>
            {/* Direction filter */}
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginRight:4 }}>{t.direction}</span>
              {["ALL","LONG","SHORT"].map(d => (
                <button key={d} onClick={() => setFilterDir(d)} className="tab-btn" style={{ padding:"5px 14px", borderRadius:5, fontSize:11, fontFamily:"monospace", fontWeight:600, background:filterDir===d?(d==="LONG"?C.longDim:d==="SHORT"?C.shortDim:C.accentDim):C.surface, color:filterDir===d?(d==="LONG"?C.long:d==="SHORT"?C.short:C.accent):C.textMid, border:`1px solid ${filterDir===d?(d==="LONG"?C.long+"33":d==="SHORT"?C.short+"33":C.accent+"33"):C.border}` }}>{d}</button>
              ))}
            </div>
            {/* Signal cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(310px,1fr))", gap:14 }}>
              {filtered.map(sig => <LiveSignalCard key={sig.id} signal={sig} />)}
              {filtered.length === 0 && (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 0", color:C.textDim, fontFamily:"monospace", fontSize:13 }}>
                  No signals have fired yet today.<br />
                  <span style={{ fontSize:11, color:C.textDim, marginTop:8, display:"block" }}>Ready alerts go out at 9:00 AM ET · Signals fire on range breakouts</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab==="history" && (() => {
          const isOrb = s => s.type === "VOLATILITY_ORB" || s.type === "ORB";
          const isSbc = s => s.type === "SB_CRITERIA" || s.type === "MANUAL";

          const TYPE_META = {
            "VOLATILITY_ORB": { label:"Volatility Aligned ORB", color:"#38bdf8", bg:"#38bdf811" },
            "SB_CRITERIA":    { label:"SB Criteria Met",         color:"#a78bfa", bg:"#a78bfa11" },
            "ORB":            { label:"Volatility Aligned ORB",  color:"#38bdf8", bg:"#38bdf811" },
            "MANUAL":         { label:"SB Criteria Met",         color:"#a78bfa", bg:"#a78bfa11" },
          };
          const getTypeMeta = s =>
            TYPE_META[s.type] || { label: s.trigger || "Signal", color:C.textMid, bg:C.surface };

          const getStatusMeta = s => {
            const st = s.status || "ACTIVE";
            if (st === "ACTIVE")    return { label:"ACTIVE",    color:C.long };
            if (st === "CANCELLED") return { label:"CLOSED",    color:C.textDim };
            if (st === "WIN")       return { label:"WIN ✓",     color:C.long };
            if (st === "LOSS")      return { label:"LOSS",      color:C.short };
            return { label:st, color:C.textMid };
          };

          // P&L for a closed signal (1 contract)
          const computePnl = s => {
            const ticks = s.stop_ticks || s.risk?.stopTicks || 0;
            const tv    = s.tick_value || 5.0;
            const rr    = s.rr || s.risk?.suggestedRR || 2.0;
            if (s.status === "WIN")  return +(ticks * tv * rr).toFixed(0);
            if (s.status === "LOSS") return -(ticks * tv);
            return null;
          };

          const histRows = history
            .filter(s => filterInst.has(s.instrument))
            .filter(s => {
              if (histTypeFilter === "ALL")            return true;
              if (histTypeFilter === "VOLATILITY_ORB") return isOrb(s);
              if (histTypeFilter === "SB_CRITERIA")    return isSbc(s);
              return true;
            });

          // Live stats from persistent history
          const closed  = histRows.filter(s => s.status === "WIN" || s.status === "LOSS");
          const wins    = closed.filter(s => s.status === "WIN").length;
          const liveWR  = closed.length > 0 ? (wins / closed.length * 100).toFixed(0) : null;
          const netPnl  = closed.reduce((acc, s) => acc + (computePnl(s) || 0), 0);

          // Admin outcome updater
          const markOutcome = async (id, outcome) => {
            try {
              await fetch(`${API_URL}/update-signal`, {
                method: "POST",
                headers: { "Content-Type":"application/json", "X-Admin-Key":"sb_admin_2026_jr" },
                body: JSON.stringify({ id, outcome }),
              });
              fetchHistory();
            } catch(e) { console.error(e); }
          };


          return (
            <div style={{ padding:22, maxWidth:980 }}>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>Signal History</h2>
                <p style={{ color:C.textMid, fontSize:13 }}>Persistent record — every signal, every outcome</p>
              </div>

              {/* ── Live Track Record ─────────────────────────────────────── */}
              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>LIVE TRACK RECORD</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
                {[
                  { label:"TOTAL SIGNALS",  value: histRows.length,  color:C.accent },
                  { label:"CLOSED",         value: closed.length,    color:C.textMid },
                  { label:"LIVE WIN RATE",  value: liveWR ? `${liveWR}%` : "—",
                    color: liveWR && parseInt(liveWR)>=40 ? C.long : C.warn },
                  { label:"NET P&L (1 ct)", value: closed.length > 0 ? `${netPnl>=0?"+":""}$${netPnl.toLocaleString()}` : "—",
                    color: netPnl > 0 ? C.long : netPnl < 0 ? C.short : C.textMid },
                ].map(s => (
                  <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:6 }}>{s.label}</div>
                    <div style={{ fontSize:20, fontWeight:700, color:s.color, fontFamily:"monospace" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* ── Filters ──────────────────────────────────────────────── */}
              <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                {[
                  { key:"ALL",            label:"All" },
                  { key:"VOLATILITY_ORB", label:"Volatility Aligned Breakout Trades" },
                  { key:"SB_CRITERIA",    label:"SB Criteria Met" },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setHistTypeFilter(key)}
                    style={{ padding:"6px 14px", fontSize:12, fontFamily:"monospace", cursor:"pointer", borderRadius:7,
                      background: histTypeFilter===key ? C.accent+"22" : "transparent",
                      border:`1px solid ${histTypeFilter===key ? C.accent : C.border}`,
                      color: histTypeFilter===key ? C.accent : C.textMid }}>
                    {label}
                  </button>
                ))}
                <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                  {ALL_INSTS.map(sym => (
                    <button key={sym} onClick={() => toggleInst(sym)}
                      style={{ padding:"5px 10px", fontSize:11, fontFamily:"monospace", cursor:"pointer", borderRadius:6,
                        background: filterInst.has(sym) ? C.accentDim : "transparent",
                        border:`1px solid ${filterInst.has(sym)?C.accent+"44":C.border}`,
                        color: filterInst.has(sym) ? C.accent : C.textDim, fontWeight:600 }}>
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Table ────────────────────────────────────────────────── */}
              {histRows.length === 0 ? (
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:32,
                  color:C.textMid, fontSize:13, textAlign:"center" }}>
                  {history.length === 0
                    ? "No signals yet. First Volatility Aligned ORB fires at 8:30 AM ET on the next trading day."
                    : "No signals match the current filters."}
                </div>
              ) : (
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
                  <div style={{ display:"grid",
                    gridTemplateColumns: isAdmin ? "70px 55px 1fr 55px 75px 80px 75px 90px 100px" : "70px 55px 1fr 55px 75px 80px 75px 90px",
                    padding:"8px 16px", borderBottom:`1px solid ${C.border}`,
                    fontSize:10, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.08em" }}>
                    <span>DATE</span><span>TIME</span><span>TYPE</span>
                    <span>INST</span><span>DIR</span><span>ENTRY</span><span>R:R</span><span>OUTCOME</span>
                    {isAdmin && <span>MARK</span>}
                  </div>
                  {histRows.map((s, i) => {
                    const tm  = getTypeMeta(s);
                    const sm  = getStatusMeta(s);
                    const pnl = computePnl(s);
                    const entry = s.entry || s.price;
                    return (
                      <div key={s.id || i}
                        style={{ display:"grid",
                          gridTemplateColumns: isAdmin ? "70px 55px 1fr 55px 75px 80px 75px 90px 100px" : "70px 55px 1fr 55px 75px 80px 75px 90px",
                          padding:"10px 16px", borderBottom: i < histRows.length-1 ? `1px solid ${C.border}` : "none",
                          fontSize:13, alignItems:"center", background: i%2===0?"transparent":C.bg+"44" }}>
                        <span style={{ fontFamily:"monospace", fontSize:11, color:C.textMid }}>{s.date ? s.date.slice(5) : "—"}</span>
                        <span style={{ fontFamily:"monospace", fontSize:11, color:C.textDim }}>{s.time || "—"}</span>
                        <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ padding:"2px 8px", borderRadius:4, fontSize:10, fontFamily:"monospace", fontWeight:700,
                            background:tm.bg, color:tm.color, whiteSpace:"nowrap" }}>{tm.label}</span>
                          {s.triggerDetail && isOrb(s) && <span style={{ fontSize:10, color:C.textDim, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{(s.triggerDetail||"").replace(/Volatility Aligned (ORB|Breakout Trade[s]?) ?·? ?/gi,"").replace(/ ?· ?VWAP \+ 1D confirmed/gi,"")}</span>}
                        </span>
                        <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:12 }}>{s.instrument}</span>
                        <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:12,
                          color: s.direction==="LONG" ? C.long : C.short }}>
                          {s.direction==="LONG" ? "▲ L" : "▼ S"}
                        </span>
                        <span style={{ fontFamily:"monospace", fontSize:12 }}>{entry ? entry.toLocaleString() : "—"}</span>
                        <span style={{ fontFamily:"monospace", fontSize:11, color:C.textDim }}>{(s.rr || s.risk?.suggestedRR || "—")+":1"}</span>
                        <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700 }}>
                          <span style={{ color:sm.color }}>{sm.label}</span>
                          {pnl !== null && <span style={{ marginLeft:5, fontSize:10, color: pnl>=0?C.long:C.short }}>{pnl>=0?"+":""}{pnl}</span>}
                        </span>
                        {isAdmin && (
                          <span style={{ display:"flex", gap:4 }}>
                            {["WIN","LOSS"].map(o => (
                              <button key={o} onClick={() => markOutcome(s.id, o)}
                                style={{ padding:"3px 8px", fontSize:10, fontFamily:"monospace", cursor:"pointer", borderRadius:5,
                                  background: s.status===o ? (o==="WIN"?C.long+"33":C.short+"33") : "transparent",
                                  border:`1px solid ${s.status===o?(o==="WIN"?C.long:C.short):C.border}`,
                                  color: s.status===o ? (o==="WIN"?C.long:C.short) : C.textDim,
                                  fontWeight: s.status===o ? 700 : 400 }}>
                                {o}
                              </button>
                            ))}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ marginTop:10, fontSize:11, color:C.textDim, fontFamily:"monospace" }}>
                {histRows.length} record{histRows.length!==1?"s":""} · persistent — no cap
              </div>
            </div>
          );
        })()}

        {activeTab==="backtest" && (() => {
          const bt  = ORB_BACKTESTS[btOrbIdx];
          const pts = bt.curve || [];
          const lo  = pts.length ? Math.min(0, ...pts) : 0;
          const hi  = pts.length ? Math.max(...pts) : 0;
          const span = hi - lo || 1;
          const W = 780, H = 160, pad = 8;
          const xStep = pts.length > 1 ? (W - pad*2) / (pts.length - 1) : 1;
          const toY   = v => H - pad - ((v - lo) / span) * (H - pad*2);
          const zero  = toY(0);
          const pathD = pts.map((v,i) => `${i===0?"M":"L"}${pad+i*xStep},${toY(v)}`).join(" ");
          const fillD = pts.length ? `${pathD} L${pad+(pts.length-1)*xStep},${H-pad} L${pad},${H-pad} Z` : "";
          return (
          <div style={{ padding:22, maxWidth:900 }}>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, flexWrap:"wrap" }}>
              <h2 style={{ fontSize:18, fontWeight:700, margin:0 }}>Backtest Results</h2>
              <span style={{ fontSize:10, fontFamily:"monospace", background:C.accentDim, color:C.accent, padding:"2px 8px", borderRadius:4, border:`1px solid ${C.accent}44` }}>HYPOTHETICAL</span>
            </div>

            {/* Backtest selector */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
              {ORB_BACKTESTS.map((b, i) => (
                <button key={b.id} onClick={() => setBtOrbIdx(i)} style={{
                  padding:"14px 16px", borderRadius:10, cursor:"pointer", textAlign:"left",
                  background: btOrbIdx===i ? C.accentDim : C.surface,
                  border:`1px solid ${btOrbIdx===i ? C.accent : C.border}`,
                  transition:"all 0.15s",
                }}>
                  <div style={{ fontSize:15, fontWeight:700, fontFamily:"monospace", color: btOrbIdx===i ? C.accent : C.text, marginBottom:4 }}>{b.label}</div>
                  <div style={{ fontSize:11, color:C.textDim, fontFamily:"monospace" }}>{b.sub}</div>
                </button>
              ))}
            </div>

            {/* Risk note */}
            {bt.riskNote && (
              <div style={{ background:C.warn+"11", border:`1px solid ${C.warn}44`, borderRadius:10, padding:"12px 18px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ color:C.warn, fontSize:14, lineHeight:1 }}>⚠</span>
                <span style={{ fontSize:12, color:C.textMid, lineHeight:1.6 }}>{bt.riskNote}</span>
              </div>
            )}

            {bt.comingSoon ? (
              /* Volatility Filtered — methodology description */
              <div>
                <div style={{ fontSize:13, color:C.textMid, marginBottom:18, lineHeight:1.6 }}>
                  How Signal Boss calculates dynamic stop-loss and take-profit levels based on each day's opening range volatility.
                </div>
                {bt.description.map(d => (
                  <div key={d.heading} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"18px 20px", marginBottom:12 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.accent, fontFamily:"monospace", letterSpacing:"0.06em", marginBottom:8 }}>{d.heading}</div>
                    <p style={{ fontSize:13, color:C.textMid, margin:0, lineHeight:1.7 }}>{d.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Stats grid */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10, marginBottom:22 }}>
                  {[
                    { label:"NET P&L",        value:`+$${bt.netPnl.toLocaleString()}`,  sub:`${bt.wins}W / ${bt.losses}L`,    color:C.long },
                    { label:"TRADES",         value: bt.trades,                          sub: bt.dates,                         color:C.text },
                    { label:"WIN RATE",       value:`${bt.winRate}%`,                    sub:`B/E at ${(100/(1+4)).toFixed(1)}%`, color:C.long },
                    { label:"PROFIT FACTOR",  value:`${bt.profitFactor}x`,               sub:"gross W ÷ gross L",               color:C.accent },
                    { label:"AVG WIN",        value:`$${bt.avgWin.toLocaleString()}`,    sub:"per winning trade",               color:C.long },
                    { label:"AVG LOSS",       value:`$${bt.avgLoss.toLocaleString()}`,   sub:"per losing trade",                color:C.short },
                    { label:"MAX DRAWDOWN",   value:`$${bt.maxDrawdown.toLocaleString()}`, sub:"peak-to-trough",               color:C.warn },
                    { label:"EXPECTANCY",     value:`$${bt.expectancy.toLocaleString()}`, sub:"avg $ earned per trade",        color:C.long },
                  ].map(s => (
                    <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
                      <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:5 }}>{s.label}</div>
                      <div style={{ fontSize:17, fontWeight:700, color:s.color, fontFamily:"monospace" }}>{s.value}</div>
                      <div style={{ fontSize:10, color:C.textDim, marginTop:3 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Equity curve */}
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px", marginBottom:22 }}>
                  <div style={{ fontSize:11, color:C.textDim, fontFamily:"monospace", marginBottom:10, display:"flex", justifyContent:"space-between" }}>
                    <span>EQUITY CURVE  ({bt.trades} trades · 1 contract · cumulative)</span>
                    <span style={{ color:C.long }}>+${hi.toLocaleString()} peak</span>
                  </div>
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:H, display:"block" }}>
                    <defs>
                      <linearGradient id="eq-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.long} stopOpacity="0.18"/>
                        <stop offset="100%" stopColor={C.long} stopOpacity="0.02"/>
                      </linearGradient>
                    </defs>
                    <line x1={pad} y1={zero} x2={W-pad} y2={zero} stroke={C.border} strokeWidth="1" strokeDasharray="3,3"/>
                    <path d={fillD} fill="url(#eq-fill)"/>
                    <path d={pathD} fill="none" stroke={C.long} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
                  </svg>
                  <div style={{ display:"flex", gap:14, marginTop:8, fontSize:10, color:C.textDim, fontFamily:"monospace" }}>
                    <span style={{ color:C.long }}>● {bt.wins} wins</span>
                    <span style={{ color:C.short }}>● {bt.losses} losses</span>
                    <span style={{ marginLeft:"auto" }}>Zero line = breakeven</span>
                  </div>
                </div>

                {/* Disclosure */}
                <div style={{ background:C.surface, border:`1px solid ${C.border}44`, borderRadius:10, padding:"16px 20px" }}>
                  <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.06em", marginBottom:6 }}>IMPORTANT DISCLOSURE</div>
                  <p style={{ fontSize:12, color:C.textMid, margin:0, lineHeight:1.7 }}>
                    Hypothetical results based on backtesting on historical data from ThinkOrSwim. Past performance is not indicative of future results. All trading involves risk of loss.
                  </p>
                  <p style={{ fontSize:11, color:C.textDim, margin:"8px 0 0", lineHeight:1.6 }}>
                    {bt.dates} · {bt.period}. Results do not account for slippage, commissions, or execution differences. For educational purposes only. Not financial advice.
                  </p>
                </div>
              </>
            )}

          </div>
          );
        })()}


        {activeTab==="config" && (
          <div style={{ padding:22, maxWidth:720 }}>
            <div style={{ marginBottom:22 }}>
              <h2 style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>Signal Playbook</h2>
              <p style={{ color:C.textMid, fontSize:13, lineHeight:1.6 }}>How to read, interpret, and execute every signal from Signal Boss — step by step.</p>
            </div>

            {/* Step 1 — Read the signal */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:C.accentDim, border:`1px solid ${C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:C.accent, fontFamily:"monospace", flexShrink:0 }}>1</div>
                <div style={{ fontSize:14, fontWeight:700 }}>Read the Signal</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { field:"Instrument", desc:"Which contract to trade — ES, NQ, RTY, or CL" },
                  { field:"Direction",  desc:"LONG (buy) or SHORT (sell)" },
                  { field:"Entry",      desc:"The price to enter the trade. Use a limit or stop-limit order." },
                  { field:"Stop",       desc:"Your maximum loss on this trade. Do not move it wider." },
                  { field:"Target",     desc:"Your take-profit level. Where you close for a win." },
                  { field:"Strength",   desc:"Signal conviction — STRONG signals have higher follow-through history." },
                ].map(r => (
                  <div key={r.field} style={{ background:C.bg, borderRadius:8, padding:"12px 14px", border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:10, fontFamily:"monospace", color:C.accent, letterSpacing:"0.08em", marginBottom:4 }}>{r.field}</div>
                    <div style={{ fontSize:12, color:C.textMid, lineHeight:1.5 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 — Sizing */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:C.accentDim, border:`1px solid ${C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:C.accent, fontFamily:"monospace", flexShrink:0 }}>2</div>
                <div style={{ fontSize:14, fontWeight:700 }}>Size Your Position</div>
              </div>
              <div style={{ fontSize:12, color:C.textMid, lineHeight:1.8, marginBottom:12 }}>
                Risk a fixed percentage of your account on each trade — typically <span style={{ color:C.accent, fontWeight:600 }}>0.5% – 1%</span> per signal. Never risk more than you're comfortable losing on a single trade.
              </div>
              <div style={{ background:C.accentDim, border:`1px solid ${C.accent}22`, borderRadius:8, padding:"12px 16px" }}>
                <div style={{ fontSize:11, fontFamily:"monospace", color:C.accent, letterSpacing:"0.06em", marginBottom:6 }}>QUICK FORMULA</div>
                <div style={{ fontSize:12, color:C.textMid, fontFamily:"monospace", lineHeight:1.8 }}>
                  Dollar Risk = Account × Risk %<br/>
                  Contracts = Dollar Risk ÷ (Entry − Stop) × Tick Value
                </div>
              </div>
            </div>

            {/* Step 3 — Entry */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:C.accentDim, border:`1px solid ${C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:C.accent, fontFamily:"monospace", flexShrink:0 }}>3</div>
                <div style={{ fontSize:14, fontWeight:700 }}>Execute the Entry</div>
              </div>
              {[
                "Place a stop-limit order at the signal's Entry price.",
                "Set your hard stop immediately upon fill — do not wait.",
                "If the entry price is missed by more than a few ticks, skip the trade.",
                "Do not chase a signal more than 3–5 ticks past the entry level.",
              ].map((rule, i) => (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                  <span style={{ color:C.long, fontSize:13, lineHeight:1, marginTop:1, flexShrink:0 }}>●</span>
                  <span style={{ fontSize:12, color:C.textMid, lineHeight:1.6 }}>{rule}</span>
                </div>
              ))}
            </div>

            {/* Step 4 — Management */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:C.accentDim, border:`1px solid ${C.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:C.accent, fontFamily:"monospace", flexShrink:0 }}>4</div>
                <div style={{ fontSize:14, fontWeight:700 }}>Manage the Trade</div>
              </div>
              {[
                "Scale out 50% at 2R (twice your initial risk). Move stop to breakeven.",
                "Let the runner target the full signal level (4R).",
                "Stop after 2–3 losses in a single session — protect your capital.",
                "Max 2–3 trades per day. More trades ≠ more money.",
                "A REVERSED signal means exit immediately at market.",
              ].map((rule, i) => (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                  <span style={{ color:C.accent, fontSize:13, lineHeight:1, marginTop:1, flexShrink:0 }}>●</span>
                  <span style={{ fontSize:12, color:C.textMid, lineHeight:1.6 }}>{rule}</span>
                </div>
              ))}
            </div>

            {/* Mindset */}
            <div style={{ background:C.accentDim, border:`1px solid ${C.accent}22`, borderRadius:12, padding:"16px 20px" }}>
              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:8 }}>RULE #1</div>
              <p style={{ fontSize:13, color:C.textMid, margin:0, lineHeight:1.7 }}>
                The signal is not the trade — <strong style={{ color:C.text }}>your execution is.</strong> A great signal traded poorly is a loss. A good signal traded with discipline is a business.
              </p>
            </div>

          </div>
        )}

        {activeTab==="pnl"  && <PositionTracker />}

        {activeTab==="prop" && <PropCalc t={t} />}

        {activeTab==="admin" && isAdmin && (() => {
          const active    = signals.filter(s => s.status === "ACTIVE").length;
          const cancelled = signals.filter(s => s.status === "REVERSED").length;
          return (
            <div style={{ padding:22, maxWidth:860 }}>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>Admin — Signal Boss</h2>
                <p style={{ color:C.textMid, fontSize:13 }}>Real-time QC · Signal monitoring · Platform health</p>
              </div>

              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>SIGNAL ENGINE</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10, marginBottom:28 }}>
                {[
                  { label:"ACTIVE SIGNALS",  value: active,   color: active > 0 ? C.long : C.textDim },
                  { label:"REVERSED",         value: cancelled, color: C.warn },
                ].map(s => (
                  <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:6 }}>{s.label}</div>
                    <div style={{ fontSize:22, fontWeight:700, color:s.color, fontFamily:"monospace" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>ACTIVE SIGNALS NOW</div>
              {signals.filter(s => s.status === "ACTIVE").length === 0 ? (
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20, color:C.textMid, fontSize:13, marginBottom:28 }}>No active signals right now.</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
                  {signals.filter(s => s.status === "ACTIVE").map((s, i) => (
                    <div key={i} style={{ background:C.surface, border:`1px solid ${s.direction==="LONG"?C.long+"33":C.short+"33"}`, borderRadius:10, padding:"12px 16px", display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
                      <span style={{ fontFamily:"monospace", fontWeight:700, color:s.direction==="LONG"?C.long:C.short, fontSize:13 }}>{s.direction}</span>
                      <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:13 }}>{s.instrument}</span>
                      <span style={{ fontFamily:"monospace", fontSize:12, color:C.textMid }}>Entry: {s.price}</span>
                      {s.risk && <span style={{ fontFamily:"monospace", fontSize:12, color:C.short }}>Stop: {s.risk.stopPrice}</span>}
                      {s.risk && <span style={{ fontFamily:"monospace", fontSize:12, color:C.long }}>TP: {s.risk.tp2_5Price}</span>}
                      <span style={{ fontFamily:"monospace", fontSize:11, color:C.textDim, marginLeft:"auto" }}>{s.time}</span>
                    </div>
                  ))}
                </div>
              )}

              <AdminCharts />

              {/* ── Manual Signal Form ─────────────────────────────── */}
              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>POST MANUAL SIGNAL</div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:28 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  {/* Instrument */}
                  <div>
                    <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:5 }}>INSTRUMENT</div>
                    <select
                      value={manualForm.instrument}
                      onChange={e => setManualForm(p=>({...p, instrument:e.target.value}))}
                      style={{ width:"100%", padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:13, fontFamily:"monospace" }}>
                      {["ES","NQ","CL","GC","RTY","ZN","6E"].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  {/* Direction */}
                  <div>
                    <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:5 }}>DIRECTION</div>
                    <div style={{ display:"flex", gap:8 }}>
                      {["LONG","SHORT"].map(d=>(
                        <button key={d} onClick={()=>setManualForm(p=>({...p,direction:d}))}
                          style={{ flex:1, padding:"8px 0", background: manualForm.direction===d ? (d==="LONG"?C.long:C.short)+"22" : "transparent",
                            border:`1px solid ${manualForm.direction===d?(d==="LONG"?C.long:C.short):C.border}`,
                            borderRadius:7, color:manualForm.direction===d?(d==="LONG"?C.long:C.short):C.textMid,
                            fontFamily:"monospace", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                          {d==="LONG"?"▲ LONG":"▼ SHORT"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price / Stop / TP */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
                  {[["price","ENTRY PRICE (opt)"],["stop","STOP (opt)"],["tp","TARGET (opt)"]].map(([field,label])=>(
                    <div key={field}>
                      <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:5 }}>{label}</div>
                      <input type="number" placeholder="auto"
                        value={manualForm[field]}
                        onChange={e=>setManualForm(p=>({...p,[field]:e.target.value}))}
                        style={{ width:"100%", padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:13, fontFamily:"monospace", boxSizing:"border-box" }} />
                    </div>
                  ))}
                </div>

                {/* Note */}
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:5 }}>NOTE (optional)</div>
                  <input type="text" placeholder="e.g. ORB breakout confirmed · strong volume"
                    value={manualForm.note}
                    onChange={e=>setManualForm(p=>({...p,note:e.target.value}))}
                    style={{ width:"100%", padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:13, boxSizing:"border-box" }} />
                </div>

                {/* Submit */}
                <button
                  onClick={async ()=>{
                    setManualStatus({ok:null,msg:"Sending..."});
                    try {
                      const resp = await fetch(`${API_URL}/manual-signal`, {
                        method:"POST",
                        headers:{"Content-Type":"application/json","X-Admin-Key":"sb_admin_2026_jr"},
                        body: JSON.stringify({
                          instrument: manualForm.instrument,
                          direction:  manualForm.direction,
                          price:  manualForm.price  ? parseFloat(manualForm.price)  : undefined,
                          stop:   manualForm.stop   ? parseFloat(manualForm.stop)   : undefined,
                          tp:     manualForm.tp     ? parseFloat(manualForm.tp)     : undefined,
                          note:   manualForm.note,
                        }),
                      });
                      const data = await resp.json();
                      if (resp.ok) {
                        setManualStatus({ok:true,  msg:`✅ Signal posted: ${data.id}`});
                        setManualForm(p=>({...p, price:"", stop:"", tp:"", note:""}));
                      } else {
                        setManualStatus({ok:false, msg:`❌ ${data.error || "Error"}`});
                      }
                    } catch(e) {
                      setManualStatus({ok:false, msg:`❌ ${e.message}`});
                    }
                  }}
                  style={{ padding:"10px 24px", background:manualForm.direction==="LONG"?C.long:C.short,
                    border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:13,
                    fontFamily:"monospace", cursor:"pointer" }}>
                  {manualForm.direction==="LONG"?"▲ POST LONG":"▼ POST SHORT"} {manualForm.instrument}
                </button>

                {manualStatus && (
                  <div style={{ marginTop:10, fontSize:12, fontFamily:"monospace",
                    color: manualStatus.ok === true ? C.long : manualStatus.ok === false ? C.warn : C.textMid }}>
                    {manualStatus.msg}
                  </div>
                )}
              </div>

              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>QC CHECKLIST</div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:28 }}>
                {[
                  ["Gist signals URL configured", !!SIGNALS_URL],
                  ["Active signals present",        signals.filter(s=>s.status==="ACTIVE").length > 0],
                  ["Risk data on signals",          signals.some(s=>s.risk)],
                ].map(([label, ok]) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:13 }}>{label}</span>
                    <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:700, color: ok ? C.long : C.warn }}>{ok ? "✓ OK" : "⚠ Check"}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>EXTERNAL DASHBOARDS</div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {[
                  { label:"Stripe Dashboard", url:"https://dashboard.stripe.com" },
                  { label:"Clerk Dashboard",  url:"https://dashboard.clerk.com" },
                  { label:"Signals Gist",     url: SIGNALS_URL },
                ].map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer"
                    style={{ padding:"9px 18px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.accent, fontSize:13, fontFamily:"monospace", textDecoration:"none", fontWeight:600 }}>
                    {label} ↗
                  </a>
                ))}
              </div>
            </div>
          );
        })()}

        {activeTab==="account" && (
          <div style={{ padding:22, maxWidth:520 }}>
            <h2 style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>{t.account}</h2>
            <p style={{ color:C.textMid, fontSize:13, marginBottom:22 }}>{t.accountSub}</p>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:14 }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>{t.subscription}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:18, fontWeight:700, color:C.accent, fontFamily:"monospace" }}>PRO PLAN</div>
                  <div style={{ color:C.textMid, fontSize:13, marginTop:4 }}>$249/month · Renews Mar 18, 2026</div>
                </div>
                <button style={{ padding:"8px 16px", background:"transparent", border:`1px solid ${C.border}`, borderRadius:7, color:C.textMid, cursor:"pointer", fontSize:13 }}>{t.manage}</button>
              </div>
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:14 }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>{t.alertDelivery}</div>
              {[["Dashboard (real-time)",true],["Email notifications",true],["Telegram bot",true],["Webhook",false]].map(([label,on]) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:13 }}>{label}</span>
                  <div style={{ width:40, height:22, borderRadius:11, background:on?C.accent:C.border, position:"relative" }}>
                    <div style={{ position:"absolute", top:3, left:on?21:3, width:16, height:16, borderRadius:"50%", background:"#fff" }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>{t.instruments}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {INSTRUMENTS.map(inst => (
                  <span key={inst} style={{ padding:"5px 14px", background:C.accentDim, border:`1px solid ${C.accent}33`, borderRadius:6, fontSize:12, color:C.accent, fontFamily:"monospace", fontWeight:600 }}>{inst}</span>
                ))}
              </div>
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.prop}33`, borderRadius:12, padding:20, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
              <div>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:4, color:C.prop }}>Earn with Signal Boss</div>
                <div style={{ fontSize:12, color:C.textMid, lineHeight:1.6 }}>Refer traders and earn recurring commission on every active subscription.</div>
              </div>
              <button style={{ padding:"9px 20px", background:"transparent", border:`1px solid ${C.prop}`, borderRadius:7, color:C.prop, cursor:"pointer", fontSize:13, fontWeight:600, whiteSpace:"nowrap" }}>Learn More →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const OTP_SERVICE_ID  = "service_1q4u736";
const OTP_TEMPLATE_ID = "qi3tplv";
const OTP_PUBLIC_KEY  = "w5a8bPV-pgN-NHGbM";

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function StandaloneCalc({ onNavigate, t }) {
  const { user: clerkUser, isLoaded } = useUser();

  // Persist access in localStorage so visitors don't re-enter on every visit
  const [unlocked, setUnlocked] = useState(
    () => !!localStorage.getItem("sb_calc_access")
  );

  const [email, setEmail]       = useState("");
  const [step, setStep]         = useState("email"); // "email" | "otp" | "done"
  const [otp, setOtp]           = useState("");
  const [sentOtp, setSentOtp]   = useState("");
  const [sending, setSending]   = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError]       = useState("");

  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address."); return;
    }
    setSending(true); setError("");
    const code = generateOTP();
    setSentOtp(code);
    try {
      await emailjs.send(OTP_SERVICE_ID, OTP_TEMPLATE_ID, {
        email,
        passcode: code,
        time: new Date(Date.now() + 15*60000).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
        visitor_email: email,
      }, OTP_PUBLIC_KEY);
    } catch(e) {
      setError("Couldn't send code. Try again."); setSending(false); return;
    }
    setSending(false);
    setStep("otp");
  };

  const handleVerifyOtp = () => {
    setVerifying(true);
    if (otp.trim() === sentOtp) {
      localStorage.setItem("sb_calc_access", email);
      setUnlocked(true);
      setStep("done");
    } else {
      setError("Incorrect code. Check your email and try again.");
    }
    setVerifying(false);
  };

  // Wait for Clerk to finish loading before deciding gate visibility
  if (!isLoaded) return null;

  // Admins and any logged-in Clerk user skip the gate entirely
  const hasAccess = unlocked || !!clerkUser;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, padding:"100px 24px 40px" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        <div style={{ marginBottom:32 }}>
          <div onClick={() => onNavigate("landing")} style={{ fontSize:11, color:C.textMid, cursor:"pointer", marginBottom:16, fontFamily:"monospace" }}>← Back to Signal Boss</div>
          <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.02em", marginBottom:8 }}>Account Risk Calculator</h1>
          <p style={{ color:C.textMid, fontSize:14 }}>Free tool. No subscription required. Know your real risk before you trade.</p>
        </div>

        {/* Gate — only shown to non-auth, non-verified visitors */}
        {!hasAccess && (
          <div style={{ maxWidth:460, background:C.surface, border:`1px solid ${C.prop}44`, borderRadius:14, padding:32, marginBottom:40 }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.prop, marginBottom:8 }}>⬡ Free Access</div>

            {step === "email" && (<>
              <p style={{ fontSize:13, color:C.textMid, lineHeight:1.6, marginBottom:20 }}>
                Enter your email to unlock the full calculator. We'll send a 6-digit verification code.
              </p>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="your@email.com" onKeyDown={e => e.key==="Enter" && handleSendOtp()}
                style={{ width:"100%", boxSizing:"border-box", padding:"12px 16px", background:C.bg,
                  border:`1px solid ${error?C.short:C.border}`, borderRadius:7, color:C.text,
                  fontSize:14, fontFamily:"monospace", outline:"none", marginBottom:10, display:"block" }} />
              <button onClick={handleSendOtp} disabled={sending}
                style={{ width:"100%", padding:"12px", background:C.prop, color:"#fff", border:"none", borderRadius:7, fontWeight:700, fontSize:14, cursor:"pointer", opacity:sending?0.7:1 }}>
                {sending ? "Sending code…" : "Send Verification Code →"}
              </button>
              {error && <div style={{ fontSize:12, color:C.short, marginTop:10, fontFamily:"monospace" }}>{error}</div>}
              <div style={{ fontSize:11, color:C.textDim, marginTop:12, textAlign:"center" }}>No spam. Unsubscribe anytime.</div>
            </>)}

            {step === "otp" && (<>
              <p style={{ fontSize:13, color:C.textMid, lineHeight:1.6, marginBottom:6 }}>
                Code sent to <strong style={{ color:C.text }}>{email}</strong>. Enter it below:
              </p>
              <div style={{ fontSize:11, color:C.textDim, marginBottom:16, cursor:"pointer" }}
                onClick={() => { setStep("email"); setError(""); }}>← Use a different email</div>
              <input type="text" inputMode="numeric" maxLength={6} value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/,"")); setError(""); }}
                placeholder="6-digit code" onKeyDown={e => e.key==="Enter" && handleVerifyOtp()}
                style={{ width:"100%", boxSizing:"border-box", padding:"14px 16px", background:C.bg,
                  border:`1px solid ${error?C.short:C.border}`, borderRadius:7, color:C.text,
                  fontSize:22, fontFamily:"monospace", outline:"none", marginBottom:10,
                  display:"block", letterSpacing:"0.3em", textAlign:"center" }} />
              <button onClick={handleVerifyOtp} disabled={verifying || otp.length < 6}
                style={{ width:"100%", padding:"12px", background:C.long, color:"#fff", border:"none", borderRadius:7, fontWeight:700, fontSize:14, cursor:"pointer", opacity:(verifying||otp.length<6)?0.5:1 }}>
                {verifying ? "Verifying…" : "Verify & Unlock →"}
              </button>
              {error && <div style={{ fontSize:12, color:C.short, marginTop:10, fontFamily:"monospace" }}>{error}</div>}
              <div style={{ fontSize:11, color:C.textDim, marginTop:12, textAlign:"center", cursor:"pointer" }}
                onClick={handleSendOtp}>Didn't get it? Resend code</div>
            </>)}
          </div>
        )}

        {/* Confirmation banner for newly verified visitors */}
        {step === "done" && (
          <div style={{ maxWidth:460, background:C.surface, border:`1px solid ${C.long}33`, borderRadius:14, padding:22, marginBottom:32, display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:22 }}>✓</span>
            <div>
              <div style={{ fontWeight:600, color:C.long, marginBottom:4 }}>Verified — you're in!</div>
              <div style={{ fontSize:13, color:C.textMid }}>Access saved for this browser. You won't need to verify again.</div>
            </div>
          </div>
        )}

        {/* Calculator — blurred behind gate for unverified, shown fully for verified/auth */}
        <div style={{ position:"relative" }}>
          {!hasAccess && (
            <div style={{ position:"absolute", inset:0, backdropFilter:"blur(6px)", background:"#08090966", zIndex:10, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ textAlign:"center", color:C.textMid, fontFamily:"monospace", fontSize:13 }}>
                <div style={{ fontSize:28, marginBottom:10 }}>🔒</div>
                Verify your email above to unlock
              </div>
            </div>
          )}
          <PropCalc t={t} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Futures Demo — YouTube video page
// ---------------------------------------------------------------------------
// When your video is ready, replace YOUTUBE_VIDEO_ID with your actual YouTube video ID.
// Example: if URL is https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ
const YOUTUBE_VIDEO_ID = null; // ← paste your YouTube video ID here

function FuturesDemo({ onNavigate }) {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:60, paddingBottom:80, paddingLeft:20, paddingRight:20 }}>
      <div style={{ maxWidth:860, width:"100%" }}>

        {/* Back */}
        <div onClick={() => onNavigate("landing")} style={{ fontSize:11, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", cursor:"pointer", marginBottom:32, display:"inline-flex", alignItems:"center", gap:6 }}>
          ← BACK
        </div>

        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <div style={{ fontSize:11, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>SIGNAL BOSS · FUTURES DEMO</div>
          <h1 style={{ fontSize:28, fontWeight:700, color:C.text, margin:"0 0 12px", lineHeight:1.2 }}>See the engine in action</h1>
          <p style={{ fontSize:14, color:C.textMid, margin:0, maxWidth:560, lineHeight:1.6 }}>
            Watch how Signal Boss identifies multi-cycle momentum confluences in real time — entry price, smart stop, and take profit on every signal.
          </p>
        </div>

        {/* Video */}
        <div style={{ position:"relative", width:"100%", paddingBottom:"56.25%", background:C.surface, borderRadius:12, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:36 }}>
          {YOUTUBE_VIDEO_ID ? (
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
              title="Signal Boss Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%" }}
            />
          ) : (
            <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
              <div style={{ fontSize:40 }}>▶</div>
              <div style={{ fontSize:13, color:C.textMid, fontFamily:"monospace" }}>Demo video coming soon</div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <button onClick={() => onNavigate("signup")} style={{ padding:"13px 32px", background:C.long, color:"#080909", border:"none", borderRadius:8, fontWeight:700, fontSize:14, cursor:"pointer" }}>
            Get Started →
          </button>
          <button onClick={() => onNavigate("landing")} style={{ padding:"13px 24px", background:"transparent", color:C.textMid, border:`1px solid ${C.border}`, borderRadius:8, fontWeight:500, fontSize:14, cursor:"pointer" }}>
            Learn More
          </button>
        </div>

      </div>
    </div>
  );
}

function DemoChooser({ onNavigate, setTrack }) {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"80px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:14 }}>LIVE SIGNAL DEMO</div>
      </div>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center", maxWidth:720, width:"100%" }}>
        {/* Futures */}
        <div onClick={() => { setTrack("futures"); onNavigate("futures-demo"); }}
          style={{ flex:1, minWidth:280, background:C.surface, border:`1px solid ${C.long}44`, borderRadius:16, padding:36, cursor:"pointer", textAlign:"center", position:"relative", overflow:"hidden", transition:"border-color 0.2s" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${C.long}, ${C.accent})` }} />
          <div style={{ fontSize:40, marginBottom:16, filter:`drop-shadow(0 0 12px ${C.long}88)` }}>▲</div>
          <div style={{ fontSize:28, fontWeight:800, color:C.long, fontFamily:"monospace", letterSpacing:"0.08em", marginBottom:12 }}>FUTURES</div>
          <h3 style={{ fontSize:16, fontWeight:600, marginBottom:12, letterSpacing:"-0.01em", color:C.textMid }}>ES · NQ · CL · GC</h3>
          <p style={{ fontSize:14, color:C.textMid, lineHeight:1.75, marginBottom:24 }}>
            IV inflection signals on the most liquid futures markets. Entry, Smart Stop, Smart Take Profit — for every signal.
          </p>
          <div style={{ display:"inline-block", padding:"11px 28px", background:C.longDim, border:`1px solid ${C.long}`, borderRadius:8, color:C.long, fontWeight:700, fontSize:14 }}>
            View Futures Demo →
          </div>
        </div>
        {/* Forex */}
        <div onClick={() => { setTrack("forex"); onNavigate("forex-demo"); }}
          style={{ flex:1, minWidth:280, background:C.surface, border:`1px solid ${C.accent}44`, borderRadius:16, padding:36, cursor:"pointer", textAlign:"center", position:"relative", overflow:"hidden", transition:"border-color 0.2s" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${C.accent}, #a78bfa)` }} />
          <div style={{ fontSize:36, marginBottom:16, letterSpacing:"-0.02em", filter:`drop-shadow(0 0 12px ${C.accent}88)` }}>
            <span style={{ color:C.long }}>$</span><span style={{ color:"#a78bfa" }}>€</span><span style={{ color:C.accent }}>¥</span>
          </div>
          <div style={{ fontSize:28, fontWeight:800, color:C.accent, fontFamily:"monospace", letterSpacing:"0.08em", marginBottom:12 }}>FOREX</div>
          <h3 style={{ fontSize:16, fontWeight:600, marginBottom:12, letterSpacing:"-0.01em", color:C.textMid }}>EUR/USD · Institutional-Grade</h3>
          <p style={{ fontSize:14, color:C.textMid, lineHeight:1.75, marginBottom:24 }}>
            Signals derived from exchange-traded currency futures. Institutional positioning, delivered in spot forex terms.
          </p>
          <div style={{ display:"inline-block", padding:"11px 28px", background:C.accentDim, border:`1px solid ${C.accent}`, borderRadius:8, color:C.accent, fontWeight:700, fontSize:14 }}>
            View Forex Demo →
          </div>
        </div>
      </div>
      <p style={{ fontSize:12, color:C.textDim, marginTop:28, fontFamily:"monospace" }}>Simulated illustration only · Not actual trade data</p>
    </div>
  );
}

function ContactPage({ onNavigate }) {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState("");

  const inputStyle = { width:"100%", padding:"11px 14px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:13, fontFamily:"monospace", outline:"none" };
  const labelStyle = { fontSize:10, color:C.textMid, letterSpacing:"0.12em", display:"block", marginBottom:7, fontFamily:"monospace" };

  const handleSubmit = async () => {
    if (!name || !email || !message) { setError("Please fill in all required fields."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) { setSubmitted(true); }
      else { setError("Something went wrong. Please email info@signalboss.net directly."); }
    } catch(e) {
      setError("Something went wrong. Please email info@signalboss.net directly.");
    }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, padding:"80px 24px 60px" }}>
      <div style={{ maxWidth:560, margin:"0 auto" }}>
        <div style={{ marginBottom:36 }}>
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:12 }}>GET IN TOUCH</div>
          <h1 style={{ fontSize:32, fontWeight:700, letterSpacing:"-0.03em", marginBottom:12 }}>Contact Signal Boss</h1>
          <p style={{ color:C.textMid, fontSize:14, lineHeight:1.7 }}>
            Questions about the product, a subscription, or just want to talk volatility? We read every message.
          </p>
          <div style={{ marginTop:16, fontSize:13, color:C.textMid, fontFamily:"monospace" }}>
            Or email directly: <span style={{ color:C.accent }}>info@signalboss.net</span>
          </div>
        </div>

        {submitted ? (
          <div style={{ background:C.surface, border:`1px solid ${C.long}44`, borderRadius:14, padding:36, textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:16 }}>✓</div>
            <div style={{ fontSize:20, fontWeight:700, color:C.long, marginBottom:8 }}>Message sent.</div>
            <p style={{ color:C.textMid, fontSize:14, lineHeight:1.7, marginBottom:24 }}>
              We'll get back to you at {email} within one business day.
            </p>
            <button onClick={() => onNavigate("landing")} style={{ padding:"11px 28px", background:C.accent, color:"#080909", border:"none", borderRadius:7, fontWeight:600, fontSize:13, cursor:"pointer" }}>
              Back to Signal Boss
            </button>
          </div>
        ) : (
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:32 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div>
                  <label style={labelStyle}>NAME *</label>
                  <input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL *</label>
                  <input style={inputStyle} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>SUBJECT</label>
                <input style={inputStyle} value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. Question about the Pro plan" />
              </div>
              <div>
                <label style={labelStyle}>MESSAGE *</label>
                <textarea value={message} onChange={e=>setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  style={{ ...inputStyle, resize:"vertical", lineHeight:1.7 }} />
              </div>
              {error && <div style={{ fontSize:12, color:C.short, fontFamily:"monospace" }}>{error}</div>}
              <button onClick={handleSubmit} disabled={submitting}
                style={{ width:"100%", padding:"13px", background:C.accent, color:"#080909", border:"none", borderRadius:8, fontWeight:700, fontSize:14, cursor:"pointer", opacity:submitting?0.7:1 }}>
                {submitting ? "Sending..." : "Send Message →"}
              </button>
              <div style={{ fontSize:11, color:C.textDim, textAlign:"center", fontFamily:"monospace" }}>
                We respond within one business day · info@signalboss.net
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Clerk Auth Pages ──────────────────────────────────────────────────────

function ClerkAuthPage({ mode, onNavigate, initialEmail }) {
  const authAppearance = {
    ...clerkDark,
    elements: {
      ...clerkDark.elements,
      footerAction: { display:"none" },
      footer:       { display:"none" },
      badge:        { display:"none" },
    },
  };
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      {mode === "sign-in"
        ? <SignIn afterSignInUrl="/?signed_in=1" signUpUrl="#" signUpForceRedirectUrl="/?signed_in=1"
            appearance={authAppearance} />
        : <SignUp afterSignUpUrl="/?signed_in=1" signInUrl="#" signInForceRedirectUrl="/?signed_in=1"
            initialValues={initialEmail ? { emailAddress: initialEmail } : undefined}
            appearance={authAppearance} />
      }
      <div style={{ position:"absolute", bottom:32, fontSize:13, color:C.textMid }}>
        {mode === "sign-in"
          ? <span>No account? <span onClick={() => onNavigate("signup")} style={{ color:C.accent, cursor:"pointer" }}>Get Started →</span></span>
          : <span>Already subscribed? <span onClick={() => onNavigate("login")} style={{ color:C.accent, cursor:"pointer" }}>Sign in →</span></span>
        }
      </div>
    </div>
  );
}


// ─── Subscribe / Paywall Page ───────────────────────────────────────────────

function SubscribePage({ user, plan, onNavigate, t, track }) {
  const [selectedPlan, setSelectedPlan] = useState(track === "forex" ? "major" : "pro");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const futurePlans = [
    { id:"starter", name:"Starter",  price:149, desc:"Equity index, Treasury, Energy & Metals · Smart Stop & Take Profit · Risk Calculator · Email alerts", color:C.textMid },
    { id:"pro",     name:"Pro",      price:249, desc:"Everything in Starter + Currency Futures · Telegram & Email alerts · 1 Standard Deviation of Intraday IV on every signal", color:C.accent, popular:true },
    { id:"elite",   name:"Elite",    price:449, desc:"Everything in Pro · 1 & 2 Standard Deviations of Intraday IV · Compression/Expansion · Treasury bond spread analysis", color:C.long, contactUs:true },
  ];
  const forexPlans = [
    { id:"major",   name:"Major Pairs", price:129, desc:"Forex Trade Signals · Smart Stop & Take Profit · Risk Calculator · Email alerts", color:C.accent, popular:true },
    { id:"full",    name:"Full Coverage",price:249,desc:"All Major Pairs instruments · Telegram & Email alerts · Additional indicator signals", color:C.long },
  ];
  const plans = track === "forex" ? forexPlans : futurePlans;

  const handleSubscribe = async () => {
    if (!user) { onNavigate("signup"); return; }
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/create-checkout-session`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          userId:   user.id,
          email:    user.primaryEmailAddress?.emailAddress || "",
          plan:     selectedPlan,
          referral: localStorage.getItem("sb_ref") || null,
        }),
      });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;  // redirect to Stripe checkout
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch(e) {
      setError("Could not connect to payment server. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:560 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontWeight:800, fontSize:22, fontFamily:"monospace", marginBottom:8 }}>
            SIGNAL<span style={{ color:C.accent }}>BOSS</span>
          </div>
          <h2 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>
            {plan ? "Manage your subscription" : "Choose your plan"}
          </h2>
          <p style={{ color:C.textMid, fontSize:13 }}>
            30-day money-back guarantee · Cancel anytime · All major cards accepted
          </p>
        </div>

        {/* Plan selector */}
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
          {plans.map(p => (
            <div key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              style={{ background:C.surface, border:`2px solid ${selectedPlan===p.id ? p.color : C.border}`,
                borderRadius:12, padding:"18px 22px", cursor:"pointer", position:"relative",
                transition:"border-color 0.15s" }}>
              {p.popular && (
                <div style={{ position:"absolute", top:-10, right:20, background:p.color, color:"#080909",
                  fontSize:9, fontWeight:700, padding:"2px 12px", borderRadius:20, fontFamily:"monospace", letterSpacing:"0.1em" }}>
                  RECOMMENDED
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${p.color}`,
                      background: selectedPlan===p.id ? p.color : "transparent", flexShrink:0 }} />
                    <span style={{ fontWeight:700, fontSize:15, color:p.color }}>{p.name}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.textMid, marginTop:5, marginLeft:26 }}>{p.desc}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:22, fontWeight:700, fontFamily:"monospace" }}>${p.price}</div>
                  <div style={{ fontSize:11, color:C.textDim }}>/month</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe button */}
        {error && (
          <div style={{ background:C.short+"22", border:`1px solid ${C.short}44`, borderRadius:8,
            padding:"10px 16px", marginBottom:16, fontSize:12, color:C.short }}>
            {error}
          </div>
        )}
        <button onClick={handleSubscribe} disabled={loading}
          style={{ width:"100%", padding:"15px", background:C.accent, color:"#080909", border:"none",
            borderRadius:10, fontWeight:700, fontSize:15, cursor:"pointer", opacity:loading?0.7:1 }}>
          {loading ? "Connecting to checkout…" : "Get Started →"}
        </button>
        {selectedPlan === "elite" && (
          <div style={{ textAlign:"center", marginTop:12 }}>
            <a href="mailto:info@signalboss.net"
              style={{ fontSize:12, color:C.long, textDecoration:"none", borderBottom:`1px solid ${C.long}44` }}>
              📞 Contact us to learn everything Elite includes →
            </a>
          </div>
        )}
        <div style={{ textAlign:"center", marginTop:14, fontSize:12, color:C.textDim }}>
          30-day money-back guarantee · Cancel anytime in your account settings
        </div>

        {/* Track toggle */}
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:24 }}>
          {[["futures","Futures"],["forex","Forex"]].map(([val,label]) => (
            <button key={val} onClick={() => {
              setSelectedPlan(val==="forex" ? "major" : "pro");
            }} style={{ padding:"7px 20px", borderRadius:6, border:`1px solid ${track===val?C.long:C.border}`,
              background:track===val?C.longDim:"transparent", color:track===val?C.long:C.textDim,
              fontSize:12, cursor:"pointer", fontFamily:"monospace" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── Public Backtests Page ───────────────────────────────────────────────────
// ─── CurveShift Analytics Page ───────────────────────────────────────────────
function CurveShiftPage({ onNavigate }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const CS = {
    bg:       "#07111f",
    navy2:    "#0c1c2e",
    navy3:    "#112238",
    panel:    "#0f2035",
    border:   "rgba(255,255,255,.09)",
    border2:  "rgba(255,255,255,.16)",
    text:     "#d8e6f4",
    muted:    "#7896b2",
    subtle:   "#2d4a63",
    gold:     "#c8a050",
    gold2:    "#e0bb72",
    teal:     "#3abfab",
    red:      "#d96060",
    green:    "#50c89a",
    white:    "#f0f7ff",
  };

  const mono = { fontFamily:"'IBM Plex Mono','Courier New',monospace" };
  const cond = { fontFamily:"'DM Sans','Segoe UI',sans-serif", letterSpacing:"0.06em" };

  return (
    <div style={{ background:CS.bg, color:CS.text, minHeight:"100vh", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── HERO ── */}
      <div style={{ position:"relative", minHeight:"92vh", display:"flex", alignItems:"center", padding:"80px 0 60px", overflow:"hidden" }}>
        {/* gold top accent */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${CS.gold} 0%, rgba(200,160,80,.1) 60%, transparent 100%)` }} />
        {/* bg texture */}
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 70% 50%, rgba(17,34,56,.8) 0%, ${CS.bg} 70%)`, pointerEvents:"none" }} />

        <div style={{ position:"relative", maxWidth:1100, margin:"0 auto", padding:"0 32px", width:"100%", display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:56, alignItems:"center" }}>
          {/* Left */}
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:9, border:`1px solid rgba(200,160,80,.35)`, borderRadius:3, padding:"7px 14px", fontSize:12, color:CS.gold, ...cond, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:28 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:CS.gold, display:"inline-block", animation:"pulse 2s infinite" }} />
              U.S. Treasury &amp; Eurobond traders · Institutional grade
            </div>
            <h1 style={{ fontSize:"clamp(38px,4.5vw,62px)", fontWeight:700, lineHeight:1.08, color:CS.white, letterSpacing:"-0.02em", marginBottom:22 }}>
              See the <em style={{ fontStyle:"italic", fontWeight:400, color:CS.gold2 }}>Regime.</em><br/>
              Rank the Curve.<br/>
              Trade the Edge.
            </h1>
            <p style={{ fontSize:17, color:CS.text, lineHeight:1.7, maxWidth:"52ch", marginBottom:36 }}>
              Systematic regime diagnostics and relative value intelligence purpose-built for professional U.S. Treasury and Eurobond traders — cutting signal from noise so you execute the right playbook at the right time.
            </p>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:36 }}>
              <a href="mailto:info@signalboss.net" style={{ padding:"13px 28px", background:CS.gold, color:CS.bg, borderRadius:4, fontWeight:700, fontSize:14, ...cond, textTransform:"uppercase", letterSpacing:"0.06em", textDecoration:"none" }}>
                Request Access →
              </a>
              <span onClick={() => onNavigate("landing")} style={{ padding:"13px 28px", border:`1px solid ${CS.border2}`, color:CS.white, borderRadius:4, fontSize:14, ...cond, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                ← Signal Boss
              </span>
            </div>
            <div style={{ display:"flex", gap:28, flexWrap:"wrap", paddingTop:24, borderTop:`1px solid ${CS.border}` }}>
              {["UST & Eurobond focused","Regime-aware signals","DV01-normalized RV","No buy/sell arrows"].map(t => (
                <div key={t} style={{ fontSize:12, color:CS.muted, ...cond, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:CS.gold, display:"inline-block", flexShrink:0 }} />{t}
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Card */}
          <div style={{ background:"rgba(11,28,46,.92)", border:`1px solid ${CS.border2}`, borderRadius:8, overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,.5)" }}>
            <div style={{ background:CS.navy3, padding:"13px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${CS.border}` }}>
              <span style={{ fontSize:11, color:CS.muted, ...cond, textTransform:"uppercase", letterSpacing:"0.08em" }}>CurveShift Output — Illustrative</span>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:CS.teal, ...cond, fontWeight:600 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:CS.teal, display:"inline-block", animation:"pulse 1.6s ease infinite" }} />LIVE
              </div>
            </div>
            <div style={{ padding:20 }}>
              {/* Regime block */}
              <div style={{ background:"rgba(58,191,171,.07)", border:`1px solid rgba(58,191,171,.22)`, borderRadius:6, padding:"16px 18px", marginBottom:16 }}>
                <div style={{ fontSize:11, color:CS.teal, ...cond, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>Current Regime Classification</div>
                <div style={{ fontSize:20, fontWeight:600, color:CS.white }}>Defensive · Flattening Bias</div>
                <div style={{ fontSize:13, color:CS.muted, marginTop:4 }}>Stability: 82% · 3-state model · 14-day lookback</div>
              </div>
              {/* RV row */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
                {[
                  { label:"Richest",  value:"Front-end", sub:"z: −2.1σ", color:CS.red },
                  { label:"Cheapest", value:"Belly",      sub:"z: +1.8σ", color:CS.green },
                  { label:"Setups",   value:"2",          sub:"Regime-aligned", color:CS.gold },
                ].map(r => (
                  <div key={r.label} style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${CS.border}`, borderRadius:5, padding:"12px 10px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:CS.muted, ...cond, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:5 }}>{r.label}</div>
                    <div style={{ fontSize:17, fontWeight:700, color:r.color }}>{r.value}</div>
                    <div style={{ fontSize:11, color:CS.muted, marginTop:3 }}>{r.sub}</div>
                  </div>
                ))}
              </div>
              {/* Spark */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, color:CS.muted, ...cond, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>2s10s UST Spread — 60D Z-Score</div>
                <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:34 }}>
                  {[30,38,34,48,44,56,50,64,60,74,84,91,100,90,78].map((h,i) => (
                    <div key={i} style={{ flex:1, borderRadius:"2px 2px 0 0", height:`${h}%`, background: h >= 84 ? CS.gold : CS.subtle }} />
                  ))}
                </div>
              </div>
              {/* Chips */}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {[
                  { label:"Regime Filter ✓", on:true },
                  { label:"RV ≥ 1.5σ ✓",    on:true },
                  { label:"Liquidity",        on:false },
                  { label:"Vol-adj",          on:false },
                ].map(c => (
                  <div key={c.label} style={{ fontSize:11, ...cond, textTransform:"uppercase", letterSpacing:"0.04em", padding:"5px 10px", borderRadius:3,
                    background: c.on ? "rgba(200,160,80,.13)" : "rgba(255,255,255,.04)",
                    border: `1px solid ${c.on ? "rgba(200,160,80,.35)" : CS.border}`,
                    color: c.on ? CS.gold : CS.muted }}>
                    {c.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── METRICS BAR ── */}
      <div style={{ background:CS.navy3, borderTop:`1px solid ${CS.border}`, borderBottom:`1px solid ${CS.border}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
          {[
            { label:"Instruments Tracked", value:"80+",          sub:"UST & Eurobond spreads, flies, boxes" },
            { label:"Regime States",        value:"6",            sub:"Macro + curve dimensions" },
            { label:"Signal Lookbacks",     value:"Configurable", sub:"30 / 60 / 90 / 252 day" },
            { label:"Audience",             value:"Pro Only",     sub:"Institutional rates & macro" },
          ].map(m => (
            <div key={m.label} style={{ padding:"28px 24px", borderRight:`1px solid ${CS.border}` }}>
              <div style={{ fontSize:11, color:CS.muted, ...cond, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>{m.label}</div>
              <div style={{ fontSize:28, fontWeight:700, color:CS.white, lineHeight:1, marginBottom:6 }}>{m.value}</div>
              <div style={{ fontSize:12, color:CS.muted }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PLATFORM ── */}
      <div style={{ padding:"100px 32px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ marginBottom:56 }}>
          <div style={{ fontSize:12, color:CS.gold, ...cond, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ display:"inline-block", width:28, height:1, background:CS.gold }} />Platform Overview
          </div>
          <h2 style={{ fontSize:"clamp(28px,3.5vw,44px)", fontWeight:700, color:CS.white, marginBottom:18, lineHeight:1.15 }}>Decision intelligence built<br/>for the Treasury desk</h2>
          <p style={{ fontSize:16, color:CS.muted, lineHeight:1.75, maxWidth:"58ch" }}>CurveShift organizes professional fixed income decision-making into a repeatable sequence: state → relative value → timing → structure. Less scanning. More execution.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", border:`1px solid ${CS.border}` }}>
          {[
            { num:"01 — Regime",       title:"Regime Diagnostics",   body:"Classifies macro and curve regime states, scores transition probability, and flags 'don't fight it' conditions across U.S. Treasury and Eurobond markets — so your trade is aligned before you put it on." },
            { num:"02 — Relative Value", title:"RV Rankings",         body:"Ranks UST and Eurobond instruments and spreads by rich/cheap distortion using z-score normalization, momentum state, and multi-lookback deviation across your full watchlist." },
            { num:"03 — Filter",        title:"Opportunity Filters",  body:"Surfaces only regime-aligned setups when your statistical thresholds are confirmed — cutting churn and cognitive load across both Treasury and Eurobond spread books." },
          ].map((f, i) => (
            <div key={f.num} style={{ padding:"40px 34px", borderLeft: i > 0 ? `1px solid ${CS.border}` : "none", position:"relative", overflow:"hidden" }}>
              <div style={{ fontSize:11, color:CS.gold, ...cond, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:20, opacity:0.65 }}>{f.num}</div>
              <h4 style={{ fontSize:22, fontWeight:600, color:CS.white, marginBottom:14 }}>{f.title}</h4>
              <p style={{ fontSize:15, color:CS.muted, lineHeight:1.7 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUOTE DIVIDER ── */}
      <div style={{ background:CS.navy3, borderTop:`1px solid ${CS.border}`, borderBottom:`1px solid ${CS.border}`, padding:"64px 32px", textAlign:"center" }}>
        <blockquote style={{ fontSize:"clamp(20px,2.5vw,28px)", fontWeight:300, fontStyle:"italic", color:CS.white, maxWidth:700, margin:"0 auto 14px", lineHeight:1.4 }}>
          "The regime is the context. The RV is the trade.<br/>Everything else is noise."
        </blockquote>
        <cite style={{ fontSize:12, color:CS.gold, ...cond, textTransform:"uppercase", letterSpacing:"0.12em", fontStyle:"normal" }}>CurveShift Analytics — Design Philosophy</cite>
      </div>

      {/* ── WORKFLOW ── */}
      <div style={{ background:CS.navy2, padding:"100px 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"start" }}>
          <div>
            <div style={{ fontSize:12, color:CS.gold, ...cond, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ display:"inline-block", width:28, height:1, background:CS.gold }} />Workflow
            </div>
            <h2 style={{ fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:CS.white, marginBottom:48, lineHeight:1.2 }}>A repeatable process for<br/>serious Treasury traders</h2>
            {[
              { n:"01", title:"Identify the Regime",   body:"Read the macro and curve environment across UST and Eurobond markets: risk posture, inflation pressure, liquidity tone, and directional bias. Don't fight the regime." },
              { n:"02", title:"Rank RV Distortions",   body:"Scan the richness/cheapness ladder — z-normalized, momentum-contextualized — across UST spreads, flies, boxes, and Eurobond relative value on your configured watchlist." },
              { n:"03", title:"Filter for Conviction", body:"Only surface setups when regime alignment and statistical threshold both confirm across your target instruments. Lower churn, higher quality." },
              { n:"04", title:"Structure the Risk",    body:"DV01-balanced framing, invalidation levels, and ratio guidance for Treasury and Eurobond spreads. Your execution, your risk — CurveShift provides the analytical map." },
            ].map((s, i) => (
              <div key={s.n} style={{ display:"flex", gap:24, padding:"28px 0", borderBottom: i < 3 ? `1px solid ${CS.border}` : "none" }}>
                <span style={{ fontSize:13, fontWeight:700, color:CS.gold, ...cond, flexShrink:0, paddingTop:2 }}>{s.n}</span>
                <div>
                  <h5 style={{ fontSize:19, fontWeight:600, color:CS.white, marginBottom:8 }}>{s.title}</h5>
                  <p style={{ fontSize:15, color:CS.muted, lineHeight:1.7 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Who card */}
          <div style={{ background:CS.panel, border:`1px solid ${CS.border2}`, borderRadius:6, overflow:"hidden" }}>
            <div style={{ height:200, background:`linear-gradient(to bottom, rgba(7,17,31,.1), rgba(7,17,31,.7)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80') center/cover` }} />
            <div style={{ padding:"30px 28px" }}>
              <h4 style={{ fontSize:22, fontWeight:600, color:CS.white, marginBottom:20 }}>Built for professionals who live in the rates market</h4>
              {["U.S. Treasury futures and cash traders","Eurobond relative value specialists","Fixed income prop desks & small macro funds","Systematic-discretionary hybrid managers","CTA and global macro rates allocators"].map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${CS.border}`, fontSize:15, fontWeight:500, color:CS.text }}>
                  <span style={{ color:CS.teal, fontSize:13, flexShrink:0 }}>✓</span>{item}
                </div>
              ))}
              <div style={{ marginTop:20, padding:"14px 16px", background:"rgba(255,255,255,.03)", border:`1px solid ${CS.border}`, borderRadius:4, fontSize:13, color:CS.muted, lineHeight:1.65 }}>
                ⚠ Analytics and decision-support tools only. CurveShift does not provide individualized investment advice.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODULES ── */}
      <div style={{ padding:"100px 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:12, color:CS.gold, ...cond, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ display:"inline-block", width:28, height:1, background:CS.gold }} />Modules
          </div>
          <h2 style={{ fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:CS.white, marginBottom:16, lineHeight:1.2 }}>One cohesive suite.<br/>Six purpose-built tools.</h2>
          <p style={{ fontSize:16, color:CS.muted, lineHeight:1.75, maxWidth:"58ch", marginBottom:48 }}>Consistent naming, consistent logic, single purpose: make regime shifts and RV opportunities across U.S. Treasuries and Eurobonds unmistakably obvious.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {[
              { tier:"Core · I",     title:"CurveShift Regime™",   badge:"Regime",        body:"Regime state classification, stability scoring, and transition detection across UST and Eurobond environments. Identifies 'don't fight it' conditions and early inflection signals." },
              { tier:"Core · II",    title:"CurveShift RV™",       badge:"Relative Value", body:"Rich/cheap ladder with z-score normalization, momentum context, and multi-lookback deviation across your full Treasury and Eurobond instrument watchlist." },
              { tier:"Core · III",   title:"CurveShift Filter™",   badge:"Filter",         body:"Qualifies setups only when your thresholds are met: regime-aligned, statistically significant, within configurable volatility bands for your chosen instruments." },
              { tier:"Advanced · IV",title:"CurveShift Structure™",badge:"Structure",      body:"Risk framing and invalidation logic: DV01-balanced trade guidance, ratio structuring, and position hygiene rules for UST and Eurobond spread positioning." },
              { tier:"Advanced · V", title:"Watchlists & Presets", badge:"Configure",      body:"Save your preferred Treasury curves, Eurobond spreads, flies, lookbacks, and full dashboard configurations. Deploy your exact workflow instantly each session." },
              { tier:"UX · VI",      title:"Low-Noise Interface",  badge:"Interface",      body:"Professional, distraction-free presentation. Consistent panel layouts, fast readouts, and zero clutter. Signal clarity by design, built for the rates desk." },
            ].map(m => (
              <div key={m.title} style={{ background:CS.panel, border:`1px solid ${CS.border}`, borderRadius:6, padding:"30px 26px" }}>
                <div style={{ fontSize:11, color:CS.teal, ...cond, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>{m.tier}</div>
                <h4 style={{ fontSize:20, fontWeight:600, color:CS.white, marginBottom:12 }}>{m.title}</h4>
                <p style={{ fontSize:14, color:CS.muted, lineHeight:1.75 }}>{m.body}</p>
                <div style={{ display:"inline-block", marginTop:16, fontSize:11, fontWeight:600, ...cond, textTransform:"uppercase", letterSpacing:"0.06em", padding:"4px 10px", borderRadius:3, background:"rgba(200,160,80,.11)", border:"1px solid rgba(200,160,80,.25)", color:CS.gold }}>{m.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRICING ── */}
      <div style={{ background:CS.navy2, padding:"100px 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:12, color:CS.gold, ...cond, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ display:"inline-block", width:28, height:1, background:CS.gold }} />Access
          </div>
          <h2 style={{ fontSize:"clamp(26px,3vw,40px)", fontWeight:700, color:CS.white, marginBottom:16, lineHeight:1.2 }}>Built for a small cohort<br/>of serious traders</h2>
          <p style={{ fontSize:16, color:CS.muted, lineHeight:1.75, maxWidth:"58ch", marginBottom:48 }}>Purposely limited. We want a tight feedback loop with professionals who actually live in the U.S. Treasury and Eurobond markets.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {[
              {
                tier:"Tier 01", name:"Professional", price:"$995", per:"/month · billed monthly",
                desc:"Independent prop traders & discretionary managers", featured:false,
                items:["CurveShift Regime™ + CurveShift RV™","CurveShift Filter™","UST & Eurobond coverage","Single-user seat","Ongoing updates"],
              },
              {
                tier:"Tier 02", name:"Desk", price:"$2,195", per:"/month · up to 5 seats",
                desc:"Small funds, prop desks & trading teams", featured:true,
                items:["Everything in Professional","CurveShift Structure™","Team onboarding session","Custom presets & dashboards","Priority support"],
              },
              {
                tier:"Tier 03", name:"Private Cohort", price:"Application", per:"Reviewed individually",
                desc:"Application-only · limited seats available", featured:false,
                items:["All modules + roadmap access","Direct product feedback loop","Priority feature requests","White-glove onboarding & support"],
              },
            ].map(p => (
              <div key={p.name} style={{ background:CS.panel, border:`1px solid ${p.featured ? "rgba(200,160,80,.42)" : CS.border}`, borderRadius:6, padding:"36px 30px", position:"relative",
                background: p.featured ? `linear-gradient(155deg, rgba(200,160,80,.07) 0%, ${CS.panel} 55%)` : CS.panel }}>
                {p.featured && <div style={{ position:"absolute", top:-1, right:24, background:CS.gold, color:CS.bg, fontSize:11, fontWeight:700, ...cond, textTransform:"uppercase", letterSpacing:"0.06em", padding:"5px 13px", borderRadius:"0 0 5px 5px" }}>Most Popular</div>}
                <div style={{ fontSize:11, color:CS.muted, ...cond, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>{p.tier}</div>
                <h4 style={{ fontSize:26, fontWeight:700, color:CS.white, marginBottom:6 }}>{p.name}</h4>
                <p style={{ fontSize:14, color:CS.muted, marginBottom:22 }}>{p.desc}</p>
                <div style={{ fontSize: p.price==="Application" ? 28 : 46, fontWeight:700, color:CS.white, lineHeight:1, letterSpacing:"-0.02em", paddingTop: p.price==="Application" ? 10 : 0 }}>{p.price}</div>
                <div style={{ fontSize:13, color:CS.muted, marginBottom:24, marginTop:4, ...cond }}>{p.per}</div>
                <hr style={{ border:"none", borderTop:`1px solid ${CS.border}`, marginBottom:22 }} />
                <ul style={{ listStyle:"none" }}>
                  {p.items.map(item => (
                    <li key={item} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"8px 0", fontSize:14, color:CS.muted, lineHeight:1.5 }}>
                      <span style={{ color:CS.teal, flexShrink:0, fontSize:13 }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
                <a href="mailto:info@signalboss.net" style={{ display:"block", width:"100%", marginTop:24, textAlign:"center", padding:13, borderRadius:4, fontSize:13, fontWeight:600, ...cond, textTransform:"uppercase", letterSpacing:"0.06em", textDecoration:"none", cursor:"pointer",
                  background: p.featured ? CS.gold : "transparent",
                  color: p.featured ? CS.bg : CS.text,
                  border: p.featured ? "none" : `1px solid ${CS.border2}` }}>
                  Apply →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTACT ── */}
      <div style={{ padding:"100px 32px", background:CS.bg }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:".45fr 1fr", gap:68, alignItems:"start" }}>
          <div>
            <div style={{ fontSize:12, color:CS.gold, ...cond, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ display:"inline-block", width:28, height:1, background:CS.gold }} />Request Access
            </div>
            <h3 style={{ fontSize:"clamp(22px,2.5vw,34px)", fontWeight:700, color:CS.white, lineHeight:1.2, marginBottom:16 }}>If you trade Treasuries or Eurobonds professionally, let's talk</h3>
            <p style={{ fontSize:16, color:CS.muted, lineHeight:1.75 }}>We review every application individually. Tell us what you trade, what problems you're solving, and what you want CurveShift to do for your desk.</p>
            <div style={{ marginTop:26, padding:"16px 18px", background:"rgba(200,160,80,.07)", border:"1px solid rgba(200,160,80,.22)", borderRadius:4, fontSize:14, color:CS.muted, lineHeight:1.65 }}>
              Prefer a direct line?<br/>
              <strong style={{ color:CS.gold2 }}>info@signalboss.net</strong>
            </div>
          </div>
          <div style={{ background:"rgba(11,28,46,.92)", border:`1px solid ${CS.border2}`, borderRadius:8, padding:38 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              {[
                { label:"Full Name",         id:"nm",  type:"text",  placeholder:"Jane Smith",                    full:false },
                { label:"Email Address",     id:"em",  type:"email", placeholder:"jane@fund.com",                 full:false },
                { label:"Role / Title",      id:"rl",  type:"text",  placeholder:"Prop trader, PM, analyst…",    full:false },
                { label:"Markets You Trade", id:"mk",  type:"text",  placeholder:"UST futures, Eurobonds, swaps…",full:false },
                { label:"Firm / Organization",id:"fm", type:"text",  placeholder:"Fund name or 'Independent'",   full:false },
              ].map(f => (
                <div key={f.id} style={{ gridColumn: f.full ? "1 / -1" : "auto", display:"flex", flexDirection:"column", gap:7 }}>
                  <label style={{ fontSize:11, color:CS.muted, ...cond, textTransform:"uppercase", letterSpacing:"0.08em" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} style={{ background:"rgba(255,255,255,.05)", border:`1px solid ${CS.border2}`, borderRadius:4, padding:"12px 14px", color:CS.white, fontSize:15, outline:"none", fontFamily:"inherit" }} />
                </div>
              ))}
              <div style={{ gridColumn:"1 / -1", display:"flex", flexDirection:"column", gap:7 }}>
                <label style={{ fontSize:11, color:CS.muted, ...cond, textTransform:"uppercase", letterSpacing:"0.08em" }}>What do you want CurveShift to help you do?</label>
                <textarea placeholder="What you trade, what problems you're solving, what gaps exist in your current process…" style={{ background:"rgba(255,255,255,.05)", border:`1px solid ${CS.border2}`, borderRadius:4, padding:"12px 14px", color:CS.white, fontSize:15, outline:"none", fontFamily:"inherit", minHeight:110, resize:"vertical" }} />
              </div>
              <a href="mailto:info@signalboss.net" style={{ gridColumn:"1 / -1", display:"block", textAlign:"center", padding:14, background:CS.gold, color:CS.bg, border:"none", borderRadius:4, fontSize:14, fontWeight:700, ...cond, textTransform:"uppercase", letterSpacing:"0.06em", textDecoration:"none", cursor:"pointer" }}>
                Send Request →
              </a>
            </div>
            <div style={{ fontSize:13, color:CS.muted, marginTop:16, lineHeight:1.65 }}>CurveShift Analytics provides analytical tools only. No content constitutes investment advice. Applications are reviewed personally — we respond within 2 business days.</div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop:`1px solid ${CS.border}`, padding:"36px 32px", background:CS.bg }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:36, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:CS.white, ...cond, marginBottom:4 }}>CurveShift Analytics</div>
            <div style={{ fontSize:13, color:CS.muted }}>© {new Date().getFullYear()} All rights reserved</div>
            <div style={{ marginTop:12, display:"flex", gap:20, flexWrap:"wrap" }}>
              {["Platform","Modules","Access","info@signalboss.net"].map(l => (
                <span key={l} style={{ fontSize:12, color:CS.muted, ...cond, cursor:"pointer" }}>{l}</span>
              ))}
              <span onClick={() => onNavigate("landing")} style={{ fontSize:12, color:CS.gold, ...cond, cursor:"pointer" }}>← Signal Boss</span>
            </div>
          </div>
          <div style={{ fontSize:13, color:CS.subtle, maxWidth:"52ch", lineHeight:1.75 }}>
            CurveShift Analytics provides analytics and decision-support tools only. No content constitutes investment advice or a recommendation to buy or sell any security. Trading futures and derivatives involves substantial risk of loss.
          </div>
        </div>
      </div>

    </div>
  );
}


function PublicBacktests({ onNavigate }) {
  const [btIdx, setBtIdx] = useState(0);
  const bt   = ORB_BACKTESTS[btIdx];
  const pts  = bt.curve || [];
  const lo   = pts.length ? Math.min(0, ...pts) : 0;
  const hi   = pts.length ? Math.max(...pts) : 0;
  const span = hi - lo || 1;
  const W = 780, H = 160, pad = 8;
  const xStep = pts.length > 1 ? (W - pad*2) / (pts.length - 1) : 1;
  const toY   = v => H - pad - ((v - lo) / span) * (H - pad*2);
  const zero  = toY(0);
  const pathD = pts.map((v,i) => `${i===0?"M":"L"}${pad+i*xStep},${toY(v)}`).join(" ");
  const fillD = pts.length ? `${pathD} L${pad+(pts.length-1)*xStep},${H-pad} L${pad},${H-pad} Z` : "";

  return (
    <div style={{ minHeight:"100vh", padding:"40px 24px 80px", maxWidth:960, margin:"0 auto" }}>

      {/* Page header */}
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:11, color:C.accent, fontFamily:"monospace", letterSpacing:"0.18em", marginBottom:10 }}>VOLATILITY ALIGNED BREAKOUT TRADES</div>
        <h1 style={{ fontSize:28, fontWeight:800, marginBottom:10, letterSpacing:"-0.03em" }}>Backtest Results</h1>
        <p style={{ color:C.textMid, fontSize:14, lineHeight:1.7, maxWidth:620 }}>
          Historical performance of the Signal Boss opening-range breakout strategy across five futures instruments.
          All results generated in ThinkOrSwim on tick-accurate historical data.
        </p>
      </div>

      {/* Selector */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:24 }}>
        {ORB_BACKTESTS.map((b, i) => (
          <button key={b.id} onClick={() => setBtIdx(i)} style={{
            padding:"14px 16px", borderRadius:10, cursor:"pointer", textAlign:"left",
            background: btIdx===i ? C.accentDim : C.surface,
            border:`1px solid ${btIdx===i ? C.accent : C.border}`,
            transition:"all 0.15s",
          }}>
            <div style={{ fontSize:15, fontWeight:700, fontFamily:"monospace", color:btIdx===i?C.accent:C.text, marginBottom:4 }}>{b.label}</div>
            <div style={{ fontSize:11, color:C.textDim, fontFamily:"monospace" }}>{b.sub}</div>
          </button>
        ))}
      </div>

      {/* Risk note */}
      {bt.riskNote && (
        <div style={{ background:C.warn+"11", border:`1px solid ${C.warn}44`, borderRadius:10, padding:"12px 18px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ color:C.warn, fontSize:14, lineHeight:1 }}>⚠</span>
          <span style={{ fontSize:12, color:C.textMid, lineHeight:1.6 }}>{bt.riskNote}</span>
        </div>
      )}

      {bt.comingSoon ? (
        <div>
          <div style={{ fontSize:13, color:C.textMid, marginBottom:18, lineHeight:1.6 }}>How Signal Boss calculates dynamic stop-loss and take-profit levels based on each day's opening range volatility.</div>
          {bt.description.map(d => (
            <div key={d.heading} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"18px 20px", marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.accent, fontFamily:"monospace", letterSpacing:"0.06em", marginBottom:8 }}>{d.heading}</div>
              <p style={{ fontSize:13, color:C.textMid, margin:0, lineHeight:1.7 }}>{d.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10, marginBottom:22 }}>
            {[
              { label:"NET P&L",       value:`+$${bt.netPnl.toLocaleString()}`,      sub:`${bt.wins}W / ${bt.losses}L`,       color:C.long },
              { label:"TRADES",        value: bt.trades,                              sub: bt.dates,                            color:C.text },
              { label:"WIN RATE",      value:`${bt.winRate}%`,                        sub:`B/E at ${(100/(1+4)).toFixed(1)}%`,  color:C.long },
              { label:"PROFIT FACTOR", value:`${bt.profitFactor}x`,                  sub:"gross W ÷ gross L",                  color:C.accent },
              { label:"AVG WIN",       value:`$${bt.avgWin.toLocaleString()}`,        sub:"per winning trade",                  color:C.long },
              { label:"AVG LOSS",      value:`$${bt.avgLoss.toLocaleString()}`,       sub:"per losing trade",                   color:C.short },
              { label:"MAX DRAWDOWN",  value:`$${bt.maxDrawdown.toLocaleString()}`,   sub:"peak-to-trough",                     color:C.warn },
              { label:"EXPECTANCY",    value:`$${bt.expectancy.toLocaleString()}`,    sub:"avg $ earned per trade",             color:C.long },
            ].map(s => (
              <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
                <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:5 }}>{s.label}</div>
                <div style={{ fontSize:17, fontWeight:700, color:s.color, fontFamily:"monospace" }}>{s.value}</div>
                <div style={{ fontSize:10, color:C.textDim, marginTop:3 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Equity curve */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px", marginBottom:22 }}>
            <div style={{ fontSize:11, color:C.textDim, fontFamily:"monospace", marginBottom:10, display:"flex", justifyContent:"space-between" }}>
              <span>EQUITY CURVE  ({bt.trades} trades · 1 contract · cumulative)</span>
              <span style={{ color:C.long }}>+${hi.toLocaleString()} peak</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:H, display:"block" }}>
              <defs>
                <linearGradient id="pub-eq-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.long} stopOpacity="0.18"/>
                  <stop offset="100%" stopColor={C.long} stopOpacity="0.02"/>
                </linearGradient>
              </defs>
              <line x1={pad} y1={zero} x2={W-pad} y2={zero} stroke={C.border} strokeWidth="1" strokeDasharray="3,3"/>
              <path d={fillD} fill="url(#pub-eq-fill)"/>
              <path d={pathD} fill="none" stroke={C.long} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
            <div style={{ display:"flex", gap:14, marginTop:8, fontSize:10, color:C.textDim, fontFamily:"monospace" }}>
              <span style={{ color:C.long }}>● {bt.wins} wins</span>
              <span style={{ color:C.short }}>● {bt.losses} losses</span>
              <span style={{ marginLeft:"auto" }}>Zero line = breakeven</span>
            </div>
          </div>

          {/* Disclosure */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}44`, borderRadius:10, padding:"16px 20px", marginBottom:32 }}>
            <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.06em", marginBottom:6 }}>IMPORTANT DISCLOSURE</div>
            <p style={{ fontSize:12, color:C.textMid, margin:0, lineHeight:1.7 }}>
              Hypothetical results based on backtesting on historical data from ThinkOrSwim. Past performance is not indicative of future results. All trading involves significant risk of loss. Do not trade with money you cannot afford to lose.
            </p>
            <p style={{ fontSize:11, color:C.textDim, margin:"8px 0 0", lineHeight:1.6 }}>
              {bt.dates} · {bt.period}. Results do not account for slippage, commissions, or execution differences. Hypothetical performance results have many inherent limitations. For educational purposes only. Not financial advice.
            </p>
          </div>
        </>
      )}

      {/* CTA */}
      <div style={{ textAlign:"center", padding:"40px 24px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:16 }}>
        <div style={{ fontSize:11, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:12 }}>LIVE SIGNALS</div>
        <h2 style={{ fontSize:22, fontWeight:700, marginBottom:10 }}>Ready to trade with these signals?</h2>
        <p style={{ color:C.textMid, fontSize:14, marginBottom:24, maxWidth:480, margin:"0 auto 24px" }}>
          Signal Boss delivers the same strategy in real-time — entry, stop, and target on every alert.
        </p>
        <button onClick={() => onNavigate("signup")} style={{ padding:"14px 36px", background:C.accent, border:"none", borderRadius:8, color:"#080d14", cursor:"pointer", fontWeight:800, fontSize:15, fontFamily:"monospace", letterSpacing:"0.06em" }}>
          GET STARTED →
        </button>
      </div>

    </div>
  );
}


function AppInner() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser }      = useUser();
  const [page, setPage]           = useState("landing");
  const [lang, setLang]           = useState("en");
  const [track, setTrack]         = useState(null);
  const [pendingCalcEmail, setPendingCalcEmail] = useState("");
  const [postAuthDest, setPostAuthDest]         = useState(null);
  const t = T[lang];

  const isSubscribed = clerkUser?.publicMetadata?.subscribed === true;
  const isAdmin      = clerkUser?.publicMetadata?.role === "admin";
  const activePlan   = clerkUser?.publicMetadata?.plan || null;

  // Handler: calc email form → Clerk signup → calculator
  const handleCalcSignup = (email) => {
    setPendingCalcEmail(email);
    setPostAuthDest("calc");
    setPage("signup");
  };

  // Auto-navigate when Clerk auth state resolves
  useEffect(() => {
    if (!isLoaded) return;
    // Just signed in → go to calculator (if from calc form) or dashboard/subscribe
    if (isSignedIn && (page === "login" || page === "signup")) {
      if (postAuthDest === "calc") {
        setPostAuthDest(null);
        setPage("calc");
      } else {
        setPage((isSubscribed || isAdmin) ? "dashboard" : "subscribe");
      }
    }
    // Session expired or signed out while on dashboard
    if (!isSignedIn && page === "dashboard") {
      setPage("landing");
    }
    // Post-login redirect (?signed_in=1 in URL)
    if (isSignedIn && window.location.search.includes("signed_in=1")) {
      window.history.replaceState({}, "", "/");
      setPage((isSubscribed || isAdmin) ? "dashboard" : "subscribe");
    }
    // Stripe success redirect (?subscribed=true in URL)
    if (isSignedIn && window.location.search.includes("subscribed=true")) {
      window.history.replaceState({}, "", "/");
      setPage("dashboard");
    }
  }, [isLoaded, isSignedIn, isSubscribed, postAuthDest]);

  return (
    <>
      <style>{css}</style>
      {page !== "dashboard" && (
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 32px", borderBottom:`1px solid ${C.border}44`, backdropFilter:"blur(16px)", background:"#000000ee" }}>
          <div onClick={() => { setPage("landing"); setTrack(null); }} style={{ fontWeight:800, fontSize:22, cursor:"pointer", fontFamily:"monospace", color:"#ffffff", letterSpacing:"0.04em" }}>
            SIGNAL<span style={{ color:C.accent }}>BOSS</span>
          </div>
          {/* Center: track toggle + nav links */}
          <div style={{ display:"flex", alignItems:"center", gap:24 }}>
            {/* Track toggle */}
            <div style={{ display:"flex", alignItems:"center", gap:4, background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:3 }}>
              <button onClick={() => setTrack("futures")} style={{ padding:"6px 18px", borderRadius:6, border:"none", background:(!track||track==="futures")?C.longDim:"transparent", color:(!track||track==="futures")?C.long:C.textMid, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"monospace", letterSpacing:"0.08em", transition:"all 0.15s" }}>FUTURES</button>
              <button onClick={() => setTrack("forex")} style={{ padding:"6px 18px", borderRadius:6, border:"none", background:track==="forex"?C.accentDim:"transparent", color:track==="forex"?C.accent:C.textMid, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"monospace", letterSpacing:"0.08em", transition:"all 0.15s" }}>FOREX</button>
            </div>
            {/* Nav links */}
            {(page === "landing" || page === "backtests") && (
              <div style={{ display:"flex", gap:24, alignItems:"center" }}>
                {[
                  { label:"The Edge",       action: e=>{e.preventDefault();document.getElementById("how-it-works")?.scrollIntoView({behavior:"smooth"});setPage("landing");} },
                  { label:"Backtests",      action: e=>{e.preventDefault();setPage("backtests");}, active: page==="backtests" },
                  { label:"Risk Calculator",action: e=>{e.preventDefault();setPage("calc");} },
                  { label:"Pricing",        action: e=>{e.preventDefault();document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"});setPage("landing");} },
                  { label:"Contact",        action: e=>{e.preventDefault();setPage("contact");} },
                ].map(item => (
                  <a key={item.label} onClick={item.action} style={{
                    fontSize:12, fontWeight:600, color: item.active ? C.accent : C.textMid,
                    textDecoration:"none", fontFamily:"'IBM Plex Mono','Courier New',monospace",
                    letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer",
                    transition:"color 0.2s",
                  }}>{item.label}</a>
                ))}
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <LangSwitcher lang={lang} setLang={setLang} />
            {isSignedIn ? (
              <>
                <button onClick={() => setPage((isSubscribed || isAdmin) ? "dashboard" : "subscribe")}
                  style={{ padding:"8px 20px", background:C.accent, border:"none", borderRadius:6, color:"#080909", cursor:"pointer", fontWeight:700, fontSize:13 }}>
                  {(isSubscribed || isAdmin) ? "Dashboard →" : "Activate →"}
                </button>
                <div style={{ border:`1px solid ${C.silverBorder}`, borderRadius:"50%", padding:2, boxShadow:`0 0 0 1px ${C.accent}33` }}>
                  <UserButton afterSignOutUrl="/" appearance={clerkDark} />
                </div>
              </>
            ) : (
              <>
                <span onClick={() => setPage("login")} style={{ fontSize:13, color:C.textMid, cursor:"pointer", padding:"8px 14px" }}>{t.signIn}</span>
                <button onClick={() => setPage("signup")} style={{ padding:"8px 20px", background:C.accent, border:"none", borderRadius:6, color:"#080909", cursor:"pointer", fontWeight:700, fontSize:13 }}>{t.startTrial}</button>
              </>
            )}
          </div>
        </div>
      )}
      <div style={{ paddingTop:page==="dashboard"?0:64 }}>
        {page==="landing"      && <LandingPage onNavigate={setPage} onNavigateCalc={handleCalcSignup} t={t} track={track} setTrack={setTrack} />}
        {page==="login"        && <ClerkAuthPage mode="sign-in" onNavigate={setPage} />}
        {page==="signup"       && <ClerkAuthPage mode="sign-up" onNavigate={setPage} initialEmail={pendingCalcEmail} />}
        {page==="subscribe"    && <SubscribePage user={clerkUser} plan={activePlan} onNavigate={setPage} t={t} track={track} />}
        {page==="calc"         && <StandaloneCalc onNavigate={setPage} t={t} />}
        {page==="contact"      && <ContactPage onNavigate={setPage} />}
        {page==="demo-chooser" && <DemoChooser onNavigate={setPage} setTrack={setTrack} />}
        {page==="dashboard"    && (
          (isSubscribed || isAdmin)
            ? <Dashboard user={clerkUser} onNavigate={setPage} t={t} lang={lang} setLang={setLang} track={track} />
            : <SubscribePage user={clerkUser} plan={activePlan} onNavigate={setPage} t={t} track={track} />
        )}
        {page==="forex-demo"   && <ForexDemo onNavigate={setPage} t={t} />}
        {page==="futures-demo" && <FuturesDemo onNavigate={setPage} />}
        {page==="backtests"    && <PublicBacktests onNavigate={setPage} />}
        {page==="curveshift"   && <CurveShiftPage onNavigate={setPage} />}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Referral tracking — reads ?ref=X from URL and persists in localStorage
// ---------------------------------------------------------------------------
function useReferral() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref    = params.get("ref");
    if (ref) localStorage.setItem("sb_ref", ref.toLowerCase().trim());
  }, []);
  return localStorage.getItem("sb_ref") || null;
}

export default function App() {
  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      appearance={{
        variables: {
          colorPrimary:         "#00d4aa",
          colorBackground:      "#0d1117",
          colorInputBackground: "#131b22",
          colorText:            "#e6edf3",
          colorTextSecondary:   "#8b949e",
          colorDanger:          "#ff6b6b",
          borderRadius:         "8px",
          fontFamily:           "monospace",
        },
        elements: {
          card:           { border: "1px solid #21262d", boxShadow: "none" },
          formButtonPrimary: { fontWeight: 700 },
        },
      }}
    >
      <AppInner />
    </ClerkProvider>
  );
}
