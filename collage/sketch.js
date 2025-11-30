let images = [];
let shapes = [];
let activeShape = null;
let gui, pg, r, canvasSize;
let guiParams = {};
let shapeData = {};
//let spritesheet;
let s = 256;
let colors = [
  "black",
  "blue",
  "brown",
  "green",
  "grey",
  "orange",
  "pink",
  "purple",
  "red",
  "white",
  "yellow",
];
let presets, collage1, collage2;

function retrieveImages(img) {
  let spritesheet = img;
  let images = [];
  for (let y = 0; y < spritesheet.height; y += s) {
    for (let x = 0; x < spritesheet.width; x += s) {
      let img = spritesheet.get(x, y, s, s);
      images.push(img);
    }
  }
  return images;
}

async function loadPresets() {
  presets = {
    flower: await loadJSON("json_files/flower.json"),
    dog: await loadJSON("json_files/dog.json"),
    fish: await loadJSON("json_files/fish.json"),
    bird: await loadJSON("json_files/bird.json"),
  };
}

async function setup() {
  if (pg) pg.remove();
  canvasSize = min(windowWidth, windowHeight);
  let canvas = createCanvas(canvasSize, canvasSize, WEBGL);
  pg = createGraphics(width, height);
  r = canvasSize * 0.15;
  //console.log(r)

  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  background(0);

  for (let i = 0; i < colors.length; i++) {
    let c = colors[i];
    let img = await loadImage(`colorImages/${c}.jpg`);
    images.push(retrieveImages(img));
  }

  loadPresets();

  // GUI setup
  gui = new lil.GUI({
    title: "Scene Controls",
  });
  gui
    .add(
      {
        addShape: showAddShapeMenu,
      },
      "addShape"
    )
    .name("Add Shape");
  gui
    .add({ load: () => loadShapes(presets.flower) }, "load")
    .name("Load Flower Collage");
  gui
    .add({ load: () => loadShapes(presets.dog) }, "load")
    .name("Load Dog Collage");
  gui
    .add({ load: () => loadShapes(presets.fish) }, "load")
    .name("Load Fish Collage");
  gui
    .add({ load: () => loadShapes(presets.bird) }, "load")
    .name("Load Bird Collage");
  gui
    .add(
      {
        save: saveAllShapes,
      },
      "save"
    )
    .name("Save JSON");

  noLoop();
  redraw();
}

function draw() {
  background("#82c8e5");

  for (let s of shapes) {
    push();
    translate(s.pos.x, s.pos.y);
    rotate(s.angle);
    shearX(s.shearAngle);
    if (s === activeShape) stroke("yellow");
    else noStroke();
    s.show();
    pop();
  }

  pg.push();
  pg.background("#fdfff7");
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    let c = color(i + 1, 0, 0);
    pg.push();
    pg.translate(width / 2 + s.pos.x, height / 2 + s.pos.y);
    s.drawForPicking(pg, c);
    pg.pop();
  }
  pg.pop();
}

// Unfortunately this is a little buggy!
function mousePressed() {
  activeShape = null;
  // read from pick buffer
  let px = pg.get(mouseX, mouseY);
  let id = red(px) - 1;

  if (id >= 0 && id < shapes.length) {
    activeShape = shapes[id];
    let s = shapes.splice(id, 1)[0];
    shapes.push(s);
    buildGUIFor(activeShape);
    redraw();
  }
}

function buildGUIFor(shape) {
  if (gui) gui.destroy();
  gui = new lil.GUI({
    title: `${shape.name} Controls`,
  });

  let gFolder = gui.addFolder("Global");
  gFolder
    .add(
      {
        addShape: showAddShapeMenu,
      },
      "addShape"
    )
    .name("Add Shape");
  gFolder
    .add(
      {
        save: saveAllShapes,
      },
      "save"
    )
    .name("Save JSON");

  let tFolder = gui.addFolder("Transform");
  guiParams = {
    x: shape.pos.x,
    y: shape.pos.y,
    scale: shape.sc,
    angle: shape.angle,
    shearAngle: shape.shearAngle,
    ...shape.params,
  };

  tFolder
    .add(guiParams, "x", -width / 2, width / 2, 1)
    .onChange(() => updateShape(shape));
  tFolder
    .add(guiParams, "y", -height / 2, height / 2, 1)
    .onChange(() => updateShape(shape));
  tFolder
    .add(guiParams, "scale", 10, width / 2, 1)
    .onChange(() => updateShape(shape));
  tFolder
    .add(guiParams, "angle", -PI, PI, 0.01)
    .onChange(() => updateShape(shape));
  tFolder
    .add(guiParams, "shearAngle", -PI, PI, 0.01)
    .onChange(() => updateShape(shape));
  tFolder
    .add(
      {
        delete: () => deleteShape(shape),
      },
      "delete"
    )
    .name("Delete Shape");
  tFolder.close();

  let pFolder = gui.addFolder("Shape Parameters");
  for (let key in shape.params) {
    pFolder
      .add(guiParams, key, 0.1, 10, 0.1)
      .onChange(() => updateShape(shape));
  }
  pFolder.open();
}

