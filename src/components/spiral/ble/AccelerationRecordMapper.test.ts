import { mapAccelerationRecord } from "./AccelerationRecordMapper";
import * as bluetoothLe from '@capacitor-community/bluetooth-le';
jest.mock('@capacitor-community/bluetooth-le')

test('Handle Notifications', () => {
    const mockDataView = new DataView(new ArrayBuffer(10),0,10);
    const mockNumbers = [142, 0, 0, 0, 22, 8, 160, 249, 214, 241];
    jest.spyOn(bluetoothLe,'dataViewToNumbers').mockReturnValue(mockNumbers);
    const actualRecord = mapAccelerationRecord(mockDataView);
    expect(actualRecord.recordCount).toBe(142);
    expect(actualRecord.xAxis).toBe(2070);
    expect(actualRecord.yAxis).toBe(63904);
    expect(actualRecord.zAxis).toBe(61910);
  });
