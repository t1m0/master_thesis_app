import { BleClient, BleDevice, BleService, dataViewToHexString, dataViewToNumbers, dataViewToText, numbersToDataView, numberToUUID, ScanResult } from '@capacitor-community/bluetooth-le';
import AccelerationRecord from './AccelerationRecord';

const LIVE_SENSOR_SERVICE_UUID = "01550001-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_FRAME_RATE_GUID = "01550009-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_ACCELERATION_GUID = "0155000D-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_FLAG_GUID = "0155000B-5555-5507-0002-01EEDDCCBBAA";

const BLE_SERVICE = "0000180f-0000-1000-8000-00805f9b34fb";


export async function connectToDevice(): Promise<BleDevice> {
    try {
        BleClient.initialize();

        const device = await BleClient.requestDevice({
            services: [BLE_SERVICE]
          });
        console.log('connecting to device', device.deviceId);
        await BleClient.connect(device.deviceId, onDisconnect,{timeout:10000});
        console.log('connected to device', device.deviceId);
        return device;
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function subscribeToNotifications(device:BleDevice, dataCallback: (record: AccelerationRecord) => void):Promise<void> {
    try {
        await BleClient.write(device.deviceId, LIVE_SENSOR_SERVICE_UUID, LIVE_SENSOR_FLAG_GUID, numbersToDataView([1]));
        console.log('live sensor flag updated');
        await BleClient.startNotifications(
            device.deviceId,
            LIVE_SENSOR_SERVICE_UUID,
            LIVE_SENSOR_ACCELERATION_GUID,
            value => {
                const record = createAccelerationRecord(value);
                console.log(record);
                dataCallback(record);
            });
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}


export async function unSubscribeToNotifications(device:BleDevice):Promise<void> {
    try {
        await BleClient.stopNotifications(device.deviceId, LIVE_SENSOR_SERVICE_UUID, LIVE_SENSOR_ACCELERATION_GUID);
        await BleClient.write(device.deviceId, LIVE_SENSOR_SERVICE_UUID, LIVE_SENSOR_FLAG_GUID, numbersToDataView([0]));
        await BleClient.disconnect(device.deviceId);
        console.log('disconnected from device', device.deviceId);
        return Promise.resolve()
    } catch (error) {
        return Promise.reject(error);
    }
}

function onDisconnect(deviceId: string): void {
    console.log(`device ${deviceId} disconnected`);
}

function createAccelerationRecord(value:DataView) {
    console.log("Numbers: ",dataViewToNumbers(value));
    const byteArray = dataViewToNumbers(value);

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
    console.log(`Slice ${start} - ${start+length}for calc: `,array);
    let value = 0;
    for (var i = array.length - 1; i >= 0; i--) {
        value = (value * 256) + array[i];
    }

    return value
}

