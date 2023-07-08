// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_NormalMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform int u_whichTexture;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  uniform vec3 u_lightColor;
  uniform bool u_spotOn;
  

  void main() {
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    }
    else if (u_whichTexture == -2) {
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
    
    vec3 lightVector = u_lightPos-vec3(v_VertPos);
    vec3 spotVector = vec3(0,0,-1)-vec3(v_VertPos);
    float r=length(lightVector);
    float r2=length(spotVector);

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    vec3 L2 = normalize(spotVector);

    vec3 D = -normalize(vec3(0,0,2));

    float angle = dot(L2,D);
    float nDotL = max(dot(N,L),0.0);
    float nDotL2 = max(dot(N,L2),0.0);
        
    // Reflection
    vec3 R = reflect(-L, N);
    vec3 R2= reflect(-L2, N);

    // eye
    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    float specular = pow(max(dot(E,R), 0.0),300.0);
    float specular2 = pow(max(dot(E,R2), 0.0),300.0);

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    vec3 diffuse2 = vec3(gl_FragColor) * nDotL2 * 0.7;
    vec3 ambient2 = vec3(gl_FragColor) * 0.3;
    if (u_spotOn) {
      if (acos(angle) > radians(30.0)) {
        if (u_lightOn) {
          if (u_whichTexture == 0 || u_whichTexture == -1 || u_whichTexture == -2 || u_whichTexture == -3) {
            gl_FragColor = vec4((diffuse+ambient+specular)*u_lightColor,1);
          } else {
            gl_FragColor = vec4((diffuse+ambient)*u_lightColor, 1.0);
          }
        }
        else {
          if (u_whichTexture == 0 || u_whichTexture == -1 || u_whichTexture == -2 || u_whichTexture == -3) {
            gl_FragColor = vec4((diffuse2+ambient2+specular2)*u_lightColor,1);
          } else {
            gl_FragColor = vec4((diffuse2+ambient2)*u_lightColor, 1.0);
          }
        }
      }
      else {
        if (u_lightOn) {
          if (u_whichTexture == 0 || u_whichTexture == -1 || u_whichTexture == -2 || u_whichTexture == -3) {
            gl_FragColor = vec4((diffuse+ambient+specular)*u_lightColor*2.0,1);
          } else {
            gl_FragColor = vec4((diffuse+ambient)*u_lightColor*2.0, 1.0);
          }
        }
        else {
          if (u_whichTexture == 0 || u_whichTexture == -1 || u_whichTexture == -2 || u_whichTexture == -3) {
            gl_FragColor = vec4((diffuse2+ambient2+specular2)*u_lightColor*2.0,1);
          } else {
            gl_FragColor = vec4((diffuse2+ambient2)*u_lightColor*2.0, 1.0);
          }
        }
      }
    }
    else if (u_lightOn) {
      if (u_whichTexture == 0 || u_whichTexture == -1 || u_whichTexture == -2 || u_whichTexture == -3) {
        gl_FragColor = vec4((diffuse+ambient+specular)*u_lightColor,1);
      } else {
        gl_FragColor = vec4((diffuse+ambient)*u_lightColor, 1.0);
      }
    }
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal
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
let u_ViewMatrix;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_spotOn;
let u_NormalMatrix;
let u_lightColor;

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

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
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

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return;
  }
  
  u_spotOn = gl.getUniformLocation(gl.program, 'u_spotOn');
  if (!u_spotOn) {
    console.log('Failed to get the storage location of u_spotOn');
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

let g_normalOn=false;

let g_lightPos=[0,0,2];

let g_spotDirection=[0,0,2]

let g_lightOn=true;

let g_ballOn=false;

let g_lightAnimate=false;

let g_lightRGB = [1,1,1]

let g_spotOn = false


// Set up actions for the HTML UI elements
function addActionsForHtmlUI(){
  document.getElementById('normalOn').onclick = function() {g_normalOn=true;};
  document.getElementById('normalOff').onclick = function() {g_normalOn=false;};

  document.getElementById('lightOn').onclick = function() {g_lightOn=true;};
  document.getElementById('lightOff').onclick = function() {g_lightOn=false;};

  document.getElementById('spotOn').onclick = function() {g_spotOn=true;};
  document.getElementById('spotOff').onclick = function() {g_spotOn=false;};

  document.getElementById('lightAOn').onclick = function() {g_lightAnimate=true;};
  document.getElementById('lightAOff').onclick = function() {g_lightAnimate=false;};

  document.getElementById('ballOn').onclick = function() {g_ballOn=true;};
  document.getElementById('ballOff').onclick = function() {g_ballOn=false;};

  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightPos[0] = this.value/100; renderAllShapes();}})
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightPos[1] = this.value/100; renderAllShapes();}})
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightPos[2] = this.value/100; renderAllShapes();}})

  document.getElementById('lightSlideR').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightRGB[0] = this.value/100; renderAllShapes();}})
  document.getElementById('lightSlideG').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightRGB[1] = this.value/100; renderAllShapes();}})
  document.getElementById('lightSlideB').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightRGB[2] = this.value/100; renderAllShapes();}})
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
if (g_normalOn) {
  wall.textureNum=-3
  wall2.textureNum=-3
  wall3.textureNum=-3
  wall4.textureNum=-3
}
else {
  wall.textureNum=2
  wall2.textureNum=2
  wall3.textureNum=2
  wall4.textureNum=2
}


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
  if (g_normalOn) {
    wall.textureNum=-3
    wall2.textureNum=-3
    wall3.textureNum=-3
    wall4.textureNum=-3
    dirt1.textureNum=-3
    dirt2.textureNum=-3
    dirt3.textureNum=-3
    dirt4.textureNum=-3
    cobble1.textureNum=-3
    cobble2.textureNum=-3
    cobble3.textureNum=-3
    cobble4.textureNum=-3
  }
  else {
    wall.textureNum=2
    wall2.textureNum=2
    wall3.textureNum=2
    wall4.textureNum=2
    dirt1.textureNum=3
    dirt2.textureNum=3
    dirt3.textureNum=3
    dirt4.textureNum=3
    cobble1.textureNum=4
    cobble2.textureNum=4
    cobble3.textureNum=4
    cobble4.textureNum=4
  }
  for (x=0;x<32;x++) {
    for (y=0;y<32;y++) {
      if (g_map[x][y]!=0) {
        if (g_texMap[x][y] == 2) {
          if (g_map[x][y]>=1) {
            wall.matrix.setIdentity();
            wall.matrix.translate(0,-.75,0);
            wall.matrix.scale(.3,.3,.3)
            wall.matrix.translate(x-16,0, y-16);
            wall.normalMatrix.setInverseOf(wall.matrix).transpose();
            wall.renderfast();
          }
          if (g_map[x][y]>=2) {
            wall2.matrix.setIdentity();
            wall2.matrix.translate(0,-.45,0);
            wall2.matrix.scale(.3,.3,.3)
            wall2.matrix.translate(x-16,0, y-16);
            wall2.normalMatrix.setInverseOf(wall2.matrix).transpose();
            wall2.renderfast();
          }
          if (g_map[x][y]>=3) {
            wall3.matrix.setIdentity();
            wall3.matrix.translate(0,-.15,0);
            wall3.matrix.scale(.3,.3,.3)
            wall3.matrix.translate(x-16,0, y-16);
            wall3.normalMatrix.setInverseOf(wall3.matrix).transpose();
            wall3.renderfast();
          }
          if (g_map[x][y]>=4) {
            wall4.matrix.setIdentity();
            wall4.matrix.translate(0,.15,0);
            wall4.matrix.scale(.3,.3,.3)
            wall4.matrix.translate(x-16,0, y-16);
            wall4.normalMatrix.setInverseOf(wall4.matrix).transpose();
            wall4.renderfast();
          }
        }
        if (g_texMap[x][y] == 3) {
          if (g_map[x][y]>=1) {
            dirt1.matrix.setIdentity();
            dirt1.matrix.translate(0,-.75,0);
            dirt1.matrix.scale(.3,.3,.3)
            dirt1.matrix.translate(x-16,0, y-16);
            dirt1.normalMatrix.setInverseOf(dirt1.matrix).transpose();
            dirt1.renderfast();
          }
          if (g_map[x][y]>=2) {
            dirt2.matrix.setIdentity();
            dirt2.matrix.translate(0,-.45,0);
            dirt2.matrix.scale(.3,.3,.3)
            dirt2.matrix.translate(x-16,0, y-16);
            dirt2.normalMatrix.setInverseOf(dirt2.matrix).transpose();
            dirt2.renderfast();
          }
          if (g_map[x][y]>=3) {
            dirt3.matrix.setIdentity();
            dirt3.matrix.translate(0,-.15,0);
            dirt3.matrix.scale(.3,.3,.3)
            dirt3.matrix.translate(x-16,0, y-16);
            dirt3.normalMatrix.setInverseOf(dirt3.matrix).transpose();
            dirt3.renderfast();
          }
          if (g_map[x][y]>=4) {
            dirt4.matrix.setIdentity();
            dirt4.matrix.translate(0,.15,0);
            dirt4.matrix.scale(.3,.3,.3)
            dirt4.matrix.translate(x-16,0, y-16);
            dirt4.normalMatrix.setInverseOf(dirt4.matrix).transpose();
            dirt4.renderfast();
          }
        }
        if (g_texMap[x][y] == 4) {
          if (g_map[x][y]>=1) {
            cobble1.matrix.setIdentity();
            cobble1.matrix.translate(0,-.75,0);
            cobble1.matrix.scale(.3,.3,.3)
            cobble1.matrix.translate(x-16,0, y-16);
            cobble1.normalMatrix.setInverseOf(cobble1.matrix).transpose();
            cobble1.renderfast();
          }
          if (g_map[x][y]>=2) {
            cobble2.matrix.setIdentity();
            cobble2.matrix.translate(0,-.45,0);
            cobble2.matrix.scale(.3,.3,.3)
            cobble2.matrix.translate(x-16,0, y-16);
            cobble2.normalMatrix.setInverseOf(cobble2.matrix).transpose();
            cobble2.renderfast();
          }
          if (g_map[x][y]>=3) {
            cobble3.matrix.setIdentity();
            cobble3.matrix.translate(0,-.15,0);
            cobble3.matrix.scale(.3,.3,.3)
            cobble3.matrix.translate(x-16,0, y-16);
            cobble3.normalMatrix.setInverseOf(cobble3.matrix).transpose();
            cobble3.renderfast();
          }
          if (g_map[x][y]>=4) {
            cobble4.matrix.setIdentity();
            cobble4.matrix.translate(0,.15,0);
            cobble4.matrix.scale(.3,.3,.3)
            cobble4.matrix.translate(x-16,0, y-16);
            cobble4.normalMatrix.setInverseOf(cobble4.matrix).transpose();
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
var sphere = new Sphere();
var light = new Cube();
var cube = new Cube();
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
  
  gl.uniform3f(u_lightPos, g_lightPos[0],g_lightPos[1],g_lightPos[2]);

  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0]/10,g_camera.eye.elements[1]/10,g_camera.eye.elements[2]/10);

  gl.uniform1i(u_lightOn, g_lightOn);

  gl.uniform1i(u_spotOn, g_spotOn);

  gl.uniform3f(u_lightColor, g_lightRGB[0], g_lightRGB[1], g_lightRGB[2]);

  light.matrix.setIdentity();
  light.color=[2,2,0,1];
  if (g_lightAnimate) {
    g_lightPos[0] = (-40*Math.cos((g_seconds+17+.5)*g_speed/4))/10
    g_lightPos[1] = 0
    g_lightPos[2] = (-40*Math.sin((g_seconds+17+.5)*g_speed/4))/10
  }
  light.matrix.translate(g_lightPos[0],g_lightPos[1],g_lightPos[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.matrix.translate(-.5,-.5,-.5);
  light.renderUV();

  runningGuy();
  renderPrince();
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

