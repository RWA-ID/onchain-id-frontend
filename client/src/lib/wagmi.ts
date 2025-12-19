import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Onchain ID',
  projectId: '1c5877c6a51d28929e709977278356d2', // Valid testing Project ID
  chains: [mainnet],
  ssr: false,
});
