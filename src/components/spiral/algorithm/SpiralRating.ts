import SpiralDrawingResult from "../model/SpiralDrawingResult";
import AStar from "./AStar";
import UnravelSpiral from "./UnravelSpiral";

export default class SpiralRating {
    unravelSpiral = new UnravelSpiral();

    rate(result:SpiralDrawingResult) {
        const unraveled_spiral = this.unravelSpiral.unravel_spiral(result.start, result.imageWrapper.coordinates);
        console.log(unraveled_spiral);
    }
}