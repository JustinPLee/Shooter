import { MouseEvents } from '../Dom/MouseEvents.js';
export const Utils = {
	searchObject: function(object, userKey) {
		for (const [key, value] of Object.entries(object)) {
			if(userKey === key){
		    	return object[key];
			}
		}
	},
    toRadians: degrees => degrees * (Math.PI / 180),
    toDegrees: radians => {
        let angle = radians * (180 / Math.PI);
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    },
    remove: (element, array) => array.splice(array.indexOf(element), 1),
    drawToMouse: function({
            x,
            y,
            width,
            height,
            object,
            canvas,
            offset
    }) {
        let targetX = MouseEvents.getMousePosition('mousemove').x - x;
        let targetY = MouseEvents.getMousePosition('mousemove').y - y;
        const rotation = Math.atan2(targetY, targetX);
        const ctx = canvas.context;
        offset = offset || 0;
        object = object || {};
        object.radian = rotation;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(object.radian + offset * (Math.PI / 180));
        ctx.fillRect(Math.round(width / 2 * (-1)),
            Math.round(height / 2 * (-1)), width, height);
        ctx.restore();
    },
    drawRotateAround: function({
        x,
        y,
        originX,
        originY,
        width,
        height,
        radian,
        canvas
    }) {
        const ctx = canvas.context;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(radian);
        ctx.rect(-originX, -originY, width, height);
        ctx.restore();
    },
    drawSpread: function({
        canvas,
        x,
        y,
        width,
        height,
        originX,
        originY,
        object,
        radian,
        spread
    }) {
        const ctx = canvas.context;
        object = object || {};
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(radian);
        ctx.rect(-originX, -originY, width, height);
        ctx.restore();

    },
    randomIntBetween: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
    deepSearch(object, key, predicate) {
        if (object.hasOwnProperty(key) && predicate(key, object[key]) === true) return object
        for (let i = 0; i < Object.keys(object).length; i++) {
            if (typeof object[Object.keys(object)[i]] === "object") {
                let o = this.deepSearch(object[Object.keys(object)[i]], key, predicate)
                if (o != null) return o
            }
        }
        return null;
    },
    rectCollides: (r1, r2) => {
        if(Number.isNaN(r1.x) || Number.isNaN(r2.x)) {
            return false;
        }
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    },
}