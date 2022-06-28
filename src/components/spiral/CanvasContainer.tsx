import { IonContent } from '@ionic/react';
import React, { useReducer } from 'react'
import { SpiralCanvasContainer } from './SpiralCanvasContainer';
import ImageCoordinate from './model/ImageCoordinate';
import SpiralDrawingResult from './model/SpiralDrawingResult';
import './CanvasContainer.css';

interface CanvasContainerProps {
  drawingFinishedCallback:(result:SpiralDrawingResult) => void
}


const CanvasContainer: React.FC<CanvasContainerProps> = (props: CanvasContainerProps) => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function restart() {
    forceUpdate();
  }

  return (
    <IonContent fullscreen className='canvas-container'>    
      <SpiralCanvasContainer key={ignored} onSave={props.drawingFinishedCallback} initialLineWidth={1} initialColor='white' render={({ triggerSave, canvas }) => (
        <div>
          <button onClick={restart}>Restart</button>
          <button onClick={triggerSave}>Save Canvas</button>
          <div>{canvas}</div>
        </div>)}/>
      </IonContent>);
};

export default CanvasContainer;
