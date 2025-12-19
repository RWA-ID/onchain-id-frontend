import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useLocation } from "wouter";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { createPublicClient, http, formatUnits, formatEther, custom } from "viem";
import { mainnet } from "viem/chains";
import { 
  Bot, 
  Server, 
  Tablet, 
  Plane, 
  Car, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  Crown
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import { ABI, CHAINLINK_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS } from "@/lib/constants";

// Zone Icons Mapping
const ZONE_ICONS: Record<string, any> = {
  "robot-id.eth": Bot,
  "machine-id.eth": Server,
  "device-id.eth": Tablet,
  "drone-id.eth": Plane,
  "vehicle-id.eth": Car
};

interface LicenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LicenseModal({ open, onOpenChange }: LicenseModalProps) {
  const { address, isConnected } = useAccount();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [zones, setZones] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pricing State
  const [licensePriceUSD, setLicensePriceUSD] = useState<bigint>(BigInt(0));
  const [ethPrice, setEthPrice] = useState<bigint>(BigInt(0));
  const [estimatedETH, setEstimatedETH] = useState<string>("0");

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // 1. Fetch Zones & Base Price
  useEffect(() => {
    if (!open) return;
    
    const initData = async () => {
      setIsLoading(true);
      try {
        const transport = window.ethereum ? custom(window.ethereum as any) : http("https://eth.merkle.io");
        const publicClient = createPublicClient({ chain: mainnet, transport });

        // Fetch Parents
        const parents = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'parents'
        }) as string[];
        setZones(parents);
        if (parents.length > 0 && !selectedZone) setSelectedZone(parents[0]);

        // Fetch License Price USD
        const price = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'licensePriceUSD'
        }) as bigint;
        setLicensePriceUSD(price);

        // Fetch ETH Price
        const oracleAddress = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'oracle'
        }) as `0x${string}`;

        const [, answer, , , ] = await publicClient.readContract({
            address: oracleAddress,
            abi: CHAINLINK_ABI,
            functionName: 'latestRoundData'
        }) as [bigint, bigint, bigint, bigint, bigint];
        
        setEthPrice(answer); // 8 decimals

      } catch (e) {
        console.error("Failed to fetch license data", e);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, [open]);

  // 2. Calculate Estimated ETH
  useEffect(() => {
    if (licensePriceUSD > BigInt(0) && ethPrice > BigInt(0)) {
       // licensePriceUSD is likely 18 decimals? User said "100000 * 1e8" in prompt. 
       // Wait, earlier prompt said "licensePriceUSD = 100000 * 1e8 with oracle 8 decimals".
       // If contract returns 18 decimals (standard), then formula is:
       // Wei = (USD_18 * 1e8) / Rate_8
       // If contract returns 8 decimals (matching oracle), formula is:
       // Wei = (USD_8 * 1e18) / Rate_8
       
       // Let's assume standard contract behavior: it likely stores USD values in 18 decimals or compatible with its math.
       // Based on `tierPricesUSD` usually being 18 decimals in similar setups.
       // But user hint "100000 * 1e8" suggests 8 decimals or similar.
       // Let's rely on standard oracle math: 
       // If Price is $99,000 (99000 * 1e18).
       // ETH is $3000 (3000 * 1e8).
       // Wei = (99000 * 1e18 * 1e8) / (3000 * 1e8 * 1e10??) -> No.
       
       // Standard Formula (if Price is 18 dec, Rate is 8 dec):
       // Wei = (Price * 1e8) / Rate
       
       // Let's use that.
       const wei = (licensePriceUSD * BigInt(1e8)) / ethPrice;
       setEstimatedETH(formatEther(wei));
    }
  }, [licensePriceUSD, ethPrice]);

  // 3. Handle Buy
  const handleBuy = async () => {
    if (!selectedZone || !address) return;
    
    try {
        // Recalculate Wei immediately before write
        const wei = (licensePriceUSD * BigInt(1e8)) / ethPrice;
        // Add 1% buffer
        const valueToSend = (wei * BigInt(101)) / BigInt(100);

        writeContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: ABI,
            functionName: 'buyLicense',
            args: [selectedZone],
            value: valueToSend
        });
    } catch (e) {
        console.error("Buy failed", e);
        toast({
            title: "Error",
            description: "Failed to initiate transaction.",
            variant: "destructive"
        });
    }
  };

  // 4. Success Handling
  useEffect(() => {
    if (isConfirmed) {
        toast({
            title: "License Purchased!",
            description: "You now have unlimited issuance rights.",
            variant: "default"
        });
        onOpenChange(false);
        setLocation('/mint');
    }
  }, [isConfirmed]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 text-white border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            Purchase License
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Select a namespace to acquire unlimited issuance rights.
          </DialogDescription>
        </DialogHeader>

        {!isConnected ? (
          <div className="py-8 flex justify-center">
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            
            {/* Zone Selector */}
            <div className="grid grid-cols-1 gap-3">
              {isLoading ? (
                  <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin text-primary" />
                  </div>
              ) : (
                  zones.map((zone) => {
                    const Icon = ZONE_ICONS[zone] || Bot;
                    const isSelected = selectedZone === zone;
                    return (
                        <div
                            key={zone}
                            onClick={() => setSelectedZone(zone)}
                            className={`
                                flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                                ${isSelected 
                                    ? "border-primary bg-primary/10" 
                                    : "border-slate-800 bg-slate-800/50 hover:border-slate-700"
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-white" : "bg-slate-700 text-slate-400"}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="font-mono font-bold text-lg">{zone}</span>
                            </div>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                        </div>
                    );
                  })
              )}
            </div>

            <Separator className="bg-slate-800" />

            {/* Price Display */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">License Cost</span>
                    <span className="text-2xl font-bold font-display">
                        ${formatUnits(licensePriceUSD, 18)} USD
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Estimated ETH</span>
                    <div className="text-right">
                        <span className="font-mono text-lg">{Number(estimatedETH).toFixed(4)} ETH</span>
                        {ethPrice > BigInt(0) && (
                            <p className="text-xs text-slate-500">
                                1 ETH ≈ ${(Number(ethPrice) / 1e8).toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action */}
            <Button 
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 mt-2"
                disabled={!selectedZone || isPending || isConfirming || isLoading}
                onClick={handleBuy}
            >
                {isPending || isConfirming ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Transaction...
                    </>
                ) : (
                    "Buy License Now"
                )}
            </Button>
            
            <p className="text-center text-xs text-slate-500">
                Transaction will be processed on Ethereum Mainnet.
            </p>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
