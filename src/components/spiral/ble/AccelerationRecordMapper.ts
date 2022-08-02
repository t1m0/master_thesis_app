import { dataViewToNumbers } from "@capacitor-community/bluetooth-le";
import AccelerationRecord from "./AccelerationRecord";

export function mapAccelerationRecord(dataView: DataView) {
    console.log("Numbers: ",dataViewToNumbers(dataView));
    const byteArray = dataViewToNumbers(dataView);

    let startPosition = 0;
    const recordCount =  toNumber(byteArray,startPosition,4)
    startPosition += 4;
    const xAxis = toNumber(byteArray,startPosition,2)
    startPosition += 2;
    const yAxis = toNumber(byteArray,startPosition,2)
    startPosition += 2;  
    const zAxis = toNumber(byteArray,startPosition,2)
    return new AccelerationRecord(recordCount,xAxis,yAxis,zAxis);
}

function toNumber(bArray:number[], start:number, length:number){
    const array = new Array<number>();
    let current = start
    while (current < (start+length)) {
        array.push(bArray[current])
        current += 1
    }
    let value = 0;
    for (var i = array.length - 1; i >= 0; i--) {
        value = (value * 256) + array[i];
    }

    return value
}
