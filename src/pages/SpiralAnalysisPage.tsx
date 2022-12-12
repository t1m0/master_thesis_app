import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import SpiralRating from '../components/spiral/algorithm/SpiralRating';
import SpiralDrawing from '../components/spiral/model/SpiralDrawing';
import SpiralDrawingRating from '../components/spiral/model/SpiralDrawingRating';
import { Hand } from '../Hand';
import { appendSessionUuid, readObjectFromStorage, readValueFromStorage, writeInStorage } from '../IonicStorage';
import { shareCloud, shareLocal } from '../util/share';

const SpiralAnalysisPage: React.FC = () => {
  const spiralRating = new SpiralRating();
  const [drawing, setDrawing] = useState<SpiralDrawing | undefined>(undefined);
  const [result, setResult] = useState<SpiralDrawingRating | undefined>(undefined);
  const [spiralIterations, setSpiralIterations] = useState(0);
  const params = useParams();
  const uuid = params["uuid"] as string;

  const navigate = useNavigate();

  useEffect(() => {
    const currentDrawing = readObjectFromStorage<SpiralDrawing>(uuid);
    if (currentDrawing) {
      const hand = readObjectFromStorage("hand") as Hand;
      const result = spiralRating.rate(currentDrawing);
      setResult(result);
      setDrawing(currentDrawing);
      if (currentDrawing.accelerations.length > 0) {
        shareCloud(currentDrawing.uuid, 'spiral', getShareObject(currentDrawing, result, hand));
        setSpiralIterations(appendSessionUuid('spiral-' + Hand[hand], currentDrawing.uuid));
        navigate("/home");
      } else {
        alert("Not shared to cloud, since acceleration data is missing.");
      }
    }
  }, []);

  const getShareObject = (drawing: SpiralDrawing, rating: SpiralDrawingRating, hand: Hand) => {
    const deviceId = readValueFromStorage(hand + "DeviceId");
    return { "drawing": drawing, "result": rating, "device": deviceId, "hand": Hand[hand].toLowerCase() };
  }

  const clickShareLocal = () => {
    if (result != undefined && drawing != undefined) {
      const hand = readObjectFromStorage("hand") as Hand;
      const data = getShareObject(drawing, result, hand);
      const fileName = `${drawing.uuid}.json`;
      const file = new File([JSON.stringify(data)], fileName, { type: "application/json" });
      shareLocal(fileName, file);
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
        <tr><td>Total Time</td><td>{Math.round((drawing.endTime - drawing.startTime) / 1000 * 100) / 100}sec</td></tr>
        <tr><td>Accelerometer Data Points</td><td>{drawing.accelerations.length}</td></tr>
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
          <IonTitle>Spiral Analysis {spiralIterations} | {uuid}</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/home' />
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
