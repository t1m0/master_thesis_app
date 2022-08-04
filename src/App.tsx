import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { IonApp, setupIonicReact } from '@ionic/react';
import { createStore } from './IonicStorage';
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

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import SpiralDrawing from './pages/SpiralDrawingCanvas';
import BLETest from './pages/BLETest';
import { GameType } from './components/scoop_game/GameType';

setupIonicReact();

const App: React.FC = () => {

  document.body.classList.toggle('dark', true);

  useEffect(() => {
    const setupStore = async () => {createStore();}
    setupStore();
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
