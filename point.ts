export class Point {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) {
      this.x = x || 0;
      this.y = y || 0;
    }
    static distance(a: Point, b: Point) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    static interpolate(p1: Point, p2: Point, t: number) {
      let x = p1.x * (1 - t) + p2.x * t;
      let y = p1.y * (1 - t) + p2.y * t;
      return new Point(x, y);
    }
    add(p: Point) {
      this.x += p.x;
      this.y += p.y;
      return this;
    }
    subtract(p: Point) {
      this.x -= p.x;
      this.y -= p.y;
      return this;
    }
  }
  