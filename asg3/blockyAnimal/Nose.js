class Nose {
    constructor() {
      this.type='cube';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      //this.size = 5.0;
      //this.segments = segment
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

      drawTriangle3D( [0,0,1, 0,1,0, 1,0,0] );
      drawTriangle3D( [0,0,1, 0,-1,0, 1,0,0] );
      gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
      drawTriangle3D( [1,0,0, 0,-1,0, 0,1,0] );
    }
}