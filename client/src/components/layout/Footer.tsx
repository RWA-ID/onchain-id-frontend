import { Cpu, Github, Twitter } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-4 cursor-pointer">
              <Cpu className="w-5 h-5 text-primary" />
              <span className="font-mono font-bold text-lg">
                ai-robot<span className="text-primary">.eth</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              The decentralized registry standard for autonomous machine identity.
              Securing the future of robot-human interaction on Base.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4 text-foreground">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Registry Explorer</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Manufacturer Portal</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Status</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4 text-foreground">
              Connect
            </h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-500">SYSTEM ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-mono">
          <p>© 2025 AI-Robot Registry. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
