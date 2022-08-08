import ImageCoordinate from "../model/ImageCoordinate"

export function transform_to_center(center:ImageCoordinate, point:ImageCoordinate) {
    const x = (point.x-center.x);
    const y = (center.y - point.y);
    return {x:x, y:y} as ImageCoordinate
}

export function calc_distance(point:ImageCoordinate) {
    const x = point.x**2;
    const y = point.y**2;
    return Math.sqrt(x + y);
}