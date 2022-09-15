import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';
import { readFromStorage } from './IonicStorage';
import { useEffect } from 'react';

import ScoopGame from './pages/ScoopGame';
import SpiralAnalysis from './pages/SpiralAnalysis';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Theme variables */
import './theme/variables.css';
import './theme/custom.css';
import SpiralDrawing from './pages/SpiralDrawingCanvas';
import BLETest from './pages/BLETest';
import { GameType } from './components/scoop_game/GameType';

import { connectToDevice } from './components/spiral/ble/BLEWrapper';

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
          <Route path="/home" element={<Home />}/>
          <Route path="/scoop" element={<Navigate to="/scoop/color" />}/>
          <Route path="/scoop/color" element={<ScoopGame gameType={GameType.Color}/>}/>
          <Route path="/scoop/triangle" element={<ScoopGame gameType={GameType.Triangle}/>}/>
          <Route path="/scoop/static" element={<ScoopGame gameType={GameType.Static}/>}/>
          <Route path="/spiral" element={<SpiralDrawing />}/>
          <Route path="/ble" element={<BLETest />}/>
          <Route path="/spiral/:uuid" element={<SpiralAnalysis />}/>
          <Route path="/" element={<Navigate to="/home" />}/>
        </Routes>
    </BrowserRouter>
  </IonApp>)
};

export default App;
