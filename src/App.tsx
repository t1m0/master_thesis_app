import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';
import { readValueFromStorage } from './IonicStorage';
import { useEffect } from 'react';

import StroopGamePage from './pages/StroopGamePage';
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
import CalibrationPage from './pages/CalibrationPage';
import { GameType } from './components/stroop_game/GameType';

import { connectToDevices } from './ble/BLEWrapper';
import StroopGameAnalysisPage from './pages/StroopGameAnalysisPage';
import UserPage from './pages/UserPage';
import DriftPage from './pages/DriftPage';
import { initCrypto } from './util/encrypt';

setupIonicReact();

const App: React.FC = () => {

  document.body.classList.toggle('dark', true);

  useEffect(() => {
    initCrypto();
  }, []);

  return (<IonApp>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/stroop" element={<Navigate to="/stroop-color" />} />
        <Route path="/stroop-color" element={<StroopGamePage gameType={GameType.Color} />} />
        <Route path="/stroop-triangle" element={<StroopGamePage gameType={GameType.Triangle} />} />
        <Route path="/stroop-static" element={<StroopGamePage gameType={GameType.Static} />} />
        <Route path="/stroop/:uuid" element={<StroopGameAnalysisPage />} />
        <Route path="/spiral" element={<SpiralDrawingPage />} />
        <Route path="/drift" element={<DriftPage />} />
        <Route path="/calibration" element={<CalibrationPage />} />
        <Route path="/spiral/:uuid" element={<SpiralAnalysisPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  </IonApp>)
};

export default App;
