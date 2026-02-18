import { Cpu, Github, Mail } from "lucide-react";
import { Link } from "wouter";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function EtherscanIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 293.775 293.667" fill="currentColor">
      <path d="M61.218,135.822a9.8,9.8,0,0,1,9.795-9.791l22.279.008a9.8,9.8,0,0,1,9.793,9.794l-.012,71.439a2.129,2.129,0,0,0,2.739,2.053,131.072,131.072,0,1,0-47.418,0,2.122,2.122,0,0,0,2.812-2.016Z"/>
      <path d="M147.112,96.217c32.7,0,59.2,26.5,59.2,59.2v45.932a2.127,2.127,0,0,0,3.062,1.909,131.2,131.2,0,1,0-124.513,0,2.127,2.127,0,0,0,3.062-1.909V155.42C88.016,122.714,114.408,96.217,147.112,96.217Z" fill="none" stroke="currentColor" strokeWidth="16"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-4 cursor-pointer">
              <Cpu className="w-5 h-5 text-primary" />
              <span className="font-mono font-bold text-lg">
                Onchain <span className="text-primary">ID</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              The decentralized registry standard for autonomous machine identity.
              Securing the future of robot-human interaction on Ethereum.
            </p>
          </div>

          <div>
            <h4 className="font-mono font-bold text-sm uppercase tracking-wider mb-4 text-foreground">
              Protocol
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="https://github.com/onchain-idllc/onchain-id-protocol" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://etherscan.io/address/0x912C98f1d76728e3A33A6aeFE4d1aB7F6ccfb8cD" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                  <EtherscanIcon className="w-4 h-4" />
                  Etherscan
                </a>
              </li>
            </ul>
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
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="mailto:info@onchain-id.id" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@onchain-id.id
                </a>
              </li>
              <li>
                <a href="https://x.com/onchain_id" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                  <XIcon className="w-4 h-4" />
                  @onchain_id
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-500">SYSTEM ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-mono">
          <p>© 2025 Onchain ID. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
