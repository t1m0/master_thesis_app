import React, { useState } from "react";
import { handleBleError, subscribeToNotificationsForHand, unSubscribeToNotifications, unSubscribeToNotificationsForHand } from '../../ble/BLEWrapper';
import AccelerationRecord from '../../ble/AccelerationRecord';
import { useIonViewDidLeave } from '@ionic/react';
import { appendSessionUuid, readValueFromStorage } from '../../IonicStorage';
import { Hand } from '../../Hand';
import { DriftSession } from "./DriftSession";
import LaunchDriftGameContainer from "./LaunchDriftGameContainer";
import DriftContainer from "./DriftContainer";
import { shareCloud } from "../../util/share";

interface DriftGameContainerProbs {
    incrementSessionCount: (currentCount: number) => void
}

const DriftGameContainer: React.FC<DriftGameContainerProbs> = (props: DriftGameContainerProbs) => {
    const timeOutSec = 40
    const [driftSession, setDriftSession] = useState(new DriftSession())
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);

    function launchGameCallback() {
        setDriftSession(new DriftSession());
        setStarted(true);
        setFinished(false);
        driftSession.startTime = Date.now();
        setDriftSession(driftSession);
        subscribeToNotificationsForHand(Hand.DOMINANT, ac => accelerationCallback(Hand.DOMINANT, ac)).catch(handleBleError);
        subscribeToNotificationsForHand(Hand.NON_DOMINANT, ac => accelerationCallback(Hand.NON_DOMINANT, ac)).catch(handleBleError);
    }

    function accelerationCallback(hand: Hand, accelerationRecord: AccelerationRecord) {
        const handKey = Hand[hand].toLowerCase()
        setDriftSession(prevDriftSession => { prevDriftSession.accelerations[handKey] = [...prevDriftSession.accelerations[handKey], accelerationRecord]; return prevDriftSession });
    }

    function finishedCallback() {
        console.log("Finished drift test");
        driftSession.endTime = Date.now();
        const dominantDevice = readValueFromStorage(Hand.DOMINANT + "DeviceId");
        if (dominantDevice) {
            driftSession.dominantDevice = dominantDevice;
        }
        const nonDominantDevice = readValueFromStorage(Hand.NON_DOMINANT + "DeviceId");
        if (nonDominantDevice) {
            driftSession.nonDominantDevice = nonDominantDevice;
        }
        setDriftSession(driftSession);
        setFinished(true);
        setStarted(false);
        unsubscribNotifications();
        shareCloud(driftSession.uuid, 'drift', driftSession);
        const sessions = appendSessionUuid('drift', driftSession.uuid);
        props.incrementSessionCount(sessions);
    }


    function unsubscribNotifications() {
        unSubscribeToNotificationsForHand(Hand.DOMINANT).catch(handleBleError);
        unSubscribeToNotificationsForHand(Hand.NON_DOMINANT).catch(handleBleError);
    }

    useIonViewDidLeave(() => {
        unSubscribeToNotifications();
    });

    function getContainer() {
        if (started && !finished) {
            return <DriftContainer startTime={driftSession.startTime} timeOutSec={timeOutSec} finishedCallback={finishedCallback} />
        } else {
            return <LaunchDriftGameContainer launchGameCallback={launchGameCallback} />
        }
    }

    return (
        <div className="center-childs">
            {getContainer()}
        </div>
    );
};

export default DriftGameContainer;
