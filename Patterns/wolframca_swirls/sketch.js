// The basic code is from:

// Wolfram Elementary CA
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/challenges/179-wolfram-ca
// https://youtu.be/Ggxt06qSAe4

// Design inspired by Sunny Image of Rule 110 (1997), Igor Bakshee // https://www.wolframscience.com/gallery-of-art/Sunny-Image-of-Rule-110.html

// Rulesets
// https://mathworld.wolfram.com/ElementaryCellularAutomaton.html

// Array to store the state of each cell.
let cells = [];
// Rule value
// 57, 86, 109, 150, 181, 182
let ruleValue = 109;//182;
// The ruleset string
let ruleSet;
// Width of each cell in pixels
let w = 16;
// y-position
let y = 0;

let circles = [];

// function mousePressed() {
//   save('img.png');
// }

function setup() {
  //createCanvas(windowWidth, windowHeight);
 
  createCanvas(780 + w/2, 400);
  // Convert the rule value to a binary string.
  ruleSet = ruleValue.toString(2).padStart(8, "0");

  // Calculate the total number of cells based on canvas width.-
  let total = width / w;
  // Initialize all cells to state 0 (inactive).
  for (let i = 0; i < total; i++) {
    cells[i] = 0;
    // Set the middle cell to state 1 (active) as the initial condition.
    cells[floor(total / 2)] = 1;
    circles.push(new Swirl(w));

     //background(255)
    background(12, 71, 103);
  }
  y = w / 2;
}

function draw() {
  // Draw each cell based on its state.
  for (let i = 0; i < cells.length; i++) {
    let x = w/2+ i * w;

    noStroke();
    if (cells[i] === 1) {
      circles[i].show(x, y);
    }
  }

  // Move to the next row.
  y += w;

  // Prepare an array for the next generation of cells.
  let nextCells = [];

  // Iterate over each cell to calculate its next state.
  let len = cells.length;
  for (let i = 0; i < len; i++) {
    // Calculate the states of neighboring cells
    let left = cells[(i - 1 + len) % len];
    let right = cells[(i + 1) % len];
    let state = cells[i];
    // Set the new state based on the current state and neighbors.
    let newState = calculateState(left, state, right);
    nextCells[i] = newState;
  }

  // Update the cells array for the next generation.
  cells = nextCells;
}

function calculateState(a, b, c) {
  // Create a string representing the state of the cell and its neighbors.
  let neighborhood = "" + a + b + c;
  // Convert the string to a binary number
  let value = 7 - parseInt(neighborhood, 2);
  // Return the new state based on the ruleset.
  return parseInt(ruleSet[value]);
}

function mousePressed() {
  saveCanvas('pattern.jpg')
}
