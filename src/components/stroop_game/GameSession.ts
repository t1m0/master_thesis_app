import { v4 as uuid } from 'uuid';
import AccelerationRecord from "../../ble/AccelerationRecord";
import { GameClick } from "./GameClick";
import { GameType } from "./GameType";

export class GameSession {
    uuid: string;
    gameType: GameType;
    startTime: number;
    endTime:number = 0;
    clicks = new Array<GameClick>();
    accelerations = new Array<AccelerationRecord>();

    constructor(gameType: GameType) {
        this.uuid = uuid();
        this.startTime = Date.now();
        this.gameType = gameType;
    }

    getValidClickCount() {
        return this.clicks.filter(c => c.valid).length;
    }

    getInValidClickCount() {
        return this.clicks.filter(c => c.valid).length;
    }
}