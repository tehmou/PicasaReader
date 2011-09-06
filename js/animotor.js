var animotorObject = {
      onResize: function() {
        windowHeight = $(window).height();
    },

    calculateRatios: function(event) {
        this.spread = windowHeight;
        //this.focusPos = event.pageY;
        this.focusPos = $(window).scrollTop() + windowHeight/2;
        this.calculate();
    },

    calculate: function () {
        _.each(this.items, _.bind(function (item) {
            var ratio = 1.0 - (Math.abs(item.pos - this.focusPos) / this.spread)*2;
            ratio = Math.min(ratio, 1.0);
            ratio = Math.max(ratio, 0.0);
            item.ratio = ratio;
            item.refresh();
        }, this));
    },

    calculateDimensions: function() {
        _.each(this.items, function (value) {
            value.calculatePosition();
        });
    }
};