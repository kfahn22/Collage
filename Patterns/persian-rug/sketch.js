// This code ia a p5 implementation of the Persian Rug algorithm and generates a random Persian Rug from a color palettte
// Note that it is possible to randomly get a boring rug. Just press play again until you get a nice one!

// Read about the Persian rug algorithm; https://archive.bridgesmathart.org/2005/bridges2005-9.pdf

// Learn more here: https://github.com/kfahn22/Persian-Rug

// To learn more about recursion, watch Daniel Shiffman's Recursion Coding Challenge
// https://thecodingtrain.com/challenges/77-recursion

// Based on this Processing sketch (https://github.com/kfahn22/Persian-Rug/blob/main/sketch.pdez), which is adapted from https://stackoverflow.com/questions/26226531/persian-rug-recursion

// I am using the method for choosing colors from Dr. Eric Gossett https://www.youtube.com/watch?v=0wfPlzPvZiQ

let n = 10;
let sw = 4; // this can be adjusted up or down as desired
//let palette = [];
let colorIndexArray = [];

// let url =
//   "https://supercolorpalette.com/?scp=G0-hsl-6A2962-70367D-69438E-60519E-666FA9-7D94B0-94AFB8-A9C1BF-BDCBC6-D0D7D2-E2E4E2-F2F2F2";

// I am getting the palette from supercolorpalette.com because this is a convienent way to get a consistent color array with 12 values
let url =
  "https://supercolorpalette.com/?scp=G0-hsl-FFDA1F-FBAC23-F68128-F25A2C-1FB4FF-23DEFB-28F6E8-2CF2BD-691FFF-4023FB-2835F6-2C61F2";

let palette = [
  [12, 71, 103], // deep teal
  [86, 110, 61], // olive green
  [185, 164, 76], // muted gold
  [254, 153, 32], // warm orange
  [250, 121, 33], // sunset orange

  [31, 94, 129], // lighter teal-blue
  [67, 134, 78], // warmer olive-green
  [210, 185, 96], // lighter gold
  [255, 176, 62], // golden orange
  [255, 136, 58], // bright peach orange
  [204, 88, 31], // burnt sienna
  [104, 63, 40], // deep warm brown
];

function setup() {
  let canvasSize = Math.pow(2, n) + 1; // 257 x 257 for n = 8
  createCanvas(canvasSize, canvasSize);
  noLoop();

  // Initialize the color index array
  colorIndexArray = Array(canvasSize)
    .fill()
    .map(() => Array(canvasSize).fill(0));

  // Draw border
  let w = canvasSize - 1;
  let s = int(random(palette.length));
  drawBorder(0, 0, w, w, s);

  // Choose colors for the internal grid
  let shift = floor(random(1, palette.length));
  chooseColor(0, w, 0, w, shift);

  // filter(BLUR, 4)

  // Save the result
  // saveCanvas("persian_rug", "jpg");
}

function drawBorder(left, top, right, bottom, colorIndex) {
  let c = palette[colorIndex];
  stroke(c);
  strokeWeight(sw);
  line(left, top, right, top); // Top
  line(left, bottom, right, bottom); // Bottom
  line(left, top, left, bottom); // Left
  line(right, top, right, bottom); // Right
}

function chooseColor(left, right, top, bottom, shift) {
  if (left < right - 1) {
    let newIndex =
      (getIndex(colorIndexArray[left][top]) +
        getIndex(colorIndexArray[right][top]) +
        getIndex(colorIndexArray[left][bottom]) +
        getIndex(colorIndexArray[right][bottom]) +
        shift) %
      palette.length;

    let col = palette[newIndex];
    let midCol = floor((left + right) / 2);
    let midRow = floor((top + bottom) / 2);

    // Draw middle lines
    stroke(col);
    strokeWeight(sw);
    line(left + 1, midRow, right - 1, midRow); // Horizontal
    line(midCol, top + 1, midCol, bottom - 1); // Vertical

    // Update color index array
    colorIndexArray[midCol][midRow] = newIndex;

    // Recursive calls
    chooseColor(left, midCol, top, midRow, shift);
    chooseColor(midCol, right, top, midRow, shift);
    chooseColor(left, midCol, midRow, bottom, shift);
    chooseColor(midCol, right, midRow, bottom, shift);
  }
}

function getIndex(colorIndex) {
  // Directly use the color index from the array
  return colorIndex;
}

function mousePressed() {
  saveCanvas("pattern.jpg");
}
