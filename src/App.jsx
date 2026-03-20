import { useState, useEffect, useRef } from "react";
import {
  ClerkProvider, SignIn, SignUp,
  useUser, useAuth, UserButton,
  SignedIn, SignedOut,
} from "@clerk/clerk-react";

const clerkDark = {
  variables: {
    colorBackground: "#111820",
    colorText: "#e8f0f0",
    colorTextSecondary: "#b8cccc",
    colorPrimary: "#c9a84c",
    colorNeutral: "#263444",
  },
  elements: {
    userButtonPopoverCard: { background: "#111820", border: "1px solid #263444", boxShadow: "0 8px 32px #000a" },
    userButtonPopoverActionButton: { color: "#e8f0f0" },
    userButtonPopoverActionButtonText: { color: "#e8f0f0" },
    userButtonPopoverActionButtonIcon: { color: "#b8cccc" },
    userButtonPopoverFooter: { display: "none" },
  },
};

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const API_URL   = import.meta.env.VITE_API_URL || "http://45.76.228.5:4242";

const LANGS = {
  en: { label: "EN", name: "English",   flag: "🇺🇸" },
  es: { label: "ES", name: "Español",   flag: "🇪🇸" },
  pt: { label: "PT", name: "Português", flag: "🇧🇷" },
  fr: { label: "FR", name: "Français",  flag: "🇫🇷" },
};

