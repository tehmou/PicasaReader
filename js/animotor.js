var animotorObject = {
      onResize: function() {
        windowHeight = $(window).height();
    },

    calculateRatios: function(event) {
        this.spread = windowHeight;
        this.focusPos = $(window).scrollTop() + windowHeight/2;
        this.calculate();
    },

    calculate: function () {
        var pos = 0;
        _.each(this.items, _.bind(function (item) {
            pos += item.elHeight / 2.0;
            var ratio = 1.0 - (Math.abs(pos - this.focusPos) / this.spread)*2;
            ratio *= 2.0;
            ratio = Math.min(ratio, 1.0);
            ratio = Math.max(ratio, 0.0);
            ratio = Math.sin(ratio * Math.PI / 2);
            item.ratio = ratio;
            item.refresh();
            pos += item.elHeight / 2.0 + item.elMarginBottom;
        }, this));
    }
};