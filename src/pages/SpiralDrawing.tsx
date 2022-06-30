import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { writeInStorage } from '../IonicStorage';
import React, { useReducer } from 'react'

import { SpiralCanvasContainer } from '../components/spiral/SpiralCanvasContainer';
import SpiralDrawingResult from '../components/spiral/model/SpiralDrawingResult';
import { useNavigate } from 'react-router';

import './SpiralDrawing.css';

const SpiralDrawing: React.FC = () => {
  const navigate = useNavigate();
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function restart() {
    forceUpdate();
  }

  const drawingFinished = (result:SpiralDrawingResult) => {
      writeInStorage(result.uuid, result).then(()=> {
        console.log("Saved "+result.uuid+" transition to analysis.")
        navigate("/spiral/"+result.uuid);
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Spiral Drawing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='canvas-container' fullscreen>
        <SpiralCanvasContainer key={ignored} onSave={drawingFinished} initialLineWidth={1} initialColor='white' render={({ triggerSave, canvas }) => (
          <div>
            <button onClick={restart}>Restart</button>
            <button onClick={triggerSave}>Save Canvas</button>
            <div>{canvas}</div>
          </div>)}/>
      </IonContent>
    </IonPage>
  );
};

export default SpiralDrawing;
