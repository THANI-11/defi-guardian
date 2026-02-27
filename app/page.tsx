"use client"

import { useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi"
import { injected } from "wagmi/connectors"
import { formatUnits } from "viem"
import { calculateRisk } from "@/lib/risk"

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balanceData } = useBalance({ address })

  const [mounted, setMounted] = useState(false)
  const [risk, setRisk] = useState<any>(null)
  const [txCount, setTxCount] = useState<number>(0)
  const [aiAnalysis, setAiAnalysis] = useState("")
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!address) return
    const fetchTxCount = async () => {
      const res = await fetch(
        `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API}&chainid=56`
      )
      const data = await res.json()
      if (data.result) {
        setTxCount(parseInt(data.result, 16))
      }
    }
    fetchTxCount()
  }, [address])

  useEffect(() => {
    if (!mounted || !balanceData) return
    const balance = Number(
      formatUnits(balanceData.value, balanceData.decimals)
    )
    setRisk(calculateRisk(balance, txCount))
  }, [mounted, balanceData, txCount])

  const runAI = async () => {
    if (!risk || !balanceData) return
    setAnalyzing(true)

    const balance = Number(
      formatUnits(balanceData.value, balanceData.decimals)
    )

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address,
        balance,
        txCount,
        riskScore: risk.score,
      }),
    })

    const data = await res.json()
    setAiAnalysis(data.result)
    setAnalyzing(false)
  }

  if (!mounted) return null

  const formattedBalance = balanceData
    ? Number(
      formatUnits(balanceData.value, balanceData.decimals)
    ).toFixed(4)
    : "0"

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        🛡 DeFi Guardian
      </h1>
      <p style={{ opacity: 0.8 }}>
        AI-Powered Wallet Risk Intelligence for BNB Smart Chain
      </p>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          style={{
            marginTop: "30px",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div
          style={{
            marginTop: "30px",
            background: "#1e293b",
            padding: "25px",
            borderRadius: "12px",
          }}
        >
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Balance:</strong> {formattedBalance} BNB</p>
          <p><strong>Transactions:</strong> {txCount}</p>

          {risk && (
            <>
              <h3 style={{ marginTop: "20px" }}>
                Risk Score: {risk.score}/100 ({risk.level})
              </h3>

              <ul>
                {risk.reasons.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

              <button
                onClick={runAI}
                disabled={analyzing}
                style={{
                  marginTop: "15px",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {analyzing ? "Analyzing..." : "Run AI Security Audit"}
              </button>
            </>
          )}

          {aiAnalysis && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#0f172a",
                borderRadius: "10px",
                whiteSpace: "pre-wrap",
              }}
            >
              {aiAnalysis}
            </div>
          )}

          <button
            onClick={() => disconnect()}
            style={{
              marginTop: "20px",
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </main>
  )
}