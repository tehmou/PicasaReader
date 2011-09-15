var wheelerObject = {

    position: 0,
    itemOffset: 0,
    widthOffset: 0.0,
    leftOffset: 8.0,

    getPosition: function () {
        return this.position;
    },
    onResize: function() {
        this.windowHeight = this.el.height();
        this.calculatePositions();
        this.render();
    },
    render: function() {
        this.calculate();
    },
    calculatePositions: function () {
        var pos = 0;
        var offset = 0;
        var increment, item;

        for (var i = 0; i < this.items.length; i++) {
            item = this.items[i];
            increment = item.originalHeight + item.margin;
            item.pos = pos + item.originalHeight/2;
            pos += increment;
            if (i < this.itemOffset) {
                offset += increment;
            }
        }
        _.each(this.items, function (item) {
            item.pos -= offset;
        });
    },
    calculate: function () {
        var ballAngle = Math.PI*.9;
        var r = (this.windowHeight/2)/Math.sin(ballAngle/2);

        _.each(this.items, _.bind(function (item) {
            var screenOffset = item.pos - this.position - this.windowHeight/2;
            var itemAngle = item.originalHeight/r;
            var angleOffset = screenOffset/(r);

            if (Math.abs(angleOffset) > Math.PI) {
                item.elOpacity = 0;
            } else {
                var centerY = r*Math.sin(angleOffset);
                var height = Math.abs(r*(Math.sin(angleOffset+itemAngle/2) - Math.sin(angleOffset-itemAngle/2)));
                var distance = 1 - Math.cos(angleOffset);

                item.elWidth = item.originalWidth - distance*this.widthOffset;
                item.elHeight = height;
                item.elLeft = distance*(this.leftOffset+this.widthOffset/2);
                item.elTop = this.windowHeight/2 + centerY - item.elHeight/2;
                item.elOpacity = Math.max(0.0, 1.0 - distance);
            }
            item.render();

            if (item.img) {
                //item.img.text(height);
            }

        }, this));
    }
};