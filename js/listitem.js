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
    };

    var createListItemEl = function () {
        this.el = $('<div></div>');
        if (this.model) {
            if (this.model.get("thumbnailUrl")) {
                this.img = $('<img alt="" src="' + this.model.get("thumbnailUrl") + '"/>');
                this.img[0].onload = _.bind(function () {
                    this.img.width(144);
                    this.originalWidth = this.img.width();
                    this.originalHeight = this.img.height();
                    if (this.onload) {
                        this.onload();
                    }
                    this.loaded = true;
                }, this);
            } else if (this.model.get("elContent")) {
                this.img = this.model.get("elContent");
                this.loaded = true;
            }
        }
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
