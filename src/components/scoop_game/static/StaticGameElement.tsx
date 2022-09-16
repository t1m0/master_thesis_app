
import React, { useEffect, useState } from "react";

import './StaticGameElement.css'
interface StaticGameElementProps {
  id: number,
  top: number,
  left: number,
  clickCallback: (valid: boolean, x: number, y: number, distance: number) => void
}

const StaticGameElement: React.FC<StaticGameElementProps> = (props: StaticGameElementProps) => {
  const isFirstElement = (props.id == 1);
  const [disabled, setDisabled] = useState(!isFirstElement);

  useEffect(() => {
    window.addEventListener('static-scoop-game-click', (event) => {
      const clickedId = (event as CustomEvent).detail as number;
      if (clickedId + 1 == props.id) {
        setDisabled(false)
      }
    });

  }, []);

  function onClick(event: React.MouseEvent<any>) {
    event.stopPropagation();
    if (!disabled) {
      setDisabled(true)
    }
    const distance = calcDistance(event.nativeEvent);
    props.clickCallback(true, event.clientX, event.clientY, distance);
    window.dispatchEvent(new CustomEvent('static-scoop-game-click', { detail: props.id }))
  }

  function calcDistance(event: MouseEvent) {
    const center_x = props.left + 47;
    const center_y = props.top + 51;

    const delta_x = Math.abs(event.clientX - center_x);
    const delta_y = Math.abs(event.clientY - center_y);

    const x = delta_x ** 2;
    const y = delta_y ** 2;

    return Math.sqrt(delta_x + delta_y);
  }



  function getDisabledStyle() {
    if (disabled) {
      return 'static-game-element-disabled'
    }
    return ''
  }

  return (
    <div id={`${props.id}-static-element`} className={`center static-game-element ${getDisabledStyle()}`} onClick={onClick} style={{ top: props.top, left: props.left }}>
      <svg width="100" height="100" viewBox="0 0 100 100"><polygon points="40,10, 80, 80, 10 ,80" className="triangle" /></svg>
    </div>
  );
};

export default StaticGameElement;