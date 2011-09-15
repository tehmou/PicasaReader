var createGallery = function (options) {
    var feed = options.feed,
        prependModels = options.prepend,
        appendModels = options.append,
        el = options.el,
        displayEl = options.displayEl;

    var entries, scrollController, filmlist;

    function createModels() {
        var models = [];
        if (options.createDebug) {
            for (var i = 0; i < options.numDebugItems; i++) {
                models.push({ text: "" + i });
            }
        } else {
            models = prependModels.concat(feed).concat(appendModels);
        }
        entries = new Backbone.Collection(models);
        entries.bind("itemClick", itemClickHandler);
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
        $(window).resize(filmlist.onResize);
    }

    function initScrollController() {
        var scrollArea = entries.models.length * (options.thumbnailHeight + options.thumbnailGap);
        /*var scrollMax =  scrollArea - $(window).height();

        scrollController = _.extend({}, simpleScrollController, {
            min: 0, max: scrollMax
        });
        scrollController.init();
        scrollController.positionChangeCallback = function () {
            filmlist.position = scrollController.position;
            filmlist.render();
        };*/

        if (options.touchMode === "desktop") {
            $(window).scroll(function (event) {
                filmlist.position = $(window).scrollTop();
                filmlist.render();
            });
            $("body").height(scrollArea);
        }

        /*$(window).mousewheel(function (event, delta) {
            scrollController.deltaFunction(delta);
            console.log(event);
        });*/
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