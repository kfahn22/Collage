/*  Created for #WCCChallenge "Collage"

This sketch is inspired by a Youtube video by Jackie Bernardi that created a Layered collage from handpainted papers.
I have replaced the papers with slices of images saved from several sketches.

https://youtu.be/ZKOESLS5oPs
*/

let thickness;
let border = 50;
let strips;
let addSnip = true;
let palette = [
  [12, 71, 103],
  [86, 110, 61],
  [185, 164, 76],
  [254, 153, 32],
  [250, 121, 33],
];
let x, y;

async function setup() {
  let canvasSize = min(windowWidth, windowHeight);
  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  background(palette[0]);

  thickness = width * 0.03;

  strips = await processImages();
  x = 0;
  y = 0;

  // First parameters is the number of strips to add, second is the angle at which
  // to place the strips.  I have added a very slight variation is strip angle.
  renderStrips(400, 0.5);

  push();
  rectMode(CENTER);
  stroke(255);
  strokeWeight(border);
  noFill();
  rect(width / 2, height / 2, width, height);
  pop();
}

async function processImages() {
  let images = [];
  let strips = [];
  // Load the images
  for (let i = 0; i < 3; i++) {
    images.push(await loadImage(`collage_assets/teal/${i}.jpg`));
  }
  for (let i = 0; i < 5; i++) {
    images.push(await loadImage(`collage_assets/orange/${i}.jpg`));
  }
  for (let i = 0; i < 3; i++) {
    images.push(await loadImage(`collage_assets/mix/${i}.jpg`));
  }
  for (let i = 0; i < 2; i++) {
    images.push(await loadImage(`collage_assets/clear/${i}.png`));
  }

  for (let i of images) {
    strips = strips.concat(
      getStrips(
        i,
        "horizontal",
        random(thickness * 0.5, thickness),
        random(height)
      )
    );
  }
  return strips;
}

function getStrips(img, direction, thickness, length) {
  let strips = [];
  if (direction === "vertical") {
    let stripHeight = length;
    let stripWidth = thickness;

    for (let x = 0; x < img.width; x += stripWidth) {
      let slice = img.get(x, 0, stripWidth, stripHeight);
      strips.push(slice);
    }
  } else if (direction === "horizontal") {
    let stripHeight = thickness;
    let stripWidth = length;

    for (let y = 0; y < img.height; y += stripHeight) {
      let slice = img.get(0, y, stripWidth, stripHeight);
      strips.push(slice);
    }
  }
  return strips;
}

function renderStrips(n, a) {
  let w, h, img;

  for (let i = 0; i < n; i++) {
    img = random(strips);
    push();
    angleMode(DEGREES);
    translate(x, y);
    if (addSnip) {
      rotate(random(-a, a));
    }
    w = img.width;
    h = random(img.height / 2, img.height);
    image(img, 0, 0, w, h);
    pop();
    if (x > width) {
      x = 0;
      y += h;
    } else {
      x += w / 2;
    }

    if (h > height) {
      break;
    }
  }
}

function strip(x, y) {
  push();
  translate(x, y);
  beginShapePattern();
  vertexPattern(border, border);
  vertexPattern(width - border, border);
  vertexPattern(width - border, border + thickness);
  vertex(border, border + thickness);
  endShapePattern();
  pop();
}

function choosePattern(choice) {
  patternColors(palette);
  switch (choice) {
    case "noise":
      pattern(PTN.noise(0.5));
      break;
    case "noiseGrad":
      pattern(PTN.noiseGrad(0.4));
      break;
    case "stripe":
      pattern(PTN.stripe(t / int(random(6, 12))));
      break;
    case "stripeCircle":
      PTN.stripeCircle(t / int(random(6, 12)));
      break;
    case "stripePolygon":
      PTN.stripePolygon(int(random(3, 7)), int(random(6, 12)));
      break;
    case "stripeRadial":
      PTN.stripeRadial(TAU / int(random(6, 30)));
      break;
    case "wave":
      PTN.wave(t / int(random(1, 3)), t / int(random(10, 20)), t / 5, t / 10);
      break;
    case "dot":
      PTN.dot(t / 10, (t / 10) * random(0.2, 1));
      break;
    case "checked":
      PTN.checked(t / int(random(5, 20)), t / int(random(5, 20)));
      break;
    case "cross":
      PTN.cross(t / int(random(10, 20)), t / int(random(20, 40)));
      break;
    case "triangle":
      PTN.triangle(t / int(random(5, 20)), t / int(random(5, 20)));
      break;
  }
}

// Function to save the canvas as an image when 's' key is pressed
function keyPressed() {
  if (key === "s" || key === "S") {
    save("collage.jpg");
  }
}
