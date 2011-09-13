(function() {
  window.createGallery = function(options) {
    var appendModels, createList, createModels, displayEl, el, entries, feed, itemClickHandler, prependModels, start;
    feed = options.feed;
    prependModels = options.prepend;
    appendModels = options.append;
    el = options.el;
    displayEl = options.displayEl;
    entries = new Backbone.Collection();
    createModels = function() {
      entries.refresh(feed);
      entries.bind("itemClick", itemClickHandler);
      entries.models.splice.apply(entries.models, [0, 0].concat(prependModels));
      return entries.models.splice.apply(entries.models, [entries.models.length, 0].concat(appendModels));
    };
    createList = function() {
      var filmbase, filmlist, listSettings;
      listSettings = {
        el: el,
        model: entries,
        listItemObject: _.extend({}, listItemObject, {
          originalWidth: options.thumbnailWidth,
          originalHeight: options.thumbnailHeight,
          margin: options.thumbnailGap
        })
      };
      filmbase = options.mode === "css" ? filmListObject : glFilmListObject;
      filmlist = _.extend({}, filmbase, listSettings);
      filmlist.init();
      filmlist.onResize();
      filmlist.refresh();
      return $(window).resize(filmlist.onResize).scroll(filmlist.refresh);
    };
    itemClickHandler = function(item) {
      return displayEl.attr("src", item.get("imageUrl"));
    };
    start = function() {
      return itemClickHandler(entries.at(2));
    };
    createModels();
    createList();
    return start();
  };
}).call(this);
