import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
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

const robotImage = "/assets/robot_id.png";
const droneImage = "/assets/drone_id.png";
const deviceImage = "/assets/device_id.png";
const vehicleImage = "/assets/vehicle_id.png";
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

import { MintCalculator } from "@/components/MintCalculator"; // Keep if needed or remove if unused, but we need LicenseModal
import { LicenseModal } from "@/components/LicenseModal"; // Add this

export default function Home() {
  const [_, setLocation] = useLocation();
  const { isConnected } = useAccount();
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);

  // Auto-redirect to mint dashboard if connected
  useEffect(() => {
    // We might want to disable auto-redirect if we want users to see the landing page and buy license?
    // User requirement: "Redirect user to Dashboard" AFTER license purchase.
    // Existing code redirects automatically on connect.
    // If we auto-redirect, user can't click "Get License" on Home if they are already connected.
    // Maybe we should remove this auto-redirect or make it smarter?
    // The prompt says: "If wallet is not connected, prompt Connect Wallet. After connection, show: Parent selector..."
    // If I redirect immediately, they go to Mint page.
    
    // Let's REMOVE the auto-redirect effect for now to allow interaction with Home page buttons,
    // OR allow the Mint page to handle it? 
    // Actually, "Get License" button is on Home page.
    // If I am connected, I should be able to click it.
    // So auto-redirect prevents me from seeing Home page.
    
    // I will remove the auto-redirect effect to allow full landing page experience.
    // Users can click "Minting Dashboard" (which I added in previous step) to go to /mint.
  }, [isConnected, setLocation]);

  const cases = [
    {
      icon: Factory,
      title: "Industrial Workforce",
      subtitle: "Secure Manufacturing",
      desc: "General-purpose humanoid workers need verified identities to operate on production lines and access restricted zones. Using AI Onchain ID, every humanoid unit has a unique on-chain identity that safety systems verify instantly, replacing the need for manual badge scans.",
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
                            onClick={() => setLocation('/mint')}
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
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  <span className="text-primary">Bulk Minting</span> Workflow
                </h2>
                <p className="text-muted-foreground text-lg">
                  Register thousands of robot identities in seconds with our streamlined process.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                   <h3 className="font-bold font-mono text-lg flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</span>
                      Workflow Steps
                   </h3>
                   <ul className="ml-8 space-y-2 text-sm text-muted-foreground">
                      <li>• Connect Wallet & Select Zone (Robot, Drone, etc.)</li>
                      <li>• Upload CSV Fleet Data or Enter Single Name</li>
                      <li>• Automatic Pricing Calculation (Chainlink Oracle)</li>
                      <li>• Confirm Transaction & Receive Onchain IDs</li>
                   </ul>
                </div>

                <div className="space-y-2">
                   <h3 className="font-bold font-mono text-lg flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">2</span>
                      Volume Pricing Tiers
                   </h3>
                   <div className="grid grid-cols-3 gap-4 ml-8">
                      <div className="p-3 bg-white border border-border rounded-lg shadow-sm">
                        <div className="text-xs text-muted-foreground uppercase font-bold">Tier 0 (Starter)</div>
                        <div className="text-xl font-bold text-primary">$4.50 <span className="text-xs text-muted-foreground">/ ID</span></div>
                        <div className="text-xs text-muted-foreground">1 - 10 Units</div>
                      </div>
                      <div className="p-3 bg-white border border-border rounded-lg shadow-sm">
                        <div className="text-xs text-muted-foreground uppercase font-bold">Tier 1 (Growth)</div>
                        <div className="text-xl font-bold text-primary">$3.00 <span className="text-xs text-muted-foreground">/ ID</span></div>
                        <div className="text-xs text-muted-foreground">11 - 50 Units</div>
                      </div>
                      <div className="p-3 bg-white border border-border rounded-lg shadow-sm">
                        <div className="text-xs text-muted-foreground uppercase font-bold">Tier 2 (Scale)</div>
                        <div className="text-xl font-bold text-primary">$1.50 <span className="text-xs text-muted-foreground">/ ID</span></div>
                        <div className="text-xs text-muted-foreground">51+ Units</div>
                      </div>
                   </div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-6 relative group">
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


      {/* Unlimited License Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden border-y border-white/10">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-blue-500/5 blur-[120px] rounded-full -translate-x-1/2" />

        <div className="container px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              Unlimited Issuance <span className="text-primary">License</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Own the license forever. Issue unlimited subdomains. Define the identity standard for your ecosystem.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Benefits List */}
            <div className="space-y-8">
               <div className="grid gap-6">
                 {[
                   {
                     title: "Unlimited Subdomains (Forever)",
                     desc: "Issue an unlimited number of subdomains under your licensed parent — permanently, with no expiration."
                   },
                   {
                     title: "Lowest Effective Cost at Scale",
                     desc: "Eliminate per-subdomain fees entirely and reduce issuance costs to near zero as usage grows."
                   },
                   {
                     title: "Priority Dashboard Access",
                     desc: "License holders unlock the full issuance dashboard with advanced bulk tools and controls."
                   },
                   {
                     title: "Brand & Namespace Protection",
                     desc: "Secure your namespace once and maintain long-term control over how identities are issued."
                   },
                   {
                     title: "Enterprise-Grade Workflows",
                     desc: "Designed for manufacturers, platforms, and OEMs issuing identities to devices, robots, vehicles, and teams."
                   }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                     <div className="mt-1">
                       <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                     </div>
                     <div>
                       <h3 className="font-bold text-lg text-white">{item.title}</h3>
                       <p className="text-slate-400 text-sm leading-relaxed mt-1">{item.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Price Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl space-y-8 text-center">
                 <div className="space-y-2">
                   <h3 className="text-sm font-mono text-primary uppercase tracking-wider font-bold">License Price</h3>
                   <div className="text-6xl font-display font-bold text-white">$99,000</div>
                   <p className="text-sm text-slate-400">One-time payment • Lifetime ownership</p>
                 </div>
                 
                 <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Asset Type</span>
                      <span className="font-mono text-white">ERC-721 Token</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Supply</span>
                      <span className="font-mono text-white">Scarce & Appreciating</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Network</span>
                      <span className="font-mono text-white">Ethereum Mainnet</span>
                   </div>
                 </div>

                 <Button 
                    className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white mt-4 cursor-pointer" 
                    onClick={() => setLicenseModalOpen(true)}
                 >
                    Get License
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <LicenseModal open={licenseModalOpen} onOpenChange={setLicenseModalOpen} />

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
                desc: "Choose between robot-id.eth, machine-id.eth, device-id.eth, drone-id.eth, or vehicle-id.eth for your fleet identities.",
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
              <Card key={i} className="h-full flex flex-col bg-white border-primary/10 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent group-hover:via-primary transition-all duration-500" />
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-110">
                    <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="font-display text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
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
                  About <span className="text-primary">Onchain ID</span>
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
        <div className="container px-6 relative z-10 flex flex-col items-center gap-12 text-center">
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-display font-bold leading-tight">
              "We are building the <span className="text-primary">DNS for Robots</span>, Drones, Devices & Vehicles."
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              As autonomous machines multiply, they need a verifiable, decentralized way to prove who they are, who made them, and who owns them. Onchain ID provides the global standard for this registry.
            </p>
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 font-mono mt-4 bg-white">
              VIEW_TECHNICAL_PAPER
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl mt-8">
            <div className="group relative aspect-square rounded-xl overflow-hidden shadow-lg border border-border">
              <img src={robotImage} alt="Robot ID" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-mono font-bold">robot-id.eth</span>
              </div>
            </div>
            <div className="group relative aspect-square rounded-xl overflow-hidden shadow-lg border border-border">
              <img src={droneImage} alt="Drone ID" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-mono font-bold">drone-id.eth</span>
              </div>
            </div>
            <div className="group relative aspect-square rounded-xl overflow-hidden shadow-lg border border-border">
              <img src={deviceImage} alt="Device ID" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-mono font-bold">device-id.eth</span>
              </div>
            </div>
            <div className="group relative aspect-square rounded-xl overflow-hidden shadow-lg border border-border">
              <img src={vehicleImage} alt="Vehicle ID" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-mono font-bold">vehicle-id.eth</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
