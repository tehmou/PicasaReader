var createGallery = function (options) {
    var feed = options.feed,
        prependModels = options.prepend,
        appendModels = options.append,
        el = options.el,
        displayEl = options.displayEl;

    var entries, scrollController, filmlist;

    function createModels() {
        entries = new Backbone.Collection(feed);
        entries.bind("itemClick", itemClickHandler);
        entries.models.splice.apply(entries.models, [0, 0].concat(prependModels));
        entries.models.splice.apply(entries.models, [entries.models.length, 0].concat(appendModels));
    }

    function createList() {
        var filmbase, listItem;

        if (options.mode === "css") {
            filmbase = filmListObject;
            listItem = domListItemObject;
        } else {
            filmbase = glFilmListObject;
            listItem = glListItemObject;
        }

        var listSettings = {
            el: el,
            model: entries,
            listItemObject: _.extend({}, listItem, {
                originalWidth: options.thumbnailWidth,
                originalHeight: options.thumbnailHeight,
                margin: options.thumbnailGap
            })
        };
        filmlist = _.extend({}, filmbase, wheelerObject, listSettings);
        filmlist.init();
        filmlist.render();
        filmlist.onResize();
        $(window).resize(filmlist.onResize);
    }

    function initScrollController() {
        scrollController = _.extend({}, simpleScrollController, {
            min: 0, max: entries.models.length * (options.thumbnailHeight + options.thumbnailGap) - $(window).height()
        });
        scrollController.init();
        scrollController.positionChangeCallback = function () {
            filmlist.position = scrollController.position;
            filmlist.render();
        };
        $(window).mousewheel(function (event) {
            scrollController.deltaFunction(event.wheelDelta);
        });
    }

    function itemClickHandler(item) {
        displayEl.attr("src", item.get("imageUrl"));
    }

    function start() {
        itemClickHandler(entries.at(2));
    }

    createModels();
    createList();
    initScrollController();
    start();
};