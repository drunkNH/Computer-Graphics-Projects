// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor; // Use color
    }
    else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0); // Use UV debug color
    }
    else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); // Use texture0
    }
    else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV); // Use texture0
    }
    else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV); // Use texture0
    }
    else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV); // Use texture0
    }
    else if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler4, v_UV); // Use texture0
    }
    else {
      gl_FragColor = vec4(1,.2,.2,1); //Use redish error color
    }
    
    
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_whichTexture;
let u_ProjectionMatrix;
let u_ViewMatrix

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true}); //magic flag!
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;


//Globals related UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_selectedSegments=10;
let g_globalXAngle=0;
let g_globalYAngle=0;
let g_globalZAngle=0;
let g_degreesX=0;
let g_degreesY=0;
let g_origin=[0,0]

let g_idleAnimation=false;
let g_headAnimation=true;

//Body part angles
let g_headXAngle=0;
let g_headYAngle=0;
let g_headZAngle=0;

let g_bodyXAngle=0;
let g_bodyYAngle=0;
let g_bodyZAngle=0;

let g_pelvisAngle=0;

//Left Stuff
let g_leftArmXAngle=0;
let g_leftArmYAngle=0;
let g_leftArmZAngle=0;

let g_leftForeArmXAngle=0;
let g_leftForeArmYAngle=0;
let g_leftForeArmZAngle=0;

let g_leftLegXAngle=0;
let g_leftLegYAngle=0;
let g_leftLegZAngle=0;

let g_leftCalfXAngle=0;
let g_leftCalfYAngle=0;
let g_leftCalfZAngle=0;

//Right Stuff
let g_rightArmXAngle=0;
let g_rightArmYAngle=0;
let g_rightArmZAngle=0;

let g_rightForeArmXAngle=0;
let g_rightForeArmYAngle=0;
let g_rightForeArmZAngle=0;

let g_rightLegXAngle=0;
let g_rightLegYAngle=0;
let g_rightLegZAngle=0;

let g_rightCalfXAngle=0;
let g_rightCalfYAngle=0;
let g_rightCalfZAngle=0;

let g_leftHandXAngle=0;
let g_leftHandYAngle=0;
let g_leftHandZAngle=0;

let g_rightHandXAngle=0;
let g_rightHandYAngle=0;
let g_rightHandZAngle=0;

let g_leftFootXAngle=0;
let g_leftFootYAngle=0;
let g_leftFootZAngle=0;

let g_rightFootXAngle=0;
let g_rightFootYAngle=0;
let g_rightFootZAngle=0;

let g_katamariAngle=0;

let g_ballVisible = false;

let g_speed = 1;

