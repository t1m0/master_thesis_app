import  ImageCoordinate  from "./ImageCoordinate";
import ImageWrapper from "./ImageWrapper";
export default class SpiralDrawingResult {
    imageWrapper:ImageWrapper;
    start:ImageCoordinate;
    end:ImageCoordinate;
    constructor(imageWrapper:ImageWrapper, start:ImageCoordinate, end:ImageCoordinate) {
        this.imageWrapper = imageWrapper;
        this.start = start;
        this.end = end;
    }
}