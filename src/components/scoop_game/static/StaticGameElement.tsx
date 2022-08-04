
import React, {ReactNode, useState} from "react";

import './StaticGameElement.css'
interface StaticGameElementProps {
    key:string,
    disabled:boolean,
    top:number,
    left:number,
    clickCallback:(id:string) => void
}

const StaticGameElement: React.FC<StaticGameElementProps> = (props: StaticGameElementProps) => {
  const [disabled, setDisabled]=useState(props.disabled);

  function onClick(e:any) {
    if(!disabled) {
      setDisabled(true)
    }
    props.clickCallback(props.key);
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