import { removeEmitHelper } from "typescript";
import ImageCoordinate from "../model/ImageCoordinate";
import PolarCoordinate from "../model/PolarCoordinate";
import SpiralDrawingResult from "../model/SpiralDrawing";
import SpiralRatingResult from "../model/SpiralDrawingRating";
import { calc_distance, transform_to_center } from "./SpiralMath";
import { unravel_spiral } from "./UnravelSpiral";

export default class SpiralRating {

    calc_mean(arr:number[]) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    get_polar_at_index(unraveld_spiral:Map<number,number>, index:number) {
        const keys = Array.from(unraveld_spiral.keys());
        let selected_theta = 0;
        let selected_rho = 0;
        if (index < unraveld_spiral.size) {
            selected_theta = keys[index];
            selected_rho = unraveld_spiral.get(selected_theta)!;
        }
        return {rho:selected_rho, theta:selected_theta}
    }

    calc_first_order_slope(unraveld_spiral:Map<number,number>, index:number) {
        const current_polar = this.get_polar_at_index(unraveld_spiral,index);
        const next_polar = this.get_polar_at_index(unraveld_spiral,index+1);
        
        const delta_theta = next_polar.theta - current_polar.theta
        const delta_rho = next_polar.rho - current_polar.rho    
        
        let current_slope = 0;
        if (delta_theta != 0){
            current_slope = delta_rho/delta_theta
        }

        return current_slope
    }

    calc_second_order_slope(unraveld_spiral:Map<number,number>, index:number) {
        const current_polar = this.get_polar_at_index(unraveld_spiral,index);
        const next_polar = this.get_polar_at_index(unraveld_spiral,index+1);
        
        const delta_theta = next_polar.theta - current_polar.theta
        const delta_rho = next_polar.rho - current_polar.rho    
        
        let current_slope = 0;
        if (delta_theta != 0 && current_polar.theta != 0){
            current_slope = delta_rho/delta_theta/current_polar.theta
        }

        return current_slope
    }

    calc_mean_slope(polar:Map<number,number>){
        let sum_first_order_slope = 0;
        let sum_second_order_slope = 0;

        const length = polar.size;

        for (let index = 0; index < length; index++) {
            sum_first_order_slope += this.calc_first_order_slope(polar,index);
            sum_second_order_slope += this.calc_second_order_slope(polar,index);
        }
    
        const mean_first_order_slope = sum_first_order_slope / length;
        const mean_second_order_slope = sum_second_order_slope / length;
        return [mean_first_order_slope, mean_second_order_slope];
    }

    calc_first_order_smoothness(polar:Map<number,number>, mean_slope:number) {
        let smoothness_sum = 0
        for (let index = 0; index < polar.size; index++) {
            const first_order_slope = this.calc_first_order_slope(polar,index);
            smoothness_sum += ((first_order_slope - mean_slope))**2;
        }
        const mean_smoothness = smoothness_sum / polar.size;
        const total_angular_change = Math.max(...this.to_list(polar.keys()));

        return Math.abs(Math.log((1/total_angular_change)*mean_smoothness));
    }
    
    calc_second_order_smoothness(polar:Map<number,number>, mean_slope:number) {
        let smoothness_sum = 0
        for (let index = 0; index < polar.size; index++) {
            const second_order_slope = this.calc_second_order_slope(polar,index);
            smoothness_sum += ((second_order_slope - mean_slope))**2;
        }
        
        const total_angular_change = Math.max(...this.to_list(polar.keys()));
        const mean_smoothness = smoothness_sum / polar.size;
        return Math.abs(Math.log((1/total_angular_change)*mean_smoothness));
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
        return Math.abs(crossing_count/sortedKeys.length);
        
    }

    calc_thightness(polar:Map<number,number>) {
        return Math.abs(((Math.max(...this.to_list(polar.values())) / Math.max(...this.to_list(polar.keys())))-(14*Math.PI))/(2*Math.PI));
    }
    
    calc_spiral_radius(center_point:ImageCoordinate, end_point:ImageCoordinate) {
        const transformed_end = transform_to_center(center_point,end_point)
        return calc_distance(transformed_end)
    }

    to_list(iterator:IterableIterator<number>) {
        return Array.from( iterator );
    }

    determine_severity_level(degreeOfSeverity:number) {
        if(degreeOfSeverity < 2.13) {
            return 'Healthy';
        } else if (degreeOfSeverity > 2.13 && degreeOfSeverity < 3.40) {
            return 'Good';
        } else if(degreeOfSeverity > 3.40 && degreeOfSeverity < 5.54) {
            return 'Medium';
        } else {
            return 'Poor';
        }
    }

    rate(result:SpiralDrawingResult) {
        const unraveled_spiral = unravel_spiral(result.start, result.imageWrapper.coordinates);
        const polar_map = new Map<number,number>;
        for (const polar of unraveled_spiral) {
            const rho = (Math.round(polar.rho * 100) / 100);
            const theta = (Math.round(polar.theta * 100) / 100);
            polar_map.set(theta,rho);
        }

        const mean_radius = this.calc_mean(this.to_list(polar_map.values()));
        const mean_angles = this.calc_mean(this.to_list(polar_map.keys()));
        const mean_slope = this.calc_mean_slope(polar_map);
        
        const firstOrderSmoothness = this.calc_first_order_smoothness(polar_map,mean_slope[0]);
        const secondOrderSmoothness = this.calc_second_order_smoothness(polar_map,mean_slope[1]);
        const thightness = this.calc_thightness(polar_map);
        const zeroCrossingRate = this.calc_zero_crossing_rate(polar_map);
        const degreeOfSeverity = firstOrderSmoothness * secondOrderSmoothness * thightness * zeroCrossingRate;
        const severityLevel = this.determine_severity_level(degreeOfSeverity);
        return new SpiralRatingResult(unraveled_spiral.length, firstOrderSmoothness, secondOrderSmoothness, thightness, zeroCrossingRate, degreeOfSeverity, severityLevel);
    }
}