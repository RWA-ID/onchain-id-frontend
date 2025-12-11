import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Onchain ID',
  projectId: 'YOUR_PROJECT_ID', // TODO: Get a project ID from WalletConnect
  chains: [base],
  ssr: false, // Client-side only for this mockup
});
