class Brick extends Sprite {
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
    }
    update() {
        this.draw()
        this.updateFrames()
    }

    switchSprite(key) {
        if (this.image == this.animations[key].image || !this.loaded) return

        this.currentFrame = 0
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate

    }
    
}