var listItemObject;

(function () {

    var defaultTransformation = function () {
        var transform = "scale(" + (0.8 + 0.2*this.ratio) + ")";
        this.img.css("-moz-transform", transform);
        this.img.css("-webkit-transform", transform);
        this.img.css("transform", transform);
    };

    var calculatePositionVertical = function () {
        var top = $(this.img).offset().top;
        this.pos = top + $(this.img).height()/2;
    };

    var createListItemEl = function () {
        this.el = $('<div></div>');
        this.img = $('<img alt="" src="' + this.dataEntry["media$group"]["media$thumbnail"][1].url + '"/>');
        $(this.el).append(this.img);
    };

    listItemObject = {
        refresh: defaultTransformation,
        calculatePosition: calculatePositionVertical,
        init: createListItemEl
    };

})();
