/* Ten Print with Pictorial font

Note: tried to use p5 2.0 and ran into trouble. Reverting back to older version.
References:
https://thecodingtrain.com/challenges/76-10Print
https://www.fontspace.com/chase-zen-blight-font-f20861
Gembats Font by GemFonts: https://www.fontspace.com/gembats-1-font-f4107
Manfred Klein: https://www.fontspace.com/griddies-font-f8177
Etherbrian: https://www.fontspace.com/patternalia-font-f2308
https://www.fontspace.com/corners-and-borders-font-f12948t-f7128
https://www.fontspace.com/sl-squiggles-font-f6723
Lady Timeless: https://www.fontspace.com/cathys-art-deco-dings-lt-font-f3535
Digital Magic: https://www.fontspace.com/hdgems7-font-f5946
Cathy's art deco dings - brighter use solid change this out
*/

let hexPalettes = [
  ["#faf2a1", "#759aab", "#453f78", "#352e56", "#fcb07e"],
  ["#064789", "#427aa1", "#679436", "#a5be00"],
  ["#000", "#77aca2", "#9dbebb", "#2b2d42"],
  ["#571f4e", "#5d5179", "#4f759b", "#92c9b1", "##a2faa3"],
  ["#904c77", "#e49ab0", "#a3c3d9", "#26547c", "#957d95"],
];

let palette = ["#c20114", "#6d7275", "#c7d6d5", "#ecebf3"];
let palette1 = ["#28656c", "#968e88", "#82b498", "#0e273c"];

let x, y, stopX, stopY; // 10print variables
let canvas, ncols, nrows, marginX, marginY;

// font variables
let options, choice, font, char, char1, char2, bbox, textS;
let fonts = [];

// Function to create array of all the alphabet characters from chatGPT
let alphabet = [
  //...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)),
];

function preload() {
  options = [data.Designs_Galore];
  // options = [data.Griddies, data.Squiggles, data.Corners, data.KR_corner,
  //			data.Deco_dings, data.HDGEMS7]
  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    fonts[i] = loadFont(option.font);
  }
}

function setup() {
  if (canvas) {
    canvas.remove();
  }
  angleMode(DEGREES);
   
  // Set canvas size
  let canvasW, canvasH;

  // Randomly choose a font
  let i = floor(random(options.length));
  choice = options[i];
  font = fonts[i];
  textFont(font);
  textS = choice.textS;
  textSize(textS); // determine spacing based on character size

  let characters = choice.characters;
  if (choice.noChar == 1 && characters.length == 1) {
    char = characters[0];
    char1 = characters[0].letter;
  } else if (choice.noChar == 1 && characters.length > 1) {
    char = random(characters);
    //console.log(char)
    char1 = char.letter;
  } else {
    char1 = characters[0][0].letter;
    char2 = characters[0][1].letter;
  }
  // Find bounding box of first character
  bbox = font.textBounds(char1, width / 2, height / 2);
  //   marginX = 2 * bbox.w;
  //   marginY = 2 * bbox.h;
  marginX = 0;
  marginY = 0;
  nrows = ~~((windowHeight - marginX) / bbox.h);
  ncols = ~~((windowWidth - marginY) / bbox.w);
  canvas = createCanvas(~~bbox.w * ncols + marginX, ~~bbox.h * nrows + marginY);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  if (choice.useHSB) {
    colorMode(HSB);
    background(0);
  } else {
    palette = choice.palette;
    background(choice.backgroundColor);
  }

  x = 0;
  y = 0;
  // x = marginX / 2;
  // y = marginY / 2;
}

function draw() {
  
  if (choice.noChar == 2) {
    tenPrintTwoChar(char1, char2);
  } else {
    tenPrintOneChar(char);
  }

  if (y > height - stopY) {
    noLoop();
  }
}

function centralDesign(char, r) {
  for (let i = 0; i < 360; i += 1) {
    let x = r * cos(i);
    let y = r * sin(i);
    push();
    translate(width / 2 + x, height / 2 + y);
    //rotate(i)
    textSize(100);
    stroke(0);
    strokeWeight(10);
    text(char, 0, 0);
    pop();
  }
}

function hsbColor(y, r1, r2) {
  let dy = abs(y - height / 2);
  let r = map(dy, 0, height / 2, r1, r2);
  fill(r, 100, 100);
}

function tenPrintTwoChar(char1, char2) {
  noStroke();
  if (choice.useHSB) {
    fill(y, 120, 220);
  } else {
    let c = color(random(palette));
    fill(c);
  }
  //textSize(choice.textS * 0.95)
  textAlign(CENTER, CENTER);
  if (random(1) < 0.2) {
    text(char1, x + bbox.w / 2, y + bbox.h / 2);
  } else {
    text(char2, x + bbox.w / 2, y + bbox.h / 2);
  }

  x = x + bbox.w;
  if (x > width - marginX * choice.startX) {
    x = marginX * choice.startX;
    y = y + bbox.h;
  }
}

// Have to fix case where bbox.x != bbox.y and rotated in first column??
function tenPrintOneChar(char) {
  let char1 = char.letter;
  let a = char.angle;
  let threshold = char.threshold;
  let c = color(random(palette));
  c.setAlpha(choice.alpha);
  stroke(c);
  strokeWeight(2);
  fill(c);
  //hsbColor(y, 0, 220)
  textAlign(CENTER, CENTER);
  let r = random(1);
  if (r < threshold) {
    push();
    translate(x + bbox.w / 2, y + bbox.h / 2);
    text(char1, 0, 0);
    pop();
  } else {
    push();
    if (bbox.w == bbox.h || a == 180) {
      translate(x + bbox.w / 2, y + bbox.h / 2);
      stopX = marginX / 2;
    } else {
      // have contingency for angle == 90
      translate(x + bbox.h / 2, y + bbox.w / 2);
      stopX = marginY / 2;
      stopY = marginX / 2;
    }
    rotate(a);
    text(char1, 0, 0);
    pop();
  }
  //determineStoppingPoint(choice, x, y)
  if (choice.overlap) {
    x = x + bbox.w / 2;
    if (x > width - 2 * stopX) {
      x = marginX * choice.startX;
      y = y + bbox.h / 2;
    }
  } else {
    x = x + bbox.w;
    if (x > width - stopX) {
      x = marginX * choice.startX;
      y = y + bbox.h;
    }
  }
  if (choice.overlap) {
    stopY = 1.5 * marginY * choice.startY;
  } else {
    stopY = marginY * choice.startY;
  }
}

function determineStoppingPoint(choice, x, y) {
  determineHeightStop();
  if (choice.overlap) {
    // overlap characters by 1/2 char width and height
    x = x + bbox.w / 2;
    if (x > width - 2 * stopX) {
      // reset X at end of row
      x = marginX / 2; //*choice.startX;
      if (y < stopY) {
        y = y + bbox.h / 2;
      }
    }
  } else {
    x = x + bbox.w;
    if (x > width - stopX) {
      // reset X at end of row
      x = marginX / 2; //*choice.startX;
      if (y < stopY) {
        y = y + bbox.h;
      }
    }
  }
}

// Determine noLoop() condition
function determineHeightStop() {
  if (choice.overlap) {
    stopY = 1.5 * marginY * choice.startY;
  } else {
    stopY = marginY * choice.startY;
  }
}

function addShadow() {
  let shadowColor = color(248, 31, 23, 70);
  let shadowOffsetX = 5;
  let shadowOffsetY = 5;
  let shadowBlur = 10;
  //Apply the shadow
  shadow(shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor);
}

function mousePressed() {
  saveCanvas('pattern.jpg');
}
