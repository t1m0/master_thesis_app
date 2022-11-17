interface LaunchDriftGameContainerProps {
    launchGameCallback: () => void
}

const LaunchDriftGameContainer: React.FC<LaunchDriftGameContainerProps> = (props: LaunchDriftGameContainerProps) => {
    return (
        <div className="center-childs">
            <button onClick={props.launchGameCallback}>Launch Game</button>
        </div>
    );
};

export default LaunchDriftGameContainer;
