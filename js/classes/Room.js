class Room{
    constructor({imageSrc, floorCollisions, platformCollisions, imageHeight, scale = 1}){
        this.background = new Sprite({
            position: {
                x: 0,
                y: 0,
            },
            imageSrc: imageSrc,
            scale
        })

        this.floorCollisions = floorCollisions
        this.platformCollisions = platformCollisions

        this.imageHeight = imageHeight

        // CREATION OF THE COLLISION BLOCKS INTO LISTS

        this.floorCollisions2D = []
        for (let i = 0; i < this.floorCollisions.length; i += 36) {
            this.floorCollisions2D.push(this.floorCollisions.slice(i, i + 36))
        }
        this.collisionBlocks = []

        this.floorCollisions2D.forEach((row, y) => {
            row.forEach((symbol, x) => {
                if (symbol == 1) {
                    this.collisionBlocks.push(new CollisionBlock({
                        position: {
                            x: x * tileSize,
                            y: y * tileSize,
                        },
                    }))
                }
            })
        })

        this.platformCollisions2D = []
        for (let i = 0; i < this.platformCollisions.length; i += 36) {
            this.platformCollisions2D.push(this.platformCollisions.slice(i, i + 36))
        }
        this.platformCollisionBlocks = []

        this.platformCollisions2D.forEach((row, y) => {
            row.forEach((symbol, x) => {
                if (symbol == 1) {
                    this.platformCollisionBlocks.push(new CollisionBlock({
                        position: {
                            x: x * tileSize,
                            y: y * tileSize,
                        },
                        height: 4
                    }))
                }
            })
        })

    }
}