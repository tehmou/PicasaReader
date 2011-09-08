var filmListObject = {

    listItemObject: null,
    entries: null,

    init: function () {
        if (!this.el) {
            this.el = "<div></div>";
        }
        this.items = [];

        _.bindAll(this);

        this.createFiller();
        this.createFiller();

        this.model.each(_.bind(function (entry) {
            var item = _.extend({ model: entry }, listItemObject);
            item.init();
            this.el.append(item.el);
            $(item.el).click(function () {
                $("#image-display").attr("src", entry.get("imageUrl"));
            });
            item.onload = function () { this.refresh(); };
            this.items.push(item);
        }, this));


        this.createFiller();
        this.createFiller();

        return this;
    },

    createFiller: function() {
        var item = _.extend({}, listItemObject);
        item.init();
        $("#list-container").append(item.el);
        this.items.push(item);
    }
};