function showAddShapeMenu() {
  let types = [
    "Astroid",
    "Bicorn",
    "Butterfly",
    "CandyCorn",
    "CassiniOval",
    "Ceva",
    "Circle",
    "Clover",
    "Craniod",
    "Deltoid",
    "Flower",
    "Gear",
    "Heart",
    "KissCurve",
    "MalteseCross",
    "Polygon",
    "Superellipse",
    "Supershape",
    "Tear",
  ];
  let options = {
    type: "Superellipse",
    color: "blue",
  };

  let tempGUI = new lil.GUI({
    title: "Add New Shape",
  });
  tempGUI.add(options, "type", types).name("Shape Type");
  tempGUI.add(options, "color", colors).name("Image Color");
  tempGUI
    .add(
      {
        add: () => {
          addShape(options.type, options.color);
          tempGUI.destroy();
        },
      },
      "add"
    )
    .name("Create");
}

function addShape(type, color) {
  let pos = createVector(0, 0);
  let { img, colorIndex } = chooseImage(color);
  let sc = r;
  let angle = 0;
  let shearAngle = 0;
  let newShape;

  switch (type) {
    case "Astroid":
      newShape = new Astroid(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 1,
        },
        angle,
        shearAngle
      );
      break;
    case "Bicorn":
      newShape = new Bicorn(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 1,
        },
        angle,
        shearAngle
      );
      break;
    case "Butterfly":
      newShape = new Butterfly(pos, img, colorIndex, sc, {}, angle, shearAngle);
      break;
    case "CandyCorn":
      newShape = new CandyCorn(
        pos,
        img,
        colorIndex,
        sc,
        { a: 1 },
        angle,
        shearAngle
      );
      break;
    case "CassiniOval":
      newShape = new CassiniOval(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 0.6,
          b: 1,
        },
        angle,
        shearAngle
      );
      break;
    case "Ceva":
      newShape = new Ceva(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 1,
        },
        angle,
        shearAngle
      );
      break;
    case "Circle":
      newShape = new Circle(pos, img, colorIndex, sc, {}, angle, shearAngle);
      break;
    case "Clover":
      newShape = new Clover(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 1,
          m: 4,
        },
        angle,
        shearAngle
      );
      break;
    case "Craniod":
      newShape = new Craniod(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 0.6,
          b: 1.7,
          m: 0,
        },
        angle,
        shearAngle
      );
      break;
    case "Deltoid":
      newShape = new Deltoid(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 1,
        },
        angle,
        shearAngle
      );
      break;
    case "Flower":
      newShape = new Flower(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          m: 8,
        },
        angle,
        shearAngle
      );
      break;
    case "Gear":
      newShape = new Gear(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 4,
          m: 8,
        },
        angle,
        shearAngle
      );
      break;
    case "Heart":
      newShape = new Heart(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 1,
        },
        angle,
        shearAngle
      );
      break;
    case "KissCurve":
      newShape = new KissCurve(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 1,
        },
        angle,
        shearAngle
      );
      break;
    case "MalteseCross":
      newShape = new MalteseCross(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 1,
        },
        angle,
        shearAngle
      );
      break;
    case "Polygon":
      newShape = new Polygon(
        pos,
        img,
        colorIndex,
        sc,
        {
          m: 6,
        },
        angle,
        shearAngle
      );
      break;
    case "Superellipse":
      newShape = new Superellipse(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 1,
          m: 4,
        },
        angle,
        shearAngle
      );
      break;
    case "Supershape":
      newShape = new Supershape(
        pos,
        img,
        colorIndex,
        sc,
        {
          a: 1,
          b: 1,
          m: 8,
          n1: 1,
          n2: 1,
          n3: 1,
        },
        angle,
        shearAngle
      );
      break;
    case "Tear":
      newShape = new Tear(
        pos,
        img,
        colorIndex,
        sc,
        {
          m: 4,
        },
        angle,
        shearAngle
      );
      break;
  }

  shapes.push(newShape);
  activeShape = newShape;
  buildGUIFor(newShape);
  redraw();
}

