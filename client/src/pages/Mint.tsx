import { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useLocation } from "wouter";
import { ethers } from "ethers";
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
  PenLine,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPublicClient, http, formatEther, custom } from "viem";
import { mainnet } from "viem/chains";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

import { ABI, NAME_WRAPPER_ABI, CHAINLINK_ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { LicenseModal } from "@/components/LicenseModal";

// Zone Definition with icon mapping
const ZONE_ICONS: Record<string, any> = {
  "robot-id.eth": Bot,
  "machine-id.eth": Server,
  "device-id.eth": Tablet,
  "drone-id.eth": Plane,
  "vehicle-id.eth": Car
};


// Public Resolver Address (from user provided info)
const RESOLVER_ADDRESS = "0xF29100983E058B709F3D539b0c765937B804AC15";

// Read URL params immediately to get pending mint intent
const getUrlParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    action: searchParams.get("action"),
    namespace: searchParams.get("namespace"),
    label: searchParams.get("label")
  };
};

export default function MintPage() {
  const { address, isConnected, connector } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // Get initial URL params for pending mint intent
  const initialParams = getUrlParams();
  const [selectedZone, setSelectedZone] = useState<string | null>(initialParams.namespace);
  
  // License Modal State
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  
  // Pending mint intent from URL (shown on connect screen)
  const [pendingMintIntent, setPendingMintIntent] = useState<{namespace: string, label: string} | null>(
    initialParams.namespace && initialParams.label 
      ? { namespace: initialParams.namespace, label: initialParams.label }
      : null
  );

  // Check for license action or minting intent in URL
  useEffect(() => {
    const { action: actionParam, namespace: namespaceParam, label: labelParam } = getUrlParams();
    
    // Handle License Action
    if (actionParam === "license") {
      setLicenseModalOpen(true);
    }
    
    // Handle Minting Intent (from SubnameSearch)
    if (namespaceParam) {
        setSelectedZone(namespaceParam);
        
        if (labelParam) {
            setMintMode("single");
            setSingleName(labelParam);
            setPendingMintIntent({ namespace: namespaceParam, label: labelParam });
        }
    }
    
    // Only clean URL if connected to preserve params across potential wallet-connect reloads
    if (isConnected && (actionParam || namespaceParam)) {
        window.history.replaceState(null, "", "/mint");
    }
  }, [isConnected]);

  // Static zones - known namespaces (no need to fetch from contract since it always fails)
  const availableZones = [
    { name: "robot-id.eth", label: "robot-id", icon: ZONE_ICONS["robot-id.eth"] || Bot },
    { name: "machine-id.eth", label: "machine-id", icon: ZONE_ICONS["machine-id.eth"] || Server },
    { name: "device-id.eth", label: "device-id", icon: ZONE_ICONS["device-id.eth"] || Tablet },
    { name: "drone-id.eth", label: "drone-id", icon: ZONE_ICONS["drone-id.eth"] || Plane },
    { name: "vehicle-id.eth", label: "vehicle-id", icon: ZONE_ICONS["vehicle-id.eth"] || Car }
  ];
  const isLoadingZones = false;

  // License State
  const [hasLicense, setHasLicense] = useState(false);
  const [checkingLicense, setCheckingLicense] = useState(false);
  const [approvalNeeded, setApprovalNeeded] = useState(false);

  // Mint Mode State - initialize based on URL params
  const [mintMode, setMintMode] = useState<"csv" | "single">(initialParams.label ? "single" : "csv");
  const [singleName, setSingleName] = useState(initialParams.label || "");

  const [file, setFile] = useState<File | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [quoteETH, setQuoteETH] = useState<number>(0); 
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

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastMintedTx, setLastMintedTx] = useState<string>("");

  // Transaction State (replacing wagmi hooks)
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [estimatedGasFee, setEstimatedGasFee] = useState<string>("");
  const [estimatedGasFeeUsd, setEstimatedGasFeeUsd] = useState<string>("");


  // Check License Ownership & Approval
  useEffect(() => {
    if (!address || !selectedZone) {
      setHasLicense(false);
      return;
    }

    const checkStatus = async () => {
      setCheckingLicense(true);
      try {
        const transport = window.ethereum ? custom(window.ethereum as any) : http("https://eth.merkle.io");
        const publicClient = createPublicClient({ chain: mainnet, transport });

        // 1. Check License Ownership (ERC721)
        const balance = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'balanceOf',
          args: [address]
        }) as bigint;

        let foundLicense = false;
        for (let i = 0; i < Number(balance); i++) {
            const tokenId = await publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: ABI,
              functionName: 'tokenOfOwnerByIndex',
              args: [address, BigInt(i)]
            }) as bigint;
            
            const parent = await publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: ABI,
              functionName: 'licenseParent',
              args: [tokenId]
            }) as string;

            if (parent === selectedZone) {
                foundLicense = true;
                break;
            }
        }
        setHasLicense(foundLicense);

        // 2. Check NameWrapper Approval
        // We need to find the NameWrapper address from the contract
        const nameWrapperAddress = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'nameWrapper'
        }) as `0x${string}`;

        const isApproved = await publicClient.readContract({
          address: nameWrapperAddress,
          abi: NAME_WRAPPER_ABI,
          functionName: 'isApprovedForAll',
          args: [address, CONTRACT_ADDRESS as `0x${string}`]
        }) as boolean;

        setApprovalNeeded(!isApproved);

      } catch (e) {
        console.error("Status check failed", e);
      } finally {
        setCheckingLicense(false);
      }
    };
    checkStatus();
  }, [address, selectedZone]);


  // Update quantity when mode or input changes
  useEffect(() => {
    if (mintMode === "single") {
      setQuantity(singleName.trim() ? 1 : 0);
    } else {
      // Restore CSV quantity if available
      setQuantity(parsedData?.labels.length || 0);
    }
  }, [mintMode, singleName, parsedData]);


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

  // Handle Approval (using ethers.js)
  const handleApprove = async () => {
    if (!address || !window.ethereum) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      
      const registrarContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const nameWrapperAddress = await registrarContract.nameWrapper();
      
      const nameWrapper = new ethers.Contract(nameWrapperAddress, NAME_WRAPPER_ABI, signer);
      const tx = await nameWrapper.setApprovalForAll(CONTRACT_ADDRESS, true);
      await tx.wait();
      
      setApprovalNeeded(false);
      toast({
        title: "Approval Granted",
        description: "You can now mint subdomains.",
      });
    } catch (e: any) {
      console.error("Approval failed", e);
      toast({
        title: "Approval Failed",
        description: e.reason || e.message || "Failed to grant approval.",
        variant: "destructive"
      });
    }
  };

  // Handle Buy License (using ethers.js)
  const handleBuyLicense = async () => {
    if (!selectedZone || !address || !window.ethereum) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const registrar = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      // Calculate license price
      const licensePriceUSD = await registrar.licensePriceUSD();
      const oracleAddress = await registrar.oracle();
      const oracleContract = new ethers.Contract(oracleAddress, CHAINLINK_ABI, provider);
      const roundData = await oracleContract.latestRoundData();
      const ethPriceUSD = roundData[1];
      
      const multiplier = ethers.BigNumber.from("1000000000000000000000000"); // 1e24
      let valueToSend = licensePriceUSD.mul(multiplier).div(ethPriceUSD);
      valueToSend = valueToSend.add(ethers.BigNumber.from("1000000000000000")); // buffer
      
      const tx = await registrar.buyLicense(selectedZone.replace('.eth', ''), { value: valueToSend });
      await tx.wait();
      
      setHasLicense(true);
      toast({
        title: "License Purchased",
        description: "You now have unlimited minting for this namespace.",
      });
    } catch (e: any) {
      console.error("License purchase failed", e);
      toast({
        title: "Purchase Failed",
        description: e.reason || e.message || "Failed to purchase license.",
        variant: "destructive"
      });
    }
  };

  // Handle Mint Action with ethers.js for proper transaction building
  const handleMint = async () => {
    if (selectedZone === null || !address) return;
    
    // Get provider from the connected wallet via wagmi connector
    if (!connector) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive"
      });
      return;
    }

    setIsPending(true);
    setEstimatedGasFee("");
    setEstimatedGasFeeUsd("");

    try {
      // 1. Get provider from the connected wagmi connector
      const walletProvider = await connector.getProvider();
      const provider = new ethers.providers.Web3Provider(walletProvider as any);
      const signer = provider.getSigner();
      const { chainId } = await provider.getNetwork();
      
      if (chainId !== 1) {
        toast({
          title: "Wrong Network",
          description: "Please switch to Ethereum Mainnet to mint.",
          variant: "destructive"
        });
        setIsPending(false);
        return;
      }

      // 2. Calculate value to send
      let valueToSend = ethers.BigNumber.from(0);
      
      if (!hasLicense) {
        try {
          const registrarContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
          
          // Determine Tier Index
          let tierIndex = 2;
          if (quantity <= 10) tierIndex = 0;
          else if (quantity <= 50) tierIndex = 1;
          
          // Get Tier Price (cents)
          const tierPriceCents = await registrarContract.tierPricesUSD(tierIndex);
          console.log("Tier Price Cents:", tierPriceCents.toString());
          
          // Get Oracle Price
          const oracleAddress = await registrarContract.oracle();
          const oracleContract = new ethers.Contract(oracleAddress, CHAINLINK_ABI, provider);
          const roundData = await oracleContract.latestRoundData();
          const ethPriceUSD = roundData[1]; // answer is at index 1
          console.log("ETH Price USD (8 dec):", ethPriceUSD.toString());

          // Calculate: requiredWei = feePerSub * qty * 1e24 / ethPrice
          const totalFee = tierPriceCents.mul(quantity);
          const multiplier = ethers.BigNumber.from("1000000000000000000000000"); // 1e24
          valueToSend = totalFee.mul(multiplier).div(ethPriceUSD);
          
          console.log("Calculated Value to Send (Wei):", valueToSend.toString());

          // Add tiny buffer (+0.0001 ETH = 1e14 wei) for rounding
          valueToSend = valueToSend.add(ethers.BigNumber.from("100000000000000")); // 1e14

        } catch (e) {
          console.error("Price calc failed, using fallback", e);
          
          // Fallback Calculation
          const fallbackPriceCents = ethers.BigNumber.from(450);
          const fallbackEthPrice = ethers.BigNumber.from("300000000000"); // 3000 * 1e8
          const totalFee = fallbackPriceCents.mul(quantity);
          const multiplier = ethers.BigNumber.from("1000000000000000000000000");
          valueToSend = totalFee.mul(multiplier).div(fallbackEthPrice);
          valueToSend = valueToSend.add(ethers.BigNumber.from("100000000000000")); // 1e14
        }
      }

      // 3. Extract parent label (without .eth)
      const parentLabel = selectedZone.replace('.eth', '');
      const labels = mintMode === "single" ? [singleName.trim()] : (parsedData?.labels || []);
      
      if (labels.length === 0 || (mintMode === "single" && !singleName.trim())) {
        toast({
          title: "No Labels",
          description: "Please enter a name to register.",
          variant: "destructive"
        });
        setIsPending(false);
        return;
      }

      // 4. Create contract instance with signer
      const registrar = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // 5. Build transaction via populateTransaction
      const txReq = await registrar.populateTransaction.registerBulk(
        parentLabel,
        labels,
        address,
        RESOLVER_ADDRESS,
        0, // ttl
        { value: valueToSend }
      );
      txReq.from = await signer.getAddress();

      // 6. Let the wallet handle gas settings - it knows current network conditions best
      // Don't override maxFeePerGas/gasPrice - wallet will set optimal values
      
      // 7. Try to estimate gas for a tighter gas limit
      try {
        const gasLimit = await signer.estimateGas(txReq);
        // Add 20% buffer to estimated gas
        txReq.gasLimit = gasLimit.mul(120).div(100);
        console.log("Estimated Gas Limit:", gasLimit.toString());
      } catch (gasError) {
        // Gas estimation failed, use reasonable default
        console.log("Gas estimation failed, using default.");
        txReq.gasLimit = ethers.BigNumber.from(250000);
      }

      // 8. Send transaction - wallet will show actual network fee
      const tx = await signer.sendTransaction(txReq);
      console.log("Transaction sent:", tx.hash);
      
      setIsPending(false);
      setIsConfirming(true);

      // 9. Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      setIsConfirming(false);
      setLastMintedTx(tx.hash);
      setShowSuccessModal(true);
      
      // Reset form
      if (mintMode === "single") setSingleName("");

    } catch (error: any) {
      console.error("Mint failed:", error);
      setIsPending(false);
      setIsConfirming(false);
      
      // Handle user rejection
      if (error.code === 4001 || error.code === "ACTION_REJECTED") {
        toast({
          title: "Transaction Rejected",
          description: "You rejected the transaction in your wallet.",
          variant: "default"
        });
      } else {
        toast({
          title: "Mint Failed",
          description: error.reason || error.message || "An error occurred while minting.",
          variant: "destructive"
        });
      }
    }
  };

  // Fetch Quote for Display
  useEffect(() => {
    if (selectedZone === null || quantity === 0) {
      setQuoteETH(0);
      return;
    }
    
    if (hasLicense) {
        setQuoteETH(0);
        return;
    }

    const fetchQuote = async () => {
      setIsCalculating(true);
      try {
        const transport = window.ethereum ? custom(window.ethereum as any) : http("https://eth.merkle.io");
        const publicClient = createPublicClient({ chain: mainnet, transport });

        // Get Tier Index
        let tierIndex = 2;
        if (quantity <= 10) tierIndex = 0;
        else if (quantity <= 50) tierIndex = 1;

        const tierPriceCents = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'tierPricesUSD',
          args: [BigInt(tierIndex)]
        }) as bigint;
        
        // Convert cents to USD dollars for display
        const pricePerUnit = Number(tierPriceCents) / 100;
        setQuoteETH(pricePerUnit * quantity);
        
      } catch (error) {
        console.error("Quote error:", error);
      } finally {
        setIsCalculating(false);
      }
    };
    fetchQuote();
  }, [selectedZone, quantity, hasLicense]);


  // Render Logic
  if (!isConnected) {
    const IntentIcon = pendingMintIntent ? ZONE_ICONS[pendingMintIntent.namespace] || Bot : UploadCloud;
    
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
        <Card className="w-full max-w-md border-primary/20 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <IntentIcon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display">
              {pendingMintIntent ? "Connect to Register" : "Connect to Mint"}
            </CardTitle>
            <CardDescription className="text-lg">
              {pendingMintIntent ? (
                <span>
                  Connect your wallet to register<br/>
                  <span className="font-mono font-bold text-primary mt-2 inline-block text-xl">
                    {pendingMintIntent.label}.{pendingMintIntent.namespace}
                  </span>
                </span>
              ) : (
                "Please connect your wallet to access the OEM minting dashboard."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <appkit-button />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-center md:text-left space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
              Mint Onchain Identities
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Select your namespace, upload your fleet data, and register authenticated identities in bulk.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="h-12 border-primary/20 hover:border-primary text-primary font-bold gap-2 shadow-sm"
            onClick={() => setLicenseModalOpen(true)}
          >
            <Crown className="w-5 h-5" />
            Buy Unlimited License
          </Button>
        </div>

        <LicenseModal open={licenseModalOpen} onOpenChange={setLicenseModalOpen} />

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md bg-white text-slate-900 border-border">
            <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <DialogTitle className="text-2xl font-display font-bold">
                Mint Successful!
              </DialogTitle>
              <DialogDescription className="text-lg text-slate-600 max-w-xs">
                {mintMode === "single" && quantity === 1 ? (
                   <span>
                     You are now the owner of <br/>
                     <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
                       {singleName || "your identity"}
                       {!singleName.endsWith(selectedZone || "") && selectedZone ? `.${selectedZone}` : ""}
                     </span>
                   </span>
                ) : (
                   <span>
                     You have successfully minted <br/>
                     <span className="font-bold text-slate-900">{quantity} new identities</span>
                   </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm space-y-2">
                 <div className="flex justify-between text-slate-500">
                   <span>Transaction Hash</span>
                   <span className="font-mono text-xs">{lastMintedTx ? `${lastMintedTx.slice(0, 6)}...${lastMintedTx.slice(-4)}` : "..."}</span>
                 </div>
                 <div className="flex justify-between text-slate-500">
                   <span>Namespace</span>
                   <span className="font-medium text-slate-900">{selectedZone}</span>
                 </div>
                 <div className="flex justify-between text-slate-500">
                   <span>Status</span>
                   <span className="text-green-600 font-bold flex items-center gap-1">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     Confirmed
                   </span>
                 </div>
               </div>

               <a 
                 href={`https://etherscan.io/tx/${lastMintedTx}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 w-full p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
               >
                 View on Etherscan
                 <CheckCircle2 className="w-4 h-4" />
               </a>
            </div>

            <DialogFooter className="sm:justify-center">
              <Button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                {isLoadingZones ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                <div className="grid grid-cols-1 gap-4">
                  {availableZones.map((zone) => {
                    const Icon = zone.icon;
                    return (
                    <div 
                      key={zone.name}
                      onClick={() => setSelectedZone(zone.name)}
                      role="button"
                      tabIndex={0}
                      className={`
                        relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 active:scale-98 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary/50
                        ${selectedZone === zone.name 
                          ? `border-primary bg-primary/5 shadow-md` 
                          : "border-transparent bg-white hover:bg-gray-50 hover:border-gray-200 border-gray-100"
                        }
                      `}
                    >
                      <div className={`p-3 rounded-lg bg-blue-50 mr-4 text-blue-500`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg font-mono">{zone.name}</h3>
                        <p className="text-muted-foreground text-xs uppercase tracking-wider">{zone.label} Identity</p>
                      </div>
                      {selectedZone === zone.name && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <CheckCircle2 className="w-6 h-6 text-primary fill-primary/20" />
                        </div>
                      )}
                    </div>
                  )})}
                </div>
                )}
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
                
                <Tabs value={mintMode} className="w-full" onValueChange={(v) => setMintMode(v as "csv" | "single")}>
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
                            .{selectedZone || "eth"}
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
                
                {/* License Status */}
                {selectedZone && (
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-sm font-medium text-slate-300">License Status</span>
                             {checkingLicense ? (
                                 <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                             ) : hasLicense ? (
                                 <Badge className="bg-green-500 hover:bg-green-600 text-white border-none gap-1">
                                     <Crown className="w-3 h-3" />
                                     Unlimited
                                 </Badge>
                             ) : (
                                 <Badge variant="outline" className="border-slate-600 text-slate-400">
                                     Pay Per Sub
                                 </Badge>
                             )}
                        </div>
                        {!hasLicense && !checkingLicense && (
                             <div className="text-xs text-slate-400 mt-2">
                                <p>Buy a license for unlimited minting on <strong>{selectedZone}</strong>.</p>
                                <Button 
                                    variant="link" 
                                    className="h-auto p-0 text-primary mt-1"
                                    onClick={handleBuyLicense}
                                >
                                    Purchase License &rarr;
                                </Button>
                             </div>
                        )}
                    </div>
                )}


                {/* Items */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Target Zone</span>
                    <span className="font-mono font-bold text-lg">
                      {selectedZone || "---"}
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
                        <span className="font-mono font-bold">
                            {hasLicense ? "FREE (License)" : `${quoteETH.toFixed(2)} USD`}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm flex items-center gap-2">
                      <Fuel className="w-4 h-4" />
                      Est. Network Fee
                    </span>
                    <div className="text-right">
                       <span className="font-mono text-slate-300 block">
                         {estimatedGasFee ? `${estimatedGasFee} ETH` : "Calculated on mint"}
                       </span>
                       {estimatedGasFeeUsd && (
                         <span className="font-mono text-xs text-slate-500">≈ ${estimatedGasFeeUsd}</span>
                       )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Total */}
                <div className="pt-2">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-lg font-bold">Total Estimate</span>
                    <span className="text-3xl font-display font-bold">
                      {isCalculating ? "..." : hasLicense 
                        ? (estimatedGasFeeUsd ? `${parseFloat(estimatedGasFeeUsd).toFixed(2)}` : "Gas only")
                        : `${(quoteETH + (estimatedGasFeeUsd ? parseFloat(estimatedGasFeeUsd) : 0)).toFixed(2)}`
                      }
                      <span className="text-sm font-normal text-slate-400 ml-2">USD</span>
                    </span>
                  </div>
                  <p className="text-right text-xs text-slate-500">Includes Network Fee + Mint Cost</p>
                </div>

                {/* Action Button */}
                {approvalNeeded && (
                    <Button 
                        className="w-full h-12 mb-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
                        onClick={handleApprove}
                        disabled={isPending || isConfirming}
                    >
                        {isPending || isConfirming ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Approve Registrar
                    </Button>
                )}

                <Button 
                  className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
                  disabled={quantity === 0 || selectedZone === null || isCalculating || isPending || isConfirming || approvalNeeded}
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