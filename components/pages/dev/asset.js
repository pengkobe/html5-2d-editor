/**
 * 静态文件管理
 */
var Asset = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    queue: null,
    bg: null,
    ground: null,
    ready: null,
    over: null,

    load: function () {
        var bg = __uri('img/bg.png');
        var ground = __uri('img/ground.png');
        var ready = __uri('img/ready.png');
        var resources = [
            { id: 'bg', src: bg },
            { id: 'ground', src: ground },
            { id: 'ready', src: ready },
        ];
        this.queue = new Hilo.LoadQueue();
        this.queue.add(resources);
        this.queue.on('complete', this.onComplete.bind(this));
        this.queue.start();
    },

    onComplete: function (e) {
        this.bg = this.queue.get('bg').content;
        this.ground = this.queue.get('ground').content;
        this.ready = this.queue.get('ready').content;
        this.queue.off('complete');
        this.fire('complete');
    }
});

module.exports = Asset;