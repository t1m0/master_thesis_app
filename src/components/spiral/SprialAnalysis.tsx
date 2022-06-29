import { IonContent } from '@ionic/react';
import './CanvasContainer.css';
import SpiralDrawingResult from './model/SpiralDrawingResult';
import SpiralRating from './algorithm/SpiralRating';

interface SprialAnalysisProps {
    spiralDrawingResult:SpiralDrawingResult
}

const SprialAnalysis: React.FC<SprialAnalysisProps> = (props: SprialAnalysisProps) => {
    const spiralRating = new SpiralRating();
    console.log(props.spiralDrawingResult);
    spiralRating.rate(props.spiralDrawingResult);
    return (
        <IonContent fullscreen className='canvas-container'>    
      
        </IonContent>);
};

export default SprialAnalysis;
