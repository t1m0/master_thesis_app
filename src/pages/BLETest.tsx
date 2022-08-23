import { BleDevice } from '@capacitor-community/bluetooth-le';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from "react";
import AccelerationRecord from '../components/spiral/ble/AccelerationRecord';

import { connectToDevice, subscribeToNotifications, unSubscribeToNotifications } from "../components/spiral/ble/BLEWrapper";
import { shareAws, shareLocal } from '../util/share';

const BLETest: React.FC = () => {
  const [bondedDevice, setBondedDevice] = useState<BleDevice>();
  const [results, setResults] = useState(new Array<AccelerationRecord>());


  useEffect(() => {
    console.log("Connecting to Live Data")
    connectToDevice()
      .then(setBondedDevice)
      .catch(console.error);

  }, []);

  useEffect(() => {
    if (bondedDevice != undefined) {
      subscribeToNotifications(bondedDevice, dataCallback).catch(console.error);
      setTimeout(async () => {
        unSubscribeToNotifications(bondedDevice).catch(console.error)
      }, 10000);
    }
  }, [bondedDevice]);


  const dataCallback = (accelerationRecodr: AccelerationRecord) => {
    console.log('acceleration data', accelerationRecodr);
    setResults(results => [...results, accelerationRecodr]);
  }

  const clickShareLocal = () => {
    const date = new Date();
    const fileName = `acceleration_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.json`;
    const file = new File([JSON.stringify(results)], fileName, { type: "application/json" })
    shareLocal(fileName, file);
  }

  const clickShareAws = () => {
    const date = new Date();
    const fileName = `acceleration_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    shareAws(fileName, 'ble-test', results);
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
        <IonButton onClick={clickShareLocal}>Share Local</IonButton>
        <IonButton onClick={clickShareAws}>Share Aws</IonButton>
        <p>{bondedDevice?.deviceId}</p>

        {results.map(v => <p>count: {v.recordCount} xAxis: {v.xAxis} yAxis: {v.yAxis} zAxis: {v.zAxis}</p>)}
      </IonContent>
    </IonPage>
  );
};

export default BLETest;
