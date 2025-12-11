import { Link, useLocation } from "wouter";
import { Cpu, Menu, X, Terminal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "#about", label: "About" },
    { href: "#use-cases", label: "Use Cases" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group cursor-pointer">
          <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <span className="font-mono font-bold text-xl tracking-tight">
            Onchain <span className="text-primary">ID</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-sm font-medium transition-colors hover:text-primary cursor-pointer text-muted-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="font-mono text-xs h-9 border-primary/20 hover:border-primary/50 hover:bg-primary/5 hover:text-primary" disabled>
            <Terminal className="w-3 h-3 mr-2" />
            DOCS_V1 (SOON)
          </Button>
          <ConnectButton 
            accountStatus="address" 
            chainStatus="icon"
            showBalance={false}
          />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border p-6 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-lg font-medium cursor-pointer text-muted-foreground hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <div className="h-px bg-border my-2" />
          <div className="flex justify-center">
             <ConnectButton 
                accountStatus="address" 
                chainStatus="icon"
                showBalance={false}
              />
          </div>
        </div>
      )}
    </nav>
  );
}
