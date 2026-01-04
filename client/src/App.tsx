import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiAdapter, projectId, networks } from "./lib/wagmi";
import { createAppKit } from "@reown/appkit/react";
import { mainnet } from "@reown/appkit/networks";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import MintPage from "@/pages/Mint";
import AboutUs from "@/pages/AboutUs";
import UseCases from "@/pages/UseCases";
import Profile from "@/pages/Profile";

const metadata = {
  name: "Onchain ID",
  description: "Programmable Identity Infrastructure for Robots, Machines, Devices & Fleets",
  url: "https://onchain-id.id",
  icons: ["https://onchain-id.id/favicon.png"]
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet],
  defaultNetwork: mainnet,
  metadata,
  features: {
    email: true,
    socials: ['google', 'x', 'github', 'discord', 'apple', 'farcaster'],
    emailShowWallets: true
  },
  themeMode: 'light'
});

function Router() {
  return (
    <Switch>
      <Route path="/mint" component={MintPage} />
      <Route path="/profile" component={Profile} />
      <Route path="/aboutus" component={AboutUs} />
      <Route path="/usecases" component={UseCases} />
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ErrorBoundary>
            <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/30">
              <Navbar />
              <Router />
              <Footer />
              <Toaster />
            </div>
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
