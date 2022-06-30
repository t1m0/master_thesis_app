import SpiralDrawingResult from "../model/SpiralDrawingResult";
import UnravelSpiral from "./UnravelSpiral";

export default class SpiralRating {
    unravelSpiral = new UnravelSpiral();

    calc_mean_slope(radii:number[], angles:number[]){
        
        return 0;
    } 
    

    rate(result:SpiralDrawingResult) {
        const unraveled_spiral = this.unravelSpiral.unravel_spiral(result.start, result.imageWrapper.coordinates);
        console.log(unraveled_spiral);
    }
}