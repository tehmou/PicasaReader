timotuominen.utils.kineticScrollController = {
    min: 0, max: 0,

    dragForceConversion: 8.0,

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
    },  
    deltaFunction: function (delta) {
        this.force = delta*this.dragForceConversion;
        this.requestFrame();
    },

    calculateForce: function () {
        var delta = 0;
        if (this.position < this.min) {
            delta = this.min - this.position;
        } else if (this.position > this.max) {
            delta = this.max - this.position;
        }

        // Friction
        //this.force += -this.speed*1.1;

        // Rubber
        //this.force += delta*0.2;

        // TODO: does not work...
        //this.force += delta*2;
    },
    applyForce: function () {
        this.speed += this.force;
    },
    applySpeed: function () {
        this.position += this.speed;
    }
};