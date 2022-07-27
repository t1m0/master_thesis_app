import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sample Aapp</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton href="/scoop">Color Scoop Game</IonButton><br/>
        <IonButton href="/scoop/triangle">Color Triangle Game</IonButton><br/>
        <IonButton href="/spiral">Spiral Drawing</IonButton><br/>
        <IonButton href="/ble">BLE Test</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
