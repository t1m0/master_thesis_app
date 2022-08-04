import './GameBoardContainer.css';
import { v4 as uuid } from 'uuid';
import { GameType } from '../GameType';
import GameElementContainer from './GameElementContainer';
import { useState } from 'react';
import { GameSession } from '../GameSession';

interface GameBoardContainerProps {
    gameType:GameType,
    timeOut:number,
    invalidContainerCount: number,
    validContainerCount: number,
    placeholderContainerCount:number,
    finishedCallback:(session:GameSession)=>void
}

const colors = ['green', 'blue', 'red', 'yellow', 'pink'];

const GameBoardContainer: React.FC<GameBoardContainerProps> = (props: GameBoardContainerProps) => {
    const [gameSession, setGameSession] = useState(new GameSession());

    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * colors.length)
        return colors[randomIndex];
    }

    function createContainer(valid:boolean) {
        if(props.gameType == GameType.Triangle && valid) {
            const triangle = <svg><polygon points="250,60 100,400 400,400" className="triangle" /></svg>;
            return <GameElementContainer key={uuid()} valid={valid} containerStyle={"game-element-triangle"} clickCallback={clickCallback} innerElement={triangle} />
        } else if(props.gameType == GameType.Triangle && !valid) {
            return createPlaceholderContainer();
        } else {
            return createColorContainer(valid);
        }
    }

    function isFinished() {
        return gameSession.validSelections >= props.validContainerCount || gameSession.duration >= props.timeOut;
    }

    function clickCallback(valid: boolean) {
        if (valid) {
            gameSession.validSelections += 1;
        } else {
            gameSession.invalidSelections += 1;
        }
        gameSession.duration = performance.now() - gameSession.startTime;
        if(isFinished()) {
            props.finishedCallback(gameSession);
        }
    }


    function createColorContainer(valid:boolean) {
        let color = getRandomColor();
        let colorName = valid ? color : getRandomColor();
        while (!valid && color === colorName) {
            colorName = getRandomColor();
        }
        return <GameElementContainer key={uuid()} valid={valid} containerStyle={"game-element-"+color} clickCallback={clickCallback} innerElement={<p>{colorName}</p>} />
    }

    function createPlaceholderContainer() {
        return <GameElementContainer key={uuid()} valid={false} containerStyle="game-element-placeholder" clickCallback={clickCallback} innerElement={<p></p>} />
    }

    function shuffleArray(array:Array<JSX.Element>) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function createBoardEntries() {
        var elements:Array<JSX.Element>=[];
        for(var i=0;i<props.validContainerCount;i++){
            elements.push(createContainer(true));
        }
        for(var i=0;i<props.invalidContainerCount;i++){
            elements.push(createContainer(false));
        }
        for(var i=0;i<props.placeholderContainerCount;i++){
            elements.push(createPlaceholderContainer());
        }
        shuffleArray(elements);
        return elements
    }

    let elements = createBoardEntries();

    return (
        <div className="game-board-container">
            {elements}
        </div>
  );
};



export default GameBoardContainer;
