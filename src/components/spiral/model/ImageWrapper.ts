import ImageCoordinate from "./ImageCoordinate";

export default class ImageWrapper {
    image:Blob;
    coordinates:ImageCoordinate[];
    width:number;
    height:number;
    
    constructor(image:Blob,coordinates:ImageCoordinate[], width:number,height:number){
        this.image = image;
        this.coordinates = coordinates;
        this.width = width;
        this.height = height;
    }
}