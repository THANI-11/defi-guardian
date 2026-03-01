import { createConfig, http } from "wagmi"
import { bsc } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

export const config = createConfig({
    chains: [bsc],
    transports: {
        [bsc.id]: http(),
    },
    connectors: [
        injected(),
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
        }),
    ],
})