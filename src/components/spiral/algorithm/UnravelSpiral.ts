import ImageCoordinate from "../model/ImageCoordinate"
import PolarCoordinate from "../model/PolarCoordinate"
import { transform_to_center, calc_distance } from "./SpiralMath";

function calc_angle(point: ImageCoordinate) {
    if (point.x != 0) {
        let angle = Math.atan(point.y / point.x) * (180 / Math.PI);
        if (angle < 0) {
            angle = 90 + angle;
        }
        return angle;
    } else {
        return 0;
    }
}

export function unravel_spiral(center: ImageCoordinate, path: ImageCoordinate[]) {
    console.log("Processing " + path.length + " spiral coordinates");
    let angle_cuts = 0;
    const unraveled_spiral: PolarCoordinate[] = [];
    path.forEach(point => {
        const centered_point = transform_to_center(center, point);
        const rho = calc_distance(centered_point);
        if (rho > 3 && (center.x == point.x || center.y == point.y)) {
            console.log(point + "cuts angle");
            angle_cuts += 1;
        }
        const theta = calc_angle(centered_point) + (90 * angle_cuts);
        const polar = { rho: rho, theta: theta };
        unraveled_spiral.push(polar);
    });
    return unraveled_spiral;
}