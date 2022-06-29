import { v4 as uuid } from 'uuid';
import  ImageCoordinate  from "./ImageCoordinate";
import ImageWrapper from "./ImageWrapper";
export default class SpiralDrawingResult {
    uuid:string;
    imageWrapper:ImageWrapper;
    start:ImageCoordinate;
    end:ImageCoordinate;
    constructor(imageWrapper:ImageWrapper, start:ImageCoordinate, end:ImageCoordinate) {
        this.uuid = uuid();
        this.imageWrapper = imageWrapper;
        this.start = start;
        this.end = end;
    }
}