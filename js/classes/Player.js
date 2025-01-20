class Player extends Sprite {
    constructor({ position, imageSrc, frameRate, scale = 0.5, animations}) {
        super({
            imageSrc,
            frameRate,
            scale,
        })
        this.position = position
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10,
        }

        this.animations = animations
        this.direction = 'right'

        for (let key in this.animations) {
            const image = new Image()
            image.src = this.animations[key].imageSrc
            this.animations[key].image = image
        }
        this.camerabox = {
            position: {
                x: this.position.x - 110,
                y: this.position.y - 50,
            },
            width: 300,
            height: 120,
        }
        this.status = {
            colliding: false,
            activeDoubleJump: true,
            touchingWall: false,
            onPlatform: false,
            dropDown: false,
        }
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.gameOver = false;

        this.maxAmmo = 7;
        this.ammo = this.maxAmmo;
        this.damage = 20;
        this.superDamage = 35;
        this.bulletSpeed = 7;
        this.superBulletSpeed = 11;
        this.superBullet = false;
        this.bullets = [];
        this.lastShotTime = 0;
        this.shootCooldown = 200;
        this.ammoRegenerationRate = 0.1;
        this.rechargeDelay = 2500;

        this.meleeCooldown = 1000;
        this.lastMeleeTime = 0;
        this.meleeRange = 90;
        this.meleeDamage = 50;

        this.lastDamageTime = Date.now();
        this.healthRegenerationRate = 0.1;
        this.regenerationDelay = 8000;
    }

    switchSprite(key) {
        if (this.image == this.animations[key].image || !this.loaded) return

        this.currentFrame = 0
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate

    }

    shouldPanLeft() {
        const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
        const scaledDownCanvasWidth = canvas.width / 4

        if (cameraboxRightSide >= 576) return

        if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    shouldPanRight() {
        if (this.camerabox.position.x <= 0) return

        if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    shouldPanDown() {
        if (this.camerabox.position.y + this.velocity.y <= 0) return

        if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y
        }
    }

    shouldPanUp() {
        const scaledDownCanvasHeight = canvas.height / 4

        if (this.camerabox.position.y + this.camerabox.height + this.velocity.y <= scaledDownCanvasHeight) return

        if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaledDownCanvasHeight) {
            camera.position.y -= this.velocity.y
        }
    }

    updateCameraBox() {
        this.camerabox = {
            position: {
                x: this.position.x - 110,
                y: this.position.y - 50,
            },
            width: 300,
            height: 120,
        }
    }

    checkForHorizontalCanvasCollision() {
        if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 || this.hitbox.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0
        }
    }

    update(currentRoom) {
        this.updateFrames()
        this.updateHitbox()
        this.updateCameraBox()

        this.bullets = this.bullets.filter(bullet => bullet.velocity.x !== 0 || bullet.velocity.y !== 0);

        // c.fillStyle = 'rgba(0,255,0,0.3)'
        // c.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height)

        // c.fillStyle = 'rgba(0,0,255,0.3)'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // c.fillStyle = 'rgba(255,0,0,0.3)'
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)

        this.draw()
        this.drawResBar(player)


        this.position.x += this.velocity.x
        this.updateHitbox()

        this.checkForHorizontalCollisions(currentRoom)
        this.applyGravity()
        this.updateHitbox()

        this.checkForVerticalCollisions(currentRoom)
        this.bullets.forEach(bullet => bullet.update(currentRoom.enemies));
        this.regenerateAmmo()
        this.regenerateHealth()
    }
    activeJump() {
        this.status.colliding = true
        this.status.activeDoubleJump = true
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 26,
            },
            width: 14,
            height: 27,
        }
    }

    checkForHorizontalCollisions(currentRoom) {
        for (let i = 0; i < currentRoom.collisionBlocks.length; i++) {
            const collisionBlock = currentRoom.collisionBlocks[i]

            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
            ) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break
                }
                if (this.velocity.x < 0) {
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x

                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }
            }
        }
    }

    applyGravity() {
        this.velocity.y += gravity
        if (this.velocity.y > 5) {
            this.velocity.y = 5
        }
        this.position.y += this.velocity.y
    }

    takeDamage(damage){
        this.health -= damage;
        this.lastDamageTime = Date.now();
        if (this.health <= 0) {
            this.health = 0;

            this.gameOver = true;
        }
    }

    regenerateHealth() {
        const currentTime = Date.now();
        if (currentTime - this.lastDamageTime >= this.regenerationDelay) {
            if (this.health < this.maxHealth) {
                this.health += this.healthRegenerationRate;
                this.health = Math.min(this.health, this.maxHealth);
            }
        }
    }

    drawResBar(player) {
        c.fillStyle = 'black';
        c.fillRect(
            player.camerabox.position.x + 135, 
            player.camerabox.position.y + 70, 
            35,                              
            2                                
        );
    
        const healthWidth = (player.health / player.maxHealth) * 35;
        c.fillStyle = 'green';
        c.fillRect(
            player.camerabox.position.x + 135,
            player.camerabox.position.y + 70,
            healthWidth,
            2
        );
    
        c.fillStyle = 'white';
        c.font = '5px Arial';
        c.fillText(
            `${Math.floor(player.health)}/${player.maxHealth}`, 
            player.camerabox.position.x + 135,
            player.camerabox.position.y + 70
        );

        c.fillStyle = 'black';
        c.fillRect(
            player.camerabox.position.x + 135, 
            player.camerabox.position.y + 72, 
            35,                              
            2                                
        );
    
        const ammoWidth = (player.ammo / player.maxAmmo) * 35;
        if (this.superBullet){
            c.fillStyle = 'blue';

        } else {
            c.fillStyle = 'yellow';
        }
        c.fillRect(
            player.camerabox.position.x + 135,
            player.camerabox.position.y + 72,
            ammoWidth,
            2
        );

        c.fillStyle = 'white';
        c.font = '5px Arial';
        c.fillText(
            `${Math.floor(player.ammo)}/${player.maxAmmo}`, 
            player.camerabox.position.x + 135,
            player.camerabox.position.y + 78
        );
    }

    shootBullet() {
        if (this.superBullet && !(this.ammo==this.maxAmmo)) {
            return;
        }
        if (this.ammo < 1) {
            return;
        }
        const currentTime = Date.now();
        var currentSpeed;
        var currentDamage;

        if (this.superBullet){
            this.ammo = 0
            currentSpeed = this.superBulletSpeed  
            currentDamage = this.superDamage
        } else {
            this.ammo -= 1
            currentSpeed = this.BulletSpeed
            currentDamage = this.damage

        }

        if (currentTime - this.lastShotTime >= this.shootCooldown) {
            const bulletVelocity = this.direction === 'right' ? { x: currentSpeed, y: 0 } : { x: -currentSpeed, y: 0 };

            const bullet = new Bullet({
                position: {
                    x: this.position.x + (this.direction === 'right' ? this.width : 0),
                    y: this.position.y + this.height / 2,
                },
                velocity: bulletVelocity,
                piercing: this.superBullet,
                damage: currentDamage
            });

            this.bullets.push(bullet);
            this.lastShotTime = currentTime;

            console.log('Bang');
        }
    }

    regenerateAmmo() {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime >= this.rechargeDelay) {
            if (this.ammo < this.maxAmmo) {
                this.ammo += this.ammoRegenerationRate;
                this.ammo = Math.min(this.ammo, this.maxAmmo);
            }
        }
    }

    switchBulletType() {
            this.superBullet = !(this.superBullet)
            console.log("switched")
        }
    

    meleeAttack(enemies) {
        const currentTime = Date.now();

        if (currentTime - this.lastMeleeTime >= this.meleeCooldown) {
            this.lastMeleeTime = currentTime;

            enemies.forEach(enemy => {
                const distX = Math.abs(this.position.x - enemy.position.x);
                const distY = Math.abs(this.position.y - enemy.position.y);

                if (distX < this.meleeRange && distY < this.meleeRange) {
                    enemy.takeDamage(this.meleeDamage);
                    console.log('Melee attack!');
                }
                if (this.direction === "right") {
                    this.switchSprite("Fall");
                } else {
                    this.switchSprite("FallLeft");
                }
            });
        } else {
            console.log('Melee attack is on cooldown!');
        }
    }

    checkForVerticalCollisions(currentRoom) {
        this.status.colliding = false
        this.status.onPlatform = false
        for (let i = 0; i < currentRoom.collisionBlocks.length; i++) {
            const collisionBlock = currentRoom.collisionBlocks[i]

            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
            ) {
                if (this.velocity.y > 0) {
                    this.activeJump()
                    this.velocity.y = 0

                    const offset =
                        this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y

                    this.position.y =
                        collisionBlock.position.y + collisionBlock.height - offset + 0.01
                    break
                }
            }
        }

        // platform collision blocks from bottom
        for (let i = 0; i < currentRoom.platformCollisionBlocks.length; i++) {
            const platformCollisionBlock = currentRoom.platformCollisionBlocks[i]

            if (
                platformCollision({
                    object1: this.hitbox,
                    object2: platformCollisionBlock,
                    dropDown: this.status.dropDown
                })
            ) {
                if (this.velocity.y > 0) {
                    this.activeJump()
                    this.status.onPlatform = true
                    this.velocity.y = 0

                    const offset =
                        this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = platformCollisionBlock.position.y - offset - 0.01
                    break
                }
            }
        }
    }
}