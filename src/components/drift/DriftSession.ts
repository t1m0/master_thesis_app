import { v4 as uuid } from 'uuid';
import AccelerationRecord from '../../ble/AccelerationRecord';
import { Hand } from '../../Hand';
export class DriftSession {
    uuid = uuid();
    startTime = Date.now();
    endTime:number = 0;
    accelerations:{[hand in Hand] : Array<AccelerationRecord>} = {
        [Hand.DOMINANT]: new Array<AccelerationRecord>(),
        [Hand.NON_DOMINANT]: new Array<AccelerationRecord>()
    };
    nonDominantDevice:string = "";
    dominantDevice:string = "";
}