var createGallery = function (options) {
    var feed = options.feed;
    var entries;

    createModels();
    createList();
    start();

    function createModels() {
        entries = new Backbone.Collection(feed);
        entries.bind("itemClick", itemClickHandler);

        var aboutItem = new Backbone.Model({
            elContent: $('<div><span>About</span></div>')
        });
        var menuItem = new Backbone.Model({
            elContent: $('<div><span>Menu</span></div>')
        });
        entries.models.splice(0, 0, aboutItem, menuItem);
        entries.models.push(new Backbone.Model({ elContent: $('<div class="blank"></div>') }));
        entries.models.push(new Backbone.Model({ elContent: $('<div class="blank"></div>') }));
    }

    function createList() {
        var filmlist = _.extend({}, filmListObject, animotorObject, {
            listItemObject: listItemObject,
            model: entries,
            el: $("#list-container")
        }).init();
        filmlist.onResize();
        $(window)
                .resize(filmlist.onResize)
                .scroll(filmlist.refresh);
    }

    function itemClickHandler(item) {
        $("#image-display").attr("src", item.get("imageUrl"));
    }

    function start() {
        itemClickHandler(entries.at(2));
    }
};