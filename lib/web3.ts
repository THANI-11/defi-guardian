"use client";

import { createConfig, http } from "wagmi";
import { bsc } from "wagmi/chains";

export const config = createConfig({
    chains: [bsc],
    transports: {
        [bsc.id]: http(),
    },
});