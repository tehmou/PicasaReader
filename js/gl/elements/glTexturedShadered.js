timotuominen.gl.elements.glTexturedShadered = {
    imageURL: null,
    texture: null,
    ratio: 0.0,

    init: function () {
        this.gl.enable(this.gl.TEXTURE_2D);
        if (this.imageURL && !this.texture) {
            this.texture = glTextureUtils.loadImageTexture(this.gl, this.imageURL);
        }
    },
    preRender: function () {

        var gl = this.gl;
        gl.uniform2f(gl.getUniformLocation(this.shader, "resolution"), gl.viewportWidth, gl.viewportHeight);
        gl.uniform1f(gl.getUniformLocation(this.shader, "ratio"), this.ratio);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(this.shader, "tex0"), 0);
    }
};