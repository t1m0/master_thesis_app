import { v4 as uuid } from 'uuid';
import AccelerationRecord from '../ble/AccelerationRecord';
import  ImageCoordinate  from "./ImageCoordinate";
import ImageWrapper from "./ImageWrapper";
export default class SpiralDrawing {
    uuid:string;
    imageWrapper:ImageWrapper;
    start:ImageCoordinate;
    end:ImageCoordinate;
    time:number;
    accelerations:AccelerationRecord[];
    constructor(imageWrapper:ImageWrapper, start:ImageCoordinate, end:ImageCoordinate, time:number, accelerations:AccelerationRecord[]) {
        this.uuid = uuid();
        this.imageWrapper = imageWrapper;
        this.start = start;
        this.end = end;
        this.time = time;
        this.accelerations = accelerations;
    }
}