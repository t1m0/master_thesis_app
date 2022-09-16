import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { GameSession } from '../components/scoop_game/GameSession';
import { GameType } from '../components/scoop_game/GameType';

import { readFromStorage } from '../IonicStorage';
import { shareAws, shareLocal } from '../util/share';

const ScoopGameAnalysisPage: React.FC = () => {
    const [gameSession, setGameSession] = useState<GameSession | undefined>(undefined);
    const [successRate, setSuccessRate] = useState(0);
    const [meanDistance, setMeanDistance] = useState(0);
    const [distanceStandardDeviation, setDistanceStandardDeviation] = useState(0);
    const [durationInSec, setDurationInSec] = useState(0);
    const [gameType, setGameType] = useState("");
    const params = useParams();
    const uuid = params["uuid"] as string;

    useEffect(() => {
        readFromStorage<GameSession>(uuid).then(session => {
            if (session != undefined) {
                const loadedSession = new GameSession(session.gameType)
                loadedSession.uuid = session.uuid
                loadedSession.startTime = session.startTime
                loadedSession.clicks = session.clicks
                loadedSession.accelerations = session.accelerations
                loadedSession.duration = session.duration
                setGameSession(loadedSession);
            }
        });
    }, []);

    useEffect(() => {
        if (gameSession != undefined && gameSession.clicks.length > 0) {
            const n = gameSession.clicks.length;
            const localSuccessRate = gameSession.getValidClickCount() / (n) * 100;
            const localMeanDistance = gameSession.clicks.filter(c => c.valid).reduce((a, b) => a + b.distance, 0) / n;
            const localDistanceStandardDeviation = Math.sqrt(gameSession.clicks.map(c => Math.pow(c.distance - localMeanDistance, 2)).reduce((a, b) => a + b) / n);
            const localDurationInSec = Math.round((gameSession.duration / 1000) * 100) / 100
            setSuccessRate(localSuccessRate)
            setMeanDistance(localMeanDistance)
            setDistanceStandardDeviation(localDistanceStandardDeviation)
            setDurationInSec(localDurationInSec)
            setGameType(GameType[gameSession.gameType].toLowerCase())
        }
    }, [gameSession]);

    const clickShareLocal = () => {
        if (gameSession != undefined) {
            const fileName = `${uuid}.json`;
            const file = new File([JSON.stringify(gameSession)], fileName, { type: "application/json" })
            shareLocal(fileName, file);
        }
    }

    const clickShareAws = () => {
        if (gameSession != undefined) {
            shareAws(uuid, GameType[gameSession.gameType], gameSession);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Scoop Analysis {uuid}</IonTitle>
                    <IonButtons>
                        <IonBackButton defaultHref={'/scoop-' + gameType} />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className='center-childs'>
                    <div>
                    <p key={"mean-distance"}>Mean Click Distance: {meanDistance}</p>
                    <p key={"sd-distance"}>Standard Deviation Click Distance: {distanceStandardDeviation}</p>
                    <p key={"success-rate"}>Success Rate: {successRate}%</p>
                    <p key={"duration"}>Duration: {durationInSec}sec</p>
                    <div className='center-childs'>
                        <button onClick={clickShareLocal}>Share Local</button>
                        <button onClick={clickShareAws}>Share Aws</button>
                    </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ScoopGameAnalysisPage;
