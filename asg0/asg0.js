//DrawRectangle.js
var canvas = document.getElementById('example');
var ctx = canvas.getContext('2d');

function main() { 
    // Retrieve <canvas> element
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG
    

    // Draw a black rectangle
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

    let v1 = new Vector3([2.25,2.25,0]);
    drawVector(v1, "red");
}

function drawVector(v, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(canvas.width/2+v.elements[0]*20, canvas.height/2-v.elements[1]*20);
    ctx.stroke();
}

function handleDrawEvent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let v1x = document.getElementById("v1x").value;
    let v1y = document.getElementById("v1y").value;
    let v1 = new Vector3([v1x, v1y, 0]);
    drawVector(v1, "red");

    let v2x = document.getElementById("v2x").value;
    let v2y = document.getElementById("v2y").value;
    let v2 = new Vector3([v2x, v2y, 0]);
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let v1x = document.getElementById("v1x").value;
    let v1y = document.getElementById("v1y").value;
    let v1 = new Vector3([v1x, v1y, 0]);
    drawVector(v1, "red");

    let v2x = document.getElementById("v2x").value;
    let v2y = document.getElementById("v2y").value;
    let v2 = new Vector3([v2x, v2y, 0]);
    drawVector(v2, "blue");

    let op = document.getElementById("operation").value;
    let scalar = document.getElementById("scalar").value;
    
    if (op == "add") {
        let v3 = new Vector3([0, 0, 0]);
        v3.add(v1);
        v3.add(v2);
        drawVector(v3, "green");
    }
    else if (op == "sub") {
        let v3 = new Vector3([0, 0, 0]);
        v3.add(v1);
        v3.sub(v2);
        drawVector(v3, "green");
    }
    else if (op == "mul") {
        let v3 = v1;
        let v4 = v2;
        v3.mul(scalar);
        v4.mul(scalar);
        drawVector(v3, "green");
        drawVector(v4, "green");
    }
    else if (op == "div") {
        let v3 = v1;
        let v4 = v2;
        v3.div(scalar);
        v4.div(scalar);
        drawVector(v3, "green");
        drawVector(v4, "green");
    }
    else if (op == "mag") {
        console.log("Magnitude v1:", v1.magnitude());
        console.log("Magnitude v2:", v2.magnitude());
    }
    else if (op == "nor") {
        v1.normalize();
        v2.normalize();
        drawVector(v1, "green");
        drawVector(v2, "green");
    }
    else if (op == "ang") {
        angleBetween(v1, v2);
    }
    else if (op == "are") {
        areaTriangle(v1, v2);
    }
    
}

//Math.acos() citation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acos
//.toFixed() citation: https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
function angleBetween(v1, v2) {
    let d = Vector3.dot(v1, v2);
    let v1mag = v1.magnitude();
    let v2mag = v2.magnitude();
    let calc = (Math.acos(d/(v1mag*v2mag)) * (180/Math.PI)).toFixed(2);
    console.log("Angle:", calc);
}

function areaTriangle(v1, v2) {
    let v3 = Vector3.cross(v1, v2);
    console.log("Area of the triangle:", v3.magnitude()/2);
}