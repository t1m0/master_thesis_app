import GameBoardContainer from './random/GameBoardContainer';
import LaunchGameContainer from './LaunchGameContainer';

import React, { useState, useEffect } from "react";
import { GameType } from './GameType';
import StaticGameBoardContainer from './static/StaticGameBoardContainer';
import StaticGameElementInput from './static/StaticGameElementInput';
import { GameSession } from './GameSession';
import { handleBleError, subscribeToNotifications, unSubscribeToNotifications } from '../../ble/BLEWrapper';
import AccelerationRecord from '../../ble/AccelerationRecord';
import { useIonViewDidLeave } from '@ionic/react';
import { GameClick } from './GameClick';
import { readObjectFromStorage, writeInStorage } from '../../IonicStorage';
import { useNavigate } from 'react-router';
import { Hand } from '../../Hand';

interface GameContainerProps {
    gameType: GameType;
    totalContainerCount: number,
    placeholderRatio: number,
    validRatio: number
}

const GameContainer: React.FC<GameContainerProps> = (props: GameContainerProps) => {
    const navigate = useNavigate();
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [gameSession, setGameSession] = useState(new GameSession(props.gameType));

    const placeholderContainerCount = Math.round(props.totalContainerCount * props.placeholderRatio);
    const validContainerCount = Math.round((props.totalContainerCount - placeholderContainerCount) * props.validRatio);
    const invalidContainerCount = props.totalContainerCount - placeholderContainerCount - validContainerCount;

    const timeOut = props.gameType != GameType.Static ? 1800 : getElements().length * 1500;

    function launchGameCallback() {
        setGameStarted(true);
        setGameFinished(false);
        setGameSession(new GameSession(props.gameType));
        subscribeToNotifications(accelerationCallback).catch(handleBleError);
    }

    function accelerationCallback(accelerationRecord: AccelerationRecord) {
        setGameSession(prevGameSession => { prevGameSession.accelerations = [...prevGameSession.accelerations, accelerationRecord]; return prevGameSession });
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
        return <StaticGameBoardContainer elements={elements} clickCallback={clickCallback} />
    }

    function finishedCallback(session: GameSession) {
        session.endTime = Date.now();
        setGameSession(session);
        setGameFinished(true);
        unSubscribeToNotifications().catch(handleBleError);
        writeInStorage(gameSession.uuid, gameSession);
        console.log("Saved " + gameSession.uuid + " transition to analysis.")
        navigate("/stroop/" + gameSession.uuid);
    }

    function clickCallback(valid: boolean, x: number, y: number, distance: number) {
        const click = new GameClick(x, y, valid);
        click.distance = distance
        gameSession.clicks.push(click);
        setGameSession(gameSession);
        if (isFinished()) {
            finishedCallback(gameSession);
        }
    }

    function isFinished() {
        const actualValidContainer = props.gameType != GameType.Static ? validContainerCount : getElements().length;
        const duration = Date.now() - gameSession.startTime;
        return gameSession.getValidClickCount() >= actualValidContainer || duration >= timeOut
    }

    useIonViewDidLeave(() => {
        unSubscribeToNotifications().catch(handleBleError);
    });

    function getContainer() {
        if (gameStarted && !gameFinished) {
            if (props.gameType == GameType.Static) {
                return getStaticContainer();
            } else {
                return <GameBoardContainer gameType={props.gameType} validContainerCount={validContainerCount} invalidContainerCount={invalidContainerCount} placeholderContainerCount={placeholderContainerCount} clickCallback={clickCallback} />
            }
        } else {
            return <LaunchGameContainer launchGameCallback={launchGameCallback} />
        }
    }

    return (
        <div className="center-childs">
            {getContainer()}
        </div>
    );
};

export default GameContainer;
