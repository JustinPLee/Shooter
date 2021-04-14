export const Keybinds = (function() {
    const map = new Map();
    map.set('move_up', 'KeyW');
    map.set('move_right', 'KeyD');
    map.set('move_down', 'KeyS');
    map.set('move_left', 'KeyA');
    map.set('reload', 'KeyR');
    map.set('settings_menu', 'Escape');
    map.set('shoot_right', 'ArrowRight');
    map.set('shoot_down', 'ArrowDown');
    map.set('shoot_up', 'ArrowUp');
    map.set('shoot_left', 'ArrowLeft');
    return {
		nextToChange: null,
		map,
		backup: new Map(map),
		find(query) {
			return map.get(query);
		},
		change(key, value) {
			if([...map.keys()].includes(key)){
				map.set(key, value);
				return map;
			} else {
				throw new Error(key, value);
			}
		},
		setNextChange(key) {
			this.nextToChange = key;
			return this.nextToChange;
		}
    }
})();