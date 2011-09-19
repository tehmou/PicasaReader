timotuominen.gl.elements.glCanvas = c0mposer.create(timotuominen.gl.elements.glObject, {
    el: null,
    init: function () {
        this.gl = timotuominen.gl.glUtils.initGL(this.el[0]);
        this.render = _.bind(this.render, this);
    },
    run: function () {
        if (!Detector.webgl) { Detector.addGetWebGLMessage(); }
        this.renderLoop();
    },
    preRender: function () {
        window.requestAnimationFrame(this.render);
    }
});