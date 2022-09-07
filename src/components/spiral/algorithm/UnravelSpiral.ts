import ImageCoordinate from "../model/ImageCoordinate"
import PolarCoordinate from "../model/PolarCoordinate"
import { transform_to_center, calc_distance, roundValue } from "./SpiralMath";

function to_degrees(value:number) {
    return value * (180 / Math.PI);
}

function calc_angle(point: ImageCoordinate) {
    if (point.x != 0) {
        let angle = to_degrees(Math.atan(point.y / point.x));
        if (angle < 0) {
            angle = 90 + angle;
        }
        if (point.y < 0 && point.x != 0) {
            angle = 90-angle
        }
        return angle;
    } else {
        return 0;
    }
}

function cuts_angle(previous: ImageCoordinate, current: ImageCoordinate) {
    const x_prev_positive = previous.x >= 0
    const y_prev_positive = previous.y >= 0
    const x_cur_positive = current.x >= 0
    const y_cur_positive = current.y >= 0
    return x_prev_positive != x_cur_positive || y_prev_positive != y_cur_positive
}

export function unravel_spiral(center: ImageCoordinate, path: ImageCoordinate[]) {
    console.log("Processing " + path.length + " spiral coordinates");
    let angle_cuts = 0;
    const unraveled_spiral: PolarCoordinate[] = [];
    let previous = center;
    path.forEach(point => {
        const centered_point = transform_to_center(center, point);
        const rho = calc_distance(centered_point);
        
        if (cuts_angle(previous,centered_point)) {
            angle_cuts += 1;
        }
        
        const theta = calc_angle(centered_point) + (90 * angle_cuts);
        const rho_rounded = roundValue(rho);
        const theta_rounded = roundValue(theta);
        const polar = { rho: rho_rounded, theta: theta_rounded };
        unraveled_spiral.push(polar);
        previous = centered_point
    });
    return unraveled_spiral;
}