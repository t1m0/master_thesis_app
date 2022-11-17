import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import SpiralRating from '../components/spiral/algorithm/SpiralRating';
import SpiralDrawing from '../components/spiral/model/SpiralDrawing';
import SpiralDrawingRating from '../components/spiral/model/SpiralDrawingRating';
import { Hand } from '../Hand';
import { readObjectFromStorage, readValueFromStorage } from '../IonicStorage';
import { shareCloud, shareLocal } from '../util/share';

const SpiralAnalysisPage: React.FC = () => {
  const spiralRating = new SpiralRating();
  const [drawing, setDrawing] = useState<SpiralDrawing | undefined>(undefined);
  const [result, setResult] = useState<SpiralDrawingRating | undefined>(undefined);
  const params = useParams();
  const uuid = params["uuid"] as string;

  const navigate = useNavigate();

  useEffect(() => {
    const currentDrawing = readObjectFromStorage<SpiralDrawing>(uuid);
    if (currentDrawing) {
      const result = spiralRating.rate(currentDrawing);
      shareToCloud(result, currentDrawing)
      setResult(result);
      setDrawing(currentDrawing);
    }
  }, []);


  const getShareObject = () => {
    const hand = readObjectFromStorage("hand") as Hand;
    const deviceId = readValueFromStorage(hand+"DeviceId");
    return { "drawing": drawing, "result": result, "device": deviceId, "hand": Hand[hand].toLowerCase() };
  }

  const clickShareLocal = () => {
    if (result != undefined && drawing != undefined) {
      const data = getShareObject();
      const fileName = `${drawing.uuid}.json`;
      const file = new File([JSON.stringify(data)], fileName, { type: "application/json" });
      shareLocal(fileName, file);
    }
  }

  const shareToCloud = (result: SpiralDrawingRating, drawing: SpiralDrawing) => {
    if (result != undefined && drawing != undefined) {
      const data = getShareObject();
      shareCloud(drawing.uuid, 'spiral', data);
    }
  }

  const tryAgain = () => {
    navigate("/spiral");
  }

  const getTableBody = () => {
    if (result != undefined && drawing != undefined) {
      return <tbody>
        <tr><td>1th Order Smoothness</td><td>{result.firstOrderSmoothness}</td></tr>
        <tr><td>2nd Order Smoothness</td><td>{result.secondOrderSmoothness}</td></tr>
        <tr><td>Tightness</td><td>{result.thightness}</td></tr>
        <tr><td>Zero Crossing Rate</td><td>{result.zeroCrossingRate}</td></tr>
        <tr><td>Degree of Severity</td><td>{result.degreeOfSeverity}</td></tr>
        <tr><td>Total Time</td><td>{Math.round((drawing.endTime - drawing.startTime) / 1000 * 100) / 100}sec</td></tr>
        <tr><td><button onClick={clickShareLocal}>Share</button></td></tr>
        <tr><td><button onClick={tryAgain}>Try Again</button></td></tr>
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
        <div className='center-childs'>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            {getTableBody()}
          </table>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SpiralAnalysisPage;
