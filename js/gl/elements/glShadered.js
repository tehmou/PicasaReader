timotuominen.gl.elements.glShadered = {
    fragmentShaderCode: "#ifdef GL_ES\nprecision highp float;\n#endif\n\nvoid main(void) {\ngl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}",
    vertexShaderCode: "attribute vec4 position;\nvoid main(void) {\ngl_Position = position;\n}",
    shader: null,
    init: function () {
        if (this.fragmentShaderCode && this.vertexShaderCode && !this.shader) {
            this.shader = timotuominen.gl.glShaderUtils.createShader(this.gl, this.fragmentShaderCode, this.vertexShaderCode);
        }
        this.gl.useProgram(this.shader);
        this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.shader, "position"));
    },
    preRender: function () {
        this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.shader, "position"), 2, this.gl.FLOAT, false, 0, 0);
    }
};