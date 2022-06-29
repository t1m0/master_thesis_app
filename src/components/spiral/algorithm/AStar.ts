import ImageCoordinate from "../model/ImageCoordinate"
import * as Collections from 'typescript-collections';
import ImageWrapper from "../model/ImageWrapper";

export default class AStar {


    heuristic(endPoint:ImageCoordinate,neighbour:ImageCoordinate) {
        const x = Math.abs(endPoint.x - neighbour.x);
        const y = Math.abs(endPoint.y - neighbour.y);
        return Math.max(x, y);
    }

    find_lowest_f_score_node(f_scores:Collections.Dictionary<ImageCoordinate, number>, open_set:Set<ImageCoordinate>) {
        let lowest_cell:ImageCoordinate|undefined= undefined;
        let lowest_f_score = 0;
        open_set.forEach((cell:ImageCoordinate)=> {
            let current_f_score = f_scores.getValue(cell);
            if (current_f_score == undefined) {
                current_f_score = 0;
            }
            if (lowest_cell == undefined || current_f_score < lowest_f_score) {
                lowest_cell = cell
                lowest_f_score = current_f_score
            }
        });
        return lowest_cell
    }

    reconstruct_path(came_from:Collections.Dictionary<ImageCoordinate, ImageCoordinate>, f_scores:Collections.Dictionary<ImageCoordinate, number>, currentCell:ImageCoordinate) {
        let tmp_cell : ImageCoordinate = currentCell;
        let total_path = [tmp_cell];
        let total_cost = 0;
        while (came_from.containsKey(tmp_cell)) {
            tmp_cell = came_from.getValue(tmp_cell)!;
            total_cost += f_scores.getValue(tmp_cell)!;
            total_path.push(tmp_cell);
        }
        total_path.reverse();
        return total_path;
    }

    aStar(startpoint:ImageCoordinate, endpoint:ImageCoordinate, imageWrapper:ImageWrapper) : ImageCoordinate[] {
        // The set of discovered nodes that may need to be (re-)expanded.
        // Initially, only the start node is known.
        const open_set = new Set<ImageCoordinate>();
        open_set.add(startpoint);
    
        //Stores the cell immediately preceding the given cell
        const came_from = new Collections.Dictionary<ImageCoordinate, ImageCoordinate>();
    
        // Stores the cost of the cheapest path from start to the given cell
        const g_score = new Collections.Dictionary<ImageCoordinate, number>();
        g_score.setValue(startpoint,0);
    
        // Stores the f-score for the given cell
        const f_score = new Collections.Dictionary<ImageCoordinate, number>();
        f_score.setValue(startpoint,this.heuristic(startpoint, startpoint))
        let total_iterations = 0
        let current : ImageCoordinate|undefined = undefined;
        while (open_set.size > 0) {
            // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
            current = this.find_lowest_f_score_node(f_score, open_set);
            if(current == undefined) {
                console.log("Current undefined!");
                return [];
            }
            if (current == endpoint) {
                const path = this.reconstruct_path(came_from, f_score, current);
                return path;
            }
    
            open_set.delete(current);
            const neighbors = imageWrapper.find_neighbours(current);
            for (const neighbor of neighbors) {
                // d(current,neighbor) is the weight of the edge from current to neighbor
                // tentative_gScore is the distance from start to the neighbor through current
                const weight = imageWrapper.find_weight(neighbor);
                let current_g_score = g_score.getValue(current);
                if (current_g_score == undefined) {
                    current_g_score = 0;
                }
                const tentative_gScore = current_g_score + weight;
                if(!g_score.containsKey(neighbor)) {
                    // This path to neighbor is better than any previous one. Record it!
                    came_from.setValue(neighbor,current);
                    g_score.setValue(neighbor,tentative_gScore)
                    f_score.setValue(neighbor,tentative_gScore + this.heuristic(endpoint, neighbor))
                    if (!open_set.has(neighbor)) {
                        open_set.add(neighbor);
                    }
                }
            }
            total_iterations += 1
        }
            
        // Open set is empty but goal was never reached
        console.log("No path found :(")
        if (current == undefined) {
            current = new ImageCoordinate(0,0);
        }
        return this.reconstruct_path(came_from, f_score, current)
    }
   
        
}