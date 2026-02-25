export function calculateRisk(balance: number) {
    let score = 0

    if (balance < 0.05) score += 30
    if (balance > 5) score += 10
    if (Math.random() > 0.5) score += 20

    const level =
        score < 30 ? 'Low'
            : score < 60 ? 'Medium'
                : 'High'

    return { score, level }
}