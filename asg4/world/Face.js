class Face {
    constructor() {
      this.type='sphere';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      //this.size = 5.0;
      this.segments = 10
      this.matrix = new Matrix4();

      this.buffer = null;
      this.vertices = null;
      this.textureNum = -2;
      this.normalMatrix = new Matrix4();
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
      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
  
      let angleStep = 360/this.segments;
      var v1 = [];
      var v2 = [];
      var v3 = [];
      var v4 = [];
      var v5 = [];
      var e1 = [];
      var e2 = [];
      var e3 = [];
      var e4 = [];
      var remaining = [];
    for (var angle = 0; angle < 360; angle = angle+angleStep) {
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        let centerPt = [0,0,0];
        let angle1 = angle;
        let angle2 = angle+angleStep;
        let vec1=[Math.cos(angle1*Math.PI/180)*.5, Math.sin(angle1*Math.PI/180)*.5];
        let vec2=[Math.cos(angle2*Math.PI/180)*.5, Math.sin(angle2*Math.PI/180)*.5];
        let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
        let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
        if (angle >= 180 && angle < 250) {
            v1 = [];
            gl.uniform4f(u_FragColor, 213/255, 191/255, 166/255, rgba[3]);
            v1=v1.concat([pt2[0],pt2[1],0, pt1[0],pt1[1],0, pt2[0],pt2[1],.5]);
            v1=v1.concat([pt2[0],pt2[1],.5, pt1[0],pt1[1],0, pt1[0],pt1[1],.5]);
            v1=v1.concat([pt2[0],pt2[1],0, pt1[0],pt1[1],0, pt2[0],pt2[1],-.5]);
            v1=v1.concat([pt2[0],pt2[1],-.5, pt1[0],pt1[1],0, pt1[0],pt1[1],-.5]);
            drawTriangle3D(v1);

            v2 = [];
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
            v2=v2.concat([pt2[0],pt2[1],0.5, pt1[0],pt1[1],0.5, pt2[0],pt2[1],.7]);
            v2=v2.concat([pt2[0],pt2[1],.7, pt1[0],pt1[1],0.5, pt1[0],pt1[1],.7]);
            v2=v2.concat([pt2[0],pt2[1],-0.5, pt1[0],pt1[1],-0.5, pt2[0],pt2[1],-.7]);
            v2=v2.concat([pt2[0],pt2[1],-.7, pt1[0],pt1[1],-0.5, pt1[0],pt1[1],-.7]);
            drawTriangle3D(v2);

            v3 = [];
            gl.uniform4f(u_FragColor, 158/255, 189/255, 106/255, rgba[3]);
            v3=v3.concat([pt2[0],pt2[1],0.7, pt1[0],pt1[1],0.7, pt2[0],pt2[1],.8]);
            v3=v3.concat([pt2[0],pt2[1],.8, pt1[0],pt1[1],0.7, pt1[0],pt1[1],.8]);
            v3=v3.concat([pt2[0],pt2[1],-0.7, pt1[0],pt1[1],-0.7, pt2[0],pt2[1],-.8]);
            v3=v3.concat([pt2[0],pt2[1],-.8, pt1[0],pt1[1],-0.7, pt1[0],pt1[1],-.8]);
            drawTriangle3D(v3);

            v4 = [];
            gl.uniform4f(u_FragColor, 74/255, 160/255, 66/255, rgba[3]);
            v4=v4.concat([pt2[0],pt2[1],0.8, pt1[0],pt1[1],0.8, pt2[0],pt2[1],.9]);
            v4=v4.concat([pt2[0],pt2[1],.9, pt1[0],pt1[1],0.8, pt1[0],pt1[1],.9]);
            v4=v4.concat([pt2[0],pt2[1],-0.8, pt1[0],pt1[1],-0.8, pt2[0],pt2[1],-.9]);
            v4=v4.concat([pt2[0],pt2[1],-.9, pt1[0],pt1[1],-0.8, pt1[0],pt1[1],-.9]);
            drawTriangle3D(v4);

            v5 = [];
            gl.uniform4f(u_FragColor, 60/255, 150/255, 59/255, rgba[3]);
            v5=v5.concat([pt2[0],pt2[1],0.9, pt1[0],pt1[1],0.9, pt2[0],pt2[1],1]);
            v5=v5.concat([pt2[0],pt2[1],1, pt1[0],pt1[1],0.9, pt1[0],pt1[1],1]);
            v5=v5.concat([pt2[0],pt2[1],-0.9, pt1[0],pt1[1],-0.9, pt2[0],pt2[1],-1]);
            v5=v5.concat([pt2[0],pt2[1],-1, pt1[0],pt1[1],-0.9, pt1[0],pt1[1],-1]);
            drawTriangle3D(v5);
        }
        else {
            e1 = [];
            e1=e1.concat([pt2[0],pt2[1],0, pt1[0],pt1[1],0, pt2[0],pt2[1],.7]);
            e1=e1.concat([pt2[0],pt2[1],.7, pt1[0],pt1[1],0, pt1[0],pt1[1],.7]);
            e1=e1.concat([pt2[0],pt2[1],0, pt1[0],pt1[1],0, pt2[0],pt2[1],-.7]);
            e1=e1.concat([pt2[0],pt2[1],-.7, pt1[0],pt1[1],0, pt1[0],pt1[1],-.7]);
            drawTriangle3D(e1);

            e2 = [];
            gl.uniform4f(u_FragColor, 158/255, 189/255, 106/255, rgba[3]);
            e2=e2.concat([pt2[0],pt2[1],0.7, pt1[0],pt1[1],0.7, pt2[0],pt2[1],.8]);
            e2=e2.concat([pt2[0],pt2[1],.8, pt1[0],pt1[1],0.7, pt1[0],pt1[1],.8]);
            e2=e2.concat([pt2[0],pt2[1],-0.7, pt1[0],pt1[1],-0.7, pt2[0],pt2[1],-.8]);
            e2=e2.concat([pt2[0],pt2[1],-.8, pt1[0],pt1[1],-0.7, pt1[0],pt1[1],-.8]);
            drawTriangle3D(e2);

            e3 = [];
            gl.uniform4f(u_FragColor, 74/255, 160/255, 66/255, rgba[3]);
            e3=e3.concat([pt2[0],pt2[1],0.8, pt1[0],pt1[1],0.8, pt2[0],pt2[1],.9]);
            e3=e3.concat([pt2[0],pt2[1],.9, pt1[0],pt1[1],0.8, pt1[0],pt1[1],.9]);
            e3=e3.concat([pt2[0],pt2[1],-0.8, pt1[0],pt1[1],-0.8, pt2[0],pt2[1],-.9]);
            e3=e3.concat([pt2[0],pt2[1],-.9, pt1[0],pt1[1],-0.8, pt1[0],pt1[1],-.9]);
            drawTriangle3D(e3);

            e4 = [];
            gl.uniform4f(u_FragColor, 60/255, 150/255, 59/255, rgba[3]);
            e4=e4.concat([pt2[0],pt2[1],0.9, pt1[0],pt1[1],0.9, pt2[0],pt2[1],1]);
            e4=e4.concat([pt2[0],pt2[1],1, pt1[0],pt1[1],0.9, pt1[0],pt1[1],1]);
            e4=e4.concat([pt2[0],pt2[1],-0.9, pt1[0],pt1[1],-0.9, pt2[0],pt2[1],-1]);
            e4=e4.concat([pt2[0],pt2[1],-1, pt1[0],pt1[1],-0.9, pt1[0],pt1[1],-1]);
            drawTriangle3D(e4);
        }
        remaining = [];
        gl.uniform4f(u_FragColor, 60/255, 150/255, 59/255, rgba[3]);
        remaining=remaining.concat([0,0,1, pt1[0],pt1[1],1, pt2[0],pt2[1],1]);
        remaining=remaining.concat([0,0,-1, pt1[0],pt1[1],-1, pt2[0],pt2[1],-1]);
        drawTriangle3D(remaining);
        
        }
    }
}