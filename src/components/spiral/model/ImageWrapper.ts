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

    find_lowest(current:number) {
        const lower = current-1;
        return (lower > 0) ? lower : 0;
    }

    find_highest(current:number,max:number) {
        const higher = current+1;
        return (higher < max) ? higher : max-1;
    }

    walk_vertical_line(start:number,end:number,stable:number) {
        const cells : ImageCoordinate[] = []
        for (let index = start; index < end+1; index++) {
            cells.push(new ImageCoordinate(index,stable));
        }
        return cells
    }

    walk_horizontal_line(start:number,end:number,stable:number) {
        const cells : ImageCoordinate[] = []
        for (let index = start; index < end+1; index++) {
            cells.push(new ImageCoordinate(stable,index));
        }
        return cells
    }

    find_neighbours(point:ImageCoordinate) {
        const lower_x = this.find_lowest(point.x);
        const lower_y = this.find_lowest(point.y);
        const higher_x = this.find_highest(point.x,this.width)
        const higher_y = this.find_highest(point.y,this.height)

        const left_side = this.walk_vertical_line(lower_x,higher_x,lower_y) 
        const right_side = this.walk_vertical_line(lower_x,higher_x,higher_y) 
        const top_side = this.walk_horizontal_line(lower_y,higher_y,higher_x)
        const lower_side = this.walk_horizontal_line(lower_y,higher_y,lower_x)

        const neighbors = left_side.concat(right_side,top_side,lower_side)
        return neighbors    
    }

    find_weight(point:ImageCoordinate){
        const pointOnSpiral = this.coordinates.includes(point);
        return pointOnSpiral ? - 9999 : 9999
    }
    
}