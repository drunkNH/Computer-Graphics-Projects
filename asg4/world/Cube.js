class Cube {
  constructor() {
    this.type='cube';
    //this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    //this.size = 5.0;
    //this.segments = segment
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.textureNum=-2;
    this.vertices= [
                   0,0,0, 1,1,0, 1,0,0, //front
                   0,0,0, 1,1,0, 0,1,0,

                   0,1,0, 1,1,1, 0,1,1, //top
                   0,1,0, 1,1,1, 1,1,0,

                   0,0,0, 0,1,1, 0,0,1, //right
                   0,0,0, 0,1,1, 0,1,0, 

                   0,0,0, 1,0,1, 0,0,1, //bottom
                   0,0,0, 1,0,1, 1,0,0,

                   0,0,1, 1,1,1, 1,0,1, //back
                   0,0,1, 1,1,1, 0,1,1,

                   1,0,1, 1,1,0, 1,0,0, //left
                   1,0,1, 1,1,0, 1,1,1];       
    this.normals= [
                    0,0,-1, 0,0,-1, 0,0,-1,//front
                    0,0,-1, 0,0,-1, 0,0,-1,
              
                    0,1,0, 0,1,0, 0,1,0, //top
                    0,1,0, 0,1,0, 0,1,0,
              
                    -1,0,0, -1,0,0, -1,0,0, //right
                    -1,0,0, -1,0,0, -1,0,0,
              
                    0,-1,0, 0,-1,0, 0,-1,0,//bottom
                    0,-1,0, 0,-1,0, 0,-1,0,
              
                    0,0,1, 0,0,1, 0,0,1,//back
                    0,0,1, 0,0,1, 0,0,1,
                    
                    1,0,0, 1,0,0, 1,0,0,//left
                    1,0,0, 1,0,0, 1,0,0,
                  ]   
    this.uv= [
              0,0, 1,1, 1,0,
              0,0, 1,1, 0,1,
              0,0, 1,1, 1,0,
              0,0, 1,1, 0,1,
              0,0, 1,1, 1,0, //
              0,0, 1,1, 0,1, //
              0,0, 1,1, 1,0,
              0,0, 1,1, 0,1,
              0,0, 1,1, 1,0,
              0,0, 1,1, 0,1,
              0,0, 1,1, 1,0,
              0,0, 1,1, 0,1]
    

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

    //Front of cube

    //Front of cube

    drawTriangle3D(this.vertices);
  }

  renderUV() {
    //var xy   = this.position;
    var rgba = this.color;
    //var size = this.size;
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the Matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

    //Front of cube

    //Front of cube

    drawTriangle3DUV(this.vertices, this.uv);
  }

  renderUVNormal() {
    //var xy   = this.position;
    var rgba = this.color;
    //var size = this.size;
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the Matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

    //Front of cube

    //Front of cube

    drawTriangle3DUVNormal(this.vertices, this.uv, this.normals);
  }

  renderfast() {
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
    drawTriangle3DUVNormal( this.vertices, this.uv, this.normals);
    return;
  }
}