timotuominen.gl.elements.glPlaneRenderer = {
    mQuadVBO: null,

    init: function () {
        var vertices = new Float32Array([ -1.,-1., 1.,-1., -1.,1., 1.,-1., 1.,1., -1.,1.]);
        this.mQuadVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mQuadVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.DYNAMIC_DRAW);
    },
    preRender: function () {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mQuadVBO);
    },
    actualRender: function () {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }
};