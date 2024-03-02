import { Vector } from './Vector.js';

export class Sphere {
    /**
     * Generate a new sphere object.
     * @param {Vector} centre The centre coordinates.
     * @param {Number} radius The radius.
     * @param {Vector} colour The local colour.
     * @param {Boolean} shiny Whether the surface will be shiny.
     */
    constructor(centre, radius, colour, shiny){
        this.centre = centre;
        this.radius = radius;
        this.colour = colour;
        this.shiny = shiny;
    }

    /**
     * Handles sphere-ray collision detection.
     * @param {Vector} origin Where the ray comes from.
     * @param {Vector} direction A unit vector representing the ray's direction.
     * @returns The distance from the origin to sphere surface, if it collides.
     */
    intersection(origin, direction){
        let p = origin.subtract(this.centre);
        let a = direction.dotProduct(direction);
        let b = 2 * p.dotProduct(direction);
        let c = p.dotProduct(p) - (this.radius * this.radius)
        let d = (b * b) - (4 * a * c);

        if(d < 0){
            return NaN;
        }

        let sqd = Math.sqrt(d);

        let distance = (-b - sqd) / (2 * a);
        if (distance > 0.00001) return distance;

        distance = (-b + sqd) / (2 * a);
        if (distance > 0.01) return distance;

        return NaN;
    }
}

export class Plane {
    constructor(centre, normal, colour, shiny){
        this.centre = centre;
        this.norm = normal;
        this.colour = colour;
        this.shiny = shiny;
    }
    intersection(origin, direction){

        let denom = direction.dotProduct(this.norm);

        if(Math.abs(denom) >= 0) {
            let diff = this.centre.subtract(origin);
            let t = diff.dotProduct(this.norm) / denom;

            if (t > 0.001){
                return t;
            }
        }

        return NaN;

        // let a = this.centre.subtract(origin).dotProduct(this.dir);
        // let b = direction.dotProduct(this.dir);

        // if(b > 0.00001){
        //     let result = a / b;
        //     if(result >= 0){
        //         return result;
        //     }
        // }

        // return NaN;
    }
}
