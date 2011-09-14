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
        var ballAngle = Math.PI/2;
        var r = (this.windowHeight/2)/Math.sin(ballAngle/2);

        _.each(this.items, _.bind(function (item) {
            var screenOffset = item.pos - this.position - this.windowHeight/2;

            var itemAngle = (item.originalHeight)/2*Math.PI*r;
            var angleOffset = screenOffset/(r);
            var centerY = r*Math.sin(angleOffset);
            var height = r*(Math.sin(angleOffset+itemAngle/2) - Math.sin(angleOffset-itemAngle/2));
            var distance = r*(1 - Math.cos(angleOffset));

            //var ratio = pos/this.spread;
            //item.ratio = ratio;
            if (item.img) {
                //item.img.text(height);
            }

            item.elWidth = item.originalWidth;
            item.elHeight = height;
            item.elTop = this.windowHeight/2 + centerY - item.elHeight/2;
            item.elOpacity = Math.max(0, (r - distance)/r);
            //item.elTop = item.pos - this.position - item.elHeight/2;// - this.windowHeight/2;
            //item.elTop = item.pos - this.position - item.elHeight/2;// - this.windowHeight/2;

            item.render();
        }, this));
    }
};