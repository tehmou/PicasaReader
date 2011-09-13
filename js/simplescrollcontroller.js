var simpleScrollController = {
    min: 0, max: 0,
    position: 0,
    framePending: false,
    init: function () {
        this.update = _.bind(this.update, this);
    },
    requestFrame: function () {
        if (!this.framePending) {
            window.requestAnimationFrame(this.update);
            this.framePending = true;
        }
    },
    deltaFunction: function (delta) {
        this.position += delta;
        this.requestFrame();
    },
    update: function () {
        this.framePending = false;
        if (this.position < this.min) {
            this.position += 1;
        }
        if (this.position > this.max) {
            this.position -= 1;
        }
        if (this.positionChangeCallback) {
            this.positionChangeCallback();
        }
        if (this.position < this.min || this.position > this.max) {
            this.requestFrame();
        }
    }
};