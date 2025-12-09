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
  Server,
  Upload,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import heroImage from "@assets/generated_images/pristine_high-tech_robot_factory_assembly_line_with_bright_lighting.png";
const robotLineupImage = "/assets/B55F00D4-FA9C-4B8B-B8D8-B59433051F95_1765296692722.PNG";
const bulkMintImage = "/assets/1FADDC47-4F0D-4DD9-A0CF-9F40D1A97308_1765297034311.PNG";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MintCalculator } from "@/components/MintCalculator";

// const pricingTiers = [
//   { min: 1,      max: 99,      priceUSD: 0.49 },
//   { min: 100,    max: 999,     priceUSD: 0.19 },
//   { min: 1_000,  max: 9_999,   priceUSD: 0.079 },
//   { min: 10_000, max: 49_999,  priceUSD: 0.049 },
//   { min: 50_000, max: 249_999, priceUSD: 0.029 },
//   { min: 250_000, max: 1_000_000_000, priceUSD: 0.019 }
// ];

export default function Home() {
  const cases = [
    {
      icon: Factory,
      title: "Industrial Workforce",
      subtitle: "Secure Manufacturing",
      desc: "General-purpose humanoid workers need verified identities to operate on production lines and access restricted zones. Using AI Robot ID, every humanoid unit has a unique on-chain identity that safety systems verify instantly, replacing the need for manual badge scans.",
      tags: ["Access Control", "Safety Protocols", "Audit Logs"]
    },
    {
      icon: User,
      title: "Retail & Hospitality",
      subtitle: "Customer Interaction",
      desc: "A humanoid concierge needs to process payments and handle sensitive customer data. With a verified identity, the robot can sign transactions and prove their authorized status to customers, building trust in public-facing roles.",
      tags: ["Payments", "Trust", "Service"]
    },
    {
      icon: HeartPulse,
      title: "Healthcare Assistance",
      subtitle: "Patient Care & Safety",
      desc: "Humanoid nursing assistants require strict firmware validation before interacting with patients. The registry stores the hash of approved medical firmware, ensuring only compliant and unmodified units are allowed in sensitive hospital wards.",
      tags: ["Compliance", "Safety", "Medical"]
    },
    {
      icon: HomeIcon,
      title: "Domestic Service",
      subtitle: "Household Autonomy",
      desc: "Your general-purpose humanoid butler needs to buy groceries or pay for repairs. Bound to its identity, it uses its own wallet to handle household expenses securely, based on the strict allowance and policy set by the owner.",
      tags: ["Micro-payments", "Privacy", "Smart Home"]
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
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground leading-tight drop-shadow-sm max-w-5xl mx-auto"
            >
              Decentralized Identity For <br />
              <span className="text-primary">
                Robots, Drones, Vehicles & Devices
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Give every autonomous machine a secure, verifiable, and portable digital identity onchain.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button 
                              onClick={openConnectModal}
                              className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-none text-lg"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              START MINTING
                            </Button>
                          );
                        }
                        
                        // If connected, scroll to calculator or show "Connected" state
                        return (
                          <Button 
                            onClick={() => document.getElementById('mint-calculator')?.scrollIntoView({ behavior: 'smooth' })}
                            className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-none text-lg"
                          >
                             MINTING DASHBOARD
                          </Button>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bulk Minting Visualization Section */}
      <section className="py-24 border-y border-border/40 bg-white/50 backdrop-blur-sm">
        <div className="container px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                <span className="text-primary">Bulk Minting</span> Workflow
              </h2>
              <p className="text-muted-foreground text-lg">
                Register thousands of robot identities in seconds. Simply upload a CSV file with your fleet's details.
                First come, first serve.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Choose robot-id.eth or machine-id.eth",
                  "CSV Upload (6 columns)",
                  "Instant on-chain registration",
                  "Full ownership & control"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-mono text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative rounded-lg border border-border bg-white p-1 shadow-2xl overflow-hidden">
                <img 
                  src={bulkMintImage} 
                  alt="Robots in a factory line ready for identity minting" 
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50 border-y border-border">
        <div className="container px-6 max-w-5xl mx-auto text-center space-y-12">
           <MintCalculator />
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
                desc: "Choose between robot-id.eth or machine-id.eth for your fleet identities.",
                icon: Globe
              },
              {
                title: "Bulk Minting",
                desc: "Upload CSV with Name, Make, Model, Serial, Website, and Social columns.",
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
                desc: "Define permission policies for movement, tasks, and system access.",
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
                  About <span className="text-primary">Robot ID</span>
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
                    <strong>Robot ID</strong> creates a standard for machine identity that is secure, decentralized, and human-readable. 
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
              As autonomous robots multiply, they need a verifiable, decentralized way to prove who they are, who made them, and who owns them. Robot ID provides the global standard for this registry.
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
