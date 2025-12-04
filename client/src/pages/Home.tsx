import { motion } from "framer-motion";
import { 
  Cpu, 
  Database, 
  ShieldCheck, 
  Globe, 
  Key, 
  Factory, 
  Lock, 
  RefreshCw, 
  FileCheck, 
  Settings,
  User,
  Truck,
  HeartPulse,
  Home as HomeIcon,
  Shield,
  Zap,
  Server
} from "lucide-react";
import heroImage from "@assets/generated_images/pristine_high-tech_robot_factory_assembly_line_with_bright_lighting.png";
import robotLineupImage from "@assets/robots_lineup.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const cases = [
    {
      icon: Factory,
      title: "Industrial Logistics",
      subtitle: "Fleet Management & Access",
      desc: "Factory robots need to verify their identity to open secure doors, access restricted zones, and log maintenance records. Using ai-robot.eth, every forklift and arm has a unique on-chain ID that access control systems can verify instantly without a central database.",
      tags: ["Access Control", "Audit Logs", "Maintenance"]
    },
    {
      icon: Truck,
      title: "Autonomous Delivery",
      subtitle: "Trustless Handoffs",
      desc: "A delivery drone lands at a customer's home. How does the customer's smart lock know it's the correct drone? The drone presents its signed identity (drone-123.ai-robot.eth), the lock verifies the manufacturer signature, and opens the secure drop-box.",
      tags: ["Verification", "Smart Locks", "Delivery"]
    },
    {
      icon: HeartPulse,
      title: "Medical Robotics",
      subtitle: "Compliance & Safety",
      desc: "Surgical robots require strict firmware version control. The registry stores the hash of the approved firmware. Before an operation, the hospital system checks the robot's on-chain identity to ensure it hasn't been tampered with.",
      tags: ["Healthcare", "Safety", "Compliance"]
    },
    {
      icon: HomeIcon,
      title: "Domestic Assistants",
      subtitle: "Service Payments",
      desc: "A home cleaning robot runs out of detergent. Instead of asking the owner, it uses its own wallet (bound to its identity) to order and pay for a refill using USDC, based on the allowance set by the owner.",
      tags: ["Micro-payments", "autonomy", "Smart Home"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-background">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-90">
          <img src={heroImage} alt="Robot Factory Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white" />
        </div>

        <div className="container relative z-10 px-6 pt-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block"
            >
              <span className="px-3 py-1 border border-primary/30 bg-white/80 backdrop-blur-md text-primary text-xs font-mono tracking-widest uppercase rounded-sm shadow-sm">
                Launching on Base
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground leading-tight drop-shadow-sm"
            >
              Identity for <br />
              <span className="text-primary">
                Humanoid Robots
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
            >
              The decentralized registry standard for the next generation of workforce. Issue unique, verifiable identities via the <span className="text-foreground font-mono font-semibold">AI Robot ID</span> <span className="bg-primary text-white px-2 py-0.5 rounded-md font-bold shadow-sm inline-block transform -translate-y-[1px]">API</span>.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <div className="flex w-full max-w-sm items-center space-x-2 shadow-lg rounded-sm">
                <input 
                  type="email" 
                  placeholder="ENTER_EMAIL_FOR_UPDATES" 
                  className="flex h-12 w-full bg-white border border-border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
                <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-none">
                  NOTIFY_ME
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Code Terminal Section - First Boot API */}
      <section className="py-24 border-y border-border/40 bg-white/50 backdrop-blur-sm">
        <div className="container px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                <span className="text-primary">First Boot</span> Identity Retrieval
              </h2>
              <p className="text-muted-foreground text-lg">
                Robots can autonomously request their own identity upon first power-on. 
                Our "First Boot" API delivers everything a machine needs to prove its existence and transact on-chain.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Instant issuance on Base",
                  "Enterprise Subscription Access",
                  "Cryptographically verifiable",
                  "Wallet-ready metadata"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-mono text-foreground/80">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative rounded-lg border border-border bg-[#1e1e1e] p-6 font-mono text-sm shadow-2xl">
                <div className="flex gap-2 mb-4 border-b border-white/10 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="space-y-2 text-green-400/90">
                  <p className="opacity-50 text-white">$ curl -X GET https://api.ai-robot.id/v1/robot/identity</p>
                  <p className="text-white/90">{`{`}</p>
                  <div className="pl-4 space-y-1">
                    <p><span className="text-purple-400">"ens_name"</span>: <span className="text-yellow-300">"optimus-prime.ai-robot.eth"</span>,</p>
                    <p><span className="text-purple-400">"owner"</span>: <span className="text-yellow-300">"0x71C...9A21"</span>,</p>
                    <p><span className="text-purple-400">"manufacturer"</span>: <span className="text-yellow-300">"Tesla Inc."</span>,</p>
                    <p><span className="text-purple-400">"firmware_hash"</span>: <span className="text-yellow-300">"0xa9b...f2e1"</span>,</p>
                    <p><span className="text-purple-400">"capabilities"</span>: [</p>
                    <p className="pl-4"><span className="text-yellow-300">"mobility"</span>, <span className="text-yellow-300">"manipulation"</span>, <span className="text-yellow-300">"vision"</span></p>
                    <p>],</p>
                    <p><span className="text-purple-400">"wallet"</span>: <span className="text-yellow-300">"0xB2...11F9"</span></p>
                  </div>
                  <p className="text-white/90">{`}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-background relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="container px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Protocol Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete suite of tools for issuing, managing, and verifying autonomous machine identities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Subdomain Issuance",
                desc: "Mint unique robot identities (e.g. model-serial.ai-robot.eth) instantly on Base.",
                icon: Globe
              },
              {
                title: "Bulk Minting",
                desc: "Register 10,000+ robot IDs in a single API call via CSV or JSON batch.",
                icon: Database
              },
              {
                title: "Metadata Management",
                desc: "Store mutable data: Model, Serial, Firmware, Factory Location, and Specs.",
                icon: FileCheck
              },
              {
                title: "Wallet Binding",
                desc: "Attach ETH, BTC, and USDC addresses for autonomous microtransactions.",
                icon: RefreshCw
              },
              {
                title: "Access Control",
                desc: "Manufacturer whitelisting to restrict issuance to specific factories.",
                icon: ShieldCheck
              },
              {
                title: "Reserved Names",
                desc: "Lock namespaces (optimus-001 to 999) before production begins.",
                icon: Lock
              },
              {
                title: "Ownership Transfer",
                desc: "Seamlessly transfer robot identity to new owners upon sale.",
                icon: User
              },
              {
                title: "Attestation Records",
                desc: "Publish firmware hashes and safety certificates on-chain.",
                icon: Key
              },
              {
                title: "Capability Schema",
                desc: "Define permission policies for movement, tasks, and API access.",
                icon: Settings
              },
            ].map((feature, i) => (
              <Card key={i} className="bg-white border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-display text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-50 border-y border-border relative scroll-mt-20">
         <div className="container px-6 max-w-4xl mx-auto">
            <div className="space-y-12">
              
              {/* Header */}
              <div className="space-y-6 text-center">
                <h2 className="text-4xl md:text-6xl font-display font-bold">
                  About <span className="text-primary">AI Robot ID</span>
                </h2>
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
                    <strong>AI Robot ID</strong> creates a standard for machine identity that is secure, decentralized, and human-readable. 
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
                    text: "Built on Base and ENS, our registry is censorship-resistant and permanently accessible."
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

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 bg-background relative scroll-mt-20">
        <div className="container px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl md:text-6xl font-display font-bold">
              Real World <span className="text-primary">Applications</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From factory floors to living rooms, decentralized identity unlocks new capabilities for autonomous machines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {cases.map((item, i) => (
              <Card key={i} className="h-full bg-white border-border hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      {item.subtitle}
                    </span>
                  </div>
                  <CardTitle className="font-display text-2xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-gray-100 border border-border text-xs font-mono text-foreground/70">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-24 p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold text-primary">Ready to integrate?</h3>
              <p className="text-muted-foreground">Explore our developer documentation to start issuing identities today.</p>
            </div>
            <div className="flex gap-4">
               <button className="px-6 py-3 bg-primary text-primary-foreground font-bold font-mono text-sm hover:bg-primary/90 transition-colors">
                 READ_DOCS
               </button>
               <button className="px-6 py-3 border border-border bg-background text-foreground font-bold font-mono text-sm hover:bg-accent transition-colors">
                 CONTACT_SALES
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Break / Quote */}
      <section className="py-24 bg-gray-50 border-y border-border relative overflow-hidden">
        <div className="container px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src={robotLineupImage} 
              alt="AI Robots with ENS Identities" 
              className="rounded-xl shadow-2xl border border-border opacity-95 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="md:w-1/2 space-y-6">
            <h3 className="text-3xl font-display font-bold leading-tight">
              "We are building the <span className="text-primary">DNS for Robots</span>."
            </h3>
            <p className="text-lg text-muted-foreground">
              As autonomous agents multiply, they need a verifiable, decentralized way to prove who they are, who made them, and who owns them. ai-robot.eth provides the global standard for this registry.
            </p>
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 font-mono mt-4 bg-white">
              VIEW_TECHNICAL_PAPER
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
