import { v4 as uuid } from 'uuid';
import AccelerationRecord from '../../../ble/AccelerationRecord';
import  ImageCoordinate  from "./ImageCoordinate";
import ImageWrapper from "./ImageWrapper";
export default class SpiralDrawing {
    uuid:string;
    imageWrapper:ImageWrapper;
    startTime:number;
    endTime:number = 0;
    start:ImageCoordinate;
    end:ImageCoordinate;
    accelerations:AccelerationRecord[];
    constructor(imageWrapper:ImageWrapper, start:ImageCoordinate, end:ImageCoordinate, accelerations:AccelerationRecord[]) {
        this.uuid = uuid();
        this.startTime = Date.now();
        this.imageWrapper = imageWrapper;
        this.start = start;
        this.end = end;
        this.accelerations = accelerations;
    }
}