import ImageCoordinate from "../model/ImageCoordinate"

export function transform_to_center(startPoint:ImageCoordinate, point:ImageCoordinate): ImageCoordinate {
    const x = (point.x-startPoint.x);
    const y = (startPoint.y - point.y);
    return new ImageCoordinate(x,y);
}

export function calc_distance(point:ImageCoordinate) {
    const x = point.x**2;
    const y = point.y**2;
    return Math.sqrt(x + y);
}