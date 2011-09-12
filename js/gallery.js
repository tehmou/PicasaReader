var createGallery = function (options) {
    var feed = options.feed;
    var prependModels = options.prepend;
    var appendModels = options.append;
    var entries;

    createModels();
    createList();
    start();

    function createModels() {
        entries = new Backbone.Collection(feed);
        entries.bind("itemClick", itemClickHandler);
        entries.models.splice.apply(entries.models, [0, 0].concat(prependModels));
        entries.models.splice.apply(entries.models, [entries.models.length, 0].concat(appendModels));
    }

    function createList() {
        var filmlist = _.extend({}, filmListObject, {
            listItemObject: listItemObject,
            model: entries,
            el: $("#list-container"),
            thumbnailWidth: options.thumbnailWidth,
            thumbnailHeight: options.thumbnailHeight,
            thumbnailGap: options.thumbnailGap
        }).init();
        filmlist.onResize();
        filmlist.refresh();
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