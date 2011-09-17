timotuominen.views.transformations.spherical = c0mposer.create(timotuominen.views.transformations.wheelerObject, {
    r: 0,
    widthOffset: 10.0,
    leftOffset: 18.0,
    ballAngle: Math.PI*.9,

    calculatePositions: function () {
        this.windowHeight = this.el.height();
        this.r = (this.windowHeight/2)/Math.sin(this.ballAngle/2);
    },

    render: function () {
        _.each(this.items, _.bind(function (item) {
            var screenOffset = item.pos - this.position - this.windowHeight/2;
            var itemAngle = item.originalHeight/this.r;
            var angleOffset = screenOffset/this.r;

            if (Math.abs(angleOffset) > Math.PI) {
                item.elOpacity = 0;
            } else {
                var centerY = this.r*Math.sin(angleOffset);
                var height = Math.abs(this.r*(Math.sin(angleOffset+itemAngle/2) - Math.sin(angleOffset-itemAngle/2)));
                var distance = 1 - Math.cos(angleOffset);

                item.elWidth = item.originalWidth - distance*this.widthOffset;
                item.elHeight = height;
                item.elLeft = distance*(this.leftOffset+this.widthOffset/2);
                item.elTop = this.windowHeight/2 + centerY - item.elHeight/2;
                item.elOpacity = Math.max(0.0, 1.0 - distance);
            }
            item.render();
        }, this));
    }
});