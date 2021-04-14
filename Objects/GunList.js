export const GunList = (function() {
	return {
	    list: [
	    	{
	            name: 'BIGSLUGGER',
	            color: '0, 0, 255',
	            opacity: 1,
	            fireRate: 800,
	            active: false,
	            width: 50,
	            height: 20,
	            reloadDelay: 1100,
	            bullet: { width: 10, height: 20, damage: 150, velocity: { x: 4, y: 4 } },
	            spread: 0,
	            ammo: 8,
	            capacity: 8
	        },
	        {
	            name: 'SMALLRAPIDS',
	            color: '0, 255, 255',
	            opacity: 1,
	            fireRate: 50,
	            active: false,
	            width: 0.5,
	            height: 0.5,
	            reloadDelay: 600,
	            bullet: { width: 6, height: 3.5, damage: 100, velocity: { x: 15, y: 15 } },
	            spread: 0,
	            ammo: 75,
	            capacity: 75
	        },
	        {
	            name: 'SLOWRAPIDS',
	            color: '0, 255, 255',
	            opacity: 1,
	            fireRate: 500,
	            active: false,
	            width: 0.5,
	            height: 0.5,
	            reloadDelay: 500,
	            bullet: { width: 20, height: 10, damage: 20, velocity: { x: 12, y: 12 } },
	            spread: 0,
	            ammo: 100,
	            capacity: 100
	        }
	    ],
	    add(details) {
	        this.list.push(details);
	        return this.list.find(x => x === details);
	    },
	    search(gunName) {
	        let filtered = this.list.filter(x => x.name === gunName);
	        return filtered.length === 1 ? filtered[0] : filtered;
	    }
	}
})();