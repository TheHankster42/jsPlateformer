class Enemy extends Sprite {
  constructor({ position, imageSrc, frameRate, scale = 0.5, animations, health = 100, moveSpeed = 1 }) {
    super({
      position,
      imageSrc,
      frameRate,
      scale,
    });
    this.velocity = {
      x: 0,
      y: 0,
    }
    this.health = health;
    this.animations = animations;
    this.direction = 'left';
    this.moveSpeed = moveSpeed;
    this.hitbox = {
      position: {
        x: this.position.x + 50,
        y: this.position.y + 50,
      },
      width: 50,
      height: 55,
    };

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
    this.drawHitbox();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 50,
        y: this.position.y + 50,
      },
      width: 50,
      height: 55,
    };
  }

  updateMovement(player) {
    const playerInsideHitbox = this.playerInsideHitbox(player);

    if (!playerInsideHitbox) {
      const directionX = player.position.x - this.position.x;
      const directionY = player.position.y - this.position.y;

      const distance = Math.sqrt(directionX ** 2 + directionY ** 2); 

      if (distance > 0) {
        this.velocity.x = (directionX / distance) * this.moveSpeed;
        this.velocity.y = (directionY / distance) * this.moveSpeed;
      }
    } else {
      this.velocity.x = 0; 
      this.velocity.y = 0; 
    }
  }

  playerInsideHitbox(player) {
    return (
      player.hitbox.position.x + player.hitbox.width > this.hitbox.position.x &&
      player.hitbox.position.x < this.hitbox.position.x + this.hitbox.width &&
      player.hitbox.position.y + player.hitbox.height > this.hitbox.position.y &&
      player.hitbox.position.y < this.hitbox.position.y + this.hitbox.height
    );
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

  drawHitbox() {
    c.fillStyle = 'rgba(255, 0, 0, 0.3)';
    c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
  }
}