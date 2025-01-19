const canvas = document.querySelector('canvas')
const c = canvas.getContext(['2d'])
const tileSize = 16
document.body.style.overflow = 'hidden';
document.querySelector('canvas').style.cursor = 'none';

canvas.width = 1920
canvas.height = 1080

// FPS limiting variables
const fps = 60;
const frameInterval = 1000 / fps;
let lastFrameTime = performance.now();

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4,
}

var player = new Player(argsW)

const enemy = new Enemy({
    position: {
        x: 150,
        y: 320,
    },
    imageSrc: './img/brick/bricksheet.png',
    frameRate: 2,
    frameBuffer: 7,
    scale: 1,
    health: 100,
    player: player,
    moveSpeed: 1.75,
})

const enemy2 = new Enemy({
    position: {
        x: 300,
        y: 320,
    },
    imageSrc: './img/brick/bricksheet.png',
    frameRate: 2,
    frameBuffer: 7,
    scale: 1,
    health: 100,
    player: player,
    moveSpeed: 1.75,
})

const douList = [enemy, enemy2]

const room1 = new Room(
    {
        imageSrc: './img/backgrounds/background.png',
        floorCollisions: floorCollisions1,
        platformCollisions: platformCollisions1,
        imageHeight: 432,
        enemiesList: douList,
    },
    new CollisionBlock({
        position: {
            x: 450,
            y: 89,
        },
        width: 16,
        height: 55,
    }),
    {
        x: 150,
        y: 320,
        xCamera: 0,
        yCamera: 0,
    }
);

const room2 = new Room(
    {
        imageSrc: './img/backgrounds/background_glacial_mountains_lightened.png',
        floorCollisions: floorCollisionsFlat,
        platformCollisions: platformCollisionsNull,
        imageHeight: 216,
        scale: 2,
    },
    new CollisionBlock({
        position: {
            x: 500,
            y: 350,
        },
        width: 16,
        height: 55,
    }),
    {
        x: 150,
        y: 320,
        xCamera: 0,
        yCamera: -130,
    }
);

const room3 = new Room(
    {
        imageSrc: './img/backgrounds/background2.png',
        floorCollisions: floorCollisionsFlat,
        platformCollisions: platformCollisionsNull,
        imageHeight: 432,
    },
    new CollisionBlock({
        position: {
            x: 400,
            y: 400,
        },
        width: 16,
        height: 55,
    }),
    {
        x: 250,
        y: 320,
        xCamera: 0,
        yCamera: -130,
    }
);

const room4 = new Room(
    {
        imageSrc: './img/backgrounds/background2.png',
        floorCollisions: floorCollisionsStart,
        platformCollisions: platformCollisionsNull,
        imageHeight: 432,
    },
    new CollisionBlock({
        position: {
            x: 400,
            y: 400,
        },
        width: 50,
        height: 55,
    }),
    {
        x: 150,
        y: 320,
    }
);

roomlist = [room1, room2, room3, room4]
roomlistIndex = 0
var currentRoom = roomlist[roomlistIndex]

const gravity = 0.25
const speed = 3

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    p: {
        pressed: false
    }
}

var camera = {
    position: {
        x: 0,
        y: -(currentRoom.imageHeight) + scaledCanvas.height,
    },
}



function animate() {
    requestAnimationFrame(animate);

    if (player.gameOver) {
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);

        c.fillStyle = 'white';
        c.font = '48px Arial';
        c.fillText('Damn You Suck', canvas.width / 2 - 100, canvas.height / 2);

        return; // Stop further drawing if the game is over
    }

    if (currentRoom == roomlist[3]) {
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);

        c.fillStyle = 'white';
        c.font = '48px Arial';
        c.fillText('Yay', canvas.width / 2 - 100, canvas.height / 2);

        return; // Stop further drawing if the game is over
    }

    const now = performance.now();
    const deltaTime = now - lastFrameTime;

    if (deltaTime > frameInterval) {
        lastFrameTime = now - (deltaTime % frameInterval);

        // Game logic
        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)

        c.save()
        c.scale(4, 4)
        c.translate(camera.position.x, camera.position.y)
        currentRoom.background.update()


        // Update player and enemy
        player.checkForHorizontalCanvasCollision()

        currentRoom.drawDoor()
        
        for (let enemy of currentRoom.enemiesList) {
            enemy.update(player);
        }

        player.update(currentRoom)
        
        player.velocity.x = 0
        if(keys.p.pressed){
            if (collision({
                object1: player.hitbox,
                object2: currentRoom.doorHitbox,
            })) {
                switchRoom()
            }
        }
        if (keys.a.pressed) {
            player.switchSprite('RunLeft')
            player.velocity.x = -speed
            player.direction = 'left'
            player.shouldPanRight()
        }
        else if (keys.d.pressed) {
            player.switchSprite('Run')
            player.velocity.x = speed
            player.direction = 'right'
            player.shouldPanLeft()
        }
        else if (player.velocity.y == 0) {
            if (player.direction == 'right') {
                player.switchSprite('Idle')
            } else {
                player.switchSprite('IdleLeft')
            }
        }

        if (player.velocity.y < 0) {
            player.shouldPanDown()
            if (player.direction == 'right') {
                player.switchSprite('Jump')
            } else {
                player.switchSprite('JumpLeft')
            }
        }
        else if (player.velocity.y > 0) {
            player.shouldPanUp()
            if (player.direction == 'right') {
                player.switchSprite('Fall')
            } else {
                player.switchSprite('FallLeft')
            }
        }

        c.restore();
    }
}

animate();

function switchRoom() {
    if (roomlist.length == roomlistIndex + 1) {
        roomlistIndex = 0
    } else {
        roomlistIndex++
    }
    currentRoom = roomlist[roomlistIndex]
    player.position = currentRoom.startingPosition
    player.updateCameraBox;
    camera.position.x = currentRoom.startingPosition.xCamera
    camera.position.y = currentRoom.startingPosition.yCamera
}

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break

        case 'a':
            keys.a.pressed = true
            break

        case 's':
            if (player.status.onPlatform == true) {
                player.status.dropDown = true
            }
            break

        case ' ':
            player.shootBullet();
            break;
        case 'w':
            if (player.status.colliding == true) {
                player.velocity.y = -6
                colliding = false
            }
            if (player.status.colliding == false && player.status.activeDoubleJump) {
                player.velocity.y = -6
                player.status.activeDoubleJump = false
            }
            break
        case 'e':
            player.meleeAttack(currentRoom.enemiesList);
            break;
        case 'p':
            keys.p.pressed = true;
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case '1':
            player.switchBulletType();
            break

        case 'd':
            keys.d.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 's':
            keys.s.pressed = false
            player.status.dropDown = false
            break


        case 'w':
            player.velocity.y = 0
            break
        case ' ':
            break;
        case 'p':
            keys.p.pressed = false;
            break
    }
})
