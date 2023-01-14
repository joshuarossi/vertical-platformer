export class CollisionBlock {
  constructor({ position, height = 16, c, canvas }) {
    this.position = { x: position.x, y: position.y };
    this.c = c;
    this.canvas = canvas;
    this.width = 16;
    this.height = height;
  }
  draw() {
    // this.c.fillStyle = "rgba(255, 0, 0,.5)";
    // this.c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
  }
}
