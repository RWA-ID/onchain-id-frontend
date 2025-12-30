import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { 
  User, 
  Loader2, 
  Mail,
  Copy,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { fetchProfileData, type ProfileData } from "@/lib/efp-api";
import { fetchMintedSubnames, getParentName, type MintedSubname } from "@/lib/ensnode-api";

// Social icon components (simple SVGs matching the screenshot style)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default function Profile() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  
  // Profile data state
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Minted subnames state
  const [mintedSubnames, setMintedSubnames] = useState<MintedSubname[]>([]);
  const [isLoadingSubnames, setIsLoadingSubnames] = useState(false);

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

  // Fetch minted subnames when address changes
  useEffect(() => {
    if (!address) {
      setMintedSubnames([]);
      return;
    }

    const loadSubnames = async () => {
      setIsLoadingSubnames(true);
      try {
        const subnames = await fetchMintedSubnames(address);
        console.log("Minted subnames fetched:", subnames);
        setMintedSubnames(subnames);
      } catch (err) {
        console.error("Failed to fetch minted subnames:", err);
      } finally {
        setIsLoadingSubnames(false);
      }
    };

    loadSubnames();
  }, [address]);

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Truncate address for display
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pt-28 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Card className="border-border shadow-lg overflow-hidden">
            {/* Header background */}
            <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900" />
            
            <CardContent className="relative px-6 pb-8">
              {/* Avatar skeleton */}
              <div className="-mt-16 mb-4">
                <Skeleton className="w-32 h-32 rounded-full border-4 border-white" />
              </div>
              
              {/* Name skeleton */}
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              
              {/* Stats skeleton */}
              <div className="flex gap-6 mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
              
              {/* Bio skeleton */}
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 pt-28 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Card className="border-destructive/20 shadow-lg">
            <CardContent className="py-12 text-center">
              <p className="text-destructive text-lg">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get avatar URL - use ENS metadata service for reliable avatar resolution
  const getAvatarUrl = () => {
    if (profile?.ensName) {
      // ENS metadata service resolves all avatar formats (IPFS, ERC721, direct URLs)
      return `https://metadata.ens.domains/mainnet/avatar/${profile.ensName}`;
    }
    return profile?.avatar || null;
  };
  const avatarUrl = getAvatarUrl();

  // Social links array for rendering
  const socialLinks = [
    { key: "twitter", value: profile?.twitter, icon: TwitterIcon, href: profile?.twitter ? `https://x.com/${profile.twitter}` : null, label: `@${profile?.twitter}` },
    { key: "github", value: profile?.github, icon: GitHubIcon, href: profile?.github ? `https://github.com/${profile.github}` : null, label: profile?.github || "GitHub" },
    { key: "telegram", value: profile?.telegram, icon: TelegramIcon, href: profile?.telegram ? `https://t.me/${profile.telegram}` : null, label: `@${profile?.telegram}` },
    { key: "discord", value: profile?.discord, icon: DiscordIcon, href: null, label: profile?.discord || "Discord" },
    { key: "email", value: profile?.email, icon: Mail, href: profile?.email ? `mailto:${profile.email}` : null, label: profile?.email || "Email" },
  ].filter(s => s.value);

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Card className="border-border shadow-lg overflow-hidden">
          {/* Header background */}
          {profile?.header ? (
            <div className="h-32 bg-slate-800 overflow-hidden">
              <img 
                src={profile.header} 
                alt="Header" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900" />
          )}
          
          <CardContent className="relative px-6 pb-8">
            {/* Avatar */}
            <div className="-mt-16 mb-4 flex items-end justify-between">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={profile?.displayName || "Profile"} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to default icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center bg-slate-100 ${avatarUrl ? 'hidden' : ''}`}>
                  <User className="w-12 h-12 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Name & Address */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold font-display text-slate-900">
                {profile?.ensName || profile?.displayName || truncateAddress(address!)}
              </h1>
              <button 
                onClick={copyAddress}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-slate-700 transition-colors mt-1 font-mono"
              >
                {truncateAddress(address!)}
                {copied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>

            {/* Follower Stats - Link to EFP */}
            <div className="flex gap-6 mb-4">
              <a 
                href={`https://efp.app/${profile?.ensName || address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:opacity-70 transition-opacity"
              >
                <span className="font-bold text-slate-900">{profile?.followingCount || 0}</span>
                <span className="text-muted-foreground">Following</span>
              </a>
              <a 
                href={`https://efp.app/${profile?.ensName || address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:opacity-70 transition-opacity"
              >
                <span className="font-bold text-slate-900">{profile?.followersCount || 0}</span>
                <span className="text-muted-foreground">Followers</span>
              </a>
            </div>

            {/* Bio */}
            {profile?.bio && (
              <p className="text-slate-700 mb-4 whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return social.href ? (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                      title={social.label}
                    >
                      <Icon />
                    </a>
                  ) : (
                    <button
                      key={social.key}
                      onClick={() => {
                        if (social.value) {
                          navigator.clipboard.writeText(String(social.value));
                          toast({
                            title: "Copied!",
                            description: `${social.label} copied to clipboard`,
                          });
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      title={`${social.label} (click to copy)`}
                    >
                      <Icon />
                    </button>
                  );
                })}
              </div>
            )}

          </CardContent>
        </Card>

        {/* Minted Onchain IDs Section */}
        <Card className="border-border shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-display">Your Onchain IDs</CardTitle>
            <CardDescription>
              Subnames you've minted through Onchain ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSubnames ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : mintedSubnames.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't minted any Onchain IDs yet.</p>
                <a href="/mint">
                  <Button variant="outline" className="cursor-pointer">
                    Mint Your First ID
                  </Button>
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {mintedSubnames.map((subname) => (
                  <div 
                    key={subname.name}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <div>
                      <p className="font-mono font-medium text-slate-900">{subname.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {getParentName(subname.parentId)}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {new Date(parseInt(subname.createdAt) * 1000).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
