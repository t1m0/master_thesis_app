import { TouchEventHandler, useRef } from 'react';
import './CanvasContainer.css';

interface CanvasContainerProps {
  timeOut: number,
  drawingFinishedCallback:() => void
}

const ColorContainer: React.FC<CanvasContainerProps> = (props: CanvasContainerProps) => {

  function touchStartCallback() {
    
  }

  function touchMoveCallback(event:TouchEventHandler<HTMLCanvasElement>) {
    
  }

  function touchEndCallback() {
    
  }

  const canvasRef = useRef(null)

  return (
    //<canvas id='canvas' ref={canvasRef} onTouchStart={touchStartCallback()} onTouchMove={touchMoveCallback} onTouchEnd={touchEndCallback}> </canvas>
    <div>
      
    </div>
  );
};

export default ColorContainer;
