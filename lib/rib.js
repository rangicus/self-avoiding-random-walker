// Geometric Classes
class Vector2 {
    /**
     * A point in two-dimensional space.
     * @param {Number} x The x component.
     * @param {Number} y The y component.
     */
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    // Returns the magnitude of this vector.
    get mag () {
        return Math.sqrt( this.x ** 2, this.y ** 2 );
    }

    // Returns the components of this vector as an array.
    get array () {
        return [this.x, this.y];
    }

    // Adds something else to a vector. (Returns new object)
    static add (vector, other) {
        if (other instanceof Vector2) {
            return new Vector2(
                vector.x + other.x,
                vector.y + other.y
            );
        } else if (typeof other === `number`) {
            return new Vector2(
                vector.x + other,
                vector.y + other
            );
        } else return console.error(`Invalid type.`, typeof other);
    }

    // Adds another object to this vector.
    add (other) {
        if (other instanceof Vector2) {
            this.x += other.x;
            this.y += other.y;
        } else if (typeof other === `number`) {
            this.x += other;
            this.y += other;
        } else return console.error(`Invalid type.`, typeof other);

        return this;
    }

    // Multiplies a vector by something else. (Returns new object)
    static mult (vector, other) {
        if (typeof other === `number`) {
            return new Vector2(
                vector.x * other,
                vector.y * other
            );
        }
    }

    // Multiplies this vector by another object.
    mult (other) {
        if (typeof other === `number`) {
            this.x *= other;
            this.y *= other;

            return this;
        }
    }
}