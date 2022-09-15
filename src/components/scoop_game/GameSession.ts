import AccelerationRecord from "../spiral/ble/AccelerationRecord";

export class GameSession {
    validSelections: number = 0;
    invalidSelections: number = 0;
    duration: number = 0;
    startTime: number;
    clickDistance = new Array<number>();
    accelerations = new Array<AccelerationRecord>();

    constructor() {
        this.startTime = performance.now()
    }
}