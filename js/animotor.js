var animotorObject = {
      onResize: function() {
        windowHeight = $(window).height();
    },

    calculateRatios: function(event) {
        var spread = windowHeight;
        var focusPos = event.pageY;

        _.each(this.items, function (item) {
            var ratio = 1.0 - (Math.abs(item.pos - focusPos) / spread);
            ratio = Math.min(ratio, 1.0);
            ratio = Math.max(ratio, 0.0);
            item.ratio = ratio;
            item.refresh();
        });
    },

    calculateDimensions: function() {
        _.each(this.items, function (value) {
            value.calculatePosition();
        });
        //this.calculateRatios();
    }
};