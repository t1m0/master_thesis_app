import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import GameContainer from '../components/scoop_game/random/GameContainer';
import { GameType } from '../components/scoop_game/GameType';

interface ScoopGameProps {
  gameType:GameType
}

const ScoopGame: React.FC<ScoopGameProps> = (props: ScoopGameProps) => {
  let availableHeight = window.screen.availHeight;
  let availableWidth = window.screen.availWidth;
  let isMobile = window.navigator.userAgent.includes('Mobi');
  

  console.log(isMobile);

  function isPortrait(height:number, width:number) {
    return height > width;
  }

  function calcRowCount(mobile:boolean, height:number, width:number) {
    if (!isPortrait(height, width) && mobile) {
      return Math.round((width-200) / 160);
    } else {
      return Math.round((height - 200) / 160);
    }
  }


  let rowCount = calcRowCount(isMobile, availableHeight, availableWidth);
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
