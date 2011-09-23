timotuominen.gl.glShaderUtils = {
    createShader: function (gl, fragmentShaderCode, vertexShaderCode)
    {
        var tmpProgram = gl.createProgram(),
            vs, fs;

        try {
            vs = this.createVS(gl, vertexShaderCode);
            fs = this.createFS(gl, fragmentShaderCode);
        } catch (e) {
            gl.deleteProgram( tmpProgram );
            throw e;
        }

        gl.attachShader(tmpProgram, vs);
        gl.attachShader(tmpProgram, fs);

        gl.deleteShader(vs);
        gl.deleteShader(fs);

        gl.linkProgram(tmpProgram);

        return tmpProgram;
    },

    createVS: function (gl, code) {
        var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, code);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            throw "VS ERROR: " + gl.getShaderInfoLog(vs);
        }
        return vs;
    },

    createFS: function (gl, code) {
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, code);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            throw "FS ERROR: " + gl.getShaderInfoLog(fs);
        }
        return fs;
    }
};