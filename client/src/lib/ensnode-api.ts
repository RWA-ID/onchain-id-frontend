// ENSNode GraphQL API utilities for fetching domain data
// Endpoint: https://api.mainnet.ensnode.io/graphql

// ENSNode GraphQL subgraph endpoint
const ENSNODE_GRAPHQL = "https://api.mainnet.ensnode.io/subgraph";

// Parent domain namehashes for Onchain ID
const ONCHAIN_ID_PARENT_IDS = [
  "0xc1f10b709aa596814d33a91f03a9ce8354e0bf7d6ea00fc69bef7d139a98f99c", // robot-id.eth
  "0x2f8ff5968b28c179cb52f17940d51e46f16275dbd749f1b31049cc7945361c7b", // machine-id.eth
  "0xefe17b2359c1f396bfb83ec506302e0cbd72d5ff00ca1957f8454ce0fa05360a", // device-id.eth
  "0x2fd70c496f00ccb452268855f8841961b0a4a6c24dd9ad4849f8ce24a3820655", // drone-id.eth
  "0x82737258bf1b013417cf5d9e27d3ca07e9df2678edf231dc7092914fa6619875", // vehicle-id.eth
];

// Map parentId to parent domain name
const PARENT_ID_TO_NAME: Record<string, string> = {
  "0xc1f10b709aa596814d33a91f03a9ce8354e0bf7d6ea00fc69bef7d139a98f99c": "robot-id.eth",
  "0x2f8ff5968b28c179cb52f17940d51e46f16275dbd749f1b31049cc7945361c7b": "machine-id.eth",
  "0xefe17b2359c1f396bfb83ec506302e0cbd72d5ff00ca1957f8454ce0fa05360a": "device-id.eth",
  "0x2fd70c496f00ccb452268855f8841961b0a4a6c24dd9ad4849f8ce24a3820655": "drone-id.eth",
  "0x82737258bf1b013417cf5d9e27d3ca07e9df2678edf231dc7092914fa6619875": "vehicle-id.eth",
};

// Types for minted subnames
export interface MintedSubname {
  name: string;
  labelName: string;
  parentId: string;
  createdAt: string;
}

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

  const lowercaseAddress = address.toLowerCase();
  console.log("Fetching minted subnames for address:", lowercaseAddress);
  console.log("Using parent IDs:", ONCHAIN_ID_PARENT_IDS);

  try {
    const response = await fetch(ENSNODE_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          address: lowercaseAddress,
          parentIds: ONCHAIN_ID_PARENT_IDS,
        },
      }),
    });

    if (!response.ok) {
      console.error(`ENSNode GraphQL error: ${response.status}`);
      return [];
    }

    const result = await response.json();
    console.log("ENSNode GraphQL response:", result);
    
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

