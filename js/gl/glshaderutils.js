timotuominen.gl.glShaderUtils = {
    createShader: function (gl, fragmentShaderCode, vertexShaderCode)
    {
        var infoLog;

        var tmpProgram = gl.createProgram();

        var vs = gl.createShader(gl.VERTEX_SHADER);
        var fs = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vs, vertexShaderCode);
        gl.shaderSource(fs, fragmentShaderCode);

        gl.compileShader(vs);
        gl.compileShader(fs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            infoLog = gl.getShaderInfoLog(vs);
            gl.deleteProgram( tmpProgram );
            throw "VS ERROR: " + infoLog;
        }

        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            infoLog = gl.getShaderInfoLog(fs);
            gl.deleteProgram( tmpProgram );
            throw "FS ERROR: " + infoLog;
        }

        gl.attachShader(tmpProgram, vs);
        gl.attachShader(tmpProgram, fs);

        gl.deleteShader(vs);
        gl.deleteShader(fs);

        gl.linkProgram(tmpProgram);

        return tmpProgram;
    }
};