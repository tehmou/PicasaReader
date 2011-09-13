var filmListObject = c0mposer.create(filmListBase, {
    itemCreated: function (item) {
        $(item.el).click(function () {
            item.model.trigger("itemClick", item.model);
        });
        $(this.el).append(item.el);
    }
});
