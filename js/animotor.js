var animotorObject = {
      onResize: function() {
        windowHeight = $(window).height();
    },

    calculateRatios: function(event) {
        this.spread = windowHeight*1.1;
        this.focusPos = $(window).scrollTop() + windowHeight/2;
        this.calculate();
    },

    calculate: function () {
        var pos = this.items[0].el.offset().top;
        _.each(this.items, _.bind(function (item) {
            pos += item.elHeight / 2.0;
            var ratio = 1.0 - (Math.abs(pos - this.focusPos) / this.spread)*2;
            ratio *= 2.0;
            ratio = Math.min(ratio, 1.0);
            ratio = Math.max(ratio, 0.0);
            ratio = Math.abs(Math.cos((1.0 - ratio)*Math.PI/2));
            item.ratio = ratio;
            item.refresh();
            pos += item.elHeight / 2.0 + item.elMarginBottom + 7.0; // 2.0 for border compensation
        }, this));
    }
};