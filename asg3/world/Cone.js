class Cone {
    constructor() {
      this.type='sphere';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      //this.size = 5.0;
      this.segments = 6
      this.matrix = new Matrix4();
      this.vertices = [];
      this.vertices32 = null;
      this.textureNum = -2;
    }
  
    render() {
      //var xy   = this.position;
      var rgba = this.color;
      //var size = this.size;
  
      gl.uniform1i(u_whichTexture, this.textureNum);

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the Matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      var i = 1.0

      if (this.vertices.length > 0) {
        drawTriangle3D(this.vertices);
        return
      }

      let angleStep = 360/this.segments;
        for (var angle = 0; angle < 360; angle = angle+angleStep) {
            let centerPt = [0,0,0];
            let angle1 = angle;
            let angle2 = angle+angleStep;
            let vec1=[Math.cos(angle1*Math.PI/180)*.5, Math.sin(angle1*Math.PI/180)*.5];
            let vec2=[Math.cos(angle2*Math.PI/180)*.5, Math.sin(angle2*Math.PI/180)*.5];
            let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
            let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
            gl.uniform4f(u_FragColor, rgba[0]*i, rgba[1]*i, rgba[2]*i, rgba[3]);
            drawTriangle3D([0,0,0, pt1[0],pt1[1],0, pt2[0],pt2[1],0]);
            drawTriangle3D([pt2[0],pt2[1],0, pt1[0],pt1[1],0, 0,0,1]);
            this.vertices=this.vertices.concat([0,0,0, pt1[0],pt1[1],0, pt2[0],pt2[1],0])
            this.vertices=this.vertices.concat([pt2[0],pt2[1],0, pt1[0],pt1[1],0, 0,0,1])
            if (angle < 180) {
                i = i - 0.01;
            }
            else {
                i = i + 0.01;
            }
            
        }
    } 
}