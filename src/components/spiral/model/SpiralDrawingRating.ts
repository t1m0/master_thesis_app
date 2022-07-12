export default class SpiralDrawingRating {
    firstOrderSmoothness:number;
    secondOrderSmoothness:number;
    thightness:number;
    zeroCrossingRate:number;
    degreeOfSeverity:number;

    constructor(firstOrderSmoothness:number,secondOrderSmoothness:number,thightness:number,zeroCrossingRate:number,degreeOfSeverity:number) {
        this.firstOrderSmoothness = firstOrderSmoothness;
        this.secondOrderSmoothness = secondOrderSmoothness;
        this.thightness = thightness;
        this.zeroCrossingRate = zeroCrossingRate;
        this.degreeOfSeverity = degreeOfSeverity;
    }
}