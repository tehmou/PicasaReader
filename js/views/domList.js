var domListObject = c0mposer.create(listBaseObject, {
    itemCreated: function (item) {
        $(item.el).click(function () {
            item.model.trigger("itemClick", item.model);
        });
        $(this.el).append(item.el);
    }
});