let g_size=.1;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI(){
  /*
  document.getElementById('resetButton').onclick = function() {g_idleAnimation=false; g_headAnimation=false; reset();};
  document.getElementById('resetCamButton').onclick = function() {resetCam();};
  document.getElementById('ballOn').onclick = function() {g_ballVisible = true; if (g_size>.6) {g_size=.6}};
  document.getElementById('ballOff').onclick = function() {g_ballVisible = false;};


  document.getElementById('animationIdleOffButton').onclick = function() {g_idleAnimation=false;};
  document.getElementById('animationIdleOnButton').onclick = function() {reset(); g_headAnimation=false; g_idleAnimation=true;};
  document.getElementById('speedSlide').addEventListener('input',  function() { g_speed = this.value;});

  document.getElementById('sizeSlide').addEventListener('input',  function() { g_size = this.value/100; renderAllShapes();});
  document.getElementById('headXSlide').addEventListener('input',  function() { g_headXAngle = this.value; renderAllShapes();});
  document.getElementById('headYSlide').addEventListener('input',  function() { g_headYAngle = this.value; renderAllShapes();});
  document.getElementById('headZSlide').addEventListener('input',  function() { g_headZAngle = this.value; renderAllShapes();});

  document.getElementById('bodyXSlide').addEventListener('input',  function() { g_bodyXAngle = this.value; renderAllShapes();});
  document.getElementById('bodyYSlide').addEventListener('input',  function() { g_bodyYAngle = this.value; renderAllShapes();});
  document.getElementById('bodyZSlide').addEventListener('input',  function() { g_bodyZAngle = this.value; renderAllShapes();});

  document.getElementById('pelvisSlide').addEventListener('input',  function() { g_pelvisAngle = this.value; renderAllShapes();});

  document.getElementById('LeftArmXSlide').addEventListener('input',  function() { g_leftArmXAngle = this.value; renderAllShapes();});
  document.getElementById('LeftArmYSlide').addEventListener('input',  function() { g_leftArmYAngle = this.value; renderAllShapes();});
  document.getElementById('LeftArmZSlide').addEventListener('input',  function() { g_leftArmZAngle = this.value; renderAllShapes();});

  document.getElementById('LeftForeArmXSlide').addEventListener('input',  function() { g_leftForeArmXAngle = this.value; renderAllShapes();});
  document.getElementById('LeftForeArmYSlide').addEventListener('input',  function() { g_leftForeArmYAngle = this.value; renderAllShapes();});
  document.getElementById('LeftForeArmZSlide').addEventListener('input',  function() { g_leftForeArmZAngle = this.value; renderAllShapes();});

  document.getElementById('RightArmXSlide').addEventListener('input',  function() { g_rightArmXAngle = this.value; renderAllShapes();});
  document.getElementById('RightArmYSlide').addEventListener('input',  function() { g_rightArmYAngle = this.value; renderAllShapes();});
  document.getElementById('RightArmZSlide').addEventListener('input',  function() { g_rightArmZAngle = this.value; renderAllShapes();});
  
  document.getElementById('RightForeArmXSlide').addEventListener('input',  function() { g_rightForeArmXAngle = this.value; renderAllShapes();});
  document.getElementById('RightForeArmYSlide').addEventListener('input',  function() { g_rightForeArmYAngle = this.value; renderAllShapes();});
  document.getElementById('RightForeArmZSlide').addEventListener('input',  function() { g_rightForeArmZAngle = this.value; renderAllShapes();});

  document.getElementById('LeftLegXSlide').addEventListener('input',  function() { g_leftLegXAngle = this.value; renderAllShapes();});
  document.getElementById('LeftLegYSlide').addEventListener('input',  function() { g_leftLegYAngle = this.value; renderAllShapes();});
  document.getElementById('LeftLegZSlide').addEventListener('input',  function() { g_leftLegZAngle = this.value; renderAllShapes();});

  document.getElementById('LeftCalfXSlide').addEventListener('input',  function() { g_leftCalfXAngle = this.value; renderAllShapes();});
  document.getElementById('LeftCalfYSlide').addEventListener('input',  function() { g_leftCalfYAngle = this.value; renderAllShapes();});
  document.getElementById('LeftCalfZSlide').addEventListener('input',  function() { g_leftCalfZAngle = this.value; renderAllShapes();});

  document.getElementById('rightLegXSlide').addEventListener('input',  function() { g_rightLegXAngle = this.value; renderAllShapes();});
  document.getElementById('rightLegYSlide').addEventListener('input',  function() { g_rightLegYAngle = this.value; renderAllShapes();});
  document.getElementById('rightLegZSlide').addEventListener('input',  function() { g_rightLegZAngle = this.value; renderAllShapes();});

  document.getElementById('rightCalfXSlide').addEventListener('input',  function() { g_rightCalfXAngle = this.value; renderAllShapes();});
  document.getElementById('rightCalfYSlide').addEventListener('input',  function() { g_rightCalfYAngle = this.value; renderAllShapes();});
  document.getElementById('rightCalfZSlide').addEventListener('input',  function() { g_rightCalfZAngle = this.value; renderAllShapes();});

  document.getElementById('LeftHandXSlide').addEventListener('input',  function() { g_rightHandXAngle = this.value; renderAllShapes();});
  document.getElementById('LeftHandYSlide').addEventListener('input',  function() { g_rightHandYAngle = this.value; renderAllShapes();});
  document.getElementById('LeftHandZSlide').addEventListener('input',  function() { g_rightHandZAngle = this.value; renderAllShapes();});

  document.getElementById('RightHandXSlide').addEventListener('input',  function() { g_leftHandXAngle = this.value; renderAllShapes();});
  document.getElementById('RightHandYSlide').addEventListener('input',  function() { g_leftHandXAngle = this.value; renderAllShapes();});
  document.getElementById('RightHandZSlide').addEventListener('input',  function() { g_leftHandXAngle = this.value; renderAllShapes();});

  document.getElementById('leftFootXSlide').addEventListener('input',  function() { g_rightFootXAngle = this.value; renderAllShapes();});
  document.getElementById('leftFootYSlide').addEventListener('input',  function() { g_rightFootYAngle = this.value; renderAllShapes();});
  document.getElementById('leftFootZSlide').addEventListener('input',  function() { g_rightFootZAngle = this.value; renderAllShapes();});

  document.getElementById('rightFootXSlide').addEventListener('input',  function() { g_leftFootXAngle = this.value; renderAllShapes();});
  document.getElementById('rightFootYSlide').addEventListener('input',  function() { g_leftFootXAngle = this.value; renderAllShapes();});
  document.getElementById('rightFootZSlide').addEventListener('input',  function() { g_leftFootXAngle = this.value; renderAllShapes();});

  document.getElementById('xAngleSlide').addEventListener('input',  function() { g_globalXAngle = this.value; renderAllShapes();});
  document.getElementById('yAngleSlide').addEventListener('input',  function() { g_globalYAngle = this.value; renderAllShapes();});
  document.getElementById('zAngleSlide').addEventListener('input',  function() { g_globalZAngle = this.value; renderAllShapes();});
*/
}

