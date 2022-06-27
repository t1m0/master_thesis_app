import './ResultContainer.css';

interface ColorContainerProps {
  validSelections: number,
  invalidSelections: number,
  duration: number,
  launchGameCallback:() => void
}

const ColorContainer: React.FC<ColorContainerProps> = (props: ColorContainerProps) => {

  let successRate = props.validSelections / (props.invalidSelections+props.validSelections)*100;
  console.log(props)
  return (
    <div className={`result-container`} >
      <p>Success Rate: {successRate}%</p>
      <p>Duration: {Math.round((props.duration/1000) * 100) / 100}sec</p>
      <button onClick={props.launchGameCallback}>Try Again</button>
    </div>
  );
};

export default ColorContainer;
