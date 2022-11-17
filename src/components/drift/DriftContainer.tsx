import React, { MouseEvent, useEffect, useState } from "react";

interface DriftContainerProps {
    startTime: number,
    timeOutSec: number,
    finishedCallback: () => void
}

const DriftContainer: React.FC<DriftContainerProps> = (props: DriftContainerProps) => {

    const [counter, setCounter] = useState(props.timeOutSec);

    useEffect(() => {
        if (counter > 0) {
            setTimeout(() => {
                setCounter(counter - 1)
            }, 1000);
        } else {
            props.finishedCallback();
        }
    }, [counter]);

    return (
        <div className="App">
            <div>Countdown: {counter}</div>
        </div>
    );
};

export default DriftContainer;
