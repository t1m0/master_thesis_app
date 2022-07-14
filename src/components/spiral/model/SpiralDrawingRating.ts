export default class SpiralDrawingRating {
    dataPoints:number;
    firstOrderSmoothness:number;
    secondOrderSmoothness:number;
    thightness:number;
    zeroCrossingRate:number;
    degreeOfSeverity:number;
    severityLevel:String;

    constructor(dataPoints:number, firstOrderSmoothness:number,secondOrderSmoothness:number,thightness:number,zeroCrossingRate:number,degreeOfSeverity:number, severityLevel:String) {
        this.dataPoints = dataPoints;
        this.firstOrderSmoothness = firstOrderSmoothness;
        this.secondOrderSmoothness = secondOrderSmoothness;
        this.thightness = thightness;
        this.zeroCrossingRate = zeroCrossingRate;
        this.degreeOfSeverity = degreeOfSeverity;
        this.severityLevel = severityLevel;
    }
}