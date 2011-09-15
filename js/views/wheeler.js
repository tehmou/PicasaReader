var wheelerObject = {

    position: 0,

    onResize: function() {
        this.windowHeight = $(window).height();
        this.render();
    },

    render: function() {
        this.calculatePositions();
        this.calculate();
    },

    calculatePositions: function () {
        var pos = 0;
        _.each(this.items, _.bind(function (item) {
            item.pos = pos + item.originalHeight/2;
            pos += item.originalHeight + item.margin;
        }, this));
    },

    calculate: function () {
        var ballAngle = Math.PI*1.0;
        var r = (this.windowHeight/2)/Math.sin(ballAngle/2);

        _.each(this.items, _.bind(function (item) {
            var screenOffset = item.pos - this.position - this.windowHeight/2;
            var itemAngle = item.originalHeight/r;
            var angleOffset = screenOffset/(r);
            var centerY = r*Math.sin(angleOffset);
            var height = Math.abs(r*(Math.sin(angleOffset+itemAngle/2) - Math.sin(angleOffset-itemAngle/2)));
            var distance = 1 - Math.cos(angleOffset);

            item.elWidth = item.originalWidth;
            item.elHeight = height;
            item.elLeft = distance*40.0;
            item.elTop = this.windowHeight/2 + centerY - item.elHeight/2;
            item.elOpacity = Math.abs(angleOffset) > Math.PI ? 0.0 : Math.max(0.0, 1.0 - distance/2);
            item.render();

            if (item.img) {
                //item.img.text(height);
            }

        }, this));
    }
};