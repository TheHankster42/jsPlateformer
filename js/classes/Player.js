class Player extends Sprite {
    constructor({ position, collisionBlocks, platformCollisionBlocks, imageSrc, frameRate, scale = 0.5, animations, status }) {
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
        this.collisionBlocks = collisionBlocks
        this.platformCollisionBlocks = platformCollisionBlocks

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
            height: 140,
        }
        this.status = status
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
                y: this.position.y - 54,
            },
            width: 300,
            height: 140,


        }
    }

    checkForHorizontalCanvasCollision() {
        if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 || this.hitbox.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0
        }
    }

    update() {
        this.updateFrames()
        this.updateHitbox()
        this.updateCameraBox()

        // c.fillStyle = 'rgba(0,255,0,0.3)'
        // c.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height)

        // c.fillStyle = 'rgba(0,0,255,0.3)'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // c.fillStyle = 'rgba(255,0,0,0.3)'
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)

        this.draw()

        this.position.x += this.velocity.x
        this.updateHitbox()

        this.checkForHorizontalCollisions()
        this.applyGravity()
        this.updateHitbox()

        this.checkForVerticalCollisions()
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

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

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

    checkForVerticalCollisions() {
        this.status.colliding = false
        this.status.onPlatform = false
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

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
        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const platformCollisionBlock = this.platformCollisionBlocks[i]

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