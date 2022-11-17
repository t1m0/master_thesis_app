import { IonContent, IonHeader, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, } from 'react';
import { useNavigate } from 'react-router';
import { Hand } from '../Hand';
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
      setHand(Hand.DOMINANT);
    }
  }, []);

  const setHand = (hand: Hand) => {
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
              <IonSegmentButton value="dominant" onClick={() => setHand(Hand.DOMINANT)}>
                <label>Dominant Hand</label>
              </IonSegmentButton>
              <IonSegmentButton value="nondominant" onClick={() => setHand(Hand.NON_DOMINANT)}>
                <label>Non-Dominant Hand</label>
              </IonSegmentButton>
            </IonSegment>
          </div>
          <div>
            <div className='activity-collection'>
              <a className='button' href="/stroop-static">Static Stroop Game</a><br />
              <a className='button' href="/spiral">Spiral Drawing</a><br />
              <a className='button' href="/drift">Drift</a><br />
              <a className='button' href="/ble">BLE Test</a>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