function initTextures() {
  var grass = new Image();  // Create the image object
  var sky = new Image();  // Create the image object
  var brick = new Image();  // Create the image object
  var dirt = new Image();  // Create the image object
  var cobble = new Image();  // Create the image object
  if (!grass || !sky || !brick || !dirt || !cobble) {
    console.log('Failed to create the image object');
    return false;
  }
  var grassTex = gl.createTexture();   // Create a texture object
  var skyTex = gl.createTexture();   // Create a texture object
  var brickTex = gl.createTexture();   // Create a texture object
  var dirtTex = gl.createTexture();   // Create a texture object
  var cobbleTex = gl.createTexture();   // Create a texture object
  if (!grassTex || !skyTex || !brickTex || !dirtTex || !cobbleTex) {
    console.log('Failed to create the texture object');
    return false;
  }
  
  // Register the event handler to be called on loading an image
  grass.onload = function(){ sendTextureTEXTURE0(0, grass, grassTex, u_Sampler0); };
  // Tell the browser to load an image
  grass.src = '../resources/grass.jpg';

  // Register the event handler to be called on loading an image
  sky.onload = function(){ sendTextureTEXTURE0(1, sky, skyTex, u_Sampler1); };
  // Tell the browser to load an image
  sky.src = '../resources/sky.jpg';

  // Register the event handler to be called on loading an image
  brick.onload = function(){ sendTextureTEXTURE0(2, brick, brickTex, u_Sampler2); };
  // Tell the browser to load an image
  brick.src = '../resources/brick.jpg';

  // Register the event handler to be called on loading an image
  dirt.onload = function(){ sendTextureTEXTURE0(3, dirt, dirtTex, u_Sampler3); };
  // Tell the browser to load an image
  dirt.src = '../resources/dirt.jpg';

  // Register the event handler to be called on loading an image
  cobble.onload = function(){ sendTextureTEXTURE0(4, cobble, cobbleTex, u_Sampler4); };
  // Tell the browser to load an image
  cobble.src = '../resources/cobble.jpg';

  // Can add more textures here
  return true;
}

function sendTextureTEXTURE0(n, image, texture, u_Sampler) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  if (n == 0) {
    gl.activeTexture(gl.TEXTURE0);
  }
  else if (n == 1) {
    gl.activeTexture(gl.TEXTURE1);
  }
  else if (n == 2) {
    gl.activeTexture(gl.TEXTURE2);
  }
  else if (n == 3) {
    gl.activeTexture(gl.TEXTURE3);
  }
  else if (n == 4) {
    gl.activeTexture(gl.TEXTURE4);
  }
  
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, n);
  
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log('finished loading textures')
}