function chooseImage(color) {
  let choice, imageColor, colorIndex;
  switch (color) {
    case "black":
      colorIndex = 0;
      break;
    case "blue":
      colorIndex = 1;
      break;
    case "brown":
      colorIndex = 2;
      break;
    case "green":
      colorIndex = 3;
      break;
    case "grey":
      colorIndex = 4;
      break;
    case "orange":
      colorIndex = 5;
      break;
    case "pink":
      colorIndex = 6;
      break;
    case "purple":
      colorIndex = 7;
      break;
    case "red":
      colorIndex = 8;
      break;
    case "white":
      colorIndex = 9;
      break;
    case "yellow":
      colorIndex = 10;
      break;
  }
  imageColor = images[colorIndex];
  choice = random(imageColor);
  return { img: choice, colorIndex };
}

function deleteShape(shape) {
  shapes = shapes.filter((s) => s !== shape);
  activeShape = null;
  gui.destroy();
  redraw();
}

function updateShape(shape) {
  shape.pos.set(guiParams.x, guiParams.y);
  shape.sc = guiParams.scale;
  shape.angle = guiParams.angle;
  shape.shearAngle = guiParams.shearAngle;

  let newParams = {};
  for (let k in shape.params) newParams[k] = guiParams[k];
  shape.updateParams(newParams);
  shape.applyTornEdge();
  redraw();
}

function saveAllShapes() {
  shapeData = shapes.map((s) => s.toJSON());
  saveJSON(shapeData, "shapes.json");
}

function loadShapes(data) {
  shapes = [];
  for (let s of data) {
    //let pos = createVector(s.pos.x, s.pos.y);
    let pos = createVector(s.pos.x*canvasSize, s.pos.y*canvasSize);
    let colorIndex = s.colorIndex || 0;
    let img = random(images[colorIndex]);
    //let sc = s.sc || 100;
    let sc = s.sc * canvasSize || 100;
    let params = s.params || {};
    let angle = s.angle || 0;
    let shearAngle = s.shearAngle || 0;
    let newShape;

    switch (s.type) {
      case "Astroid":
        newShape = new Astroid(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Bicorn":
        newShape = new Bicorn(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Butterfly":
        newShape = new Butterfly(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "CandyCorn":
        newShape = new CandyCorn(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "CassiniOval":
        newShape = new CassiniOval(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Ceva":
        newShape = new Ceva(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Clover":
        newShape = new Clover(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Circle":
        newShape = new Circle(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Craniod":
        newShape = new Craniod(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Deltoid":
        newShape = new Deltoid(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Flower":
        newShape = new Flower(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Gear":
        newShape = new Gear(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Heart":
        newShape = new Heart(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "KissCurve":
        newShape = new KissCurve(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "MalteseCross":
        newShape = new MalteseCross(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Polygon":
        newShape = new Polygon(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Superellipse":
        newShape = new Superellipse(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Supershape":
        newShape = new Supershape(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      case "Tear":
        newShape = new Tear(
          pos,
          img,
          colorIndex,
          sc,
          params,
          angle,
          shearAngle
        );
        break;
      default:
        continue;
    }
    newShape.angle = angle;
    newShape.shearAngle = shearAngle;
    newShape.pos = pos.copy();
    newShape.colorIndex = colorIndex;
    newShape.img = img;
    newShape.sc = sc;
    newShape.updateParams(params);
    newShape.applyTornEdge();
    shapes.push(newShape);
  }
  activeShape = null;
  redraw();
}

// Function to save the canvas as an image when 's' key is pressed
function keyPressed() {
  if (key === "s" || key === "S") {
    save("collage.jpg");
  }
}
