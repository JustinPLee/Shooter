"use strict";
import { World } from '../World/World.js';
import { GunList } from './GunList.js';
import { Utils } from '../misc/Utils.js';
export class Player {
    constructor({
        canvas,
        width,
        height,
        x,
        y,
        velocity,
        speed,
        health,
        color,
        radius,
        gun

    }) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        this.collision = true;

        this.left = this.x;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
        this.top = this.y;

        this.radius = radius || this.width / 2;
        this.center = { x: (this.x + this.width / 2), y: (this.y + this.height / 2) }


        this.velocity = velocity || { x: 0, y: 0 };
        this.speed = speed || { x: 5, y: 5 };
        /*
                this.bounce = { x: 0, y: 0 };
                this.gravity = { x: 0, y: 1 };
                this.sprint = 0;
                this.sprintAcc = 0.4;
                this.jumpVelocity = -20;
                this.jumpCount = 0;
                this.isJumping = false;
                this.isMoving = false;
                this.radian = 0;*/
        this.angle = 0;
        this.radian = 90 * (Math.PI / 180);
        this.direction = 'right';
        this.color = color;
        this.fontSize = this.width / 2;
        this.health = health;
        this.invincible = false;
        this.healthSection = this.width / this.health;
        this.healthWidth = 0;

        this.gunSlots = 2;
        this.guns = [];

        if(gun) this.addGun(gun);
    }
    draw(canvas = this.canvas) {
        this.drawGuns(canvas);
        this.drawBody(canvas);
        this.drawReload(canvas);
        this.drawHealth(canvas);
    }
    switchGun() {

    }
    dropGun() {

    }
    addGun(newGun, isActive = true) {
        if (this.guns.length < this.gunSlots) {
            if (isActive) {
                newGun.body.active = true;
                this.activeGun = newGun;
            } else {
                newGun.body.active = false;
            }
            this.guns.push(newGun.body);
        }
    }
    reload() {
        if (this.activeGun) {
            this.activeGun.reload();
        }
    }
    fire(parameters) {
        if (this.activeGun) {
            if(parameters.direction === 'right'){
                this.radian = Utils.toRadians(360);
            }
            if(parameters.direction === 'down'){
                this.radian = Utils.toRadians(90);
            }
            if(parameters.direction === 'up'){
                this.radian = Utils.toRadians(270);
            }
            if(parameters.direction === 'left'){
                this.radian = Utils.toRadians(180);
            }
            this.direction = parameters.direction;
            this.activeGun.fire({...parameters, radian: this.radian});
        }
    }
    hit(damage, invincibleDelay) {
        if (!this.invincible) {
            this.health -= damage;
            if (this.health <= 0) {
                window.location.reload();
            } else {
                this.invincible = true;
                setTimeout(() => {
                    this.invincible = false;
                    this.fillColor = 'rgba(0, 255, 0, 1)';
                }, invincibleDelay);
            }
        }
    }
    drawBody(canvas = this.canvas) {
        const ctx = canvas.context;
        ctx.beginPath();
        this.invincible ? ctx.fillStyle = 'rgba(255, 0, 0, 1)' : ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.closePath();
    }
    drawReload(canvas = this.canvas) {
        if (!this.activeGun) { return false; }
        const ctx = canvas.context;
        const gun = this.activeGun;
        const body = this.activeGun.body;
        ctx.save();
        if (gun.isReloading) {
            this.color = 'hotpink';
            this.reloadMessage = `RELOADING`;
        } else {
            this.color = 'lime';
            this.reloadMessage = `${body.ammo}/${body.capacity}`;
        }
        if (body.ammo === 0 && !gun.isReloading) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'black';
        }
        ctx.font = `${this.fontSize}px Calibri`;
        ctx.textAlign = "center";
        ctx.fillText(this.reloadMessage, this.x, this.y + this.height);
        ctx.restore();
    }
    drawHealth(canvas = this.canvas) {
        const ctx = canvas.context;
        ctx.beginPath();
        this.healthWidth = this.health * this.healthSection;
        ctx.fillStyle = 'blue';
        ctx.fillRect(Math.round(this.x + (this.width - this.healthWidth) / 2 - this.width / 2),
            Math.round(this.y - this.height / 2 - this.height / 3), this.health * this.healthSection, this.height / 10);
        ctx.stroke();
        ctx.fill();
    }
    drawGuns(canvas = this.canvas) {
        if (!this.activeGun) { return false; }
        const ctx = canvas.context;
        const active = this.activeGun.body;
        ctx.beginPath();
        if (this.angle >= 35 && this.angle <= 147) {
            active.opacity = 0.8;
        } else {
            active.opacity = 1;
        }
        ctx.fillStyle = `rgba(${active.color}, ${active.opacity})` || 'red';
        if(this.direction === 'right') {
            ctx.fillRect(this.x + this.width / 2, this.y - this.height * active.height / 2, this.width*active.width, this.height*active.height);
        } else if(this.direction === 'up') {
            ctx.fillRect(this.x - this.height * active.height / 2, this.y - this.height / 2 - this.height * active.width, this.height*active.height, this.width*active.width);
        } else if(this.direction === 'down') {
            ctx.fillRect(this.x - this.height * active.height / 2, this.y + this.height / 2, this.height*active.height, this.width*active.width);
        } else if(this.direction === 'left') {
            ctx.fillRect(this.x - this.width * active.width - this.width / 2, this.y - this.height * active.height / 2, this.width*active.width, this.height*active.height);
        }
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        this.activeGun.drawBullets();
    }
    move(canvas = this.canvas) {
        if (World.keys[World.Keybinds.find('move_left')].isPressed && !canvas.isOnBounds().left(this)) {
            this.x -= this.speed.x;
            this.direction = 'left';
        }
        if (World.keys[World.Keybinds.find('move_right')].isPressed && !canvas.isOnBounds().right(this)) {
            this.x += this.speed.x;
            this.direction = 'right';
        }
        if (World.keys[World.Keybinds.find('move_up')].isPressed && !canvas.isOnBounds().up(this)) {
            this.y -= this.speed.y;
            this.direction = 'up';
        }
        if (World.keys[World.Keybinds.find('move_down')].isPressed && !canvas.isOnBounds().down(this)) {
            this.y += this.speed.y;
            this.direction = 'down';
        }
        this.updatePosition();
        this.enforceBoundaries(canvas);
    }
    updatePosition() {
        this.angle = Utils.toDegrees(this.radian);
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.left = this.x;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
        this.top = this.y;

        this.velocity = { x: 0, y: 0 };
        this.center = { x: this.x + this.width / 2, y: this.y + this.height / 2 }

    }
    enforceBoundaries(canvas = this.canvas) {
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
        } else if (this.x - this.radius < 0) {
            this.x = this.radius;
        }
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
        } else if (this.y - this.radius < 0) {
            this.y = this.radius;
        }
    }
}