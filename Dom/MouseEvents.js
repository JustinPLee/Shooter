export const MouseEvents = {
    mousemove: { x: 0, y: 0 },
    addLoop(query) {
        document.addEventListener(query, e => {
            this[query].x = e.clientX;
            this[query].y = e.clientY;
        });
    },
    getMousePosition(query) {
        return {
            x: this[query].x,
            y: this[query].y
        };
    },
    addEvent: function(event, fn) {
        document.addEventListener(event, e => fn(e));
    }
}