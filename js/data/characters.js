const argsW = {
    position: {
        x: 150,
        y: 320,
    },
    imageSrc: './img/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: './img/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 3,
          },
          Run: {
            imageSrc: './img/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5,
          },
          Jump: {
            imageSrc: './img/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
          },
          Fall: {
            imageSrc: './img/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 3,
          },
          FallLeft: {
            imageSrc: './img/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3,
          },
          RunLeft: {
            imageSrc: './img/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5,
          },
          IdleLeft: {
            imageSrc: './img/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 3,
          },
          JumpLeft: {
            imageSrc: './img/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3,
          },
          Slide: {

          },
          SlideLeft: {

          },
    },
}

// const knight = new Player({
//     position: {
//         x: 150,
//         y: 320,
//     },
//     collisionBlocks: currentRoom.collisionBlocks,
//     platformCollisionBlocks: currentRoom.platformCollisionBlocks,
//     imageSrc: './img/warrior/Idle.png',
//     frameRate: 8,
//     animations: {
//         Idle: {
//             imageSrc: './img/warrior/Idle.png',
//             frameRate: 8,
//             frameBuffer: 3,
//           },
//           Run: {
//             imageSrc: './img/warrior/Run.png',
//             frameRate: 8,
//             frameBuffer: 5,
//           },
//           Jump: {
//             imageSrc: './img/warrior/Jump.png',
//             frameRate: 2,
//             frameBuffer: 3,
//           },
//           Fall: {
//             imageSrc: './img/warrior/Fall.png',
//             frameRate: 2,
//             frameBuffer: 3,
//           },
//           FallLeft: {
//             imageSrc: './img/warrior/FallLeft.png',
//             frameRate: 2,
//             frameBuffer: 3,
//           },
//           RunLeft: {
//             imageSrc: './img/warrior/RunLeft.png',
//             frameRate: 8,
//             frameBuffer: 5,
//           },
//           IdleLeft: {
//             imageSrc: './img/warrior/IdleLeft.png',
//             frameRate: 8,
//             frameBuffer: 3,
//           },
//           JumpLeft: {
//             imageSrc: './img/warrior/JumpLeft.png',
//             frameRate: 2,
//             frameBuffer: 3,
//           },
//           Slide: {

//           },
//           SlideLeft: {

//           },
//     },
//     status: status,
// })