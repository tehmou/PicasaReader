var listItemObject;

(function () {

    var defaultTransformation = function () {
        //var transform = "scale(" + (0.8 + 0.2*this.ratio) + ")";
        var transform = "scale(1.0," + this.ratio + ")";
        this.el.css("-moz-transform", transform);
        this.el.css("-webkit-transform", transform);
        this.el.css("transform", transform);
    };

    var calculatePositionVertical = function () {
        var top = $(this.el).offset().top;
        this.pos = top + $(this.el).height()/2;
    };

    var createListItemEl = function () {
        this.el = $('<img alt="" src="' + this.dataEntry["media$group"]["media$thumbnail"][1].url + '"/>');
    };

    listItemObject = {
        refresh: defaultTransformation,
        calculatePosition: calculatePositionVertical,
        init: createListItemEl
    };

})();
