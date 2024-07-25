const canvas = document.querySelector('canvas')
const c = canvas.getContext(['2d'])
const tileSize = 16

canvas.width = 1024
canvas.height = 576

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4,
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}
const collisionBlocks = []

floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol == 202) {
            collisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * tileSize,
                    y: y * tileSize,
                },
            }))
        }
    })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}
const platformCollisionBlocks = []

platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol == 202) {
            platformCollisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * tileSize,
                    y: y * tileSize,
                },
            }))
        }
    })
})

const gravity = 0.25
const speed = 3
const speedReduction = 1.5

const player = new Player({
    position: {
        x: 500 /4,
        y: 100 /4 ,
    },
    collisionBlocks: collisionBlocks,
    imageSrc: './img/background.png'
})

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png'
})

function animate() {
    window.requestAnimationFrame(animate)

    c.fillStyle = 'purple'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()
    c.scale(4, 4)
    c.translate(0, -background.image.height + scaledCanvas.height)
    background.update()

    collisionBlocks.forEach(collisionBlock => {
        collisionBlock.update()
    })
    platformCollisionBlocks.forEach(platformCollisionBlocks => {
        platformCollisionBlocks.update()
    })

    player.update()

    player.velocity.x = 0
    if (keys.d.pressed && keys.a.pressed) player.velocity.x = 0
    else if (keys.a.pressed && !keys.s.pressed) player.velocity.x = -speed
    else if (keys.d.pressed && !keys.s.pressed) player.velocity.x = speed
    else if (keys.a.pressed && keys.s.pressed) player.velocity.x = -speedReduction
    else if (keys.d.pressed && keys.s.pressed) player.velocity.x = speedReduction

    c.restore()    
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break

        case 'a':
            keys.a.pressed = true
            break

        case 's':
            keys.s.pressed = true
            break

        case 'w':
        case ' ':
            player.velocity.y = -7
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 's':
            keys.s.pressed = false
            break


        case 'w':
        case ' ':
            player.velocity.y = 0
            break
    }
})