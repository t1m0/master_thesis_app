import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import GameContainer from '../components/GameContainer';
import './Home.css';

const Home: React.FC = () => {
  let availableHeight = window.screen.availHeight;
  let availableWidth = window.screen.availWidth;
  let isMobile = window.navigator.userAgent.includes('Mobi');
  

  console.log(isMobile);

  function isPortrait(height:number, width:number) {
    return height > width;
  }

  function calcRowCount(mobile:boolean, height:number, width:number) {
    if (!isPortrait(height, width) && mobile) {
      return Math.round((width-200) / 160);
    } else {
      return Math.round((height - 200) / 160);
    }
  }


  let rowCount = calcRowCount(isMobile, availableHeight, availableWidth);
  console.log(rowCount);
  let colorContainerCount = 4 * rowCount;

  console.log(colorContainerCount);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Color Selector</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <GameContainer totalContainerCount={colorContainerCount} placeholderRatio={.4} validRatio={.4} timeOut={180000}/>
      </IonContent>
    </IonPage>
  );
};

export default Home;
