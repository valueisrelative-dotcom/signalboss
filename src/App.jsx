import { useState, useEffect, useRef, useCallback } from "react";
import {
  ClerkProvider, SignIn, SignUp,
  useUser, useAuth, UserButton,
  SignedIn, SignedOut,
} from "@clerk/clerk-react";

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
    whyBuilt: "WHY WE BUILT SIGNAL BOSS",
    whyP1: "98% of traders lose money. Nearly 100% of them use charts to make decisions.",
    whyP2: "Think about that for a second. That's like joining a gym where 99% of members follow a workout plan that makes people weaker and fatter. Does that seem logical?",
    whyP3a: "Charts tell you what already happened. Signal Boss tells you when ", whyP3b: "conditions are right", whyP3c: " — and there's a difference that matters enormously.",
    whyP4: "Entry is only 20% of the equation. An essential 20%, yes — but still just 20%. The other 80% is risk management, position sizing, and smart profit-taking. Most signal services hand you an entry and walk away. That's not a system. That's half a sentence.",
    whyP5a: "Every Signal Boss alert includes three things: ", whyP5b: "Entry Price. Smart Stop. Smart Take Profit.", whyP5c: " Where to get in. Where to cut losses. Where to start taking profits. That's the whole trade — not just the beginning of one.",
    whyP6: "We built this because the right conditions, sized correctly, with defined risk, is what trading actually is. Everything else is noise.",
    teamName: "The Signal Boss Team", teamSub: "Built by traders, for traders",
    calcLabel: "FOR EVERY SERIOUS TRADER",
    calcTitle: "Know Your Numbers Before You Place a Trade",
    calcP1a: "A \"$50,000 funded account\" gives you roughly ", calcP1b: "$2,500–$3,000 before you breach drawdown and lose the account.", calcP1c: " That's your true trading capital — whether it's a prop challenge or your own money.",
    calcP2: "The Account Risk Calculator covers futures and forex, prop challenge or personal account. Position sizing, loss to ruin, daily limits — know your worst case before the market shows it to you.",
    calcCta: "Try the Calculator Free →",
    calcFeatures: [
      ["Position Sizing",   "Size correctly for your true trading capital"],
      ["Trades to Ruin",    "Know your worst-case scenario upfront"],
      ["Days to Goal",      "Project how long reaching your profit target takes"],
      ["Daily Loss Limits", "Never accidentally breach a daily loss rule"],
    ],
    exploreFuturesLabel: "EXPLORE FUTURES", exploreForexLabel: "EXPLORE FOREX",
    futuresDesc: "ES, NQ, CL, /6E, /6B, /6J and all major futures contracts. Direct IV inflection signals on the exchange-traded instruments where institutional positioning is most transparent.",
    futuresFeatures: ["ES · NQ · CL · RTY · ZB", "/6E · /6B · /6J · /6S · /6A · /6C", "Account Risk Calculator included", "Smart Stop & Take Profit on every signal"],
    forexLabel: "FOREX TRADERS", forexHeadline: "Trade the intelligence.",
    forexDesc: "EUR/USD, GBP/USD, USD/JPY and all major pairs including crosses. Same IV signal intelligence derived from currency futures — where price discovery actually begins.",
    forexFeatures: ["EUR/USD · GBP/USD · USD/JPY · USD/CHF", "EUR/JPY · EUR/GBP · EUR/CHF + more", "Account Risk Calculator included", "Smart Stop & Take Profit on every signal"],
    trialNote: "No commitment · Cancel anytime",
    exploreFutures: "Explore Futures →", exploreForex: "Explore Forex →",
    forexTagline: "Forex Signal Intelligence · Live",
    forexHeroTitle1: "No charts. No noise.", forexHeroTitle2: "The Inflection Point.",
    forexHeroSub: "Currency futures are where institutions show their hand. Signal Boss reads IV inflection points on /6E, /6B, /6J and more — giving forex traders institutional-grade intelligence on every major pair and cross.",
    methodologyLabel: "THE METHODOLOGY",
    methodologyTitle: "The market tells you where price is going.",
    methodologyAccent: "We just listen.",
    methodologyQuote: "Not just when to enter. Where to stop. When to take profit. All from the same source — what the market is actually implying about its own expected range.",
    methodology: [
      { icon:"◈", color:"long",  label:"Implied Volatility", title:"The Market's Own Forecast", body:"IV isn't noise — it's the market's consensus estimate of expected movement. When short-term IV reaches an inflection point on a close, the market is telling you something has changed. That's your signal." },
      { icon:"◎", color:"accent", label:"VWAP",             title:"Where Institutions Operate", body:"Every institutional desk benchmarks execution against VWAP. Price above VWAP means buyers are in control at institutional prices. Below means sellers. Simple. Powerful. Proven." },
      { icon:"◉", color:"prop",   label:"Mean Reversion",   title:"IV Always Comes Back", body:"Implied volatility mean reverts. Always. When IV reaches extremes, the question isn't if price will revert — it's when. That timing is where the edge lives, and where Smart Stop and Target levels are derived." },
    ],
    startTrial: "Get Access", viewDemo: "See Signals Fire →",
    exampleSignal: "EXAMPLE SIGNAL", howItWorks: "How Signal Boss works",
    pricing: "Pricing", pricingNote: "No commitment. Cancel anytime.",
    getStarted: "Get Started", signIn: "Sign In", signUp: "Sign Up",
    signInTitle: "Sign in", signUpTitle: "Create account",
    signInSub: "Welcome back to Signal Boss", signUpSub: "Get access to live signals",
    fullName: "FULL NAME", email: "EMAIL", password: "PASSWORD", plan: "PLAN",
    createAccount: "Create Account", noAccount: "No account? ", haveAccount: "Have an account? ",
    engineActive: "ENGINE ACTIVE", active: "ACTIVE",
    liveSignals: "Live Signals", signalHistory: "History", configuration: "Configuration",
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
      { name: "Starter", price: 149, features: ["ES · NQ · RTY · YM · CL · GC · SI", "All 3 cycles", "Real-time dashboard", "Email alerts", "Account Risk Calculator"] },
      { name: "Pro",     price: 249, features: ["Everything in Starter", "NG · RB · HG · ZB · ZN · ZT · ZF", "/6E · /6B · /6J · /6S · /6A · /6C", "ZS · ZW · ZC", "Telegram alerts · Webhook"] },
      { name: "Elite",   price: 449, features: ["Everything in Pro", "Smart Stop & Target on every signal", "Priority support"] },
    ],
    forexPlans: [
      { name: "Major Pairs", price: 129, features: ["EUR/USD · GBP/USD · USD/JPY · USD/CHF", "Direct futures correlation", "All 3 cycles", "Real-time dashboard", "Email alerts", "Account Risk Calculator"] },
      { name: "Full Coverage", price: 249, features: ["Everything in Major Pairs", "EUR/JPY · EUR/GBP · EUR/CHF", "Up to 15 pairs total", "Cross pair signals (dual futures ref.)", "Telegram alerts · Webhook"] },
    ],
  },
  es: {
    tagline: "Motor de Señales Multi-Ciclo · En Vivo",
    heroTitle1: "Sin gráficos. Sin ruido.", heroTitle2: "El Punto de Inflexión.",
    heroSub: "Solo lo que importa — señales de inflexión IV basadas en confluencia multi-ciclo y confirmación VWAP.",
    engineTagline: "Motor de Señales Institucional · En Vivo",
    chooserTitle1: "Sin gráficos. Sin ruido.", chooserTitle2: "Solo lo que importa...", chooserTitle3: "El Punto de Inflexión.",
    chooserSub: "La volatilidad lidera. El precio sigue. Signal Boss lee el estado en que realmente se encuentra el mercado — para que tus decisiones se basen en lo que realmente lo mueve.",
    whyBuilt: "POR QUÉ CONSTRUIMOS SIGNAL BOSS",
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
    futuresDesc: "ES, NQ, CL, /6E, /6B, /6J y todos los principales contratos de futuros. Señales directas de inflexión IV en los instrumentos cotizados donde el posicionamiento institucional es más transparente.",
    futuresFeatures: ["ES · NQ · CL · RTY · ZB", "/6E · /6B · /6J · /6S · /6A · /6C", "Calculadora de Riesgo incluida", "Stop Inteligente y Toma de Ganancias en cada señal"],
    forexLabel: "TRADERS DE FOREX", forexHeadline: "Opera con la inteligencia.",
    forexDesc: "EUR/USD, GBP/USD, USD/JPY y todos los pares principales incluidos los cruces. La misma inteligencia de señal IV derivada de futuros de divisas — donde comienza realmente el descubrimiento de precios.",
    forexFeatures: ["EUR/USD · GBP/USD · USD/JPY · USD/CHF", "EUR/JPY · EUR/GBP · EUR/CHF + más", "Calculadora de Riesgo incluida", "Stop Inteligente y Toma de Ganancias en cada señal"],
    trialNote: "14 días gratis · Sin tarjeta de crédito · Cancela cuando quieras",
    exploreFutures: "Explorar Futuros →", exploreForex: "Explorar Forex →",
    forexHeroTitle1: "Sin gráficos. Sin ruido.", forexHeroTitle2: "El Punto de Inflexión.",
    forexHeroSub: "Los futuros de divisas son donde las instituciones muestran su mano. Signal Boss lee los puntos de inflexión IV en /6E, /6B, /6J y más — dando a los traders de forex inteligencia institucional en cada par y cruce principal.",
    methodologyLabel: "LA METODOLOGÍA",
    methodologyTitle: "El mercado te dice hacia dónde va el precio.",
    methodologyAccent: "Nosotros solo escuchamos.",
    methodologyQuote: "No solo cuándo entrar. Dónde hacer stop. Cuándo tomar ganancias. Todo de la misma fuente — lo que el mercado está implicando sobre su propio rango esperado.",
    methodology: [
      { icon:"◈", color:"long",  label:"Volatilidad Implícita", title:"El Pronóstico del Propio Mercado", body:"La VI no es ruido — es la estimación de consenso del mercado sobre el movimiento esperado. Cuando la VI a corto plazo alcanza un punto de inflexión en un cierre, el mercado te dice que algo ha cambiado." },
      { icon:"◎", color:"accent", label:"VWAP",                 title:"Donde Operan las Instituciones", body:"Todo escritorio institucional compara su ejecución contra el VWAP. Precio sobre VWAP significa compradores en control. Debajo, vendedores. Simple. Poderoso. Probado." },
      { icon:"◉", color:"prop",   label:"Reversión a la Media",  title:"La VI Siempre Regresa", body:"La volatilidad implícita revierte a la media. Siempre. Cuando la VI llega a extremos, la pregunta no es si el precio revertirá — es cuándo. Ahí vive la ventaja." },
    ],
    startTrial: "Prueba Gratuita", viewDemo: "Ver Señales en Vivo →",
    exampleSignal: "SEÑAL DE EJEMPLO", howItWorks: "Cómo funciona Signal Boss",
    pricing: "Precios", pricingNote: "14 días gratis. Sin tarjeta de crédito.",
    getStarted: "Comenzar", signIn: "Iniciar Sesión", signUp: "Registrarse",
    signInTitle: "Iniciar sesión", signUpTitle: "Crear cuenta",
    signInSub: "Bienvenido de vuelta", signUpSub: "14 días gratis",
    fullName: "NOMBRE COMPLETO", email: "CORREO", password: "CONTRASEÑA", plan: "PLAN",
    createAccount: "Crear Cuenta", noAccount: "¿Sin cuenta? ", haveAccount: "¿Ya tienes? ",
    engineActive: "MOTOR ACTIVO", active: "ACTIVO",
    liveSignals: "Señales en Vivo", signalHistory: "Historial", configuration: "Configuración",
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
      { name: "Inicial",       price: 149, features: ["ES · NQ · RTY · YM · CL · GC · SI", "3 ciclos completos", "Panel en tiempo real", "Alertas email", "Calculadora de Riesgo"] },
      { name: "Pro",           price: 249, features: ["Todo en Inicial", "NG · RB · HG · ZB · ZN · ZT · ZF", "/6E · /6B · /6J · /6S · /6A · /6C", "ZS · ZW · ZC", "Telegram · Webhook"] },
      { name: "Elite",         price: 449, features: ["Todo en Pro", "Stop & Target Inteligentes", "Soporte prioritario"] },
    ],
    forexPlans: [
      { name: "Pares Principales", price: 129, features: ["EUR/USD · GBP/USD · USD/JPY · USD/CHF", "Correlación directa con futuros", "3 ciclos", "Panel en tiempo real", "Email", "Calculadora de Riesgo"] },
      { name: "Cobertura Total",   price: 249, features: ["Todo en Principales", "EUR/JPY · EUR/GBP · EUR/CHF", "Hasta 15 pares", "Señales de cruces (ref. doble)", "Telegram · Webhook"] },
    ],
  },
  pt: {
    tagline: "Motor de Sinais Multi-Ciclo · Ao Vivo",
    heroTitle1: "Sem gráficos. Sem ruído.", heroTitle2: "O Ponto de Inflexão.",
    heroSub: "Só o que importa — sinais de inflexão IV baseados em confluência multi-ciclo e confirmação VWAP.",
    engineTagline: "Motor de Sinais Institucional · Ao Vivo",
    chooserTitle1: "Sem gráficos. Sem ruído.", chooserTitle2: "Só o que importa...", chooserTitle3: "O Ponto de Inflexão.",
    chooserSub: "A volatilidade lidera. O preço segue. Signal Boss lê o estado em que o mercado realmente se encontra — para que suas decisões sejam baseadas no que realmente o move.",
    whyBuilt: "POR QUE CONSTRUÍMOS O SIGNAL BOSS",
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
    futuresDesc: "ES, NQ, CL, /6E, /6B, /6J e todos os principais contratos futuros. Sinais diretos de inflexão IV nos instrumentos negociados em bolsa onde o posicionamento institucional é mais transparente.",
    futuresFeatures: ["ES · NQ · CL · RTY · ZB", "/6E · /6B · /6J · /6S · /6A · /6C", "Calculadora de Risco incluída", "Stop Inteligente e Take Profit em cada sinal"],
    forexLabel: "TRADERS DE FOREX", forexHeadline: "Opere com a inteligência.",
    forexDesc: "EUR/USD, GBP/USD, USD/JPY e todos os pares principais incluindo cruzamentos. A mesma inteligência de sinal IV derivada de futuros de moedas — onde a descoberta de preços realmente começa.",
    forexFeatures: ["EUR/USD · GBP/USD · USD/JPY · USD/CHF", "EUR/JPY · EUR/GBP · EUR/CHF + mais", "Calculadora de Risco incluída", "Stop Inteligente e Take Profit em cada sinal"],
    trialNote: "14 dias grátis · Sem cartão · Cancele quando quiser",
    exploreFutures: "Explorar Futuros →", exploreForex: "Explorar Forex →",
    forexHeroTitle1: "Sem gráficos. Sem ruído.", forexHeroTitle2: "O Ponto de Inflexão.",
    forexHeroSub: "Futuros de moedas são onde as instituições mostram suas cartas. Signal Boss lê pontos de inflexão de VI em /6E, /6B, /6J e mais — dando aos traders forex inteligência institucional em todos os pares e cruzamentos principais.",
    methodologyLabel: "A METODOLOGIA",
    methodologyTitle: "O mercado diz para onde o preço vai.",
    methodologyAccent: "Nós apenas ouvimos.",
    methodologyQuote: "Não apenas quando entrar. Onde parar. Quando realizar lucros. Tudo da mesma fonte — o que o mercado está implicando sobre seu próprio intervalo esperado.",
    methodology: [
      { icon:"◈", color:"long",  label:"Volatilidade Implícita", title:"A Previsão do Próprio Mercado", body:"VI não é ruído — é a estimativa de consenso do mercado sobre o movimento esperado. Quando a VI de curto prazo atinge um ponto de inflexão no fechamento, o mercado diz que algo mudou." },
      { icon:"◎", color:"accent", label:"VWAP",                  title:"Onde as Instituições Operam", body:"Toda mesa institucional compara sua execução com o VWAP. Preço acima do VWAP significa compradores no controle. Abaixo, vendedores. Simples. Poderoso. Comprovado." },
      { icon:"◉", color:"prop",   label:"Reversão à Média",       title:"A VI Sempre Volta", body:"A volatilidade implícita reverte à média. Sempre. Quando a VI atinge extremos, a questão não é se o preço vai reverter — é quando. Aí está a vantagem." },
    ],
    startTrial: "Teste Grátis", viewDemo: "Ver Sinais ao Vivo →",
    exampleSignal: "SINAL DE EXEMPLO", howItWorks: "Como o Signal Boss funciona",
    pricing: "Preços", pricingNote: "14 dias grátis. Sem cartão.",
    getStarted: "Começar", signIn: "Entrar", signUp: "Cadastrar",
    signInTitle: "Entrar", signUpTitle: "Criar conta",
    signInSub: "Bem-vindo de volta", signUpSub: "14 dias grátis",
    fullName: "NOME COMPLETO", email: "EMAIL", password: "SENHA", plan: "PLANO",
    createAccount: "Criar Conta", noAccount: "Sem conta? ", haveAccount: "Já tem? ",
    engineActive: "MOTOR ATIVO", active: "ATIVO",
    liveSignals: "Sinais ao Vivo", signalHistory: "Histórico", configuration: "Configuração",
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
      { name: "Inicial",        price: 149, features: ["ES · NQ · RTY · YM · CL · GC · SI", "3 ciclos completos", "Painel em tempo real", "Alertas email", "Calculadora de Risco"] },
      { name: "Pro",            price: 249, features: ["Tudo no Inicial", "NG · RB · HG · ZB · ZN · ZT · ZF", "/6E · /6B · /6J · /6S · /6A · /6C", "ZS · ZW · ZC", "Telegram · Webhook"] },
      { name: "Elite",          price: 449, features: ["Tudo no Pro", "Stop & Target Inteligentes", "Suporte prioritário"] },
    ],
    forexPlans: [
      { name: "Pares Principais", price: 129, features: ["EUR/USD · GBP/USD · USD/JPY · USD/CHF", "Correlação direta com futuros", "3 ciclos", "Painel em tempo real", "Email", "Calculadora de Risco"] },
      { name: "Cobertura Total",  price: 249, features: ["Tudo nos Principais", "EUR/JPY · EUR/GBP · EUR/CHF", "Até 15 pares", "Sinais cruzados (ref. dupla)", "Telegram · Webhook"] },
    ],
  },
  fr: {
    tagline: "Moteur de Signaux Multi-Cycles · En Direct",
    heroTitle1: "Pas de graphiques. Pas de bruit.", heroTitle2: "Le Point d'Inflexion.",
    heroSub: "Juste ce qui compte — signaux d'inflexion IV basés sur la confluence multi-cycles et la confirmation VWAP.",
    engineTagline: "Moteur de Signaux Institutionnel · En Direct",
    chooserTitle1: "Pas de graphiques. Pas de bruit.", chooserTitle2: "Juste ce qui compte...", chooserTitle3: "Le Point d'Inflexion.",
    chooserSub: "La volatilité mène. Le prix suit. Signal Boss lit l'état dans lequel le marché se trouve réellement — pour que vos décisions soient fondées sur ce qui le fait vraiment bouger.",
    whyBuilt: "POURQUOI NOUS AVONS CRÉÉ SIGNAL BOSS",
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
    futuresDesc: "ES, NQ, CL, /6E, /6B, /6J et tous les principaux contrats futures. Signaux d'inflexion IV directs sur les instruments cotés en bourse où le positionnement institutionnel est le plus transparent.",
    futuresFeatures: ["ES · NQ · CL · RTY · ZB", "/6E · /6B · /6J · /6S · /6A · /6C", "Calculateur de Risque inclus", "Stop Intelligent et Prise de Profit sur chaque signal"],
    forexLabel: "TRADERS FOREX", forexHeadline: "Tradez avec l'intelligence.",
    forexDesc: "EUR/USD, GBP/USD, USD/JPY et toutes les paires majeures incluant les croisements. La même intelligence de signal IV dérivée des futures de devises — là où la découverte des prix commence vraiment.",
    forexFeatures: ["EUR/USD · GBP/USD · USD/JPY · USD/CHF", "EUR/JPY · EUR/GBP · EUR/CHF + plus", "Calculateur de Risque inclus", "Stop Intelligent et Prise de Profit sur chaque signal"],
    trialNote: "14 jours d'essai gratuit · Sans carte · Annulez à tout moment",
    exploreFutures: "Explorer Futures →", exploreForex: "Explorer Forex →",
    forexHeroTitle1: "Pas de graphiques. Pas de bruit.", forexHeroTitle2: "Le Point d'Inflexion.",
    forexHeroSub: "Les futures sur devises, c'est là où les institutions montrent leur jeu. Signal Boss lit les points d'inflexion de VI sur /6E, /6B, /6J et plus — offrant aux traders forex une intelligence institutionnelle sur chaque paire et croisement majeur.",
    methodologyLabel: "LA MÉTHODOLOGIE",
    methodologyTitle: "Le marché vous dit où va le prix.",
    methodologyAccent: "Nous écoutons simplement.",
    methodologyQuote: "Pas seulement quand entrer. Où stopper. Quand prendre des profits. Tout depuis la même source — ce que le marché implique sur son propre range attendu.",
    methodology: [
      { icon:"◈", color:"long",  label:"Volatilité Implicite", title:"La Prévision du Marché Lui-Même", body:"La VI n'est pas du bruit — c'est l'estimation consensus du marché sur le mouvement attendu. Quand la VI court terme atteint un point d'inflexion à la clôture, le marché vous dit que quelque chose a changé." },
      { icon:"◎", color:"accent", label:"VWAP",                title:"Là Où Opèrent les Institutions", body:"Chaque desk institutionnel compare son exécution au VWAP. Prix au-dessus du VWAP signifie acheteurs aux commandes. En-dessous, vendeurs. Simple. Puissant. Éprouvé." },
      { icon:"◉", color:"prop",   label:"Retour à la Moyenne", title:"La VI Revient Toujours", body:"La volatilité implicite revient à la moyenne. Toujours. Quand la VI atteint des extrêmes, la question n'est pas si le prix va revenir — c'est quand. C'est là que réside l'avantage." },
    ],
    startTrial: "Essai Gratuit", viewDemo: "Voir les Signaux →",
    exampleSignal: "SIGNAL EXEMPLE", howItWorks: "Comment fonctionne Signal Boss",
    pricing: "Tarifs", pricingNote: "14 jours d'essai gratuit. Aucune carte requise.",
    getStarted: "Commencer", signIn: "Connexion", signUp: "S'inscrire",
    signInTitle: "Connexion", signUpTitle: "Créer un compte",
    signInSub: "Bienvenue sur Signal Boss", signUpSub: "14 jours d'essai gratuit",
    fullName: "NOM COMPLET", email: "EMAIL", password: "MOT DE PASSE", plan: "PLAN",
    createAccount: "Créer un Compte", noAccount: "Pas de compte ? ", haveAccount: "Déjà un compte ? ",
    engineActive: "MOTEUR ACTIF", active: "ACTIF",
    liveSignals: "Signaux en Direct", signalHistory: "Historique", configuration: "Configuration",
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
      { name: "Starter",          price: 149, features: ["ES · NQ · RTY · YM · CL · GC · SI", "3 cycles complets", "Tableau de bord temps réel", "Alertes email", "Calculateur de Risque"] },
      { name: "Pro",              price: 249, features: ["Tout Starter inclus", "NG · RB · HG · ZB · ZN · ZT · ZF", "/6E · /6B · /6J · /6S · /6A · /6C", "ZS · ZW · ZC", "Telegram · Webhook"] },
      { name: "Élite",            price: 449, features: ["Tout Pro inclus", "Stop & Target Intelligents", "Support prioritaire"] },
    ],
    forexPlans: [
      { name: "Paires Majeures",  price: 129, features: ["EUR/USD · GBP/USD · USD/JPY · USD/CHF", "Corrélation directe avec les futures", "3 cycles", "Tableau de bord temps réel", "Email", "Calculateur de Risque"] },
      { name: "Couverture Totale",price: 249, features: ["Tout Paires Majeures inclus", "EUR/JPY · EUR/GBP · EUR/CHF", "Jusqu'à 15 paires", "Signaux croisés (réf. double)", "Telegram · Webhook"] },
    ],
  },
};

