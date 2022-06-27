import './LaunchGameContainer.css';

interface LaunchGameContainerProps {
    launchGameCallback:() => void
}

const LaunchGameContainer: React.FC<LaunchGameContainerProps> = (props: LaunchGameContainerProps) => {
    return (
        <div className="launch-game-container">
            <button onClick={props.launchGameCallback}>Launch Game</button>
        </div>
  );
};

export default LaunchGameContainer;
