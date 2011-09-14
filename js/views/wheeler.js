var wheelerObject = {

    position: 0,

    onResize: function() {
        this.windowHeight = $(window).height();
    },

    render: function(event) {
        this.spread = this.windowHeight;
        this.focusPos = this.position + this.windowHeight/2;
        this.calculatePositions();
        this.calculate();
    },

    calculatePositions: function () {
        var pos = 0;
        _.each(this.items, _.bind(function (item) {
            item.pos = pos;
            pos += item.elHeight + item.margin;
        }, this));
    },

    calculate: function () {
        _.each(this.items, _.bind(function (item) {
            item.elTop = item.pos - this.position;
            item.render();
        }, this));
    }
};