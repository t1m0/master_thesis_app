import ImageCoordinate from "../model/ImageCoordinate";
import PolarCoordinate from "../model/PolarCoordinate";
import SpiralDrawingResult from "../model/SpiralDrawing";
import SpiralRatingResult from "../model/SpiralDrawingRating";
import { calc_distance, transform_to_center } from "./SpiralMath";
import UnravelSpiral from "./UnravelSpiral";

export default class SpiralRating {
    unravelSpiral = new UnravelSpiral();

    calc_mean(arr:number[]) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    calc_mean_slope(polar:Map<number,number>){
        const mean_radius = this.calc_mean(this.to_list(polar.values()));
        const mean_angles = this.calc_mean(this.to_list(polar.keys()));
        const result = new Array<number>();
        polar.forEach((v,k) => {
            const r = v/k;
            if((!Number.isNaN(r)) && Number.isFinite(r)) {
                result.push(r);
            }
        });
        return this.calc_mean(result);
    }

    calc_first_order_smoothness(polar:Map<number,number>, mean_slope:number) {
        let smoothness_sum = 0
        polar.forEach( (theta, rho) => {
            let current_slope = 0;
            if(theta != 0) {
                current_slope = rho/theta
            }
            smoothness_sum += ((current_slope - mean_slope))**2
        });
        return (1/Math.max(...this.to_list(polar.keys())))*smoothness_sum
    }
    
    calc_second_order_smoothness(polar:Map<number,number>, mean_slope:number) {
        let smoothness_sum = 0;
        polar.forEach( (theta, rho) => {
            let current_slope = 0;
            if (theta != 0) {
                current_slope = (rho/theta)/theta
            }
            smoothness_sum += ((current_slope - mean_slope))**2;
        });
        return (1/Math.max(...this.to_list(polar.keys())))*smoothness_sum
    }

    calc_zero_crossing_rate(polar:Map<number,number>) {
        let sortedKeys = new Array<number>(polar.size)        
        let index = 0
        polar.forEach((value: number, key: number) => {
            if (index != 0) {
                let prev = sortedKeys[index-1];
                if(prev > key) {
                    sortedKeys[index] = prev;
                    sortedKeys[index-1] = key;
                } else {
                    sortedKeys[index] = key;
                }
            } else {
                sortedKeys[index] = key;
            }
            index+=1;
        });

        const first_rho = polar.get(sortedKeys[0])!;
        const last_rho = polar.get(sortedKeys[sortedKeys.length-1])!;
        const rho_step_size = (last_rho - first_rho)/polar.size
        let current_base_rho = first_rho;
        let positive = true;
        let crossing_count = 0;
        sortedKeys.forEach( (theta:number) => {
            if (polar.has(theta)) {
                const rho = polar.get(theta)!;
                const current_positive = (rho - current_base_rho) > 0;
                if (positive != current_positive) {
                    positive = current_positive;
                    crossing_count += 1;
                }
                current_base_rho += rho_step_size;
            }
        });
        // divide crossing count by amount of entries
        return crossing_count/sortedKeys.length;
        
    }

    calc_thightness(polar:Map<number,number>) {
        return ((Math.max(...this.to_list(polar.values())) / Math.max(...this.to_list(polar.keys())))-(14*Math.PI))/(2*Math.PI)
    }
    
    calc_spiral_radius(center_point:ImageCoordinate, end_point:ImageCoordinate) {
        const transformed_end = transform_to_center(center_point,end_point)
        return calc_distance(transformed_end)
    }

    calc_degree_of_severity(unraveled_spiral:PolarCoordinate[]) {
        
    }

    to_list(iterator:IterableIterator<number>) {
        return Array.from( iterator );
    }

    rate(result:SpiralDrawingResult) {
        const unraveled_spiral = this.unravelSpiral.unravel_spiral(result.start, result.imageWrapper.coordinates);
        const polar_map = new Map<number,number>;
        for (const polar of unraveled_spiral) {
            const rho = (Math.round(polar.rho * 1000) / 1000);
            const theta = (Math.round(polar.theta * 1000) / 1000);
            polar_map.set(theta,rho);
        }
        const mean_slope = this.calc_mean_slope(polar_map);
        
        const firstOrderSmoothness = this.calc_first_order_smoothness(polar_map,mean_slope);
        const secondOrderSmoothness = this.calc_second_order_smoothness(polar_map,mean_slope);
        const thightness = this.calc_thightness(polar_map);
        const zeroCrossingRate = this.calc_zero_crossing_rate(polar_map);
        const degreeOfSeverity = firstOrderSmoothness * secondOrderSmoothness * thightness * zeroCrossingRate;
        return new SpiralRatingResult(firstOrderSmoothness, secondOrderSmoothness, thightness, zeroCrossingRate, degreeOfSeverity);
    }
}