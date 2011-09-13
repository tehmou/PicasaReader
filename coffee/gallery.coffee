window.createGallery = (options) ->
  feed = options.feed
  prependModels = options.prepend
  appendModels = options.append
  el = options.el
  displayEl = options.displayEl
  entries = new Backbone.Collection()

  createModels = ->
    entries.refresh(feed)
    entries.bind("itemClick", itemClickHandler)
    entries.models.splice.apply(entries.models, [0, 0].concat(prependModels))
    entries.models.splice.apply(entries.models, [entries.models.length, 0].concat(appendModels))

  createList = ->
    listSettings =
      el: el
      model: entries
      listItemObject: _.extend({}, listItemObject, {
        originalWidth: options.thumbnailWidth,
        originalHeight: options.thumbnailHeight,
        margin: options.thumbnailGap
      })

    filmbase =
      if options.mode == "css"
        filmListObject
      else
        glFilmListObject

    filmlist = _.extend({}, filmbase, listSettings)
    filmlist.init()
    filmlist.onResize()
    filmlist.refresh()
    $(window)
      .resize(filmlist.onResize)
      .scroll(filmlist.refresh)

  itemClickHandler = (item) ->
    displayEl.attr("src", item.get("imageUrl"))

  start = ->
    itemClickHandler(entries.at(2))

  createModels()
  createList()
  start()
