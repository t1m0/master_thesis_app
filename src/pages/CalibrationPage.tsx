import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from "react";
import AccelerationRecord from '../ble/AccelerationRecord';

import { subscribeToNotifications, unSubscribeToNotifications } from "../ble/BLEWrapper";
import { readObjectFromStorage, readValueFromStorage } from '../IonicStorage';
import { shareCloud, shareLocal } from '../util/share';
import { Hand } from '../Hand';

const CalibrationPage: React.FC = () => {
  const hand = readObjectFromStorage("hand") as Hand;
  const [bondedDevice, setBondedDevice] = useState<string>();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [results, setResults] = useState(new Array<AccelerationRecord>());
  const [running, setRunning] = useState(false);


  useEffect(() => {
    caputeAccelerometer();
  }, []);


  const dataCallback = (accelerationRecodr: AccelerationRecord) => {
    console.log('acceleration data', accelerationRecodr);
    setResults(results => [...results, accelerationRecodr]);
  }

  const getShareObejct = () => {
    const duration = endTime - startTime;
    return {
      'accelerations': results,
      'startTime': startTime,
      'endTime': endTime,
      'duration': duration,
      'hand':Hand[hand].toLowerCase(),
      'device': bondedDevice
    };
  }

  const clickShareLocal = () => {
    const date = new Date(endTime);
    const fileName = `acceleration_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.json`;
    const result = getShareObejct();
    const file = new File([JSON.stringify(result)], fileName, { type: "application/json" })
    shareLocal(fileName, file);
  }

  const shareToCloud = () => {
    const result = getShareObejct();
    const date = new Date(endTime);
    const fileName = `acceleration_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    shareCloud(fileName, 'ble-test', result);
  }

  const caputeAccelerometer = () => {
    setRunning(true)
    setResults([]);
    console.log("Connecting to Live Data")
    const deviceId = readValueFromStorage(hand + "DeviceId");
    setBondedDevice(deviceId);
    subscribeToNotifications(dataCallback).catch(console.error);
    setStartTime(Date.now());
    setTimeout(async () => {
      unSubscribeToNotifications().catch(console.error);
      setEndTime(Date.now());
      shareToCloud();
      setRunning(false);
    }, 10000);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calibration {Hand[hand]} Hand</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/home' />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <button onClick={clickShareLocal} hidden={running}>Share</button>
        <button onClick={caputeAccelerometer} hidden={running}>Capture Again</button>
        <p>{bondedDevice}</p>
        <p hidden={!running}>Capturing calibration data - don't move the device</p>
        <p hidden={running}>Finished Capturing calibration data.</p>
      </IonContent>
    </IonPage>
  );
};

export default CalibrationPage;
