import { motion } from "framer-motion";
import { Truck, HeartPulse, Home as HomeIcon, Factory, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UseCases() {
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
    <div className="min-h-screen pt-20 pb-24 bg-background">
      <div className="container px-6 max-w-6xl mx-auto">
        <div className="text-center py-16 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold"
          >
            Real World <span className="text-secondary">Applications</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From factory floors to living rooms, decentralized identity unlocks new capabilities for autonomous machines.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {cases.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full bg-card/30 border-border hover:border-secondary/50 transition-all hover:bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-3 rounded-lg bg-secondary/10 text-secondary">
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
                      <span key={tag} className="px-2 py-1 rounded-md bg-background border border-border text-xs font-mono text-foreground/70">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8">
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
    </div>
  );
}
