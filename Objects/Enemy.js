import { World } from '../World/World.js';
import { EnemyList } from './EnemyList.js';
import { Utils } from '../misc/Utils.js';
// import { EnemyGroup } from './EnemyGroup.js';
export class Enemy {
    constructor(inheritedClass, {
        x,
        y,
        width,
        height,
        color,
        health,
        velocity,
        canvas,
        follow,
        bounce,
        gun,
        drawGuns,
        healthColor
    }) {
        this.inherited = EnemyList.search(inheritedClass, (k, v) => inheritedClass === v.name)[inheritedClass];
        this.x = x;
        this.y = y;
        this.damage = this.inherited.damage;
        this.width = width || this.inherited.width;
        this.height = height || this.inherited.height;
        this.color = color || this.inherited.color || 'black';
        this.health = this.inherited.health || health;
        this.maxHealth = this.health;
        this.healthSection = this.width / this.health;
        this.healthWidth = 0;
        this.healthColor = healthColor || 'blue';
        this.velocity = velocity || this.inherited.velocity || { x: 0, y: 0 };
        this.addedVelocity = { x: 0, y: 0 };
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.alive = true;
        this.collision = true;
        this.follow = follow || false;
        this.isBeingHit = false;
        this.canvas = canvas;
        this.radian = 0;
        this.drawGuns = drawGuns;
        if (bounce) {
            this.bounce = true;
            this.isOnBounds = {
                bottom: () => this.y + this.height === this.canvas.height,
                top: () => this.y === 0,
                right: () => this.x + this.width === this.canvas.width,
                left: () => this.x === 0
            }
        }
        this.guns = [];
        if (gun) {
            this.addGun(gun);
        }
    }
    hit(damage) {
        if (!damage) { console.error(`enemy.hit has no damage`) }
        this.health -= damage;
        if (this.health <= 0) {
            this.die();
        }
    }
    fire({
        x,
        y,
        radian
    }) {
        if (this.activeGun) {
            this.activeGun.fire({ x, y, radian: radian || this.radian });
        }
    }
    drawGuns(canvas = this.canvas) {
        if (!this.activeGun) { return false; }
        const ctx = canvas.context;
        const active = this.activeGun.body;
        ctx.beginPath();

        ctx.fillStyle = `rgba(${active.color}, ${active.opacity})` || 'red';
        ctx.fillRect(this.x + this.width, this.y + this.height * active.height / 2, this.width * active.width, this.height * active.height);
        ctx.fill();
        ctx.closePath();
        this.activeGun.drawBullets();
    }
    addGun(gun) {
        if (gun instanceof World.Sprites.Gun) {
            this.activeGun = gun;
            this.guns.push(gun);
        } else {
            throw new Error(`${gun} is not an instanceof ${World.Sprites.Gun}`);
        }
    }
    addToGroup(groupName) {
        if (groupName in EnemyGroup.list) {
            EnemyGroup.list[groupName].enemies.push(this);
        } else {
            throw new Error(`${group} isn't an EnemyGroup`);
        }
    }
    move() {
        if (!this.alive) {
            this.x = NaN;
            this.y = NaN;
            this.left = NaN;
            return false;
        }
        if (this.health <= 0) {
            this.die();
            this.alive = false;
        } else {
            this.alive = true;
        }
        this.updatePosition();
        this.enforceBoundaries();
        if (this.bounce) {
            if (this.isOnBounds.right() || this.isOnBounds.left()) {
                this.velocity.x = -this.velocity.x;
            }
            if (this.isOnBounds.top() || this.isOnBounds.bottom()) {
                this.velocity.y = -this.velocity.y;
            }
        }
    }
    draw(canvas = this.canvas) {
        if (!this.alive) {
            this.x = NaN;
            this.y = NaN;
            return false;
        }
        const ctx = canvas.context;
        ctx.beginPath();
        this.healthWidth = this.health * this.healthSection;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.healthColor;
        ctx.fillRect(this.x + (this.width - this.healthWidth) / 2,
            this.y - this.height / 5, this.health * this.healthSection, this.height / 13)
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        if (this.activeGun && this.drawGuns) {
            this.drawGuns();
        } else if (this.activeGun) {
            this.activeGun.drawBullets();
        }
    }
    updatePosition(canvas = this.canvas) {
        if(!this.alive) {
            return false;
        }
        if (this.follow) {
            const dX = (this.follow.x + this.follow.width / 2) - (this.x + this.width / 2);
            const dY = (this.follow.y + this.follow.height / 2) - (this.y + this.height / 2);
            const distance = Math.sqrt(dX ** 2 + dY ** 2);
            const lengthX = dX / distance;
            const lengthY = dY / distance;
            this.x += lengthX * (this.velocity.x + this.addedVelocity.x);
            this.y += lengthY * (this.velocity.y + this.addedVelocity.y);
            this.radian = Math.atan2((this.follow.y + this.follow.height / 2) - (this.y + this.height / 2), (this.follow.x + this.follow.width / 2) - (this.x + this.width / 2));
        } else {
            this.x += this.velocity.x + this.addedVelocity.x;
            this.y += this.velocity.y + this.addedVelocity.y;
        }
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.isOnBounds = {
            bottom: () => this.y + this.height === canvas.height,
            top: () => this.y === 0,
            right: () => this.x + this.width === canvas.width,
            left: () => this.x === 0
        }
    }
    die() {
        this.collision = false;
        this.alive = false;
    }
    enforceBoundaries(canvas = this.canvas) {
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        } else if (this.x < 0) {
            this.x = 0;
        }
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        } else if (this.y < 0) {
            this.y = 0;
        }
    }
    explode(type, duration, particles, size, canvas = this.canvas) {
        if(!this.animationLast) {
            this.animationLast = Date.now();
        }
        const ctx = canvas.context;
        const siz = size || this.width / 5;
        const six = size || this.height / 5;
        for (let i = 0; i < particles; i++) {
            const particle = new World.Particle(this.x + this.width / 2, this.y + this.height / 2, siz, six, this.color, canvas);
            particle.animate({ type, duration }, true);
        }
    }
}