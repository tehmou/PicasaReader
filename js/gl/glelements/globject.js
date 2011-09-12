var glObject = {
    gl: null,
    el: null,

    init: function () {
        this.gl = glUtils.initGL(this.el);
        this.renderLoop = _.bind(this.renderLoop, this);
    },
    run: function () {
        if (!Detector.webgl) { Detector.addGetWebGLMessage(); }
        this.renderLoop();
    },
    renderLoop: function () {
        this.preRender();
        this.render();
        this.postRender();
    },
    preRender: function () {
        window.requestAnimationFrame(this.renderLoop);
    },
    render: function () { },
    postRender: function () { }
};