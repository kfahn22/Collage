class Swirl {
  constructor(w) {
    this.w = w;
   // this.col = random(colors);
    this.sw = random(0.5, 1.5);
    this.n = 20;
    this.colors = [
      [12, 71, 103],
      [86, 110, 61],
      [185, 164, 76],
      [254, 153, 32],
      [250, 121, 33],
    ];
    // this.colors = [
    //   [240, 90, 88],
    //   [247, 105, 102],
    //   // [226, 78, 80],
    //   // [235, 112, 120],
    //   // [255, 98, 92],
    //   // [219, 72, 75],

    //   [84, 197, 201],
    //   [73, 182, 188],
    //   // [94, 210, 214],
    //   // [68, 168, 173],
    //   // [100, 224, 226],

    //   [61, 42, 137],
    //   // [71, 54, 150],
    //   // [49, 34, 118],
    // ];

    let reds = [
      [240, 90, 88], // base
      [247, 105, 102], // slightly brighter
      [226, 78, 80], // slightly darker
      [235, 112, 120], // softer red
      [255, 98, 92], // more vivid
      [219, 72, 75], // deep coral
    ];

    let aquas = [
      [84, 197, 201], // base
      [73, 182, 188], // slightly darker
      [94, 210, 214], // slightly brighter
      [68, 168, 173], // muted aqua
      [100, 224, 226], // vivid aqua (highlight)
    ];

    let violet = [
      [61, 42, 137], // base
      [71, 54, 150], // brighter violet
      [49, 34, 118], // deeper violet
    ];


    this.col = random(this.colors);
  }

  swirl() {
    //translate(width / 2, height / 2);
    for (let i = 0; i < this.n; i++) {
      stroke(random(this.colors));
      strokeWeight(this.sw);
      noFill();
      let x = random(2);
      let y = random(2);
      let r = random(this.w)
      circle(x, y, r);
    }
  }
  
  show(x,y) {
    push()
    translate(x,y);
    this.swirl();
    pop()
  }
}
