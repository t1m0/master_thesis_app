export class GameSession {
    validSelections: number = 0;
    invalidSelections: number = 0;
    duration: number = 0;
    startTime: number;
    clickDistance = new Array<number>();

    constructor() {
        this.startTime = performance.now()
    }
}