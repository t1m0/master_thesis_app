import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { getCorrectedHeight, getCorrectedWidth, isLandscape, isMobile, isPortrait } from '../util/layout';

import './Home.css';

const Home: React.FC = () => {
  console.log(`portrait: ${isPortrait()} landscape: ${isLandscape()} mobile: ${isMobile()}`)
  console.log(`height: ${getCorrectedHeight()} width: ${getCorrectedWidth()}`)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sample App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='center-childs'>
          <div className='activity-collection'>
            <a className='button' href="/scoop">Color Scoop Game</a><br />
            <a className='button' href="/scoop/triangle">Color Triangle Game</a><br />
            <a className='button' href="/scoop/static">Static Scoop Game</a><br />
            <a className='button' href="/spiral">Spiral Drawing</a><br />
            <a className='button' href="/ble">BLE Test</a>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
