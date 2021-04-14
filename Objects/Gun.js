import { GunList } from './GunList.js';
import { Utils } from '../misc/Utils.js';
import { World } from '../World/World.js';

export class Gun {
    constructor(canvas, name, newProperties = {}) {
        this.inherited = GunList.search(name);
        this.position = { x: 0, y: 0 };
        this.bullets = [];
        this.body = { ...this.inherited, ...newProperties, timeLastFired: 0 };
        this.isReloading = false;
        this.canvas = canvas;
        this.shooting = {
            right: false,
            down: false,
            up: false,
            left: false
        };
        Gun.list.push(this);
        return this;
    }
    addBullet(x, y, number = 1) {
        for (let i = 0; i < number; i++) {
            this.bullets.push(new World.Sprites.Bullet({ x, y, inherited: this.inherited, canvas: this.canvas, radian: this.bodyRadian }));
        }
        Gun.total += number;
        return this.bullets;
    }
    static update(gunName) {
        return Gun.list.find(x => x.body.name === gunName);
    }
    fire(newProperties) {
        if (this.isLocked) { return false; }
        if(newProperties.direction) {
            this.shooting[newProperties.direction] = true;
            for(let [key,value] of Object.entries(this.shooting)) {
                if(key !== this.shooting[newProperties.direction]) {
                    value = false;
                }
            }
        }
        const group = this.body;
        this.bodyRadian = newProperties.radian;
        if (Date.now() > group.timeLastFired + group.fireRate && (group.ammo > 0 || group.infiniteAmmo) && group.ammo <= group.capacity && !group.delayAfter) {
            this.addBullet(newProperties.x, newProperties.y);
            group.timeLastFired = Date.now();
            group.ammo -= 1;
        }
    }
    killBullet(bullet) {
        if (this.bullets.indexOf(bullet) > -1) {
            this.bullets.splice(this.bullets.indexOf(bullet), 1);
        }
    }
    drawBullets(canvas = this.canvas) {
        this.bullets.forEach(bullet => {
            bullet.draw();
            bullet.move();
            if (bullet.body.x + bullet.body.width > canvas.width || bullet.body.x < 0 ||
                bullet.body.y + bullet.body.height > canvas.height || bullet.body.y < 0) {
                Utils.remove(bullet, this.bullets);
            }
        });
    }
    reload() {
        if (this.isReloading || this.body.ammo === this.body.capacity) { return false; }
        const group = this.body;
        this.isReloading = true;
        this.isLocked = true;
        setTimeout(() => {
            this.isReloading = false;
            this.isLocked = false;
            group.ammo = group.capacity;
        }, group.reloadDelay);
    }
}
Gun.list = [];
Gun.total = 0;
Gun.hit = 0;