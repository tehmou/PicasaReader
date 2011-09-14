var simpleScrollController = {
    min: 0, max: 0,
    rubberStrength: 0.5,

    position: 0,
    speed: 0,
    force: 0,

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
        this.force = delta;
        this.requestFrame();
    },

    calculateForce: function () {
        var delta = 0;
        if (this.position < this.min) {
            delta = this.min - this.position;
        } else if (this.position > this.max) {
            delta = this.max - this.position;
        }
        this.force += delta*this.rubberStrength;
        this.force += -this.speed;
    },
    applyForce: function () {
        this.speed += this.force * 0.1;
    },
    applySpeed: function () {
        this.position += this.speed;
    },
    update: function () {
        this.framePending = false;

        this.calculateForce();
        this.applyForce();
        this.applySpeed();

        if (this.positionChangeCallback) {
            this.positionChangeCallback();
        }
        if (this.force != 0 || Math.abs(this.speed) > 0.05) {
            this.requestFrame();
        }
        this.force = 0;
    }
};