class Vect3 {
    constructor(opt_src) {
        var v = new Float32Array(3);
        if (opt_src && typeof opt_src === 'object') {
          v[0] = opt_src[0];
          v[1] = opt_src[1];
          v[2] = opt_src[2];
        }
        this.elements = v;
    }

    /**
     * Copy vector.
     * @param src source vector
     * @return this
     */
    set(src) {
        var i, s, d;

        s = src.elements;
        d = this.elements;

        if (s === d) {
          return;
        }

        for (i = 0; i < 3; ++i) {
          d[i] = s[i];
        }

        return this;
    }

    /**
      * Add other to this vector.
      * @return this
      */
    add(other) {
        this.elements[0] += other.elements[0];
        this.elements[1] += other.elements[1];
        this.elements[2] += other.elements[2];
        // Insert your code here.
        // This function should change this vector (this.elements) and not create a new vector.

        // Don't delete the return statement.
        return this;
    };

    /**
      * Subtract other from this vector.
      * @return this
      */
    sub(other) {
        this.elements[0] -= other.elements[0];
        this.elements[1] -= other.elements[1];
        this.elements[2] -= other.elements[2];
        // Insert your code here.
        // This function should change this vector (this.elements) and not create a new vector.

        // Don't delete the return statement.
        return this;
    };

    /**
      * Divide this vector by a scalar.
      * @return this
      */
    div(scalar) {
        this.elements[0] = this.elements[0] / scalar
        this.elements[1] = this.elements[1] / scalar
        this.elements[2] = this.elements[2] / scalar
        // Insert your code here.
        // This function should change this vector (this.elements) and not create a new vector.

        // Don't delete the return statement.
        return this;
    };

    /**
      * Multiply this vector by a scalar.
      * @return this
      */
    mul(scalar) {
        this.elements[0] = this.elements[0] * scalar
        this.elements[1] = this.elements[1] * scalar
        this.elements[2] = this.elements[2] * scalar
        // Insert your code here.
        // This function should change this vector (this.elements) and not create a new vector.

        // Don't delete the return statement.
        return this;
    };

    /**
      * Calcualte the dop product between this vector and other.
      * @return scalar
      */
    static dot(other1, other2) {

        // Insert your code here.
        let d = (other1.elements[0]*other2.elements[0]) + (other1.elements[1]*other2.elements[1]) + (other1.elements[2]*other2.elements[2])// Modify this line to calculate this vector's magnitude.

        // Don't delete the return statement.
        return d;
    }

    /**
      * Calcualte the cross product between this vector and other.
      * @return new vector
      */
    static cross(other1, other2) {
        // Insert your code here.
        // This function should create and return a new vector.
        let i = (other1.elements[1]*other2.elements[2]) - (other1.elements[2]*other2.elements[1]);
        let j = -((other1.elements[0]*other2.elements[2]) - (other1.elements[2]*other2.elements[0]));
        let k = (other1.elements[0]*other2.elements[1]) - (other1.elements[1]*other2.elements[0]);
        let v3 = new Vect3([i, j, k]); // Modify this line to calculate cross product between other1 and other2.

        // Don't delete the return statement.
        return v3;
    }

    /**
      * Calculate the magnitude (or length) of this vector.
      * @return scalar
      */
    magnitude() {
        // Insert your code here.
        let m = Math.sqrt(Math.pow(this.elements[0], 2) + Math.pow(this.elements[1], 2) + Math.pow(this.elements[2], 2)); // Modify this line to calculate this vector's magnitude.

        // Don't delete the return statement.
        return m;
    };

    /**
      * Normalize this vector.
      * @return this
      */
    normalize() {
        let mag = this.magnitude();
        this.elements[0] = this.elements[0] / mag;
        this.elements[1] = this.elements[1] / mag;
        this.elements[2] = this.elements[2] / mag;
        // Insert your code here.
        // This function should change this vector (this.elements) and not create a new vector.

        // Don't delete the return statement.
        return this;
    };
}