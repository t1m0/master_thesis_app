import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import SpiralRating from '../components/spiral/algorithm/SpiralRating';
import SpiralDrawing from '../components/spiral/model/SpiralDrawing';
import SpiralDrawingRating from '../components/spiral/model/SpiralDrawingRating';
import { readFromStorage } from '../IonicStorage';

import { Share } from '@capacitor/share';


const SpiralAnalysis: React.FC = () => {
  const spiralRating = new SpiralRating();
  const [drawing, setDrawing] = useState<SpiralDrawing | undefined>(undefined);
  const [result, setResult] = useState<SpiralDrawingRating | undefined>(undefined);
  const params = useParams();
  const uuid = params["uuid"] as string;

  useEffect(() => {
    readFromStorage<SpiralDrawing>(uuid).then(d => {
      if (d != undefined) {
        console.log(d);
        setDrawing(d);
        const result = spiralRating.rate(d);
        setResult(result);
      }
    });
  }, []);

  useEffect(() => {
    if (drawing != undefined) {
      const result = spiralRating.rate(drawing);
      setResult(result);
    }
  }, [drawing]);


  const click = () => {
    if (result != undefined && drawing != undefined) {
      const data = { "drawing": drawing, "result": result };
      const fileName = `${drawing.uuid}.json`;
      const file = new File([JSON.stringify(data)], fileName, { type: "application/json" })
      if ('share' in navigator) {
        shareFile(file, fileName)
      } else {
        download(file, fileName)
      }
    }
  }

  const shareFile = (file: File, fileName: string) => {
    navigator.share({
      title: `Sharing ${fileName}`,
      files: [file],
    }).then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));

  }

  const download = (file: File, fileName: string) => {
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(file);
    elem.download = fileName;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }

  const getTableBody = () => {
    if (result != undefined && drawing != undefined) {
      return <tbody>
        <tr><td>1th Order Smoothness</td><td>{result.firstOrderSmoothness}</td></tr>
        <tr><td>2nd Order Smoothness</td><td>{result.secondOrderSmoothness}</td></tr>
        <tr><td>Tightness</td><td>{result.thightness}</td></tr>
        <tr><td>Zero Crossing Rate</td><td>{result.zeroCrossingRate}</td></tr>
        <tr><td>Degree of Severity</td><td>{result.degreeOfSeverity}</td></tr>
        <tr><td>Severity Level</td><td>{result.severityLevel}</td></tr>
        <tr><td>Total Time</td><td>{Math.round(drawing.time / 1000 * 100) / 100}sec</td></tr>
        <tr><td><IonButton onClick={click}>Share</IonButton></td></tr>
      </tbody>
    } else {
      return <tbody></tbody>
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Spiral Analysis {uuid}</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/spiral' />
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
          {getTableBody()}
        </table>

        {drawing?.accelerations.map(v => <p>count: {v.recordCount} xAxis: {v.xAxis} yAxis: {v.yAxis} zAxis: {v.zAxis}</p>)}
      </IonContent>
    </IonPage>
  );
};

export default SpiralAnalysis;
