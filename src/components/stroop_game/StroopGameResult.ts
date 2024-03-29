import { GameSession } from './GameSession';

export class StroopGameResult {
    gameSession: GameSession;
    successRate: number;
    meanDistance: number;
    distanceStandardDeviation: number;
    device: string = "";
    hand: string = "";

    constructor(gameSession: GameSession, successRate: number, meanDistance: number, distanceStandardDeviation: number) {
        this.gameSession = gameSession;
        this.successRate = successRate;
        this.meanDistance = meanDistance;
        this.distanceStandardDeviation = distanceStandardDeviation;
    }
}
