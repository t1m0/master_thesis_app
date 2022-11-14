import { GameSession } from "./GameSession";
import { StroopGameResult } from "./StroopGameResult";

export function analyse_stroop_game(gameSession: GameSession) {
    const n = gameSession.clicks.length;
    const successRate = gameSession.getValidClickCount() / (n) * 100;
    const meanDistance = gameSession.clicks.filter(c => c.valid).reduce((a, b) => a + b.distance, 0) / n;
    const distanceStandardDeviation = Math.sqrt(gameSession.clicks.map(c => Math.pow(c.distance - meanDistance, 2)).reduce((a, b) => a + b) / n);
    return new StroopGameResult(gameSession, successRate, meanDistance, distanceStandardDeviation)
}