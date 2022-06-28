import  ImageCoordinate  from "./ImageCoordinate";
export default class SpiralDrawingResult {
    blob:Blob;
    start:ImageCoordinate;
    end:ImageCoordinate;
    constructor(blob:Blob, start:ImageCoordinate, end:ImageCoordinate) {
        this.blob = blob;
        this.start = start;
        this.end = end;
    }
}