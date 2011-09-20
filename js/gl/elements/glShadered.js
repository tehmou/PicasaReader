timotuominen.gl.elements.glShadered = {
    fragmentShaderCode: "#ifdef GL_ES\nprecision highp float;\n#endif\n\nvoid main(void) {\n\tgl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}",
    vertexShaderCode: "attribute vec3 position;\nuniform mat4 matrix;\nvoid main(void) {\n\tgl_Position = matrix*vec4(position.x, position.y, 0.0, 1.0);\n}",
    shader: null,
    init: function () {
        console.log("----\n\n" + this.fragmentShaderCode + "\n\n----");
        console.log("----\n\n" + this.vertexShaderCode + "\n\n----");
        if (this.fragmentShaderCode && this.vertexShaderCode && !this.shader) {
            this.shader = timotuominen.gl.glShaderUtils.createShader(this.gl, this.fragmentShaderCode, this.vertexShaderCode);
        }
        this.gl.useProgram(this.shader);
        this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.shader, "position"));

        var m = mat4.create();
        mat4.identity(m);
        this.setShaderMatrix(m);
    },
    setShaderMatrix: function (matrix) {
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.shader, "matrix"), false, matrix);
    },
    preRender: function () {
        this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.shader, "position"), 2, this.gl.FLOAT, false, 0, 0);
    }
};