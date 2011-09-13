var listItemObject;

(function () {

    var transformations = {
        scaleY: function () {
            var r1 = 0.4 + 0.6*this.ratio;
            var r2 = 0.2 + 0.8*this.ratio;

            this.elWidth = this.originalWidth;
            this.elHeight = Math.floor(this.originalHeight * r1);
            this.elOpacity = r1;
        }
    };

    var createListItemEl = function () {
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
    };

    listItemObject = {
        loaded: false,
        ratio: 1.0,
        originalWidth: 0, originalHeight: 0,
        elWidth: 0, elHeight: 0, margin: 0,
        elTop: 0, elLeft: 0,
        transformation: transformations.scaleY,
        render: function () {
            this.transformation();
            this.img
                .width(this.elWidth)
                .height(this.elHeight)
                .css("opacity", this.opacity);
            this.el
                .css("top", this.elTop)
                .css("left", this.elLeft);

        },
        init: createListItemEl
    };

})();
