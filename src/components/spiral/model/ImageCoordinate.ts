export default class ImageCoordinate {
    x: number;
    y: number;

    constructor(x:number,y:number) {
        this.x = x;
        this.y = y;
    }

    equals(rect:ImageCoordinate) : boolean {
        return this.x == rect.x && this.y == rect.y;
    }
}
