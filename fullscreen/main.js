// Globals
let canvas = {
  e: null, // Canvas element

  w: null, // Canvas width
  h: null, // Canvas height
  margin: null, // Margins (Vector2)
};

let colors = {};

const GRID_SIZE = 5;
const MAX_LENGTH = GRID_SIZE ** 2;
let grid;

let cellSize = 0;

let tryN = 1;

// Classes
class Grid {
  constructor (size) {
    this.size = size;

    this.data = undefined;
    this.path = undefined;
  }

  generate () {
    this.data = [];
    for (let i = 0; i < this.size; i ++) {
      this.data[i] = [];
      for (let j = 0; j < this.size; j ++)
        this.data[i][j] = new Cell(new Vector2(i, j));
    }

    this.path = [ this.data[0][0] ];
    this.data[0][0].set();
  }

  drawPath () {
    stroke(colors.white); strokeWeight(cellSize / 6); noFill();

    beginShape();
    this.path.forEach(node => {
      vertex(...node.canvasPos.array);
    });
    endShape();
  }

  getCell (pos) {
    if (pos.x >= 0 && pos.x < GRID_SIZE && pos.y >= 0 && pos.y < GRID_SIZE)
      return this.data[pos.x][pos.y];
    return undefined;
  }

  extendPath () {
    if (this.path.length >= MAX_LENGTH) {
      noLoop();
      return;
    }

    let head = this.path[this.path.length - 1];

    let next = head.next();
    if (next === undefined) {
      this.backtrack();
      return;
    }

    next.set();
    this.path.push(next);
  }

  backtrack () {
    let oldHead = this.path.pop();
    oldHead.reset();
  }
}

class Cell {
  constructor (pos) {
    this.pos = pos;

    this.neighbors = undefined;
    this.from = undefined;
    this.inPath = false;
  }

  get canvasPos () {
    return Vector2.mult(this.pos, cellSize)
      .add(canvas.margin)
      .add(cellSize / 2);
  }

  reset () {
    this.inPath = false;
    this.neighbors = undefined;
    this.from = undefined;
  }

  set () {
    // Neighbors
    const directions = [
      new Vector2( 0, -1),
      new Vector2(-1,  0),
      new Vector2( 1,  0),
      new Vector2( 0,  1),
    ];
    
    this.neighbors = [];
    for (let dir of directions) {
      let n = grid.getCell(Vector2.add(this.pos, dir));
      if (n) this.neighbors.push(n);
    }

    // Other
    this.inPath = true;
  }

  next () {
    let gn = this.neighbors
      .map((v, i) => [v, i])
      .filter(cell => !cell[0].inPath)
      .map(v => v[1]);

    if (gn.length > 0) return this.neighbors.splice(random(gn), 1)[0];
    else return undefined;

    // if (gn.length > 0) return random(gn);
    // else return undefined;
  }
}

// p5 Functions
function setup () {
  // Canvas
  canvas.e = createCanvas();
  canvas.e.parent(`container`);
  windowResized();

  frameRate(60);

  // Variables
  colors = {
    black: color(0),
    gray: color(128),
    white: color(255),

    green: color(0, 255, 0),
    blue: color(0, 0, 255),
    red: color(255, 0, 0),
  }

  // Grid Setup
  grid = new Grid(GRID_SIZE);
  grid.generate();
}

function draw () {
  // Clearing
  background(colors.black);

  // Logic
  for (let i = 0; i < tryN; i ++)
    grid.extendPath();

  // Drawing
  grid.drawPath();

  // noLoop();
}

function windowResized () {
  const size = { w: window.innerWidth, h: window.innerHeight };
  canvas.w = size.w; canvas.h = size.h;
  resizeCanvas(size.w, size.h);


  const square = Math.min(size.w, size.h);

  canvas.margin = new Vector2(
    (size.w - square) / 2,
    (size.h - square) / 2
  );
  cellSize = square / GRID_SIZE;
}