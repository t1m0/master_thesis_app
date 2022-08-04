import GameBoardContainer from './random/GameBoardContainer';
import LaunchGameContainer from './LaunchGameContainer';
import ResultContainer from './ResultContainer';

import React, { useState, useEffect } from "react";
import { GameType } from './GameType';
import StaticGameBoardContainer from './static/StaticGameBoardContainer';
import StaticGameElementInput from './static/StaticGameElementInput';
import { GameSession } from './GameSession';

interface GameContainerProps {
    gameType: GameType;
    totalContainerCount: number,
    placeholderRatio: number,
    validRatio: number,
}

const GameContainer: React.FC<GameContainerProps> = (props: GameContainerProps) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [gameSession, setGameSession] = useState(new GameSession());

    const placeholderContainerCount = Math.round(props.totalContainerCount * props.placeholderRatio);
    const validContainerCount = Math.round((props.totalContainerCount - placeholderContainerCount) * props.validRatio);
    const invalidContainerCount = props.totalContainerCount - placeholderContainerCount - validContainerCount;


    function launchGameCallback() {
        setGameStarted(true);
        setGameFinished(false);
        setGameSession(new GameSession());
    }   

    function getElements() {
        const elements = new Array<StaticGameElementInput>();
        elements.push({ xPercentage: 10, yPercentage: 10 });
        elements.push({ xPercentage: 50, yPercentage: 30 });
        elements.push({ xPercentage: 80, yPercentage: 20 });
        elements.push({ xPercentage: 20, yPercentage: 50 });
        elements.push({ xPercentage: 80, yPercentage: 85 });
        return elements;
    }

    function getStaticContainer() {
        const elements = getElements();
        return <StaticGameBoardContainer elements={elements} timeOut={elements.length * 1500} finishedCallback={finishedCallback} />
    }

    function finishedCallback(session:GameSession) {
        setGameSession(session);
        setGameFinished(true);
    }

    function getContainer() {
        if (gameStarted && !gameFinished) {
            if (props.gameType == GameType.Static) {
                return getStaticContainer();
            } else {
                return <GameBoardContainer gameType={props.gameType} validContainerCount={validContainerCount} invalidContainerCount={invalidContainerCount} placeholderContainerCount={placeholderContainerCount} timeOut={18000} finishedCallback={finishedCallback} />
            }
        } else if (gameStarted && gameFinished) {
            return <ResultContainer validSelections={gameSession.validSelections} invalidSelections={gameSession.invalidSelections} duration={gameSession.duration} launchGameCallback={launchGameCallback} />
        } else {
            return <LaunchGameContainer launchGameCallback={launchGameCallback} />
        }
    }

    return (
        <div className="game-container">
            {getContainer()}
        </div>
    );
};

export default GameContainer;
