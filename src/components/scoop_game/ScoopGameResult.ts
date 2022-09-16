import { GameSession } from './GameSession';

export class ScoopGameResult {
    gameSession:GameSession;
    successRate:number;
    meanDistance:number;
    distanceStandardDeviation:number;

    constructor(gameSession:GameSession, successRate:number, meanDistance:number, distanceStandardDeviation:number) {
        this.gameSession = gameSession;
        this.successRate = successRate;
        this.meanDistance = meanDistance;
        this.distanceStandardDeviation = distanceStandardDeviation;
    }
}
