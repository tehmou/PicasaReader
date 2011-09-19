timotuominen.views.glListObject = c0mposer.create(
    timotuominen.gl.elements.glCanvas,
    {
        render: function () {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.clearDepth(1.0);
        },
        itemCreated: function (item) {
            item.gl = this.gl;
            /*$(item.el).click(function () {
                item.model.trigger("itemClick", item.model);
            });
            $(this.el).append(item.el);*/
        }
    },
    timotuominen.views.listBaseObject
);
