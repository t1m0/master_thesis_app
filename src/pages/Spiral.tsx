import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import GameContainer from '../components/scoop_game/GameContainer';

const ColorSelector: React.FC = () => {


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Spiral Drawing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
      </IonContent>
    </IonPage>
  );
};

export default ColorSelector;
