var listItemObject;

(function () {

    var defaultTransformation = function () {
        if (!this.loaded) {
            return;
        }

        var r = 0.4 + 0.6*this.ratio;

        this.elWidth = this.originalWidth;
        this.elHeight = this.originalHeight * r;

        this.el.width(this.elWidth);
        this.el.height(this.elHeight);

        //var transform = "scale(" + (0.8 + 0.2*this.ratio) + ")";
        /*var transform = "scale(1.0," + (0.4 + 0.6*this.ratio) + ")";
        this.el.css("-moz-transform", transform);
        this.el.css("-webkit-transform", transform);
        this.el.css("transform", transform);*/
    };

    var createListItemEl = function () {
        this.el = $('<img alt="" src="' + this.dataEntry["media$group"]["media$thumbnail"][1].url + '"/>');
        this.el[0].onload = _.bind(function () {
            this.originalWidth = this.elWidth = parseInt(this.el.width());
            this.originalHeight = this.elHeight = parseInt(this.el.height());
            this.elMarginBottom = parseInt(this.el.css("marginBottom").replace("px", ""));
            if (this.onload) {
                this.onload();
            }
            this.loaded = true;
        }, this);
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
