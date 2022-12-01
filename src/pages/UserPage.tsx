import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { clearStorage, writeInStorage } from '../IonicStorage';
import { useNavigate } from 'react-router';
import './HomePage.css';
import { connectToDevices } from '../ble/BLEWrapper';

const UserPage: React.FC = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nodeValue = event.target.value as string;
        if (nodeValue) {
            setUserName(nodeValue);
        }
    }

    const handleSubmit = () => {
        if (userName != undefined) {
            clearStorage();
            writeInStorage('userName', userName);
            connectToDevices()
                .then(() => {
                    console.log("Connected to devices.")
                    navigate("/home");
                })
                .catch(err => {
                    alert("Failed to connect to ble device!");
                    console.log("Failed to connect!", err);
                });
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>User</IonTitle>
                    <IonButtons>
                        <IonBackButton defaultHref='/home' />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className='center-childs'>
                    <form>
                        <label>
                            Name:
                            <input type="text" value={userName} onChange={handleChange} />
                        </label>
                        <button type="button" onClick={handleSubmit}>Submit</button>
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default UserPage;