const T = {
  en: {
    tagline: "Multi-Cycle Signal Engine · Live",
    heroTitle1: "No charts. No noise.", heroTitle2: "The Inflection Point.",
    heroSub: "Just what matters — IV inflection signals built on multi-cycle momentum confluence and VWAP confirmation. No noise. Just the signal.",
    engineTagline: "Institutional-Grade Signal Engine · Live",
    chooserTitle1: "No charts. No noise.", chooserTitle2: "Just what matters...", chooserTitle3: "The Inflection Point.",
    chooserSub: "Volatility leads. Price follows. Signal Boss reads the state the market is actually in — so your decisions are based on what really moves it.",
    whyBuilt: "MOST SIGNALS TELL YOU WHEN. NOT WHERE.",
    whyP1: "98% of traders lose money. Nearly 100% of them use charts to make decisions.",
    whyP2: "Think about that for a second. That's like joining a gym where 99% of members follow a workout plan that makes people weaker and fatter. Does that seem logical?",
    whyP3a: "Charts tell you what already happened. Signal Boss tells you when ", whyP3b: "conditions are right", whyP3c: " — and there's a difference that matters enormously.",
    whyP4: "Entry is only 20% of the equation. An essential 20%, yes — but still just 20%. The other 80% is risk management, position sizing, and smart profit-taking. Most signal services hand you an entry and walk away. That's not a system. That's half a sentence.",
    whyP5a: "Every Signal Boss alert includes three things: ", whyP5b: "Entry Price. Smart Stop. Smart Take Profit.", whyP5c: " Where to get in. Where to cut losses. Where to start taking profits. That's the whole trade — not just the beginning of one.",
    whyP6: "We built this because the right conditions, sized correctly, with defined risk, is what trading actually is. Everything else is noise.",
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
    futuresDesc: "ES, NQ, CL, GC, RTY, ZB and currency futures /6E, /6B, /6A. Multi-cycle momentum signals with VWAP confirmation on the contracts where institutional positioning is most transparent.",
    futuresFeatures: ["ES · NQ · CL · GC · RTY · ZB", "/6E · /6B · /6A", "Account Risk Calculator included", "Smart Stop & Take Profit on every signal"],
    forexLabel: "FOREX TRADERS", forexHeadline: "Trade the intelligence.",
    forexDesc: "EUR/USD, GBP/USD and AUD/USD. Multi-cycle momentum signals derived from currency futures — where institutional price discovery actually begins.",
    forexFeatures: ["EUR/USD · GBP/USD · AUD/USD", "Derived from /6E · /6B · /6A futures", "Account Risk Calculator included", "Smart Stop & Take Profit on every signal"],
    trialNote: "30-day money-back guarantee · Cancel anytime",
    exploreFutures: "Explore Futures →", exploreForex: "Explore Forex →",
    forexTagline: "Forex Signal Intelligence · Live",
    forexHeroTitle1: "No charts. No noise.", forexHeroTitle2: "The Inflection Point.",
    forexHeroSub: "Currency futures are where institutions show their hand. Signal Boss reads cycle momentum on /6E, /6B, and /6A — giving forex traders institutional-grade intelligence on EUR/USD, GBP/USD, and AUD/USD.",
    methodologyLabel: "THE METHODOLOGY",
    methodologyTitle: "The market tells you where price is going.",
    methodologyAccent: "We just listen.",
    methodologyQuote: "Not just when to enter. Where to stop. When to take profit. All from the same source — what the market is actually implying about its own expected range.",
    methodology: [
      { icon:"◈", color:"long",  label:"Implied Volatility", title:"The Market's Own Forecast", body:"IV isn't noise — it's the market's consensus estimate of expected movement. When short-term IV reaches an inflection point on a close, the market is telling you something has changed. That's your signal." },
      { icon:"◎", color:"accent", label:"VWAP",             title:"Where Institutions Operate", body:"Every institutional desk benchmarks execution against VWAP. Price above VWAP means buyers are in control at institutional prices. Below means sellers. Simple. Powerful. Proven." },
      { icon:"◉", color:"prop",   label:"Mean Reversion",   title:"IV Always Comes Back", body:"Implied volatility mean reverts. Always. When IV reaches extremes, the question isn't if price will revert — it's when. That timing is where the edge lives, and where Smart Stop and Target levels are derived." },
    ],
    startTrial: "Get Started", viewDemo: "Try the Demo →",
    backtestLabel: "BACKTEST RESULTS",
    backtestHeadline: "How the ES signal performed", backtestSub: "over 30 days.",
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
      "01": { title: "IV Inflection Signals", desc: "Signals fire when short-term implied volatility reaches an inflection point, confirmed by volume-weighted price. No ambiguity." },
      "02": { title: "VWAP Trend Filter", desc: "Price must be confirmed by Volume based price, keeping you in winning trades longer." },
      "03": { title: "Confluence Scoring", desc: "1 cycle = early entry. 2 cycles = moderate conviction. 3 cycles = maximum strength." },
      "04": { title: "Clean Signal Cards", desc: "No charts. No clutter. Precise, actionable alerts the moment conditions align." },
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
    chooserSub: "La volatilidad lidera. El precio sigue. Signal Boss lee el estado en que realmente se encuentra el mercado — para que tus decisiones se basen en lo que realmente lo mueve.",
    whyBuilt: "LA MAYORÍA DE LAS SEÑALES TE DICEN CUÁNDO. NO DÓNDE.",
    whyP1: "El 98% de los traders pierden dinero. Casi el 100% de ellos toman decisiones con gráficos.",
    whyP2: "Piensa en eso un segundo. Es como unirse a un gimnasio donde el 99% de los miembros siguen un plan que los hace más débiles. ¿Tiene sentido eso?",
    whyP3a: "Los gráficos te dicen lo que ya ocurrió. Signal Boss te dice cuándo ", whyP3b: "las condiciones son correctas", whyP3c: " — y esa diferencia importa enormemente.",
    whyP4: "La entrada es solo el 20% de la ecuación. Un 20% esencial, sí — pero solo el 20%. El otro 80% es gestión de riesgo, tamaño de posición y toma de ganancias inteligente. La mayoría de servicios te dan una entrada y se van. Eso no es un sistema. Eso es media frase.",
    whyP5a: "Cada alerta de Signal Boss incluye tres cosas: ", whyP5b: "Precio de Entrada. Stop Inteligente. Toma de Ganancias Inteligente.", whyP5c: " Dónde entrar. Dónde cortar pérdidas. Dónde comenzar a tomar ganancias. Ese es el trade completo.",
    whyP6: "Lo construimos porque las condiciones correctas, bien dimensionadas, con riesgo definido, es lo que el trading realmente es. Todo lo demás es ruido.",
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
    futuresDesc: "ES, NQ, CL, GC, RTY, ZB y futuros de divisas /6E, /6B, /6A. Señales de momentum multi-ciclo con confirmación VWAP en los contratos donde el posicionamiento institucional es más transparente.",
    futuresFeatures: ["ES · NQ · CL · GC · RTY · ZB", "/6E · /6B · /6A", "Calculadora de Riesgo incluida", "Stop Inteligente y Toma de Ganancias en cada señal"],
    forexLabel: "TRADERS DE FOREX", forexHeadline: "Opera con la inteligencia.",
    forexDesc: "EUR/USD, GBP/USD y AUD/USD. Señales de momentum multi-ciclo derivadas de futuros de divisas — donde comienza realmente el descubrimiento de precios institucional.",
    forexFeatures: ["EUR/USD · GBP/USD · AUD/USD", "Derivado de futuros /6E · /6B · /6A", "Calculadora de Riesgo incluida", "Stop Inteligente y Toma de Ganancias en cada señal"],
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
    chooserSub: "A volatilidade lidera. O preço segue. Signal Boss lê o estado em que o mercado realmente se encontra — para que suas decisões sejam baseadas no que realmente o move.",
    whyBuilt: "A MAIORIA DOS SINAIS TE DIZ QUANDO. NÃO ONDE.",
    whyP1: "98% dos traders perdem dinheiro. Quase 100% deles tomam decisões com gráficos.",
    whyP2: "Pense nisso por um segundo. É como entrar numa academia onde 99% dos membros seguem um plano que os deixa mais fracos. Isso faz sentido?",
    whyP3a: "Gráficos mostram o que já aconteceu. Signal Boss diz quando ", whyP3b: "as condições estão certas", whyP3c: " — e essa diferença importa enormemente.",
    whyP4: "A entrada é apenas 20% da equação. Um 20% essencial, sim — mas ainda 20%. Os outros 80% são gestão de risco, dimensionamento de posição e realização de lucros inteligente. A maioria dos serviços te dá uma entrada e vai embora. Isso não é um sistema. É meia frase.",
    whyP5a: "Cada alerta do Signal Boss inclui três coisas: ", whyP5b: "Preço de Entrada. Stop Inteligente. Take Profit Inteligente.", whyP5c: " Onde entrar. Onde cortar perdas. Onde começar a realizar lucros. Esse é o trade completo.",
    whyP6: "Construímos isso porque as condições certas, bem dimensionadas, com risco definido, é o que o trading realmente é. Todo o resto é ruído.",
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
    futuresDesc: "ES, NQ, CL, GC, RTY, ZB e futuros de moedas /6E, /6B, /6A. Sinais de momentum multi-ciclo com confirmação VWAP nos contratos onde o posicionamento institucional é mais transparente.",
    futuresFeatures: ["ES · NQ · CL · GC · RTY · ZB", "/6E · /6B · /6A", "Calculadora de Risco incluída", "Stop Inteligente e Take Profit em cada sinal"],
    forexLabel: "TRADERS DE FOREX", forexHeadline: "Opere com a inteligência.",
    forexDesc: "EUR/USD, GBP/USD e AUD/USD. Sinais de momentum multi-ciclo derivados de futuros de moedas — onde começa realmente a descoberta de preços institucional.",
    forexFeatures: ["EUR/USD · GBP/USD · AUD/USD", "Derivado de futuros /6E · /6B · /6A", "Calculadora de Risco incluída", "Stop Inteligente e Take Profit em cada sinal"],
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
    futuresDesc: "ES, NQ, CL, GC, RTY, ZB et futures de devises /6E, /6B, /6A. Signaux de momentum multi-cycle avec confirmation VWAP sur les contrats où le positionnement institutionnel est le plus transparent.",
    futuresFeatures: ["ES · NQ · CL · GC · RTY · ZB", "/6E · /6B · /6A", "Calculateur de Risque inclus", "Stop Intelligent et Prise de Profit sur chaque signal"],
    forexLabel: "TRADERS FOREX", forexHeadline: "Tradez avec l'intelligence.",
    forexDesc: "EUR/USD, GBP/USD et AUD/USD. Signaux de momentum multi-cycle dérivés des futures de devises — là où la découverte des prix institutionnels commence vraiment.",
    forexFeatures: ["EUR/USD · GBP/USD · AUD/USD", "Dérivé des futures /6E · /6B · /6A", "Calculateur de Risque inclus", "Stop Intelligent et Prise de Profit sur chaque signal"],
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
  bg: "#080909", surface: "#0c0e0f", surfaceUp: "#0e1210", surfaceDn: "#120e0e",
  silver: "#111820", silverUp: "#18222c", silverBorder: "#263444",
  border: "#161a1a", borderHi: "#1f2626",
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
  body { background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
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
  input[type=number], input[type=text], input[type=email], input[type=password] { background:${C.bg}; color:${C.text}; border:1px solid ${C.border}; border-radius:6px; padding:9px 12px; font-family:'IBM Plex Mono','Courier New',monospace; font-size:13px; outline:none; width:100%; }
  input[type=number]:focus, input[type=text]:focus, input[type=email]:focus, input[type=password]:focus { border-color:${C.accent}44; }
  select { background:${C.surface}; color:${C.text}; border:1px solid ${C.border}; border-radius:6px; padding:8px 12px; font-family:'IBM Plex Mono','Courier New',monospace; font-size:12px; cursor:pointer; outline:none; width:100%; }
  .tab-btn { background:transparent; border:none; cursor:pointer; font-family:'DM Sans','Segoe UI',sans-serif; transition:all 0.15s; }
  .tab-btn:hover { opacity:0.8; }
  .nav-item { padding:10px 14px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:500; transition:all 0.15s; display:flex; align-items:center; gap:10px; border-left:2px solid transparent; }
  .nav-item:hover { background:${C.border}; }
  .nav-item.active { background:${C.accentDim}; border-left-color:${C.accent}; color:${C.accent}; }
`;

// ── Live signal feed ──────────────────────────────────────────────────────────
// After creating your GitHub Gist, paste the raw URL here:
// https://gist.githubusercontent.com/YOUR_USERNAME/YOUR_GIST_ID/raw/signals.json
const SIGNALS_URL  = 'https://gist.githubusercontent.com/valueisrelative-dotcom/336ce62861f67be83d1fdbd34576f4c5/raw/signals.json';
const HISTORY_URL  = 'https://gist.githubusercontent.com/valueisrelative-dotcom/336ce62861f67be83d1fdbd34576f4c5/raw/history.json';
const BACKTEST_URL = 'https://gist.githubusercontent.com/valueisrelative-dotcom/336ce62861f67be83d1fdbd34576f4c5/raw/backtest.json';

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

const INSTRUMENTS = ["ES", "NQ", "CL", "GC", "RTY", "ZB"];
const BASE_PRICES  = { ES: 5247, NQ: 18420, CL: 78.4, GC: 2318, RTY: 2048, ZB: 115.5 };

const INST_TICK = {
  ES:  { size: 0.25,    value: 12.50  },
  NQ:  { size: 0.25,    value:  5.00  },
  CL:  { size: 0.01,    value: 10.00  },
  GC:  { size: 0.10,    value: 10.00  },
  RTY: { size: 0.10,    value:  5.00  },
  ZB:  { size: 0.03125, value: 31.25  },
  "6E": { size: 0.00005, value: 6.25  },   // EUR/USD futures
  "6B": { size: 0.0001,  value: 6.25  },   // GBP/USD futures
  "6A": { size: 0.0001,  value: 10.00 },   // AUD/USD futures
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

function generateSignal(id) {
  const inst   = INSTRUMENTS[Math.floor(Math.random() * INSTRUMENTS.length)];
  const base   = BASE_PRICES[inst];
  const price  = +(base * (1 + (Math.random() - 0.5) * 0.003)).toFixed(2);
  const dir    = Math.random() > 0.5 ? "LONG" : "SHORT";
  const isLong = dir === "LONG";

  // Randomly pick how many and which cycles rotated
  const numRotated = Math.floor(Math.random() * 3) + 1;
  const allCycles  = ["1-Day","3-Day","6-Day"];
  const shuffled   = [...allCycles].sort(() => Math.random() - 0.5);
  const rotated    = shuffled.slice(0, numRotated);
  const cyclesConfirming = numRotated;

  const cycles = {
    daily:   { zero: rotated.includes("1-Day") ? (isLong?"above":"below") : (isLong?"below":"above"), label:"1-Day",  reset:"9:30 AM" },
    twoDay:  { zero: rotated.includes("3-Day") ? (isLong?"above":"below") : (isLong?"below":"above"), label:"3-Day",  reset:"8:20 AM" },
    fourDay: { zero: rotated.includes("6-Day") ? (isLong?"above":"below") : (isLong?"below":"above"), label:"6-Day",  reset:"8:20 AM" },
  };

  const vwapDaily  = +(price * (1 + (Math.random()-0.5)*0.004)).toFixed(2);
  const vwapWeekly = +(price * (1 + (Math.random()-0.5)*0.008)).toFixed(2);
  const vwaps = {
    daily:  { value: vwapDaily,  above: price > vwapDaily,  label:"Daily VWAP"  },
    weekly: { value: vwapWeekly, above: price > vwapWeekly, label:"Weekly VWAP" },
  };
  const vwapsConfirming = Object.values(vwaps).filter(v => isLong ? v.above : !v.above).length;

  // Trigger tier
  const proximityBars = Math.floor(Math.random() * 8);
  const isFresh = Math.random() > 0.45;
  const rotNote = isFresh ? "Fresh rotation" : "Extended — size accordingly";
  let trigger, triggerDetail;
  if (numRotated === 3 && proximityBars <= 3) {
    trigger       = "AAA+";
    triggerDetail = `All 3 cycles within ${proximityBars} bars · ${rotNote}`;
  } else if (numRotated === 3) {
    trigger       = "AAA";
    triggerDetail = `All 3 cycles within ${proximityBars} bars · ${rotNote}`;
  } else if (numRotated === 2) {
    trigger       = "AA";
    triggerDetail = `${rotated.join(" + ")} rotated · ${rotNote}`;
  } else {
    trigger       = "A";
    triggerDetail = `${rotated[0]} rotated · ${rotNote}`;
  }
  const emaContext = Math.random() > 0.3 ? "trend aligned" : "counter-trend";
  const strength   = trigger === "A" ? "WEAK" : trigger === "AA" ? "MODERATE" : "STRONG";

  // Smart Stop & Take Profit
  const tk        = INST_TICK[inst] || INST_TICK.ES;
  const stopTicks = 8 + Math.floor(Math.random() * 10);
  const stopPx    = +(stopTicks * tk.size).toFixed(4);
  const stopPrice = +(isLong ? price - stopPx : price + stopPx).toFixed(4);
  const stopUsd   = +(stopTicks * tk.value).toFixed(2);
  const volR      = Math.random();
  const volRegime = volR > 0.7 ? "HIGH" : volR < 0.3 ? "LOW" : "NORMAL";
  const suggestedRR = volRegime === "HIGH" ? 2.0 : volRegime === "LOW" ? 3.0 : 2.5;
  const risk = {
    stopPrice, stopPx, stopTicks, stopUsd,
    tp2_0Price: +(isLong ? price + stopPx*2.0 : price - stopPx*2.0).toFixed(4),
    tp2_5Price: +(isLong ? price + stopPx*2.5 : price - stopPx*2.5).toFixed(4),
    tp3_0Price: +(isLong ? price + stopPx*3.0 : price - stopPx*3.0).toFixed(4),
    tp2_0Usd:   +(stopTicks * 2.0 * tk.value).toFixed(2),
    tp2_5Usd:   +(stopTicks * 2.5 * tk.value).toFixed(2),
    tp3_0Usd:   +(stopTicks * 3.0 * tk.value).toFixed(2),
    volRegime, suggestedRR, zAtr: (0.5 + Math.random()).toFixed(2),
    conditionsMet: numRotated + vwapsConfirming,
  };

  return {
    id, instrument: inst, direction: dir,
    trigger, triggerDetail, emaContext,
    strength, cyclesConfirming, vwapsConfirming,
    cycles, vwaps, price, risk,
    session: getSessionLabel(),
    status: "ACTIVE",
    time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" }),
    timestamp: Date.now(), isNew: true,
  };
}

function genEquityCurve() {
  let val = 10000;
  return Array.from({ length: 60 }, (_, i) => {
    val += (Math.random() - 0.38) * 320;
    return { i, val: Math.max(val, 8000) };
  });
}
const EQUITY_CURVE = genEquityCurve();

function LiveDot({ color, size = 7 }) {
  return (
    <span style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", width:size+6, height:size+6 }}>
      <span style={{ position:"absolute", width:size+6, height:size+6, borderRadius:"50%", background:color, opacity:0.2, animation:"pulse 2s infinite" }} />
      <span style={{ width:size, height:size, borderRadius:"50%", background:color, display:"block", flexShrink:0 }} />
    </span>
  );
}

function TriggerBolts({ trigger }) {
  const t = trigger || "A";
  const isPlus  = t === "AAA+";
  const boltCount = isPlus ? 4 : t === "AAA" ? 3 : t === "AA" ? 2 : 1;
  const color = t === "A" ? C.weak : t === "AA" ? C.mod : C.strong;
  return (
    <div style={{ display:"flex", gap:3, alignItems:"center" }}>
      {[1,2,3,4].map(i => (
        <span key={i} style={{
          fontSize:14,
          opacity: i <= boltCount ? 1 : 0.12,
          filter:  i <= boltCount ? `drop-shadow(0 0 4px ${color})` : "none",
        }}>⚡</span>
      ))}
      <span style={{ fontSize:11, fontWeight:700, color, marginLeft:4, fontFamily:"'IBM Plex Mono','Courier New',monospace", letterSpacing:"0.05em" }}>
        Trigger {t}
      </span>
    </div>
  );
}
// backward-compat alias
function StrengthBolts({ count, strength, trigger }) {
  const t = trigger || (strength==="STRONG"?"AAA": strength==="MODERATE"?"AA":"A");
  return <TriggerBolts trigger={t} />;
}

function VwapRow({ label, value, above, direction, t }) {
  const isLong = direction === "LONG";
  const confirms = isLong ? above : !above;
  const color = confirms ? (isLong ? C.long : C.short) : C.warn;
  const arrow = above ? "↑" : "↓";
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", minWidth:80 }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:11, color:C.textDim, fontFamily:"monospace" }}>{value.toLocaleString()}</span>
        <span style={{ fontSize:11, fontWeight:600, color, fontFamily:"monospace" }}>
          {arrow} {above ? t.vwapAbove : t.vwapBelow}
        </span>
      </div>
    </div>
  );
}

function CycleRow({ cycle, direction, t }) {
  const isLong = direction === "LONG";
  const confirms = cycle.zero === (isLong ? "above" : "below");
  const color = confirms ? (isLong ? C.long : C.short) : C.textDim;
  const arrow = cycle.zero === "above" ? "↑" : "↓";
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", minWidth:52 }}>{cycle.label}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:12, color, fontFamily:"monospace", fontWeight:600 }}>{arrow} {cycle.zero==="above" ? t.aboveZero : t.belowZero}</span>
        {confirms && <span style={{ fontSize:10, color, background:color+"18", padding:"1px 6px", borderRadius:3 }}>✓</span>}
      </div>
    </div>
  );
}

function SignalCard({ signal, onDismiss, exitMode, rrPref, setRrPref, t }) {
  const isLong      = signal.direction === "LONG";
  const isCancelled = signal.status === "CANCELLED";
  const isActive    = signal.status === "ACTIVE";
  const dirColor    = isLong ? C.long : C.short;
  const vwapAllGood = signal.vwapsConfirming === Object.keys(signal.vwaps).length;

  // Always ensure risk is present — generate fallback if engine didn't supply it
  const risk = (() => {
    const r  = signal.risk;
    const tk = INST_TICK[signal.instrument] || INST_TICK.ES;
    const p  = signal.price || 5247;
    // If risk exists and has all required fields, use it as-is
    if (r && r.stopPrice != null && r.tp2_5Price != null) return r;
    // Otherwise build a complete risk object (partial or missing)
    const stopTicks = (r && r.stopTicks) || 10;
    const stopPx    = +((stopTicks * tk.size)).toFixed(4);
    return {
      stopPrice:    +(isLong ? p - stopPx : p + stopPx).toFixed(4),
      stopPx, stopTicks,
      stopUsd:      +(stopTicks * tk.value).toFixed(2),
      tp2_0Price:   +(isLong ? p + stopPx*2.0 : p - stopPx*2.0).toFixed(4),
      tp2_5Price:   +(isLong ? p + stopPx*2.5 : p - stopPx*2.5).toFixed(4),
      tp3_0Price:   +(isLong ? p + stopPx*3.0 : p - stopPx*3.0).toFixed(4),
      tp2_0Usd:     +(stopTicks * 2.0 * tk.value).toFixed(2),
      tp2_5Usd:     +(stopTicks * 2.5 * tk.value).toFixed(2),
      tp3_0Usd:     +(stopTicks * 3.0 * tk.value).toFixed(2),
      volRegime:    (r && r.volRegime)    || "NORMAL",
      suggestedRR:  (r && r.suggestedRR)  || 2.5,
      zAtr:         (r && r.zAtr)         || "0.84",
      conditionsMet:(r && r.conditionsMet)|| 4,
    };
  })();

  // Pick the right pre-calculated TP price based on subscriber's R:R pref
  const tpPriceKey  = rrPref === 2.0 ? "tp2_0Price" : rrPref === 3.0 ? "tp3_0Price" : "tp2_5Price";
  const tpUsdKey    = rrPref === 2.0 ? "tp2_0Usd"   : rrPref === 3.0 ? "tp3_0Usd"   : "tp2_5Usd";
  const tpPrice     = risk ? risk[tpPriceKey] : null;
  const tpUsd       = risk ? risk[tpUsdKey]   : null;

  // Recommendation label
  const recLabel = risk ? (
    risk.suggestedRR === rrPref
      ? `★ Signal Boss recommends ${risk.suggestedRR}:1 — ${risk.conditionsMet}/5 conditions exist`
      : `Signal Boss recommends ${risk.suggestedRR}:1 — ${risk.conditionsMet}/5 conditions exist`
  ) : null;

  const rrOptions = [2.0, 2.5, 3.0];

  return (
    <div className={`signal-new ${isActive?(isLong?"card-long":"card-short"):""}`} style={{
      background: isActive?(isLong?C.surfaceUp:C.surfaceDn):C.surface,
      border:`1px solid ${isActive?dirColor+"33":C.border}`,
      borderRadius:12, padding:20, position:"relative", overflow:"hidden",
      opacity:isCancelled?0.45:1, transition:"opacity 0.3s",
    }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:isActive?dirColor:C.border, borderRadius:"12px 12px 0 0" }} />

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <LiveDot color={isActive?dirColor:C.neutral} size={8} />
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:20, fontWeight:700, color:dirColor, fontFamily:"monospace" }}>{signal.direction}</span>
              <span style={{ fontSize:20, fontWeight:700, color:C.text, fontFamily:"monospace" }}>{signal.instrument}</span>
              <span style={{ fontSize:10, color:C.textMid, background:C.border, padding:"2px 7px", borderRadius:4, fontFamily:"monospace" }}>5m</span>
            </div>
            <div style={{ fontSize:11, color:C.textMid, marginTop:3, fontFamily:"monospace" }}>{signal.time}</div>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
          <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, background:isActive?dirColor+"22":C.border, color:isActive?dirColor:C.textMid, fontFamily:"monospace", letterSpacing:"0.08em" }}>{signal.status}</span>
          {!isCancelled && <button onClick={() => onDismiss(signal.id)} style={{ fontSize:10, color:C.textDim, background:"transparent", border:"none", cursor:"pointer" }}>{t.dismiss}</button>}
        </div>
      </div>

      {/* Trigger tier */}
      <div style={{ marginBottom:12 }}>
        <TriggerBolts trigger={signal.trigger || (signal.strength==="STRONG"?"AAA":signal.strength==="MODERATE"?"AA":"A")} />
        {signal.triggerDetail && (
          <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", marginTop:4 }}>{signal.triggerDetail}</div>
        )}

        {/* Tier timestamps */}
        {signal.tierTimestamps && Object.keys(signal.tierTimestamps).length > 0 && (
          <div style={{ marginTop:8, padding:"6px 8px", background:C.bg, borderRadius:6, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:4 }}>TIER TRIGGERED</div>
            {['A','AA','AAA','AAA+'].filter(tier => signal.tierTimestamps[tier]).map(tier => (
              <div key={tier} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                <span style={{ fontSize:10, fontFamily:"monospace", color:C.textDim, minWidth:36 }}>{tier}</span>
                <span style={{ fontSize:10, fontFamily:"monospace", color:C.textMid }}>{signal.tierTimestamps[tier]}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:"flex", gap:12, marginTop:6, flexWrap:"wrap" }}>
          {signal.emaContext && (
            <span style={{ fontSize:10, fontFamily:"monospace", color: signal.emaContext==="trend aligned" ? C.long : C.warn }}>
              17 EMA: {signal.emaContext}
            </span>
          )}
          {signal.session && (
            <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>
              {signal.session}
            </span>
          )}
        </div>
      </div>

      <div style={{ height:1, background:C.border, marginBottom:10 }} />

      {/* Cycles */}
      <div style={{ marginBottom:10 }}>
        {Object.values(signal.cycles).map(cyc => <CycleRow key={cyc.label} cycle={cyc} direction={signal.direction} t={t} />)}
      </div>

      <div style={{ height:1, background:C.border, marginBottom:10 }} />

      {/* VWAPs */}
      <div style={{ marginBottom:12 }}>
        {Object.values(signal.vwaps).map(v => <VwapRow key={v.label} label={v.label} value={v.value} above={v.above} direction={signal.direction} t={t} />)}
      </div>

      {/* Entry price */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontSize:11, color:C.textMid, fontFamily:"monospace" }}>{t.entryPrice}</span>
        <span style={{ fontSize:14, fontWeight:600, color:C.text, fontFamily:"monospace" }}>{(signal.price ?? 0).toLocaleString()}</span>
      </div>

      {/* ── Smart Stop & Take Profit ── */}
      {risk && (
        <>
          <div style={{ height:1, background:C.border, marginBottom:12 }} />

          {/* Stop row */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div>
              <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:3 }}>SMART STOP · REFERENCE</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.short, fontFamily:"monospace" }}>{risk.stopPrice.toLocaleString()}</div>
              <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>{risk.stopTicks} ticks · ${risk.stopUsd.toLocaleString()}/contract</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:3 }}>SMART TP</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.long, fontFamily:"monospace" }}>{tpPrice?.toLocaleString()}</div>
              <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>${tpUsd?.toLocaleString()}/contract</div>
            </div>
          </div>

          {/* R:R selector */}
          <div style={{ marginBottom:8 }}>
            <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:6 }}>TARGET R:R</div>
            <div style={{ display:"flex", gap:6 }}>
              {rrOptions.map(rr => {
                const isSelected = rrPref === rr;
                const isRecommended = risk.suggestedRR === rr;
                return (
                  <button key={rr} onClick={() => setRrPref(rr)}
                    style={{
                      flex:1, padding:"6px 0", borderRadius:6, fontFamily:"monospace", fontSize:11, fontWeight:700,
                      cursor:"pointer", transition:"all 0.15s",
                      background: isSelected ? dirColor+"33" : C.bg,
                      color:      isSelected ? dirColor       : C.textDim,
                      border:    `1px solid ${isSelected ? dirColor+"66" : C.border}`,
                    }}>
                    {rr}:1{isRecommended ? " ★" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommendation note */}
          <div style={{ fontSize:10, color: risk.suggestedRR === rrPref ? C.accent : C.textDim, fontFamily:"monospace", background: risk.suggestedRR === rrPref ? C.accentDim : "transparent", border:`1px solid ${risk.suggestedRR === rrPref ? C.accent+"33" : "transparent"}`, borderRadius:5, padding: risk.suggestedRR === rrPref ? "5px 8px" : "0", marginBottom: risk.suggestedRR === rrPref ? 8 : 0, lineHeight:1.5 }}>
            {recLabel}
          </div>

          {/* Vol regime badge */}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>Vol:</span>
            <span style={{ fontSize:10, fontFamily:"monospace", fontWeight:600,
              color: risk.volRegime==="HIGH" ? C.short : risk.volRegime==="LOW" ? C.long : C.warn,
              background: risk.volRegime==="HIGH" ? C.shortDim : risk.volRegime==="LOW" ? C.longDim : C.border,
              padding:"1px 7px", borderRadius:3 }}>
              {risk.volRegime}
            </span>
            <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>z={risk.zAtr}</span>
          </div>
        </>
      )}

      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10 }}>
        <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>ENTRY NY: {signal.time || new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" })}</span>
      </div>
    </div>
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
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ overflow:"hidden", background:C.surface, borderBottom:`1px solid ${C.border}`, height:32, display:"flex", alignItems:"center" }}>
      <div style={{ display:"flex", gap:0, animation:"ticker 30s linear infinite", whiteSpace:"nowrap" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"0 28px", borderRight:`1px solid ${C.border}` }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.text, fontFamily:"monospace" }}>{item.sym}</span>
            <span style={{ fontSize:11, color:C.textMid, fontFamily:"monospace" }}>{item.price}</span>
            <span style={{ fontSize:11, color:item.up?C.long:C.short, fontFamily:"monospace" }}>{item.chg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EquityCurve() {
  const w = 340, h = 80;
  const vals = EQUITY_CURVE.map(d => d.val);
  const min  = Math.min(...vals) - 200;
  const max  = Math.max(...vals) + 200;
  const pts  = EQUITY_CURVE.map(d => {
    const x = (d.i / (EQUITY_CURVE.length - 1)) * w;
    const y = h - ((d.val - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const fillD = `M 0,${h} L ${pts.join(" L ")} L ${w},${h} Z`;
  const lastVal = vals[vals.length - 1];
  const pct = (((lastVal - vals[0]) / vals[0]) * 100).toFixed(1);
  const isUp = lastVal >= vals[0];
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginTop:40, maxWidth:380, width:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontSize:11, color:C.textMid, fontFamily:"monospace", letterSpacing:"0.1em" }}>SIMULATED PERFORMANCE</span>
        <span style={{ fontSize:13, fontWeight:700, color:isUp?C.long:C.short, fontFamily:"monospace" }}>{isUp?"+":""}{pct}%</span>
      </div>
      <svg width={w} height={h} style={{ display:"block" }}>
        <defs>
          <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp?C.long:C.short} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isUp?C.long:C.short} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillD} fill="url(#eq)" />
        <path d={pathD} fill="none" stroke={isUp?C.long:C.short} strokeWidth="1.5" />
      </svg>
      <div style={{ fontSize:10, color:C.textDim, marginTop:8, fontFamily:"monospace" }}>Past 60 sessions · Simulated signals</div>
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

function PropCalc({ t }) {
  const [qty, setQty]         = useState(1);
  const [tickVal, setTickVal] = useState(12.50);
  const [stopTicks, setStop]  = useState(8);
  const [tgtTicks, setTgt]    = useState(20);
  const [winRate, setWinRate] = useState(55);
  const [profitGoal, setProfitGoal] = useState(3000);
  const [currentBal, setCurrentBal] = useState(0);
  const [maxDD, setMaxDD]     = useState(2500);
  const [dailyLimit, setDailyLimit] = useState(1000);

  const lossPerTrade   = qty * stopTicks * tickVal;
  const profitPerTrade = qty * tgtTicks  * tickVal;
  const rr             = tgtTicks / stopTicks;
  const wr             = winRate / 100;
  const expectedVal    = (wr * profitPerTrade) - ((1 - wr) * lossPerTrade);
  const neededToPass   = profitGoal - currentBal;
  const tradesNeeded   = expectedVal > 0 ? Math.ceil(neededToPass / expectedVal) : "∞";
  const maxTradesToDD  = Math.floor(maxDD / lossPerTrade);
  const maxTradesToDaily = Math.floor(dailyLimit / lossPerTrade);
  const daysToPass     = expectedVal > 0 ? (neededToPass / expectedVal / 3).toFixed(1) : "∞";

  const InputRow = ({ label, value, onChange, min, max, step, prefix, suffix }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:12, color:C.textMid }}>{label}</span>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {prefix && <span style={{ fontSize:12, color:C.textDim, fontFamily:"monospace" }}>{prefix}</span>}
        <input type="number" value={value} min={min} max={max} step={step||1}
          onChange={e => onChange(+e.target.value)}
          style={{ width:80, textAlign:"right", padding:"5px 8px" }} />
        {suffix && <span style={{ fontSize:12, color:C.textDim, fontFamily:"monospace" }}>{suffix}</span>}
      </div>
    </div>
  );

  const ResultRow = ({ label, value, color, big }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:12, color:C.textMid }}>{label}</span>
      <span style={{ fontSize:big?18:14, fontWeight:big?700:600, color:color||C.text, fontFamily:"monospace" }}>{value}</span>
    </div>
  );

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
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(340px,1fr))", gap:20 }}>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Trade Parameters</div>
          <InputRow label="Contracts / Qty"        value={qty}       onChange={setQty}       min={1}   max={20} />
          <InputRow label="Tick / Pip Value"        value={tickVal}   onChange={setTickVal}   min={0.1} step={0.25} prefix="$" />
          <InputRow label="Stop Loss"               value={stopTicks} onChange={setStop}      min={1}   suffix="ticks" />
          <InputRow label="Profit Target"           value={tgtTicks}  onChange={setTgt}       min={1}   suffix="ticks" />
          <InputRow label="Win Rate"                value={winRate}   onChange={setWinRate}   min={1}   max={99} suffix="%" />
          <div style={{ fontWeight:600, fontSize:14, marginBottom:12, marginTop:20 }}>Account Settings</div>
          <InputRow label="Profit Goal"             value={profitGoal}   onChange={setProfitGoal} min={0} prefix="$" />
          <InputRow label="Current P&L"             value={currentBal}   onChange={setCurrentBal} prefix="$" />
          <div>
            <InputRow label="Max Drawdown / Loss to Ruin" value={maxDD} onChange={setMaxDD} min={0} prefix="$" />
            <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginTop:4, marginBottom:8 }}>Prop challenge breach limit or total account loss</div>
          </div>
          <InputRow label="Daily Loss Limit"        value={dailyLimit}   onChange={setDailyLimit} min={0} prefix="$" />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
            <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Per Trade</div>
            <ResultRow label="Loss per trade"   value={`$${lossPerTrade.toFixed(2)}`}   color={C.short} />
            <ResultRow label="Profit per trade" value={`$${profitPerTrade.toFixed(2)}`} color={C.long} />
            <ResultRow label="Risk : Reward"    value={`${rr.toFixed(2)} : 1`}          color={C.accent} />
            <ResultRow label="Expected Value"   value={`$${expectedVal.toFixed(2)}`}    color={expectedVal>=0?C.long:C.short} big />
          </div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
            <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Account Progress</div>
            <ResultRow label="Profit goal"       value={`$${profitGoal.toLocaleString()}`} />
            <ResultRow label="Current P&L"       value={`$${currentBal.toLocaleString()}`}   color={C.accent} />
            <ResultRow label="Still needed"      value={`$${neededToPass.toLocaleString()}`} color={neededToPass>0?C.warn:C.long} big />
            <ResultRow label="Trades to goal"    value={tradesNeeded}  color={C.accent} />
            <ResultRow label="Est. days to goal" value={daysToPass}    color={C.long} />
          </div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
            <div style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>⚠ Risk Limits</div>
            <div style={{ fontSize:12, color:C.textMid, marginBottom:14 }}>Consecutive losing trades before limits hit</div>
            <ResultRow label="Trades until ruin"        value={maxTradesToDD}    color={dangerColor(maxTradesToDD, 3)} big />
            <ResultRow label="Trades until daily limit" value={maxTradesToDaily} color={dangerColor(maxTradesToDaily, 2)} />
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:10, color:C.textMid, marginBottom:6, fontFamily:"monospace" }}>DRAWDOWN BUFFER</div>
              <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:4, transition:"width 0.5s",
                  width:`${Math.min((currentBal/maxDD)*100,100)}%`,
                  background:currentBal/maxDD > 0.5 ? C.long : currentBal/maxDD > 0.25 ? C.warn : C.short,
                }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.textDim, marginTop:4, fontFamily:"monospace" }}>
                <span>$0</span><span>${maxDD} limit</span>
              </div>
            </div>
          </div>
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
    ["What markets does Signal Boss cover?", "Signal Boss covers ES (S&P 500), NQ (Nasdaq), CL (Crude Oil), GC (Gold), RTY (Russell 2000), ZB (30-Year T-Bond), and currency futures /6E (EUR/USD), /6B (GBP/USD), and /6A (AUD/USD)."],
    ["How are signals delivered?", "Signals appear in real-time on your Signal Boss dashboard. Alert delivery via email, SMS, and webhook (for automation) is available on Pro and Elite plans. You can also configure which instruments and timeframes trigger alerts."],
    ["Do I need to be at my desk all day?", "No. Signal Boss is designed around close-confirmed signals — meaning a signal fires when a candle closes with all conditions met, not on intraday noise. You can check in at key times rather than watching a screen all day."],
    ["What's the difference between 1, 2, and 3-cycle confluence?", "Each cycle (Daily, 2-Day, 4-Day) represents a different momentum timeframe. When all three align in the same direction, you get a 3/3 Strong signal — the highest conviction setup. 1 or 2 cycles aligning is still a valid signal, just with less confluence behind it."],
    ["Is this suitable for beginners?", "Signal Boss is best suited for traders who already understand futures basics — margin, leverage, tick values, and position sizing. If you're brand new to futures, we'd recommend building that foundation first. The Account Risk Calculator and methodology documentation can help bridge that gap."],
    ["What timeframes are supported?", "The platform supports 5m, 15m, 1H, 4H, and Daily chart timeframes. The underlying cycle engine is timeframe-agnostic — you can configure it to match your trading style."],
    ["Can I cancel anytime?", "Yes. All plans are month-to-month with no long-term contracts. You can cancel anytime from your account settings and you'll retain access through the end of your billing period."],
    ["How is this different from other signal services?", "Most signal services give you arrows on a chart and call it a day. Signal Boss shows you the underlying confluence — which cycles are aligned, VWAP positioning, signal strength — so you can make an informed decision rather than blindly following an alert. Transparency is the whole point."],
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
    ["What forex pairs does Signal Boss cover?", "Signal Boss covers EUR/USD (/6E), GBP/USD (/6B), and AUD/USD (/6A) — derived directly from exchange-traded currency futures where institutional price discovery begins."],
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
  const pairs = [
    { pair:"EUR/USD", future:"/6E", dir:"LONG",  trigger:"AAA+", detail:"All 3 cycles within 1 bar · Fresh rotation", ema:"trend aligned", session:"NY Open",    cycles:[["1-Day","↑ above zero"],["3-Day","↑ above zero"],["6-Day","↑ above zero"]], vwaps:[["Daily VWAP","↑ above"],["Weekly VWAP","↑ above"]], entry:"1.0842", color:C.long },
    { pair:"GBP/USD", future:"/6B", dir:"LONG",  trigger:"AA",   detail:"1-Day + 3-Day rotated · Fresh rotation",        ema:"trend aligned", session:"London",    cycles:[["1-Day","↑ above zero"],["3-Day","↑ above zero"],["6-Day","↓ below zero"]], vwaps:[["Daily VWAP","↑ above"],["Weekly VWAP","↑ above"]], entry:"1.2634", color:C.long },
    { pair:"AUD/USD", future:"/6A", dir:"SHORT", trigger:"AA",   detail:"1-Day + 6-Day rotated · Extended — size accordingly", ema:"counter-trend", session:"Asian", cycles:[["1-Day","↓ below zero"],["3-Day","↑ above zero"],["6-Day","↓ below zero"]], vwaps:[["Daily VWAP","↓ below"],["Weekly VWAP","↑ above"]], entry:"0.6481", color:C.short },
  ];
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
          <div onClick={() => onNavigate("landing")} style={{ fontWeight:700, fontSize:15, fontFamily:"monospace", cursor:"pointer" }}>SIGNAL<span style={{ color:C.accent }}>BOSS</span></div>
          <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
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
            {/* Demo notice */}
            <div style={{ marginBottom:18, background:"#0e0a04", border:`1px solid #f59e0b44`, borderRadius:10, padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:14 }}>⚠</span>
                <span style={{ fontSize:12, color:"#f59e0b", fontFamily:"monospace", fontWeight:600, letterSpacing:"0.08em" }}>SIMULATED DEMO</span>
                <span style={{ fontSize:12, color:"#9ca3af" }}>— These are not live signals. Real-time signal delivery requires a subscription.</span>
              </div>
              <button onClick={() => onNavigate("signup")} style={{ padding:"7px 18px", background:C.accent, color:"#080909", border:"none", borderRadius:6, fontWeight:700, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>Get Started →</button>
            </div>
            {/* Methodology note */}
            <div style={{ background:C.surface, border:`1px solid ${C.accent}33`, borderRadius:10, padding:"14px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ color:C.accent, fontSize:16 }}>◈</span>
              <p style={{ fontSize:13, color:"#c9cdd6", lineHeight:1.7, margin:0 }}>
                Currency futures are where banks show their hand. IV inflection signals built from exchange-traded currency futures — where institutional positioning is expressed first. Spot forex prices follow through arbitrage.
              </p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:16 }}>
              {pairs.map((p) => (
                <div key={p.pair} style={{ background:p.dir==="LONG"?C.surfaceUp:C.surfaceDn, border:`1px solid ${p.color}33`, borderRadius:12, padding:20, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:p.color }} />
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <LiveDot color={p.color} size={7} />
                    <span style={{ fontSize:18, fontWeight:700, color:p.color, fontFamily:"monospace" }}>{p.dir}</span>
                    <span style={{ fontSize:18, fontWeight:700, fontFamily:"monospace" }}>{p.pair}</span>
                    <span style={{ marginLeft:"auto", fontSize:10, color:p.color, background:p.color+"18", padding:"2px 8px", borderRadius:12, fontFamily:"monospace" }}>ACTIVE</span>
                  </div>
                  <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.08em", marginBottom:10, background:C.accentDim, padding:"3px 8px", borderRadius:4, display:"inline-block" }}>
                    DERIVED FROM {p.future}
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <TriggerBolts trigger={p.trigger} />
                    <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", marginTop:4 }}>{p.detail}</div>
                    <div style={{ display:"flex", gap:10, marginTop:4 }}>
                      <span style={{ fontSize:10, fontFamily:"monospace", color: p.ema==="trend aligned" ? C.long : C.warn }}>17 EMA: {p.ema}</span>
                      <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>{p.session}</span>
                    </div>
                  </div>
                  {p.cycles.map(([label, val]) => (
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${C.border}`, fontSize:11, fontFamily:"monospace" }}>
                      <span style={{ color:C.textMid }}>{label}</span>
                      <span style={{ color:val.includes("above") ? p.dir==="LONG"?C.long:C.textDim : p.dir==="SHORT"?C.short:C.textDim }}>{val} ✓</span>
                    </div>
                  ))}
                  {p.vwaps.map(([label, val]) => (
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${C.border}`, fontSize:11, fontFamily:"monospace" }}>
                      <span style={{ color:C.textMid }}>{label}</span>
                      <span style={{ color:val.includes("above") ? p.dir==="LONG"?C.long:C.warn : p.dir==="SHORT"?C.short:C.warn }}>{val} ✓</span>
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
                    <span style={{ fontSize:11, color:C.textMid, fontFamily:"monospace" }}>Entry price</span>
                    <span style={{ fontSize:15, fontWeight:700, color:C.text, fontFamily:"monospace" }}>{p.entry}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* CTA Banner */}
            <div style={{ marginTop:32, background:`linear-gradient(135deg, ${C.surface}, #0d0a1a)`, border:`1px solid ${C.accent}33`, borderRadius:14, padding:"24px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:6 }}>THIS IS THE DEMO</div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>Ready for live signals on your account?</div>
                <div style={{ fontSize:13, color:C.textMid }}>Start your free trial and get real-time alerts the moment conditions align.</div>
              </div>
              <button onClick={() => onNavigate("signup")} style={{ padding:"12px 28px", background:C.accent, color:"#080909", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
                Get Started →
              </button>
            </div>
            <div style={{ textAlign:"center", marginTop:16 }}>
              <p style={{ fontSize:12, color:C.textDim, fontStyle:"italic" }}>Simulated illustration only · Not actual trade data · Signals shown for demonstration purposes</p>
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

function LandingPage({ onNavigate, onNavigateCalc, t, track, setTrack }) {
  const [signalCount] = useState(47 + Math.floor(Math.random() * 12));
  const [demoRR, setDemoRR]         = useState("2.5");
  const [lpBtInst, setLpBtInst]     = useState("ES");
  const [calcEmail, setCalcEmail]   = useState("");
  const [calcSent, setCalcSent]     = useState(false);

  return (
    <div style={{ width:"100%", overflowX:"hidden" }}>
      <PriceTicker />

      {/* Hero — always shown first */}
      <div style={{ minHeight:"92vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:"80px 24px" }}>
        <div style={{ fontSize:10, letterSpacing:"0.3em", color:track==="forex"?C.accent:C.long, textTransform:"uppercase", marginBottom:20, display:"flex", alignItems:"center", gap:10, fontFamily:"monospace" }}>
          <LiveDot color={track==="forex"?C.accent:C.long} size={6} />
          {track==="forex" ? t.forexTagline : track==="futures" ? t.tagline : t.engineTagline}
        </div>
        <div style={{ marginBottom:24 }}><SignalCounter count={signalCount} /></div>
        <h1 style={{ fontSize:"clamp(44px,6.5vw,86px)", fontWeight:700, lineHeight:1.08, marginBottom:24, letterSpacing:"-0.04em", maxWidth:800 }}>
          {track==="forex"
            ? <>{t.forexHeroTitle1}<br /><span style={{ color:C.accent }}>{t.forexHeroTitle2}</span></>
            : track==="futures"
            ? <>{t.heroTitle1}<br /><span style={{ color:C.accent }}>{t.heroTitle2}</span></>
            : <>{t.chooserTitle1}<br />{t.chooserTitle2}<br /><span style={{ color:C.accent }}>{t.chooserTitle3}</span></>}
        </h1>
        <p style={{ fontSize:18, color:"#b8cccc", maxWidth:560, lineHeight:1.8, marginBottom:52 }}>
          {track==="forex" ? t.forexHeroSub : t.chooserSub}
        </p>
        <div style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={() => onNavigate("signup")} style={{ padding:"15px 36px", background:C.accent, color:"#080909", border:"none", borderRadius:8, fontWeight:600, fontSize:14, cursor:"pointer" }}>{t.startTrial}</button>
          <button onClick={() => onNavigate(track==="forex" ? "forex-demo" : track==="futures" ? "dashboard" : "demo-chooser")} style={{ padding:"15px 36px", background:"transparent", color:C.long, border:`1px solid ${C.long}`, borderRadius:8, fontWeight:500, fontSize:14, cursor:"pointer" }}>{t.viewDemo}</button>
        </div>

        {/* Example signal card */}
        <div style={{ marginTop:72, display:"flex", justifyContent:"center", width:"100%", maxWidth:780 }}>
          <div style={{ maxWidth:340, width:"100%", textAlign:"left" }}>
            <div style={{ fontSize:10, color:C.textDim, letterSpacing:"0.15em", marginBottom:12, fontFamily:"monospace", textAlign:"center" }}>{t.exampleSignal}</div>
            {(() => {
              const isForex = track === "forex";
              const dirColor = C.long;
              // Demo data — mirrors real SignalCard exactly
              const demo = isForex ? {
                entry:"1.0842", stop:"1.0812", stopPips:"30 pips", stopUsd:"$300/lot",
                tp:{ "2":"1.0902", "2.5":"1.0917", "3":"1.0932" },
                tpPips:{ "2":"60 pips · $600/lot", "2.5":"75 pips · $750/lot", "3":"90 pips · $900/lot" },
              } : {
                entry:"5,247.25", stop:"5,213.00", stopPips:"34 ticks", stopUsd:"$425/contract",
                tp:{ "2":"5,315.25", "2.5":"5,332.25", "3":"5,349.25" },
                tpPips:{ "2":"68 ticks · $850/contract", "2.5":"85 ticks · $1,062.50/contract", "3":"102 ticks · $1,275/contract" },
              };
              return (
            <div style={{ background:C.surfaceUp, border:`1px solid ${dirColor}33`, borderRadius:12, padding:20, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:dirColor }} />

              {/* Header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <LiveDot color={dirColor} size={8} />
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:20, fontWeight:700, color:dirColor, fontFamily:"monospace" }}>LONG</span>
                      <span style={{ fontSize:20, fontWeight:700, fontFamily:"monospace" }}>{isForex?"EUR/USD":"ES"}</span>
                      <span style={{ fontSize:10, color:C.textMid, background:C.border, padding:"2px 7px", borderRadius:4, fontFamily:"monospace" }}>5m</span>
                    </div>
                    <div style={{ fontSize:11, color:C.textMid, marginTop:3, fontFamily:"monospace" }}>09:32 ET</div>
                  </div>
                </div>
                <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, background:dirColor+"22", color:dirColor, fontFamily:"monospace" }}>ACTIVE</span>
              </div>

              {isForex && <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", background:C.accentDim, padding:"2px 8px", borderRadius:4, display:"inline-block", marginBottom:10 }}>DERIVED FROM /6E</div>}

              {/* Trigger */}
              <div style={{ marginBottom:12 }}>
                <TriggerBolts trigger="AAA+" />
                <div style={{ fontSize:10, color:C.textMid, fontFamily:"monospace", marginTop:4 }}>All 3 cycles within 2 bars · Fresh rotation</div>
                <div style={{ display:"flex", gap:12, marginTop:4 }}>
                  <span style={{ fontSize:10, color:C.long, fontFamily:"monospace" }}>17 EMA: trend aligned</span>
                  <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>NY Open</span>
                </div>
              </div>

              <div style={{ height:1, background:C.border, marginBottom:10 }} />

              {/* Cycles */}
              {[["Daily","↑ above zero"],["2-Day","↑ above zero"],["4-Day","↑ above zero"]].map(([l,s]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.border}`, fontSize:11, fontFamily:"monospace" }}>
                  <span style={{ color:C.textMid }}>{l}</span>
                  <span style={{ color:dirColor }}>{s} <span style={{ fontSize:10, color:dirColor, background:dirColor+"18", padding:"1px 5px", borderRadius:3 }}>✓</span></span>
                </div>
              ))}

              <div style={{ height:1, background:C.border, margin:"10px 0" }} />

              {/* VWAPs */}
              {[["Daily VWAP","↑ above"],["Weekly VWAP","↑ above"]].map(([l,s]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${C.border}`, fontSize:11, fontFamily:"monospace" }}>
                  <span style={{ color:C.textMid }}>{l}</span>
                  <span style={{ color:dirColor }}>{s} ✓</span>
                </div>
              ))}

              {/* Entry */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0" }}>
                <span style={{ fontSize:11, color:C.textMid, fontFamily:"monospace" }}>Entry Price</span>
                <span style={{ fontSize:14, fontWeight:600, color:C.text, fontFamily:"monospace" }}>{demo.entry}</span>
              </div>

              <div style={{ height:1, background:C.border, marginBottom:12 }} />

              {/* Smart Stop & TP */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:3 }}>SMART STOP · REFERENCE</div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.short, fontFamily:"monospace" }}>{demo.stop}</div>
                  <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>{demo.stopPips} · {demo.stopUsd}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:3 }}>SMART TP</div>
                  <div style={{ fontSize:13, fontWeight:700, color:dirColor, fontFamily:"monospace" }}>{demo.tp[demoRR]}</div>
                  <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>{demo.tpPips[demoRR]}</div>
                </div>
              </div>

              {/* R:R selector */}
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:8 }}>TARGET R:R</div>
                <div style={{ display:"flex", gap:8 }}>
                  {[
                    { key:"2",   label:"2.0:1", sub:"Conservative", star:false },
                    { key:"2.5", label:"2.5:1", sub:"Recommended ★", star:true  },
                    { key:"3",   label:"3.0:1", sub:"Aggressive",    star:false },
                  ].map(({ key, label, sub, star }) => {
                    const active = demoRR === key;
                    const cardColor = star ? C.accent : dirColor;
                    return (
                      <button key={key} onClick={() => setDemoRR(key)} style={{
                        flex:1, padding:"10px 6px", borderRadius:9, fontFamily:"monospace", cursor:"pointer", textAlign:"center",
                        background: active ? cardColor+"18" : C.bg,
                        border:    `1.5px solid ${active ? cardColor : C.border}`,
                        boxShadow:  active ? `0 0 12px ${cardColor}28` : "none",
                        transition:"all 0.15s",
                      }}>
                        <div style={{ fontSize:13, fontWeight:800, color: active ? cardColor : C.textMid, marginBottom:3 }}>{label}</div>
                        <div style={{ fontSize:9, color: active ? cardColor+"bb" : C.textDim, fontWeight: star ? 700 : 400 }}>{sub}</div>
                        {active && <div style={{ width:16, height:2, background:cardColor, borderRadius:2, margin:"6px auto 0" }}/>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vol regime */}
              <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:6 }}>
                <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>Vol:</span>
                <span style={{ fontSize:10, fontFamily:"monospace", fontWeight:600, color:C.warn, background:C.border, padding:"1px 7px", borderRadius:3 }}>NORMAL</span>
                <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>z=0.84</span>
              </div>
            </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── Backtest Results ──────────────────────────────────────────── */}
      {(() => {
        const lpBt = BACKTEST_STATIC[lpBtInst];
        const ov   = lpBt.overall;
        const pts  = ov.equity || [];
        const isES = lpBtInst === "ES";
        return (
        <div style={{ background:`linear-gradient(180deg, ${C.bg} 0%, ${C.silver} 8%, ${C.silver} 92%, ${C.bg} 100%)`, width:"100%", borderTop:`1px solid ${C.silverBorder}`, borderBottom:`1px solid ${C.silverBorder}` }}>
        <div style={{ maxWidth:960, margin:"0 auto", padding:"60px 24px 80px" }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ fontSize:10, letterSpacing:"0.25em", color:C.accent, fontFamily:"monospace", marginBottom:14 }}>{t.backtestLabel}</div>
            <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.03em", marginBottom:12 }}>
              Real numbers.<br/><span style={{ color:C.long }}>Real historical data.</span>
            </h2>
            <p style={{ color:C.textMid, fontSize:14, maxWidth:560, margin:"0 auto 24px", lineHeight:1.7 }}>
              Walk-forward backtest · 5-min bars · {lpBt.period} · Tier-based stops
            </p>
            {/* Instrument cards */}
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              {[
                { sym:"ES", label:"E-mini S&P 500", tag:"Scaled Exit · 2:1 + 5:1", pnl:"+$6,219", wr:"51.8%", pf:"1.66x", dd:"$850", color:C.accent, tagColor:C.accent },
                { sym:"NQ", label:"E-mini Nasdaq-100", tag:"Single Target · 5:1",  pnl:"+$22,225", wr:"42.3%", pf:"1.97x", dd:"$4,510", color:C.long, tagColor:C.long },
              ].map(({ sym, label, tag, pnl, wr, pf, dd, color, tagColor }) => {
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
                      <span style={{ fontSize:9, fontFamily:"monospace", fontWeight:700, color:tagColor, background:tagColor+"1a", padding:"2px 8px", borderRadius:4, border:`1px solid ${tagColor}33` }}>{tag}</span>
                    </div>
                    <div style={{ fontSize:11, color:C.textDim, marginBottom:10 }}>{label}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 14px" }}>
                      {[
                        { l:"NET P&L", v:pnl, c:C.long },
                        { l:"WIN RATE", v:wr,  c:active ? color : C.text },
                        { l:"PROF. FACTOR", v:pf,  c:active ? color : C.text },
                        { l:"MAX DD", v:dd,  c:C.warn },
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
              { label:"WIN RATE",      value:`${ov.win_rate}%`,                    sub: isES ? "any profit (TP1 or TP2)" : `B/E at ${(1/(1+lpBt.rr)*100).toFixed(1)}%`, color:C.long },
              { label:"PROFIT FACTOR", value:`${ov.profit_factor}x`,               sub:"gross wins ÷ gross losses",         color:C.accent },
              { label:"NET P&L",       value:`+$${ov.total_pnl.toLocaleString()}`, sub:`${ov.trades} trades · ${lpBt.period}`, color:C.long },
              { label:"MAX DRAWDOWN",  value:`$${ov.max_drawdown.toLocaleString()}`, sub:"peak-to-trough",                   color:C.warn },
              { label:"AVG HOLD TIME", value:`${ov.avg_hold_min} min`,             sub:"per trade",                         color:C.textMid },
            ].map(s => (
              <div key={s.label} style={{ background:C.silverUp, border:`1px solid ${C.silverBorder}`, borderRadius:12, padding:"18px 20px", textAlign:"center", boxShadow:`inset 0 1px 0 ${C.silverBorder}` }}>
                <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize:26, fontWeight:700, color:s.color, fontFamily:"monospace", letterSpacing:"-0.02em" }}>{s.value}</div>
                <div style={{ fontSize:11, color:C.textDim, marginTop:5 }}>{s.sub}</div>
              </div>
            ))}
          </div>

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
                    <div style={{ fontSize:20, fontWeight:700, color:C.long, fontFamily:"monospace" }}>+${ov.total_pnl.toLocaleString()}</div>
                    <div style={{ fontSize:11, color:C.textDim }}>{lpBt.exit_strategy.split("·")[0].trim()}</div>
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
                  <span style={{ color:C.long }}>● {ov.wins} wins</span>
                  <span style={{ color:C.short }}>● {ov.losses} losses</span>
                  <span style={{ marginLeft:"auto" }}>Zero line = breakeven · {ov.trades} total trades</span>
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
            <strong>Hypothetical performance disclosure:</strong> Results are based on walk-forward backtesting on historical 5-min bar data. Past performance is not indicative of future results. All trading involves risk of loss.&nbsp;
            Results do not account for slippage or commissions. For educational purposes only. Not financial advice.
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
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:12 }}>CHOOSE YOUR TRACK</div>
          <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.03em" }}>Futures or Forex — same intelligence, same edge.</h2>
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
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:14 }}>THE METHODOLOGY</div>
          <h2 style={{ fontSize:32, fontWeight:700, letterSpacing:"-0.03em", marginBottom:0 }}>How Signal Boss Works</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", gap:16 }}>
          {["01","02","03","04"].map(n => (
            <div key={n} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontSize:11, color:C.accent, fontFamily:"monospace", marginBottom:10 }}>{n}</div>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:8 }}>{t.features[n].title}</div>
              <div style={{ color:C.textMid, fontSize:13, lineHeight:1.7 }}>{t.features[n].desc}</div>
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
            If Charts Worked, 98% Wouldn't Be Losing.
          </p>

          {/* Gym analogy */}
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:28 }}>
            Imagine joining a gym and following a workout plan that makes 98% of its members weaker and fatter. Chart-based trading is the 'workout plan' for many traders, and put simply it's making them poorer and weaker financially. Signal Boss allows traders to get valid, institutional grade signals that are triggered by the conditions that truly move markets.
          </p>

          <p style={{ fontSize:20, fontWeight:600, color:"#c9cdd6", lineHeight:1.6, marginBottom:8, letterSpacing:"-0.01em" }}>
            Charts show you what already happened.<br />
            <span style={{ color:C.text }}>They Don't Show Conditions.</span>
          </p>

          <p style={{ fontSize:18, fontWeight:600, color:C.accent, lineHeight:1.6, marginBottom:32, letterSpacing:"-0.01em" }}>
            The Problem Isn't Charts. It's Using Them Without The Right Context.
          </p>

          {/* The reframe */}
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:16 }}>
            The problem is that charts alone don't tell you if the market is in a condition where a large, sustained move is statistically likely.
          </p>
          <p style={{ fontSize:17, color:C.text, fontWeight:600, lineHeight:1.9, marginBottom:32 }}>
            Intuitively, you already know this.
          </p>
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:32 }}>
            That information doesn't live on a chart. It lives in volatility — specifically, in implied volatility derived from exchange-traded futures, where institutional positioning is expressed first and retail traders rarely look.
          </p>

          {/* Stacked rhythm lines */}
          <div style={{ margin:"0 0 28px 0", paddingLeft:20, borderLeft:`2px solid ${C.border}` }}>
            {[
              "Price action tells you what the market already did.",
              "Market structure tells you where it's been.",
              "Volatility tells you what it's preparing to do right now.",
            ].map(line => (
              <p key={line} style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.7, marginBottom:6 }}>{line}</p>
            ))}
            <p style={{ fontSize:17, color:C.text, fontWeight:600, lineHeight:1.7, marginTop:10 }}>Only one of those is forward-looking.</p>
          </div>

          {/* How Signal Boss fits */}
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:8 }}>
            Signal Boss doesn't replace your chart process. It gives you the layer that's been missing from it.
          </p>
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:28 }}>
            When a Signal Boss alert fires, it means volatility has reached an inflection point — the condition under which large price movement statistically occurs. If you still want to look at your chart before you pull the trigger, look. Most of the time, you'll see the chart confirming what the volatility already told you.
          </p>

          {/* Three components */}
          <p style={{ fontSize:17, color:C.text, fontWeight:600, lineHeight:1.9, marginBottom:14 }}>
            Every Signal Boss alert delivers three components:
          </p>
          <div style={{ margin:"0 0 28px 0", display:"flex", flexDirection:"column", gap:10 }}>
            {["Entry Price", "Smart Stop", "Smart Take Profit"].map(item => (
              <div key={item} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ color:C.accent, fontSize:14 }}>◆</span>
                <span style={{ fontSize:16, fontWeight:600, color:C.text, fontFamily:"monospace" }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize:15, color:C.textMid, lineHeight:1.9, marginBottom:32 }}>
            Not just an entry and a wish. A complete trade — built from the same volatility data that institutions use to price risk.
          </p>

          {/* Premise */}
          <div style={{ background:C.bg, borderRadius:10, padding:"18px 22px", borderLeft:`3px solid ${C.accent}`, marginBottom:32 }}>
            <p style={{ fontSize:15, color:C.text, lineHeight:1.8, fontStyle:"italic", margin:0 }}>
              "Correct volatility regime + defined risk + proper sizing = professional trading. Get the Signal, confirm with your chart."
            </p>
          </div>

          {/* The gut-punch question */}
          <div style={{ background:`linear-gradient(135deg, #0c0e10, #0a0c0e)`, border:`1px solid ${C.accent}22`, borderRadius:12, padding:"24px 28px", marginBottom:28 }}>
            <p style={{ fontSize:15, color:C.textMid, lineHeight:1.8, marginBottom:10 }}>Ask yourself a simple question:</p>
            <p style={{ fontSize:18, fontWeight:600, color:C.text, lineHeight:1.7, marginBottom:0, fontStyle:"italic" }}>
              If charts alone were the answer…<br />
              why are you not already generating consistent wealth using them?
            </p>
          </div>

          {/* Closing */}
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:8 }}>
            Signal Boss does not predict candles. It does not replace your judgment.
          </p>
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:8 }}>
            It identifies <span style={{ color:C.text, fontWeight:600 }}>volatility expansion conditions</span> — the environment where large, sustained price movement statistically occurs — and delivers a complete, actionable trade the moment conditions align.
          </p>
          <p style={{ fontSize:17, color:"#c9cdd6", lineHeight:1.9, marginBottom:8 }}>
            Use your charts to confirm. Trade with the context your charts were never designed to give you.
          </p>
          <p style={{ fontSize:17, color:C.textMid, lineHeight:1.9, marginBottom:36, fontStyle:"italic" }}>
            The gym is still full. You don't have to stay on the same plan.
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
          <span onClick={() => onNavigate("institutional")} style={{ fontSize:13, color:C.accent, cursor:"pointer", textDecoration:"underline" }}>Institutional Access →</span>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ maxWidth:880, margin:"0 auto", padding:"0 24px 100px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:12 }}>EARLY USERS</div>
          <h2 style={{ fontSize:28, fontWeight:600, letterSpacing:"-0.03em" }}>What traders are saying</h2>
          <p style={{ color:C.textMid, marginTop:8, fontSize:13 }}>From our beta group — real traders, real feedback.</p>
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
            { quote:"I've tried a dozen signal services. Most give you arrows on a chart with zero context. Signal Boss tells me why — the cycles, the VWAP alignment, the confluence score. That's what I actually needed.", name:"R.T.", detail:"ES & NQ trader · Chicago, IL", stars:5 },
            { quote:"The Account Risk Calculator alone is worth the subscription. I finally understand my true trading capital on a $100K funded account. Passed my FTMO challenge on the second attempt after using it.", name:"M.K.", detail:"Prop trader · Dallas, TX", stars:5 },
            { quote:"Clean, no noise. I get the signal, I see the confluence, I make the call. No second-guessing the setup because the methodology is transparent. That's rare.", name:"D.L.", detail:"Futures trader · Austin, TX", stars:5 },
            { quote:"I was skeptical of another signal tool, but the IV inflection approach actually makes sense. It's grounded in something real, not just a black box. First week using it I avoided two bad trades.", name:"S.W.", detail:"Options & futures · New York, NY", stars:5 },
            { quote:"Setup took five minutes. Signals come through clean. The 3-cycle confluence filter cuts out so much of the noise I used to trade through. My win rate isn't magic — I'm just trading better setups.", name:"J.A.", detail:"Day trader · Phoenix, AZ", stars:5 },
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
          <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.2em", marginBottom:12 }}>KNOW YOUR FIT</div>
          <h2 style={{ fontSize:28, fontWeight:600, letterSpacing:"-0.03em" }}>Signal Boss is built for some traders.<br /><span style={{ color:C.textMid }}>Not all of them.</span></h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px,1fr))", gap:20 }}>
          <div style={{ background:"#0b130e", border:`1px solid ${C.long}33`, borderRadius:14, padding:28 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.long, fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:20 }}>THIS IS FOR YOU IF...</div>
            {(track==="forex" ? [
              "You trade major forex pairs or crosses and want institutional signal intelligence",
              "You're working through an FTMO, FundedNext, or other forex prop challenge",
              "You understand that currency futures are a leading indicator for spot forex",
              "You want to know why a signal fired — derived from which futures, at what confluence",
              "You're comfortable making your own trading decisions with better information",
              "You value clean, transparent methodology over black-box arrows on a chart",
            ] : [
              "You trade futures actively and want confluence-based signals, not noise",
              "You're working through a prop firm challenge or protecting your own trading account",
              "You understand that signals are tools, not guarantees — and trade accordingly",
              "You want to know why a signal fired, not just that it did",
              "You're comfortable making your own trading decisions with better information",
              "You value clean, minimal interfaces over cluttered dashboards",
            ]).map((item, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"flex-start" }}>
                <span style={{ color:C.long, marginTop:2, flexShrink:0 }}>✓</span>
                <span style={{ fontSize:13, color:"#c9cdd6", lineHeight:1.7 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ background:"#130b0b", border:`1px solid ${C.short}22`, borderRadius:14, padding:28 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#f87171", fontFamily:"monospace", letterSpacing:"0.12em", marginBottom:20 }}>THIS IS NOT FOR YOU IF...</div>
            {(track==="forex" ? [
              "You're looking for a fully automated system that trades for you",
              "You expect signals to be profitable without your own risk management",
              "You're a complete beginner with no understanding of forex or currency markets",
              "You want a copy-trading or managed account service",
              "You're not prepared to lose capital — trading involves real financial risk",
              "You need someone else to be responsible for your trading decisions",
            ] : [
              "You're looking for a fully automated system that trades for you",
              "You expect signals to be profitable without your own risk management",
              "You're a complete beginner with no understanding of futures markets",
              "You want passive investing or long-only equity strategies",
              "You're not prepared to lose capital — trading involves real financial risk",
              "You need someone else to be responsible for your trading decisions",
            ]).map((item, i) => (
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
            <span style={{ cursor:"pointer", color:C.accent }}>Institutional Access</span>
          </div>
          <div style={{ marginTop:16, fontSize:12, color:"#4b5563", fontFamily:"monospace", textAlign:"center" }}>
            © {new Date().getFullYear()} Signal Boss · All rights reserved
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
                {signupTrack && <div style={{ fontSize:11, color:C.textDim, marginTop:6, fontFamily:"monospace" }}>{signupTrack==="futures" ? "ES · NQ · CL · GC · RTY · ZB · /6E · /6B · /6A" : "EUR/USD · GBP/USD · AUD/USD"}</div>}
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
  ZB: { tick: 0.03125,tickVal:31.25,unit: "pts",  label: "ZB (T-Bond)"     },
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
  const isAdmin = user?.publicMetadata?.role === "admin";
  const [signals, setSignals]     = useState(() => Array.from({length:6},(_,i)=>({...generateSignal(i),isNew:false,status:i<4?"ACTIVE":"CANCELLED"})));
  const [activeTab, setActiveTab] = useState("signals");
  const [adminStats, setAdminStats] = useState(null);
  const [exitMode, setExitMode]   = useState("INFLECTION");
  const [timeframe, setTimeframe] = useState("5m");
  const [filterDir, setFilterDir] = useState("ALL");
  const [filterStr, setFilterStr] = useState("ALL");
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
  const idRef = useRef(100);
  const [todayCount, setTodayCount] = useState(47);
  const [history,    setHistory]    = useState([]);
  const [histStats,  setHistStats]  = useState(null);
  const [backtest,   setBacktest]   = useState(FALLBACK_BACKTEST);
  const [btInstrument, setBtInstrument] = useState("NQ");

  useEffect(() => {
    if (!SIGNALS_URL) return;
    const load = () => {
      fetch(`${SIGNALS_URL}?t=${Date.now()}`)
        .then(r => r.json())
        .then(data => {
          if (data.signals && data.signals.length > 0) {
            setSignals(data.signals.map((s, i) => {
              // If engine didn't supply risk, generate it so Smart Stop/TP always shows
              const risk = s.risk || (() => {
                const tk       = INST_TICK[s.instrument] || INST_TICK.ES;
                const isLong   = s.direction === "LONG";
                const stopTicks = 10;
                const stopPx    = +(stopTicks * tk.size).toFixed(4);
                const p         = s.price || 5247;
                return {
                  stopPrice:  +(isLong ? p - stopPx : p + stopPx).toFixed(4),
                  stopPx, stopTicks,
                  stopUsd:    +(stopTicks * tk.value).toFixed(2),
                  tp2_0Price: +(isLong ? p + stopPx*2.0 : p - stopPx*2.0).toFixed(4),
                  tp2_5Price: +(isLong ? p + stopPx*2.5 : p - stopPx*2.5).toFixed(4),
                  tp3_0Price: +(isLong ? p + stopPx*3.0 : p - stopPx*3.0).toFixed(4),
                  tp2_0Usd:   +(stopTicks * 2.0 * tk.value).toFixed(2),
                  tp2_5Usd:   +(stopTicks * 2.5 * tk.value).toFixed(2),
                  tp3_0Usd:   +(stopTicks * 3.0 * tk.value).toFixed(2),
                  volRegime: "NORMAL", suggestedRR: 2.5, zAtr: "0.84", conditionsMet: 4,
                };
              })();
              return { ...s, isNew: i === 0, risk };
            }));
            setTodayCount(data.count || data.signals.length);
          }
        })
        .catch(() => {});
    };
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!HISTORY_URL) return;
    const loadHistory = () => {
      fetch(`${HISTORY_URL}?t=${Date.now()}`)
        .then(r => r.json())
        .then(data => {
          if (data.history) setHistory(data.history);
          if (data.stats)   setHistStats(data.stats);
        })
        .catch(() => {});
    };
    loadHistory();
    const iv = setInterval(loadHistory, 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!BACKTEST_URL) return;
    fetch(`${BACKTEST_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then(data => setBacktest(data))
      .catch(() => {});
  }, []);

  const dismiss  = id => setSignals(prev => prev.map(s => s.id===id?{...s,status:"CANCELLED"}:s));
  const active   = signals.filter(s => s.status==="ACTIVE");
  const longs    = active.filter(s => s.direction==="LONG").length;
  const shorts   = active.filter(s => s.direction==="SHORT").length;
  const strong   = active.filter(s => s.trigger==="AAA" || s.trigger==="AAA+").length;
  const filtered = signals.filter(s => {
    if (filterDir!=="ALL" && s.direction!==filterDir) return false;
    if (filterStr!=="ALL" && s.trigger!==filterStr) return false;
    return true;
  });

  const tabs = [
    { id:"signals",  label:t.liveSignals,   icon:"◉" },
    { id:"backtest", label:"Backtest",       icon:"◫" },
    { id:"history",  label:"Signal History", icon:"◷" },
    { id:"pnl",      label:"P&L Tracker",   icon:"◈" },
    { id:"config",   label:t.configuration, icon:"⚙" },
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
          <div onClick={() => onNavigate("landing")} style={{ fontWeight:700, fontSize:15, fontFamily:"monospace", cursor:"pointer" }}>SIGNAL<span style={{ color:C.accent }}>BOSS</span></div>
          <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
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
          <div style={{ marginTop:10, textAlign:"center" }}><SignalCounter count={todayCount} /></div>
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
            {/* Demo notice */}
            <div style={{ marginBottom:18, background:"#0e0a04", border:`1px solid #f59e0b44`, borderRadius:10, padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:14 }}>⚠</span>
                <span style={{ fontSize:12, color:"#f59e0b", fontFamily:"monospace", fontWeight:600, letterSpacing:"0.08em" }}>SIMULATED DEMO</span>
                <span style={{ fontSize:12, color:"#9ca3af" }}>— These are not live signals. Real-time signal delivery requires a subscription.</span>
              </div>
              <button onClick={() => onNavigate("signup")} style={{ padding:"7px 18px", background:C.accent, color:"#080909", border:"none", borderRadius:6, fontWeight:700, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>
                Get Started →
              </button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:18 }}>
              <StatTile label={t.activeSignals} value={active.length} color={C.accent} />
              <StatTile label={t.long}   value={longs}  color={C.long}  sub={t.active.toLowerCase()} />
              <StatTile label={t.short}  value={shorts} color={C.short} sub={t.active.toLowerCase()} />
              <StatTile label={t.strongSig} value={strong} color={C.strong} sub={t.threeCycles} />
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginRight:4 }}>{t.direction}</span>
              {["ALL","LONG","SHORT"].map(d => (
                <button key={d} onClick={() => setFilterDir(d)} className="tab-btn" style={{ padding:"5px 14px", borderRadius:5, fontSize:11, fontFamily:"monospace", fontWeight:600, background:filterDir===d?(d==="LONG"?C.longDim:d==="SHORT"?C.shortDim:C.accentDim):C.surface, color:filterDir===d?(d==="LONG"?C.long:d==="SHORT"?C.short:C.accent):C.textMid, border:`1px solid ${filterDir===d?(d==="LONG"?C.long+"33":d==="SHORT"?C.short+"33":C.accent+"33"):C.border}` }}>{d}</button>
              ))}
              <div style={{ width:1, height:18, background:C.border, margin:"0 4px" }} />
              <span style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>TRIGGER</span>
              {["ALL","AAA+","AAA","AA","A"].map(s => (
                <button key={s} onClick={() => setFilterStr(s)} className="tab-btn" style={{ padding:"5px 14px", borderRadius:5, fontSize:11, fontFamily:"monospace", background:filterStr===s?C.accentDim:C.surface, color:filterStr===s?C.accent:C.textMid, border:`1px solid ${filterStr===s?C.accent+"33":C.border}` }}>
                  {s === "ALL" ? "ALL" : `Trigger ${s}`}
                </button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(310px,1fr))", gap:14 }}>
              {filtered.map(sig => <SignalCard key={sig.id} signal={sig} onDismiss={dismiss} exitMode={exitMode} rrPref={rrPref} setRrPref={(v)=>{ setRrPref(v); localStorage.setItem("sb_rr_pref", v); }} t={t} />)}
              {filtered.length===0 && <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 0", color:C.textDim, fontFamily:"monospace", fontSize:13 }}>{t.noSignals}</div>}
            </div>
            {/* CTA Banner */}
            <div style={{ marginTop:32, background:`linear-gradient(135deg, ${C.surface}, #0e120a)`, border:`1px solid ${C.long}33`, borderRadius:14, padding:"24px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ fontSize:10, color:C.long, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:6 }}>THIS IS THE DEMO</div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>Ready for live signals on your account?</div>
                <div style={{ fontSize:13, color:C.textMid }}>Start your free trial and get real-time alerts the moment conditions align.</div>
              </div>
              <button onClick={() => onNavigate("signup")} style={{ padding:"12px 28px", background:C.accent, color:"#080909", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
                Get Started →
              </button>
            </div>
          </div>
        )}

        {activeTab==="backtest" && (() => {
          const btData = BACKTEST_STATIC[btInstrument];
          const ov     = btData.overall;
          const byTrig = btData.by_trigger;
          const breakEven = (1 / (1 + btData.rr) * 100).toFixed(1);
          return (
          <div style={{ padding:22, maxWidth:900 }}>

            {/* Header + instrument selector */}
            <div style={{ marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
                <h2 style={{ fontSize:18, fontWeight:700, margin:0 }}>Backtest Results</h2>
                <span style={{ fontSize:10, fontFamily:"monospace", background:C.accentDim, color:C.accent, padding:"2px 8px", borderRadius:4, border:`1px solid ${C.accent}44` }}>HYPOTHETICAL</span>
              </div>
              {/* Instrument cards — each shows its own strategy */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
                {[
                  { sym:"ES", label:"E-mini S&P 500", tag:"Scaled Exit", tagDesc:"TP1 at 2:1 · 50% off · stop → BE · TP2 at 5:1", tagColor:C.accent },
                  { sym:"NQ", label:"E-mini Nasdaq-100", tag:"Single Target", tagDesc:"Full position runs to 5:1 · max alpha capture", tagColor:C.long },
                ].map(({ sym, label, tag, tagDesc, tagColor }) => (
                  <button key={sym} onClick={() => setBtInstrument(sym)} style={{
                    padding:"14px 16px", borderRadius:10, cursor:"pointer", textAlign:"left",
                    background: btInstrument===sym ? C.accentDim : C.surface,
                    border: `1px solid ${btInstrument===sym ? C.accent : C.border}`,
                    transition:"all 0.15s",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:15, fontWeight:700, fontFamily:"monospace", color: btInstrument===sym ? C.accent : C.text }}>{sym}</span>
                      <span style={{ fontSize:10, fontFamily:"monospace", fontWeight:700, color:tagColor, background:tagColor+"18", padding:"2px 7px", borderRadius:4 }}>{tag}</span>
                    </div>
                    <div style={{ fontSize:11, color:C.textMid, marginBottom:4 }}>{label}</div>
                    <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace" }}>{tagDesc}</div>
                  </button>
                ))}
              </div>
              <p style={{ color:C.textMid, fontSize:12, margin:0, lineHeight:1.6 }}>
                <strong style={{ color:C.text }}>{btData.name}</strong>
                &nbsp;·&nbsp;{btData.period}&nbsp;·&nbsp;5-min bars&nbsp;·&nbsp;Tier-based stops (cycle invalidation + ATR floor, scaled per signal conviction)
                <br/><span style={{ fontSize:11, color:C.textDim }}>{btData.exit_strategy}</span>
              </p>
            </div>

            {/* Stats grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(128px,1fr))", gap:10, marginBottom:22 }}>
              {[
                { label:"TRADES",        value: ov.trades,                                    sub:`${(ov.trades / (btData.period.match(/\d+/)?.[0] ?? 45) * 5).toFixed(1)}/week`,  color: C.text },
                { label:"WIN RATE",      value: `${ov.win_rate}%`,                             sub: btInstrument==="ES" ? "any profit (TP1 or TP2)" : `B/E: ${breakEven}%`, color: C.long },
                { label:"PROFIT FACTOR", value: `${ov.profit_factor}x`,                        sub:"gross W ÷ gross L",                     color: C.accent },
                { label:"NET P&L",       value: `+$${ov.total_pnl.toLocaleString()}`,          sub:`${ov.wins}W / ${ov.losses}L`,            color: C.long },
                { label:"MAX DRAWDOWN",  value: `$${ov.max_drawdown.toLocaleString()}`,        sub:"peak-to-trough",                        color: C.warn },
                { label:"AVG HOLD",      value: `${ov.avg_hold_min}m`,                         sub:"per trade",                             color: C.textMid },
              ].map(s => (
                <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
                  <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:5 }}>{s.label}</div>
                  <div style={{ fontSize:17, fontWeight:700, color:s.color, fontFamily:"monospace" }}>{s.value}</div>
                  <div style={{ fontSize:10, color:C.textDim, marginTop:3 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* By-trigger breakdown */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", marginBottom:22 }}>
              <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontSize:13, fontWeight:600 }}>Results by Trigger Tier</div>
                <div style={{ fontSize:11, color:C.textDim, marginTop:3 }}>Higher tiers show stronger alignment across cycles</div>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, fontFamily:"monospace" }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                      {["Trigger","Trades","Win Rate","Profit Factor","Net P&L","Avg Hold"].map(h => (
                        <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:9, color:C.textDim, letterSpacing:"0.08em", fontWeight:600, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {["AAA+","AAA","AA","A"].filter(tier => byTrig[tier]).map((tier, i) => {
                      const d = byTrig[tier];
                      const tierColor = tier==="AAA+" ? C.accent : tier==="AAA" ? C.long : tier==="AA" ? C.textMid : C.textDim;
                      return (
                        <tr key={tier} style={{ background: i%2===0?"transparent":C.bg+"66", borderBottom:`1px solid ${C.border}22` }}>
                          <td style={{ padding:"10px 14px" }}>
                            <span style={{ fontWeight:700, color:tierColor, fontSize:13 }}>Trigger {tier}</span>
                          </td>
                          <td style={{ padding:"10px 14px", color:C.text }}>{d.trades}</td>
                          <td style={{ padding:"10px 14px", color: d.win_rate >= 40 ? C.long : d.win_rate >= 33 ? C.accent : C.warn, fontWeight:600 }}>{d.win_rate}%</td>
                          <td style={{ padding:"10px 14px", color: d.profit_factor >= 1.5 ? C.long : d.profit_factor >= 1 ? C.accent : C.short, fontWeight:600 }}>{d.profit_factor}x</td>
                          <td style={{ padding:"10px 14px", color: d.total_pnl >= 0 ? C.long : C.short, fontWeight:700 }}>
                            {d.total_pnl >= 0 ? "+" : ""}${d.total_pnl.toLocaleString()}
                          </td>
                          <td style={{ padding:"10px 14px", color:C.textMid }}>{d.avg_hold_min}m</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Equity curve */}
            {ov.equity && ov.equity.length > 0 && (() => {
              const pts   = ov.equity;
              const lo    = Math.min(0, ...pts);
              const hi    = Math.max(...pts);
              const span  = hi - lo || 1;
              const W     = 780, H = 160, pad = 8;
              const xStep = (W - pad*2) / (pts.length - 1);
              const toY   = v => H - pad - ((v - lo) / span) * (H - pad*2);
              const zero  = toY(0);
              const pathD = pts.map((v, i) => `${i===0?"M":"L"}${pad + i*xStep},${toY(v)}`).join(" ");
              const fillD = `${pathD} L${pad+(pts.length-1)*xStep},${H-pad} L${pad},${H-pad} Z`;
              return (
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px", marginBottom:22 }}>
                  <div style={{ fontSize:11, color:C.textDim, fontFamily:"monospace", marginBottom:10, display:"flex", justifyContent:"space-between" }}>
                    <span>EQUITY CURVE  ({ov.trades} trades · 1 contract)</span>
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
                    <span style={{ color:C.long }}>● {ov.wins} wins</span>
                    <span style={{ color:C.short }}>● {ov.losses} losses</span>
                    <span style={{ marginLeft:"auto" }}>Zero line = breakeven</span>
                  </div>
                </div>
              );
            })()}

            {/* Trade log — 50 sample trades */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", marginBottom:22 }}>
              <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ fontSize:13, fontWeight:600 }}>Sample Trade Log</div>
                <div style={{ fontSize:11, color:C.textDim, fontFamily:"monospace" }}>50 of {ov.trades} trades shown · all times ET</div>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, fontFamily:"monospace" }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                      {["#","Date","Time ET","Trigger","Dir","Entry","Stop","Target","Exit","P&L","Hold","Result"].map(h => (
                        <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:9, color:C.textDim, letterSpacing:"0.08em", fontWeight:600, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {btData.trades.map((tr, i) => {
                      const isWin  = tr.win;
                      const isLong = tr.dir === "LONG";
                      const rowBg  = i % 2 === 0 ? "transparent" : C.bg+"66";
                      const tierColor = tr.trigger==="AAA+" ? C.accent : tr.trigger==="AAA" ? C.long : tr.trigger==="AA" ? C.textMid : C.textDim;
                      return (
                        <tr key={i} style={{ background:rowBg, borderBottom:`1px solid ${C.border}22` }}>
                          <td style={{ padding:"8px 10px", color:C.textDim }}>{tr.n}</td>
                          <td style={{ padding:"8px 10px", color:C.text, whiteSpace:"nowrap" }}>{tr.date}</td>
                          <td style={{ padding:"8px 10px", color:C.textMid, whiteSpace:"nowrap" }}>{tr.time}</td>
                          <td style={{ padding:"8px 10px" }}>
                            <span style={{ fontSize:10, fontWeight:700, color:tierColor }}>{tr.trigger}</span>
                          </td>
                          <td style={{ padding:"8px 10px" }}>
                            <span style={{ color: isLong ? C.long : C.short, fontWeight:700 }}>{tr.dir}</span>
                          </td>
                          <td style={{ padding:"8px 10px", color:C.text }}>{tr.entry.toLocaleString()}</td>
                          <td style={{ padding:"8px 10px", color:C.short }}>{tr.stop.toLocaleString()}</td>
                          <td style={{ padding:"8px 10px", color:C.long }}>{tr.tp.toLocaleString()}</td>
                          <td style={{ padding:"8px 10px", color: isWin ? C.long : C.short, fontWeight:600 }}>{tr.exit.toLocaleString()}</td>
                          <td style={{ padding:"8px 10px", color: isWin ? C.long : C.short, fontWeight:700 }}>
                            {isWin ? "+" : ""}${Math.abs(tr.pnl).toLocaleString()}
                          </td>
                          <td style={{ padding:"8px 10px", color:C.textMid }}>{tr.duration}m</td>
                          <td style={{ padding:"8px 10px" }}>
                            <span style={{ fontSize:9, padding:"2px 6px", borderRadius:3, fontWeight:600,
                              background: tr.reason==="TP" ? C.long+"22" : C.short+"22",
                              color:      tr.reason==="TP" ? C.long      : C.short,
                            }}>{tr.reason}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}44`, borderRadius:10, padding:"16px 20px" }}>
              <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.06em", marginBottom:6 }}>IMPORTANT DISCLOSURE</div>
              <p style={{ fontSize:12, color:C.textMid, margin:0, lineHeight:1.7 }}>
                Hypothetical results based on walk-forward backtesting on historical data. Past performance is not indicative of future results. All trading involves risk of loss.
              </p>
              <p style={{ fontSize:11, color:C.textDim, margin:"8px 0 0", lineHeight:1.6 }}>
                Results shown are hypothetical, based on {btData.period} of historical 5-min data on {btData.name}.
                5:1 R:R · Hybrid stop (cycle invalidation or ATR×1.2, whichever triggers first).
                Win rate, profit factor, and P&L figures do not account for slippage, commissions, or execution differences.
                For educational purposes only. Not financial advice.
              </p>
            </div>

          </div>
          );
        })()}

        {activeTab==="history" && (
          <div style={{ padding:22, maxWidth:860 }}>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>Signal History</h2>
              <p style={{ color:C.textMid, fontSize:13 }}>Live forward track record — every signal logged from entry to exit in real time.</p>
            </div>

            {/* Stats bar */}
            {histStats && histStats.total_signals > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(130px,1fr))", gap:10, marginBottom:20 }}>
                {[
                  { label:"SIGNALS",    value: histStats.total_signals,             color: C.text },
                  { label:"WIN RATE",   value: `${histStats.win_rate}%`,             color: histStats.win_rate >= 55 ? C.long : C.warn },
                  { label:"AVG P&L",    value: `$${Math.abs(histStats.avg_pnl_usd).toLocaleString()}`, color: histStats.avg_pnl_usd >= 0 ? C.long : C.short },
                  { label:"TOTAL P&L",  value: `${histStats.total_pnl_usd >= 0 ? "+" : ""}$${histStats.total_pnl_usd.toLocaleString()}`, color: histStats.total_pnl_usd >= 0 ? C.long : C.short },
                  { label:"AVG HOLD",   value: `${histStats.avg_duration_min}m`,     color: C.accent },
                ].map(s => (
                  <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:6 }}>{s.label}</div>
                    <div style={{ fontSize:18, fontWeight:700, color:s.color, fontFamily:"monospace" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* History list */}
            {history.length === 0 ? (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:40, textAlign:"center" }}>
                <div style={{ fontSize:28, marginBottom:12 }}>◷</div>
                <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>No history yet</div>
                <div style={{ fontSize:12, color:C.textMid }}>Signal entries and exits will appear here as the engine runs. Check back in a few hours.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {history.map((entry, i) => {
                  const isClosed = entry.status === "CLOSED";
                  const isWin    = entry.winner === true;
                  const isLong   = entry.direction === "LONG";
                  const dirColor = isLong ? C.long : C.short;
                  const pnlColor = isWin ? C.long : entry.winner === false ? C.short : C.textMid;
                  return (
                    <div key={entry.id || i} style={{ background:C.surface, border:`1px solid ${isClosed ? (isWin ? C.long+"22" : C.short+"22") : dirColor+"33"}`, borderRadius:10, padding:"14px 18px", display:"flex", flexWrap:"wrap", gap:12, alignItems:"center", justifyContent:"space-between" }}>
                      {/* Left: instrument + direction + status */}
                      <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:140 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background: isClosed ? (isWin ? C.long : C.short) : dirColor, flexShrink:0 }} />
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:14, fontWeight:700, color:dirColor, fontFamily:"monospace" }}>{entry.direction}</span>
                            <span style={{ fontSize:14, fontWeight:700, fontFamily:"monospace" }}>{entry.symbol}</span>
                            <span style={{ fontSize:9, color:C.textDim, background:C.border, padding:"1px 5px", borderRadius:3, fontFamily:"monospace" }}>{isClosed ? "CLOSED" : "ACTIVE"}</span>
                          </div>
                          <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginTop:2 }}>{entry.entry_time}{entry.exit_time ? ` → ${entry.exit_time}` : " → now"}</div>
                        </div>
                      </div>

                      {/* Middle: entry → exit prices */}
                      <div style={{ fontFamily:"monospace", fontSize:12 }}>
                        <span style={{ color:C.textMid }}>Entry </span>
                        <span style={{ color:C.text, fontWeight:600 }}>{entry.entry_price?.toLocaleString()}</span>
                        {entry.exit_price && <>
                          <span style={{ color:C.textDim }}> → </span>
                          <span style={{ color:C.text, fontWeight:600 }}>{entry.exit_price?.toLocaleString()}</span>
                        </>}
                      </div>

                      {/* Right: P&L + conditions + duration */}
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ textAlign:"right" }}>
                          {isClosed && entry.pnl_usd !== null ? (
                            <div style={{ fontSize:15, fontWeight:700, color:pnlColor, fontFamily:"monospace" }}>
                              {entry.pnl_usd >= 0 ? "+" : ""}${entry.pnl_usd.toLocaleString()}
                            </div>
                          ) : (
                            <div style={{ fontSize:11, color:C.accent, fontFamily:"monospace" }}>● LIVE</div>
                          )}
                          <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginTop:2 }}>
                            {entry.conditions_met}/5 · {entry.strength}
                            {isClosed && entry.duration_min > 0 ? ` · ${entry.duration_min}m` : ""}
                          </div>
                        </div>
                        {isClosed && entry.exit_reason && (
                          <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", background:C.bg, padding:"2px 7px", borderRadius:3, maxWidth:110, textAlign:"center", lineHeight:1.4 }}>
                            {entry.exit_reason}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop:16, fontSize:11, color:C.textDim, fontFamily:"monospace", textAlign:"center" }}>
              Live forward track record · Updates every 5 minutes · Not financial advice
            </div>
          </div>
        )}

        {activeTab==="config" && (
          <div style={{ padding:22, maxWidth:660 }}>
            <h2 style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>{t.configuration}</h2>
            <p style={{ color:C.textMid, fontSize:13, marginBottom:22 }}>{t.configSub}</p>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:14 }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>{t.timeframe}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button className="tab-btn" style={{ padding:"7px 16px", borderRadius:6, fontSize:12, fontFamily:"monospace", background:C.accentDim, color:C.accent, border:`1px solid ${C.accent+"44"}` }}>5m</button>
              </div>
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:14 }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>{t.vwapSettings}</div>
              <div style={{ fontSize:12, color:C.textMid, marginBottom:14 }}>{t.vwapSettingsSub}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {VWAP_RULES.map(rule => (
                  <div key={rule.id} onClick={() => setVwapRule(rule.id)} style={{ padding:"12px 14px", borderRadius:8, cursor:"pointer", background:vwapRule===rule.id?C.accentDim:C.bg, border:`1px solid ${vwapRule===rule.id?C.accent+"44":C.border}`, display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${vwapRule===rule.id?C.accent:C.border}`, background:vwapRule===rule.id?C.accent:"transparent", flexShrink:0 }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:vwapRule===rule.id?C.accent:C.text }}>{rule.label}</div>
                      <div style={{ fontSize:11, color:C.textMid, marginTop:2 }}>{rule.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:14 }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>{t.exitMode}</div>
              <div style={{ fontSize:12, color:C.textMid, marginBottom:16, lineHeight:1.6 }}>{t.exitModeQ}</div>
              <div style={{ padding:14, borderRadius:8, background:C.accentDim, border:`1px solid ${C.accent}44` }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.accent, marginBottom:6 }}>{t.exitRule}</div>
                <div style={{ fontSize:11, color:C.textMid, lineHeight:1.6 }}>{t.exitRuleDesc}</div>
              </div>
            </div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>{t.cycleSettings}</div>
              <div style={{ fontSize:12, color:C.textMid, marginBottom:16 }}>{t.cycleSub}</div>
              {Object.entries(cycleConfig).map(([key,cyc]) => (
                <div key={key} style={{ padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <div>
                      <span style={{ fontWeight:600, fontSize:14 }}>{cyc.label}</span>
                      <span style={{ fontSize:11, color:C.textMid, marginLeft:8, fontFamily:"monospace" }}>{cyc.every}</span>
                    </div>
                    <div onClick={() => setCycleConfig(prev=>({...prev,[key]:{...prev[key],enabled:!prev[key].enabled}}))}
                      style={{ width:40, height:22, borderRadius:11, background:cyc.enabled?C.accent:C.border, position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
                      <div style={{ position:"absolute", top:3, left:cyc.enabled?21:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, color:C.textMid, fontFamily:"monospace" }}>{cyc.every}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==="pnl"  && <PositionTracker />}

        {activeTab==="prop" && <PropCalc t={t} />}

        {activeTab==="admin" && isAdmin && (() => {
          const active    = signals.filter(s => s.status === "ACTIVE").length;
          const cancelled = signals.filter(s => s.status === "CANCELLED").length;
          const wins      = history.filter(s => s.winner === true).length;
          const winRate   = history.length > 0 ? Math.round((wins / history.length) * 100) : null;
          const totalPnl  = history.reduce((acc, s) => acc + (s.pnl_usd || 0), 0);
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
                  { label:"CANCELLED",       value: cancelled, color: C.warn },
                  { label:"HISTORY RECORDS", value: history.length, color: C.accent },
                  { label:"LIVE WIN RATE",   value: winRate !== null ? `${winRate}%` : "—", color: winRate >= 60 ? C.long : winRate !== null && winRate < 50 ? C.short : C.warn },
                  { label:"LIVE TOTAL P&L",  value: history.length > 0 ? `${totalPnl >= 0 ? "+" : ""}$${totalPnl.toLocaleString()}` : "—", color: totalPnl >= 0 ? C.long : C.short },
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

              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>QC CHECKLIST</div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:28 }}>
                {[
                  ["Gist signals URL configured", !!SIGNALS_URL],
                  ["Gist history URL configured",  !!HISTORY_URL],
                  ["Signal history populated",     history.length > 0],
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
                  { label:"History Gist",     url: HISTORY_URL },
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

function StandaloneCalc({ onNavigate, t }) {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!email || !email.includes("@")) { setError("Please enter a valid email."); return; }
    setSubmitting(true);
    try {
      await fetch("https://formspree.io/f/mbdaqgye", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          email,
          _subject: "🔢 Signal Boss Calculator Access Request",
          source: "Risk Calculator Gate",
        }),
      });
    } catch(e) { /* silent fail */ }
    setSubmitted(true); setError(""); setSubmitting(false);
  };
  return (
    <div style={{ minHeight:"100vh", background:C.bg, padding:"100px 24px 40px" }}>
      <div style={{ maxWidth:860, margin:"0 auto" }}>
        <div style={{ marginBottom:32 }}>
          <div onClick={() => onNavigate("landing")} style={{ fontSize:11, color:C.textMid, cursor:"pointer", marginBottom:16, fontFamily:"monospace" }}>← Back to Signal Boss</div>
          <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.02em", marginBottom:8 }}>Account Risk Calculator</h1>
          <p style={{ color:C.textMid, fontSize:14 }}>Free tool. No subscription required. Know your real risk before you trade.</p>
        </div>
        {!submitted ? (
          <div style={{ maxWidth:480, background:C.surface, border:`1px solid ${C.prop}44`, borderRadius:14, padding:32, marginBottom:40 }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.prop, marginBottom:8 }}>⬡ Free Access</div>
            <p style={{ fontSize:13, color:C.textMid, lineHeight:1.6, marginBottom:20 }}>
              Enter your email to unlock the full calculator. We'll also send you a free guide on prop firm risk management.
            </p>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="your@email.com" onKeyDown={e => e.key==="Enter" && handleSubmit()}
              style={{ width:"100%", boxSizing:"border-box", padding:"12px 16px", background:C.bg, border:`1px solid ${error?C.short:C.border}`, borderRadius:7, color:C.text, fontSize:14, fontFamily:"monospace", outline:"none", marginBottom:10, display:"block" }} />
            <button onClick={handleSubmit} disabled={submitting} style={{ width:"100%", padding:"12px", background:C.prop, color:"#fff", border:"none", borderRadius:7, fontWeight:700, fontSize:14, cursor:"pointer", opacity:submitting?0.7:1 }}>
              {submitting ? "Unlocking..." : "Get Access →"}
            </button>
            {error && <div style={{ fontSize:12, color:C.short, marginTop:10, fontFamily:"monospace" }}>{error}</div>}
            <div style={{ fontSize:11, color:C.textDim, marginTop:12, textAlign:"center" }}>No spam. Unsubscribe anytime.</div>
          </div>
        ) : (
          <div style={{ maxWidth:440, background:C.surface, border:`1px solid ${C.long}33`, borderRadius:14, padding:22, marginBottom:32, display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:22 }}>✓</span>
            <div>
              <div style={{ fontWeight:600, color:C.long, marginBottom:4 }}>You're in!</div>
              <div style={{ fontSize:13, color:C.textMid }}>Check {email} for your free risk management guide.</div>
            </div>
          </div>
        )}
        <div style={{ position:"relative" }}>
          {!submitted && (
            <div style={{ position:"absolute", inset:0, backdropFilter:"blur(6px)", background:"#08090966", zIndex:10, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ textAlign:"center", color:C.textMid, fontFamily:"monospace", fontSize:13 }}>
                <div style={{ fontSize:28, marginBottom:10 }}>🔒</div>
                Enter your email above to unlock
              </div>
            </div>
          )}
          <PropCalc t={t} />
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
          <h3 style={{ fontSize:16, fontWeight:600, marginBottom:12, letterSpacing:"-0.01em", color:C.textMid }}>EUR/USD · GBP/USD · Crosses</h3>
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
      const res = await fetch("https://formspree.io/f/mbdaqgye", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          name, email, subject: subject || "(no subject)",
          message,
          _subject: `📬 Signal Boss Contact: ${subject || message.slice(0,50)}`,
        }),
      });
      if (res.ok) { setSubmitted(true); }
      else { setError("Something went wrong. Please try again or email info@signalboss.net directly."); }
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
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      {mode === "sign-in"
        ? <SignIn afterSignInUrl="/" signUpUrl="#" signUpForceRedirectUrl="/"
            appearance={{ elements: { footerAction: { display:"none" } } }} />
        : <SignUp afterSignUpUrl="/" signInUrl="#" signInForceRedirectUrl="/"
            initialValues={initialEmail ? { emailAddress: initialEmail } : undefined}
            appearance={{ elements: { footerAction: { display:"none" } } }} />
      }
      <div style={{ position:"absolute", bottom:32, fontSize:13, color:C.textMid }}>
        {mode === "sign-in"
          ? <span>No account? <span onClick={() => onNavigate("signup")} style={{ color:C.accent, cursor:"pointer" }}>Start free trial →</span></span>
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
          userId: user.id,
          email:  user.primaryEmailAddress?.emailAddress || "",
          plan:   selectedPlan,
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
        setPage(isSubscribed ? "dashboard" : "subscribe");
      }
    }
    // Session expired or signed out while on dashboard
    if (!isSignedIn && page === "dashboard") {
      setPage("landing");
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
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 32px", borderBottom:`1px solid ${C.border}44`, backdropFilter:"blur(16px)", background:"#08090988" }}>
          <div onClick={() => { setPage("landing"); setTrack(null); }} style={{ fontWeight:800, fontSize:20, cursor:"pointer", fontFamily:"monospace", color:"#ffffff", letterSpacing:"0.04em" }}>
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
            {page === "landing" && (
              <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                <a style={{ fontSize:13, color:C.textMid, textDecoration:"none", fontFamily:"monospace", cursor:"pointer" }} onClick={e=>{e.preventDefault();document.getElementById("how-it-works")?.scrollIntoView({behavior:"smooth"})}}>The Edge</a>
                <span style={{ color:C.border }}>·</span>
                <a style={{ fontSize:13, color:C.textMid, textDecoration:"none", fontFamily:"monospace", cursor:"pointer" }} onClick={e=>{e.preventDefault();document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})}}>Pricing</a>
                <span style={{ color:C.border }}>·</span>
                <a style={{ fontSize:13, color:C.textMid, textDecoration:"none", fontFamily:"monospace", cursor:"pointer" }} onClick={e=>{e.preventDefault();setPage("contact")}}>Contact</a>
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <LangSwitcher lang={lang} setLang={setLang} />
            {isSignedIn ? (
              <>
                <button onClick={() => setPage(isSubscribed ? "dashboard" : "subscribe")}
                  style={{ padding:"8px 20px", background:C.accent, border:"none", borderRadius:6, color:"#080909", cursor:"pointer", fontWeight:700, fontSize:13 }}>
                  {isSubscribed ? "Dashboard →" : "Activate →"}
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
          isSubscribed
            ? <Dashboard user={clerkUser} onNavigate={setPage} t={t} lang={lang} setLang={setLang} track={track} />
            : <SubscribePage user={clerkUser} plan={activePlan} onNavigate={setPage} t={t} track={track} />
        )}
        {page==="forex-demo"   && <ForexDemo onNavigate={setPage} t={t} />}
        {page==="futures-demo" && <Dashboard user={clerkUser} onNavigate={setPage} t={t} lang={lang} setLang={setLang} />}
      </div>
    </>
  );
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
