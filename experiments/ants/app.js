const scale = 4;
const dpiScale = 3;
const frameRate = 60;
const numAnts = 100;

class PheromoneLayer {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = (dpiScale * window.innerWidth) / scale;
    this.canvas.height = (dpiScale * window.innerHeight) / scale;
    this.ctx = this.canvas.getContext("2d");
    this.particles = {};
    this.maxValue = 0;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(dpiScale, dpiScale);
    this.ctx.fillStyle = "#00FF00";
    Object.keys(this.particles).forEach((x) => {
      Object.keys(this.particles[x]).forEach((y) => {
        this.ctx.globalAlpha = this.particles[x][y] / this.maxValue;
        this.ctx.fillRect(
          x - Ant.antSize / 2,
          y - Ant.antSize / 2,
          Ant.antSize,
          Ant.antSize,
        );
      });
    });
    this.ctx.restore();
  }

  *neighborhood(nx, ny) {
    let radius = 5;
    if (this.particles[nx] != null && this.particles[nx][ny] != null) {
      radius = Math.round(radius * Math.sqrt(this.particles[nx][ny]));
    }
    for (let x = nx - radius; x <= nx + radius; x++) {
      if (this.particles[x] == null) {
        this.particles[x] = {};
      }
      const row = this.particles[x];
      for (let y = ny - radius; y <= ny + radius; y++) {
        if (row[y] == null) {
          row[y] = 0;
        }
        yield [
          row[y],
          x,
          y,
          Math.sqrt(Math.pow(nx - x, 2) + Math.pow(ny - y, 2)),
        ];
      }
    }
  }

  localMax(nx, ny) {
    let north = 0,
      east = 0,
      south = 0,
      west = 0;
    for (let [value, x, y, distance] of this.neighborhood(nx, ny)) {
      const dy = y - ny,
        dx = x - nx;
      if (dy < 0 && Math.abs(dy) >= Math.abs(dx)) {
        north += value / distance;
      }
      if (dx > 0 && Math.abs(dy) <= dx) {
        east += value / distance;
      }
      if (dy > 0 && Math.abs(dy) >= Math.abs(dx)) {
        south += value / distance;
      }
      if (dx < 0 && Math.abs(dy) <= Math.abs(dx)) {
        west += value / distance;
      }
    }
    const maxValue = Math.max(north, east, south, west);
    const directions = [
      [north, 0, -1],
      [east, 1, 0],
      [south, 0, 1],
      [west, -1, 0],
    ].filter(([value]) => value >= maxValue);
    if (directions.length === 4) {
      return [north, 0, 0];
    }
    return directions[Math.floor(directions.length * Math.random())];
  }

  spritz(nx, ny) {
    for (let [value, x, y, distance] of this.neighborhood(nx, ny)) {
      if (distance === 0) {
        this.particles[x][y] = Math.min(100, value + 1);
      } else {
        this.particles[x][y] = Math.min(100, value + 1 / distance);
      }
    }
  }

  tick() {
    // in place
    Object.keys(this.particles).forEach((x) => {
      Object.keys(this.particles[x]).forEach((y) => {
        this.particles[x][y] /= 1.15;
        if (this.particles[x][y] <= 0.1) {
          delete this.particles[x][y];
        } else {
          this.maxValue = Math.max(this.maxValue, this.particles[x][y]);
        }
      });
    });
  }
}

class Ant {
  constructor(canvas, foodPheromoneLayer) {
    this.direction = [
      Math.round(Math.random() * 2 - 1),
      Math.round(Math.random() * 2 - 1),
    ];
    this.directionChange = Math.min(1, Math.random() + 0.3);
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.x = Math.round((Math.random() * this.canvas.width) / dpiScale);
    this.y = Math.round((Math.random() * this.canvas.height) / dpiScale);
    this.foodPheromoneLayer = foodPheromoneLayer;
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(
      this.x - Ant.antSize / 2,
      this.y - Ant.antSize / 2,
      Ant.antSize,
      Ant.antSize,
    );
    this.ctx.restore();
  }

  tick() {
    this.foodPheromoneLayer.spritz(this.x, this.y);
    const [, dx, dy] = this.foodPheromoneLayer.localMax(this.x, this.y);

    if (dx + dy === 0) {
      if (Math.random() > this.directionChange) {
        this.direction = [
          Math.round(Math.random() * 2 - 1),
          Math.round(Math.random() * 2 - 1),
        ];
      }
      const [rdx, rdy] = this.direction;
      this.x += rdx;
      this.y += rdy;
    } else {
      this.x += dx;
      this.y += dy;
    }
  }
}

Ant.antSize = 1;

class AntCanvas {
  constructor(canvas, foodPheromoneLayer) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = (dpiScale * window.innerWidth) / scale;
    this.canvas.height = (dpiScale * window.innerHeight) / scale;
    this.foodPheromoneLayer = foodPheromoneLayer;
    this.antPopulation = new Array(numAnts).fill(0).map(() => this.spawn());
  }

  spawn() {
    return new Ant(this.canvas, this.foodPheromoneLayer);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(dpiScale, dpiScale);
    this.antPopulation.forEach((ant) => ant.draw());
    this.ctx.restore();
  }

  tick() {
    this.antPopulation.forEach((ant) => ant.tick());
  }
}

class Engine {
  constructor() {
    // const hungryCanvas = document.getElementsByClassName("hungry-canvas")[0];
    const foodCanvas = document.getElementsByClassName("food-canvas")[0];
    this.foodPheromoneLayer = new PheromoneLayer(foodCanvas);
    this.foodPheromoneLayer.draw();

    const antsCanvas = document.getElementsByClassName("ants-canvas")[0];
    this.antCanvas = new AntCanvas(antsCanvas, this.foodPheromoneLayer);
    this.antCanvas.draw();

    this.ticks = 0;
  }

  tick() {
    this.ticks += 1;
    // if (this.ticks > 90) {
    //   return;
    // }
    const start = new Date().getTime();
    this.foodPheromoneLayer.tick();
    this.antCanvas.tick();
    this.antCanvas.draw();
    this.foodPheromoneLayer.draw();
    const end = new Date().getTime();
    setTimeout(
      () => this.tick(new Date().getTime()),
      Math.max(0, 1000 / frameRate - (end - start)),
    );
  }
}

new Engine().tick();