const C = {
  bg: "#080909", surface: "#0c0e0f", surfaceUp: "#0e1210", surfaceDn: "#120e0e",
  border: "#161a1a", borderHi: "#1f2626",
  long: "#00e5a0", longDim: "#00e5a012", longGlow: "#00e5a030",
  short: "#ff4560", shortDim: "#ff456012", shortGlow: "#ff456030",
  neutral: "#4a5568", accent: "#c8a96e", accentDim: "#c8a96e18",
  text: "#eaeeee", textMid: "#9ab0b0", textDim: "#4a5e5e",
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

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

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

const GIST_URL    = "https://gist.githubusercontent.com/raw/336ce62861f67be83d1fdbd34576f4c5/signals.json";
const LEVELS_URL  = "https://gist.githubusercontent.com/raw/336ce62861f67be83d1fdbd34576f4c5/levels.json";
const HISTORY_URL = "/history.json";              // static file in public/ — always available
const API_URL     = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:4242" : "/vps");
const MICROS    = { ES:"MES", NQ:"MNQ", YM:"MYM", RTY:"M2K", CL:"MCL", GC:"MGC" };
const ALL_INSTS = ["ES","NQ","YM","CL","GC","RTY","ZN","ZF","ZT"];
const INST_FILTER_V = 4; // bump when ALL_INSTS changes

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

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <LiveDot color={dirColor} size={7} />
          <span style={{ fontSize:17, fontWeight:700, color:dirColor }}>{signal.direction}</span>
          <span style={{ fontSize:14, fontWeight:700, color:C.text }}>· {symLine}</span>
        </div>
        <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, background:dirColor+"22", color:dirColor, letterSpacing:"0.08em" }}>ACTIVE</span>
      </div>

      <div style={{ height:1, background:C.border, marginBottom:12 }} />

      {/* Price levels */}
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

      {/* Risk */}
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

      {/* Timestamp */}
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
    ["What markets does Signal Boss cover?", "Signal Boss is designed for US equity index futures — ES (S&P 500), NQ (Nasdaq), YM (Dow), and RTY (Russell 2000). The methodology works on any liquid futures contract with reliable implied volatility data."],
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
    ["What forex pairs does Signal Boss cover?", "Signal Boss covers all major pairs derived from exchange-traded currency futures — EUR/USD (/6E), GBP/USD (/6B), USD/JPY (/6J), USD/CHF (/6S), AUD/USD (/6A), and CAD/USD (/6C). We also cover key crosses including EUR/JPY, EUR/GBP, and EUR/CHF, derived from the confluence of both underlying futures contracts."],
    ["Why use currency futures signals for spot forex trading?", "Currency futures are exchange-traded, fully transparent, and reflect institutional positioning in real time. The implied volatility data derived from futures options is a leading indicator for spot forex price movement. The directional correlation between a futures IV signal and the equivalent spot pair is approximately 99% — meaning the signal intelligence is identical whether you execute in futures or spot forex."],
    ["Does this work for FTMO, FundedNext, and other forex prop firms?", "Yes. Signal Boss includes the Account Risk Calculator covering FTMO, FundedNext, MyFundedFX, and all major forex evaluation firms. The calculator handles pip-based risk, lot sizing, leverage ratios, and daily drawdown rules — the same logic applies whether you're protecting a prop challenge or your own capital."],
    ["What's the difference between a direct pair signal and a cross pair signal?", "Direct pairs like EUR/USD are derived from a single futures contract (/6E). Cross pairs like EUR/JPY are derived from two underlying futures contracts (/6E and /6J) — both must confirm in the correct direction for a cross signal to fire. Cross signals therefore carry a higher natural confluence threshold and are shown with both futures references on the signal card."],
    ["How are pip-based stop and target levels calculated?", "Smart Stop and Smart Take Profit levels on forex signals are derived from the same IV mean-reversion methodology used for futures tick-based levels. The calculation accounts for the pip value of each specific pair, producing actionable levels you can enter directly into your broker platform."],
    ["Do I need to understand futures markets to use the forex track?", "No. You trade spot forex — Signal Boss handles the futures intelligence layer. All signal cards are presented in familiar forex terms (pips, entry price, pair name). The futures reference (e.g., 'Derived from /6E') is shown for transparency but you don't need to trade futures to benefit from the signals."],
    ["What timeframes are covered?", "Signals are available on the 5-minute, 15-minute, 1-hour, 4-hour, and Daily timeframes — consistent across all pairs including crosses."],
    ["Can I cancel anytime?", "Yes. Signal Boss is month-to-month with no long-term commitment. Cancel anytime from your account dashboard with no fees or penalties."],
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
          <button onClick={() => onNavigate("signup")} style={{ width:"100%", padding:"9px", background:C.accent, color:"#080909", border:"none", borderRadius:7, fontWeight:700, fontSize:12, cursor:"pointer" }}>Get Access →</button>
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
              <button onClick={() => onNavigate("signup")} style={{ marginTop:16, padding:"10px 24px", background:C.accent, color:"#080909", border:"none", borderRadius:7, fontWeight:600, fontSize:13, cursor:"pointer" }}>Get Access →</button>
            </div>
          </div>
        )}

        {activeTab==="account" && (
          <div style={{ padding:22, maxWidth:500 }}>
            <h2 style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>Account</h2>
            <p style={{ color:C.textMid, fontSize:13, marginBottom:22 }}>Manage your Signal Boss subscription and preferences.</p>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20 }}>
              <div style={{ fontSize:13, color:C.textMid, lineHeight:1.8 }}>Account management is available once you have an active subscription.</div>
              <button onClick={() => onNavigate("signup")} style={{ marginTop:16, padding:"10px 24px", background:C.accent, color:"#080909", border:"none", borderRadius:7, fontWeight:600, fontSize:13, cursor:"pointer" }}>Get Access →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LandingPage({ onNavigate, t, track, setTrack }) {
  const [signalCount] = useState(47 + Math.floor(Math.random() * 12));

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
          <button onClick={() => onNavigate("signals-fire")} style={{ padding:"15px 36px", background:"transparent", color:C.long, border:`1px solid ${C.long}`, borderRadius:8, fontWeight:500, fontSize:14, cursor:"pointer" }}>{t.viewDemo}</button>
        </div>

        {/* Example signal card + equity curve */}
        <div style={{ marginTop:72, display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center", alignItems:"flex-start", width:"100%", maxWidth:780 }}>
          <div style={{ maxWidth:340, width:"100%", textAlign:"left" }}>
            <div style={{ fontSize:10, color:C.textDim, letterSpacing:"0.15em", marginBottom:12, fontFamily:"monospace", textAlign:"center" }}>{t.exampleSignal}</div>
            <div style={{ background:C.surfaceUp, border:`1px solid ${track==="forex"?C.accent+"33":C.long+"33"}`, borderRadius:12, padding:20, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:track==="forex"?C.accent:C.long }} />
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:track==="forex"?8:14 }}>
                <LiveDot color={track==="forex"?C.accent:C.long} size={8} />
                <span style={{ fontSize:18, fontWeight:700, color:C.long, fontFamily:"monospace" }}>LONG</span>
                <span style={{ fontSize:18, fontWeight:700, fontFamily:"monospace" }}>{track==="forex"?"EUR/USD":"ES"}</span>
                <span style={{ fontSize:10, color:C.textMid, background:C.border, padding:"2px 7px", borderRadius:4, fontFamily:"monospace" }}>5m</span>
                <span style={{ marginLeft:"auto", fontSize:10, color:C.long, background:C.longDim, padding:"3px 10px", borderRadius:20, fontFamily:"monospace" }}>ACTIVE</span>
              </div>
              {track==="forex" && (
                <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", background:C.accentDim, padding:"2px 8px", borderRadius:4, display:"inline-block", marginBottom:10 }}>DERIVED FROM /6E</div>
              )}
              <div style={{ display:"flex", gap:3, marginBottom:12 }}>
                {[1,2,3].map(i => <span key={i} style={{ fontSize:14, filter:`drop-shadow(0 0 4px ${C.long})` }}>⚡</span>)}
                <span style={{ fontSize:11, fontWeight:600, color:C.strong, marginLeft:4, fontFamily:"monospace" }}>STRONG</span>
              </div>
              {[["Daily","↑ above zero"],["2-Day","↑ above zero"],["4-Day","↑ above zero"]].map(([l,s]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.border}`, fontSize:11, fontFamily:"monospace" }}>
                  <span style={{ color:C.textMid }}>{l}</span><span style={{ color:C.long }}>{s} ✓</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${C.border}`, fontSize:11, fontFamily:"monospace" }}>
                <span style={{ color:C.textMid }}>Daily VWAP</span><span style={{ color:C.long }}>↑ above ✓</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", fontSize:11, fontFamily:"monospace" }}>
                <span style={{ color:C.textMid }}>Weekly VWAP</span><span style={{ color:C.long }}>↑ above ✓</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:16 }}>
          <p style={{ fontSize:11, color:C.textDim, fontFamily:"monospace", fontStyle:"italic" }}>
            Hypothetical and Illustrative Examples · Not actual trading results · Past performance does not guarantee future results
          </p>
        </div>
      </div>

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
      <div style={{ maxWidth:720, margin:"0 auto", padding:"0 24px 100px" }}>
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
              <button onClick={() => onNavigate("calc")} style={{ padding:"12px 28px", background:C.prop, color:"#fff", border:"none", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer" }}>
                {t.calcCta}
              </button>
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
            { quote:"I trade GBP/USD and USD/JPY. The fact that Signal Boss reads /6B and /6J and shows me the institutional positioning before I trade the spot pair — that's not something any other signal service offers. It's a completely different level.", name:"T.H.", detail:"Forex trader · Toronto, CA", stars:5 },
            { quote:"EUR/JPY is my main pair. Most tools don't even cover it properly. Signal Boss derives the signal from both /6E and /6J and shows you both references on the card. That transparency alone is worth it.", name:"C.V.", detail:"Cross pair trader · Brussels, BE", stars:5 },
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
          ? <span>No account? <span onClick={() => onNavigate("signup")} style={{ color:C.accent, cursor:"pointer" }}>Get access →</span></span>
          : <span>Already subscribed? <span onClick={() => onNavigate("login")} style={{ color:C.accent, cursor:"pointer" }}>Sign in →</span></span>
        }
      </div>
    </div>
  );
}

