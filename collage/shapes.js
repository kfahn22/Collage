class Shape {
  constructor(
    pos,
    img,
    colorIndex,
    sc,
    params = {},
    angle = 0,
    shearAngle = 0
  ) {
    this.pos = pos || createVector(0, 0);
    this.img = img;
    this.colorIndex = colorIndex || 0;
    this.name = "Shape";
    this.sc = sc;
    this.params = params;
    this.angle = angle;
    this.shearAngle = shearAngle;
    this.points = [];
    this.delta = createVector(random(3), random(3));
    this.applyTornEdge()
    //this.centroid = this.calculateCentroid()
  }

  applyTornEdge(intensity = 5, scale = 0.2) {
    // Slightly displace each vertex using Perlin noise
    for (let i = 0; i < this.points.length; i++) {
      let v = this.points[i];
      let n = noise(v.x * scale, v.y * scale);
      let offsetAngle = n * TWO_PI;
      let r = random(-intensity, intensity) * n;
      v.x += r * cos(offsetAngle);
      v.y += r * sin(offsetAngle);
    }
  }

  calculateCentroid() {
    let sum = createVector(0, 0);
    for (let v of this.points) sum.add(v);
    return sum.div(this.points.length);
  }

  // show() {
  //   let centroid = this.calculateCentroid();
  //   let uvCoords = [];

  //   for (let v of this.points) {
  //     let relative = p5.Vector.sub(v, centroid);
  //     let uv = createVector(
  //       map(relative.x, -this.sc * 2, this.sc * 2, 0, 1),
  //       map(relative.y, -2 * this.sc, 2 * this.sc, 0, 1)
  //     );
  //     uvCoords.push(uv);
  //   }

  //   textureMode(NORMAL);
  //   push();
  //   translate(this.pos.x, this.pos.y);
  //   rotate(this.angle);
  //   shearX(this.shearAngle);

  //   if (this.img) texture(this.img);

  //   // Outer feathered edge
  //   for (let i = 0; i < 4; i++) {
  //     beginShape();
  //     stroke(255, 255, 255, 60); // faint white tear
  //     strokeWeight(3 - i * 0.6);
  //     fill(255, 255, 255, 0);
  //     for (let j = 0; j < this.points.length; j++) {
  //       let v = this.points[j];
  //       let uv = uvCoords[j];
  //       vertex(v.x + random(-1, 1), v.y + random(-1, 1), v.z, uv.x, uv.y);
  //     }
  //     endShape(CLOSE);
  //   }

  //   // Main filled texture
  //   beginShape();
  //   noStroke();
  //   for (let j = 0; j < this.points.length; j++) {
  //     let v = this.points[j];
  //     let uv = uvCoords[j];
  //     vertex(v.x, v.y, v.z, uv.x, uv.y);
  //   }
  //   endShape(CLOSE);
  //   pop();
  // }

  show() {
    let centroid = this.calculateCentroid();
    let uvCoords = [];

    for (let v of this.points) {
      let relative = p5.Vector.sub(v, centroid);
      let uv = createVector(
        map(relative.x, -this.sc * 2, this.sc * 2, 0, 1),
        map(relative.y, -2 * this.sc, 2 * this.sc, 0, 1)
      );
      uvCoords.push(uv);
    }

    textureMode(NORMAL);
    push();
    if (this.img) texture(this.img);
    beginShape();
    for (let j = 0; j < this.points.length; j++) {
      let v = this.points[j];
      let uv = uvCoords[j];
      vertex(v.x, v.y, v.z, uv.x, uv.y);
    }
    endShape(CLOSE);
    pop();
  }

  drawForPicking(pg, c) {
    pg.push();
    pg.translate(this.pos.x, this.pos.y);
    pg.rotate(this.angle);
    pg.noStroke();
    pg.fill(c);
    pg.beginShape();
    for (let v of this.points) pg.vertex(v.x, v.y);
    pg.endShape(CLOSE);
    pg.pop();
  }

  updateParams(newParams) {
    Object.assign(this.params, newParams);
    this.points = [];
    this.addPoints();
  }

  toJSON() {
    return {
      type: this.name,
      pos: {
        x: this.pos.x/canvasSize,
        y: this.pos.y/canvasSize,
      },
      colorIndex: this.colorIndex,
      sc: this.sc/canvasSize,
      params: this.params,
      angle: this.angle,
      shearAngle: this.shearAngle,
    };
  }
}

