var filmListObject = {

    listItemObject: null,
    model: null,

    init: function () {
        if (!this.el) {
            this.el = "<div></div>";
        }
        this.items = [];

        _.bindAll(this);

        this.model.each(_.bind(function (entry) {
            var item = _.extend({}, listItemObject, {
                model: entry,
                originalWidth: 144,
                originalHeight: 86,
                marginBottom: 7
            });
            item.init();
            this.el.append(item.el);
            $(item.el).click(function () {
                entry.trigger("itemClick", entry);
            });
            item.onload = function () { this.refresh(); };
            this.items.push(item);
        }, this));

        return this;
    },

    onResize: function () { }
};
