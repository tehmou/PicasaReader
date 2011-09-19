timotuominen.views.item.glListItemObject = c0mposer.create(
    timotuominen.gl.elements.glObject,
    timotuominen.gl.elements.glPlaneRenderer,
    timotuominen.gl.elements.glShadered,
    timotuominen.views.item.listItemObject,
    {
    init: function () {
        /*this.el = $('<div></div>');
        if (this.model) {
            if (this.model.get("thumbnailUrl")) {
                this.img = $('<img alt="" src="' + this.model.get("thumbnailUrl") + '"/>');
                this.img[0].onload = _.bind(function () {
                    this.img.width(this.originalWidth);
                    this.originalHeight = this.img.height();
                    if (this.onload) {
                        this.onload();
                    }
                    this.loaded = true;
                }, this);
            } else if (this.model.get("text")) {
                this.img = $("<div><span>" + this.model.get("text") + "</span></div>");
                this.loaded = true;
            } else {
                this.img = $("<div class='blank'></div>");
                this.loaded = true;
            }
        }
        this.el.append(this.img);*/
    },
    preRender: function () {

    },
    render: function () { }
});