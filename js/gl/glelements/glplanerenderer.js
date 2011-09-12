var glImageRenderer = {
    mQuadVBO: null,

    init: function () {
        var vertices = new Float32Array([ -1.,-1., 1.,-1., -1.,1., 1.,-1., 1.,1., -1.,1.]);
        this.mQuadVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mQuadVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    },
    preRender: function () {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mQuadVBO);
    },
    render: function () {
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
};