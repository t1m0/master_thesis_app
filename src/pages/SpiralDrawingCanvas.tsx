import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { writeInStorage } from '../IonicStorage';
import React, { useEffect, useReducer, useState } from 'react'

import { SpiralCanvasContainer } from '../components/spiral/SpiralCanvasContainer';
import { useNavigate } from 'react-router';

import './SpiralDrawing.css';
import SpiralDrawing from '../components/spiral/model/SpiralDrawing';
import { connectToDevice, subscribeToNotifications, unSubscribeToNotifications } from '../components/spiral/ble/BLEWrapper';
import { BleDevice } from '@capacitor-community/bluetooth-le';
import AccelerationRecord from '../components/spiral/ble/AccelerationRecord';
import { getCorrectedHeight, getCorrectedWidth } from '../util/layout';

const SpiralDrawingCanvas: React.FC = () => {
  const navigate = useNavigate();
  const [startTime, setStartTime]=useState(0);
  const [bondedDevice, setBondedDevice]=useState<BleDevice>();
  const [accelerations, setAccelerations]=useState(new Array<AccelerationRecord>());
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {    
    console.log("Connecting to Live Data")
    connectToDevice()
        .then(setBondedDevice)
        .catch(console.error);
    
}, []);   

  function restart() {
    forceUpdate();
  }

  const drawingStarted = () => {
    if (bondedDevice != undefined){
      subscribeToNotifications(bondedDevice, dataCallback).catch(console.error);
    }
    setStartTime(Date.now());
  };

  const drawingFinished = (result:SpiralDrawing) => {
      if (bondedDevice != undefined){
        unSubscribeToNotifications(bondedDevice).catch(console.error)
      }
      const totalTime = Date.now() - startTime;
      const updatedResult = new SpiralDrawing(result.imageWrapper, result.start, result.end, totalTime, accelerations);
      writeInStorage(updatedResult.uuid, updatedResult).then(()=> {
        console.log("Saved "+updatedResult.uuid+" transition to analysis.")
        navigate("/spiral/"+updatedResult.uuid);
      });
  }

  useEffect(() => {
    
  }, [bondedDevice]);


  const dataCallback = (accelerationRecodr:AccelerationRecord) => {
      console.log('acceleration data', accelerationRecodr);
      setAccelerations(accelerations => [...accelerations,accelerationRecodr] );
  }
  
  const canvasHeight = getCorrectedHeight()/*buttons*/-50;
  const canvasWidth = getCorrectedWidth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Spiral Drawing</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/home'/>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='spiral-drawing-container' scrollY={false} fullscreen>
        <SpiralCanvasContainer key={ignored} height={canvasHeight} width={canvasWidth} onStart={drawingStarted} onSave={drawingFinished} initialLineWidth={1} initialColor='white' render={({ triggerSave, canvas }) => (
          <div className='spiral-canvas-container'>
            <div className='spiral-button-bar'>
              <button onClick={restart}>Restart</button>
              <button onClick={triggerSave}>Save Canvas</button>
            </div>
            <div className='spiral-canvas'>{canvas}</div>
          </div>)}/>
      </IonContent>
    </IonPage>
  );
};

export default SpiralDrawingCanvas;
