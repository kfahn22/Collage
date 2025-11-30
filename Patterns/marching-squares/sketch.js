// Marching Squares
// Coding in the Cabana
// The Coding Train / Daniel Shiffman

// https://youtu.be/0ZONMNUKTfU
// https://thecodingtrain.com/challenges/c5-marching-squares

let marchSq0;
let marchsq1;
let marchingSquares = [];
let rez = 10;
let n = 4;
let useOSN = true;


let palette = [
  // Original anchors (cool + greens + minimal warm)
  [12, 71, 103], // deep teal
  [86, 110, 61], // olive green
  [185, 164, 76], // muted gold

  // --- Added teal family ---
  [18, 90, 128], // teal-blue
  [24, 112, 155], // bright teal
  [36, 134, 160], // dusty aqua
  [50, 150, 165], // clearer cyan-teal
  [70, 175, 180], // soft aqua sky
  [95, 200, 195], // pale aqua (lightest)

  // --- Softer minimal warm tones ---
  [230, 150, 74], // soft amber (less orange than original)
  [205, 130, 60], // muted clay
  [150, 95, 55], // earthy brown (cooler counterbalance)
];




function setup() {
  // Dispose previous buffers
  if (marchingSquares) {
    for (let m of marchingSquares) {
      m.dispose();
    }
  }
  let canvasSize = min(windowWidth, windowHeight);
  let canvas = createCanvas(800, 800);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  for (let i = 0; i < 3; i++) {
    marchingSquares.push(new MarchingSquares(rez, useOSN));
  }
}

function draw() {
  clear();
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < marchingSquares.length; i++) {
      let m = marchingSquares[i];
      m.addLines(random(palette));
      m.show();
    }
  }
  filter(BLUR, 2)
}

function mousePressed() {
  saveCanvas('pattern.png')
}
