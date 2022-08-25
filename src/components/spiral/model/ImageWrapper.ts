import ImageCoordinate from "./ImageCoordinate";

export default class ImageWrapper {
    image:Array<number>;
    coordinates:ImageCoordinate[];
    width:number;
    height:number;
    
    constructor(image:Array<number>,coordinates:ImageCoordinate[], width:number,height:number){
        this.image = image;
        this.coordinates = coordinates;
        this.width = width;
        this.height = height;
    }
}