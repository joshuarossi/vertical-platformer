export function collision({ player, collisionBlock }) {
  return (
    player.position.y + player.height >= collisionBlock.position.y &&
    player.position.y <= collisionBlock.position.y + collisionBlock.height &&
    player.position.x + player.width >= collisionBlock.position.x &&
    player.position.x <= collisionBlock.position.x + collisionBlock.width
  );
}

export function platformCollision({ player, collisionBlock }) {
  return (
    player.position.y + player.height >= collisionBlock.position.y &&
    player.position.y + player.height <= collisionBlock.position.y + collisionBlock.height &&
    player.position.x + player.width >= collisionBlock.position.x &&
    player.position.x <= collisionBlock.position.x + collisionBlock.width
  );
}
