import ImageCoordinate from './model/ImageCoordinate';
import SpiralDrawingResult from './model/SpiralDrawingResult';
import React, { SyntheticEvent } from 'react';

type AnyFunction = (...params: any[]) => any;

export interface CanvasProps {
    onMouseDown: React.MouseEventHandler<HTMLCanvasElement>;
    onTouchStart: React.TouchEventHandler<HTMLCanvasElement>;
    onMouseMove: React.MouseEventHandler<HTMLCanvasElement>;
    onTouchMove: React.TouchEventHandler<HTMLCanvasElement>;
    onMouseUp: React.MouseEventHandler<HTMLCanvasElement>;
    onTouchEnd: React.TouchEventHandler<HTMLCanvasElement>;
    style: React.CSSProperties;
    ref: (ref: HTMLCanvasElement) => void;
}

export interface PropsGetterInput extends Partial<CanvasProps> {
    [key: string]: any;
}

export interface PropsGetterResult extends CanvasProps {
    [key: string]: any;
}

export interface RenderProps {
    canvas: JSX.Element;
    triggerSave: () => void;
    getCanvasProps: (props: PropsGetterInput) => PropsGetterResult;
    setColor: (color: string) => void;
}

export interface SpiralCanvasContainerProps {
    width?: number,
    height?: number,
    initialColor?: string;
    initialLineWidth?: number;
    onSave: (result:SpiralDrawingResult) => void;
    render?: (props: RenderProps) => JSX.Element;
}

export interface PainterState {
    canvasHeight: number;
    canvasWidth: number;
    isDrawing: boolean;
    color: string;
    lineWidth: number;
}

export class SpiralCanvasContainer extends React.Component<SpiralCanvasContainerProps, PainterState> {


    static defaultProps: Partial<SpiralCanvasContainerProps> = {
        width:600,
        height:300,
        onSave: () => undefined,
        initialColor: '#000',
        initialLineWidth: 1
    };

    canvasRef: HTMLCanvasElement | null = null;
    ctx: CanvasRenderingContext2D | null = null;
    firstX = -1;
    firstY = -1;
    lastX = 0;
    lastY = 0;
    scalingFactor = 1;

    state: PainterState = {
        canvasHeight: 0,
        canvasWidth: 0,
        color: this.props.initialColor!,
        isDrawing: false,
        lineWidth: this.props.initialLineWidth!
    };

    extractOffSetFromEvent = (event: SyntheticEvent<HTMLCanvasElement>,scalingFactor: number,canvasRef: HTMLCanvasElement) => {
        const {
          offsetX,
          offsetY,
          touches,
          clientX: mouseClientX,
          clientY: mouseClientY
        } = event.nativeEvent as any;
        // If offset coords are directly on the event we use them
        if (offsetX && offsetY) {
          return {
            offsetX: offsetX * scalingFactor,
            offsetY: offsetY * scalingFactor
          };
        }
        // Otherwise we need to calculate them as difference between (x, y) of event and (left, top) corner of canvas
        // We need to check whether user is using a touch device or just the mouse and extract
        // the touch/click coords accordingly
        const clientX = touches && touches.length ? touches[0].clientX : mouseClientX;
        const clientY = touches && touches.length ? touches[0].clientY : mouseClientY;
        const rect = canvasRef.getBoundingClientRect();
        const x = (clientX - rect.left) * scalingFactor;
        const y = (clientY - rect.top) * scalingFactor;
        return {
          offsetX: x,
          offsetY: y
        };
      };

