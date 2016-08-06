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

    load: function(){
        var resources = [
           
        ];
        this.queue = new Hilo.LoadQueue();
        this.queue.add(resources);
        this.queue.on('complete', this.onComplete.bind(this));
        this.queue.start();
    },

    onComplete: function(e){
        this.queue.off('complete');
        this.fire('complete');
    }
});

module.exports = Asset;
