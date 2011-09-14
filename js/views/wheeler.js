var wheelerObject = {

    position: 0,

    onResize: function() {
        this.windowHeight = $(window).height();
        this.render();
    },

    render: function() {
        this.spread = this.windowHeight/2;
        this.focusPos = this.position - this.windowHeight/2;
        this.calculatePositions();
        this.calculate();
    },

    calculatePositions: function () {
        var pos = 0;
        _.each(this.items, _.bind(function (item) {
            item.pos = pos + item.originalHeight/2;
            pos += item.elHeight + item.margin;
        }, this));
    },

    calculate: function () {
        _.each(this.items, _.bind(function (item) {
            var pos = item.pos - this.focusPos;
            item.elTop = pos - item.originalHeight/2 - this.windowHeight/2;
            item.render();
        }, this));
    }
};