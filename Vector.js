export class Vector {
    /**
     * Creates a new Vector object.
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    /**
     * Adds two vectors together.
     * @param {Vector} vec The vector to be added.
     * @returns The result.
     */
    add(vec){
        return new Vector(
            this.x + vec.x,
            this.y + vec.y,
            this.z + vec.z
        )
    }

    /**
     * Subtracts two vectors together.
     * @param {Vector} vec The vector to be subtracted.
     * @returns The result.
     */
    subtract(vec){
        return new Vector(
            this.x - vec.x,
            this.y - vec.y,
            this.z - vec.z
        )
    }

    /**
     * Calculates the scalar product of a vector.
     * @param {Number} k The scalar value.
     * @returns The scalar product.
     */
    scalar(k){
        return new Vector(
            this.x * k,
            this.y * k,
            this.z * k
        )
    }

    /**
     * Calculates the dot product of two vectors.
     * @param {Vector} vec The vector to be multiplied.
     * @returns The dot product.
     */
    dotProduct(vec){
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    /**
     * @returns The length of a vector.
     */
    length(){
        return Math.sqrt(this.dotProduct(this));
    }

    /**
     * @returns The unit vector.
     */
    unit(){
        return this.scalar(1 / this.length());
    }

    /**
     * Rotates a vector in the y-axis by a specified no. of radians.
     * @param {Number} angle Angle in radians
     * @returns Rotated vector.
     */
    rotate(angle){
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const rotMatrix = [
                new Vector(cos,   0,   sin),
                new Vector( 0,    1,    0 ),
                new Vector(-sin,  0,   cos)
        ];

        let x = this.dotProduct(rotMatrix[0]);
        let y = this.dotProduct(rotMatrix[1]);
        let z = this.dotProduct(rotMatrix[2]);

        return new Vector(x, y, z);
    }

    /**
     * Rotates a vector in the y-axis around a pivot-point by a specified
     * no. of radians.
     * @param {Number} angle Angle in radians.
     * @param {Vector} pivot Pivot point vector.
     * @returns Rotated vector.
     */
    rotatePivot(angle, pivot){
        return this.subtract(pivot).rotate(angle).add(pivot);
    }
}

