class Anchor {
    constructor() {
      this.matrix = new Matrix4();
    }
}

function anchor (sizeMat) {
  var bodyAnchor = new Anchor();
  bodyAnchor.matrix = sizeMat;
  bodyAnchor.matrix.translate(0, -.25, 0);
  bodyAnchor.matrix.rotate(90,1,0,0);
  bodyAnchor.matrix.rotate(180,1,0,0);
  bodyAnchor.matrix.rotate(-g_bodyXAngle,0,0,1);
  bodyAnchor.matrix.rotate(-g_bodyYAngle,1,0,0);
  bodyAnchor.matrix.rotate(-g_bodyZAngle,0,1,0);
  return bodyAnchor;
}