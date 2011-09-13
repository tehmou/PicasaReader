var simpleScrollController = {
    min: 0, max: 0,
    position: 0,
    deltaFunction: function (delta) {
        this.position += delta;
        this.position = Math.min(this.max, this.position);
        this.position = Math.max(this.min, this.position);
        if (this.positionChangeCallback) {
            this.positionChangeCallback();
        }
    }
};