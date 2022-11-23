import { v4 as uuid } from 'uuid';
import AccelerationRecord from '../../ble/AccelerationRecord';
import { Hand } from '../../Hand';
export class DriftSession {
    uuid = uuid();
    startTime = Date.now();
    endTime:number = 0;
    accelerations:{[hand: string] : Array<AccelerationRecord>} = {
        [Hand[Hand.DOMINANT].toLowerCase()]: new Array<AccelerationRecord>(),
        [Hand[Hand.NON_DOMINANT].toLowerCase()]: new Array<AccelerationRecord>()
    };
    nonDominantDevice:string = "";
    dominantDevice:string = "";
}