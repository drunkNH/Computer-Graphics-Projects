class Camera {
    constructor() {
        this.fov=60.0;
        this.eye = new Vect3([-0.0000464479235233739, -6.5, 44]);
        this.at = new Vect3([-0.00004423611972015351, -6.5, 43]);
        this.up=new Vect3([0,1,0]);
        this.speed = 1;
    }

    moveForward() {
        let v = new Vect3([0,0,0]);
        v.add(this.at);
        v.sub(this.eye);
        v.normalize();
        v.mul(this.speed);
        this.eye.add(v);
        this.at.add(v);
    }

    moveBackward() {
        let v = new Vect3([0,0,0]);
        v.set(this.at);
        v.sub(this.eye);
        v.normalize();
        v.mul(this.speed);
        this.eye.sub(v);
        this.at.sub(v);
    }

    moveLeft() {
        let v = new Vect3([0,0,0]);
        v.set(this.eye);
        v.sub(this.at);
        let s = Vect3.cross(v, this.up);
        s.normalize();
        s.mul(this.speed);
        this.eye.add(s);
        this.at.add(s);
    }

    moveRight() {
        let v = new Vect3([0,0,0]);
        v.set(this.at);
        v.sub(this.eye);
        let s = Vect3.cross(v, this.up);
        s.normalize();
        s.mul(this.speed);
        this.eye.add(s);
        this.at.add(s);
    }

    panLeft() {
        let v = new Vect3([0,0,0]);
        v.set(this.at);
        v.sub(this.eye);
        let rotationMatrix=new Matrix4()
        rotationMatrix.setRotate(5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let v_prime = rotationMatrix.multiplyVector3(v);
        this.at.set(this.eye);
        this.at.add(v_prime);
    }

    panRight() {
        let v = new Vect3([0,0,0]);
        v.set(this.at);
        v.sub(this.eye);
        let rotationMatrix=new Matrix4()
        rotationMatrix.setRotate(-5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let v_prime = rotationMatrix.multiplyVector3(v);
        this.at.set(this.eye);
        this.at.add(v_prime);
    }
    
    onMoveX(degrees) {
        let v = new Vect3([0,0,0]);
        v.set(this.at);
        v.sub(this.eye);
        let rotationMatrix=new Matrix4()
        rotationMatrix.setRotate(degrees, 0, 1, 0);
        let v_prime = rotationMatrix.multiplyVector3(v);
        this.at.set(this.eye);
        this.at.add(v_prime);
    }
    onMoveY(degrees) {
        this.at.elements[1] += degrees
    }
}