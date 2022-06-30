import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom'
import SpiralDrawingResult from '../components/spiral/model/SpiralDrawingResult';
import { readFromStorage } from '../IonicStorage';


const SpiralAnalysis: React.FC = () => {
  const [result, setResult] = useState<SpiralDrawingResult | undefined>(undefined);
  const params = useParams();
  const uuid = params["uuid"] as string;
  
  useEffect(() => {
    readFromStorage<SpiralDrawingResult>(uuid).then(r => {
      console.log(r);
      setResult(r);
    });
  }, []);

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Spiral Analysis {uuid}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {result?.uuid}
      </IonContent>
    </IonPage>
  );
};

export default SpiralAnalysis;
