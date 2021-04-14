"use strict";
export const Keyboard = (() => {
    const keys = { isDisabled: false };
    return {
        keys,
        enable(...keyss) {
            const key = keys;
            keyss.forEach(x => {
                key[x] = {
                    duration: 0,
                    currentDuration: 0,
                    start: 0,
                    isPressed: false,
                    isReleased: false,
                    lastReleased: false,
                    isDisabled: false,
                    lastDuration: 0
                };
            })
            document.addEventListener('keydown', e => {
                if (!key[e.code]) {
                    key[e.code] = {
                        lastDuration: 0,
                        duration: 0,
                        currentDuration: 0,
                        isDisabled: false
                    };
                }
                if (key[e.code].isDisabled) { key[e.code].isPressed = false; return; }
                key[e.code].currentDuration += Date.now() - key[e.code].start;
                key[e.code].start = Date.now();
                if (key[e.code].isReleased) {
                    key[e.code].lastReleased = true;
                }
                if (key[e.code].isPressed) {
                    key[e.code].lastPressed = true;
                }
                key[e.code].isPressed = true;
                key[e.code].isReleased = false;
            });
            document.addEventListener('keyup', e => {
                if (!key[e.code]) {
                    key[e.code] = {
                        lastDuration: 0,
                        duration: 0,
                        currentDuration: 0,
                        isDisabled: false
                    };
                }
                if (key[e.code].isDisabled) { key[e.code].isPressed = false; return; }
                key[e.code].currentDuration = 0;
                key[e.code].duration = (Date.now() - key[e.code].start) / 1000;
                key[e.code].lastDuration = key[e.code].duration;
                if (key[e.code].isReleased) {
                    key[e.code].lastReleased = true;
                }
                if (key[e.code].isPressed) {
                    key[e.code].lastPressed = true;
                }
                key[e.code].isPressed = false;
                key[e.code].isReleased = true;
            });
        }
    }
})();
const keys = Keyboard.keys;
export { keys };