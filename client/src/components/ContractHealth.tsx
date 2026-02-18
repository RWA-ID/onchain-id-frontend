import { useState, useEffect } from "react";
import { createPublicClient, http, custom, formatUnits } from "viem";
import { mainnet } from "viem/chains";
import { useAccount } from "wagmi";
import { CheckCircle2, XCircle, Loader2, Shield, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ABI } from "@/lib/abi";
import { CONTRACT_ADDRESS } from "@/lib/constants";

const NAMESPACES = ["robot-id", "machine-id", "device-id", "drone-id", "vehicle-id"];

interface HealthData {
  payoutAddress: string;
  usdPerSub: string;
  parentStatuses: { name: string; enabled: boolean }[];
}

export function ContractHealth() {
  const { chain } = useAccount();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      setLoading(true);
      setError(null);
      try {
        const transport = window.ethereum ? custom(window.ethereum as any) : http("https://eth.merkle.io");
        const publicClient = createPublicClient({ chain: mainnet, transport });

        const payoutAddress = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: ABI,
          functionName: 'payoutAddress'
        }) as `0x${string}`;

        let usdPerSubRaw: bigint;
        try {
          usdPerSubRaw = await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: ABI,
            functionName: 'usdPerSub'
          }) as bigint;
        } catch {
          usdPerSubRaw = BigInt(0);
        }

        const parentStatuses: { name: string; enabled: boolean }[] = [];
        for (const ns of NAMESPACES) {
          try {
            const enabled = await publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: ABI,
              functionName: 'parentEnabled',
              args: [ns]
            }) as boolean;
            parentStatuses.push({ name: ns, enabled });
          } catch {
            parentStatuses.push({ name: ns, enabled: false });
          }
        }

        setHealth({
          payoutAddress,
          usdPerSub: usdPerSubRaw > 0 ? formatUnits(usdPerSubRaw, 8) : "N/A",
          parentStatuses
        });
      } catch (e: any) {
        console.error("Contract health check failed:", e);
        setError(e.message || "Failed to read contract");
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  const shortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <Card className="border-border shadow-md bg-white" data-testid="contract-health-panel">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-display">Contract Health</CardTitle>
          </div>
          <a
            href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-mono"
          >
            {shortAddress(CONTRACT_ADDRESS)}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Reading contract...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <XCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : health ? (
          <>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Payout Address</span>
              <a
                href={`https://etherscan.io/address/${health.payoutAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-primary hover:underline"
              >
                {shortAddress(health.payoutAddress)}
              </a>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">USD Per Sub</span>
              <span className="font-mono font-bold">{health.usdPerSub}</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Parent Namespaces</span>
              <div className="flex flex-wrap gap-2">
                {health.parentStatuses.map((ps) => (
                  <Badge
                    key={ps.name}
                    variant={ps.enabled ? "default" : "secondary"}
                    className={`text-xs font-mono ${ps.enabled ? "bg-green-100 text-green-800 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
                  >
                    {ps.enabled ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {ps.name}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
