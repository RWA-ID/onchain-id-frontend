import { cookieStorage, createStorage, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

export const projectId = '56a7111a1e7b82e5cd75a7100fcd63a7';

export const networks = [mainnet];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: false,
  projectId,
  networks
});

export const config = wagmiAdapter.wagmiConfig;
