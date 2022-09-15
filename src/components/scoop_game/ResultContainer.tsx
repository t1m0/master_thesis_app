import { v4 as uuid } from 'uuid';
import { IonButton } from '@ionic/react';
import { shareAws, shareLocal } from '../../util/share';
import { GameSession } from './GameSession';
import { GameType } from './GameType';

interface ColorContainerProps {
  gameSession: GameSession,
  gameType: GameType,
  launchGameCallback: () => void
}

const ColorContainer: React.FC<ColorContainerProps> = (props: ColorContainerProps) => {
  const id = uuid();
  let successRate = props.gameSession.getValidClickCount() / (props.gameSession.clicks.length) * 100;
  console.log(props)

  function displayClickDistanceData() {
    if (props.gameSession.clicks.length > 0) {
      const n = props.gameSession.clicks.length;
      const mean = props.gameSession.clicks.filter(c => c.valid).reduce((a, b) => a + b.distance, 0) / n;
      const standardDeviation = Math.sqrt(props.gameSession.clicks.map(c => Math.pow(c.distance - mean, 2)).reduce((a, b) => a + b) / n);
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
    shareAws(id, GameType[props.gameType], props.gameSession);
  }

  return (
    <div className={`result-container`} >
      {displayClickDistanceData()}
      <p key={"success-rate"}>Success Rate: {successRate}%</p>
      <p key={"duration"}>Duration: {Math.round((props.gameSession.duration / 1000) * 100) / 100}sec</p>
      <div className='center-childs'>
        <button onClick={props.launchGameCallback}>Try Again</button>
        <button onClick={clickShareLocal}>Share Local</button>
        <button onClick={clickShareAws}>Share Aws</button>
      </div>
    </div>
  );
};

export default ColorContainer;
