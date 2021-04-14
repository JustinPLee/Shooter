export class WorldCamera {
	constructor(viewX, viewY, mapX, mapY, width, height) {
		this.following = null;

		this.followOffsetX = null;
		this.followOffsetY = null;

		this.viewX = viewX;
		this.viewY = viewY;

		this.mapX = mapX;
		this.mapY = mapY;

		this.width = width;
		this.height = height;
	}
	follow(object, offsetX, offsetY) {
		this.following = object;
		this.followingOffsetX = offsetX;
		this.followingOffsetY = offsetY;
	}
	update() {
		if(this.following) {
			if(
				Math.abs(-this.following.x + this.followingOffsetX) >= this.mapX - this.width + this.following.width / 2
				|| (-this.following.x + this.followingOffsetX >= 5)
			) {
				this.viewX = this.viewX;
			} else {
    			this.viewX = WorldCamera.clamp(-this.following.x + this.followingOffsetX, -this.mapX, this.mapX - this.width);
    		}
			if(
				Math.abs(-this.following.y + this.followingOffsetY) >= this.mapY - this.height + this.following.height / 2
				|| (-this.following.y + this.followingOffsetY >= 5)
			) {
				this.viewY = this.viewY;
			} else {
    			this.viewY = WorldCamera.clamp(-this.following.y + this.followingOffsetY, -this.mapY, this.mapY - this.height);
    		}
		}

	}
	set(viewX, viewY, width, height) {
		this.viewX = viewX;
		this.viewY = viewY;
		this.width = width;
		this.height = height;
	}
	static clamp(value, min, max) {
	    if (value < min) return min;
	    else if (value > max) return max;
	    return value;
	}
}