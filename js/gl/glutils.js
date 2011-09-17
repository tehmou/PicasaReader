timotuominen.gl.glUtils = {
    initGL: function (canvas) {
        var gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        drawingMode = gl.TRIANGLES;
        return gl;
    }
};