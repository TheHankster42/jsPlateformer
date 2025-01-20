class Bullet extends CollisionBlock {
    constructor({ position, velocity, piercing = false, damage}) {
        super({
            position,
            height: 3,
            width: 3,
        });

        this.velocity = velocity;
        this.piercing = piercing;
        this.damage = damage;
    }

    update(enemies) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        

        if (this.position.x < 0 || this.position.x > canvas.width || this.position.y < 0 || this.position.y > canvas.height) {
            this.remove();
        }

        this.draw();
    }

    remove() {
        this.velocity = { x: 0, y: 0 };
    }

    draw() {
        c.fillStyle = 'yellow'; 
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}