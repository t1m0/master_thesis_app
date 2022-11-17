import { BleClient, BleDevice, dataViewToNumbers, numbersToDataView } from '@capacitor-community/bluetooth-le';
import { isPlatform } from '@ionic/react';
import { Hand } from '../Hand';
import { readObjectFromStorage, readValueFromStorage, writeInStorage } from '../IonicStorage';
import AccelerationRecord from './AccelerationRecord';
import { mapAccelerationRecord } from './AccelerationRecordMapper';

const LIVE_SENSOR_SERVICE_UUID = "01550001-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_FRAME_RATE_GUID = "01550009-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_ACCELERATION_GUID = "0155000D-5555-5507-0002-01EEDDCCBBAA";
const LIVE_SENSOR_FLAG_GUID = "0155000B-5555-5507-0002-01EEDDCCBBAA";

const BLE_SERVICE = "0000180f-0000-1000-8000-00805f9b34fb";



export async function connectToDevices(): Promise<void> {
    try {
        await connectToDevice(Hand.DOMINANT);
        await connectToDevice(Hand.NON_DOMINANT);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function connectToDevice(hand: Hand): Promise<void> {
    if (isPlatform('desktop')) {
        return Promise.reject("BLE not supported on Desktop!");
    }
    const key = hand + "DeviceId";
    try {
        const deviceId = readValueFromStorage(key);
        if (deviceId == undefined) {
            BleClient.initialize();
            alert(`Please select ${Hand[hand].toLowerCase()} hand device`);
            const device = await BleClient.requestDevice({
                services: [BLE_SERVICE]
            });
            console.log(`connecting to device '${device.deviceId}' for hand '${hand}'`,);
            await BleClient.connect(device.deviceId, onDisconnect, { timeout: 10000 });
            console.log(`connected to device '${device.deviceId}' for hand '${hand}'`);
            writeInStorage(key, device.deviceId);
        }
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function subscribeToNotifications(dataCallback: (record: AccelerationRecord) => void): Promise<void> {
    const hand = readObjectFromStorage("hand") as Hand;
    
    try {
        await subscribeToNotificationsForHand(hand, dataCallback);
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function subscribeToNotificationsForHand(hand:Hand, dataCallback: (record: AccelerationRecord) => void): Promise<void> {
    if (isPlatform('desktop')) {
        return Promise.reject("BLE not supported on Desktop!");
    }
    try {
        const deviceId = readValueFromStorage(hand + "DeviceId");
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
    const hand = readObjectFromStorage("hand") as Hand;
    try {
        await unSubscribeToNotificationsForHand(hand);
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function unSubscribeToNotificationsForHand(hand:Hand): Promise<void> {
    if (isPlatform('desktop')) {
        return Promise.reject("BLE not supported on Desktop!");
    }
    try {
        const deviceId = readValueFromStorage(hand + "DeviceId");
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
