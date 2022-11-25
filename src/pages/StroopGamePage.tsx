import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import GameContainer from '../components/stroop_game/GameContainer';
import { GameType } from '../components/stroop_game/GameType';
import { getCorrectedHeight } from '../util/layout';

interface StroopGamePageProps {
  gameType: GameType
}

const StroopGamePage: React.FC<StroopGamePageProps> = (props: StroopGamePageProps) => {

  function calcRowCount() {
    return Math.round((getCorrectedHeight()) / 160);
  }


  let rowCount = calcRowCount();
  let colorContainerCount = 4 * rowCount;

  console.log(`rows: ${rowCount} colorContainerCount: ${colorContainerCount}`);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Stroop Game</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/home' />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <GameContainer gameType={props.gameType} totalContainerCount={colorContainerCount} placeholderRatio={.4} validRatio={.4} />
      </IonContent>
    </IonPage>
  );
};

export default StroopGamePage;
