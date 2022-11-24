import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import DriftGameContainer from '../components/drift/DriftGameContainer';
import { getSessionCount } from '../IonicStorage';

const DriftPage: React.FC = () => {

  const [driftSessions, setDriftSessions] = useState(0);

  useEffect(() => {
    const sessionCount = getSessionCount('drift');
    setDriftSessions(sessionCount);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Drift {driftSessions + 1}</IonTitle>
          <IonButtons>
            <IonBackButton defaultHref='/home' />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <DriftGameContainer incrementSessionCount={v => setDriftSessions(v)} />
      </IonContent>
    </IonPage>
  );
};

export default DriftPage;
