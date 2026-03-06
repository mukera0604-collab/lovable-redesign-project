import { Zap, TrendingUp, DollarSign, Shield, Globe, Code } from "lucide-react";

const HeroSection = () => (
  <section className="relative py-24 px-6 text-center overflow-hidden">
    {/* Floating token badges */}
    <div className="absolute top-20 left-16 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/60 animate-float">
      <span className="text-accent">◆</span>
      <span className="text-sm text-foreground">Ethereum ETH</span>
    </div>
    <div className="absolute top-44 right-16 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/60 animate-float" style={{ animationDelay: "1s" }}>
      <span className="text-primary">₿</span>
      <span className="text-sm text-foreground">Bitcoin BTC</span>
    </div>
    <div className="absolute bottom-32 right-1/3 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/60 animate-float" style={{ animationDelay: "2s" }}>
      <span className="text-primary">🦄</span>
      <span className="text-sm text-foreground">Uniswap UNI</span>
    </div>

    <div className="container mx-auto max-w-3xl relative z-10">
      <h1 className="text-5xl md:text-7xl font-display font-bold gradient-purple-text mb-6">
        The Future of Perpetuals Is Here
      </h1>
      <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
        Leverage any token with a protocol trusted by billions — offering precision execution, speed, and reliability.
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <button className="px-8 py-3 rounded-lg bg-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity">
          Start Trading
        </button>
        <button className="px-8 py-3 rounded-lg border border-accent text-accent font-semibold text-lg hover:bg-accent/10 transition-colors">
          Add Liquidity
        </button>
      </div>
    </div>

    {/* Stats */}
    <div className="container mx-auto max-w-2xl mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-glass p-8 text-center">
          <p className="text-3xl md:text-4xl font-display font-bold text-foreground">$107,014,070,392</p>
          <p className="text-muted-foreground mt-2">All-time trade volume</p>
        </div>
        <div className="card-glass p-8 text-center">
          <p className="text-3xl md:text-4xl font-display font-bold text-foreground">18,420</p>
          <p className="text-muted-foreground mt-2">Total Trades</p>
        </div>
      </div>
    </div>
  </section>
);

const features = [
  { icon: Zap, title: "Leverage up to 30x", desc: "Boost your potential returns with powerful leverage on major pairs." },
  { icon: DollarSign, title: "Compound with Yield Pools", desc: "Earn passive income through our integrated DeFi liquidity solutions." },
  { icon: TrendingUp, title: "Ultra-Low Fees", desc: "Enjoy lightning-fast execution and industry-low transaction costs." },
  { icon: Shield, title: "Bank-Grade Security", desc: "Multi-layer encryption and decentralized storage protect your assets." },
  { icon: Globe, title: "Global Liquidity", desc: "Access deep liquidity pools for top crypto assets anytime, anywhere." },
  { icon: Code, title: "Fully Composable", desc: "Integrates seamlessly with your favorite DeFi tools and Web3 dApps." },
];

const FeaturesSection = () => (
  <section className="py-20 px-6">
    <div className="container mx-auto max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((f) => (
          <div key={f.title} className="card-glass p-8 text-center hover:border-accent/40 transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
              <f.icon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-display font-bold text-accent mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SecuritySection = () => (
  <section className="py-20 px-6">
    <div className="container mx-auto max-w-3xl text-center">
      <h2 className="text-4xl md:text-5xl font-display font-bold gradient-purple-text mb-4">
        Fully Decentralized. Completely Secure.
      </h2>
      <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
        Built with transparency and open-source integrity. Your keys, your crypto — always under your control.
      </p>
      <div className="text-left max-w-lg mx-auto space-y-4">
        {[
          { emoji: "✅", text: "Continuous code audits and open reviews." },
          { emoji: "🔒", text: "Non-custodial smart contracts ensure total user control." },
          { emoji: "🛡️", text: "Security-first architecture backed by advanced encryption." },
          { emoji: "⚡", text: "Real-time order execution powered by on-chain precision." },
        ].map((item) => (
          <p key={item.text} className="text-muted-foreground">
            <span className="mr-2">{item.emoji}</span>
            {item.text}
          </p>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-border py-8 text-center">
    <p className="text-sm text-muted-foreground">© 2026 Web3 Derp — All Rights Reserved.</p>
  </footer>
);

const Index = () => (
  <div className="min-h-screen bg-background">
    <HeroSection />
    <FeaturesSection />
    <SecuritySection />
    <Footer />
  </div>
);

export default Index;
