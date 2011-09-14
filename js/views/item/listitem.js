var listItemObject;

(function () {

    var transformations = {
        scaleY: function () {
            /*var sign = this.ratio === 0 ? 0 : (this.ratio/Math.abs(this.ratio));
            var absR = 1.0 - Math.abs(this.ratio);
            var r1 = 0.4 + 0.6*absR;
            var r2 = 0.2 + 0.8*absR;

            this.elWidth = this.originalWidth;
            this.elHeight = Math.floor(this.originalHeight * absR);
            this.elOpacity = r1;*/
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
