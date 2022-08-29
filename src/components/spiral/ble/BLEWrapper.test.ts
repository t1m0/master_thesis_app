import { connectToDevice, subscribeToNotifications, unSubscribeToNotifications } from "./BLEWrapper";
import { BleClient } from '@capacitor-community/bluetooth-le';

jest.mock('@capacitor-community/bluetooth-le');

const mockDevice = { deviceId: 'id', name: 'name', uuids: ['uuid'] };
const mockSuccessVoidPromise = jest.fn().mockImplementationOnce(() => Promise.resolve());
const mockErrorVoidPromise = jest.fn().mockImplementationOnce(() => Promise.reject());

test('Successful connect to Device', () => {
  const mockRequestDevice = jest.fn().mockReturnValue(mockDevice);
  BleClient.requestDevice = mockRequestDevice;
  BleClient.connect = mockSuccessVoidPromise
  return connectToDevice()
    .then(() => {
      expect(mockRequestDevice.mock.calls.length).toBe(1);
      expect(mockSuccessVoidPromise.mock.calls.length).toBe(1);
    })
    .catch(() => fail());
});

test('Error during connect to Device', () => {
  const mockRequestDevice = jest.fn().mockReturnValue(mockDevice);
  BleClient.requestDevice = mockRequestDevice;
  BleClient.connect = mockErrorVoidPromise
  return connectToDevice()
    .then(() => fail())
    .catch(() => {
      expect(mockRequestDevice.mock.calls.length).toBe(1);
      expect(mockErrorVoidPromise.mock.calls.length).toBe(1);
    });
});

test('Successful subscribe to Notifications', () => {
  BleClient.write = mockSuccessVoidPromise;
  BleClient.startNotifications = mockSuccessVoidPromise;
  return subscribeToNotifications(console.log)
    .then(() => {
      expect(mockSuccessVoidPromise.mock.calls.length).toBe(2);
    })
    .catch(() => fail());
});

test('Error during subscribe to Notifications', () => {
  BleClient.write = mockSuccessVoidPromise;
  BleClient.startNotifications = mockErrorVoidPromise;
  return subscribeToNotifications(console.log)
    .then(() => fail())
    .catch(() => {
      expect(mockErrorVoidPromise.mock.calls.length).toBe(1);
      expect(mockSuccessVoidPromise.mock.calls.length).toBe(1);
    });
});

test('Successful unsubscribe from Notifications', () => {
  BleClient.write = mockSuccessVoidPromise;
  BleClient.stopNotifications = mockSuccessVoidPromise;
  BleClient.disconnect = mockSuccessVoidPromise;
  return unSubscribeToNotifications()
    .then(() => {
      expect(mockSuccessVoidPromise.mock.calls.length).toBe(3);
    })
    .catch(() => fail());
});

test('Error during unsubscribe from Notifications', () => {
  BleClient.write = mockSuccessVoidPromise;
  BleClient.stopNotifications = mockErrorVoidPromise;
  BleClient.disconnect = mockSuccessVoidPromise;
  return unSubscribeToNotifications()
    .then(() => fail())
    .catch(() => {
      expect(mockErrorVoidPromise.mock.calls.length).toBe(1);
      expect(mockSuccessVoidPromise.mock.calls.length).toBe(2);
    });
});
