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

