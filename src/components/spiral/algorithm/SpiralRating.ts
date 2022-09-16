import ImageCoordinate from "../model/ImageCoordinate";
import SpiralDrawingResult from "../model/SpiralDrawing";
import SpiralRatingResult from "../model/SpiralDrawingRating";
import { calc_distance, roundValue, transform_to_center } from "./SpiralMath";
import { unravel_spiral } from "./UnravelSpiral";

export default class SpiralRating {

    calc_mean(arr: number[]) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    get_polar_at_index(thetas: Array<number>, rhos: Array<number>, index: number) {
        let selected_theta = 0;
        let selected_rho = 0;
        if (index < thetas.length) {
            selected_theta = thetas[index];
            selected_rho = rhos[index];
        }
        return { rho: selected_rho, theta: selected_theta }
    }

    calc_first_order_slope(thetas: Array<number>, rhos: Array<number>, index: number) {
        const current_polar = this.get_polar_at_index(thetas, rhos, index);
        const next_polar = this.get_polar_at_index(thetas, rhos, index + 1);
        const delta_theta = next_polar.theta - current_polar.theta
        const delta_rho = next_polar.rho - current_polar.rho

        let current_slope = 0;
        if (delta_theta != 0) {
            current_slope = delta_rho / delta_theta
        }

        return current_slope
    }

    calc_second_order_slope(thetas: Array<number>, rhos: Array<number>, index: number) {
        const current_polar = this.get_polar_at_index(thetas, rhos, index);
        const next_polar = this.get_polar_at_index(thetas, rhos, index + 1);

        const delta_theta = next_polar.theta - current_polar.theta
        const delta_rho = next_polar.rho - current_polar.rho

        let current_slope = 0;
        if (delta_theta != 0 && current_polar.theta != 0) {
            current_slope = delta_rho / delta_theta / current_polar.theta
        }

        return current_slope
    }

    calc_mean_slope(thetas: Array<number>, rhos: Array<number>) {
        let sum_first_order_slope = 0;
        let sum_second_order_slope = 0;

        const length = thetas.length;

        for (let index = 0; index < length; index++) {
            sum_first_order_slope += this.calc_first_order_slope(thetas, rhos, index);
            sum_second_order_slope += this.calc_second_order_slope(thetas, rhos, index);
        }

        const mean_first_order_slope = sum_first_order_slope / length;
        const mean_second_order_slope = sum_second_order_slope / length;
        return [mean_first_order_slope, mean_second_order_slope];
    }

    calc_first_order_smoothness(thetas: Array<number>, rhos: Array<number>, mean_slope: number) {
        let smoothness_sum = 0
        for (let index = 0; index < thetas.length; index++) {
            const first_order_slope = this.calc_first_order_slope(thetas, rhos, index);
            smoothness_sum += ((first_order_slope - mean_slope)) ** 2;
        }
        const mean_smoothness = smoothness_sum / thetas.length;
        const total_angular_change = Math.max(...thetas);

        return roundValue(Math.abs(Math.log((1 / total_angular_change) * mean_smoothness)));
    }

    calc_second_order_smoothness(thetas: Array<number>, rhos: Array<number>, mean_slope: number) {
        let smoothness_sum = 0
        for (let index = 0; index < thetas.length; index++) {
            const second_order_slope = this.calc_second_order_slope(thetas, rhos, index);
            smoothness_sum += ((second_order_slope - mean_slope)) ** 2;
        }

        const total_angular_change = Math.max(...thetas);
        const mean_smoothness = smoothness_sum / thetas.length;
        return roundValue(Math.abs(Math.log((1 / total_angular_change) * mean_smoothness)));
    }

    calc_zero_crossing_rate(thetas: Array<number>, rhos: Array<number>) {
        // sort the theta values - on copy of the original list to be able to resolve the original index
        const keylist = [...thetas];
        keylist.sort(function (a, b) {
            if (a === Infinity)
                return 1;
            else if (isNaN(a))
                return -1;
            else
                return a - b;
        });

        // get first and last rho value
        const y1 = rhos[thetas.indexOf(keylist[0])];
        const y2 = rhos[thetas.indexOf(keylist[keylist.length - 1])];
        // calculate the step size for the baseline
        const y_step = (y2 - y1) / thetas.length;
        console.log(`${y1} ${y2} ${y_step}`)
        // iterate throuh all theta values and calculate diff
        // count the times the diff changes polarity
        let current_y = y1;
        let count_crossing = 0;
        let positive = true;
        keylist.forEach(key => {
            const actual_y = rhos[thetas.indexOf(key)];
            const diff = actual_y - current_y;
            const current_positive = diff > 0;
            if (positive != current_positive) {
                count_crossing += 1;
                positive = current_positive;
            }
            current_y += y_step;
        });

        // count of polarity switches divided by amount of entries
        return roundValue(Math.abs(count_crossing / thetas.length))

    }

    calc_thightness(thetas: Array<number>, rhos: Array<number>) {
        return roundValue(Math.abs((Math.max(...rhos) / Math.max(...thetas) - (14 * Math.PI)) / (2 * Math.PI)));
    }

    calc_spiral_radius(center_point: ImageCoordinate, end_point: ImageCoordinate) {
        const transformed_end = transform_to_center(center_point, end_point)
        return calc_distance(transformed_end)
    }

    to_list(iterator: IterableIterator<number>) {
        return Array.from(iterator);
    }

    determine_severity_level(degreeOfSeverity: number) {
        if (degreeOfSeverity < 2.13) {
            return 'Very Good';
        } else if (degreeOfSeverity > 2.13 && degreeOfSeverity < 3.40) {
            return 'Good';
        } else if (degreeOfSeverity > 3.40 && degreeOfSeverity < 5.54) {
            return 'Medium';
        } else {
            return 'Poor';
        }
    }


    rate(result: SpiralDrawingResult) {
        const unraveled_spiral = unravel_spiral(result.start, result.imageWrapper.coordinates);
        const thetas = [];
        const rhos = [];
        for (const polar of unraveled_spiral) {
            thetas.push(polar.theta);
            rhos.push(polar.rho)
        }

        const mean_rhos = this.calc_mean(rhos);
        const mean_thetas = this.calc_mean(thetas);
        const mean_slope = this.calc_mean_slope(thetas, rhos);

        const firstOrderSmoothness = this.calc_first_order_smoothness(thetas, rhos, mean_slope[0]);
        const secondOrderSmoothness = this.calc_second_order_smoothness(thetas, rhos, mean_slope[1]);
        const thightness = this.calc_thightness(thetas, rhos);
        const zeroCrossingRate = this.calc_zero_crossing_rate(thetas, rhos);
        const degreeOfSeverity = roundValue(firstOrderSmoothness * secondOrderSmoothness * thightness * zeroCrossingRate);
        const severityLevel = this.determine_severity_level(degreeOfSeverity);
        return new SpiralRatingResult(unraveled_spiral.length, firstOrderSmoothness, secondOrderSmoothness, thightness, zeroCrossingRate, degreeOfSeverity, severityLevel);
    }
}