class Astroid extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Astroid";
    this.addPoints();
    this.applyTornEdge(6, 0.1);

  }

  addPoints() {
    const { a, b } = this.params;
    for (let theta = 0; theta < TWO_PI; theta += 0.05) {
      let x = this.sc * a * pow(cos(theta), 3);
      let y = this.sc * b * pow(sin(theta), 3);
      this.points.push(createVector(x, y));
    }
  }
}

class Bicorn extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Bicorn";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { a, b } = this.params;
    for (let theta = 0.01; theta < TWO_PI - 0.01; theta += 0.05) {
      let x = this.sc * a * sin(theta);
      let y = (this.sc * b * pow(cos(theta), 2)) / (2 + cos(theta));
      this.points.push(createVector(x, y));
    }
  }
}

// https://mathcurve.com/courbes2d/ornementales/ornementales.shtml
class Butterfly extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Butterfly";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    let sc = this.sc * 0.5
    for (let theta = 0; theta < TWO_PI; theta += 0.01) {
      let r = -3 * cos(2 * theta) + sin(7 * theta) - 1;
      const x = sc * r * cos(theta);
      const y = -sc * r * sin(theta);
      this.points.push(createVector(x, y));
    }
  }
}

class CandyCorn extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "CandyCorn";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { a } = this.params;
    for (let theta = 0; theta < TWO_PI; theta += 0.05) {
      let x = this.sc * cos(theta);
      let y =
        (this.sc * a * sin(theta) * (2 - cos(theta))) /
        (3 + pow(sin(theta), 2));
      this.points.push(createVector(x, y));
    }
  }
}

class CassiniOval extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "CassiniOval";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { a, b } = this.params;
    for (let theta = 0; theta < TWO_PI; theta += 0.05) {
      let root = sqrt(pow(b / a, 4) - pow(sin(2 * theta), 2));
      let r = pow(a, 2) * (cos(2 * theta) + root);
      let x = this.sc * r * cos(theta);
      let y = this.sc * r * sin(theta);
      this.points.push(createVector(x, y));
    }
  }
}

class Ceva extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Ceva";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { a, b } = this.params;
    for (let theta = 0; theta < TWO_PI; theta += 0.05) {
      let root = sqrt(pow(b / a, 4) - pow(sin(2 * theta), 2));
      let x = this.sc * (cos(3 * theta) + 2 * cos(theta));
      let y = this.sc * sin(3 * theta);
      this.points.push(createVector(x, y));
    }
  }
}

class Circle extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Circle";
    //this.params = {};
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    for (let theta = 0; theta < TWO_PI; theta += 0.05) {
      let x = this.sc * cos(theta) + this.delta.x;
      let y = this.sc * sin(theta) + this.delta.y;
      this.points.push(createVector(x, y));
    }
  }
}

class Clover extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Clover";
    //this.params = { m: 4 };
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { a, b, m } = this.params;
    for (let theta = 0; theta < TWO_PI; theta += 0.01) {
      let r = 1 + cos(floor(m) * theta) + pow(sin(floor(m) * theta), 2);
      let x = a * this.sc * r * cos(theta);
      let y = b * this.sc * r * sin(theta);
      this.points.push(createVector(x, y));
    }
  }
}

class Craniod extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Craniod";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const p = 0.75;
    const q = 0.75;
    const { a, b, m } = this.params;
    for (let theta = 0; theta < TWO_PI; theta += 0.05) {
      let r =
        a * sin(theta) +
        b * sqrt(1 - p * pow(cos(theta), 2)) +
        m * sqrt(1 - q * pow(cos(theta), 2));
      let x = this.sc * r * cos(theta);
      let y = this.sc * r * sin(theta);
      this.points.push(createVector(x, y));
    }
  }
}

//// https://mathcurve.com/courbes2d.gb/deltoid/deltoid.shtml
class Deltoid extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Deltoid";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { a, b } = this.params;
    for (let theta = 0; theta < TWO_PI; theta += 0.05) {
      let x = this.sc * (4 * a * pow(cos(theta / 2), 2) * cos(theta) - a);
      let y = this.sc * (4 * b * pow(sin(theta / 2), 2) * sin(theta));
      this.points.push(createVector(x, y));
    }
  }
}

class Flower extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Flower";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { a, m } = this.params;
    for (let theta = 0; theta < TWO_PI; theta += 0.01) {
      let r = a + cos(floor(m) * theta);
      let x = this.sc * r * cos(theta);
      let y = this.sc * r * sin(theta);
      this.points.push(createVector(x, y));
    }
  }
}

