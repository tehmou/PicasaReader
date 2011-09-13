var wheelerObject = {

    position: 0,

    onResize: function() {
        this.windowHeight = $(window).height();
    },

    render: function(event) {
        this.spread = this.windowHeight;
        this.focusPos = this.position + this.windowHeight/2;
        this.calculate();
    },

    calculate: function () {
        var pos = 0;
        _.each(this.items, _.bind(function (item) {
            item.elTop = pos - this.position;
            item.render();
            pos += item.elHeight + item.margin;
        }, this));
    }
};