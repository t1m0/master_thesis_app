import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router';
import { Hand } from '../Hand';
import { readObjectFromStorage, readValueFromStorage, writeInStorage } from '../IonicStorage';
import { getCorrectedHeight, getCorrectedWidth, isLandscape, isMobile, isPortrait } from '../util/layout';

import './HomePage.css';

const HomePage: React.FC = () => {

  const navigate = useNavigate();

  const [hand, setHand] = useState(Hand.DOMINANT)

  console.log(`portrait: ${isPortrait()} landscape: ${isLandscape()} mobile: ${isMobile()}`)
  console.log(`height: ${getCorrectedHeight()} width: ${getCorrectedWidth()}`)

  useEffect(() => {
    const user = readValueFromStorage('userName');
    const hand = readObjectFromStorage('hand') as Hand;
    if (!user) {
      navigate("/user");
    } else if (hand) {
      setHand(hand);
    } else {
      setHand(Hand.DOMINANT);
    }
  }, []);

  useEffect(() => {
    writeInStorage("hand", hand);
  }, [hand]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sample App</IonTitle>
          <IonButtons>
            <IonButton href='/user'>Switch User</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='center-childs'>
          <div className='hand-switch'>
            <IonSegment value={Hand[hand]}>
              <IonSegmentButton value={Hand[Hand.DOMINANT]} onClick={() => setHand(Hand.DOMINANT)}>
                <label>Dominant Hand</label>
              </IonSegmentButton>
              <IonSegmentButton value={Hand[Hand.NON_DOMINANT]} onClick={() => setHand(Hand.NON_DOMINANT)}>
                <label>Non-Dominant Hand</label>
              </IonSegmentButton>
            </IonSegment>
          </div>
          <div>
            <div className='activity-collection'>
              <a className='button' href="/stroop-static">Static Stroop Game</a><br />
              <a className='button' href="/spiral">Spiral Drawing</a><br />
              <a className='button' href="/drift">Drift</a><br />
              <a className='button' href="/calibration">Calibration</a>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
