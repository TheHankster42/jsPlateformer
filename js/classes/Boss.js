class Boss extends Enemy {
    constructor({
        position,
        imageSrc,
        frameRate,
        scale = 2,
        animations,
        velocity,
        health = 700,
        player,
        moveSpeed = 0.75,
    }) {
        super({
            position,
            imageSrc,
            frameRate,
            scale,
            animations,
            velocity,
            health,
            player,
            moveSpeed,
        });

        this.hitbox = {
            position: {
                x: this.position.x + 90,
                y: this.position.y + 90
            },
            width: 120,
            height: 120,
        };

        this.maxHealth = health;
        this.detectionRadius = 450;
    }

    updateHitbox() {
        const hitboxOffsetX = 90;
        const hitboxOffsetY = 90;

        this.hitbox = {
            position: {
                x: this.position.x + hitboxOffsetX,
                y: this.position.y + hitboxOffsetY,
            },
            width: 120,
            height: 120,
        };
    }

    drawHealthBar() {
        c.fillStyle = 'black';
        c.fillRect(this.position.x + 75, this.position.y + 75, 150, 10);

        const healthWidth = (this.health / this.maxHealth) * 150;
        c.fillStyle = this.health > this.maxHealth * 0.5 ? 'green' : 'red';
        c.fillRect(this.position.x + 75, this.position.y + 75, healthWidth, 10);

        c.fillStyle = 'white';
        c.font = '12px Arial';
        c.fillText(`${this.health}/${this.maxHealth}`, this.position.x + 75, this.position.y + 75);
    }
    updateMovement(player) {
        const bossCenterX = this.hitbox.position.x + this.hitbox.width / 2;
        const bossCenterY = this.hitbox.position.y + this.hitbox.height / 2;

        const playerCenterX = player.hitbox.position.x + player.hitbox.width / 2;
        const playerCenterY = player.hitbox.position.y + player.hitbox.height / 2;

        const offsetX = playerCenterX - bossCenterX;
        const offsetY = playerCenterY - bossCenterY;

        const distance = Math.sqrt(offsetX ** 2 + offsetY ** 2);

        if (distance > 1) {
            const directionX = offsetX / distance;
            const directionY = offsetY / distance;

            this.velocity.x = directionX * this.moveSpeed;
            this.velocity.y = directionY * this.moveSpeed;
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;

            if (this.timeInPlayerHitbox >= this.attackCooldown) {
                this.attackPlayer();
                this.timeInPlayerHitbox = 0;
            }
        }
    }
    attackPlayer() {
        console.log("Boss attacks the player!");
        this.player.takeDamage(30);
    }
}
