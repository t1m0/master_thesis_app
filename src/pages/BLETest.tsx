import { BleDevice } from '@capacitor-community/bluetooth-le';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, {useEffect, useState} from "react";
import AccelerationRecord from '../components/spiral/ble/AccelerationRecord';

import {connectToDevice, subscribeToNotifications, unSubscribeToNotifications} from "../components/spiral/ble/BLEWrapper";

const BLETest: React.FC = () => {
    const [bondedDevice, setBondedDevice]=useState<BleDevice>();
    const [results, setResults]=useState(new Array<AccelerationRecord>());


    useEffect(() => {    
        console.log("Connecting to Live Data")
        connectToDevice()
            .then(setBondedDevice)
            .catch(console.error);
        
    }, []);   

    useEffect(() => {
        if (bondedDevice != undefined){
            subscribeToNotifications(bondedDevice, dataCallback).catch(console.error);
            setTimeout(async () => {
                unSubscribeToNotifications(bondedDevice).catch(console.error)
            }, 10000);
        }
    }, [bondedDevice]);


    const dataCallback = (accelerationRecodr:AccelerationRecord) => {
        console.log('acceleration data', accelerationRecodr);
        setResults(results => [...results,accelerationRecodr] );
    }
    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>BLETest</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/home'/>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <p>{bondedDevice?.deviceId}</p>

        {results.map(v => <p>count: {v.recordCount} xAxis: {v.xAxis} yAxis: {v.yAxis} zAxis: {v.zAxis}</p>)}
      </IonContent>
    </IonPage>
  );
};

export default BLETest;
