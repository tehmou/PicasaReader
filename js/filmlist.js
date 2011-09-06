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

        _.each(this.entries, _.bind(function (entry) {
            var item = _.extend({ dataEntry: entry }, listItemObject);
            item.init();
            this.el.append(item.el);
            $(item.el).click(function () {
                $("#image-display").attr("src", entry.content.src);
            });
            item.onload = function () { this.refresh(); };
            this.items.push(item);
        }, this));


        this.createFiller();
        this.createFiller();
    },

    createFiller: function() {
        var item = _.extend({}, listItemObject);
        item.init();
        $("#list-container").append(item.el);
        this.items.push(item);
    }
};
