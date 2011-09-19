timotuominen.views.listBaseObject = {
    listItemObject: null,
    model: null,

    init: function () {
        _.bindAll(this);
        this.items = [];
        this.model.each(this.createItem);
    },
    createItem: function (entry) {
        var item = _.extend({}, this.listItemObject, {
            model: entry
        });
        this.items.push(item);
        this.itemCreated(item);
    },
    itemCreated: function (item) {
        item.init();
        item.onload = function () { this.render(); };
        item.render();
    },
    render: function () { }
};
