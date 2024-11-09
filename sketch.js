let previousLipDistance;
let particles = [];
let particleNum = 1;
let bubble;
let bubSound1;
let bubSound2;
//ml5.js

let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };

function preload() {
  // Load the handPose model
  faceMesh = ml5.faceMesh(options);
  bubble = loadImage("bubble_pop_frame_01.png");
  bubSound1 = loadSound("bubblePop1.wav");
  bubSound2 = loadSound("bubblePop2.wav");
}

function setup() {
  createCanvas(640, 480);
  //Create the webcam video and hide it
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  background(0);
  image(video, 0, 0);

  if (faces.length > 0 && faces[0].lips) {
    let topLeftLip = createVector(faces[0].lips.x, faces[0].lips.y);
    let bottomRightLip = createVector(
      faces[0].lips.x + faces[0].lips.width,
      faces[0].lips.y + faces[0].lips.height
    );
    let centerLip = createVector(faces[0].lips.centerX, faces[0].lips.centerY);
    // stroke(0, 255, 0);
    // noFill();
    // ellipse(topLeftLip.x, topLeftLip.y, 10, 10);
    // ellipse(bottomRightLip.x, bottomRightLip.y, 10, 10);
    // ellipse(centerLip.x, centerLip.y, 10, 10);

    let lipDistance = dist(
      topLeftLip.x,
      topLeftLip.y,
      bottomRightLip.x,
      bottomRightLip.y
    );
    if (previousLipDistance > 50 && previousLipDistance - lipDistance > 5) {
      for (let i = 0; i < particleNum; i++) {
        let mouth = createVector(centerLip.x, centerLip.y);
        let radius = 50;
        particles.push(new Particle(mouth.x, mouth.y, radius));
        bubSound2.play();

        // trigger(rings[i][j], mouth);
      }
    }
    previousLipDistance = lipDistance;
  }

  for (let i = particles.length - 1; i > 0; i--) {
    particles[i].draw();
    particles[i].update();

    if (particles[i].pos.x > width || particles[i].pos.x < 0) {
      particles.splice(i, 1);
    } else
     if (particles[i].pos.y > height || particles[i].pos.y < 60) {
      bubSound1.play();
      particles.splice(i, 1);
      
    }
  }
  console.log(particles.length);

  // drawPartsKeypoints();
}

// Draw keypoints for specific face element positions
function drawPartsKeypoints() {
  // If there is at least one face
  if (faces.length > 0) {
    for (let i = 0; i < faces[0].lips.keypoints.length; i++) {
      let lips = faces[0].lips.keypoints[i];
      fill(0, 255, 0);
      circle(lips.x, lips.y, 5);
    }
  }
}
// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

// function trigger(letter, mouth) {
//   let force = p5.Vector.sub(letter.pos, mouth);
//   let distance = force.mag();
//   force.normalize();

//   let magnitude = map(distance, 0, width, 0.1, 1) * random(0.1, 1);
//   force.mult(magnitude);
//   letter.applyForce(force);
//   letter.angleV = map(distance, 0, width, 0.01, 0.1) * random(0.5, 6);
// }

function windowResized() {
  resizeCanvas(400, 400);
}
