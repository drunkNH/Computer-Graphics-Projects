class Tree {
    constructor() {
      this.type='cube';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      //this.size = 5.0;
      //this.segments = segment
      this.matrix = new Matrix4();

      this.buffer = null;
      this.vertices = null;
      this.textureNum = -2;
    }
  
    render() {
      var tree = new Cone();
      tree.matrix = this.matrix;
      tree.color = [1/255,50/255,32/255,1];
      tree.matrix.rotate(270,1,0,0);
      tree.matrix.translate(0,0,-.25)
      var treeMat = new Matrix4(tree.matrix);
      tree.render();

      var log = new Cube();
      log.color = [92/255,64/255,51/255,1];
      log.matrix = treeMat;
      log.matrix.translate(-.1,-.1,-.5)
      log.matrix.scale(.2,.2,.8);
      log.render();
    }
}
var tree=new Tree();
var tree2=new Tree();
var tree3=new Tree();
var tree4=new Tree();
var tree5=new Tree();
var tree6=new Tree();
var tree7=new Tree();
var tree8=new Tree();
var tree9=new Tree();
var tree10=new Tree();
var tree11=new Tree();
var tree12=new Tree();
var tree13=new Tree();
var tree14=new Tree();
var tree15=new Tree();
function renderTrees() {
  tree.matrix.setIdentity();
  tree.matrix.translate(-2,-.5,0)
  tree.matrix.scale(.5,.5,.5);
  tree.render();

  tree2.matrix.setIdentity();
  tree2.matrix.translate(-3.5,-.5,.5)
  tree2.matrix.scale(.5,.5,.5);
  tree2.render();

  tree3.matrix.setIdentity();
  tree3.matrix.translate(-2.5,-.5,-1.7)
  tree3.matrix.scale(.5,.5,.5);
  tree3.render();

  tree4.matrix.setIdentity();
  tree4.matrix.translate(-3,-.5,-.3)
  tree4.matrix.scale(.5,.5,.5);
  tree4.render();

  tree5.matrix.setIdentity();
  tree5.matrix.translate(-2,-.5,1.9)
  tree5.matrix.scale(.5,.5,.5);
  tree5.render();

  tree6.matrix.setIdentity();
  tree6.matrix.translate(2.8,-.5,1)
  tree6.matrix.scale(.5,.5,.5);
  tree6.render();

  tree7.matrix.setIdentity();
  tree7.matrix.translate(2,-.5,0)
  tree7.matrix.scale(.5,.5,.5);
  tree7.render();

  tree8.matrix.setIdentity();
  tree8.matrix.translate(3.5,-.5,.5)
  tree8.matrix.scale(.5,.5,.5);
  tree8.render();

  tree9.matrix.setIdentity();
  tree9.matrix.translate(2.5,-.5,-1.7)
  tree9.matrix.scale(.5,.5,.5);
  tree9.render();

  tree10.matrix.setIdentity();
  tree10.matrix.translate(3,-.5,-.3)
  tree10.matrix.scale(.5,.5,.5);
  tree10.render();

  tree11.matrix.setIdentity();
  tree11.matrix.translate(2,-.5,1.9)
  tree11.matrix.scale(.5,.5,.5);
  tree11.render();

  tree12.matrix.setIdentity();
  tree12.matrix.translate(2.8,-.5,1)
  tree12.matrix.scale(.5,.5,.5);
  tree12.render();

  tree13.matrix.setIdentity();
  tree13.matrix.translate(-.8,-.5,-2)
  tree13.matrix.scale(.5,.5,.5);
  tree13.render();

  tree14.matrix.setIdentity();
  tree14.matrix.translate(0,-.5,-2.8)
  tree14.matrix.scale(.5,.5,.5);
  tree14.render();

  tree15.matrix.setIdentity();
  tree15.matrix.translate(1,-.5,-1.6)
  tree15.matrix.scale(.5,.5,.5);
  tree15.render();
}


function renderBackdrop() {
  house.matrix.setIdentity();
  house.color=[164/255,116/255,73/255,1];
  house.matrix.translate(-.25,-.74,1.5)
  house.matrix.scale(.5,.3,.5)
  house.render();

  door.matrix.setIdentity();
  door.color=[78/255,53/255,36/255,1];
  door.matrix.translate(0.05,-.74,2.001)
  door.matrix.scale(.1,.2,.01)
  door.render();

  glass.matrix.setIdentity();
  glass.color=[165/255*.8,241/255*.8,249/255*.8,1];
  glass.matrix.translate(-0.2,-.64,2.001)
  glass.matrix.scale(.2,.1,.01)
  glass.render();

  roof.matrix.setIdentity();
  roof.color=[55/255,55/255,55/255,1]
  roof.matrix.rotate(-90,1,0,0)
  
  roof.matrix.translate(-0.001,-1.75,-.445)
  roof.matrix.scale(.3,.3,.3)
  roof.render();

  water.matrix.setIdentity();
  water.color = [15/255, 94/255, 156/255, 1.0];
  water.matrix.translate(0, -.74, 0.0);
  water.matrix.scale(2.5,0,2.5);
  water.matrix.translate(-.5,0,-.5)
  water.render()

  floor.matrix.setIdentity();
  floor.color = [1.0, 1.0, 1.0, 1.0];
  floor.textureNum=0
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(10,0,10);
  floor.matrix.translate(-.5,0,-.5)
  floor.renderUV();

  sky.matrix.setIdentity();
  sky.color = [135/255,206/255,235/255,1];
  sky.textureNum=1;
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-.5, -.5, -.5);
  sky.renderUV();
}