class Enemy extends Sprite {
  constructor({ position, imageSrc, frameRate, scale = 0.5, animations, velocity, health = 100, player, moveSpeed = 0.05 }) {
    super({
      position,
      imageSrc,
      frameRate,
      scale,
    });
    this.velocity = velocity || { x: 0, y: 0 };
    this.health = health;
    this.animations = animations;
    this.player = player;
    this.moveSpeed = moveSpeed;
    this.detectionRadius = 250;

    this.hitbox = {
      position: { x: this.position.x + 50, y: this.position.y + 50 },
      width: 50,
      height: 55,
    };

    this.timeInPlayerHitbox = 0;
    this.attackCooldown = 1000;

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;
      this.animations[key].image = image;
    }
  }

  switchSprite(key) {
    if (this.image == this.animations[key].image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

  update(player) {
    this.updateFrames();
    this.updateHitbox();
    this.updateMovement(player);
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.updateAttackTimer(player)
    this.drawHitbox();
  }

  updateHitbox() {
    const hitboxOffsetX = 50;
    const hitboxOffsetY = 50;

    this.hitbox = {
      position: {
        x: this.position.x + hitboxOffsetX,
        y: this.position.y + hitboxOffsetY,
      },
      width: 50,
      height: 55,
    };
  }

  drawHitbox() {
    c.fillStyle = 'rgba(255, 0, 0, 0.3)';
    c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
  }

  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  isPlayerInRadius() {
    const distance = this.calculateDistance(
      this.position.x, this.position.y, this.player.position.x, this.player.position.y
    );
    return distance <= this.detectionRadius;
  }

  updateMovement(player) {
    const playerInsideHitbox = this.playerInsideHitbox(player);

    if (!playerInsideHitbox && this.isPlayerInRadius()) {
      const directionX = player.position.x - this.position.x - 30;
      const directionY = player.position.y - this.position.y - 30;

      const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

      if (distance > 0) {
        this.velocity.x = (directionX / distance) * this.moveSpeed;
        this.velocity.y = (directionY / distance) * this.moveSpeed;
      }
    } else {
      this.velocity.x = 0;
      this.velocity.y = 0;

      if (this.timeInPlayerHitbox >= this.attackCooldown) {
        this.attackPlayer();
        this.timeInPlayerHitbox = 0;
      }
    }
  }

  playerInsideHitbox(player) {
    return (
      this.hitbox.position.x <= player.hitbox.position.x &&
      this.hitbox.position.x + this.hitbox.width >= player.hitbox.position.x + player.hitbox.width &&
      this.hitbox.position.y <= player.hitbox.position.y &&
      this.hitbox.position.y + this.hitbox.height >= player.hitbox.position.y + player.hitbox.height
    );
  }

  attackPlayer() {
    console.log("Enemy attacks the player!");
    this.player.takeDamage(10); // Example damage value
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    console.log("Enemy died!");
  }

  // Method to check if the enemy is within the player's hitbox
  updateAttackTimer(player) {
    if (this.playerInsideHitbox(player)) {
      this.timeInPlayerHitbox += 1000 / 60; // Time increment per frame (approx 60 FPS)
    } else {
      this.timeInPlayerHitbox = 0; // Reset time if the player is not in the hitbox
    }
  }
}