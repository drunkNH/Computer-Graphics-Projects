class Anchor {
    constructor() {
      this.matrix = new Matrix4();
    }
}

function anchor (sizeMat) {
  var bodyAnchor = new Anchor();
  bodyAnchor.matrix = sizeMat;
  bodyAnchor.matrix.translate(-40*Math.cos((g_seconds+17)*g_speed/4), -7, -40*Math.sin((g_seconds+17)*g_speed/4));
  bodyAnchor.matrix.rotate(-14.5*(g_seconds+17)%360,0,1,0);
  bodyAnchor.matrix.rotate(90,1,0,0);
  bodyAnchor.matrix.rotate(180,1,0,0);
  bodyAnchor.matrix.rotate(-g_bodyXAngle,0,0,1);
  bodyAnchor.matrix.rotate(-g_bodyYAngle,1,0,0);
  bodyAnchor.matrix.rotate(-g_bodyZAngle,0,1,0);
  return bodyAnchor;
}