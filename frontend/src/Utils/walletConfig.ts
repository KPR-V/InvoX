import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http, type Config } from 'wagmi';
import { 
  mainnet, 
  sepolia, 
  polygon, 
  optimism, 
  arbitrum, 
  base,
  Chain 
} from 'wagmi/chains';

// Define chains to support
const supportedChains = [
  sepolia,    // Ethereum testnet
  mainnet,    // Ethereum mainnet
  polygon,    // Polygon
  optimism,   // Optimism
  arbitrum,   // Arbitrum
  base        // Base
] as const;

// Configure using the recommended pattern for Wagmi v2
export const wagmiConfig: Config = getDefaultConfig({
  appName: 'InvoX',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: supportedChains,
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC_URL),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  ssr: true, // Set to true if using SSR
});

// Export chains for reference
export const chains: readonly Chain[] = supportedChains;