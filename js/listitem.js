var listItemObject;

(function () {

    var defaultTransformation = function () {
        if (!this.loaded) {
            return;
        }

        var r1 = 0.4 + 0.6*this.ratio;
        var r2 = 0.2 + 0.8*this.ratio;

        this.elWidth = this.originalWidth;
        this.elHeight = Math.floor(this.originalHeight * r1);

        this.img
            .width(this.elWidth)
            .height(this.elHeight)
            .css("opacity", r1);

        //var transform = "scale(" + (0.8 + 0.2*this.ratio) + ")";
        /*var transform = "scale(1.0," + (0.4 + 0.6*this.ratio) + ")";
        this.el.css("-moz-transform", transform);
        this.el.css("-webkit-transform", transform);
        this.el.css("transform", transform);*/
    };

    var createListItemEl = function () {
        this.el = $('<div></div>');
        if (this.model) {
            if (this.model.get("thumbnailUrl")) {
                this.img = $('<img alt="" src="' + this.model.get("thumbnailUrl") + '"/>');
                this.img[0].onload = _.bind(function () {
                    this.img.width(144);
                    this.originalWidth = this.elWidth = parseInt(this.img.width());
                    this.originalHeight = this.elHeight = parseInt(this.img.height());
                    if (this.onload) {
                        this.onload();
                    }
                    this.loaded = true;
                }, this);
            } else if (this.model.get("elContent")) {
                this.img = this.model.get("elContent");
            }
        }
        this.originalWidth = this.elWidth = this.img.css("width") || parseInt(this.img.width());
        this.originalHeight = this.elHeight = this.img.css("height") || parseInt(this.img.height());
        this.elMarginBottom = 5;
        this.el.append(this.img);
    };

    listItemObject = {
        loaded: false,
        originalWidth: 0, originalHeight: 0,
        elWidth: 0, elHeight: 0,
        elMarginBottom: 0,
        refresh: defaultTransformation,
        init: createListItemEl
    };

})();
