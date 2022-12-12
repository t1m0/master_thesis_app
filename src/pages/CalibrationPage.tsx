import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidLeave } from '@ionic/react';
import React, { useEffect, useState } from "react";
import AccelerationRecord from '../ble/AccelerationRecord';

import { v4 as uuid } from 'uuid';

import { handleBleError, subscribeToNotifications, unSubscribeToNotifications } from "../ble/BLEWrapper";
import { appendSessionUuid, getSessionCount, readObjectFromStorage, readValueFromStorage } from '../IonicStorage';
import { shareCloud, shareLocal } from '../util/share';
import { Hand } from '../Hand';

const CalibrationPage: React.FC = () => {
  const hand = readObjectFromStorage("hand") as Hand;
  const bondedDevice = readValueFromStorage(hand + "DeviceId");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [results, setResults] = useState(new Array<AccelerationRecord>());
  const [running, setRunning] = useState(false);
  const [calibrationUuid, setCalibrationUuid] = useState("");
  const [calibrationIterations, setCalibrationIterations] = useState(0);


  useEffect(() => {
    setCalibrationIterations(getSessionCount('calibration-' + Hand[hand]));
    caputeAccelerometer();
  }, []);

  useEffect(() => {
    if(!running && startTime > 0) {
      unSubscribeToNotifications().catch(handleBleError);
      setEndTime(Date.now());
      shareToCloud();
    }
  }, [running]);


  const dataCallback = (accelerationRecodr: AccelerationRecord) => {
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
    console.log(`captured ${result.accelerations.length} or ${results.length} accelerations`);
    if (result.accelerations.length > 0) {
      shareCloud(fileName, 'calibration', result);
      setCalibrationIterations(appendSessionUuid('calibration-' + Hand[hand], calibrationUuid));
    } else {
      alert("Not shared to cloud, since acceleration data is missing.");
    }
  }



  const caputeAccelerometer = () => {
    setCalibrationUuid(uuid());
    setStartTime(0);
    setEndTime(0);
    setRunning(true)
    setResults([]);
    console.log("Connecting to Live Data")
    subscribeToNotifications(dataCallback).catch(handleBleError);
    setStartTime(Date.now());
    setTimeout(() => {
      setRunning(false);
    }, 10000);
  }

  useIonViewDidLeave(() => {
    unSubscribeToNotifications().catch(handleBleError);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calibration {Hand[hand]} Hand - {calibrationIterations + 1}</IonTitle>
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
        <p>Captured {results.length} data points.</p>
        <p hidden={running}>Finished Capturing calibration data.</p>
      </IonContent>
    </IonPage>
  );
};

export default CalibrationPage;
