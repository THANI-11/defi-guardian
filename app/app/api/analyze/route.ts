import OpenAI from "openai"

export async function POST(req: Request) {
    try {
        console.log("AI route triggered")

        const { address, balance, txCount, riskScore } = await req.json()

        console.log("Request data:", { address, balance, txCount, riskScore })

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })

        if (!process.env.OPENAI_API_KEY) {
            console.log("❌ OPENAI KEY MISSING")
            return Response.json(
                { error: "OpenAI key missing" },
                { status: 500 }
            )
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a blockchain security analyst."
                },
                {
                    role: "user",
                    content: `
Wallet: ${address}
Balance: ${balance}
Transactions: ${txCount}
Risk Score: ${riskScore}/100

Give a professional security audit report.
          `
                }
            ],
        })

        console.log("AI success")

        return Response.json({
            report: completion.choices[0].message.content
        })

    } catch (error: any) {
        console.error("🔥 AI ERROR:", error)

        return Response.json(
            { error: error.message || "AI failed" },
            { status: 500 }
        )
    }
}