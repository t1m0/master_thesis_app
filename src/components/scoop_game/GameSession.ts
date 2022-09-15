import AccelerationRecord from "../spiral/ble/AccelerationRecord";
import { GameClick } from "./GameClick";

export class GameSession {
    duration: number = 0;
    startTime: number;
    clicks = new Array<GameClick>();
    accelerations = new Array<AccelerationRecord>();

    constructor() {
        this.startTime = performance.now()
    }

    getValidClickCount() {
        return this.clicks.filter(c => c.valid).length;
    }

    getInValidClickCount() {
        return this.clicks.filter(c => c.valid).length;
    }
}