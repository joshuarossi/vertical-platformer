import { Player } from "./js/classes/Player.js";
import { Sprite } from "./js/classes/Sprite.js";
import { RUNSPEED, JUMPSPEED } from "./constants.js";
import { floorCollisions, platformCollisions } from "./js/data/collisions.js";
import { CollisionBlock } from "./js/classes/CollisionBlock.js";
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = { width: canvas.width / 4, height: canvas.height / 4 };

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i + 36) {
  floorCollisions2D.push(floorCollisions.slice(i, (i += 36)));
}
const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      console.log("draw a block");
      collisionBlocks.push(
        new CollisionBlock({
          position: { x: x * 16, y: y * 16 },
          c,
          canvas,
        })
      );
    }
  });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i + 36) {
  platformCollisions2D.push(platformCollisions.slice(i, (i += 36)));
}
const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      console.log("draw a block");
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: { x: x * 16, y: y * 16 },
          height: 4,
          c,
          canvas,
        })
      );
    }
  });
});

const keys = {
  d: { pressed: false },
  a: { pressed: false },
  w: { pressed: false },
};
const player1 = new Player({
  position: { x: 100, y: 300 },
  imageSrc: "./images/warrior/Idle.png",
  c,
  canvas,
  collisionBlocks,
  platformCollisionBlocks,
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: "./images/warrior/Idle.png",
      frameRate: 8,
      frameBuffer: 10,
    },
    IdleLeft: {
      imageSrc: "./images/warrior/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 10,
    },
    Run: {
      imageSrc: "./images/warrior/Run.png",
      frameRate: 8,
      frameBuffer: 11,
    },
    RunLeft: {
      imageSrc: "./images/warrior/RunLeft.png",
      frameRate: 8,
      frameBuffer: 11,
    },
    Jump: {
      imageSrc: "./images/warrior/Jump.png",
      frameRate: 2,
      frameBuffer: 15,
    },
    JumpLeft: {
      imageSrc: "./images/warrior/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 15,
    },
    Fall: {
      imageSrc: "./images/warrior/Fall.png",
      frameRate: 2,
      frameBuffer: 15,
    },
    FallLeft: {
      imageSrc: "./images/warrior/FallLeft.png",
      frameRate: 2,
      frameBuffer: 15,
    },
  },
});

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  c,
  canvas,
  imageSrc: "./images/background.png",
});
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.save();
  c.scale(4, 4);
  c.translate(0, -background.image.height + scaledCanvas.height);
  background.update();
  collisionBlocks.forEach((block) => {
    block.update();
  });
  platformCollisionBlocks.forEach((block) => {
    block.update();
  });
  player1.update();
  player1.velocity.x = 0;
  if (keys.d.pressed) {
    player1.switchSprite("Run");
    player1.velocity.x = RUNSPEED;
    player1.lastDirection = "right";
  } else if (keys.a.pressed) {
    player1.switchSprite("RunLeft");
    player1.velocity.x = -RUNSPEED;
    player1.lastDirection = "left";
  } else if (player1.velocity.y === 0) {
    if (player1.lastDirection === "right") {
      player1.switchSprite("Idle");
    } else {
      player1.switchSprite("IdleLeft");
    }
  }
  if (player1.velocity.y < 0) {
    if (player1.lastDirection === "right") {
      player1.switchSprite("Jump");
    } else {
      player1.switchSprite("JumpLeft");
    }
  } else if (player1.velocity.y > 0) {
    if (player1.lastDirection === "right") {
      player1.switchSprite("Fall");
    } else {
      player1.switchSprite("FallLeft");
    }
  }
  c.restore();
}
animate();
window.addEventListener("keydown", (e) => {
  console.log(e.key);
  switch (e.key) {
    case "ArrowRight":
    case "d":
      keys.d.pressed = true;
      break;
    case "ArrowLeft":
    case "a":
      keys.a.pressed = true;
      break;
    case "ArrowUp":
    case "w":
      player1.velocity.y = JUMPSPEED;
      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowRight":
    case "d":
      keys.d.pressed = false;
      break;
    case "ArrowLeft":
    case "a":
      keys.a.pressed = false;
      break;
  }
});
