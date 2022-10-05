import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from "react";
import AccelerationRecord from '../components/spiral/ble/AccelerationRecord';

import { subscribeToNotifications, unSubscribeToNotifications } from "../components/spiral/ble/BLEWrapper";
import { readObjectFromStorage, readValueFromStorage } from '../IonicStorage';
import { shareAws, shareLocal } from '../util/share';

const BLETestPage: React.FC = () => {
  const [bondedDevice, setBondedDevice] = useState<string>();
  const [startTime, setStartTime] = useState(0);
  const [results, setResults] = useState(new Array<AccelerationRecord>());


  useEffect(() => {
    console.log("Connecting to Live Data")
    const deviceId = readValueFromStorage("DeviceId");
    setBondedDevice(deviceId);

  }, []);

  useEffect(() => {
      subscribeToNotifications(dataCallback).catch(console.error);
      setStartTime(Date.now());
      setTimeout(async () => {
        unSubscribeToNotifications().catch(console.error)
      }, 10000);
  }, [bondedDevice]);


  const dataCallback = (accelerationRecodr: AccelerationRecord) => {
    console.log('acceleration data', accelerationRecodr);
    setResults(results => [...results, accelerationRecodr]);
  }

  const clickShareLocal = () => {
    const date = new Date();
    const fileName = `acceleration_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.json`;
    const result = {
      'accelerations':results,
      'startTime':startTime,
      'endTime':Date.now()
    };
    const file = new File([JSON.stringify(result)], fileName, { type: "application/json" })
    shareLocal(fileName, file);
  }

  const clickShareAws = () => {
    const date = new Date();
    const result = {
      'accelerations':results,
      'startTime':startTime,
      'endTime':Date.now()
    };
    const fileName = `acceleration_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    shareAws(fileName, 'ble-test', result);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>BLETest</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/home' />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <button onClick={clickShareLocal}>Share Local</button>
        <button onClick={clickShareAws}>Share Aws</button>
        <p>{bondedDevice}</p>

        {results.map(v => <p>count: {v.recordCount} xAxis: {v.xAxis} yAxis: {v.yAxis} zAxis: {v.zAxis}</p>)}
      </IonContent>
    </IonPage>
  );
};

export default BLETestPage;
