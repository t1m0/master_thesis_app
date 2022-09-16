import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';
import { readFromStorage } from './IonicStorage';
import { useEffect } from 'react';

import ScoopGamePage from './pages/ScoopGamePage';
import SpiralAnalysisPage from './pages/SpiralAnalysisPage';
import HomePage from './pages/HomePage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Theme variables */
import './theme/variables.css';
import './theme/custom.css';
import SpiralDrawingPage from './pages/SpiralDrawingPage';
import BLETestPage from './pages/BLETestPage';
import { GameType } from './components/scoop_game/GameType';

import { connectToDevice } from './components/spiral/ble/BLEWrapper';
import ScoopGameAnalysisPage from './pages/ScoopGameAnalysisPage';

setupIonicReact();

const App: React.FC = () => {

  document.body.classList.toggle('dark', true);

  useEffect(() => {
    readFromStorage("BleDeviceId")
      .then(deviceId => {
        if (deviceId == undefined) {
          connectToDevice()
            .then(() => console.log("Connected to a device"))
            .catch(err => console.log("Failed to connect!", err));
        }
      })
	}, []);

  return (<IonApp>
    <BrowserRouter>
      <Routes>
          <Route path="/home" element={<HomePage />}/>
          <Route path="/scoop" element={<Navigate to="/scoop-color" />}/>
          <Route path="/scoop-color" element={<ScoopGamePage gameType={GameType.Color}/>}/>
          <Route path="/scoop-triangle" element={<ScoopGamePage gameType={GameType.Triangle}/>}/>
          <Route path="/scoop-static" element={<ScoopGamePage gameType={GameType.Static}/>}/>
          <Route path="/scoop/:uuid" element={<ScoopGameAnalysisPage />}/>
          <Route path="/spiral" element={<SpiralDrawingPage />}/>
          <Route path="/ble" element={<BLETestPage />}/>
          <Route path="/spiral/:uuid" element={<SpiralAnalysisPage />}/>
          <Route path="/" element={<Navigate to="/home" />}/>
        </Routes>
    </BrowserRouter>
  </IonApp>)
};

export default App;
