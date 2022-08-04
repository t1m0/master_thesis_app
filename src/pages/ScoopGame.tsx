import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import GameContainer from '../components/scoop_game/GameContainer';
import { GameType } from '../components/scoop_game/GameType';
import { isPortrait, isMobile, getWidth, getHeight, getCorrectedHeight } from '../util/layout';

interface ScoopGameProps {
  gameType:GameType
}

const ScoopGame: React.FC<ScoopGameProps> = (props: ScoopGameProps) => {
  
  

  console.log(isMobile);

  

  function calcRowCount() {
    return Math.round((getCorrectedHeight()-200) / 160);
  }


  let rowCount = calcRowCount();
  console.log(rowCount);
  let colorContainerCount = 4 * rowCount;

  console.log(colorContainerCount);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Color Selector</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/home'/>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <GameContainer gameType={props.gameType} totalContainerCount={colorContainerCount} placeholderRatio={.4} validRatio={.4} timeOut={180000}/>
      </IonContent>
    </IonPage>
  );
};

export default ScoopGame;
