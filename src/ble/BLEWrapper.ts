import { BleClient, BleDevice, dataViewToNumbers, numbersToDataView } from '@capacitor-community/bluetooth-le';
import { isPlatform } from '@ionic/react';
import { readValueFromStorage, writeInStorage } from '../IonicStorage';
import AccelerationRecord from './AccelerationRecord';
import { mapAccelerationRecord } from './AccelerationRecordMapper';

const LIVE_SENSOR_SERVICE_UUID = "01550001-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_FRAME_RATE_GUID = "01550009-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_ACCELERATION_GUID = "0155000D-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_FLAG_GUID = "0155000B-5555-5507-0002-01EEDDCCBBAA";

const BLE_SERVICE = "0000180f-0000-1000-8000-00805f9b34fb";


export async function connectToDevice(): Promise<void> {
    if (isPlatform('desktop')) {
        return Promise.reject("BLE not supported on Desktop!");
    }
    try {
        const deviceId = readValueFromStorage("DeviceId");
        if (deviceId == undefined) {
            BleClient.initialize();

            const device = await BleClient.requestDevice({
                services: [BLE_SERVICE]
            });
            console.log('connecting to device', device.deviceId);
            await BleClient.connect(device.deviceId, onDisconnect, { timeout: 10000 });
            console.log('connected to device', device.deviceId);
            writeInStorage("DeviceId", device.deviceId);
        }
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function subscribeToNotifications(dataCallback: (record: AccelerationRecord) => void): Promise<void> {
    if (isPlatform('desktop')) {
        return Promise.reject("BLE not supported on Desktop!");
    }
    try {
        const deviceId = readValueFromStorage("DeviceId");
        if (deviceId) {
            await BleClient.write(deviceId, LIVE_SENSOR_SERVICE_UUID, LIVE_SENSOR_FLAG_GUID, numbersToDataView([1]));
            console.log('live sensor flag updated');
            await BleClient.startNotifications(
                deviceId,
                LIVE_SENSOR_SERVICE_UUID,
                LIVE_SENSOR_ACCELERATION_GUID,
                value => {
                    const record = mapAccelerationRecord(value);
                    console.log(record);
                    dataCallback(record);
                });
        }
        return Promise.resolve();
    } catch (error) {
        console.error(error)
        return Promise.reject(error);
    }
}

export async function unSubscribeToNotifications(): Promise<void> {
    if (isPlatform('desktop')) {
        return Promise.reject("BLE not supported on Desktop!");
    }
    try {
        const deviceId = await readValueFromStorage("DeviceId");
        if (deviceId) {
            await BleClient.stopNotifications(deviceId, LIVE_SENSOR_SERVICE_UUID, LIVE_SENSOR_ACCELERATION_GUID);
            await BleClient.write(deviceId, LIVE_SENSOR_SERVICE_UUID, LIVE_SENSOR_FLAG_GUID, numbersToDataView([0]));
            console.log('disconnected from device', deviceId);
        }
        return Promise.resolve()
    } catch (error) {
        console.error(error)
        return Promise.reject(error);
    }
}

function onDisconnect(deviceId: string): void {
    console.log(`device ${deviceId} disconnected`);
}
