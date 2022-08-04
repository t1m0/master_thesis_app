import React, { useState } from "react";
import StaticGameElementInput from './StaticGameElementInput';
import './StaticGameBoardContainer.css'
import StaticGameElement from "./StaticGameElement";
import { getCorrectedHeight, getCorrectedWidth, getHeight } from "../../../util/layout";
import { GameSession } from "../GameSession";

interface StaticGameBoardContainerProps {
    elements: StaticGameElementInput[],
    finishedCallback:(session:GameSession)=>void
    timeOut: number
}

const StaticGameBoardContainer: React.FC<StaticGameBoardContainerProps> = (props: StaticGameBoardContainerProps) => {

    const [gameSession, setGameSession] = useState(new GameSession());

    let elementCount = 1;

    function isFinished() {
        return gameSession.validSelections >= props.elements.length || gameSession.duration >= props.timeOut;
    }

    const clickCallback = (id:string) => {
        gameSession.validSelections += 1;
        gameSession.duration = performance.now() - gameSession.startTime;
        if(isFinished()) {
            props.finishedCallback(gameSession);
        }
    }

    const getElement = (input: StaticGameElementInput) => {
        const id = `${elementCount++}-static-element`;
        console.log(`height: ${getHeight()} corrected height: ${getCorrectedHeight()}`)
        const top =  (getCorrectedHeight()) * (input.yPercentage / 100)+50;
        const left = getCorrectedWidth() * (input.xPercentage / 100);
        return <StaticGameElement key={id} top={top} left={left} disabled={false} clickCallback={clickCallback} />
    }

    return (
        <div className="static-game-container">
            {props.elements.map(getElement)}
        </div>
    );
};

export default StaticGameBoardContainer;
