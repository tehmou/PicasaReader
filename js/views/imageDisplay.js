timotuominen.views.imageDisplay = {
    model: null,
    lastModel: null,
    bindToModel: function (model) {
        this.lastModel = this.model;
        this.model = model;
        this.render();
    },
    init: function () {
        return this;
    },
    render: function () {
        if (this.model) {
            this.el.attr("src", this.model.get("imageUrl"));
        }
    }
};