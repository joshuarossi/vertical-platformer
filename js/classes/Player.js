import { GRAVITY, TERMINAL_VELOCITY } from "../../constants.js";
import { collision, platformCollision } from "../util.js";
import { Sprite } from "./Sprite.js";

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

  applyGravity() {
    if (this.velocity.y >= TERMINAL_VELOCITY) {
      console.log(`can't fall any faster`);
      console.log(this.velocity.y, TERMINAL_VELOCITY, this.velocity.y <= TERMINAL_VELOCITY);
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
