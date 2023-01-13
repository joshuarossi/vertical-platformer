import { GRAVITY, TERMINAL_VELOCITY } from "../../constants.js";
import { collision, platformCollision } from "../util.js";
import { Sprite } from "./Sprite.js";
import { camera } from "../../index.js";

export class Player extends Sprite {
  constructor({
    imageSrc,
    position,
    frameRate,
    c,
    canvas,
    collisionBlocks,
    platformCollisionBlocks,
    scale = 0.5,
    animations,
  }) {
    super({
      imageSrc: imageSrc,
      position: position,
      c: c,
      canvas: canvas,
      frameRate,
      scale,
    });
    this.velocity = { x: 0, y: 1 };
    this.position = position;
    this.c = c;
    this.canvas = canvas;
    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.hitbox = {
      position: { x: this.position.x, y: this.position.y },
      width: 10,
      height: 10,
    };
    this.animations = animations;
    this.lastDirection = "right";
    this.cameraBox = { position: { x: this.position.x, y: this.position.y }, width: 200, height: 80 };
    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;
      this.animations[key].image = image;
    }
  }

  switchSprite(key) {
    if (this.animations[key].image === this.image || !this.loaded) {
      return;
    } else {
      this.currentFrame = 0;
      this.image = this.animations[key].image;
      this.frameRate = this.animations[key].frameRate;
      this.frameBuffer = this.animations[key].frameBuffer;
    }
  }

  update() {
    this.updateFrames();
    this.updateHitbox();
    this.updateCameraBox();

    // this.c.fillStyle = "rgba(0, 0, 255, .2)";
    // this.c.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);
    // this.c.fillStyle = "rgba(0, 0, 255, .2)";
    // this.c.fillRect(this.position.x, this.position.y, this.width, this.height);
    // this.c.fillStyle = "rgba(255, 0, 0, .2)";
    // this.c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
    this.draw();
    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollision();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollision();
  }

  updateHitbox() {
    this.hitbox = {
      position: { x: this.position.x + 33, y: this.position.y + 25 },
      width: 16,
      height: 27,
    };
  }

  updateCameraBox() {
    this.cameraBox = { position: { x: this.position.x - 50, y: this.position.y }, width: 200, height: 80 };
  }

  checkforHorizontalCanvasCollision() {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x > 576 ||
      this.hitbox.position.x + this.velocity.x < 0
    ) {
      this.velocity.x = 0;
    }
  }

  shouldPanCameraToTheLeft() {
    const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width;
    const scaledCanvasWidth = this.canvas.width / 4;
    if (cameraBoxRightSide >= 576) {
      return;
    }
    if (cameraBoxRightSide > scaledCanvasWidth + Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight() {
    if (this.cameraBox.position.x <= 0) {
      return;
    }
    if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraDown() {
    if (this.cameraBox.position.y + this.velocity.y <= 0) {
      return;
    }
    if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  shouldPanCameraUp() {
    if (this.cameraBox.position.y + this.cameraBox.height + this.velocity.y <= 0) {
      return;
    }
    const scaledCanvasHeight = this.canvas.height / 4;
    if (this.cameraBox.position.y + this.cameraBox.height >= Math.abs(camera.position.y) + scaledCanvasHeight) {
      camera.position.y -= this.velocity.y;
    }
  }

  applyGravity() {
    if (this.velocity.y >= TERMINAL_VELOCITY) {
      this.velocity.y = TERMINAL_VELOCITY;
    } else {
      this.velocity.y += GRAVITY;
    }
    this.position.y += this.velocity.y;
  }

  checkForHorizontalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (collision({ player: this.hitbox, collisionBlock })) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.y - this.position.y + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
        }
      }
    }
  }

  checkForVerticalCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (collision({ player: this.hitbox, collisionBlock })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];
      if (platformCollision({ player: this.hitbox, collisionBlock: platformCollisionBlock })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
