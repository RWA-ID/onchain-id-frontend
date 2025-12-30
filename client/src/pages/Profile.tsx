import { useAccount } from "wagmi";
import { useLocation } from "wouter";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Profile() {
  const { address, isConnected } = useAccount();
  const [, setLocation] = useLocation();

  // Show connect prompt if not logged in
  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
        <Card className="w-full max-w-md border-primary/20 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display">
              View Your Profile
            </CardTitle>
            <CardDescription className="text-lg">
              Connect your wallet to view your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Connected - show placeholder profile
  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-display">Profile</CardTitle>
            <CardDescription>
              Connected as: <span className="font-mono">{address}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Profile data will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

