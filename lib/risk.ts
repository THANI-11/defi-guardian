export function calculateRisk(balance: number, txCount: number) {
    let score = 50
    const reasons: string[] = []

    if (balance === 0) {
        score -= 20
        reasons.push("Wallet has zero BNB balance")
    }

    if (balance < 0.1 && balance > 0) {
        score -= 10
        reasons.push("Very low BNB balance")
    }

    if (txCount === 0) {
        score -= 20
        reasons.push("No transaction history")
    }

    if (txCount > 100) {
        score += 20
        reasons.push("High transaction activity")
    }

    if (score < 0) score = 0
    if (score > 100) score = 100

    const level =
        score >= 70 ? "High" :
            score >= 40 ? "Medium" :
                "Low"

    return { score, level, reasons }
}