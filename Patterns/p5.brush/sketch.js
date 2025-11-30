// Minimally edited from https://editor.p5js.org/acamposuribe/sketches/oqlWTatWG


const C = {
    loaded: false,
    prop() {return this.height/this.width},
    isLandscape() {return window.innerHeight <= window.innerWidth * this.prop()},
    resize () {
        if (this.isLandscape()) {
          console.log("yes")
            document.getElementById(this.css).style.height = "100%";
            document.getElementById(this.css).style.removeProperty('width');
        } else {
            document.getElementById(this.css).style.removeProperty('height');
            document.getElementById(this.css).style.width = "100%";
        }
    },
    setSize(w,h,p,css) {
        this.width = w, this.height = h, this.pD = p, this.css = css;
    },
    createCanvas() {
        this.main = createCanvas(this.width,this.height,WEBGL), pixelDensity(this.pD), this.main.id(this.css), this.resize();
    }
};
C.setSize(1500,2000,1,'mainCanvas')

function windowResized () {
    C.resize();
}

//////////////////////////////////////////////////
// The example really starts here

// let palette = [
//   [240, 90, 88],
//   [84, 197, 201],
//   [61, 42, 137],
// ];
// let palette = [
//   [12, 71, 103],
//   [86, 110, 61],
//   [185, 164, 76],
//   [254, 153, 32],
//   [250, 121, 33],
// ];
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

function mousePressed() {
    saveCanvas('pattern.jpg')
}

function setup () {
    C.createCanvas()
    angleMode(DEGREES)
    background("#fffceb")
  
    translate(-width/2,-height/2)  
  
    // We create a grid here
    let num_cols = 6
    let num_rows = 6
    let border = 0;
    let col_size = (width - border) / num_cols
    let row_size = (height - border) / num_rows
  
    let brushes = [
      "spray",
      "rotring",
      "marker",
      "marker2",
      "cpencil",
      "hatch_brush",
      "pen",
      "2B",
      "HB",
      "2H",
    ];
    // We define the brushes for the hatches, and the brushes for the strokes
    let hatch_brushes = ["marker", "marker2"]
    let stroke_brushes = ["2H", "HB", "charcoal"]
    
    // Test Different Flowfields here: "zigzag", "seabed", "curved", "truncated"
    //brush.field("truncated")
    // You can also disable field completely with brush.noField()

    // We create the grid here
    for (let i = 0; i < num_rows; i++) {
        for (let j = 0; j < num_cols; j++) {
          
            // We fill 10% of the cells
            if (random() < 0.5) {
              // Set Fill
              brush.fill(random(palette), random(60,100))
              brush.bleed(random(0.2,0.5))
              brush.fillTexture(0.55,0.8)
            } 
          
            // We stroke + hatch the remaining
            else {
              // Set Stroke
              brush.set(random(brushes), random(palette))
          
              // Set Hatch
              // You set color and brush with .setHatch(brush_name, color)
              //brush.setHatch(random(hatch_brushes), random(palette))
              brush.setHatch(random(brushes), random(palette));
              // You set hatch params with .hatch(distance_between_lines, angle, options: see reference)
              brush.hatch(random(10,60), random(0,180), {rand: 0, continuous: false, gradient: false})
            }
          
            // We draw the rectangular grid here
            brush.rect(border/2 + col_size * j, border/2 + row_size * i, col_size, row_size)
          
            // Reset states for next cell
            brush.noStroke()
            brush.noFill()
            brush.noHatch()
        }
    }
  
}