import { Switch, Route, useLocation } from "wouter";
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
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import MintPage from "@/pages/Mint";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy load pages to avoid bundle issues and circular dependencies
const AboutUs = lazy(() => import("@/pages/AboutUs"));
const UseCases = lazy(() => import("@/pages/UseCases"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  console.log("Current location:", location);

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/mint" component={MintPage} />
        <Route path="/aboutus" component={AboutUs} />
        <Route path="/usecases" component={UseCases} />
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
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
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
