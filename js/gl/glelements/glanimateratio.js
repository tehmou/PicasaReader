var glAnimateRatio = {
    time: 0.0,
    preRender: function () {
        this.time += 0.01;
        this.ratio = 0.5+Math.sin(this.time)/2;
    }
};