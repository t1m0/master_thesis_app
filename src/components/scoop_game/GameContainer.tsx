import './GameContainer.css';
import GameBoardContainer from './GameBoardContainer';
import LaunchGameContainer from './LaunchGameContainer';
import ResultContainer from './ResultContainer';

import React, {useState, useEffect} from "react";
import { GameType } from './GameType';

interface GameContainerProps {
    gameType: GameType;
    totalContainerCount: number,
    placeholderRatio:number,
    validRatio:number,
    timeOut:number
}

class GameSession {
    validSelections:number = 0;
    invalidSelections:number = 0;
    duration:number = 0;
    startTime:number;

    constructor() {
        this.startTime = performance.now()
    }
  }

const GameContainer: React.FC<GameContainerProps> = (props: GameContainerProps) => {
    const [gameStarted, setGameStarted]=useState(false);
    const [gameFinished, setGameFinished]=useState(false);
    const [gameSession, setGameSession]=useState(new GameSession());

    const [placeholderContainerCount, setPlaceholderContainerCount]=useState(Math.round(props.totalContainerCount * props.placeholderRatio));
    const [validContainerCount, setValidContainerCount]=useState(Math.round((props.totalContainerCount - placeholderContainerCount) * props.validRatio));
    const [invalidContainerCount, setInvalidContainerCount]=useState(props.totalContainerCount - placeholderContainerCount - validContainerCount);

    
    function launchGameCallback() {
        setGameStarted(true);
        setGameFinished(false);
        setGameSession(new GameSession);
    }

    function isFinished() {
        return gameSession.validSelections >= validContainerCount || gameSession.duration >= props.timeOut;
    }

    function clickCallback(valid:boolean) {
        if (valid) {
            gameSession.validSelections+=1;
        } else {
            gameSession.invalidSelections+=1;
        }
        gameSession.duration = performance.now() - gameSession.startTime;
        console.log(gameSession.validSelections);
        if(isFinished()) {
            setGameFinished(true);
        }
    }


    function getContainer() {
        if (gameStarted && !gameFinished) {
            return <GameBoardContainer gameType={props.gameType} validContainerCount={validContainerCount} invalidContainerCount={invalidContainerCount} placeholderContainerCount={placeholderContainerCount} clickCallback={clickCallback} />
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
