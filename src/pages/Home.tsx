import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
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
        <Link to="/color">Color Selector</Link>
        <Link to="/spiral">Spiral Drawing</Link>
        <Link to="/ble">BLE Test</Link>
      </IonContent>
    </IonPage>
  );
};

export default Home;
