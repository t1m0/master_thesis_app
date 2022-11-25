import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import GameContainer from '../components/stroop_game/GameContainer';
import { GameType } from '../components/stroop_game/GameType';
import { Hand } from '../Hand';
import { getSessionCount, readObjectFromStorage } from '../IonicStorage';
import { getCorrectedHeight } from '../util/layout';

interface StroopGamePageProps {
  gameType: GameType
}

const StroopGamePage: React.FC<StroopGamePageProps> = (props: StroopGamePageProps) => {

  const [stroopSession, setStroopSession] = useState(0);

  useEffect(() => {
    const hand = readObjectFromStorage("hand") as Hand;
    console.log('stroop-'+GameType[props.gameType].toLowerCase()+'-'+Hand[hand])
    const sessionCount = getSessionCount('stroop-'+GameType[props.gameType].toLowerCase()+'-'+Hand[hand]);
    setStroopSession(sessionCount+1);
  }, []);

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
          <IonTitle>Stroop Game {stroopSession}</IonTitle>
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
