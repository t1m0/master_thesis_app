import React, { useState } from "react";
import { subscribeToNotificationsForHand, unSubscribeToNotifications, unSubscribeToNotificationsForHand } from '../../ble/BLEWrapper';
import AccelerationRecord from '../../ble/AccelerationRecord';
import { useIonViewDidLeave } from '@ionic/react';
import { readValueFromStorage } from '../../IonicStorage';
import { Hand } from '../../Hand';
import { DriftSession } from "./DriftSession";
import LaunchDriftGameContainer from "./LaunchDriftGameContainer";
import DriftContainer from "./DriftContainer";
import { shareCloud } from "../../util/share";

const DriftGameContainer: React.FC = () => {
    const timeOutSec = 40
    const [driftSession, setDriftSession] = useState(new DriftSession())
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);


    function launchGameCallback() {
        setStarted(true);
        setFinished(false);
        driftSession.startTime = Date.now();
        setDriftSession(driftSession);
        subscribeToNotificationsForHand(Hand.DOMINANT, ac => accelerationCallback(Hand.DOMINANT, ac)).catch(console.error);
        subscribeToNotificationsForHand(Hand.NON_DOMINANT, ac => accelerationCallback(Hand.NON_DOMINANT, ac)).catch(console.error);
    }

    function accelerationCallback(hand: Hand, accelerationRecord: AccelerationRecord) {
        setDriftSession(prevDriftSession => { prevDriftSession.accelerations[hand] = [...prevDriftSession.accelerations[hand], accelerationRecord]; return prevDriftSession });
    }

    function finishedCallback() {
        driftSession.endTime = Date.now();
        const dominantDevice = readValueFromStorage(Hand.DOMINANT+"DeviceId");
        if (dominantDevice) {
            driftSession.dominantDevice = dominantDevice;
        }
        const nonDominantDevice = readValueFromStorage(Hand.NON_DOMINANT+"DeviceId");
        if (nonDominantDevice) {
            driftSession.nonDominantDevice = nonDominantDevice;
        }
        setDriftSession(driftSession);
        setFinished(true);
        setStarted(false);
        unsubscribNotifications();
        shareCloud(driftSession.uuid, 'drift', driftSession);
    }


    function unsubscribNotifications() {
        unSubscribeToNotificationsForHand(Hand.DOMINANT).catch(console.error);
        unSubscribeToNotificationsForHand(Hand.NON_DOMINANT).catch(console.error);
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
