timotuominen.createGallery = function (options) {
    var el = options.el,
        transformation = options.transformation,
        entries = options.entries;

    var listView;

    function createList() {
        var listItem;

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
        listView = _.extend({}, listView, transformation, listSettings);
        listView.init();
        listView.onResize();
        listView.render();
        $(window).resize(listView.onResize);
    }

    function initScrollController() {
        if (options.touchMode === "desktop") {
            var scrollArea = (entries.models.length-2*options.numMarginItems) * (options.thumbnailHeight + options.thumbnailGap);
            $(window).scroll(function (event) {
                listView.position = $(window).scrollTop();
                listView.render();
            });
            $("body").height(scrollArea);
        } else if (options.touchMode === "mobile") {
            var scrollMax =  scrollArea - $(window).height();

            scrollController = _.extend({}, simpleScrollController, {
                min: 0, max: scrollMax
            });
            scrollController.init();
            scrollController.positionChangeCallback = function () {
                listView.position = scrollController.position;
                listView.render();
            };
        }
    }

    createList();
    initScrollController();
};