class CollisionBlock {
    constructor({position, height = 16, width = 16}){
        this.position = position
        this.height = height
        this.width = width
    }

    draw() {
        c.fillStyle = 'rgb(115, 255, 34)'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    update(){
        this.draw()
    }
}