import React, { MouseEvent, useState } from "react";
import StaticGameElementInput from './StaticGameElementInput';
import './StaticGameBoardContainer.css'
import StaticGameElement from "./StaticGameElement";
import { getCorrectedHeight, getCorrectedWidth, getHeight } from "../../../util/layout";

interface StaticGameBoardContainerProps {
    elements: StaticGameElementInput[],
    clickCallback: (valid: boolean, x: number, y: number, distance: number) => void
}

const StaticGameBoardContainer: React.FC<StaticGameBoardContainerProps> = (props: StaticGameBoardContainerProps) => {

    let elementCount = 1;

    const getElement = (input: StaticGameElementInput) => {
        const id = elementCount++;
        const top = (getCorrectedHeight()) * (input.yPercentage / 100) + 50;
        const left = getCorrectedWidth() * (input.xPercentage / 100);
        return <StaticGameElement key={id} id={id} top={top} left={left} clickCallback={props.clickCallback} />
    }

    const boardClickCallback = (event: MouseEvent<HTMLDivElement>) => {
        props.clickCallback(false, event.clientX, event.clientY, -1);
    }

    return (
        <div className="static-game-container" onClick={boardClickCallback} style={{ height: getHeight() }}>
            {props.elements.map(getElement)}
        </div>
    );
};

export default StaticGameBoardContainer;
