timotuominen.views.domListObject = c0mposer.create(timotuominen.views.listBaseObject, {
    itemCreated: function (item) {
        $(this.el).append(item.el);
        $(item.el).click(function () {
            item.model.trigger("itemClick", item.model);
        });
    }
});
