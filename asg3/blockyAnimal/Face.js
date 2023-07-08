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
    }
  
    render() {
      //var xy   = this.position;
      var rgba = this.color;
      //var size = this.size;
  
      // Pass the position of a point to a_Position variable
      //gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the Matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      let angleStep = 360/this.segments;
    
    for (var angle = 0; angle < 360; angle = angle+angleStep) {
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        let centerPt = [0,0,0];
        let angle1 = angle;
        let angle2 = angle+angleStep;
        let vec1=[Math.cos(angle1*Math.PI/180)*.5, Math.sin(angle1*Math.PI/180)*.5];
        let vec2=[Math.cos(angle2*Math.PI/180)*.5, Math.sin(angle2*Math.PI/180)*.5];
        let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
        let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
        //drawTriangle3D([0,0,0, pt1[0],pt1[1],0, pt2[0],pt2[1],0]);
        if (angle >= 180 && angle < 250) {
            gl.uniform4f(u_FragColor, 213/255, 191/255, 166/255, rgba[3]);
            drawTriangle3D([pt2[0],pt2[1],0, pt1[0],pt1[1],0, pt2[0],pt2[1],.5]);
            drawTriangle3D([pt2[0],pt2[1],.5, pt1[0],pt1[1],0, pt1[0],pt1[1],.5]);
            //gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
            drawTriangle3D([pt2[0],pt2[1],0, pt1[0],pt1[1],0, pt2[0],pt2[1],-.5]);
            drawTriangle3D([pt2[0],pt2[1],-.5, pt1[0],pt1[1],0, pt1[0],pt1[1],-.5]);

            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
            drawTriangle3D([pt2[0],pt2[1],0.5, pt1[0],pt1[1],0.5, pt2[0],pt2[1],.7]);
            drawTriangle3D([pt2[0],pt2[1],.7, pt1[0],pt1[1],0.5, pt1[0],pt1[1],.7]);
            drawTriangle3D([pt2[0],pt2[1],-0.5, pt1[0],pt1[1],-0.5, pt2[0],pt2[1],-.7]);
            drawTriangle3D([pt2[0],pt2[1],-.7, pt1[0],pt1[1],-0.5, pt1[0],pt1[1],-.7]);

            gl.uniform4f(u_FragColor, 158/255, 189/255, 106/255, rgba[3]);

            drawTriangle3D([pt2[0],pt2[1],0.7, pt1[0],pt1[1],0.7, pt2[0],pt2[1],.8]);
            drawTriangle3D([pt2[0],pt2[1],.8, pt1[0],pt1[1],0.7, pt1[0],pt1[1],.8]);
            drawTriangle3D([pt2[0],pt2[1],-0.7, pt1[0],pt1[1],-0.7, pt2[0],pt2[1],-.8]);
            drawTriangle3D([pt2[0],pt2[1],-.8, pt1[0],pt1[1],-0.7, pt1[0],pt1[1],-.8]);

            gl.uniform4f(u_FragColor, 74/255, 160/255, 66/255, rgba[3]);

            drawTriangle3D([pt2[0],pt2[1],0.8, pt1[0],pt1[1],0.8, pt2[0],pt2[1],.9]);
            drawTriangle3D([pt2[0],pt2[1],.9, pt1[0],pt1[1],0.8, pt1[0],pt1[1],.9]);
            drawTriangle3D([pt2[0],pt2[1],-0.8, pt1[0],pt1[1],-0.8, pt2[0],pt2[1],-.9]);
            drawTriangle3D([pt2[0],pt2[1],-.9, pt1[0],pt1[1],-0.8, pt1[0],pt1[1],-.9]);

            gl.uniform4f(u_FragColor, 60/255, 150/255, 59/255, rgba[3]);

            drawTriangle3D([pt2[0],pt2[1],0.9, pt1[0],pt1[1],0.9, pt2[0],pt2[1],1]);
            drawTriangle3D([pt2[0],pt2[1],1, pt1[0],pt1[1],0.9, pt1[0],pt1[1],1]);
            drawTriangle3D([pt2[0],pt2[1],-0.9, pt1[0],pt1[1],-0.9, pt2[0],pt2[1],-1]);
            drawTriangle3D([pt2[0],pt2[1],-1, pt1[0],pt1[1],-0.9, pt1[0],pt1[1],-1]);
        }
        else {
            drawTriangle3D([pt2[0],pt2[1],0, pt1[0],pt1[1],0, pt2[0],pt2[1],.7]);
            drawTriangle3D([pt2[0],pt2[1],.7, pt1[0],pt1[1],0, pt1[0],pt1[1],.7]);
            drawTriangle3D([pt2[0],pt2[1],0, pt1[0],pt1[1],0, pt2[0],pt2[1],-.7]);
            drawTriangle3D([pt2[0],pt2[1],-.7, pt1[0],pt1[1],0, pt1[0],pt1[1],-.7]);

            gl.uniform4f(u_FragColor, 158/255, 189/255, 106/255, rgba[3]);

            drawTriangle3D([pt2[0],pt2[1],0.7, pt1[0],pt1[1],0.7, pt2[0],pt2[1],.8]);
            drawTriangle3D([pt2[0],pt2[1],.8, pt1[0],pt1[1],0.7, pt1[0],pt1[1],.8]);
            drawTriangle3D([pt2[0],pt2[1],-0.7, pt1[0],pt1[1],-0.7, pt2[0],pt2[1],-.8]);
            drawTriangle3D([pt2[0],pt2[1],-.8, pt1[0],pt1[1],-0.7, pt1[0],pt1[1],-.8]);

            gl.uniform4f(u_FragColor, 74/255, 160/255, 66/255, rgba[3]);

            drawTriangle3D([pt2[0],pt2[1],0.8, pt1[0],pt1[1],0.8, pt2[0],pt2[1],.9]);
            drawTriangle3D([pt2[0],pt2[1],.9, pt1[0],pt1[1],0.8, pt1[0],pt1[1],.9]);
            drawTriangle3D([pt2[0],pt2[1],-0.8, pt1[0],pt1[1],-0.8, pt2[0],pt2[1],-.9]);
            drawTriangle3D([pt2[0],pt2[1],-.9, pt1[0],pt1[1],-0.8, pt1[0],pt1[1],-.9]);

            gl.uniform4f(u_FragColor, 60/255, 150/255, 59/255, rgba[3]);

            drawTriangle3D([pt2[0],pt2[1],0.9, pt1[0],pt1[1],0.9, pt2[0],pt2[1],1]);
            drawTriangle3D([pt2[0],pt2[1],1, pt1[0],pt1[1],0.9, pt1[0],pt1[1],1]);
            drawTriangle3D([pt2[0],pt2[1],-0.9, pt1[0],pt1[1],-0.9, pt2[0],pt2[1],-1]);
            drawTriangle3D([pt2[0],pt2[1],-1, pt1[0],pt1[1],-0.9, pt1[0],pt1[1],-1]);
        }
        gl.uniform4f(u_FragColor, 60/255, 150/255, 59/255, rgba[3]);
        drawTriangle3D([0,0,1, pt1[0],pt1[1],1, pt2[0],pt2[1],1]);
        drawTriangle3D([0,0,-1, pt1[0],pt1[1],-1, pt2[0],pt2[1],-1]);
        
        }
    }
}