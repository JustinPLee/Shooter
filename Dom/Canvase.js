export class Canvase {
    constructor(DOMId, width, height, offsetX, offsetY) {
        this.id = DOMId;
        this.width = width;
        this.height = height;
        this.element = document.getElementById(DOMId);
        this.context = this.element.getContext('2d');
        this.element.width = width;
        this.element.height = height;
        this.element.style.left = `${offsetX}px` || '0px';
        this.element.style.top = `${offsetY}px` || '0px';
        this.x = offsetX || 0;
        this.y = offsetY || 0;
        this.matrix = [1, 0, 0, 1, 0, 0];
        this.inverseMatrix = [1, 0, 0, 1];
        this.left = 0;
        this.top = 0;
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    setTransform(horizontalScaling, verticalSkewing, horizontalSkweing, verticalScaling, horizontalTranslation, verticalTranslation) {
        this.matrix = [horizontalScaling, verticalSkewing, horizontalSkweing, verticalScaling, horizontalTranslation, verticalTranslation];
        return this.matrix;
    }
    isOnBounds() {
        return {
            down: (object) => object.y + object.radius === this.element.height,
            up: (object) => object.y === this.top,
            right: (object) => object.x + object.radius === this.element.width,
            left: (object) => object.x === this.left
        }
    }
}