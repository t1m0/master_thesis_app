import './GameBoardContainer.css';
import ColorContainer from '../components/ColorContainer';

interface GameBoardContainerProps {
    invalidContainerCount: number,
    validContainerCount: number,
    placeholderContainerCount:number,
    clickCallback:(valid:boolean) => void
}

const colors = ['green', 'blue', 'red', 'yellow', 'pink'];

const GameBoardContainer: React.FC<GameBoardContainerProps> = (props: GameBoardContainerProps) => {
    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * colors.length)
        return colors[randomIndex];
    }

    function createColorContainer(valid:boolean) {
        let color = getRandomColor();
        let colorName = valid ? color : getRandomColor();
        while (!valid && color === colorName) {
            colorName = getRandomColor();
        }
        return <ColorContainer containerColor={color} colorName={colorName} clickCallback={props.clickCallback} />
    }

    function createPlaceholderContainer() {
        return <ColorContainer containerColor={'placeholder'} colorName={'placeholder'} clickCallback={props.clickCallback} />
    }

    function shuffleArray(array:Array<JSX.Element>) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function createBoardEntries() {
        var elements:Array<JSX.Element>=[];
        for(var i=0;i<props.validContainerCount;i++){
            elements.push(createColorContainer(true));
        }
        for(var i=0;i<props.invalidContainerCount;i++){
            elements.push(createColorContainer(false));
        }
        for(var i=0;i<props.placeholderContainerCount;i++){
            elements.push(createPlaceholderContainer());
        }
        shuffleArray(elements);
        return elements
    }

    let elements = createBoardEntries();

    return (
        <div className="game-board-container">
            {elements}
        </div>
  );
};



export default GameBoardContainer;
