class Room{
    constructor({imageSrc, floorCollisions, platformCollisions, imageHeight, scale = 1, enemiesList = []}, door, startingPosition){
        this.background = new Sprite({
            position: {
                x: 0,
                y: 0,
            },
            imageSrc: imageSrc,
            scale
        })

        this.enemiesList = enemiesList;

        this.floorCollisions = floorCollisions
        this.platformCollisions = platformCollisions

        this.imageHeight = imageHeight
        this.doorHitbox = door;
        this.startingPosition = startingPosition;


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

    drawDoor() {
        c.fillStyle = 'rgba(16, 72, 177, 0.7)';
        c.fillRect(this.doorHitbox.position.x, this.doorHitbox.position.y, this.doorHitbox.width, this.doorHitbox.height);
      }
}