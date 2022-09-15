interface LaunchGameContainerProps {
    launchGameCallback:() => void
}

const LaunchGameContainer: React.FC<LaunchGameContainerProps> = (props: LaunchGameContainerProps) => {
    return (
        <div className="center-childs">
            <button onClick={props.launchGameCallback}>Launch Game</button>
        </div>
  );
};

export default LaunchGameContainer;
