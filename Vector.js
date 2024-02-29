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
     * @param {*} angle Angle in radians.
     * @returns Rotated vector.
     */
    rotateY(angle){
        let rotMatrix = [
            new Vector(Math.cos(angle), 0, Math.sin(angle)),
            new Vector(0, 1, 0),
            new Vector(-Math.sin(angle), 0, Math.cos(angle))
        ];

        return new Vector(
            this.dotProduct(rotMatrix[0]),
            this.dotProduct(rotMatrix[1]),
            this.dotProduct(rotMatrix[2])
        );
    }
}
