import { World } from '../World/World.js';
import { Utils } from '../misc/Utils.js';
export class Bullet {
    constructor({
        x,
        y,
        inherited,
        canvas,
        radian,
        color = 'red',
        velocity
    }) {
        velocity = velocity || { x: inherited.bullet.velocity.x, y: inherited.bullet.velocity.y };
        this.body = {
            width: inherited.bullet.width,
            height: inherited.bullet.height,
            velocity,
            radianVelocity: { x: 0, y: 0 },
            color,
            radian,
            x,
            y,
            damage: inherited.bullet.damage
        }
        this.canvas = canvas;
        this.inherited = inherited;
        this.left = this.body.x;
        this.right = this.body.x + this.body.width;
        this.top = this.body.y;
        this.bottom = this.body.y + this.body.height;
        return this;
    }
    draw(canvas = this.canvas) {
        const ctx = canvas.context;
        ctx.beginPath();
        ctx.fillStyle = this.body.color;
        Utils.drawSpread({
            canvas,
            x: Math.round(this.body.x),
            y: Math.round(this.body.y),
            originX: -10,
            originY: 2,
            width: this.body.width,
            height: this.body.height,
            object: this.body,
            radian: this.body.radian,
            spread: Utils.randomIntBetween(-this.inherited.spread, this.inherited.spread)
        });
        ctx.fill();
        ctx.closePath();
    }
    move() {
        if (this.body.radianVelocity.x === 0 && this.body.radianVelocity.y === 0) {
            this.body.radianVelocity.x = Math.cos(this.body.radian) * this.body.velocity.x;
            this.body.radianVelocity.y = Math.sin(this.body.radian) * this.body.velocity.y;
        }
        this.body.x += this.body.radianVelocity.x;
        this.body.y += this.body.radianVelocity.y;

        this.left = this.body.x;
        this.right = this.body.x + this.body.width;
        this.top = this.body.y;
        this.bottom = this.body.y + this.body.height;
    }
}