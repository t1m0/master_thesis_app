import { GameSession } from './GameSession';
import './ResultContainer.css';

interface ColorContainerProps {
  gameSession: GameSession,
  launchGameCallback:() => void
}

const ColorContainer: React.FC<ColorContainerProps> = (props: ColorContainerProps) => {

  let successRate = props.gameSession.validSelections / (props.gameSession.invalidSelections+props.gameSession.validSelections)*100;
  console.log(props)

  function displayClickDistanceData() {
    if (props.gameSession.clickDistance.length > 0) {
      const n = props.gameSession.clickDistance.length;
      const mean = props.gameSession.clickDistance.reduce((a, b) => a + b, 0) / n;
      const standardDeviation = Math.sqrt(props.gameSession.clickDistance.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
      return [
        <p>Mean Click Distance: {mean}</p>,
        <p>Standard Deviation Click Distance: {standardDeviation}</p>
      ]
    } else {
      return []
    }
  }

  return (
    <div className={`result-container`} >
      {displayClickDistanceData()}
      <p>Success Rate: {successRate}%</p>
      <p>Duration: {Math.round((props.gameSession.duration/1000) * 100) / 100}sec</p>
      <button onClick={props.launchGameCallback}>Try Again</button>
    </div>
  );
};

export default ColorContainer;
