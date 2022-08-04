import React from "react";
import StaticGameElementInput from './StaticGameElementInput';
import './StaticGameBoardContainer.css'
import StaticGameElement from "./StaticGameElement";
import { getCorrectedHeight, getCorrectedWidth, getHeight } from "../../../util/layout";

interface StaticGameBoardContainerProps {
    elements: StaticGameElementInput[],
    timeOut: number
}

const StaticGameBoardContainer: React.FC<StaticGameBoardContainerProps> = (props: StaticGameBoardContainerProps) => {

    let elementCount = 1;

    const clickCallback = (id:string) => {

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
