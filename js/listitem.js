var listItemObject;

(function () {

    var defaultTransformation = function () {
        if (!this.loaded) {
            return;
        }

        var r = 0.4 + 0.6*this.ratio;

        this.elWidth = this.originalWidth;
        this.elHeight = Math.floor(this.originalHeight * r);

        this.img.width(this.elWidth);
        this.img.height(this.elHeight);
        this.img.css("opacity", r);

        //var transform = "scale(" + (0.8 + 0.2*this.ratio) + ")";
        /*var transform = "scale(1.0," + (0.4 + 0.6*this.ratio) + ")";
        this.el.css("-moz-transform", transform);
        this.el.css("-webkit-transform", transform);
        this.el.css("transform", transform);*/
    };

    var createListItemEl = function () {
        this.el = $('<div></div>');
        if (this.dataEntry) {
            this.img = $('<img alt="" src="' + this.dataEntry["media$group"]["media$thumbnail"][1].url + '"/>');
        } else {
            this.img = $('<img alt="" src="IMG_2273_thumb.JPG"/>');
            this.img.css("opacity", 0.3);
        }

        this.img[0].onload = _.bind(function () {
            this.originalWidth = this.elWidth = parseInt(this.img.width());
            this.originalHeight = this.elHeight = parseInt(this.img.height());
            this.elMarginBottom = parseInt(this.img.css("marginBottom").replace("px", ""));
            if (this.onload) {
                this.onload();
            }
            this.loaded = true;
        }, this);
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
