import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
    try {
        const { address, balance, txCount, riskScore } = await req.json()

        const prompt = `
You are a senior blockchain security auditor specializing in BNB Smart Chain.

Perform a professional wallet risk assessment.

Wallet Data:
- Address: ${address}
- BNB Balance: ${balance}
- Transaction Count: ${txCount}
- Calculated Risk Score: ${riskScore}/100

Provide:

1. Executive Risk Summary (2-3 sentences)
2. Behavioral Analysis
3. Potential Threat Indicators
4. Security Recommendations
5. Overall Risk Verdict (Low / Medium / High)

Be concise, analytical, and professional.
Use bullet points where appropriate.
Avoid generic statements.
`

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an elite blockchain security analyst."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
        })

        return Response.json({
            result: completion.choices[0].message.content,
        })

    } catch (error) {
        return Response.json(
            { error: "AI analysis failed" },
            { status: 500 }
        )
    }
}