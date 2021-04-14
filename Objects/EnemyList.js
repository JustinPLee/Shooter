import { Utils } from '../misc/Utils.js';
export const EnemyList = (function() {
    let classifications = {
        minions: {
            speedster: {
                name: "speedster",
                width: 100,
                height: 100,
                damage: 10,
                velocity: { x: 0, y: 0 }
            },
            suicider: {
                name: 'suicider',
                width: 50,
                height: 50,
                damage: 25,
                velocity: { x: 5, y: 0 },
            }
        },
        bosses: {}
    }
    return {
        classifications,
        add(details) {
            this.list.push(details);
            return this.list.filter(x => x === details);
        },
        search(key, fn) {
            return Utils.deepSearch(this.classifications, key, fn);
        }
    }
})();