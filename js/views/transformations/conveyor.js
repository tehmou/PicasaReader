timotuominen.views.transformations.conveyor = c0mposer.create(timotuominen.views.transformations.wheelerObject, {

    widthOffset: 10.0,
    leftOffset: 18.0,
    ballAngle: Math.PI*.9,
    straightLengthPercentage: .6,

    calculatePositions: function () {
        this.halfWindowHeight = this.el.height()/2;
        this.r = (1.0-this.straightLengthPercentage)*this.halfWindowHeight/Math.sin(this.ballAngle/2);
    },

    render: function () {
        _.each(this.items, _.bind(function (item) {
            var screenOffset = item.pos - this.position - this.halfWindowHeight;
            var sign = screenOffset != 0  ? (screenOffset/Math.abs(screenOffset)) : 0;

            if (Math.abs(screenOffset/this.halfWindowHeight) < this.straightLengthPercentage) {
                item.elWidth = item.originalWidth;
                item.elHeight = item.originalHeight;
                item.elLeft = 0;
                item.elTop = screenOffset + this.halfWindowHeight - item.elHeight/2;
                item.elOpacity = 1.0;
            } else {
                screenOffset -= sign*this.straightLengthPercentage*this.halfWindowHeight;

                var itemAngle = item.originalHeight/this.r;
                var angleOffset = screenOffset/this.r;

                if (Math.abs(angleOffset) > Math.PI) {
                    item.elOpacity = 0;
                } else {
                    var absStraightCompensation = this.halfWindowHeight*this.straightLengthPercentage;
                    var centerY = this.r*Math.sin(angleOffset) + sign*absStraightCompensation;
                    var height = this.r*(Math.sin(angleOffset+itemAngle/2) - Math.sin(angleOffset-itemAngle/2));
                    var distance = 1 - Math.cos(angleOffset);

                    //console.log("angle:" + (itemAngle*180/Math.PI) + ", offset:" + (angleOffset*180/Math.PI) + ", height:" + height);

                    item.elWidth = item.originalWidth - distance*this.widthOffset;
                    item.elHeight = Math.abs(height);
                    item.elLeft = distance*(this.leftOffset+this.widthOffset/2);
                    item.elTop = this.halfWindowHeight + centerY - item.elHeight/2;
                    item.elOpacity = Math.max(0.0, 1.0 - distance);
                }
            }

            item.render();
        }, this));
    }
});