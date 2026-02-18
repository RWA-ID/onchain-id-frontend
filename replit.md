# Onchain ID

## Overview

Onchain ID is a programmable identity infrastructure platform built on Ethereum, designed to provide verifiable onchain identities for robots, machines, devices, drones, and vehicles. The platform uses ENS (Ethereum Name Service) based naming to issue and manage decentralized identities, allowing manufacturers (OEMs) to register unique subdomains for their autonomous systems.

The application enables bulk minting of machine identities, license purchases for namespace ownership, and integrates with Ethereum wallets via Reown AppKit for Web3 interactions (including social login via Google, X, GitHub, Discord, Apple, Farcaster).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled using Vite
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Web3 Integration**: 
  - Wagmi for Ethereum interactions
  - Reown AppKit for wallet connection UI (with social login)
  - Viem for low-level Ethereum utilities
- **Animations**: Framer Motion for UI animations

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Build Process**: Custom build script using esbuild for server bundling, Vite for client
- **Static Serving**: Express serves the built client assets in production

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - shared between client and server
- **Validation**: Zod schemas generated via drizzle-zod
- **Current Storage**: In-memory storage implementation (`MemStorage` class) with interface for database migration

### Smart Contract Integration
- **Contract Address**: `0x912C98f1d76728e3A33A6aeFE4d1aB7F6ccfb8cD`
- **Network**: Ethereum Mainnet (with Base chain for gas calculations)
- **Key Functions**: 
  - `buyLicense` - Purchase namespace licenses
  - `registerBulk` - Batch register subdomains
  - `quoteBulk` - Get pricing in Wei (replaces old getQuoteUSDC)
  - `hasLicense` - Check if address has a license for a parent
  - `usdPerSub` - Get USD price per subdomain
  - `parentEnabled` - Check if a parent namespace is active
- **Price Oracle**: Chainlink ETH/USD feed integration

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components (shadcn/ui + custom)
│   │   ├── pages/        # Route pages (Home, Mint, AboutUs, UseCases)
│   │   ├── lib/          # Utilities, wagmi config, constants, ABI
│   │   └── hooks/        # Custom React hooks
│   └── public/       # Static assets
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data storage interface
│   └── static.ts     # Static file serving
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Database migrations (Drizzle Kit)
```

### Key Design Decisions
1. **Monorepo Structure**: Client and server in single repository with shared code
2. **Type Safety**: End-to-end TypeScript with Zod validation
3. **Component Library**: shadcn/ui provides accessible, customizable components
4. **SEO Optimization**: Server-rendered meta tags, structured data (JSON-LD), sitemap

## External Dependencies

### Blockchain Services
- **Ethereum Mainnet**: Primary network for ENS identity registration
- **Base Chain**: Used for gas price estimation
- **ENS (Ethereum Name Service)**: Core naming infrastructure
- **Chainlink Price Feeds**: ETH/USD oracle for pricing (`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`)

### Third-Party APIs
- **CoinGecko API**: ETH price fetching for UI display
- **WalletConnect**: Via Reown AppKit project ID `56a7111a1e7b82e5cd75a7100fcd63a7`

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migration tooling

### Key NPM Packages
- `@reown/appkit` - Wallet connection with social login
- `wagmi` / `viem` - Ethereum interactions
- `drizzle-orm` - Database ORM
- `framer-motion` - Animations
- `ethers` - Additional Ethereum utilities
- `react-day-picker` - Date selection components

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- WalletConnect Project ID (hardcoded in wagmi config)