import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidLeave } from '@ionic/react';
import { getSessionCount, readObjectFromStorage, writeInStorage } from '../IonicStorage';
import React, { useEffect, useReducer, useState } from 'react'

import { SpiralCanvasContainer } from '../components/spiral/SpiralCanvasContainer';
import { useNavigate } from 'react-router';

import './SpiralDrawing.css';
import SpiralDrawing from '../components/spiral/model/SpiralDrawing';
import { handleBleError, subscribeToNotifications, unSubscribeToNotifications } from '../ble/BLEWrapper';
import AccelerationRecord from '../ble/AccelerationRecord';
import { getCorrectedHeight, getCorrectedWidth } from '../util/layout';
import { Hand } from '../Hand';

const SpiralDrawingPage: React.FC = () => {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState(0);
  const [accelerations, setAccelerations] = useState(new Array<AccelerationRecord>());
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [spiralSession, setSpiralSession] = useState(0);

  useEffect(() => {
    const hand = readObjectFromStorage("hand") as Hand;
    const sessionCount = getSessionCount('spiral-' + Hand[hand]);
    setSpiralSession(sessionCount+1);
  }, []);

  function restart() {
    unSubscribeToNotifications().catch(handleBleError);
    forceUpdate();
  }

  const drawingStarted = () => {
    subscribeToNotifications(dataCallback).catch(handleBleError);
    setStartTime(Date.now());
  };

  const drawingFinished = (result: SpiralDrawing) => {
    unSubscribeToNotifications().catch(handleBleError);
    const endTime = Date.now();
    const updatedResult = new SpiralDrawing(result.imageWrapper, result.start, result.end, accelerations);
    updatedResult.startTime = startTime;
    updatedResult.endTime = endTime;
    writeInStorage(updatedResult.uuid, updatedResult);
    console.log("Saved " + updatedResult.uuid + " transition to analysis.");
    navigate("/spiral/" + updatedResult.uuid);
  }

  const dataCallback = (accelerationRecord: AccelerationRecord) => {
    console.log('acceleration data', accelerationRecord);
    setAccelerations(accelerations => [...accelerations, accelerationRecord]);
  }

  useIonViewDidLeave(() => {
    unSubscribeToNotifications().catch(handleBleError);
  });

  const canvasHeight = getCorrectedHeight()/*buttons*/ - 50;
  const canvasWidth = getCorrectedWidth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Spiral Drawing {spiralSession}</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/home' />
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
          </div>)} />
      </IonContent>
    </IonPage>
  );
};

export default SpiralDrawingPage;
