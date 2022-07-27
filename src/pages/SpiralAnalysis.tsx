import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom'
import SpiralRating from '../components/spiral/algorithm/SpiralRating';
import SpiralDrawing from '../components/spiral/model/SpiralDrawing';
import SpiralDrawingRating from '../components/spiral/model/SpiralDrawingRating';
import { readFromStorage } from '../IonicStorage';


const SpiralAnalysis: React.FC = () => {
  const spiralRating = new SpiralRating();
  const [drawing, setDrawing] = useState<SpiralDrawing | undefined>(undefined);
  const [result, setResult] = useState<SpiralDrawingRating | undefined>(undefined);
  const params = useParams();
  const uuid = params["uuid"] as string;
  
  useEffect(() => {
    readFromStorage<SpiralDrawing>(uuid).then(d => {
      if(d != undefined) {
        console.log(d);
        setDrawing(d);
        const result = spiralRating.rate(d);
        console.log(result);
        setResult(result);
      }
    });
  }, []);

  useEffect(() => {
    if(drawing != undefined) {
      const result = spiralRating.rate(drawing);
      console.log(result);
      setResult(result);
    }
  }, [drawing]);

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Spiral Analysis {uuid}</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/spiral'/>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1th Order Smoothness</td><td>{result?.firstOrderSmoothness}</td></tr>
            <tr><td>2nd Order Smoothness</td><td>{result?.secondOrderSmoothness}</td></tr>
            <tr><td>Tightness</td><td>{result?.thightness}</td></tr>
            <tr><td>Zero Crossing Rate</td><td>{result?.zeroCrossingRate}</td></tr>
            <tr><td>Degree of Severity</td><td>{result?.degreeOfSeverity}</td></tr>
            <tr><td>Severity Level</td><td>{result?.severityLevel}</td></tr>
            <tr><td>Total Time</td><td>{drawing?.time}</td></tr>
          </tbody>
        </table>
        
        {drawing?.accelerations.map(v => <p>count: {v.recordCount} xAxis: {v.xAxis} yAxis: {v.yAxis} zAxis: {v.zAxis}</p>)}
      </IonContent>
    </IonPage>
  );
};

export default SpiralAnalysis;