    dataUrlToArrayBuffer = (dataURI: string): [string, ArrayBuffer] => {
        if (dataURI) {
            const type = dataURI.match(/:([^}]*);/)![1];
            const byteString = atob(dataURI.split(',')[1]);
            const ia = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return [type, ia.buffer];
        }
        return ["", new ArrayBuffer(0)];
      };
    
    canvasToBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob> =>
      new Promise(resolve => {
        if (canvas.toBlob) {
          canvas.toBlob(blob => {
            if (blob) {
                resolve(blob)
            }
          }, type);
        } else {
          const dataURL = canvas.toDataURL(type);
          const [generatedType, buffer] = this.dataUrlToArrayBuffer(dataURL);
          resolve(new Blob([buffer], { type: generatedType }));
        }
      });
    
    composeFn = (...fns: AnyFunction[]) => (...args: any[]) =>
      fns.forEach(fn => fn && fn(...args));

    handleMouseDown = (event: React.SyntheticEvent<HTMLCanvasElement>) => {
        if (this.canvasRef){
            const { offsetX, offsetY } = this.extractOffSetFromEvent(event,this.scalingFactor,this.canvasRef);
            this.lastX = offsetX;
            this.lastY = offsetY;
            if( this.firstX < 0 ) {
                this.firstX = offsetX;
                this.firstY = offsetY;
            }
            this.setState({
                isDrawing: true
            });
        }
    };

    handleMouseMove = (event: React.SyntheticEvent<HTMLCanvasElement>) => {
        const { color, lineWidth } = this.state;
        if (this.state.isDrawing && this.canvasRef) {
            const { offsetX, offsetY } = this.extractOffSetFromEvent(event,this.scalingFactor,this.canvasRef);
            const ctx = this.ctx;
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth * this.scalingFactor;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                const lastX = this.lastX;
                const lastY = this.lastY;
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(offsetX, offsetY);
                ctx.stroke();
                this.lastX = offsetX;
                this.lastY = offsetY;
            }
        }
    };

    handleMouseUp = () => {
        this.setState({
            isDrawing: false
        });
    };

    handleSave = () => {
        if(this.canvasRef) {
            const start = {x:this.firstX,y:this.firstY};
            const end = {x:this.lastX,y:this.lastY};
            this.canvasToBlob(this.canvasRef, 'image/png')
                .then((blob: Blob) => { 
                    const result = new SpiralDrawingResult(blob, start, end);
                    this.props.onSave(result); 
                })
                .catch(err => console.error('in ReactPainter handleSave', err));
        }
    };

    handleSetColor = (color: string) => {
        this.setState({
            color
        });
    };

    handleSetLineWidth = (lineWidth: number) => {
        this.setState({
            lineWidth
        });
    };

    initCanvasContext = () => {
        const { color, lineWidth } = this.state;
        if (this.canvasRef) {
            this.ctx = this.canvasRef.getContext('2d');
            if (this.ctx) {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = lineWidth * this.scalingFactor;
                this.ctx.lineJoin = "round";
                this.ctx.lineCap = "round";
            }
        }
    };

    initCanvasNoImage = (width: number, height: number) => {
        if (this.canvasRef) {
            this.canvasRef.width = width;
        this.canvasRef.height = height;
        this.setState({
          canvasHeight: height,
          canvasWidth: width
        });
        }
        this.initCanvasContext();
    };

    componentDidMount() {
        const { width, height } = this.props;
        // Disable touch action as we handle it separately
        document.body.style.touchAction = 'none';
        this.initCanvasNoImage(width!, height!);
    }

    componentWillUnmount() {
        // Enable touch action again
        //document.body.style.touchAction = null;
    }

    getCanvasProps = (props: PropsGetterInput = {}): PropsGetterResult => {
        const {
            onMouseDown,
            onTouchStart,
            onMouseMove,
            onTouchMove,
            onMouseUp,
            onTouchEnd,
            style,
            ref,
            ...restProps
        } = props;
        return {
            onMouseDown: this.composeFn(onMouseDown!, this.handleMouseDown),
            onMouseMove: this.composeFn(onMouseMove!, this.handleMouseMove),
            onMouseUp: this.composeFn(onMouseUp!, this.handleMouseUp),
            onTouchEnd: this.composeFn(onTouchEnd!, this.handleMouseUp),
            onTouchMove: this.composeFn(onTouchMove!, this.handleMouseMove),
            onTouchStart: this.composeFn(onTouchStart!, this.handleMouseDown),
            ref: this.composeFn(ref!, (canvasRef: HTMLCanvasElement) => {
                this.canvasRef = canvasRef;
            }),
            style: {
                height: this.state.canvasHeight,
                width: this.state.canvasWidth,
                ...style
            },
            ...restProps
        };
    };

    render() {
        const { render } = this.props;
        const canvasNode = <canvas {...this.getCanvasProps()} />;
        return typeof render === 'function'
            ? render({
                canvas: canvasNode,
                getCanvasProps: this.getCanvasProps,
                setColor: this.handleSetColor,
                triggerSave: this.handleSave
            })
            : canvasNode;
    }
}