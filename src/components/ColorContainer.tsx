import './ColorContainer.css';
import React, {useState} from "react";

interface ColorContainerProps {
  containerColor: string,
  colorName: string,
  clickCallback:(valid:boolean) => void
}

const ColorContainer: React.FC<ColorContainerProps> = (props: ColorContainerProps) => {
  const [disabled, setDisabled]=useState(false);

  function onClick(e:any) {
    if(!disabled) {
      setDisabled(true)
    }
    let valid = props.containerColor === props.colorName;
    props.clickCallback(valid);
  }

  function getDisabledStyle() {
    if(disabled) {
      return 'color-container-disabled'
    }
    return ''
  }

  return (
    <div className={`center color-container color-container-${props.containerColor} ${getDisabledStyle()}`} onClick={onClick}>
      <p>{props.colorName}</p>
    </div>
  );
};

export default ColorContainer;