function PricingModal({ user, track, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(track === "forex" ? "major" : "pro");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const futurePlans = [
    { id:"starter", name:"Starter", price:149, desc:"Equity index, Treasury, Energy & Metals · Smart Stop & Take Profit · Risk Calculator", color:C.textMid },
    { id:"pro",     name:"Pro",     price:249, desc:"Everything in Starter + Currency Futures · WhatsApp alerts · Intraday IV levels", color:C.accent, popular:true },
    { id:"elite",   name:"Elite",   price:449, desc:"Everything in Pro · 1 & 2 SD of Intraday IV · Compression/Expansion · Bond spread analysis", color:C.long },
  ];
  const forexPlans = [
    { id:"major", name:"Major Pairs",   price:129, desc:"Forex Trade Signals · Smart Stop & Take Profit · Risk Calculator", color:C.accent, popular:true },
    { id:"full",  name:"Full Coverage", price:249, desc:"All Major Pairs · WhatsApp alerts · Additional indicator signals", color:C.long },
  ];
  const plans = track === "forex" ? forexPlans : futurePlans;

  const handleCheckout = async () => {
    if (!user) { onClose(); return; }
    setLoading(true); setError(null);
    try {
      const resp = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.primaryEmailAddress?.emailAddress || "", plan: selectedPlan }),
      });
      const data = await resp.json();
      if (data.url) { window.location.href = data.url; }
      else { setError(data.error || "Something went wrong. Please try again."); }
    } catch(e) { setError("Could not connect to payment server. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24,
      background:"rgba(8,9,9,0.82)", backdropFilter:"blur(10px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#111214", border:`1px solid ${C.border}`, borderRadius:18, width:"100%", maxWidth:500, padding:"32px 28px", position:"relative", boxShadow:"0 24px 80px #000a" }}>

        {/* Close */}
        <button onClick={onClose} style={{ position:"absolute", top:16, right:18, background:"none", border:"none",
          color:C.textDim, fontSize:20, cursor:"pointer", lineHeight:1 }}>✕</button>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontWeight:800, fontSize:18, fontFamily:"monospace", marginBottom:6 }}>
            SIGNAL<span style={{ color:C.accent }}>BOSS</span>
          </div>
          <div style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>Choose Your Plan</div>
          <div style={{ fontSize:12, color:C.textDim }}>30-day money-back guarantee · Cancel anytime</div>
        </div>

        {/* Plans */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:22 }}>
          {plans.map(p => (
            <div key={p.id} onClick={() => setSelectedPlan(p.id)}
              style={{ background:C.surface, border:`2px solid ${selectedPlan===p.id ? p.color : C.border}`,
                borderRadius:12, padding:"14px 18px", cursor:"pointer", position:"relative", transition:"border-color 0.15s" }}>
              {p.popular && (
                <div style={{ position:"absolute", top:-9, right:16, background:p.color, color:"#080909",
                  fontSize:9, fontWeight:700, padding:"2px 10px", borderRadius:20, fontFamily:"monospace", letterSpacing:"0.08em" }}>
                  RECOMMENDED
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${p.color}`,
                    background: selectedPlan===p.id ? p.color : "transparent", flexShrink:0 }} />
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:p.color }}>{p.name}</div>
                    <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>{p.desc}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0, marginLeft:12 }}>
                  <div style={{ fontSize:20, fontWeight:700, fontFamily:"monospace" }}>${p.price}</div>
                  <div style={{ fontSize:10, color:C.textDim }}>/month</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background:C.short+"22", border:`1px solid ${C.short}44`, borderRadius:8,
            padding:"8px 14px", marginBottom:14, fontSize:12, color:C.short }}>{error}</div>
        )}

        <button onClick={handleCheckout} disabled={loading}
          style={{ width:"100%", padding:"14px", background:C.accent, color:"#080909", border:"none",
            borderRadius:10, fontWeight:700, fontSize:15, cursor:"pointer", opacity:loading?0.7:1,
            letterSpacing:"0.02em" }}>
          {loading ? "Connecting to checkout…" : "Get Access →"}
        </button>

        <div style={{ textAlign:"center", marginTop:12, fontSize:11, color:C.textDim }}>
          All major cards accepted · Secured by Stripe
        </div>
      </div>
    </div>
  );
}

function SubscribePage({ user, plan, onNavigate, t, track }) {
  const [selectedPlan, setSelectedPlan] = useState(track === "forex" ? "major" : "pro");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const futurePlans = [
    { id:"starter", name:"Starter",  price:149, desc:"Equity index, Treasury, Energy & Metals · Smart Stop & Take Profit · Risk Calculator · Email alerts", color:C.textMid },
    { id:"pro",     name:"Pro",      price:249, desc:"Everything in Starter + Currency Futures · Email & WhatsApp alerts · 1 Standard Deviation of Intraday IV on every signal", color:C.accent, popular:true },
    { id:"elite",   name:"Elite",    price:449, desc:"Everything in Pro · 1 & 2 Standard Deviations of Intraday IV · Compression/Expansion · Treasury bond spread analysis", color:C.long, contactUs:true },
  ];
  const forexPlans = [
    { id:"major",   name:"Major Pairs", price:129, desc:"Forex Trade Signals · Smart Stop & Take Profit · Risk Calculator · Email alerts", color:C.accent, popular:true },
    { id:"full",    name:"Full Coverage",price:249,desc:"All Major Pairs instruments · Email & WhatsApp alerts · Additional indicator signals", color:C.long },
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
        window.location.href = data.url;
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
  "USD/CHF": { tick:0.0001, tickVal:10.00, unit:"pips", label:"USD/CHF"    },
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
  const isAdmin  = !!user; // Admin tab visible to any logged-in user

  const [signals,      setSignals]      = useState([]);
  const [levels,       setLevels]       = useState({});
  const [lastUpdated,  setLastUpdated]  = useState(null);
  const [activeTab,    setActiveTab]    = useState("signals");
  const [history,      setHistory]      = useState([]);
  const [histTypeFilter, setHistTypeFilter] = useState("ALL");
  const [manualForm,   setManualForm]   = useState({ instrument:"NQ", direction:"LONG", price:"", stop:"", tp:"", note:"" });
  const [manualStatus, setManualStatus] = useState(null);
  const [filterInst,   setFilterInst]   = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("sb_inst_filter"));
      if (raw && raw.v === INST_FILTER_V && Array.isArray(raw.insts)) return new Set(raw.insts);
    } catch {}
    return new Set(ALL_INSTS);
  });
  const toggleInst = sym => {
    setFilterInst(prev => {
      const next = new Set(prev);
      if (next.has(sym)) { if (next.size > 1) next.delete(sym); }
      else next.add(sym);
      localStorage.setItem("sb_inst_filter", JSON.stringify({ v: INST_FILTER_V, insts: [...next] }));
      return next;
    });
  };

  // Live signals (Gist) — drives Live Signals tab
  useEffect(() => {
    const load = () =>
      fetch(`${GIST_URL}?t=${Date.now()}`)
        .then(r => r.json())
        .then(d => {
          setSignals(d.signals || []);
          setLastUpdated(new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }));
        })
        .catch(() => {});
    load();
    const iv = setInterval(load, 60000);
    return () => clearInterval(iv);
  }, []);

  // VRB Levels (Gist) — posts at 9:00 AM when range closes, no signal needed
  useEffect(() => {
    const load = () =>
      fetch(`${LEVELS_URL}?t=${Date.now()}`)
        .then(r => r.json())
        .then(d => { if (d.levels) setLevels(d.levels); })
        .catch(() => {});
    load();
    const iv = setInterval(load, 60000);
    return () => clearInterval(iv);
  }, []);

  // History — static file (always works) + optional VPS live updates
  const fetchHistory = () =>
    fetch(`${HISTORY_URL}?t=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        const rows = Array.isArray(data) ? data : (data.history || []);
        if (rows.length > 0) setHistory(rows);
        // Also try live VPS for any today's records not yet in static file
        return fetch(`${API_URL}/history?t=${Date.now()}`)
          .then(r => r.json())
          .then(live => {
            const liveRows = Array.isArray(live) ? live : (live.history || []);
            if (liveRows.length > 0) {
              setHistory(prev => {
                const ids = new Set(prev.map(s => s.id));
                const merged = [...prev, ...liveRows.filter(s => !ids.has(s.id))];
                return merged.sort((a,b) => (b.date||"").localeCompare(a.date||""));
              });
            }
          })
          .catch(() => {});
      })
      .catch(() => {});

  useEffect(() => {
    fetchHistory();
    const iv = setInterval(fetchHistory, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  const active   = signals.filter(s => s.status === "ACTIVE");
  const longs    = active.filter(s => s.direction === "LONG").length;
  const shorts   = active.filter(s => s.direction === "SHORT").length;

  const tabs = [
    { id:"signals", label:t.liveSignals,   icon:"◉" },
    { id:"levels",  label:"VRB Levels",    icon:"▤" },
    { id:"history", label:t.signalHistory, icon:"◷" },
    { id:"pnl",     label:"P&L Tracker",   icon:"◈" },
    { id:"config",  label:t.configuration, icon:"⚙" },
    { id:"prop",    label:t.propCalc,       icon:"⬡" },
    { id:"account", label:t.account,        icon:"◎" },
    ...(isAdmin ? [{ id:"admin", label:"Admin", icon:"⬛" }] : []),
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
          <div style={{ marginTop:10, textAlign:"center" }}><SignalCounter count={signals.length} /></div>
        </div>
        <div style={{ padding:"10px 18px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:11, color:C.textDim }}>{user?.email||"trader@signalboss.io"}</div>
          <div onClick={() => onNavigate("landing")} style={{ fontSize:11, color:C.textDim, cursor:"pointer", marginTop:4 }}>{t.home}</div>
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

            {/* Signal cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(310px,1fr))", gap:14 }}>
              {signals.map(sig => <LiveSignalCard key={sig.id} signal={sig} />)}
              {signals.length === 0 && (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 0", color:C.textDim, fontFamily:"monospace", fontSize:13 }}>
                  No signals have fired yet today.<br />
                  <span style={{ fontSize:11, color:C.textDim, marginTop:8, display:"block" }}>Ready alerts go out at 9:00 AM ET · Signals fire on range breakouts</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab==="levels" && (() => {
          const fmtRange = (val) => {
            if (val == null) return null;
            if (val >= 10)  return val.toFixed(2);
            if (val >= 1)   return val.toFixed(3);
            if (val >= 0.1) return val.toFixed(4);
            return val.toFixed(6);
          };
          const fmtPx  = v => v == null ? null : v.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:6 });
          const fmtUsd = v => v == null ? null : `$${Math.round(v).toLocaleString()}`;
          const dash = <span style={{ color:C.textDim }}>—</span>;

          const COL_HDR = { padding:"10px 16px", fontSize:10, fontWeight:600, color:C.textDim, letterSpacing:"0.12em", whiteSpace:"nowrap", fontFamily:"'IBM Plex Mono','Courier New',monospace" };
          const CELL    = (extra={}) => ({ padding:"13px 16px", fontFamily:"'IBM Plex Mono','Courier New',monospace", fontSize:13, ...extra });

          return (
            <div style={{ padding:"22px 22px 32px" }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:14, marginBottom:6 }}>
                <h2 style={{ fontSize:18, fontWeight:600, margin:0 }}>VRB Levels</h2>
                <span style={{ fontSize:11, color:C.textDim, fontFamily:"monospace" }}>Volatility range · levels post at 9:00 AM</span>
              </div>
              <div style={{ fontSize:11, color:C.textDim, fontFamily:"monospace", marginBottom:20 }}>
                W1 = 8–9 AM range&nbsp;&nbsp;·&nbsp;&nbsp;W2 = 9–10 AM range&nbsp;&nbsp;·&nbsp;&nbsp;SL = full contract&nbsp;&nbsp;·&nbsp;&nbsp;Targets at 3:1 and 5:1 RR
              </div>

              <div style={{ overflowX:"auto", borderRadius:10, border:`1px solid ${C.border}` }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:C.surface, borderBottom:`1px solid ${C.border}` }}>
                      <th style={{ ...COL_HDR, textAlign:"left"   }}>SYMBOL</th>
                      <th style={{ ...COL_HDR, textAlign:"right"  }}>RANGE PTS</th>
                      <th style={{ ...COL_HDR, textAlign:"right"  }}>🟢 LONG ENTRY</th>
                      <th style={{ ...COL_HDR, textAlign:"right"  }}>🔴 SHORT ENTRY</th>
                      <th style={{ ...COL_HDR, textAlign:"right"  }}>SL $</th>
                      <th style={{ ...COL_HDR, textAlign:"right"  }}>TARGET 3:1 $</th>
                      <th style={{ ...COL_HDR, textAlign:"right"  }}>TARGET 5:1 $</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_INSTS.map((sym, i) => {
                      const lv     = levels[sym];   // from levels.json — available at 9:00 AM
                      const micro  = MICROS[sym];
                      const orHigh = lv?.orHigh   ?? null;
                      const orLow  = lv?.orLow    ?? null;
                      const range  = lv?.rangePts ?? null;
                      const slUsd  = lv?.slUsd    ?? null;
                      const t31    = lv?.t31Usd   ?? null;
                      const t51    = lv?.t51Usd   ?? null;
                      const rowBg  = i % 2 === 1 ? `${C.surface}66` : "transparent";

                      return (
                        <tr key={sym} style={{ background:rowBg, borderBottom:`1px solid ${C.border}22` }}>
                          {/* Symbol */}
                          <td style={{ ...CELL(), textAlign:"left" }}>
                            <span style={{ fontWeight:700, color:C.text }}>{sym}</span>
                            {micro && <span style={{ fontSize:10, color:C.textDim, marginLeft:8 }}>{micro}</span>}
                          </td>

                          {/* Range Pts */}
                          <td style={{ ...CELL(), textAlign:"right", color:C.accent, fontWeight:600 }}>
                            {range != null ? fmtRange(sym, range) : dash}
                          </td>

                          {/* LONG Entry = OR high */}
                          <td style={{ ...CELL(), textAlign:"right", color:C.long, fontWeight:600 }}>
                            {fmtPx(orHigh) ?? dash}
                          </td>

                          {/* SHORT Entry = OR low */}
                          <td style={{ ...CELL(), textAlign:"right", color:C.short, fontWeight:600 }}>
                            {fmtPx(orLow) ?? dash}
                          </td>

                          {/* SL $ */}
                          <td style={{ ...CELL(), textAlign:"right", color:C.textMid, fontWeight:600 }}>
                            {fmtUsd(slUsd) ?? dash}
                          </td>

                          {/* Target 3:1 $ */}
                          <td style={{ ...CELL(), textAlign:"right", color:C.long, fontWeight:600 }}>
                            {fmtUsd(t31) ?? dash}
                          </td>

                          {/* Target 5:1 $ */}
                          <td style={{ ...CELL(), textAlign:"right", color:C.long, fontWeight:600 }}>
                            {fmtUsd(t51) ?? dash}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop:14, fontSize:11, color:C.textDim, fontFamily:"monospace" }}>
                All rows populate at 9:00 AM when the range closes.&nbsp;
                Micro contract targets = divide $ values by 10.
              </div>
            </div>
          );
        })()}

        {activeTab==="history" && (() => {
          const isOrb = s => s.type === "VOLATILITY_ORB" || s.type === "ORB";
          const TYPE_META = {
            "VOLATILITY_ORB": { label:"Volatility Range Breakout", color:"#38bdf8", bg:"#38bdf811" },
            "ORB":            { label:"Volatility Range Breakout", color:"#38bdf8", bg:"#38bdf811" },
            "SB_CRITERIA":    { label:"SB Criteria Met",        color:"#a78bfa", bg:"#a78bfa11" },
            "MANUAL":         { label:"SB Criteria Met",        color:"#a78bfa", bg:"#a78bfa11" },
          };
          const getTypeMeta = s => TYPE_META[s.type] || { label: s.trigger || "VRB", color:C.textMid, bg:C.surface };
          const getStatusMeta = s => {
            const st = s.status || "ACTIVE";
            if (st === "WIN")    return { label:"WIN ✓", color:C.long };
            if (st === "LOSS")   return { label:"LOSS",  color:C.short };
            return { label:"—", color:C.textDim };
          };
          const computePnl = s => {
            if (s.pnlUsd != null) return s.pnlUsd;
            const ticks = s.stop_ticks || s.risk?.stopTicks || 0;
            const tv    = s.tick_value || 5.0;
            const rr    = s.rr || 3.0;
            if (s.status === "WIN")  return +(ticks * tv * rr).toFixed(0);
            if (s.status === "LOSS") return -(ticks * tv);
            return null;
          };
          const fmtTime = s => {
            const raw = s.time || "";
            const m = raw.match(/^(\d{1,2}):(\d{2})/);
            if (!m) return raw;
            let h = parseInt(m[1]), mn = m[2];
            const ampm = h >= 12 ? "PM" : "AM";
            h = h === 0 ? 12 : h > 12 ? h - 12 : h;
            return `${h}:${mn} ${ampm} ET`;
          };
          const histRows = history
            .filter(s => s.status === "WIN" || s.status === "LOSS")
            .filter(s => filterInst.has(s.instrument))
            .filter(s => {
              if (histTypeFilter === "ALL") return true;
              if (histTypeFilter === "VOLATILITY_ORB") return isOrb(s);
              return true;
            });
          const wins       = histRows.filter(s => s.status === "WIN").length;
          const liveWR     = histRows.length > 0 ? (wins / histRows.length * 100).toFixed(0) : null;
          const netPnl     = histRows.reduce((acc, s) => acc + (computePnl(s) || 0), 0);
          const uniqueDays = new Set(histRows.map(s => s.date).filter(Boolean)).size;
          const markOutcome = async (id, outcome) => {
            try {
              await fetch(`${API_URL}/update-signal`, {
                method:"POST",
                headers:{"Content-Type":"application/json","X-Admin-Key":"sb_admin_2026_jr"},
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
              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>LIVE TRACK RECORD</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:12 }}>
                {[
                  { label:"DAYS TRACKED",   value: uniqueDays,  color:C.accent },
                  { label:"TOTAL SIGNALS",  value: histRows.length, color:C.accent },
                  { label:"CLOSED",         value: histRows.length, color:C.textMid },
                  { label:"LIVE WIN RATE",  value: liveWR ? `${liveWR}%` : "—", color: liveWR && parseInt(liveWR)>=40 ? C.long : C.short },
                  { label:"NET P&L (1 ct)", value: histRows.length > 0 ? `${netPnl>=0?"+":""}$${netPnl.toLocaleString()}` : "—", color: netPnl>=0?C.long:C.short },
                ].map(s => (
                  <div key={s.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:9, color:C.textDim, fontFamily:"monospace", letterSpacing:"0.1em", marginBottom:6 }}>{s.label}</div>
                    <div style={{ fontSize:20, fontWeight:700, color:s.color, fontFamily:"monospace" }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20,
                background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.18)",
                borderRadius:8, padding:"12px 20px", width:"fit-content" }}>
                <span style={{ fontSize:18, color:"#22c55e", fontWeight:700 }}>✓</span>
                <span style={{ fontFamily:"monospace", fontSize:15, color:"#22c55e", letterSpacing:"0.04em", fontWeight:600 }}>
                  All trades verified — delivered to Website Signal History, e-mail and WhatsApp in real time
                </span>
              </div>
              <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                {[{key:"ALL",label:"All"},{key:"VOLATILITY_ORB",label:"Volatility Range Breakout Trades"}].map(({ key, label }) => (
                  <button key={key} onClick={() => setHistTypeFilter(key)}
                    style={{ padding:"6px 14px", fontSize:12, fontFamily:"monospace", cursor:"pointer", borderRadius:7,
                      background: histTypeFilter===key ? C.accent+"22" : "transparent",
                      border:`1px solid ${histTypeFilter===key ? C.accent : C.border}`,
                      color: histTypeFilter===key ? C.accent : C.textMid }}>
                    {label}
                  </button>
                ))}
                <div style={{ marginLeft:"auto", display:"flex", gap:6, flexWrap:"wrap" }}>
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
              {histRows.length === 0 ? (
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:32,
                  color:C.textMid, fontSize:13, textAlign:"center" }}>
                  {history.length === 0
                    ? "No history yet — signals appear here as they're logged with outcomes."
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
                      <div key={s.id || i} style={{ display:"grid",
                        gridTemplateColumns: isAdmin ? "70px 55px 1fr 55px 75px 80px 75px 90px 100px" : "70px 55px 1fr 55px 75px 80px 75px 90px",
                        padding:"10px 16px", borderBottom: i < histRows.length-1 ? `1px solid ${C.border}` : "none",
                        fontSize:13, alignItems:"center", background: i%2===0?"transparent":C.bg+"44" }}>
                        <span style={{ fontFamily:"monospace", fontSize:11, color:C.textMid }}>{s.date ? s.date.slice(5) : "—"}</span>
                        <span style={{ fontFamily:"monospace", fontSize:11, color:C.textDim }}>{fmtTime(s)}</span>
                        <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ padding:"2px 8px", borderRadius:4, fontSize:10, fontFamily:"monospace", fontWeight:700,
                            background:tm.bg, color:tm.color, whiteSpace:"nowrap" }}>{tm.label}</span>
                          {s.exit_type && <span style={{ padding:"2px 7px", borderRadius:4, fontSize:9, fontFamily:"monospace", fontWeight:700,
                            background: s.exit_type==="EOH"?"#f59e0b22":"#38bdf822",
                            color: s.exit_type==="EOH"?"#f59e0b":"#38bdf8", whiteSpace:"nowrap" }}>{s.exit_type}</span>}
                        </span>
                        <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:12 }}>{s.instrument}</span>
                        <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:12, color:s.direction==="LONG"?C.long:C.short }}>
                          {s.direction==="LONG"?"▲ L":"▼ S"}
                        </span>
                        <span style={{ fontFamily:"monospace", fontSize:12 }}>{entry ? entry.toLocaleString() : "—"}</span>
                        <span style={{ fontFamily:"monospace", fontSize:11, color:C.textDim }}>{(s.rr || "3")+":1"}</span>
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
                {histRows.length} record{histRows.length!==1?"s":""} · persistent log
              </div>
            </div>
          );
        })()}

        {activeTab==="admin" && isAdmin && (() => {
          const activeNow = signals.filter(s => s.status === "ACTIVE");
          return (
            <div style={{ padding:22, maxWidth:860 }}>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>Admin — Signal Boss</h2>
                <p style={{ color:C.textMid, fontSize:13 }}>Real-time QC · Signal monitoring · Platform health</p>
              </div>
              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>ACTIVE SIGNALS NOW</div>
              {activeNow.length === 0 ? (
                <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20, color:C.textMid, fontSize:13, marginBottom:28 }}>No active signals right now.</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
                  {activeNow.map((s, i) => (
                    <div key={i} style={{ background:C.surface, border:`1px solid ${s.direction==="LONG"?C.long+"33":C.short+"33"}`, borderRadius:10, padding:"12px 16px", display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
                      <span style={{ fontFamily:"monospace", fontWeight:700, color:s.direction==="LONG"?C.long:C.short, fontSize:13 }}>{s.direction}</span>
                      <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:13 }}>{s.instrument}</span>
                      <span style={{ fontFamily:"monospace", fontSize:12, color:C.textMid }}>Entry: {s.price}</span>
                      {s.risk && <span style={{ fontFamily:"monospace", fontSize:12, color:C.short }}>Stop: {s.risk.stopPrice}</span>}
                      {s.risk && <span style={{ fontFamily:"monospace", fontSize:12, color:C.long }}>TP: {s.risk.firstTpPrice}</span>}
                      <span style={{ fontFamily:"monospace", fontSize:11, color:C.textDim, marginLeft:"auto" }}>{s.time}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>POST MANUAL SIGNAL</div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:28 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:5 }}>INSTRUMENT</div>
                    <select value={manualForm.instrument} onChange={e => setManualForm(p=>({...p,instrument:e.target.value}))}
                      style={{ width:"100%", padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:13, fontFamily:"monospace" }}>
                      {ALL_INSTS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:5 }}>DIRECTION</div>
                    <div style={{ display:"flex", gap:8 }}>
                      {["LONG","SHORT"].map(d=>(
                        <button key={d} onClick={()=>setManualForm(p=>({...p,direction:d}))}
                          style={{ flex:1, padding:"8px 0", background: manualForm.direction===d?(d==="LONG"?C.long:C.short)+"22":"transparent",
                            border:`1px solid ${manualForm.direction===d?(d==="LONG"?C.long:C.short):C.border}`,
                            borderRadius:7, color:manualForm.direction===d?(d==="LONG"?C.long:C.short):C.textMid,
                            fontFamily:"monospace", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                          {d==="LONG"?"▲ LONG":"▼ SHORT"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
                  {[["price","ENTRY PRICE"],["stop","STOP"],["tp","TARGET"]].map(([field,label])=>(
                    <div key={field}>
                      <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:5 }}>{label}</div>
                      <input type="number" placeholder="auto" value={manualForm[field]}
                        onChange={e=>setManualForm(p=>({...p,[field]:e.target.value}))}
                        style={{ width:"100%", padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:13, fontFamily:"monospace", boxSizing:"border-box" }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:10, color:C.textDim, fontFamily:"monospace", marginBottom:5 }}>NOTE (optional)</div>
                  <input type="text" placeholder="e.g. ORB breakout confirmed · strong volume" value={manualForm.note}
                    onChange={e=>setManualForm(p=>({...p,note:e.target.value}))}
                    style={{ width:"100%", padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, fontSize:13, boxSizing:"border-box" }} />
                </div>
                <button onClick={async ()=>{
                  setManualStatus({ok:null,msg:"Sending..."});
                  try {
                    const resp = await fetch(`${API_URL}/manual-signal`, {
                      method:"POST",
                      headers:{"Content-Type":"application/json","X-Admin-Key":"sb_admin_2026_jr"},
                      body: JSON.stringify({ instrument:manualForm.instrument, direction:manualForm.direction,
                        price: manualForm.price ? parseFloat(manualForm.price) : undefined,
                        stop:  manualForm.stop  ? parseFloat(manualForm.stop)  : undefined,
                        tp:    manualForm.tp    ? parseFloat(manualForm.tp)    : undefined,
                        note:  manualForm.note }),
                    });
                    const data = await resp.json();
                    if (resp.ok) { setManualStatus({ok:true,msg:`✅ Signal posted: ${data.id}`}); setManualForm(p=>({...p,price:"",stop:"",tp:"",note:""})); }
                    else setManualStatus({ok:false,msg:`❌ ${data.error||"Error"}`});
                  } catch(e) { setManualStatus({ok:false,msg:`❌ ${e.message}`}); }
                }}
                  style={{ padding:"10px 24px", background:manualForm.direction==="LONG"?C.long:C.short,
                    border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:13, fontFamily:"monospace", cursor:"pointer" }}>
                  {manualForm.direction==="LONG"?"▲ POST LONG":"▼ POST SHORT"} {manualForm.instrument}
                </button>
                {manualStatus && <div style={{ marginTop:10, fontSize:12, fontFamily:"monospace",
                  color: manualStatus.ok===true?C.long:manualStatus.ok===false?C.short:C.textMid }}>{manualStatus.msg}</div>}
              </div>
              <div style={{ fontSize:10, color:C.accent, fontFamily:"monospace", letterSpacing:"0.15em", marginBottom:10 }}>QC CHECKLIST</div>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:28 }}>
                {[
                  ["Gist signals URL configured",   !!GIST_URL],
                  ["Active signals present",          activeNow.length > 0],
                  ["Risk data on signals",            signals.some(s=>s.risk)],
                  ["History records loaded",          history.length > 0],
                ].map(([label, ok]) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:13 }}>{label}</span>
                    <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:700, color:ok?C.long:"#f59e0b" }}>{ok?"✓ OK":"⚠ Check"}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {activeTab==="config" && (
          <div style={{ padding:22, maxWidth:580 }}>
            <h2 style={{ fontSize:18, fontWeight:600, marginBottom:4 }}>Configuration</h2>
            <p style={{ color:C.textMid, fontSize:13, marginBottom:24 }}>Engine status and alert delivery settings</p>

            {/* Engine status */}
            <div style={{ background:C.surface, border:`1px solid ${C.long}33`, borderRadius:12, padding:20, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <LiveDot color={C.long} size={7} />
                <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:C.long, letterSpacing:"0.08em" }}>ENGINE ACTIVE</span>
                <span style={{ marginLeft:"auto", fontFamily:"monospace", fontSize:11, color:C.textDim }}>Polling every 60s</span>
              </div>
              {[
                ["Session",        "8:00 AM – 4:00 PM ET, Mon–Fri"],
                ["Instruments",    "ES · NQ · YM · RTY · CL · GC · ZN · ZF · ZT"],
                ["Signal Windows", "W1: 8–9 AM range  ·  W2: 9–10 AM range"],
                ["IV Boss Filter", "Active — blocks counter-trend signals"],
              ].map(([label, value]) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:12, color:C.textMid, fontFamily:"monospace", minWidth:130, flexShrink:0 }}>{label}</span>
                  <span style={{ fontSize:12, color:C.text, fontFamily:"monospace", textAlign:"right" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Telegram */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:20, marginBottom:14 }}>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:14 }}>Telegram Alerts</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>@Signal Boss Alerts</div>
                  <div style={{ fontSize:11, color:C.textMid, marginTop:3 }}>All signals delivered in real time</div>
                </div>
                <a href="https://t.me/SignalBossAlerts" target="_blank" rel="noreferrer"
                  style={{ padding:"7px 16px", background:C.accentDim, border:`1px solid ${C.accent}44`, borderRadius:7, color:C.accent, fontSize:12, fontFamily:"monospace", fontWeight:600, textDecoration:"none" }}>
                  Open Channel →
                </a>
              </div>
              <div style={{ padding:"10px 0" }}>
                <div style={{ fontSize:11, color:C.textDim, fontFamily:"monospace", lineHeight:1.8 }}>
                  Signal cards include: Entry · Stop · 1st Target · Risk per contract · IV Boss cycle bias
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab==="pnl"  && <PositionTracker />}

        {activeTab==="prop" && <PropCalc t={t} />}

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
              {[["Website (real-time)",true],["Email notifications",true],["WhatsApp",true],["Webhook",false]].map(([label,on]) => (
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
                {ALL_INSTS.map(inst => (
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

function SignalFiresPlayer({ onNavigate }) {
  const videos = [
    { src: "/videos/02_backtest_reveal.html", label: "BACKTEST", duration: 18000 },
    { src: "/videos/01_signal_fires.html", label: "LONG · ES", duration: 7000 },
    { src: "/videos/02_signal_fires.html", label: "SHORT · GC", duration: 9000 },
    { src: "/videos/03_signal_fires.html", label: "MULTI · 4 MARKETS", duration: 9000 },
  ];
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  const advance = useCallback((nextIdx) => {
    setProgress(0);
    setIdx(nextIdx);
    startRef.current = performance.now();
  }, []);

  useEffect(() => {
    const dur = videos[idx].duration;
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / dur, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        advance((idx + 1) % videos.length);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [idx]);

  return (
    <div style={{ minHeight:"100vh", background:"#050810", display:"flex", flexDirection:"column" }}>
      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 28px", borderBottom:"1px solid #1a2e48" }}>
        <button onClick={() => onNavigate("home")} style={{ background:"none", border:"none", color:"#b8cccc", cursor:"pointer", fontSize:13, fontFamily:"monospace", letterSpacing:"0.1em", display:"flex", alignItems:"center", gap:8 }}>
          ← BACK
        </button>
        <div style={{ fontFamily:"monospace", fontSize:12, letterSpacing:"0.18em", color:"#c8a96e", fontWeight:700 }}>
          ● SIGNAL BOSS — LIVE
        </div>
        <div style={{ width:60 }}/>
      </div>

      {/* iframe */}
      <div style={{ flex:1, position:"relative", background:"#050810" }}>
        {videos.map((v, i) => (
          <iframe
            key={v.src}
            src={v.src}
            style={{
              position:"absolute", inset:0, width:"100%", height:"100%",
              border:"none",
              opacity: i === idx ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: i === idx ? "auto" : "none",
            }}
            allow="autoplay"
          />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height:3, background:"#0f1624" }}>
        <div style={{ height:"100%", width:`${progress * 100}%`, background:"linear-gradient(90deg, #00e5a0, #c8a96e)", transition:"none" }}/>
      </div>

      {/* Nav dots */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:24, padding:"16px 28px", background:"#050810", borderTop:"1px solid #0f1624" }}>
        {videos.map((v, i) => (
          <button key={i} onClick={() => advance(i)} style={{
            display:"flex", alignItems:"center", gap:8,
            background:"none", border:"none", cursor:"pointer", padding:"4px 0",
          }}>
            <span style={{
              width: i === idx ? 24 : 8, height:8, borderRadius:4,
              background: i === idx ? "#00e5a0" : "#1a2e48",
              transition:"width 0.3s ease, background 0.3s ease",
              display:"inline-block",
            }}/>
            <span style={{ fontFamily:"monospace", fontSize:11, letterSpacing:"0.12em", color: i === idx ? "#eaeeee" : "#555566", fontWeight: i === idx ? 700 : 400 }}>
              {v.label}
            </span>
          </button>
        ))}
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
        <div onClick={() => { setTrack("futures"); onNavigate("dashboard"); }}
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

function AppInner() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser }      = useUser();
  const [page, setPage]   = useState("landing");
  const [lang, setLang]   = useState("en");
  const [track, setTrack] = useState(null);
  const [postAuthDest, setPostAuthDest] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const modalAutoShown = useRef(false);
  const t = T[lang];

  const isSubscribed = clerkUser?.publicMetadata?.subscribed === true;
  const activePlan   = clerkUser?.publicMetadata?.plan || null;

  useEffect(() => {
    if (!isLoaded) return;
    // After Stripe payment success
    if (isSignedIn && window.location.search.includes("payment=success")) {
      window.history.replaceState({}, "", "/");
      setPage("dashboard");
      return;
    }
    // Signed in but not subscribed — auto-show pricing modal once per session
    if (isSignedIn && !isSubscribed && !modalAutoShown.current) {
      modalAutoShown.current = true;
      setPage("landing");
      setShowPricingModal(true);
      return;
    }
    // Signed in and subscribed — go to dashboard
    if (isSignedIn && isSubscribed && (page === "login" || page === "signup")) {
      setPage("dashboard");
    }
    if (!isSignedIn && page === "dashboard") {
      setPage("landing");
    }
  }, [isLoaded, isSignedIn, isSubscribed]);

  return (
    <>
      <style>{css}</style>
      {page !== "dashboard" && (
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 32px", borderBottom:`1px solid ${C.border}44`, backdropFilter:"blur(16px)", background:"#08090988" }}>
          <div onClick={() => { setPage("landing"); setTrack(null); }} style={{ fontWeight:800, fontSize:20, cursor:"pointer", fontFamily:"monospace", color:"#ffffff", letterSpacing:"0.04em" }}>
            SIGNAL<span style={{ color:C.accent }}>BOSS</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:4, background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:3 }}>
              <button onClick={() => setTrack("futures")} style={{ padding:"6px 18px", borderRadius:6, border:"none", background:(!track||track==="futures")?C.longDim:"transparent", color:(!track||track==="futures")?C.long:C.textMid, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"monospace", letterSpacing:"0.08em", transition:"all 0.15s" }}>FUTURES</button>
              <button onClick={() => setTrack("forex")} style={{ padding:"6px 18px", borderRadius:6, border:"none", background:track==="forex"?C.accentDim:"transparent", color:track==="forex"?C.accent:C.textMid, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"monospace", letterSpacing:"0.08em", transition:"all 0.15s" }}>FOREX</button>
            </div>
            {page === "landing" && (
              <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                <a style={{ fontSize:13, color:C.textMid, textDecoration:"none", fontFamily:"monospace", cursor:"pointer" }} onClick={e=>{e.preventDefault();document.getElementById("how-it-works")?.scrollIntoView({behavior:"smooth"})}}>How It Works</a>
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
                <button onClick={() => isSubscribed ? setPage("dashboard") : setShowPricingModal(true)}
                  style={{ padding:"8px 20px", background:C.accent, border:"none", borderRadius:6, color:"#080909", cursor:"pointer", fontWeight:700, fontSize:13 }}>
                  {isSubscribed ? "Dashboard →" : "Activate →"}
                </button>
                <div style={{ border:`1px solid ${C.border}`, borderRadius:"50%", padding:2 }}>
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
        {page==="landing"    && <LandingPage onNavigate={setPage} t={t} track={track} setTrack={setTrack} />}
        {page==="login"      && <ClerkAuthPage mode="sign-in" onNavigate={setPage} />}
        {page==="signup"     && <ClerkAuthPage mode="sign-up" onNavigate={setPage} />}
        {page==="subscribe"  && <SubscribePage user={clerkUser} plan={activePlan} onNavigate={setPage} t={t} track={track} />}
        {page==="calc"       && <StandaloneCalc onNavigate={setPage} t={t} />}
        {page==="contact"    && <ContactPage onNavigate={setPage} />}
        {page==="dashboard"  && (
          isSubscribed
            ? <Dashboard user={clerkUser} onNavigate={setPage} t={t} lang={lang} setLang={setLang} track={track} />
            : <SubscribePage user={clerkUser} plan={activePlan} onNavigate={setPage} t={t} track={track} />
        )}
        {page==="forex-demo" && <ForexDemo onNavigate={setPage} t={t} />}
      </div>
      {showPricingModal && (
        <PricingModal user={clerkUser} track={track} onClose={() => setShowPricingModal(false)} />
      )}
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
          card:              { border: "1px solid #21262d", boxShadow: "none" },
          formButtonPrimary: { fontWeight: 700 },
        },
      }}
    >
      <AppInner />
    </ClerkProvider>
  );
}
