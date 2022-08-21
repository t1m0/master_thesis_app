
import React, {useState} from "react";

import './StaticGameElement.css'
interface StaticGameElementProps {
    key:string,
    disabled:boolean,
    top:number,
    left:number,
    clickCallback:(id:string, distance:number) => void
}

const StaticGameElement: React.FC<StaticGameElementProps> = (props: StaticGameElementProps) => {
  const [disabled, setDisabled]=useState(props.disabled);
  
  function onClick(event:React.MouseEvent<any>) {
    if(!disabled) {
      setDisabled(true)
    }
    const distance = calcDistance(event.nativeEvent);
    props.clickCallback(props.key, distance);
  }

  function calcDistance(event:MouseEvent) {
    const center_x = props.left+47;
    const center_y = props.top+51;

    const delta_x = Math.abs(event.clientX - center_x);
    const delta_y = Math.abs(event.clientY - center_y);
    console.log(`dx: ${delta_x} dy: ${delta_y}`);
    const x = delta_x**2;
    const y = delta_y**2;
    return Math.sqrt(delta_x + delta_y);
  }



  function getDisabledStyle() {
    if(disabled) {
      return 'static-game-element-disabled'
    }
    return ''
  }

  return (
    <div id={props.key} className={`center static-game-element ${getDisabledStyle()}`} onClick={onClick} style={{top: props.top, left: props.left}}>
      <svg width="100" height="100" viewBox="0 0 100 100"><polygon points="40,10, 80, 80, 10 ,80" className="triangle"/></svg>
    </div>
  );
};

export default StaticGameElement;