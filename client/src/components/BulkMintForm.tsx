import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, FileUp, AlertCircle, CheckCircle2, Loader2, Database } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { ABI } from "@/lib/abi";
import { useToast } from "@/hooks/use-toast";

interface CSVRow {
  name: string;
  make: string;
  model: string;
  serial: string;
  website: string;
  social: string;
}

const PROMO_PRICE_ETH = 0.00003;

export function BulkMintForm() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [isRobotZone, setIsRobotZone] = useState(true); // true = robot-id.eth, false = machine-id.eth
  const [isParsing, setIsParsing] = useState(false);

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = async (file: File) => {
    setIsParsing(true);
    const text = await file.text();
    const lines = text.split('\n');
    const rows: CSVRow[] = [];

    // Skip header row if exists and looks like header
    const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Simple CSV split (note: doesn't handle quoted commas, but good for MVP)
      const cols = line.split(',').map(c => c.trim());
      
      if (cols.length >= 1) {
        rows.push({
          name: cols[0] || '',
          make: cols[1] || '',
          model: cols[2] || '',
          serial: cols[3] || '',
          website: cols[4] || '',
          social: cols[5] || ''
        });
      }
    }

    setParsedData(rows);
    setIsParsing(false);
  };

  const handleMint = () => {
    if (!parsedData.length || !address) return;

    const totalCost = parseEther((parsedData.length * PROMO_PRICE_ETH).toString());

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'bulkMint',
      args: [
        parsedData.map(r => r.name),
        parsedData.map(r => r.make),
        parsedData.map(r => r.model),
        parsedData.map(r => r.serial),
        parsedData.map(r => r.website),
        parsedData.map(r => r.social),
        address,
        isRobotZone
      ],
      value: totalCost
    }, {
      onError: (error) => {
        toast({
          title: "Minting Failed",
          description: error.message,
          variant: "destructive"
        });
      },
      onSuccess: () => {
        toast({
          title: "Transaction Submitted",
          description: "Your fleet is being initialized on-chain.",
        });
      }
    });
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-4xl mx-auto border-border shadow-xl bg-white overflow-hidden mt-8" id="mint-interface">
        <CardHeader className="bg-gray-50 border-b border-border pb-8">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-display text-2xl">Bulk Minting Interface</CardTitle>
          </div>
          <p className="text-muted-foreground text-sm">
            Connect your wallet to access the fleet issuance tools.
          </p>
        </CardHeader>
        <CardContent className="p-16 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
            <Database className="w-8 h-8 text-primary/40" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-bold">Authentication Required</h3>
            <p className="text-muted-foreground">
              Please connect your wallet to upload manifest files and mint identities on Base.
            </p>
          </div>
          <div className="pt-4">
            <appkit-button />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-border shadow-xl bg-white overflow-hidden mt-8" id="mint-interface">
      <CardHeader className="bg-gray-50 border-b border-border pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Bulk Minting Interface</CardTitle>
        </div>
        <p className="text-muted-foreground text-sm">
          Upload your fleet manifest (CSV) to issue identities.
        </p>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        
        {/* Zone Selection */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-gray-50/50">
          <div className="space-y-0.5">
            <Label className="text-base font-semibold">Namespace Domain</Label>
            <p className="text-sm text-muted-foreground">
              Choose the root domain for your identities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-mono ${!isRobotZone ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>machine-id.eth</span>
            <Switch 
              checked={isRobotZone}
              onCheckedChange={setIsRobotZone}
            />
            <span className={`text-sm font-mono ${isRobotZone ? 'text-primary font-bold' : 'text-muted-foreground'}`}>robot-id.eth</span>
          </div>
        </div>

        {/* File Upload */}
        <div className="grid gap-4">
          <Label>Upload CSV Manifest</Label>
          <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50/30 group relative">
            <Input 
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <FileUp className="w-6 h-6 text-primary" />
            </div>
            {file ? (
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Name, Make, Model, Serial, Website, Social
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Validation & Preview */}
        {parsedData.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Manifest Preview</h3>
              <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                {parsedData.length} Identities Found
              </span>
            </div>
            <div className="border border-border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-muted-foreground font-mono text-xs uppercase sticky top-0">
                  <tr>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Make</th>
                    <th className="px-4 py-2 font-medium">Model</th>
                    <th className="px-4 py-2 font-medium">Serial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {parsedData.slice(0, 10).map((row, i) => (
                    <tr key={i} className="bg-white">
                      <td className="px-4 py-2 font-mono font-medium">{row.name}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.make}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.model}</td>
                      <td className="px-4 py-2 text-muted-foreground font-mono text-xs">{row.serial}</td>
                    </tr>
                  ))}
                  {parsedData.length > 10 && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-4 py-2 text-center text-muted-foreground text-xs">
                        ...and {parsedData.length - 10} more rows
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cost Summary */}
            <div className="bg-slate-900 text-white p-6 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Minting Cost</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display">
                    {(parsedData.length * PROMO_PRICE_ETH).toFixed(5)}
                  </span>
                  <span className="text-sm font-mono text-slate-400">ETH</span>
                </div>
              </div>
              
              <Button 
                onClick={handleMint}
                disabled={!isConnected || isPending || isConfirming}
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-md"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Minting...
                  </>
                ) : !isConnected ? (
                  "Connect Wallet to Mint"
                ) : (
                  <>
                    Confirm & Mint Fleet
                  </>
                )}
              </Button>
            </div>
            
            {isConfirmed && (
               <div className="p-4 bg-green-50 text-green-800 rounded-lg flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-600" />
                 <div>
                   <p className="font-bold">Minting Successful!</p>
                   <p className="text-sm">Your robot identities have been issued on Base.</p>
                 </div>
               </div>
            )}
            
            {hash && (
              <div className="text-center">
                <a 
                  href={`https://basescan.org/tx/${hash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary underline underline-offset-4"
                >
                  View Transaction on Basescan
                </a>
              </div>
            )}

          </div>
        )}
      </CardContent>
    </Card>
  );
}