function main() {

  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();
  
  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  initTextures();

  // Register function (event handler) to be called on a mouse press
  canvas.onclick = function(ev) {if(ev.shiftKey) {if (g_headAnimation){g_headAnimation = false} else{g_idleAnimation = false; reset(); g_headAnimation = true}}}
  canvas.onmousedown = origin;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };
  canvas.onmouseup = function() {g_origin = [0,0]}

  document.onkeydown = keydown;

  // Specify the color for clearing <canvas>
  gl.clearColor(2/255, 8/255, 9/255, 1.0);

  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

// Called by browser repeatedly whenever its time
function tick() {
  g_seconds=performance.now()/1000.0-g_startTime;
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}

var g_shapesList = [];
function origin(ev) {
  var x = ev.clientX;
  var y = ev.clientY;
  g_origin = [x, y];
}

function click(ev) {
  // Extract the event click and return it in WebGL Coordinates
  let coordinates = convertCoordinatesEventToGL(ev);
  g_degreesX = -coordinates[0]*180
  g_degreesY = -coordinates[1]*3
  g_camera.onMoveX(g_degreesX)
  g_camera.onMoveY(g_degreesY)
  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

var blockChoose = 2;

function keydown(ev) {
  if (ev.keyCode==87) { //w
    g_camera.moveForward();
  } else
  if (ev.keyCode==83) { //s
    g_camera.moveBackward();
  } else
  if (ev.keyCode==65) { //a
    g_camera.moveLeft();
  } else
  if (ev.keyCode==68) { //d
    g_camera.moveRight();
  } else
  if (ev.keyCode==81) { //q
    g_camera.panLeft();
  }
  if (ev.keyCode==69) { //e
    g_camera.panRight();
  } else
  if (ev.keyCode==67) { //c
    let leftRight = Math.round((g_camera.at.elements[0] + 44) / 2.75);
    let forwardBackwards = Math.round((g_camera.at.elements[2] + 44) / 2.75);
    if (g_map[leftRight][forwardBackwards] != 4) {
      g_map[leftRight][forwardBackwards] += 1
      g_texMap[leftRight][forwardBackwards] = blockChoose
    }
    
  } else
  if (ev.keyCode==88) { //x
    let leftRight = Math.round((g_camera.at.elements[0] + 44) / 2.75);
    let forwardBackwards = Math.round((g_camera.at.elements[2] + 44) / 2.75);
    if (g_map[leftRight][forwardBackwards] != 0) {
      g_map[leftRight][forwardBackwards] -= 1
    }
    
  } else
  if (ev.keyCode==86) { //v
    if (blockChoose == 4) {
      blockChoose = 2;
    }
    else {
      blockChoose += 1
    }
  }
  renderAllShapes();
}

// Extract the event click and return it in WebGL Coordinates
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  let temp = [x,y];
  x = (x - g_origin[0])/400;
  y = (y - g_origin[1])/400;
  g_origin = temp;
  return([x,y])
}

function updateAnimationAngles() {
  if (g_idleAnimation) {
    g_headXAngle = (30*Math.sin(1.5*g_seconds*g_speed));
    g_headYAngle = 10;
    g_bodyXAngle = (30*Math.sin(1.5*g_seconds*g_speed));
    g_pelvisAngle = (-30*Math.sin(1.5*g_seconds*g_speed));
    g_leftArmYAngle = 55;
    g_rightArmYAngle = 55;

    g_leftArmYXngle = Math.abs(45*Math.cos(g_seconds*g_speed));
    g_rightArmXAngle = Math.abs(45*Math.sin(g_seconds*g_speed));

    g_leftForeArmXAngle = Math.abs(45*Math.cos(g_seconds*g_speed/2));
    g_rightForeArmXAngle = Math.abs(-45*Math.sin(g_seconds*g_speed/2));

    g_leftLegXAngle = 10;
    g_leftCalfXAngle = -10;
    g_leftLegYAngle = -(-10*Math.sin(1.5*g_seconds*g_speed));
    g_leftCalfYAngle = (-20*Math.sin(1.5*g_seconds*g_speed));

    g_rightLegXAngle = 10;
    g_rightCalfXAngle = -10;
    g_rightLegYAngle = -(-10*Math.sin(1.5*g_seconds*g_speed));
    g_rightCalfYAngle = (-20*Math.sin(1.5*g_seconds*g_speed));
    
  }
  if (g_headAnimation) {
    g_headXAngle = (10*Math.sin(6*g_seconds*g_speed));
    g_bodyXAngle = (10*Math.sin(6*g_seconds*g_speed));
    g_pelvisAngle = (-10*Math.sin(6*g_seconds*g_speed));

    g_leftArmXAngle = 60;
    g_rightArmXAngle = 60;

    g_leftArmYAngle = (-25*Math.sin(6*g_seconds*g_speed));
    g_rightArmYAngle = (25*Math.sin(6*g_seconds*g_speed));

    g_leftForeArmYAngle = -50
    g_rightForeArmYAngle = -50

    g_leftLegXAngle = (45*Math.sin(6*g_seconds*g_speed));
    g_leftCalfXAngle = -Math.abs(45*Math.sin(6*g_seconds*g_speed));
    g_rightLegXAngle = (-45*Math.sin(6*g_seconds*g_speed));
    g_rightCalfXAngle = -Math.abs(45*Math.sin(6*g_seconds*g_speed));

    g_katamariAngle = g_seconds*g_speed*200
  }
}

