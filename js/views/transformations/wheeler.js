timotuominen.views.transformations.wheelerObject = {
    position: 0,
    itemOffset: 0,

    onResize: function() {
        this.calculatePositions();
        this.render();
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
    }
};