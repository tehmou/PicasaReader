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

    listItemObject = {
        loaded: false,
        ratio: 1.0,
        originalWidth: 0, originalHeight: 0,
        elWidth: 0, elHeight: 0, margin: 0,
        elTop: 0, elLeft: 0,
        transformation: transformations.scaleY,
        render: function () {
            this.transformation();
        }
    };

})();
