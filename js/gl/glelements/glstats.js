var glStats = {
    stats: null,
    init: function () {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.el.appendChild( this.stats.domElement );
    },
    postRender: function () {
        this.stats.update();
    }
};