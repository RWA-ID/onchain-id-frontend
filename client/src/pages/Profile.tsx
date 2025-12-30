import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useLocation } from "wouter";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchProfileData, type ProfileData } from "@/lib/efp-api";

export default function Profile() {
  const { address, isConnected } = useAccount();
  const [, setLocation] = useLocation();
  
  // Profile data state
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile when address changes
  useEffect(() => {
    if (!address) {
      setProfile(null);
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchProfileData(address);
        console.log("Profile data fetched:", data);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [address]);

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

  // Connected - show profile with data
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : profile ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">ENS Name:</span>
                    <p className="font-mono font-medium">{profile.ensName || "None"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Display Name:</span>
                    <p className="font-medium">{profile.displayName || "None"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Followers:</span>
                    <p className="font-medium">{profile.followersCount}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Following:</span>
                    <p className="font-medium">{profile.followingCount}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Bio:</span>
                    <p className="font-medium">{profile.bio || "No bio set"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Twitter:</span>
                    <p className="font-medium">{profile.twitter || "None"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Discord:</span>
                    <p className="font-medium">{profile.discord || "None"}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  (Debug: Check console for full API response)
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No profile data found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
