jsFacer.assert(timotuominen.views.item.domListItemObject, "iView");
jsFacer.assert(timotuominen.views.item.glListItemObject, "iView");

jsFacer.assert(timotuominen.views.domListObject, "iView");
jsFacer.assert(timotuominen.views.glListObject, "iView");

jsFacer.assert(timotuominen.utils.kineticScrollController, "iScrollController");


timotuominen.init = function (options) {
    var displayEl = options.displayEl,
        feed = options.feed,
        prependModels = options.prepend,
        appendModels = options.append;

    var entries;

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

    function itemClickHandler(item) {
        displayEl.attr("src", item.get("imageUrl"));
    }

    function start() {
        itemClickHandler(entries.at(2));
    }

    createModels();
    timotuominen.createGallery(_.extend(options, {
        el: options.el,
        entries: entries
    }));
    start();
};