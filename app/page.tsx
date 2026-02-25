'use client'

import { useAccount, useBalance, useDisconnect, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { formatUnits } from 'viem'
import { calculateRisk } from '../lib/risk'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const { data: balance } = useBalance({
    address,
  })

  const formattedBalance =
    balance ? parseFloat(formatUnits(balance.value, balance.decimals)) : 0

  const risk = calculateRisk(formattedBalance)

  return (
    <main style={{ padding: 40 }}>
      <h1>🛡️ DeFi Guardian</h1>
      <p>Secured by BNB Chain</p>

      {!isConnected ? (
        <button onClick={() => connect({ connector: injected() })}>
          Connect Wallet
        </button>
      ) : (
        <>
          <div style={{ marginTop: 20 }}>
            <p><strong>Wallet:</strong> {address}</p>
            <p>
              <strong>Balance:</strong> {formattedBalance} {balance?.symbol}
            </p>
          </div>

          <div style={{
            marginTop: 30,
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8
          }}>
            <h2>Risk Score</h2>
            <p><strong>Score:</strong> {risk.score}/100</p>
            <p><strong>Level:</strong> {risk.level}</p>
          </div>

          <button
            style={{ marginTop: 20 }}
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  )
}