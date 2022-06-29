import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import CanvasContainer from '../components/spiral/CanvasContainer';
import SpiralDrawingResult from '../components/spiral/model/SpiralDrawingResult';

const ColorSelector: React.FC = () => {

  const styles = {
    border: '0.0625rem solid #9c9c9c',
    borderRadius: '0.25rem',
  };

  const drawingFinished = (result:SpiralDrawingResult) => {
    console.log("finished");
    console.log(result.imageWrapper);
    console.log(result.start);
    console.log(result.end);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Spiral Drawing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <CanvasContainer drawingFinishedCallback={drawingFinished}/>
      </IonContent>
    </IonPage>
  );
};

export default ColorSelector;
