// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMaatrix4fv(u_ModelMatrix, false, identityM.elements);
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
let g_origin=[0,0]

let g_idleAnimation=false;
let g_headAnimation=false;

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

let g_size=1;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI(){
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
}

function main() {

  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();
  
  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onclick = function(ev) {if(ev.shiftKey) {if (g_headAnimation){g_headAnimation = false} else{g_idleAnimation = false; reset(); g_headAnimation = true}}}
  canvas.onmousedown = origin;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(2/255, 8/255, 9/255, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
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
  g_globalXAngle = g_globalXAngle-coordinates[0]*360
  g_globalYAngle = g_globalYAngle-coordinates[1]*360

  // Draw every shape that is supposed to be in the canvas
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

var body = new Cone();
var head = new Face();
var antenna = new Cone();
var antennaTop = new Sphere();
var eye1 = new Cube();
var eye2 = new Cube();
var nose = new Nose();
var mouth = new Cube();
var leftArm = new Cylinder();
var rightArm = new Cylinder();
var leftForeArm = new Cylinder();
var rightForeArm = new Cylinder();
var leftHand = new Sphere();
var rightHand = new Sphere();
var pelvis = new Pelvis();
var leftLeg = new Cylinder();
var rightLeg = new Cylinder();
var leftCalf = new Cylinder();
var rightCalf = new Cylinder();
var leftFoot = new Sphere();
var rightFoot = new Sphere();
var katamari = new Katamari();

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  var startTime = performance.now();

  var globalRotMat=new Matrix4()
  globalRotMat.rotate(g_globalXAngle,0,1,0);
  globalRotMat.rotate(g_globalYAngle,1,0,0);
  globalRotMat.rotate(g_globalZAngle,0,0,1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);
  

  var size = new Anchor();
  size.matrix.scale(g_size,g_size,g_size);
  var sizeMat = new Matrix4(size.matrix);
  var sizeMat2 = new Matrix4(size.matrix);
  var sizeMat3 = new Matrix4(size.matrix);
  var sizeMat4 = new Matrix4(size.matrix);
  var sizeMat5 = new Matrix4(size.matrix);
  
  
  body.color = [121/255*.96,170/255*.96,58/255*.96,1];
  body.matrix = sizeMat;
  body.matrix.translate(0, -.25, 0);
  body.matrix.rotate(90,1,0,0);
  body.matrix.rotate(180,1,0,0);
  body.matrix.rotate(-g_bodyXAngle,0,0,1);
  body.matrix.rotate(-g_bodyYAngle,1,0,0);
  body.matrix.rotate(-g_bodyZAngle,0,1,0);
  var bodyMat=new Matrix4(body.matrix); 
  body.matrix.scale(.6,.6,.8);
  body.render();

  var bodyAnchor = anchor(sizeMat2);
  var bodyAnchorMat=new Matrix4(bodyAnchor.matrix); 
  bodyAnchor.matrix.scale(.6,.6,.8);

  var bodyAnchor2 = anchor(sizeMat3)
  var bodyAnchorMat2=new Matrix4(bodyAnchor2.matrix); 
  bodyAnchor2.matrix.scale(.6,.6,.8);

  var pelvisAnchor = anchor(sizeMat4)
  var pelvisAnchorMat=new Matrix4(pelvisAnchor.matrix); 
  pelvisAnchor.matrix.scale(.6,.6,.8);

  var katamariAnchor = new Anchor();
  katamariAnchor.matrix = sizeMat5;
  katamariAnchor.matrix.translate(0, -.25, 0);
  katamariAnchor.matrix.rotate(90,1,0,0);
  katamariAnchor.matrix.rotate(180,1,0,0);
  katamariAnchor.matrix.rotate(-g_bodyYAngle,1,0,0);
  katamariAnchor.matrix.rotate(-g_bodyZAngle,0,1,0);
  var katamariMat=new Matrix4(katamariAnchor.matrix); 
  katamariAnchor.matrix.scale(.6,.6,.8);

  
  head.color = [121/255,170/255,58/255,1];
  head.matrix = bodyMat
  head.matrix.translate(0, 0, 0.7);
  head.matrix.rotate(90,0,1,0);
  head.matrix.rotate(270,0,0,1);
  head.matrix.rotate(g_headXAngle,0,1,0);
  head.matrix.rotate(g_headYAngle,0,0,1);
  head.matrix.rotate(-g_headZAngle,1,0,0);
  var headMat=new Matrix4(head.matrix); 
  head.matrix.scale(.4,.4,.5);
  head.render();

  
  antenna.color = [228/255,211/255,46/255,1];
  antenna.matrix = headMat
  antenna.matrix.translate(0, 0, 0);
  antenna.matrix.rotate(90,1,0,0);
  antenna.matrix.rotate(180,0,0,1);
  var antennaMat = antenna.matrix
  antenna.matrix.scale(.2,.2,.4);
  antenna.render();

  
  antennaTop.color = [175/255,45/255,45/255,1];
  antennaTop.matrix = antennaMat
  antennaTop.matrix.translate(0, 0, 1);
  antennaTop.matrix.scale(.2,.2,.1);
  antennaTop.render();

  
  eye2.color = [0,0,0,1];
  eye2.matrix = headMat;
  eye2.matrix.translate(2.6, 2, -7);
  eye2.matrix.rotate(45,0,1,0)
  eye2.render();

  
  eye1.color = [0,0,0,1];
  eye1.matrix = headMat;
  eye1.matrix.translate(0, -5, 0);
  eye1.render();

  
  nose.color = [253/255,134/255,41/255,1];
  nose.matrix = headMat;
  nose.matrix.translate(2, 3, 0.6);
  nose.matrix.rotate(270,0,1,0)
  nose.matrix.scale(1,.5,1)
  nose.render();

  
  mouth.color = [171/255,45/255,43/255,1];
  mouth.matrix = headMat;
  mouth.matrix.translate(-1.5, -2, -1);
  nose.matrix.rotate(30,0,1,0)
  mouth.matrix.scale(1,4,1)
  mouth.render();

  
  leftArm.color = [121/255*.93,170/255*.93,58/255*.93,1];
  leftArm.matrix = bodyAnchorMat
  leftArm.matrix.rotate(270,0,1,0)
  leftArm.matrix.translate(.45, 0, .1);
  leftArm.matrix.rotate(-g_leftArmXAngle,1,0,0);
  leftArm.matrix.rotate(-g_leftArmYAngle,0,1,0);
  leftArm.matrix.rotate(-g_leftArmZAngle,0,0,1);
  var leftArmMat=new Matrix4(leftArm.matrix); 
  leftArm.matrix.scale(.06,.06,.14)
  leftArm.render();

  
  rightArm.color = [121/255*.93,170/255*.93,58/255*.93,1];
  rightArm.matrix = bodyAnchorMat2
  rightArm.matrix.rotate(90,0,1,0)
  rightArm.matrix.translate(-.45, 0, .1);
  rightArm.matrix.rotate(-g_rightArmXAngle,1,0,0);
  rightArm.matrix.rotate(g_rightArmYAngle,0,1,0);
  rightArm.matrix.rotate(-g_rightArmZAngle,0,0,1);
  var rightArmMat=new Matrix4(rightArm.matrix); 
  rightArm.matrix.scale(.06,.06,.14)
  rightArm.render();

  
  leftForeArm.color = [121/255*.9,170/255*.9,58/255*.9,1];
  leftForeArm.matrix = leftArmMat;
  leftForeArm.matrix.translate(0, 0, .265);
  leftForeArm.matrix.rotate(-g_leftForeArmXAngle,1,0,0);
  leftForeArm.matrix.rotate(-g_leftForeArmYAngle,0,1,0);
  leftForeArm.matrix.rotate(-g_leftForeArmZAngle,0,0,1);
  var leftForeArmMat=new Matrix4(leftForeArm.matrix);
  leftForeArm.matrix.scale(.06,.06,.09)
  leftForeArm.render();

  
  rightForeArm.color = [121/255*.9,170/255*.9,58/255*.9,1];
  rightForeArm.matrix = rightArmMat;
  rightForeArm.matrix.translate(0, 0, .265);
  rightForeArm.matrix.rotate(-g_rightForeArmXAngle,1,0,0);
  rightForeArm.matrix.rotate(g_rightForeArmYAngle,0,1,0);
  rightForeArm.matrix.rotate(-g_rightForeArmZAngle,0,0,1);
  var rightForeArmMat=new Matrix4(rightForeArm.matrix); 
  rightForeArm.matrix.scale(.06,.06,.09)
  rightForeArm.render();

  
  leftHand.color = [121/255*.8,170/255*.8,58/255*.8,1];
  leftHand.matrix = leftForeArmMat;
  leftHand.matrix.translate(0, 0, .2)
  leftHand.matrix.rotate(-g_leftHandXAngle,1,0,0);
  leftHand.matrix.rotate(g_leftHandYAngle,0,1,0);
  leftHand.matrix.rotate(-g_leftHandZAngle,0,0,1);
  leftHand.matrix.scale(.05,.05,.05)
  leftHand.render();
  
  
  rightHand.color = [121/255*.8,170/255*.8,58/255*.8,1];
  rightHand.matrix = rightForeArmMat;
  rightHand.matrix.translate(0, 0, .2)
  rightHand.matrix.rotate(-g_rightHandXAngle,1,0,0);
  rightHand.matrix.rotate(g_rightHandYAngle,0,1,0);
  rightHand.matrix.rotate(-g_rightHandZAngle,0,0,1);
  rightHand.matrix.scale(.05,.05,.05)
  rightHand.render();
  
  
  pelvis.color = [120/255,46/255,110/255,1];
  pelvis.matrix = pelvisAnchorMat
  pelvis.matrix.rotate(270,1,0,0)
  pelvis.matrix.rotate(90,0,1,0)
  pelvis.matrix.rotate(g_pelvisAngle,0,1,0)
  var pelvisMat1=new Matrix4(pelvis.matrix);
  var pelvisMat2=new Matrix4(pelvis.matrix); 
  pelvis.matrix.scale(.25,.1,.25)
  pelvis.render();
  
  
  leftLeg.color = [120/255*.93,46/255*.93,110/255*.93,1];
  leftLeg.matrix = pelvisMat1
  leftLeg.matrix.translate(0, 0.05, .12);
  leftLeg.matrix.rotate(270, 1, 0, 0);
  leftLeg.matrix.rotate(-g_leftLegXAngle, 0, 1, 0);
  leftLeg.matrix.rotate(g_leftLegYAngle, 1, 0, 0);
  leftLeg.matrix.rotate(g_leftLegZAngle, 0, 0, 1);
  var leftLegMat=new Matrix4(leftLeg.matrix);
  leftLeg.matrix.scale(.06,.06,.1)
  leftLeg.render();

  
  rightLeg.color = [120/255*.93,46/255*.93,110/255*.93,1];
  rightLeg.matrix = pelvisMat2
  rightLeg.matrix.translate(0, 0.05, -.12);
  rightLeg.matrix.rotate(270, 1, 0, 0);
  rightLeg.matrix.rotate(-g_rightLegXAngle, 0, 1, 0);
  rightLeg.matrix.rotate(g_rightLegYAngle, 1, 0, 0);
  rightLeg.matrix.rotate(g_rightLegZAngle, 0, 0, 1);
  var rightLegMat=new Matrix4(rightLeg.matrix);
  rightLeg.matrix.scale(.06,.06,.1)
  rightLeg.render();

  
  leftCalf.color = [120/255*.9,46/255*.9,110/255*.9,1];
  leftCalf.matrix = leftLegMat
  leftCalf.matrix.translate(0, 0, 0.19);
  leftCalf.matrix.rotate(-g_leftCalfXAngle, 0, 1, 0);
  leftCalf.matrix.rotate(g_leftCalfYAngle, 1, 0, 0);
  leftCalf.matrix.rotate(g_leftCalfZAngle, 0, 0, 1);
  var leftCalfMat = new Matrix4(leftCalf.matrix);
  leftCalf.matrix.scale(.06,.06,.09)
  leftCalf.render();

  
  rightCalf.color = [120/255*.9,46/255*.9,110/255*.9,1];
  rightCalf.matrix = rightLegMat
  rightCalf.matrix.translate(0, 0, 0.19);
  rightCalf.matrix.rotate(-g_rightCalfXAngle, 0, 1, 0);
  rightCalf.matrix.rotate(g_rightCalfYAngle, 1, 0, 0);
  rightCalf.matrix.rotate(g_rightCalfZAngle, 0, 0, 1);
  var rightCalfMat = new Matrix4(rightCalf.matrix);
  rightCalf.matrix.scale(.06,.06,.09)
  rightCalf.render();

  
  leftFoot.color = [120/255*.8,46/255*.8,110/255*.8,1];
  leftFoot.matrix = leftCalfMat;
  leftFoot.matrix.translate(0, 0, 0.19);
  leftFoot.matrix.rotate(g_rightFootXAngle,1,0,0);
  leftFoot.matrix.rotate(g_rightFootYAngle,0,1,0);
  leftFoot.matrix.rotate(g_rightFootZAngle,0,0,1);
  leftFoot.matrix.scale(.05,.05,.05)
  leftFoot.render();

  
  rightFoot.color = [120/255*.8,46/255*.8,110/255*.8,1];
  rightFoot.matrix = rightCalfMat;
  rightFoot.matrix.translate(0, 0, 0.19);
  rightFoot.matrix.rotate(g_leftFootXAngle,1,0,0);
  rightFoot.matrix.rotate(g_leftFootYAngle,0,1,0);
  rightFoot.matrix.rotate(g_leftFootZAngle,0,0,1);
  rightFoot.matrix.scale(.05,.05,.05)
  rightFoot.render();

  
  katamari.color = [178/255,172/255,112/255,1];
  katamari.matrix = katamariMat
  katamari.matrix.translate(0,.92,0.2)
  katamari.matrix.rotate(-g_katamariAngle,1,0,0)
  katamari.matrix.scale(.7,.7,.7);
  if (g_ballVisible) {
    katamari.render();
  }
  
  
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

