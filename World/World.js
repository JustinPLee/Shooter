import { Canvase } from '../Dom/Canvase.js';
import { WorldSFX } from './WorldSFX.js';
import { WorldVFX } from './WorldVFX.js';
import { WorldCamera } from './WorldCamera.js';
import { Enemy } from '../Objects/Enemy.js';
import { Keyboard, keys } from '../Dom/Keyboard.js';
import { Player } from '../Objects/Player.js';
import { Gun } from '../Objects/Gun.js';
import { Keybinds } from '../Dom/Keybinds.js';
import { Bullet } from '../Objects/Bullet.js';
import { Circle } from '../Objects/Circle.js';
import { Particle } from '../Objects/Particle.js';
export const World = (function() {
	const objects = [];
	const VFX = WorldVFX;
	const SFX = WorldSFX;
	const Camera = WorldCamera;
	const canvases = [];
	return {
		Sprites: {
			Player,
			Gun,
			Enemy,
			Bullet
		},
		Particle,
		Circle,
		Keybinds,
		Keyboard,
		keys,
		Canvase,
		VFX,
		SFX,
		Camera,
		addObject: function(object) {
			if(x in object && y in object && width in object && height in object) {
				this.objects.push(object);
			} else {
				throw new Error(`${object} does not have one of these values or is undefined, x: ${x}, y: ${y}, width: ${width}, height: ${height}`);
			}
		},
		createCanvas: function(DOMId, width, height) {
			const canvas = new Canvase(DOMId, width, height);
			this.canvases.push(canvas);
			return canvas;
		}
	}
})();