class Gear extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Gear";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  hyperbolicTan(theta) {
    const e = 2.71828;
    let l = pow(e, 2 * theta);
    return (l - 1) / (l + 1);
  }

  addPoints() {
    const { a, b, m } = this.params;
    for (let theta = 0; theta < 2 * PI; theta += 0.025) {
      let r = a + (1 / b) * this.hyperbolicTan(b * sin(m * theta));
      let x = this.sc * r * sin(theta);
      let y = this.sc * r * cos(theta);
      this.points.push(createVector(x, y));
    }
  }
}



class Heart extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Heart";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const sc = this.sc * 0.1;
    const { a, b } = this.params;
    for (let theta = 0.1; theta < TWO_PI; theta += 0.05) {
      const x = a * sc * 16 * pow(sin(theta), 3);
      const y =
        -sc * b * 
        (13 * cos(theta) -
          5 * cos(2 * theta) -
          2 * cos(3 * theta) -
          cos(4 * theta));
      this.points.push(createVector(x, y));
    }
  }
}


class KissCurve extends Shape {
  constructor(pos, img, colorIndex, sc, params) {
    super(pos, img, colorIndex, sc, params);
    this.name = "KissCurve";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { a, b } = this.params;
    for (let theta = 0.1; theta < TWO_PI; theta += 0.05) {
      let x = a * this.sc * cos(theta);
      let y = b * this.sc * pow(sin(theta), 3);
      this.points.push(createVector(x, y));
    }
  }
}

class MalteseCross extends Shape {
  constructor(pos, img, colorIndex, sc, params) {
    super(pos, img, colorIndex, sc, params);
    this.name = "MalteseCross";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { a, b } = this.params;
    for (let theta = 0.1; theta < TWO_PI; theta += 0.05) {
      let x = this.sc * +cos(theta) * (pow(cos(theta), 2) - a);
      let y = this.sc * +b * sin(theta) * pow(cos(theta), 2);
      this.points.push(createVector(x, y));
    }
  }
}
class Polygon extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Polygon";

    // Create the base polygon vertices
    this.points = this.addPoints();

    // Subdivide edges for smoother torn look
    this.points = this.getPolygonEdgePoints(this.points, 20);

    // Apply torn edge noise
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    let points = [];
    const { m = 5 } = this.params; // number of sides, default 5
    for (let theta = 0; theta < TWO_PI; theta += TWO_PI / floor(m)) {
      let x = this.sc * cos(theta);
      let y = this.sc * sin(theta);
      points.push(createVector(x, y));
    }
    return points;
  }

  getPolygonEdgePoints(vertices, stepsPerEdge = 20) {
    let points = [];
    for (let i = 0; i < vertices.length; i++) {
      let v1 = vertices[i];
      let v2 = vertices[(i + 1) % vertices.length];
      for (let t = 0; t < 1; t += 1 / stepsPerEdge) {
        let x = lerp(v1.x, v2.x, t);
        let y = lerp(v1.y, v2.y, t);
        points.push(createVector(x, y));
      }
    }
    return points;
  }
}

class Superellipse extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Superellipse";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  sgn(val) {
    if (val == 0) {
      return 0;
    }
    return val / abs(val);
  }

  addPoints() {
    const { a, b, m } = this.params;
    for (let theta = 0; theta < TWO_PI; theta += 0.05) {
      let na = 2 / m;
      let x = this.sc * pow(abs(cos(theta)), na) * a * this.sgn(cos(theta));
      let y = this.sc * pow(abs(sin(theta)), na) * b * this.sgn(sin(theta));
      this.points.push(createVector(x, y));
    }
  }
}

class Supershape extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Supershape";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { a, b, m, n1, n2, n3 } = this.params;
    for (let t = 0; t < TWO_PI; t += 0.05) {
      let r1 = pow(abs(cos((m * t) / 4) / a), n2);
      let r2 = pow(abs(sin((m * t) / 4) / b), n3);
      let r = pow(r1 + r2, -1 / n1);
      let x = this.sc * r * cos(t);
      let y = this.sc * r * sin(t);
      this.points.push(createVector(x, y));
    }
  }
}

class Tear extends Shape {
  constructor(pos, img, colorIndex, sc, params, angle, shearAngle) {
    super(pos, img, colorIndex, sc, params, angle, shearAngle);
    this.name = "Tear";
    this.addPoints();
    this.applyTornEdge(6, 0.1);
  }

  addPoints() {
    const { m } = this.params;
    for (let theta = 0; theta < TWO_PI; theta += 0.05) {
      let x = this.sc * cos(theta);
      let y = this.sc * sin(theta) * pow(sin(theta / 2), m);
      this.points.push(createVector(x, y));
    }
  }
}
