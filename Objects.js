import { Vector } from './Vector.js';

export class Sphere {
    /**
     * Creates a new sphere object.
     * @param {Vector} centre The centre of the sphere.
     * @param {Number} radius The radius of the sphere.
     */
    constructor(x, y, z, radius, r, g, b, shiny){
        this.centre = new Vector(x, y, z);
        this.radius = radius;
        this.colour = new Vector(r, g, b);
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
