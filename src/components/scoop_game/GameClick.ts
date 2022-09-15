export class GameClick {
    timeStamp = Date.now();
    x = 0;
    y = 0;
    distance = -1;
    valid = false;

    constructor(x: number, y: number, valid: boolean) {
        this.x = x;
        this.y = y;
        this.valid = valid
    }
}