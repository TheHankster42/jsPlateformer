class Enemy extends Sprite {
  constructor({ position, imageSrc, frameRate = 1, frameBuffer = 7, scale = 1, velocity, health = 100, player }) {
    super({ position, imageSrc, frameRate, frameBuffer, scale });
    this.velocity = velocity || { x: 0, y: 0 };
    this.health = health; // Health of the enemy
    this.isAlive = true; // Flag to track if the enemy is still alive
  }
  update() {
    if (!this.isAlive) return; // Stop updating if the enemy is dead
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    super.update(); 
  }
