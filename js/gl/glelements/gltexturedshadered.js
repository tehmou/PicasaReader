var glTexturedShadered = {
    fragmentShaderCode: null,
    vertexShaderCode: null,
    shader: null,
    imageURL: null,
    texture: null,
    ratio: 0.0,

    init: function () {
        this.gl.enable(this.gl.TEXTURE_2D);
        if (this.imageURL && !this.texture) {
            this.texture = glTextureUtils.loadImageTexture(this.gl, this.imageURL);
        }
        if (this.fragmentShaderCode && this.vertexShaderCode && !this.shader) {
            this.shader = glShaderUtils.createShader(this.gl, this.fragmentShaderCode, this.vertexShaderCode);
        }
        this.gl.useProgram(this.shader);
        this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.shader, "position"));
    },
    preRender: function () {

        var gl = this.gl;
        gl.uniform2f(gl.getUniformLocation(this.shader, "resolution"), gl.viewportWidth, gl.viewportHeight);
        gl.uniform1f(gl.getUniformLocation(this.shader, "ratio"), this.ratio);

        gl.vertexAttribPointer(this.gl.getAttribLocation(this.shader, "position"), 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(this.shader, "tex0"), 0);
    }
};