import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useLocation } from "wouter";
import { 
  Loader2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Bot, 
  Server, 
  Tablet, 
  Plane, 
  Car,
  AlertCircle
} from "lucide-react";
import { createPublicClient, http, custom } from "viem";
import { namehash } from "viem/ens";
import { mainnet } from "viem/chains";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
const ENS_REGISTRY_ABI = [
  {
    inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Valid namespaces
const NAMESPACES = [
  "robot-id.eth",
  "machine-id.eth",
  "device-id.eth",
  "drone-id.eth",
  "vehicle-id.eth"
];

const NAMESPACE_ICONS: Record<string, any> = {
  "robot-id.eth": Bot,
  "machine-id.eth": Server,
  "device-id.eth": Tablet,
  "drone-id.eth": Plane,
  "vehicle-id.eth": Car
};

export function SubnameSearch() {
  const [namespace, setNamespace] = useState<string>("robot-id.eth");
  const [label, setLabel] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [status, setStatus] = useState<"idle" | "available" | "taken" | "invalid">("idle");
  const [_, setLocation] = useLocation();
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const { toast } = useToast();
  
  // Track pending registration intent after wallet connects
  const pendingRegistration = useRef<{ namespace: string; label: string } | null>(null);
  
  // Effect to redirect after wallet connects if there's a pending registration
  useEffect(() => {
    if (isConnected && pendingRegistration.current) {
      const { namespace: ns, label: lbl } = pendingRegistration.current;
      pendingRegistration.current = null;
      setLocation(`/mint?namespace=${ns}&label=${lbl}`);
    }
  }, [isConnected, setLocation]);

  const fullDomain = label ? `${label}.${namespace}` : `(name).${namespace}`;

  // Reset status on input change
  useEffect(() => {
    setStatus("idle");
  }, [label, namespace]);

  const validateLabel = (text: string) => {
    // Lowercase everything
    const lower = text.toLowerCase();
    
    // Check characters: a-z, 0-9, -
    const validChars = /^[a-z0-9-]+$/;
    if (!validChars.test(lower)) return false;

    // Disallow leading/trailing -
    if (lower.startsWith("-") || lower.endsWith("-")) return false;

    // Disallow consecutive --
    if (lower.includes("--")) return false;

    // Length 1-63
    if (lower.length < 1 || lower.length > 63) return false;

    return true;
  };

  const handleSearch = async () => {
    if (!label) return;

    if (!validateLabel(label)) {
      setStatus("invalid");
      return;
    }

    setIsSearching(true);
    try {
      const transport = window.ethereum ? custom(window.ethereum as any) : http("https://eth.merkle.io");
      const publicClient = createPublicClient({ chain: mainnet, transport });
      
      const node = namehash(`${label}.${namespace}`);
      
      const owner = await publicClient.readContract({
        address: ENS_REGISTRY_ADDRESS,
        abi: ENS_REGISTRY_ABI,
        functionName: "owner",
        args: [node],
      });

      if (owner === "0x0000000000000000000000000000000000000000") {
        setStatus("available");
      } else {
        setStatus("taken");
      }
    } catch (e) {
      console.error("Search failed", e);
      toast({
        title: "Error",
        description: "Failed to check availability. Please try again.",
        variant: "destructive"
      });
      setStatus("idle");
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = () => {
    if (!isConnected) {
      // Store the pending registration intent
      pendingRegistration.current = { namespace, label };
      // Open the RainbowKit connect modal
      if (open) {
        open();
      }
      return;
    }
    
    // Already connected - redirect directly to mint page
    setLocation(`/mint?namespace=${namespace}&label=${label}`);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.toLowerCase(); // Force lowercase on input? 
      // User requirement: "Validation: Lowercase everything."
      // Let's just pass raw input to state but validate lowercase logic.
      // Better UX: auto-lowercase as they type for domains.
      setLabel(val);
  };

  const Icon = NAMESPACE_ICONS[namespace] || Bot;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 relative z-20">
      <Card className="bg-white/90 backdrop-blur-xl border-white/20 shadow-2xl overflow-visible ring-1 ring-black/5">
        <CardContent className="p-6 md:p-8 space-y-6">
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                
                {/* Namespace Selector */}
                <div className="w-full md:w-1/3 shrink-0">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block ml-1">
                        Namespace
                    </label>
                    <Select value={namespace} onValueChange={setNamespace}>
                        <SelectTrigger className="h-14 text-lg bg-white border-slate-200 focus:ring-primary/20">
                            <SelectValue placeholder="Select namespace" />
                        </SelectTrigger>
                        <SelectContent>
                            {NAMESPACES.map((ns) => {
                                const ItemIcon = NAMESPACE_ICONS[ns];
                                return (
                                    <SelectItem key={ns} value={ns} className="py-3">
                                        <div className="flex items-center gap-2">
                                            {ItemIcon && <ItemIcon className="w-4 h-4 text-muted-foreground" />}
                                            <span className="font-mono font-bold">{ns}</span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Name Input */}
                <div className="w-full flex-grow relative">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block ml-1">
                        Identity Label
                    </label>
                    <div className="relative">
                        <Input 
                            value={label}
                            onChange={handleLabelChange}
                            placeholder="e.g. alpha, unit-01"
                            className="h-14 text-lg font-mono pl-4 pr-12 bg-white border-slate-200 focus-visible:ring-primary/20"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <Icon className="w-5 h-5 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="w-full md:w-auto mt-auto pt-6">
                    <Button 
                        size="lg" 
                        className="h-14 w-full md:w-auto px-8 font-bold text-lg shadow-lg shadow-primary/20"
                        onClick={handleSearch}
                        disabled={!label || isSearching}
                    >
                        {isSearching ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Search"
                        )}
                    </Button>
                </div>
            </div>

            {/* Results & Preview Area */}
            <div className="bg-slate-50 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="font-mono text-lg text-slate-500">
                        {label ? label : "(name)"}
                        <span className="opacity-50">.{namespace}</span>
                    </span>
                </div>

                {status === "available" && (
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                        <span className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            <CheckCircle2 className="w-4 h-4" />
                            Available
                        </span>
                        <Button onClick={handleRegister} className="h-9 bg-green-600 hover:bg-green-700 text-white font-bold gap-2">
                            Register Now <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {status === "taken" && (
                    <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100 animate-in fade-in slide-in-from-left-4 duration-300">
                        <XCircle className="w-4 h-4" />
                        Taken
                    </div>
                )}

                {status === "invalid" && (
                    <div className="flex items-center gap-2 text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-100 animate-in fade-in slide-in-from-left-4 duration-300">
                        <AlertCircle className="w-4 h-4" />
                        Invalid Format
                    </div>
                )}
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
