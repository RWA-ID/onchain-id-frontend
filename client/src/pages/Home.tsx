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
import { useAppKit } from "@reown/appkit/react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { SubnameSearch } from "@/components/SubnameSearch";
import { LicenseModal } from "@/components/LicenseModal";

export default function Home() {
  const [_, setLocation] = useLocation();
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);

  const handleGetLicense = () => {
    if (isConnected) {
      setLocation("/mint?action=license");
    } else {
      sessionStorage.setItem("connect_intent", "license");
      open();
    }
  };

  // Auto-redirect to mint dashboard if connected
  useEffect(() => {
    if (isConnected) {
      const intent = sessionStorage.getItem("connect_intent");
      if (intent === "license") {
        sessionStorage.removeItem("connect_intent");
        setLocation("/mint?action=license");
      } else {
        setLocation("/mint");
      }
    }
  }, [isConnected, setLocation]);

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
              className="text-3xl sm:text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground leading-tight drop-shadow-sm max-w-5xl mx-auto"
            >
              Programmable Identity <br />
              <span className="text-primary">
                Infrastructure
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-3 max-w-2xl mx-auto"
            >
              <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-medium">
                Onchain ID is the identity layer for robots, machines, devices, and fleets — verifiable onchain, interoperable by design.
              </p>
              <p className="text-lg text-foreground/70 font-medium">
                Not custody. Not a wallet. Just naming + rights on Ethereum.
              </p>
            </motion.div>

            {/* Subname Search Component */}
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="mt-8"
            >
               <SubnameSearch />
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
                        <div className="text-xs text-muted-foreground uppercase font-bold">Tier 1 (Starter)</div>
                        <div className="text-xl font-bold text-primary">$4.50 <span className="text-xs text-muted-foreground">/ ID</span></div>
                        <div className="text-xs text-muted-foreground">1 - 10 Units</div>
                      </div>
                      <div className="p-3 bg-white border border-border rounded-lg shadow-sm">
                        <div className="text-xs text-muted-foreground uppercase font-bold">Tier 2 (Growth)</div>
                        <div className="text-xl font-bold text-primary">$3.00 <span className="text-xs text-muted-foreground">/ ID</span></div>
                        <div className="text-xs text-muted-foreground">11 - 50 Units</div>
                      </div>
                      <div className="p-3 bg-white border border-border rounded-lg shadow-sm">
                        <div className="text-xs text-muted-foreground uppercase font-bold">Tier 3 (Volume)</div>
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
                    onClick={handleGetLicense}
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

      {/* About Onchain ID Section */}
      <section className="py-24 bg-white border-y border-border/40">
        <div className="container px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">About Onchain ID</h2>
              <p className="text-muted-foreground text-lg">
                Enterprise-grade identity infrastructure for the autonomous economy.
              </p>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Onchain ID is an identity layer built on Ethereum using ENS-based naming.</strong> We provide a standardized way to issue verifiable names (subdomains) for machines, devices, robots, fleets, environments, and teams.
              </p>
              <p>
                <strong className="text-foreground">Onchain ID is not a custody provider and does not hold customer funds.</strong> OEMs and customers control wallets, keys, and operational policies. We provide the naming and rights infrastructure — nothing more.
              </p>
              <p>
                <strong className="text-foreground">License ownership is onchain and verifiable.</strong> License holders can issue unlimited subdomains under their licensed namespace via the dashboard. Licenses are ERC-721 tokens that can be transferred, sold, or held as appreciating assets.
              </p>
              <p>
                <strong className="text-foreground">Interoperable by design:</strong> names can be resolved across the Ethereum ecosystem and integrated into existing workflows. Any ENS-compatible resolver, wallet, or application can recognize Onchain ID subdomains.
              </p>
            </div>

            {/* What This Is / What This Isn't */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                <h3 className="font-display font-bold text-lg text-green-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  What This Is
                </h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Identity + naming + onchain proof of rights</li>
                  <li>• Issuance controls for OEMs and enterprises</li>
                  <li>• Verifiable subdomain registration</li>
                  <li>• Interoperable ENS-based infrastructure</li>
                </ul>
              </div>
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <h3 className="font-display font-bold text-lg text-red-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  What This Isn't
                </h3>
                <ul className="space-y-2 text-red-700">
                  <li>• Custody (we don't hold funds)</li>
                  <li>• A payment processor</li>
                  <li>• An OEM-specific closed system</li>
                  <li>• A wallet or key management service</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 border-b border-border/40">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Common questions about Onchain ID and how it works.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="what-is" className="bg-white border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-display font-semibold text-lg hover:no-underline">
                  What is Onchain ID?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Onchain ID is a programmable identity layer for robots, machines, devices, and autonomous systems. It provides verifiable onchain identities powered by Ethereum and ENS-based naming, allowing manufacturers and operators to issue, manage, and verify machine identities at scale.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="custody" className="bg-white border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-display font-semibold text-lg hover:no-underline">
                  Is this custody?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  No. Onchain ID is not a custody provider and does not hold customer funds. OEMs and users control their own keys and wallets. We provide naming and identity infrastructure only — you maintain full control over your assets and operations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="license" className="bg-white border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-display font-semibold text-lg hover:no-underline">
                  Do I need a license?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  License holders can issue unlimited subdomains under their licensed namespace with no per-subdomain fees. Non-holders can pay per subdomain with tiered pricing: $4.50 for 1-10 units, $3.00 for 11-50 units, and $1.50 for 51+ units. For high-volume issuers, the $99,000 unlimited license provides the best long-term value.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how-it-works" className="bg-white border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-display font-semibold text-lg hover:no-underline">
                  How does subdomain registration work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Connect your wallet, select a namespace (robot-id.eth, drone-id.eth, etc.), enter a name or upload a CSV for bulk registration, and confirm the transaction. Your subdomains are minted as ENS names wrapped in the ENS NameWrapper contract, giving you full ownership and control.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="interoperability" className="bg-white border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-display font-semibold text-lg hover:no-underline">
                  Are Onchain ID names interoperable?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  Yes. Onchain ID names are standard ENS subdomains and can be resolved by any ENS-compatible application, wallet, or service. They work across the entire Ethereum ecosystem and can be integrated into existing workflows without custom infrastructure.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
