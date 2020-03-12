let video;
let poseNet;
let pose;
let skeleton;

let emoji="??";
let sec=0;
let emotion = "normal";

let d;
let symmetry;

// center point
let centerX = 0.0, centerY = 0.0;

let radius = 100, rotAngle = -90;
let accelX = 0.0, accelY = 0.0;
let deltaX = 0.0, deltaY = 0.0;
let springing = 0.1509, damping = 0.7;

//corner nodes
let nodes = 5;

//zero fill arrays
let nodeStartX = [];
let nodeStartY = [];
let nodeX = [];
let nodeY = [];
let angle = [];
let frequency = [];

// soft-body dynamics.
let organicConstant = 1.0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width,height);
  video.hide();
 poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  //center shape in window
  centerX = width / 2;
  centerY = height / 2;

  //initialize arrays to 0
  for (let i = 0; i < nodes; i++){
    nodeStartX[i] = 0;
    nodeStartY[i] = 0;
    nodeY[i] = 0;
    nodeY[i] = 0;
    angle[i] = 0;
  }

  // iniitalize frequencies for corner nodes
  for (let i = 0; i < nodes; i++){
    frequency[i] = random(5, 12);
  }

  noStroke();
  frameRate(30);
}

function gotPoses(poses) {
  //console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  //if(sec>20){background(255);}
  //if(sec>50){sec=0;}
  background(255);
  //sec++;
  
   translate(width,0);
  scale(-1.0,1.0);
  //image(video, 0, 0);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let shR = pose.rightShoulder;
    let shL= pose.leftShoulder;
    let hR = pose.rightHip;
    let hL = pose.leftHip;
    let elR = pose.rightElbow;
    let elL = pose.leftElbow;
    let wrR = pose.rightWrist;
    let wrL = pose.leftWrist;
    
    
    d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    
    stroke(0);
    //background(125-((eyeR.x+eyeL.x)/2-pose.nose.x)*20,255,((eyeR.x+eyeL.x)/2-pose.nose.x)*50);
    //background(255-abs((eyeR.x+eyeL.x)/2-pose.nose.x));
    
    let vR0 = createVector(shR.x,shR.y);
    let vR1 = createVector(-shR.x,0);
    let vR2 = createVector(wrR.x-shR.x,wrR.y-shR.y);
    
    let vL0 = createVector(shL.x,shL.y);
    let vL1 = createVector(shL.x,0);
    let vL2 = createVector(wrL.x-shL.x,wrL.y-shL.y);

    let angleR = vR1.angleBetween(vR2);
    let angleL = -vL1.angleBetween(vL2);    //�ݽð� �����̹Ƿ� -
    
    let angle= abs(degrees((angleR+angleL)/2).toFixed(0));
    
    colorMode(HSB);
    if(pose.rightWrist.y<(pose.nose.y+shR.y)/2 && pose.leftWrist.y<(pose.nose.y+shR.y)/2)
    {emoji = "??"; emotion="happy"; background(angle/180*100,90,90);}
    else if(pose.rightWrist.y>shR.y+(hR.y-shR.y)/3 && pose.leftWrist.y>shR.y+(hR.y-shR.y)/3)         {emoji = "??"; emotion="sad"; background(236-angle/180*30,67-angle/180*50,72-angle/180*50);}
    else 
    {
     emoji = "??"; emotion="normal"; 
     background(79,41,49);
    }  
    
    colorMode(RGB);
    
    symmetry = (eyeR.x+eyeL.x)/2-pose.nose.x;
    
    noStroke();
    drawShape();
    moveShape(pose);
    
    //if(pose.rightWrist.y<eyeR.y) {background(255,0,0);}
    //else if(pose.leftWrist.y<eyeL.y) {background(0,0,255);}

    stroke(0);
    
    
    
    // ��
    line(pose.nose.x, pose.nose.y-d/2,pose.nose.x-((eyeR.x+eyeL.x)/2-pose.nose.x)/2, pose.nose.y);
    line(pose.nose.x, pose.nose.y,pose.nose.x-((eyeR.x+eyeL.x)/2-pose.nose.x)/2, pose.nose.y);
    
    fill(0);
    strokeWeight(1);
    
    //��
    ellipse(pose.rightEye.x,pose.rightEye.y, d/2,d/4);
    ellipse(pose.leftEye.x,pose.rightEye.y,d/2,d/4);
    
    
    /*
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0,255,0);
      ellipse(x,y,16,16);
    }
  
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y,b.position.x,b.position.y);      
    }
      */
    
    //�� ���
    //line(pose.leftShoulder.x,pose.leftShoulder.y,pose.rightShoulder.x,pose.rightShoulder.y);
    
    //����� �Ȳ�ġ
    line(pose.rightShoulder.x,pose.rightShoulder.y,pose.rightElbow.x,pose.rightElbow.y);
    line(pose.leftShoulder.x,pose.leftShoulder.y,pose.leftElbow.x,pose.leftElbow.y);
    
    //�Ȳ�ġ�� �ո�
    line(pose.rightWrist.x,pose.rightWrist.y,pose.rightElbow.x,pose.rightElbow.y);
    line(pose.leftWrist.x,pose.leftWrist.y,pose.leftElbow.x,pose.leftElbow.y);
    
    //����� �ո�
    //line(pose.leftShoulder.x,pose.leftShoulder.y,pose.leftWrist.x,pose.leftWrist.y);
    
    //���� ���� ����
    for (let i = 5; i < pose.keypoints.length; i++) 
    {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(255);
      
      if(emotion=="happy")
      ellipse(x,y,d/3*2,d/3*2);
      else if(emotion=="sad") triangle(x-5-d/5,y-5-d/5,x,y+5+d/5,x+5+d/5,y-5-d/5);
      else rect(x-5-d/5,y-5-d/5,(5+d/5)*2,(5+d/5)*2);
    }
    
    /*
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y,b.position.x,b.position.y);      
    }
    */
    
    //
    //line(pose.leftShoulder.x,pose.leftShoulder.y,pose.rightHip.x,pose.rightHip.y);
    //line(pose.rightShoulder.x,pose.rightShoulder.y,(pose.leftHip.x+pose.rightHip.x)/2,pose.leftHip.y);
    
    //line((shL.x+shR.x)/2,(shL.y+shR.y)/2,(hL.x+hR.x)/2,(hL.y+hR.y)/2);
   
    //text(degrees(angleR).toFixed(0),100,100);
    //text(degrees(angleL).toFixed(0),400,100);
    //text(angle,250,height-200);
    
  }
  
  textSize(50);
  text(emoji, width-70,60);
}

