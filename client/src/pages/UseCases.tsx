import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, User, HeartPulse, Home as HomeIcon } from "lucide-react";

export default function UseCases() {
  const cases = [
    {
      icon: Factory,
      title: "Industrial Workforce",
      subtitle: "Secure Manufacturing",
      desc: "General-purpose humanoid workers need verified identities to operate on production lines and access restricted zones. Using Onchain ID, every humanoid unit has a unique on-chain identity that safety systems verify instantly, replacing the need for manual badge scans.",
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
    <div className="min-h-screen pt-20">
      <section className="py-24 bg-background relative">
        <div className="container px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <h1 className="text-4xl md:text-6xl font-display font-bold">
              Real World <span className="text-primary">Applications</span>
            </h1>
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
        </div>
      </section>
    </div>
  );
}
