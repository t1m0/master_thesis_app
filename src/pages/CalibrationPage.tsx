import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidLeave } from '@ionic/react';
import React, { useEffect, useState } from "react";
import AccelerationRecord from '../ble/AccelerationRecord';

import { v4 as uuid } from 'uuid';

import { handleBleError, subscribeToNotifications, unSubscribeToNotifications } from "../ble/BLEWrapper";
import { appendSessionUuid, readObjectFromStorage, readValueFromStorage } from '../IonicStorage';
import { shareCloud, shareLocal } from '../util/share';
import { Hand } from '../Hand';

const CalibrationPage: React.FC = () => {
  const hand = readObjectFromStorage("hand") as Hand;
  const [bondedDevice, setBondedDevice] = useState<string>();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [results, setResults] = useState(new Array<AccelerationRecord>());
  const [running, setRunning] = useState(false);
  const [calibrationUuid, setCalibrationUuid] = useState("");
  const [calibrationIterations, setCalibrationIterations] = useState(0);


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
      'uuid': calibrationUuid,
      'accelerations': results,
      'startTime': startTime,
      'endTime': endTime,
      'duration': duration,
      'hand': Hand[hand].toLowerCase(),
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
    shareCloud(fileName, 'calibration', result);
  }



  const caputeAccelerometer = () => {
    setCalibrationUuid(uuid());
    setCalibrationIterations(calibrationIterations + 1);
    setRunning(true)
    setResults([]);
    console.log("Connecting to Live Data")
    const deviceId = readValueFromStorage(hand + "DeviceId");
    setBondedDevice(deviceId);
    subscribeToNotifications(dataCallback).catch(handleBleError);
    setStartTime(Date.now());
    setTimeout(async () => {
      unSubscribeToNotifications().catch(handleBleError);
      setEndTime(Date.now());
      if (results.length > 0) {
        shareToCloud();
      } else {
        alert("Not shared to cloud, since acceleration data is missing.");
      }
      setRunning(false);
      setCalibrationIterations(appendSessionUuid('calibration-' + Hand[hand], calibrationUuid));
    }, 10000);
  }

  useIonViewDidLeave(() => {
    unSubscribeToNotifications().catch(handleBleError);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calibration {Hand[hand]} Hand - {calibrationIterations}</IonTitle>
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
