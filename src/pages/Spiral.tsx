import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import CanvasContainer from '../components/spiral/CanvasContainer';
import SpiralDrawingResult from '../components/spiral/model/SpiralDrawingResult';
import SprialAnalysis from '../components/spiral/SprialAnalysis';

const ColorSelector: React.FC = () => {

  const [result, setResult]=useState<SpiralDrawingResult | undefined>(undefined);

  const drawingFinished = (result:SpiralDrawingResult) => {
      setResult(result);
  }

  const getContainer = () => {
    if (result == undefined) {
      return <CanvasContainer drawingFinishedCallback={drawingFinished}/>;
    } else {
      return <SprialAnalysis spiralDrawingResult={result}/>;
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Spiral Drawing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {getContainer()}
      </IonContent>
    </IonPage>
  );
};

export default ColorSelector;
