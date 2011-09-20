timotuominen.views.glListObject = c0mposer.create(
     timotuominen.gl.elements.glObject,
     {
        fragmentShaderCode: "#ifdef GL_ES\nprecision highp float;\n#endif\n\nvoid main(void) {\n\tgl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}",
        vertexShaderCode: "attribute vec3 position;\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nvoid main(void) {\n\tgl_Position = uPMatrix*uMVMatrix*vec4(position.x, position.y, 0.0, 1.0);\n}",
        shader: null,
        init: function () {
            this.gl = this.el[0].getContext("experimental-webgl");
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.clearDepth(1.0);
            this.viewportWidth = this.el[0].width;
            this.viewportHeight = this.el[0].height;
            this.createShader();
            this.createPlane();
            this.render();
        },
        createShader: function () {
            this.shader = timotuominen.gl.glShaderUtils.createShader(this.gl, this.fragmentShaderCode, this.vertexShaderCode);
            this.gl.useProgram(this.shader);
            this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.shader, "position"));

            var m = mat4.create();
            mat4.identity(m);
            this.setShaderMVMatrix(m);
            this.setShaderPMatrix(m);
        },
        setShaderMVMatrix: function (matrix) {
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.shader, "uMVMatrix"), false, matrix);
        },
        setShaderPMatrix: function (matrix) {
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.shader, "uPMatrix"), false, matrix);
        },
        createPlane: function () {
            var vertices = new Float32Array([ -1.,-1., 1.,-1., -1.,1., 1.,-1., 1.,1., -1.,1.]);
            this.mQuadVBO = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mQuadVBO);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        },
        preRender: function () {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mQuadVBO);
            this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.shader, "position"), 2, this.gl.FLOAT, false, 0, 0);
        },
        actualRender: function () {
            var w = this.viewportWidth;
            var h = this.viewportHeight;
            var m = mat4.create();
            mat4.identity(m);
            mat4.scale(m, [0.5, 0.5, 1.0]);
            mat4.translate(m, [0.5, 1.0, 0]);
            this.setShaderMVMatrix(m);

            this.gl.viewport(0, 0, w, h);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
        }
    },
    timotuominen.views.listBaseObject
);
