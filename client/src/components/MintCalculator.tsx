import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign, Zap } from "lucide-react";

const PROMO_PRICE_ETH = 0.00003;

export function MintCalculator() {
  const [quantity, setQuantity] = useState<number>(1000);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    setTotalPrice(quantity * PROMO_PRICE_ETH);
  }, [quantity]);

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
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-bold tracking-tight">
                {totalPrice.toFixed(5)}
              </span>
              <span className="text-xl font-medium text-slate-400">ETH</span>
            </div>
          </div>

          <div className="relative z-10 space-y-6 mt-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-slate-400 text-sm">Unit Price</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary/20 text-primary-foreground text-xs font-bold rounded">
                  PROMO
                </span>
                <span className="font-mono font-bold text-xl">{PROMO_PRICE_ETH} ETH</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Gas Fees (Base)</span>
              <span className="text-slate-300 font-mono text-sm">Est. &lt; $0.01</span>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
