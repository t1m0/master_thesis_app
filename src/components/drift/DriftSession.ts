import { v4 as uuid } from 'uuid';
import AccelerationRecord from '../../ble/AccelerationRecord';
import { Hand } from '../../Hand';
export class DriftSession {
    uuid:string;
    startTime = Date.now();
    endTime:number = 0;
    accelerations:{[hand: string] : Array<AccelerationRecord>};
    nonDominantDevice:string = "";
    dominantDevice:string = "";

    constructor() {
        this.uuid = uuid();
        this.accelerations = {
            [Hand[Hand.DOMINANT].toLowerCase()]: new Array<AccelerationRecord>(),
            [Hand[Hand.NON_DOMINANT].toLowerCase()]: new Array<AccelerationRecord>()
        }
    }
}