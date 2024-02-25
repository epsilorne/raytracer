import { Vector } from './vector.js';

export class Sphere {
    /**
     * Creates a new sphere object.
     * @param {Vector} centre The centre of the sphere.
     * @param {Number} radius The radius of the sphere.
     */
    constructor(x, y, z, radius, colour){
        this.centre = new Vector(x, y, z);
        this.radius = radius;
        this.colour = colour;
    }

    /**
     * 
     * @param {Vector} origin Where the ray comes from.
     * @param {Vector} direction A unit vector representing the ray's direction.
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

        // distance = (-b + sqd) / (2 * a);
        // if (distance > 0.01) return distance;

        return NaN;
    }
}