var g_map=[
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 y  x
    [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)], //0
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //Math.floor(Math.random() * 5)
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //Math.floor(Math.random() * 5)
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //3
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //Math.floor(Math.random() * 5)
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //5
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //6
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //7
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //8
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //9
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //10
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //11
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //12
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //13
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //14
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //15
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //16
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //17
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //18
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //19
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //20
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //21
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //22
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //23
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //24
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //25
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //26
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //27
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //28
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //29
    [Math.floor(Math.random() * 5), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 5)], //30
    [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)]  //31
  ]

var g_texMap=[
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 y  x
    [Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2], //0
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 2
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 2
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //3
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //4
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //5
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //6
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //7
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //8
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //9
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //10
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //11
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //1Math.floor(Math.random() * 3) + 2
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //13
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //14
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //15
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //16
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //17
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //18
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //19
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 20
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 21
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 2Math.floor(Math.random() * 3) + 2
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 23
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 24
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 25
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 26
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 27
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 28
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //Math.floor(Math.random() * 3) + 29
    [Math.floor(Math.random() * 3) + 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.floor(Math.random() * 3) + 2], //30
    [Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2, Math.floor(Math.random() * 3) + 2]  //31
  ]
let wall = new Cube();
let wall2 = new Cube();
let wall3 = new Cube();
let wall4 = new Cube();
wall.textureNum=2
wall2.textureNum=2
wall3.textureNum=2
wall4.textureNum=2

let dirt1 = new Cube();
let dirt2 = new Cube();
let dirt3 = new Cube();
let dirt4 = new Cube();
dirt1.textureNum=3
dirt2.textureNum=3
dirt3.textureNum=3
dirt4.textureNum=3

