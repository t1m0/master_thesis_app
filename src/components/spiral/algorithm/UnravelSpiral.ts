import * as Collections from 'typescript-collections';
import ImageCoordinate from "../model/ImageCoordinate"
import PolarCoordinate from "../model/PolarCoordinate"

export default class UnravelSpiral {
    transform_to_center(startPoint:ImageCoordinate, point:ImageCoordinate): ImageCoordinate {
        const x = (point.x-startPoint.x);
        const y = (startPoint.y - point.y);
        return {x:x, y:y};
    }

    calc_distance(point:ImageCoordinate) {
        const x = point.x**2;
        const y = point.y**2;
        return Math.sqrt(x + y);
    }

    calc_angle(point:ImageCoordinate) {
        if (point.x != 0) {
            let angle = Math.atan(point.y/point.x) * (180/Math.PI);
            if (angle < 0) {
                angle = 90+angle;
            }
            return angle;
        } else {
            return 0;
        }
    }

    unravel_spiral(center:ImageCoordinate, path:ImageCoordinate[]) {
        let angle_cuts = 0;
        const unraveled_spiral = new Collections.Dictionary<ImageCoordinate, PolarCoordinate>();
        for (const point of path) {
            const centered_point = this.transform_to_center(center,point);
            const rho = this.calc_distance(centered_point);
            if (rho > 3 && (center.x == point.x || center.y == point.y)) {
                console.log(point + "cuts angle");
                angle_cuts += 1;
            }
            const theta = this.calc_angle(centered_point) + (90*angle_cuts);
            const polar = {rho:rho, theta:theta};
            unraveled_spiral.setValue(point, polar);
        }
        return unraveled_spiral;
    }
}