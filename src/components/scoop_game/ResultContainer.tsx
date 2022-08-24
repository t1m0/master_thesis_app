import { v4 as uuid } from 'uuid';
import { IonButton } from '@ionic/react';
import { shareAws, shareLocal } from '../../util/share';
import { GameSession } from './GameSession';
import { GameType } from './GameType';
import './ResultContainer.css';

interface ColorContainerProps {
  gameSession: GameSession,
  gameType: GameType,
  launchGameCallback:() => void
}

const ColorContainer: React.FC<ColorContainerProps> = (props: ColorContainerProps) => {
  const id = uuid();
  let successRate = props.gameSession.validSelections / (props.gameSession.invalidSelections+props.gameSession.validSelections)*100;
  console.log(props)

  function displayClickDistanceData() {
    if (props.gameSession.clickDistance.length > 0) {
      const n = props.gameSession.clickDistance.length;
      const mean = props.gameSession.clickDistance.reduce((a, b) => a + b, 0) / n;
      const standardDeviation = Math.sqrt(props.gameSession.clickDistance.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
      return [
        <p key={"mean-distance"}>Mean Click Distance: {mean}</p>,
        <p key={"sd-distance"}>Standard Deviation Click Distance: {standardDeviation}</p>
      ]
    } else {
      return []
    }
  }

  const clickShareLocal = () => {
    const date = new Date();
    const fileName = `${id}.json`;
    const file = new File([JSON.stringify(props.gameSession)], fileName, { type: "application/json" })
    shareLocal(fileName, file);
  }

  const clickShareAws = () => {
    shareAws(id, props.gameType.toString(), props.gameSession);
  }

  return (
    <div className={`result-container`} >
      {displayClickDistanceData()}
      <p key={"success-rate"}>Success Rate: {successRate}%</p>
      <p key={"duration"}>Duration: {Math.round((props.gameSession.duration/1000) * 100) / 100}sec</p>
      <button onClick={props.launchGameCallback}>Try Again</button>
      <IonButton onClick={clickShareLocal}>Share Local</IonButton>
      <IonButton onClick={clickShareAws}>Share Aws</IonButton>
    </div>
  );
};

export default ColorContainer;
