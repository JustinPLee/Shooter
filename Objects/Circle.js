import { Utils } from '../misc/Utils.js';

export class Circle {
    constructor({
        canvas,
        radius,
        x,
        y,
        dieOutOfBounds,
        velocity,
        color
    }) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.left = this.x;
        this.right = this.x + this.radius;
        this.top = this.y;
        this.color = color;
        this.bottom = this.y + this.radius;
        this.velocity = velocity || { x: 0, y: 0 };
        this.radian = 0;
        this.radianVelocity = { x: 0, y: 0 };
        this.dieOutOfBounds = dieOutOfBounds;
        this.alive = true;
    }
    draw(canvas = this.canvas) {
        if (this.alive) {
            canvas.context.beginPath();
            canvas.context.fillStyle = this.color || 'black';
            canvas.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            canvas.context.fill();
        }
    }
    move(canvas = this.canvas) {
        if (this.alive) {
            if (this.radianVelocity.x === 0 && this.radianVelocity.y === 0) {
                this.radianVelocity.x = Math.cos(this.radian) * this.velocity.x;
                this.radianVelocity.y = Math.sin(this.radian) * this.velocity.y;
            }
            this.x += this.radianVelocity.x || this.velocity.x;
            this.y += this.radianVelocity.y || this.velocity.y;

            this.updatePosition();
            this.enforceBoundaries(canvas);
        }
    }
    updatePosition() {
        this.left = this.x;
        this.right = this.x + this.radius;
        this.top = this.y;
        this.bottom = this.y + this.radius;
    }
    die() {
        this.x = null;
        this.y = null;
        this.alive = false;
    }
    enforceBoundaries(canvas = this.canvas) {
        if (this.x + this.radius * 2 > canvas.width) {
            if (this.dieOutOfBounds) {
                this.die();
            } else {
                this.x = canvas.width - this.radius * 2;
            }
        } else if (this.x < 0) {
            if (this.dieOutOfBounds) {
                this.die();
            } else {
                this.x = 0;
            }
        }
        if (this.y + this.radius * 2 > canvas.height) {
            if (this.dieOutOfBounds) {
                this.die();
            } else {
                this.y = canvas.height - this.radius * 2;
            }
        } else if (this.y < 0) {
            if (this.dieOutOfBounds) {
                this.die();
            } else {
                this.y = 0;
            }
        }
    }
}