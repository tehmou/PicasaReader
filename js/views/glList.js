(function () {

timotuominen.views.glListObject = c0mposer.create({
        fragmentShaderName: "fs-thumb",
        vertexShaderName: "vs-default",

        shader: null,
        init: function () {
            _.bindAll(this);

            $(window).scroll(this.onScroll);
            this.el.click(this.onClick);
            this.el.mousemove(this.onMouseMove);
            this.el.mouseleave(this.onMouseLeave);
            this.el.mouseout(this.onMouseLeave);

            this.gl = this.el[0].getContext("experimental-webgl");
            this.gl.enable(this.gl.TEXTURE_2D);
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

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
            this.halfW = this.viewportWidth/2.0;
            this.halfH = this.viewportHeight/2.0;
        },
        createShader: function () {
            $.ajax("js/gl/shaders/" + this.fragmentShaderName + ".txt", {
                dataType: "text",
                success: _.bind(function (fsCode) {
                    $.ajax("js/gl/shaders/" + this.vertexShaderName + ".txt", {
                        dataType: "text",
                        success: _.bind(function (vsCode) {
                            this.shader = timotuominen.gl.glShaderUtils.createShader(this.gl, fsCode, vsCode);
                            this.gl.useProgram(this.shader);
                            this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.shader, "position"));
                            this.resetShaderMatrices();
                        }, this)
                    })
                }, this)
            });
        },
        resetShaderMatrices: function () {
            this._m = mat4.create();
            mat4.identity(this._m);
            this.setShaderMVMatrix(this._m);
            this.setShaderPMatrix(this._m);
        },
        setShaderMVMatrix: function (matrix) {
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.shader, "uMVMatrix"), false, matrix);
        },
        setShaderPMatrix: function (matrix) {
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.shader, "uPMatrix"), false, matrix);
        },
        createPlane: function () {
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
            var m = this._m = this._m || mat4.create();

            this.gl.viewport(0, 0, w, h);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            if (this.shader) {
                this.gl.useProgram(this.shader);
                this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.shader, "position"));
            }

            if (this.items) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item.texture === undefined) {
                        if (item.model.attributes.hasOwnProperty("thumbnailUrl")) {
                            item.texture = timotuominen.gl.glTextureUtils.loadImageTexture(this.gl, item.model.get("thumbnailUrl"));
                        } else {
                            continue;
                        }
                    }
                    if (item.elOpacity === 0) {
                        continue;
                    }
                    item.activityRatio += item.mouseOver ? 0.34 : -0.08;
                    item.activityRatio = Math.min(1.0, Math.max(0.0, item.activityRatio));
                    var sx = item.elWidth/w,
                        sy = item.elHeight/h;

                    mat4.identity(m);
                    mat4.scale(m, [sx, sy, 1.0]);
                    this.setShaderMVMatrix(m);

                    mat4.identity(m);
                    mat4.translate(m, [2.0*item.elLeft/w, 1.0-2.0*(item.elTop + item.elHeight/2.0)/h, 0]);
                    this.setShaderPMatrix(m);

                    this.gl.uniform2f(this.gl.getUniformLocation(this.shader, "resolution"), item.elWidth, item.elHeight);
                    this.gl.uniform1f(this.gl.getUniformLocation(this.shader, "ratio"), item.activityRatio);
                    this.gl.uniform1f(this.gl.getUniformLocation(this.shader, "opacity"), item.elOpacity);
                    this.gl.activeTexture(this.gl.TEXTURE0);
                    this.gl.bindTexture(this.gl.TEXTURE_2D, item.texture);
                    this.gl.uniform1i(this.gl.getUniformLocation(this.shader, "tex0"), 0);

                    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
                }
            }
        },
        onScroll: function () {
            this.updateItemHover();
        },
        onMouseMove: function (event) {
            this.mouseX = event.layerX;
            this.mouseY = event.clientY;
            this.updateItemHover();
        },
        onMouseLeave: function () {
            this.mouseX = this.mouseY = undefined;
            this.updateItemHover();
        },
        onClick: function (event) {
            var item = this.getItemAt(event.layerX, event.clientY);
            if (item) {
                item.model.trigger("itemClick", item.model);
            }
        },
        resetItemHover: function () {
            _.each(this.items, function (item) {
                item.mouseOver = false;
            });
        },
        updateItemHover: function () {
            this.resetItemHover();
            var item = this.getItemAt(this.mouseX, this.mouseY);
            if (item) {
                item.mouseOver = true;
                this.el.css("cursor", "pointer");
            } else {
                this.el.css("cursor", "default");
            }
        },
        getItemAt: function (x, y) {
            if (x === undefined || y === undefined) {
                return null;
            }
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                var l = item.elLeft + this.halfW - item.elWidth / 2.0;
                if (item.elOpacity !== 0 && item.texture &&
                    x > l && x < l + item.elWidth &&
                    y > item.elTop && y < item.elTop + item.elHeight) {
                    return item;
                }
            }
        }
    },
    timotuominen.views.listBaseObject
);

})();