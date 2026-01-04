import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign, Zap, Fuel, ArrowRight, Bot, Car, Plane, Server, Tablet, Globe } from "lucide-react";
import { useGasPrice, useAccount } from "wagmi";
import { formatEther, formatUnits, formatGwei, createPublicClient, custom, http } from "viem";
import { base } from "viem/chains";
import { Button } from "@/components/ui/button";
import { useAppKit } from "@reown/appkit/react";
import { ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Zone IDs: 0=ROBOT, 1=MACHINE, 2=DEVICE, 3=DRONE, 4=VEHICLE
const ZONES = [
  { id: 0, name: "robot-id.eth", label: "Robot", icon: Bot },
  { id: 1, name: "machine-id.eth", label: "Machine", icon: Server },
  { id: 2, name: "device-id.eth", label: "Device", icon: Tablet },
  { id: 3, name: "drone-id.eth", label: "Drone", icon: Plane },
  { id: 4, name: "vehicle-id.eth", label: "Vehicle", icon: Car },
];

const BASE_GAS = BigInt(100000);
const GAS_PER_UNIT = BigInt(45000); 

export function MintCalculator() {
  const [quantity, setQuantity] = useState<number>(1000);
  const [selectedZone, setSelectedZone] = useState<number>(0);
  const [ethPrice, setEthPrice] = useState<number>(3800);
  const [quoteUSDC, setQuoteUSDC] = useState<number>(0);
  
  const { data: gasPrice } = useGasPrice({ chainId: 8453 }); // Base Chain ID
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  // Fetch ETH price from CoinGecko
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        if (data.ethereum?.usd) {
          setEthPrice(data.ethereum.usd);
        }
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
      }
    };
    fetchEthPrice();
  }, []);

  // Fetch Price Quote from Contract using viem (direct RPC/Window)
  useEffect(() => {
    async function fetchQuote() {
      try {
        // Prefer window.ethereum if available, otherwise fallback to public RPC
        const transport = window.ethereum ? custom(window.ethereum as any) : http("https://mainnet.base.org");
        
        const publicClient = createPublicClient({
          chain: base,
          transport: transport
        });

        const mintCostWei = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'quoteUSDC',
          args: [selectedZone, BigInt(quantity)]
        }) as bigint;
        
        const mintCostUSDC = parseFloat(formatUnits(mintCostWei, 6)); // USDC uses 6 decimals
        setQuoteUSDC(mintCostUSDC);
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuoteUSDC(0);
      }
    }
    fetchQuote();
  }, [selectedZone, quantity]);

  const totalPriceUSDC = quoteUSDC;
  const unitPriceUSDC = quantity > 0 ? totalPriceUSDC / quantity : 0;

  const estimatedGas = gasPrice ? (BASE_GAS + (GAS_PER_UNIT * BigInt(quantity))) * gasPrice : BigInt(0);
  const estimatedGasEth = parseFloat(formatEther(estimatedGas));
  const estimatedGasUsd = estimatedGasEth * ethPrice;
  const totalPriceUsdWithGas = totalPriceUSDC + estimatedGasUsd;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/,/g, ''));
    if (!isNaN(val)) {
      setQuantity(Math.min(val, 100000)); // Max 100k for slider visualization, though contract supports more
    } else if (e.target.value === '') {
      setQuantity(0);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setQuantity(value[0]);
  };

  return (
    <Card id="mint-calculator" className="w-full max-w-4xl mx-auto border-border shadow-xl bg-white overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-border pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Minting Cost Calculator</CardTitle>
        </div>
        <p className="text-muted-foreground text-sm">
          Estimate the cost of issuing identities with our <span className="font-bold text-primary">Volume Pricing</span>.
        </p>
      </CardHeader>
      <CardContent className="p-8 grid md:grid-cols-2 gap-12">
        
        {/* Input Section */}
        <div className="space-y-8">
          
          <div className="space-y-4">
            <label className="text-sm font-medium font-mono uppercase tracking-wider text-muted-foreground">
              Identity Type (Zone)
            </label>
            <Select 
              value={selectedZone.toString()} 
              onValueChange={(val) => setSelectedZone(parseInt(val))}
            >
              <SelectTrigger className="w-full h-14 text-lg bg-white border-border">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                {ZONES.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id.toString()} className="text-lg py-3">
                    <div className="flex items-center gap-3">
                      <zone.icon className="w-5 h-5 text-primary" />
                      <span className="font-mono">{zone.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium font-mono uppercase tracking-wider text-muted-foreground">
              Fleet Size (Units)
            </label>
            <div className="relative">
              <Input 
                type="text" 
                value={quantity.toLocaleString()} 
                onChange={handleInputChange}
                className="text-2xl font-display font-bold py-6 pl-4 pr-12 border-border focus:border-primary focus:ring-primary"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">
                UNITS
              </div>
            </div>
            <Slider 
              value={[quantity]} 
              min={1} 
              max={100000} 
              step={10} 
              onValueChange={handleSliderChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>1</span>
              <span>100k+</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
            <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              <span className="font-bold">Dynamic Pricing:</span> Costs decrease automatically as you mint larger batches.
            </p>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-900 rounded-xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 space-y-2">
            <p className="text-slate-400 font-mono text-sm uppercase tracking-wider">Estimated Total</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-display font-bold tracking-tight">
                  {totalPriceUSDC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-xl font-medium text-slate-400">USDC</span>
              </div>
              <div className="text-slate-400 font-mono text-sm">
                + Gas Fees
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-6 mt-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-slate-400 text-sm">Avg. Unit Price</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary/20 text-primary-foreground text-xs font-bold rounded">
                  TIERED
                </span>
                <div className="text-right">
                   <div className="font-mono font-bold text-xl leading-none">${unitPriceUSDC.toFixed(3)}</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Subdomain Cost
              </span>
              <div className="text-right">
                <div className="text-slate-300 font-mono text-sm">
                  {totalPriceUSDC > 0 ? `$${totalPriceUSDC.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "$0.00"}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm flex items-center gap-2">
                <Fuel className="w-4 h-4" />
                Gas Fees (Base)
              </span>
              <div className="text-right">
                <div className="text-slate-300 font-mono text-sm">
                  {estimatedGasEth > 0 ? `~${estimatedGasEth.toFixed(6)} ETH` : "Loading..."}
                </div>
                 <div className="text-[10px] text-slate-500 font-mono">
                   {gasPrice ? `${Number(formatGwei(gasPrice)).toFixed(4)} gwei` : "..."} 
                   {estimatedGasUsd > 0 && ` (~$${estimatedGasUsd.toFixed(2)})`}
                 </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              {!isConnected ? (
                <Button 
                  onClick={() => open()}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-md shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]"
                >
                  Start Minting Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <Button 
                  disabled
                  className="w-full h-12 bg-green-600 text-white font-bold text-lg rounded-md shadow-lg opacity-90 cursor-not-allowed"
                >
                  Wallet Connected
                </Button>
              )}
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
