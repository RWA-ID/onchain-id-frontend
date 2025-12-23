import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "./lib/wagmi";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import MintPage from "@/pages/Mint";
import AboutUs from "@/pages/AboutUs";
import UseCases from "@/pages/UseCases";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/mint" component={MintPage} />
      <Route path="/aboutus" component={AboutUs} />
      <Route path="/usecases" component={UseCases} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <TooltipProvider>
            <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/30">
              <Navbar />
              <Router />
              <Footer />
              <Toaster />
            </div>
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
