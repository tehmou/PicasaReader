var domListItemObject = c0mposer.create(listItemObject, {
    init: function () {
        this.el = $('<div></div>');
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
        this.el.append(this.img);
    },
    render: function () {
        this.img
            .width(this.elWidth)
            .height(this.elHeight)
            .css("opacity", this.opacity);
        this.el
            .css("top", this.elCenter - this.elHeight/2)
            .css("left", this.elLeft);
    }
});