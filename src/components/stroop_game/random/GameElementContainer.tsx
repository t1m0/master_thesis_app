
import React, { ReactNode, useState } from "react";

import './GameElementContainer.css'
interface GameElementContainerProps {
  valid: boolean,
  innerElement: ReactNode,
  containerStyle: String,
  clickCallback: (valid: boolean, x: number, y: number) => void
}

const GameElementContainer: React.FC<GameElementContainerProps> = (props: GameElementContainerProps) => {
  const [disabled, setDisabled] = useState(false);

  function onClick(event: React.MouseEvent<any>) {
    if (!disabled) {
      setDisabled(true)
    }
    props.clickCallback(props.valid, event.clientX, event.clientY);
  }



  function getDisabledStyle() {
    if (disabled) {
      return 'game-element-disabled'
    }
    return ''
  }

  return (
    <div className={`center game-element ${props.containerStyle} ${getDisabledStyle()}`} onClick={onClick}>
      {props.innerElement}
    </div>
  );
};

export default GameElementContainer;