function drawShape() {
  //  calculate node  starting locations
  
  for (let i = 0; i < nodes; i++){
    nodeStartX[i] = centerX + cos(radians(rotAngle)) * radius /100 *d;
    nodeStartY[i] = centerY + sin(radians(rotAngle)) * radius /600 *d;
    rotAngle += 360.0 / nodes;
  }

  // draw polygon
  curveTightness(organicConstant);
  beginShape();
  for (let i = 0; i < nodes; i++){
    curveVertex(nodeX[i], nodeY[i]);
  }
  for (let i = 0; i < nodes-1; i++){
    curveVertex(nodeX[i], nodeY[i]);
  }
  endShape(CLOSE);
}

function moveShape(pose) {
  //move center point
  //deltaX = pose.rightWrist.x - centerX;
  //deltaY = pose.rightWrist.y - centerY;
  
  deltaX = pose.nose.x - centerX;
  deltaY = pose.nose.y - abs(pose.nose.y-(pose.rightEye.y+pose.leftEye.y)/2)*4 +d - centerY;

  // create springing effect
  deltaX *= springing;
  deltaY *= springing;
  accelX += deltaX;
  accelY += deltaY;

  // move predator's center
  centerX += accelX;
  centerY += accelY;

  // slow down springing
  accelX *= damping;
  accelY *= damping;

  // change curve tightness
  organicConstant = 1 - ((abs(accelX) + abs(accelY)) * 0.1);

  //move nodes
  for (let i = 0; i < nodes; i++){
    nodeX[i] = nodeStartX[i] + sin(radians(angle[i])) * (accelX * 2);
    nodeY[i] = nodeStartY[i] + sin(radians(angle[i])) * (accelY * 2);
    angle[i] += frequency[i];
  }
}

