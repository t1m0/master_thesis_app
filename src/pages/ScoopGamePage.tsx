import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import GameContainer from '../components/scoop_game/GameContainer';
import { GameType } from '../components/scoop_game/GameType';
import { getCorrectedHeight } from '../util/layout';

interface ScoopGamePageProps {
  gameType: GameType
}

const ScoopGamePage: React.FC<ScoopGamePageProps> = (props: ScoopGamePageProps) => {

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
          <IonTitle>Color Selector</IonTitle>
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

export default ScoopGamePage;