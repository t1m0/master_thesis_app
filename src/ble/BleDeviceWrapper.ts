import { BleDevice } from "@capacitor-community/bluetooth-le";

export default class BleDeviceWrapper {
    bleDevice:BleDevice | undefined;
    constructor(bleDevice:BleDevice | undefined) {
        this.bleDevice = bleDevice;
    }
}