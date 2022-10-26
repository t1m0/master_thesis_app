import { IonContent, IonHeader, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, } from 'react';
import { useNavigate } from 'react-router';
import { readValueFromStorage, writeInStorage } from '../IonicStorage';
import { getCorrectedHeight, getCorrectedWidth, isLandscape, isMobile, isPortrait } from '../util/layout';

import './HomePage.css';

const HomePage: React.FC = () => {

  const navigate = useNavigate();

  console.log(`portrait: ${isPortrait()} landscape: ${isLandscape()} mobile: ${isMobile()}`)
  console.log(`height: ${getCorrectedHeight()} width: ${getCorrectedWidth()}`)

  useEffect(() => {
    const user = readValueFromStorage('userName');
    if (!user) {
      navigate("/user");
    } else {
      setHand('dominant');
    }
  }, []);

  const setHand = (hand: String) => {
    writeInStorage("hand", hand);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sample App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='center-childs'>
          <div className='hand-switch'>
            <IonSegment value="dominant">
              <IonSegmentButton value="dominant" onClick={() => setHand('dominant')}>
                <label>Dominant Hand</label>
              </IonSegmentButton>
              <IonSegmentButton value="nondominant" onClick={() => setHand('non-dominant')}>
                <label>Non-Dominant Hand</label>
              </IonSegmentButton>
            </IonSegment>
          </div>
          <div>
            <div className='activity-collection'>
              <a className='button' href="/scoop-static">Static Scoop Game</a><br />
              <a className='button' href="/spiral">Spiral Drawing</a><br />
              <a className='button' href="/ble">BLE Test</a>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
