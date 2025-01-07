class Enemy extends Sprite {
  constructor({ position, imageSrc, frameRate = 1, frameBuffer = 7, scale = 1, health = 100, player, speed = 5}) {
    super({
            imageSrc,
            frameRate,
            scale,
        });
    this.position = position;
    this.health = health;
    this.isAlive = true;
    this.speed = speed;
  }
  update() {
    if (!this.isAlive) return; // Stop updating if the enemy is dead
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    super.update(); 
  }
  moveTowardPlayer(player) {
    // Calculate the vector from the enemy to the player
    const dx = player.position.x - this.position.x;
    const dy = player.position.y - this.position.y;

    // Calculate the distance between the enemy and player
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector (make it have a length of 1)
    const directionX = dx / distance;
    const directionY = dy / distance;

    // Move the enemy in the direction of the player
    this.velocity.x = directionX * this.speed;
    this.velocity.y = directionY * this.speed;
  }
}
