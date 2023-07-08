// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 10.0;
    gl_PointSize = u_Size;
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

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
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
let savedFrames=[];
let frameIndex = 0;
let lightswitch = false;
let setFPS = 2;

//FPS variables used from https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI(){

  // Button Events (Shape Type)
  document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0];};
  document.getElementById('red').onclick   = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0];};
  document.getElementById('blue').onclick   = function() { g_selectedColor = [0.0, 0.0, 1.0, 1.0];};
  document.getElementById('black').onclick   = function() { g_selectedColor = [0.0, 0.0, 0.0, 1.0];};
  document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes();};
  document.getElementById('drawButton').onclick = function() {
    g_shapesList=[]; 
    renderAllShapes();

    pic = new Picture();
    g_shapesList.push(pic);
    renderAllShapes();

  };//drawTriangle([pos[0], pos[1], pos[0], pos[1], pos[0], pos[1]]);

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triangleButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('CircleButton').onclick = function() {g_selectedType=Circle};

  // Size Slider Events
  document.getElementById('redSlide').addEventListener('mouseup',   function() {g_selectedColor[0] = this.value/100;});
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
  document.getElementById('blueSlide').addEventListener('mouseup',  function() {g_selectedColor[2] = this.value/100;});

  
  document.getElementById('sizeSlide').addEventListener('mouseup',  function() { g_selectedSize = this.value;});
  document.getElementById('segSlide').addEventListener('mouseup',  function() { g_selectedSegments = this.value;});

  // Awesome buttons
  document.getElementById('FPS').addEventListener('mouseup',  function() { setFPS = this.value;});

  document.getElementById('saveFrame').onclick = function() {
    if (lightswitch) {
      savedFrames.pop();
      lightswitch = false;
    }
    savedFrames.push(g_shapesList.slice());
  };
  document.getElementById('playFrames').onclick = function() {
    savedFrames.push(g_shapesList.slice()); //weird code needed due to issues with object referencing
    lightswitch = true;
    frameIndex = 0;
    
    //Animation code https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
    startAnimating(setFPS);

    function startAnimating(fps) {
      fpsInterval = 1000 / fps;
      then = Date.now();
      startTime = then;
      animate();
    }

    function animate() {
      

      // request another frame
      var id = requestAnimationFrame(animate);

      if (savedFrames.length == frameIndex) {
        cancelAnimationFrame(id);
      }

      // calc elapsed time since last loop

      now = Date.now();
      elapsed = now - then;

      // if enough time has elapsed, draw the next frame

      if (elapsed > fpsInterval) {

          // Get ready for next frame by setting then=now, but also adjust for your
          // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
          then = now - (elapsed % fpsInterval);
          //console.log(frameIndex)
          g_shapesList=[];
          renderAllShapes();
          g_shapesList = savedFrames[frameIndex];    
          renderAllShapes();
          frameIndex++;
      }
    };
    
  };
  document.getElementById('clearFrames').onclick = function() {savedFrames=[];};

}
function main() {

  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();
  
  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes =  [];

function click(ev) {
  // Extract the event click and return it in WebGL Coordinates
  let [x, y] = convertCoordinatesEventToGL(ev);

  // Create and store the new point
  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle(g_selectedSegments);
  }
  point.position=[x,y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  //g_points.push([x, y]);
  
  // Store the coordinates to g_points array
  //g_colors.push(g_selectedColor.slice());

  // Store the size to the g_sizes array
  //g_sizes.push(g_selectedSize);

/*
  if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }
*/

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

// Extract the event click and return it in WebGL Coordinates
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y])
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //var len = g_points.length;
  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}
