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
        item.init();
        item.render();
        item.onload = function () { this.render(); };
        this.itemCreated(item);
    },
    itemCreated: function (item) {
        this.items.push(item);
    },
    render: function () { }
};
