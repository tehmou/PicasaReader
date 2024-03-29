jsFacer.assert(timotuominen.views.item.domListItemObject, "iView");
jsFacer.assert(timotuominen.views.item.glListItemObject, "iView");

jsFacer.assert(timotuominen.views.domListObject, "iView");
jsFacer.assert(timotuominen.views.glListObject, "iView");

//jsFacer.assert(timotuominen.utils.kineticScrollController, "iScrollController");


timotuominen.init = function (options) {
    var displayEl = options.displayEl,
        htmlContentEl = options.htmlContentEl,
        feed = options.feed,
        prependModels = options.prepend,
        appendModels = options.append;

    var entries, imageDisplay;

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
        if (item.attributes.hasOwnProperty("imageUrl")) {
            htmlContentEl.html("");
            imageDisplay.bindToModel(item);
        } else if (item.attributes.hasOwnProperty("htmlContent")) {
            displayEl.html("");
            htmlContentEl.html(item.get("htmlContent"));
        }
    }

    function start() {
        itemClickHandler(entries.at(prependModels.length));
    }

    createModels();
    timotuominen.createGallery(_.extend(options, {
        el: options.el,
        entries: entries
    }));
    imageDisplay = _.extend({}, timotuominen.views.imageDisplay, {
        el: displayEl
    }).init();
    start();
};