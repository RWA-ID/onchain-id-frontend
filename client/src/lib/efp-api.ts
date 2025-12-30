// EFP API utilities for fetching profile data
// Docs: https://docs.ethfollow.xyz/api

const EFP_API_BASE = "https://api.ethfollow.xyz/api/v1";

// Types for API responses
export interface EnsRecords {
  avatar?: string;
  "com.discord"?: string;
  "com.twitter"?: string;
  description?: string;
  email?: string;
  name?: string;
  "org.telegram"?: string;
  url?: string;
  [key: string]: string | undefined;
}

export interface EnsData {
  name: string | null;
  avatar: string | null;
  records: EnsRecords;
  updated_at: string | null;
}

export interface AccountResponse {
  address: string;
  ens: EnsData | null;
}

export interface StatsResponse {
  followers_count: string;
  following_count: string;
}

// Fetch account info (ENS name, avatar, records)
export async function fetchAccount(addressOrENS: string): Promise<AccountResponse | null> {
  try {
    const response = await fetch(`${EFP_API_BASE}/users/${addressOrENS}/account`);
    if (!response.ok) {
      console.error(`EFP API error: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch account:", error);
    return null;
  }
}

// Fetch follower/following stats
export async function fetchStats(addressOrENS: string): Promise<StatsResponse | null> {
  try {
    const response = await fetch(`${EFP_API_BASE}/users/${addressOrENS}/stats`);
    if (!response.ok) {
      console.error(`EFP API error: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return null;
  }
}

// Combined profile data type
export interface ProfileData {
  address: string;
  ensName: string | null;
  avatar: string | null;
  header: string | null;
  displayName: string | null;
  bio: string | null;
  website: string | null;
  twitter: string | null;
  github: string | null;
  discord: string | null;
  telegram: string | null;
  email: string | null;
  followersCount: number;
  followingCount: number;
}

// Fetch and combine all profile data
export async function fetchProfileData(addressOrENS: string): Promise<ProfileData | null> {
  const [account, stats] = await Promise.all([
    fetchAccount(addressOrENS),
    fetchStats(addressOrENS),
  ]);

  if (!account) {
    return null;
  }

  const ens = account.ens;
  const records = ens?.records || {};

  return {
    address: account.address,
    ensName: ens?.name || null,
    avatar: ens?.avatar || records.avatar || null,
    header: records.header || null,
    displayName: records.name || ens?.name || null,
    bio: records.description || null,
    website: records.url || null,
    twitter: records["com.twitter"] || null,
    github: records["com.github"] || null,
    discord: records["com.discord"] || null,
    telegram: records["org.telegram"] || null,
    email: records.email || null,
    followersCount: stats ? parseInt(stats.followers_count, 10) : 0,
    followingCount: stats ? parseInt(stats.following_count, 10) : 0,
  };
}

// Types for minted subnames
export interface MintedSubname {
  name: string;
  labelName: string;
  parentId: string;
  createdAt: string;
}

// Map parentId to parent domain name
const PARENT_ID_TO_NAME: Record<string, string> = {
  "0xc1f10b709aa596814d33a91f03a9ce8354e0bf7d6ea00fc69bef7d139a98f99c": "robot-id.eth",
  "0x2f8ff5968b28c179cb52f17940d51e46f16275dbd749f1b31049cc7945361c7b": "machine-id.eth",
  "0xefe17b2359c1f396bfb83ec506302e0cbd72d5ff00ca1957f8454ce0fa05360a": "device-id.eth",
  "0x2fd70c496f00ccb452268855f8841961b0a4a6c24dd9ad4849f8ce24a3820655": "drone-id.eth",
  "0x82737258bf1b013417cf5d9e27d3ca07e9df2678edf231dc7092914fa6619875": "vehicle-id.eth",
};

export function getParentName(parentId: string): string {
  return PARENT_ID_TO_NAME[parentId] || "unknown";
}

// Fetch minted Onchain ID subnames for an address
export async function fetchMintedSubnames(address: string): Promise<MintedSubname[]> {
  const query = `
    query GetOnchainIdSubnames($address: String!, $parentIds: [String!]!) {
      domains(
        where: { 
          wrappedOwnerId: $address
          parentId_in: $parentIds
        }
        first: 100
        orderBy: createdAt
        orderDirection: desc
      ) {
        name
        labelName
        parentId
        createdAt
      }
    }
  `;

  try {
    const response = await fetch(ENSNODE_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          address: address.toLowerCase(),
          parentIds: ONCHAIN_ID_PARENT_IDS,
        },
      }),
    });

    if (!response.ok) {
      console.error(`ENSNode GraphQL error: ${response.status}`);
      return [];
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return [];
    }

    return result.data?.domains || [];
  } catch (error) {
    console.error("Failed to fetch minted subnames:", error);
    return [];
  }
}

