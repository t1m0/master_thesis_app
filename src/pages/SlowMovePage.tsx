import { v4 as uuid } from 'uuid';

import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidLeave } from '@ionic/react';
import { useEffect, useState } from 'react';
import AccelerationRecord from '../ble/AccelerationRecord';
import { appendSessionUuid, getSessionCount, readObjectFromStorage, readValueFromStorage } from '../IonicStorage';

import './SlowMovePage.css'
import { Hand } from '../Hand';
import { handleBleError, subscribeToNotifications, unSubscribeToNotifications } from '../ble/BLEWrapper';
import { shareCloud } from '../util/share';
import Movement from '../components/slow_move/Movement';
import { useNavigate } from 'react-router';

const SlowMovePage: React.FC = () => {
    const navigate = useNavigate();
    const hand = readObjectFromStorage("hand") as Hand;
    const deviceId = readValueFromStorage(hand + "DeviceId");

    const [sessionUuid, setSessionUuid] = useState("");
    const [slowMoveSessions, setSlowMoveSessions] = useState(0);
    const [moving, setMoving] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    const [accelerations, setAccelerations] = useState(new Array<AccelerationRecord>());
    const [movements, setMovements] = useState(new Array<Movement>());

    useEffect(() => {
        const sessionCount = getSessionCount('slow-move-' + Hand[hand]);
        setSlowMoveSessions(sessionCount);
    }, []);

    const dataCallback = (accelerationRecord: AccelerationRecord) => {
        setAccelerations(accelerations => [...accelerations, accelerationRecord]);
    }

    const start = () => {
        setSessionUuid(uuid());
        setAccelerations([]);
        setStartTime(0);
        setEndTime(0);
        setMoving(true);
        subscribeToNotifications(dataCallback).catch(handleBleError);
        setStartTime(Date.now());
    }

    const end = () => {
        setMoving(false);
        setEndTime(Date.now());
        unSubscribeToNotifications().catch(handleBleError);
        shareToCloud();
    }

    const onTouchStart = (event: React.TouchEvent) => {
        start();
        appendTouch(event);
    }

    const onTouchMove = (event: React.TouchEvent) => {
        if (moving) {
            appendTouch(event);
        }
    }

    const onTouchEnd = (event: React.TouchEvent) => {
        end();
        appendTouch(event);
    }

    const onMouseDown = (event: React.MouseEvent) => {
        start();
        appendMouse(event);
    }

    const onMouseMove = (event: React.MouseEvent) => {
        if (moving) {
            appendMouse(event);
        }
    }

    const onMouseUp = (event: React.MouseEvent) => {
        end();
        appendMouse(event);
    }

    const appendMouse = (event: React.MouseEvent) => {
        let movement = new Movement(event.nativeEvent.x, event.nativeEvent.y);
        console.log(movement);
        setMovements(movements => [...movements, movement]);
    }

    const appendTouch = (event: React.TouchEvent) => {
        let movement = new Movement(0, 0);
        if (event.touches && event.touches.length) {
            const clientX = event.touches[0].clientX;
            const clientY = event.touches[0].clientY;
            movement = new Movement(clientX, clientY);
        } else {
            console.error(`No touches available on event`, event);
        }
        console.log(movement);
        setMovements(movements => [...movements, movement]);
    }

    const getShareObejct = () => {
        const duration = endTime - startTime;
        const start = document.getElementById('start-point');
        const end = document.getElementById('end-point');
        return {
            'uuid': sessionUuid,
            'accelerations': accelerations,
            'startTime': startTime,
            'endTime': endTime,
            'duration': duration,
            'hand': Hand[hand].toLowerCase(),
            'device': deviceId,
            'movements': movements,
            'start': getCoordinates(start),
            'end': getCoordinates(end)
        };
    }

    const getCoordinates = (element: HTMLElement | null) => {
        if (element) {
            const rect = element.getBoundingClientRect();
            const y = Math.round(rect.top + 15);
            const x = Math.round(rect.left + 15);
            return { x: x, y: y }
        } else {
            return { x: 0, y: 0 }
        }

    }

    const shareToCloud = () => {
        const result = getShareObejct();
        console.log(result);
        if (result.accelerations.length > 0) {
            shareCloud(sessionUuid, 'slow-move', result);
            setSlowMoveSessions(appendSessionUuid('slow-move-' + Hand[hand], sessionUuid));
            navigate("/home");
        } else {
            alert("Not shared to cloud, since acceleration data is missing.");
        }
    }

    useIonViewDidLeave(() => {
        unSubscribeToNotifications().catch(handleBleError);
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>SlowMove {slowMoveSessions + 1}</IonTitle>
                    <IonButtons>
                        <IonBackButton defaultHref='/home' />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className='slow-move-container'>
                    <div className='slow-move center-childs'>
                        <div className='line-container' onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} >
                            <span id='start-point' className="dot"></span>
                            <div className='line'></div>
                            <span id='end-point' className="dot"></span>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SlowMovePage;
