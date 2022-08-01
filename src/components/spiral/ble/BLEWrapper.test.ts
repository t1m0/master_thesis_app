import { connectToDevice } from "./BLEWrapper";
import { BleClient, BleDevice, dataViewToNumbers, numbersToDataView } from '@capacitor-community/bluetooth-le';

jest.mock('@capacitor-community/bluetooth-le')

test('Successful connect to Device', () => {
    const mockRequestDevice = jest.fn().mockReturnValue({deviceId: 'id',name: 'name',uuids: ['uuid']});
    const mockConnect = jest.fn().mockImplementationOnce(() => Promise.resolve());
    BleClient.requestDevice = mockRequestDevice;
    BleClient.connect = mockConnect
    return connectToDevice().then(device => {
      expect(device.deviceId).toBe('id');
    });
  });