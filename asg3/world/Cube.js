class Cube {
  constructor() {
    this.type='cube';
    //this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    //this.size = 5.0;
    //this.segments = segment
    this.matrix = new Matrix4();
    this.textureNum=-2;
    this.vertices= [
                   0,0,0, 1,1,0, 1,0,0,
                   0,0,0, 1,1,0, 0,1,0,
                   0,1,0, 1,1,1, 0,1,1,
                   0,1,0, 1,1,1, 1,1,0,
                   0,0,0, 0,1,1, 0,0,1,
                   0,0,0, 0,1,1, 0,1,0,
                   0,0,0, 1,0,1, 0,0,1,
                   0,0,0, 1,0,1, 1,0,0,
                   0,0,1, 1,1,1, 1,0,1,
                   0,0,1, 1,1,1, 0,1,1,
                   1,0,1, 1,1,0, 1,0,0,
                   1,0,1, 1,1,0, 1,1,1];
    this.vertices32= new Float32Array([
                   0,0,0, 1,1,0, 1,0,0,
                   0,0,0, 1,1,0, 0,1,0,
                   0,1,0, 1,1,1, 0,1,1,
                   0,1,0, 1,1,1, 1,1,0,
                   0,0,0, 0,1,1, 0,0,1,
                   0,0,0, 0,1,1, 0,1,0,
                   0,0,0, 1,0,1, 0,0,1,
                   0,0,0, 1,0,1, 1,0,0,
                   0,0,1, 1,1,1, 1,0,1,
                   0,0,1, 1,1,1, 0,1,1,
                   1,0,1, 1,1,0, 1,0,0,
                   1,0,1, 1,1,0, 1,1,1]);               
    this.uv= [
              0,0, 1,1, 1,0,
              0,0, 1,1, 0,1,
              0,0, 1,1, 1,0,
              0,0, 1,1, 0,1,
              0,0, 1,1, 1,0,
              0,0, 1,1, 0,1,
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

    //Front of cube

    //Front of cube

    drawTriangle3DUV(this.vertices, this.uv);
  }

  renderfast() {
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    drawTriangle3DUV( this.vertices, this.uv);
    return;
  }
}