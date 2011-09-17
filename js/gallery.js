timotuominen.createGallery = function (options) {
    var feed = options.feed,
        prependModels = options.prepend,
        appendModels = options.append,
        el = options.el,
        displayEl = options.displayEl,
        transformation = options.transformation;

    var entries, filmlist;

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
        var listView, listItem;

        if (options.mode === "css") {
            listView = timotuominen.views.domListObject;
            listItem = timotuominen.views.item.domListItemObject;
        } else {
            listView = timotuominen.views.glListObject;
            listItem = timotuominen.views.item.glListItemObject;
        }

        var listSettings = {
            el: el,
            model: entries,
            itemOffset: options.numMarginItems,
            listItemObject: _.extend({}, listItem, {
                originalWidth: options.thumbnailWidth,
                originalHeight: options.thumbnailHeight,
                margin: options.thumbnailGap
            })
        };
        filmlist = _.extend({}, listView, transformation, listSettings);
        filmlist.init();
        filmlist.onResize();
        filmlist.render();
        $(window).resize(filmlist.onResize);
    }

    function initScrollController() {
        var scrollArea = (entries.models.length-2*options.numMarginItems) * (options.thumbnailHeight + options.thumbnailGap);
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