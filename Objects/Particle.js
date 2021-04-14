import { Utils } from '../misc/Utils.js';
export class Particle {
    constructor(x, y, width, height, color = 'red', canvas) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.animationStarted = 0;
       	if(this.x !== NaN) {
       		Particle.lastX.push(this.x);
       	}
       	if(this.y !== NaN) {
       		Particle.lastY.push(this.y);
       	}
       	if(Number.isNaN(this.x)) {
       		this.x = Particle.lastX.filter(x => !Number.isNaN(x))[0];
       	}
        if(Number.isNaN(this.y)) {
          this.y = Particle.lastY.filter(x => !Number.isNaN(x))[0];
        }
    }
    animate({
    	type,
        duration,
    }, die = false) {
    	const ctx = this.canvas.context;
        this.duration = duration || 1000;
        if(this.animationStarted === 0) {
        	this.animationStarted = Date.now();
        }
        if(type === 'scatter') {
  			// let interval = setInterval(() => {
  			// 	this.x += Utils.randomIntBetween(-50, 50);
  			// 	this.y += Utils.randomIntBetween(-50, 50);
	    //     	if(Date.now() > this.duration + this.animationStarted) {
	    //     		clearInterval(interval);
	    //     	}
	    //     	ctx.beginPath();
	    //     	ctx.fillStyle = this.color;
	    //     	ctx.fillRect(this.x, this.y, this.width, this.height);
	    //     }, 1 / duration);
            let random = Utils.randomIntBetween(-5, 5);
            this.x += Utils.randomIntBetween(-50, 50);
            this.y += Utils.randomIntBetween(-50, 50);
            this.width += random;
            this.height += random;
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (die) {
            this.die();
        }
    }
    die() {
        this.alive = false;
    }
}
Particle.lastX = [];
Particle.lastY = [];