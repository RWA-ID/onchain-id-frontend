import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Onchain ID',
  projectId: '56a7111a1e7b82e5cd75a7100fcd63a7', // User provided Project ID
  chains: [mainnet],
  ssr: false,
});