let cobble1 = new Cube();
let cobble2 = new Cube();
let cobble3 = new Cube();
let cobble4 = new Cube();
cobble1.textureNum=4
cobble2.textureNum=4
cobble3.textureNum=4
cobble4.textureNum=4
function drawMap() {
  for (x=0;x<32;x++) {
    for (y=0;y<32;y++) {
      if (g_map[x][y]!=0) {
        if (g_texMap[x][y] == 2) {
          if (g_map[x][y]>=1) {
            wall.matrix.setIdentity();
            wall.matrix.translate(0,-.75,0);
            wall.matrix.scale(.3,.3,.3)
            wall.matrix.translate(x-16,0, y-16);
            wall.renderfast();
          }
          if (g_map[x][y]>=2) {
            wall2.matrix.setIdentity();
            wall2.matrix.translate(0,-.45,0);
            wall2.matrix.scale(.3,.3,.3)
            wall2.matrix.translate(x-16,0, y-16);
            wall2.renderfast();
          }
          if (g_map[x][y]>=3) {
            wall3.matrix.setIdentity();
            wall3.matrix.translate(0,-.15,0);
            wall3.matrix.scale(.3,.3,.3)
            wall3.matrix.translate(x-16,0, y-16);
            wall3.renderfast();
          }
          if (g_map[x][y]>=4) {
            wall4.matrix.setIdentity();
            wall4.matrix.translate(0,.15,0);
            wall4.matrix.scale(.3,.3,.3)
            wall4.matrix.translate(x-16,0, y-16);
            wall4.renderfast();
          }
        }
        if (g_texMap[x][y] == 3) {
          if (g_map[x][y]>=1) {
            dirt1.matrix.setIdentity();
            dirt1.matrix.translate(0,-.75,0);
            dirt1.matrix.scale(.3,.3,.3)
            dirt1.matrix.translate(x-16,0, y-16);
            dirt1.renderfast();
          }
          if (g_map[x][y]>=2) {
            dirt2.matrix.setIdentity();
            dirt2.matrix.translate(0,-.45,0);
            dirt2.matrix.scale(.3,.3,.3)
            dirt2.matrix.translate(x-16,0, y-16);
            dirt2.renderfast();
          }
          if (g_map[x][y]>=3) {
            dirt3.matrix.setIdentity();
            dirt3.matrix.translate(0,-.15,0);
            dirt3.matrix.scale(.3,.3,.3)
            dirt3.matrix.translate(x-16,0, y-16);
            dirt3.renderfast();
          }
          if (g_map[x][y]>=4) {
            dirt4.matrix.setIdentity();
            dirt4.matrix.translate(0,.15,0);
            dirt4.matrix.scale(.3,.3,.3)
            dirt4.matrix.translate(x-16,0, y-16);
            dirt4.renderfast();
          }
        }
        if (g_texMap[x][y] == 4) {
          if (g_map[x][y]>=1) {
            cobble1.matrix.setIdentity();
            cobble1.matrix.translate(0,-.75,0);
            cobble1.matrix.scale(.3,.3,.3)
            cobble1.matrix.translate(x-16,0, y-16);
            cobble1.renderfast();
          }
          if (g_map[x][y]>=2) {
            cobble2.matrix.setIdentity();
            cobble2.matrix.translate(0,-.45,0);
            cobble2.matrix.scale(.3,.3,.3)
            cobble2.matrix.translate(x-16,0, y-16);
            cobble2.renderfast();
          }
          if (g_map[x][y]>=3) {
            cobble3.matrix.setIdentity();
            cobble3.matrix.translate(0,-.15,0);
            cobble3.matrix.scale(.3,.3,.3)
            cobble3.matrix.translate(x-16,0, y-16);
            cobble3.renderfast();
          }
          if (g_map[x][y]>=4) {
            cobble4.matrix.setIdentity();
            cobble4.matrix.translate(0,.15,0);
            cobble4.matrix.scale(.3,.3,.3)
            cobble4.matrix.translate(x-16,0, y-16);
            cobble4.renderfast();
          }
        }
      }
    }
  }
}
var house = new Cube();
var door = new Cube();
var glass = new Cube();
var roof = new Pyramid();
var water = new Cube();
var floor = new Cube();
var sky = new Cube();
var runHead = new Cube();
var runBody = new Cube();
var runArm1 = new Cube();
var runArm2 = new Cube();
var runLeg1 = new Cube();
var runLeg2 = new Cube();
// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  var startTime = performance.now();
  
  projMat.setPerspective(g_camera.fov, canvas.width/canvas.height, 0.1, 1000)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  
  viewMat.setLookAt(g_camera.eye.elements[0]/10,g_camera.eye.elements[1]/10,g_camera.eye.elements[2]/10, 
                    g_camera.at.elements[0]/10,g_camera.at.elements[1]/10,g_camera.at.elements[2]/10, 
                    g_camera.up.elements[0]/10,g_camera.up.elements[1]/10,g_camera.up.elements[2]/10
                    )
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat=new Matrix4()
  globalRotMat.rotate(g_globalXAngle,0,1,0);
  globalRotMat.rotate(g_globalYAngle,1,0,0);
  globalRotMat.rotate(g_globalZAngle,0,0,1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  renderPrince();
  runningGuy();
  renderTrees();

  renderBackdrop();
  drawMap();
  // Create a buffer object
  
  //Check the time at the end of the function, and show on the web page
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");

  // Set the text of an HTML element
  function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
      console.log("Failed to get " + htmlID + " from HTML");
      return;
    }
    htmlElm.innerHTML = text;
  }
}

