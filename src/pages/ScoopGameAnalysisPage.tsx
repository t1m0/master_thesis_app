import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { GameSession } from '../components/scoop_game/GameSession';
import { GameType } from '../components/scoop_game/GameType';
import { analyse_scoop_game } from '../components/scoop_game/ScoopGameAnalysis';
import { ScoopGameResult } from '../components/scoop_game/ScoopGameResult';

import { readFromStorage } from '../IonicStorage';
import { shareAws, shareLocal } from '../util/share';

const ScoopGameAnalysisPage: React.FC = () => {
    const [result, setResult] = useState<ScoopGameResult | undefined>(undefined);
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
                const result = analyse_scoop_game(loadedSession)
                const localDurationInSec = Math.round((loadedSession.duration / 1000) * 100) / 100
                setResult(result);
                setDurationInSec(localDurationInSec)
                setGameType(GameType[loadedSession.gameType].toLowerCase())
            }
        });
    }, []);

    const clickShareLocal = () => {
        if (result != undefined) {
            const fileName = `${uuid}.json`;
            const file = new File([JSON.stringify(result)], fileName, { type: "application/json" })
            shareLocal(fileName, file);
        }
    }

    const clickShareAws = () => {
        if (result != undefined) {
            shareAws(uuid, gameType, result);
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
                    <p key={"mean-distance"}>Mean Click Distance: {result?.meanDistance}</p>
                    <p key={"sd-distance"}>Standard Deviation Click Distance: {result?.distanceStandardDeviation}</p>
                    <p key={"success-rate"}>Success Rate: {result?.successRate}%</p>
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
