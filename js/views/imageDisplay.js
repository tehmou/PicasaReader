timotuominen.views.imageDisplay = {
    model: null,
    lastModel: null,
    changeSpeed: 0.05,

    changeRatio: 1.0,
    loading: false,

    bindToModel: function (model) {
        this.model = model;
        this.render();
    },
    init: function () {
        return this;
    },
    render: function () {
        if (!this.loading) {

            if (this.model != this.lastModel && this.changeRatio === 1.0) {
                this.loading = true;
                var image = new Image();
                image.onload = _.bind(function() {
                    this.el.html("");
                    this.el.append(image);
                    this.loading = false;
                    this.changeRatio = 0.0;
                    this.render();
                }, this);
                image.src = this.model.get("imageUrl");
            }

            if (this.changeRatio < 1.0) {
                this.changeRatio += this.changeSpeed;
                if (this.changeRatio >= 1.0) {
                    this.changeRatio = 1.0;
                } else {
                    requestAnimationFrame(_.bind(this.render, this));
                }
            }
            
            this.el.css("opacity", this.changeRatio);
        }
        if (this.loading) {
            this.el.css("opacity", 0.4);
        }
    }
};