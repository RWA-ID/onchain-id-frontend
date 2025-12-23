import { Shield, Zap, Lock, Server, CheckCircle } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-24 bg-gray-50 border-b border-border relative">
         <div className="container px-6 max-w-4xl mx-auto">
            <div className="space-y-12">
              
              {/* Header */}
              <div className="space-y-6 text-center">
                <h1 className="text-4xl md:text-6xl font-display font-bold">
                  About <span className="text-primary">Onchain ID</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  We are building the fundamental identity layer for the machine economy.
                </p>
              </div>

              {/* Mission */}
              <div className="grid gap-8 pt-8">
                <div className="p-8 rounded-2xl bg-white border border-border shadow-sm">
                  <h3 className="text-2xl font-display font-bold mb-4">The Mission</h3>
                  <p className="text-muted-foreground leading-loose">
                    By 2030, there will be billions of autonomous agents and physical robots interacting with the world. 
                    Today, they lack a unified, decentralized way to identify themselves.
                    <br /><br />
                    <strong>Onchain ID</strong> creates a standard for machine identity that is secure, decentralized, and human-readable. 
                    We empower manufacturers to issue identities that allow robots to own assets, sign transactions, and prove their provenance without relying on a centralized server that can be shut down.
                  </p>
                </div>
              </div>

              {/* Core Values */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Verifiable Provenance",
                    text: "Every identity is cryptographically linked to its manufacturer, ensuring you know exactly where a robot came from."
                  },
                  {
                    icon: Zap,
                    title: "Economic Agency",
                    text: "Giving robots wallets allows them to participate in the economy—earning, spending, and trading autonomously."
                  },
                  {
                    icon: Lock,
                    title: "Permissionless Security",
                    text: "Built on Ethereum and ENS, our registry is censorship-resistant and permanently accessible."
                  },
                  {
                    icon: Server,
                    title: "Interoperable Standards",
                    text: "Designed to work across all robot OS types (ROS, ROS2) and manufacturer ecosystems."
                  }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-xl bg-white border border-border hover:border-primary/30 transition-colors shadow-sm">
                    <item.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-lg font-bold font-display mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}
