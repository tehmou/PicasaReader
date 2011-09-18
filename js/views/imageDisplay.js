timotuominen.views.imageDisplay = {
    model: null,

    changeSpeed: 0.05,

    changeRatio: 1.0,
    loading: false,

    bindToModel: function (model) {
        if (this.loading) {
            return;
        }
        this.loading = true;
        this.model = model;

        var image = new Image();
        image.onload = _.bind(function() {
            this.el.prepend(image);
            this.loading = false;
            this.changeRatio = 0.0;
            this.render();
        }, this);
        image.src = this.model.get("imageUrl");

        this.render();
    },
    init: function () {
        return this;
    },
    render: function () {
        if (!this.loading) {
            this.el.css("opacity", 1.0);
            
            if (this.changeRatio < 1.0) {
                this.changeRatio += this.changeSpeed;
                if (this.changeRatio >= 1.0) {
                    this.changeRatio = 1.0;
                    if (this.el.children().length > 1) {
                        $(this.el.children()[1]).remove();
                    }
                } else {
                    requestAnimationFrame(_.bind(this.render, this));
                }
            }

            if (this.el.children().length > 1) {
                $(this.el.children()[1]).css("opacity", 0.8*(1.0 - this.changeRatio));
            }
        }
        if (this.loading) {
            this.el.css("opacity", 0.8);
        }
    }
};