import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { GameSession } from '../components/stroop_game/GameSession';
import { GameType } from '../components/stroop_game/GameType';
import { analyse_stroop_game } from '../components/stroop_game/StroopGameAnalysis';
import { StroopGameResult } from '../components/stroop_game/StroopGameResult';
import { Hand } from '../Hand';

import { appendSessionUuid, readObjectFromStorage, readValueFromStorage } from '../IonicStorage';
import { shareCloud, shareLocal } from '../util/share';

const StroopGameAnalysisPage: React.FC = () => {
    const [result, setResult] = useState<StroopGameResult | undefined>(undefined);
    const [durationInSec, setDurationInSec] = useState(0);
    const [accelerometerEntries, setAccelerometerEntries] = useState(0);
    const [gameType, setGameType] = useState("");
    const [stroopIterations, setStroopIterations] = useState(0);
    const params = useParams();
    const uuid = params["uuid"] as string;

    const navigate = useNavigate();

    useEffect(() => {
        const session = readObjectFromStorage<GameSession>(uuid)
        if (session != undefined) {
            const loadedSession = new GameSession(session.gameType)
            loadedSession.uuid = session.uuid
            loadedSession.startTime = session.startTime
            loadedSession.endTime = session.endTime
            loadedSession.clicks = session.clicks
            loadedSession.accelerations = session.accelerations
            const duration = session.endTime - session.startTime
            const result = analyse_stroop_game(loadedSession)
            const hand = readObjectFromStorage("hand") as Hand;
            const deviceId = readValueFromStorage(hand + "DeviceId");
            if (deviceId != undefined) {
                result.device = deviceId;
            }
            if (hand != undefined) {
                result.hand = Hand[hand].toLowerCase();
            }
            const localDurationInSec = Math.round((duration / 1000) * 100) / 100;
            const gameTypeValue = GameType[loadedSession.gameType].toLowerCase();
            setAccelerometerEntries(loadedSession.accelerations.length)
            if (loadedSession.accelerations.length > 0) {
                shareCloud(uuid, gameTypeValue, result);
                setStroopIterations(appendSessionUuid('stroop-' + gameTypeValue + '-' + Hand[hand], loadedSession.uuid));
                navigate("/home");
            } else {
                alert("Not shared to cloud, since acceleration data is missing.");
            }

            setResult(result);
            setDurationInSec(localDurationInSec)
            setGameType(gameTypeValue)
        }

    }, []);

    const clickShareLocal = () => {
        if (result != undefined) {
            const fileName = `${uuid}.json`;
            const file = new File([JSON.stringify(result)], fileName, { type: "application/json" })
            shareLocal(fileName, file);
        }
    }

    const tryAgain = () => {
        navigate("/stroop-" + gameType);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Stroop Analysis {stroopIterations} | {uuid}</IonTitle>
                    <IonButtons>
                        <IonBackButton defaultHref={'/home'} />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className='center-childs'>
                    <div>
                        <p key={"mean-distance"}>Mean Click Distance: {result?.meanDistance}</p>
                        <p key={"sd-distance"}>Standard Deviation Click Distance: {result?.distanceStandardDeviation}</p>
                        <p key={"success-rate"}>Success Rate: {result?.successRate}%</p>
                        <p key={"accelerometer"}>Accelerometer Data Points: {accelerometerEntries}</p>
                        <p key={"duration"}>Duration: {durationInSec}sec</p>
                        <div className='center-childs'>
                            <button onClick={clickShareLocal}>Share</button>
                            <button onClick={tryAgain}>Try Again</button>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default StroopGameAnalysisPage;
