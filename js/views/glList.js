(function () {
    var simpleFragmentShaderCode = "" +
            "#ifdef GL_ES\n" +
            "precision highp float;\n" +
            "#endif\n\n" +
            "void main(void) {\n" +
            "     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n" +
            "}",
        complexFragmentShaderCode = "" +
            "#ifdef GL_ES\n" +
            "precision highp float;\n" +
            "#endif\n\n" +

            "uniform vec2 resolution;\n" +
            "uniform sampler2D tex0;\n" +
            "uniform float ratio;\n" +
            "varying vec2 picturePosition;\n\n" +

            "void main(void) {\n" +
            "    vec2 p = picturePosition.xy;\n" +
            "    vec4 o = texture2D(tex0,vec2(p.s*.5+.5,.5-p.t*.5));\n\n" +

            "    float b = clamp(ratio*1.2, 0.0, 1.0);\n" +
            "    float g = clamp((ratio-0.2)*2.0, 0.0, 1.0);\n" +
            "    float r = clamp((ratio-0.4)*1.4, 0.0, 1.0);\n" +
            "    float a = clamp(0.2+ratio*2.0, 0.0, 1.0);\n\n" +

            "    gl_FragColor = vec4(1.0-r*(1.0-o.x), 1.0-g*(1.0-o.y), 1.0-b*(1.0-o.z), r);\n" +
            "}",
        simpleVertexShaderCode = "" +
            "attribute vec3 position;\n" +
            "uniform mat4 uMVMatrix;\n" +
            "uniform mat4 uPMatrix;\n" +
            "varying vec2 picturePosition;\n\n" +
            "void main(void) {\n" +
            "    picturePosition = position.st;" +
            "    gl_Position = uPMatrix*uMVMatrix*vec4(position.x, position.y, 0.0, 1.0);\n" +
            "}";
timotuominen.views.glListObject = c0mposer.create(
     {
        fragmentShaderCode: complexFragmentShaderCode,
        vertexShaderCode: simpleVertexShaderCode,

        shader: null,
        init: function () {
            this.gl = this.el[0].getContext("experimental-webgl");
            this.gl.enable(this.gl.TEXTURE_2D);
            this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
            this.createShader();
            this.createPlane();
            this.renderLoop = _.bind(this.renderLoop, this);
            this.renderLoop();
        },
        onResize: function () {
            this.el[0].width = this.el.width();
            this.el[0].height = this.el.height();
            this.viewportWidth = this.el[0].width;
            this.viewportHeight = this.el[0].height;
        },
        createShader: function () {
            this.shader = timotuominen.gl.glShaderUtils.createShader(this.gl, this.fragmentShaderCode, this.vertexShaderCode);
            this.gl.useProgram(this.shader);
            this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.shader, "position"));
            this.resetShaderMatrices();
        },
        resetShaderMatrices: function () {
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
            //var vertices = new Float32Array([ -.5,-.5, .5,-.5, -.5,.5, .5,-.5, .5,.5, -.5,.5]);
            var vertices = new Float32Array([ -1.0,-1.0, 1.0,-1.0, -1.0,1.0, 1.0,-1.0, 1.0,1.0, -1.0,1.0]);
            this.mQuadVBO = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mQuadVBO);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        },
        renderLoop: function () {
            requestAnimationFrame(this.renderLoop);
            this.preRender();
            this.actualRender();
        },
        preRender: function () {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mQuadVBO);
            this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.shader, "position"), 2, this.gl.FLOAT, false, 0, 0);
        },
        actualRender: function () {
            var w = this.viewportWidth;
            var h = this.viewportHeight;
            var m = mat4.create();

            this.gl.viewport(0, 0, w, h);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            if (this.items) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item.texture === undefined && item.model.attributes.hasOwnProperty("thumbnailUrl")) {
                        item.texture = timotuominen.gl.glTextureUtils.loadImageTexture(this.gl, item.model.get("thumbnailUrl"));
                    }
                    if (item.elOpacity === 0) {
                        continue;
                    }
                    var sx = item.elWidth/w,
                        sy = item.elHeight/h;

                    mat4.identity(m);
                    mat4.scale(m, [sx, sy, 1.0]);
                    this.setShaderMVMatrix(m);

                    mat4.identity(m);
                    mat4.translate(m, [2.0*item.elLeft/w, 1.0-2.0*(item.elTop + item.elHeight/2)/h, 0]);
                    this.setShaderPMatrix(m);

                    this.gl.uniform2f(this.gl.getUniformLocation(this.shader, "resolution"), item.elWidth, item.elHeight);
                    this.gl.uniform1f(this.gl.getUniformLocation(this.shader, "ratio"), .5);
                    this.gl.activeTexture(this.gl.TEXTURE0);
                    this.gl.bindTexture(this.gl.TEXTURE_2D, item.texture);
                    this.gl.uniform1i(this.gl.getUniformLocation(this.shader, "tex0"), 0);

                    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
                }
            }
        }
    },
    timotuominen.views.listBaseObject
);

})();