timotuominen.gl.elements.glCanvas = c0mposer.create(timotuominen.gl.elements.glObject, {
    el: null,
    init: function () {
        this.gl = timotuominen.gl.glUtils.initGL(this.el[0]);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.render = _.bind(this.render, this);
    },
    onResize: function () {
        this.gl.viewportWidth = this.el.width();
        this.gl.viewportHeight = this.el.height();
        //this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    },
    run: function () {
        if (!Detector.webgl) { Detector.addGetWebGLMessage(); }
        this.render();
    },
    preRender: function () {
        //window.requestAnimationFrame(this.render);
    }
});