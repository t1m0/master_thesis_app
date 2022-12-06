export default class Movement {
    x: number;
    y: number;
    timeStamp: number;

    constructor(x:number,y:number) {
        this.timeStamp = Date.now();
        this.x = x;
        this.y = y;
    }

    equals(rect:Movement) : boolean {
        return this.x == rect.x && this.y == rect.y;
    }
}
