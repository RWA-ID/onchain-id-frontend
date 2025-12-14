import { useState, useEffect } from "react";
import { useAccount, useGasPrice, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useLocation } from "wouter";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  Bot, 
  Server, 
  Tablet, 
  Plane, 
  Car, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  DollarSign,
  Fuel,
  PenLine
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPublicClient, http, formatUnits, formatEther, formatGwei, custom } from "viem";
import { base } from "viem/chains";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import { ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS } from "@/lib/constants";

// Zone Definition
const ZONES = [
  { id: 0, name: "robot-id.eth", label: "Robot", icon: Bot, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: 1, name: "machine-id.eth", label: "Machine", icon: Server, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { id: 2, name: "device-id.eth", label: "Device", icon: Tablet, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: 3, name: "drone-id.eth", label: "Drone", icon: Plane, color: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  { id: 4, name: "vehicle-id.eth", label: "Vehicle", icon: Car, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
];

const BASE_GAS = BigInt(100000);
const GAS_PER_UNIT = BigInt(45000); 

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  
  // Mint Mode State
  const [mintMode, setMintMode] = useState<"csv" | "single">("csv");
  const [singleName, setSingleName] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [quoteUSDC, setQuoteUSDC] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [ethPrice, setEthPrice] = useState<number>(0);
  
  // Parsed Data State
  const [parsedData, setParsedData] = useState<{
    labels: string[],
    makes: string[],
    models: string[],
    serials: string[],
    websites: string[],
    socials: string[]
  } | null>(null);

  const { data: gasPrice } = useGasPrice({ chainId: 8453 });
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Update quantity when mode or input changes
  useEffect(() => {
    if (mintMode === "single") {
      setQuantity(singleName.trim() ? 1 : 0);
    } else {
      // Restore CSV quantity if available
      setQuantity(parsedData?.labels.length || 0);
    }
  }, [mintMode, singleName, parsedData]);

  // Effect for Transaction Success
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Mint Successful!",
        description: `Successfully registered ${quantity} identities.`,
        variant: "default",
      });
      // Optional: Reset form
      if (mintMode === "single") setSingleName("");
    }
  }, [isConfirmed, quantity, toast, mintMode]);

  // Fetch ETH Price
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then(res => res.json())
      .then(data => setEthPrice(data.ethereum?.usd || 3800))
      .catch(() => setEthPrice(3800));
  }, []);

  // Handle File Upload & Parsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
          
          // Basic CSV Parsing (assuming 6 columns, skipping header)
          // Format: Label, Make, Model, Serial, Website, Social
          const labels: string[] = [];
          const makes: string[] = [];
          const models: string[] = [];
          const serials: string[] = [];
          const websites: string[] = [];
          const socials: string[] = [];

          // Start from index 1 to skip header
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            if (cols.length >= 6) {
              labels.push(cols[0]);
              makes.push(cols[1]);
              models.push(cols[2]);
              serials.push(cols[3]);
              websites.push(cols[4]);
              socials.push(cols[5]);
            }
          }

          setParsedData({ labels, makes, models, serials, websites, socials });
          // Only update quantity if we are in CSV mode
          if (mintMode === "csv") {
             setQuantity(labels.length);
          }
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  // Handle Mint Action
  const handleMint = () => {
    if (selectedZone === null || !address) return;

    if (mintMode === "single") {
        if (!singleName.trim()) return;
        
        writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'bulkMintUSDC',
          args: [
            [singleName],     // labels
            [""],             // makes
            [""],             // models
            [""],             // serials
            [""],             // websites
            [""],             // socials
            address,          // finalOwner
            selectedZone
          ],
        });
    } else {
        if (!parsedData) return;

        writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'bulkMintUSDC',
          args: [
            parsedData.labels,
            parsedData.makes,
            parsedData.models,
            parsedData.serials,
            parsedData.websites,
            parsedData.socials,
            address, // finalOwner
            selectedZone
          ],
        });
    }
  };

  // Fetch Quote when Zone or Quantity changes
  useEffect(() => {
    if (selectedZone === null || quantity === 0) {
      setQuoteUSDC(0);
      return;
    }

    const fetchQuote = async () => {
      setIsCalculating(true);
      try {
        const transport = window.ethereum ? custom(window.ethereum as any) : http("https://mainnet.base.org");
        const publicClient = createPublicClient({ chain: base, transport });

        const mintCostWei = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'quoteUSDC',
          args: [selectedZone, BigInt(quantity)]
        }) as bigint;
        
        setQuoteUSDC(parseFloat(formatUnits(mintCostWei, 6)));
      } catch (error) {
        console.error("Quote error:", error);
      } finally {
        setIsCalculating(false);
      }
    };
    fetchQuote();
  }, [selectedZone, quantity]);

  // Gas Estimation
  const estimatedGas = gasPrice ? (BASE_GAS + (GAS_PER_UNIT * BigInt(quantity))) * gasPrice : BigInt(0);
  const estimatedGasEth = parseFloat(formatEther(estimatedGas));
  const estimatedGasUsd = estimatedGasEth * ethPrice;

  // Render Logic
  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
        <Card className="w-full max-w-md border-primary/20 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display">Connect to Mint</CardTitle>
            <CardDescription className="text-lg">
              Please connect your wallet to access the OEM minting dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
            Mint Onchain Identities
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your namespace, upload your fleet data, and register authenticated identities in bulk.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Zone Selection */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                  Select Namespace Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {ZONES.map((zone) => (
                    <div 
                      key={zone.id}
                      onClick={() => setSelectedZone(zone.id)}
                      className={`
                        relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200
                        ${selectedZone === zone.id 
                          ? `border-primary bg-primary/5 shadow-md` 
                          : "border-transparent bg-white hover:bg-gray-50 hover:border-gray-200 border-gray-100"
                        }
                      `}
                    >
                      <div className={`p-3 rounded-lg ${zone.bg} mr-4`}>
                        <zone.icon className={`w-6 h-6 ${zone.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg font-mono">{zone.name}</h3>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">{zone.label} Identity</p>
                      </div>
                      {selectedZone === zone.id && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <CheckCircle2 className="w-6 h-6 text-primary fill-primary/20" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Minting Data */}
            <Card className={`border-border shadow-sm transition-opacity duration-300 ${selectedZone === null ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                  Provide Identity Data
                </CardTitle>
                <CardDescription>
                  Choose between single registration or bulk CSV upload.
                </CardDescription>
              </CardHeader>
              <CardContent>
                
                <Tabs defaultValue="csv" className="w-full" onValueChange={(v) => setMintMode(v as "csv" | "single")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="csv" className="flex items-center gap-2">
                       <FileSpreadsheet className="w-4 h-4" />
                       Bulk Upload (CSV)
                    </TabsTrigger>
                    <TabsTrigger value="single" className="flex items-center gap-2">
                       <PenLine className="w-4 h-4" />
                       Single Name
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="csv" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50/50 transition-colors relative group">
                      <input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <FileSpreadsheet className="w-8 h-8" />
                        </div>
                        {file ? (
                          <div>
                            <p className="font-bold text-lg text-green-600 flex items-center justify-center gap-2">
                              <CheckCircle2 className="w-5 h-5" />
                              {file.name}
                            </p>
                            <p className="text-muted-foreground mt-1">{quantity} records found</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-lg">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground">CSV files only (max 10MB)</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {mintMode === "csv" && quantity > 0 && (
                      <Alert className="bg-green-50 border-green-200 text-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle>Ready to Mint</AlertTitle>
                        <AlertDescription>
                          Successfully parsed {quantity} identities from your CSV.
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  <TabsContent value="single" className="space-y-6 py-4">
                    <div className="space-y-2">
                       <Label htmlFor="single-name">Identity Name</Label>
                       <div className="flex items-center gap-2">
                         <Input 
                            id="single-name" 
                            placeholder="e.g. optimus-prime-001" 
                            className="flex-1 font-mono" 
                            value={singleName}
                            onChange={(e) => setSingleName(e.target.value)}
                         />
                         <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md font-mono text-sm text-slate-500">
                            .{selectedZone !== null ? ZONES[selectedZone].name : "eth"}
                         </div>
                       </div>
                       <p className="text-xs text-muted-foreground">
                         Only lowercase letters, numbers, and hyphens allowed.
                       </p>
                    </div>

                    <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <AlertTitle>Quick Mint</AlertTitle>
                      <AlertDescription>
                        Metadata fields (Make, Model, Serial, etc.) will be left blank for single mints. You can update them later.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>

              </CardContent>
            </Card>

          </div>

          {/* Sidebar: Summary & Action */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="sticky top-24 border-none shadow-2xl bg-slate-900 text-white overflow-hidden">
               {/* Decorative background */}
               <div className="absolute top-0 right-0 p-40 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
               
              <CardHeader className="relative z-10 border-b border-white/10 pb-6">
                <CardTitle className="font-display text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-6 space-y-6">
                
                {/* Items */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Target Zone</span>
                    <span className="font-mono font-bold text-lg">
                      {selectedZone !== null ? ZONES[selectedZone].name : "---"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Quantity</span>
                    <span className="font-mono font-bold text-lg">{quantity} Units</span>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Costs */}
                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Minting Cost
                    </span>
                    <div className="text-right">
                      {isCalculating ? (
                        <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                      ) : (
                        <span className="font-mono font-bold">{quoteUSDC.toFixed(2)} USDC</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm flex items-center gap-2">
                      <Fuel className="w-4 h-4" />
                      Est. Gas
                    </span>
                    <div className="text-right">
                       <span className="font-mono text-slate-300 block">{estimatedGasEth.toFixed(5)} ETH</span>
                       <span className="font-mono text-xs text-slate-500">≈ ${estimatedGasUsd.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Total */}
                <div className="pt-2">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-lg font-bold">Total Estimate</span>
                    <span className="text-3xl font-display font-bold">
                      {isCalculating ? "..." : (quoteUSDC + estimatedGasUsd).toFixed(2)}
                      <span className="text-sm font-normal text-slate-400 ml-2">USD</span>
                    </span>
                  </div>
                  <p className="text-right text-xs text-slate-500">Includes Gas + Mint Fees</p>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 mt-4"
                  disabled={quantity === 0 || selectedZone === null || isCalculating || isPending || isConfirming}
                  onClick={handleMint}
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Calculating...
                    </>
                  ) : isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Mint {quantity > 0 ? quantity : ""} Identities
                    </>
                  )}
                </Button>
                
                {quantity === 0 && (
                  <p className="text-center text-xs text-slate-500 mt-2">
                     {mintMode === "csv" ? "Please upload a CSV to proceed." : "Please enter a name to proceed."}
                  </p>
                )}

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}