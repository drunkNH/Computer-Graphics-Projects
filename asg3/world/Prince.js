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
var moon = new Katamari();
var projMat=new Matrix4();
var g_camera = new Camera();
var viewMat=new Matrix4();

function renderPrince() {
  var size = new Anchor();
  size.matrix.scale(g_size,g_size,g_size);
  var sizeMat = new Matrix4(size.matrix);
  var sizeMat2 = new Matrix4(size.matrix);
  var sizeMat3 = new Matrix4(size.matrix);
  var sizeMat4 = new Matrix4(size.matrix);
  var sizeMat5 = new Matrix4(size.matrix);
  
  body.color = [121/255*.96,170/255*.96,58/255*.96,1];
  body.matrix = sizeMat;
  body.matrix.translate(-40*Math.cos((g_seconds+17)*g_speed/4), -7, -40*Math.sin((g_seconds+17)*g_speed/4));
  body.matrix.rotate(-14.5*(g_seconds+17)%360,0,1,0);
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

  /*
  var katamariAnchor = new Anchor();
  katamariAnchor.matrix = sizeMat5;
  katamariAnchor.matrix.translate(0, -.75, 0);
  katamariAnchor.matrix.rotate(90,1,0,0);
  katamariAnchor.matrix.rotate(180,1,0,0);
  katamariAnchor.matrix.rotate(-g_bodyYAngle,1,0,0);
  katamariAnchor.matrix.rotate(-g_bodyZAngle,0,1,0);
  var katamariMat=new Matrix4(katamariAnchor.matrix); 
  katamariAnchor.matrix.scale(.6,.6,.8);*/
  
  var moonAnchor = anchor(sizeMat5)
  var moonMat=new Matrix4(moonAnchor.matrix); 
  moonAnchor.matrix.scale(.6,.6,.8);

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
  
  /*
  katamari.color = [178/255,172/255,112/255,1];
  katamari.matrix = katamariMat
  katamari.matrix.translate(0,.92,-5.6)
  katamari.matrix.rotate(-g_katamariAngle,1,0,0)
  katamari.matrix.scale(.7,.7,.7);
  katamari.render();*/
  
  moon.color = [178/255,172/255,112/255,1];
  moon.matrix = moonMat
  moon.matrix.translate(0,.92,.3)
  moon.matrix.rotate(-g_katamariAngle,1,0,0)
  moon.matrix.scale(.7,.7,.7);
  moon.render();
  
}

function runningGuy() {
  runHead.matrix.setIdentity();
  runHead.color = [255/255, 219/255, 172/255, 1];
  runHead.matrix.translate((-40*Math.cos((g_seconds+17+.5)*g_speed/4))/10,-.55,(-40*Math.sin((g_seconds+17+.5)*g_speed/4))/10)
  runHead.matrix.rotate(-14.5*(g_seconds+17+.5)%360,0,1,0);
  var runHeadMat = new Matrix4(runHead.matrix);
  runHead.matrix.scale(.05,.05,.05)
  runHead.render();

  runBody.matrix.setIdentity();
  runBody.color = [0/255, 100/255, 0/255, 1];
  runBody.matrix = runHeadMat;
  runBody.matrix.translate(-.01, -.10001, 0);
  var runBodyMat = new Matrix4(runBody.matrix);
  var runBodyMat2 = new Matrix4(runBody.matrix);
  var runBodyMat3 = new Matrix4(runBody.matrix);
  var runBodyMat4 = new Matrix4(runBody.matrix);
  runBody.matrix.scale(.07,.1,.05)
  runBody.render();

  runArm1.matrix.setIdentity();
  runArm1.color = [0/255, 90/255, 0/255, 1];
  runArm1.matrix = runBodyMat;
  runArm1.matrix.translate(.07, 0.05, 0);
  runArm1.matrix.scale(.035,.1,.05)
  runArm1.render();

  runArm2.matrix.setIdentity();
  runArm2.color = [0/255, 90/255, 0/255, 1];
  runArm2.matrix = runBodyMat2;
  runArm2.matrix.translate(-.035, 0.05, 0);
  runArm2.matrix.scale(.035,.1,.05)
  runArm2.render();

  runLeg1.matrix.setIdentity();
  runLeg1.color = [0/255, 0/255, 110/255, 1];
  runLeg1.matrix = runBodyMat3;
  runLeg1.matrix.translate(.001, -((Math.abs(50*Math.cos(g_seconds*10))/1000)+0.05), 0.0005);
  runLeg1.matrix.scale(.034,.1,.040)
  runLeg1.render();

  runLeg2.matrix.setIdentity();
  runLeg2.color = [0/255, 0/255, 110/255, 1];
  runLeg2.matrix = runBodyMat4;
  runLeg2.matrix.translate(0.035, -((Math.abs(50*Math.sin(g_seconds*10))/1000)+0.05), 0.0005);
  runLeg2.matrix.scale(.034,.1,.049)
  runLeg2.render();
}