import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign, Zap, Fuel } from "lucide-react";
import { useGasPrice } from "wagmi";
import { formatEther, formatGwei } from "viem";

const PROMO_PRICE_ETH = 0.00003;
// Rough estimates for gas usage
const BASE_GAS = BigInt(100000);
const GAS_PER_UNIT = BigInt(45000); 

export function MintCalculator() {
  const [quantity, setQuantity] = useState<number>(1000);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [ethPrice, setEthPrice] = useState<number>(3800); // Default fallback price
  
  const { data: gasPrice } = useGasPrice({ chainId: 8453 }); // Base Chain ID

  const [estimatedGasCost, setEstimatedGasCost] = useState<bigint>(BigInt(0));

  useEffect(() => {
    setTotalPrice(quantity * PROMO_PRICE_ETH);
    
    if (gasPrice) {
      const estimatedGas = BASE_GAS + (GAS_PER_UNIT * BigInt(quantity));
      setEstimatedGasCost(estimatedGas * gasPrice);
    }
  }, [quantity, gasPrice]);

  useEffect(() => {
    // Fetch ETH price from CoinGecko
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/,/g, ''));
    if (!isNaN(val)) {
      setQuantity(Math.min(val, 1000000000));
    } else if (e.target.value === '') {
      setQuantity(0);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setQuantity(value[0]);
  };
  
  const estimatedGasEth = estimatedGasCost ? parseFloat(formatEther(estimatedGasCost)) : 0;
  const estimatedGasUsd = estimatedGasEth * ethPrice;

  return (
    <Card className="w-full max-w-4xl mx-auto border-border shadow-xl bg-white overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-border pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Minting Cost Calculator</CardTitle>
        </div>
        <p className="text-muted-foreground text-sm">
          Estimate the cost of issuing identities during our <span className="font-bold text-primary">Launch Promotion</span>.
        </p>
      </CardHeader>
      <CardContent className="p-8 grid md:grid-cols-2 gap-12">
        
        {/* Input Section */}
        <div className="space-y-8">
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
              <span className="font-bold">Launch Promo:</span> Fixed price of <span className="font-bold">0.00003 ETH</span> per identity for a limited time.
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
                  {(totalPrice + estimatedGasEth).toFixed(5)}
                </span>
                <span className="text-xl font-medium text-slate-400">ETH</span>
              </div>
              <div className="text-slate-400 font-mono text-sm">
                ≈ ${((totalPrice + estimatedGasEth) * ethPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-6 mt-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-slate-400 text-sm">Unit Price</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary/20 text-primary-foreground text-xs font-bold rounded">
                  PROMO
                </span>
                <div className="text-right">
                   <div className="font-mono font-bold text-xl leading-none">{PROMO_PRICE_ETH} ETH</div>
                   <div className="text-[10px] text-slate-400 font-mono mt-1">≈ ${(PROMO_PRICE_ETH * ethPrice).toFixed(2)} USD</div>
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
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
