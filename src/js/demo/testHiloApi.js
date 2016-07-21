(function () {

    window.onload = function () {
        Editor_2d.init();
    }

    var Editor_2d = window.Editor_2d = {
        width: 0,
        height: 0,

        asset: null,
        stage: null,
        ticker: null,

        ground: null,
        bg: null,
        gameReadyScene: null,

        // 鼠标canvas内部移动监视
        // moveX: 0,
        // moveY: 0,
        init: function () {
            this.asset = new Editor_2d.Asset();
            this.asset.on('complete', function (e) {
                this.asset.off('complete');
                this.initStage();
            }.bind(this));
            this.asset.load();
        },

        initStage: function () {
            this.width = 710;
            this.height = 640;
            this.scale = 1;
            //舞台
            this.stage = new Hilo.Stage({
                renderType: 'canvas',
                width: this.width,
                height: this.height,
                scaleX: this.scale,
                scaleY: this.scale
            });
            var box = document.getElementById("box");
            box.appendChild(this.stage.canvas);
            //绑定交互事件
            
            this.stage.enableDOMEvent([Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END]);
            // canvas外部drag经过不会触发该事件,但是内部貌似会触发
            this.stage.on(Hilo.event.POINTER_MOVE,
                function (e) {
                    // this.moveX = e.layerX;
                    // this.moveY = e.layerY;
                }.bind(this));
            this.stage.on(Hilo.event.POINTER_START,
                this.onUserInput.bind(this));

            // ======= 控件拖放(BEGIN) =======
            //关闭默认处理；  
            box.ondragenter = function (e) {
                e.preventDefault();
            }
            box.ondragover = function (e) {
                e.preventDefault();
            }
            var that = this;
            box.ondrop = function (e) {
                // var x = that.moveX;
                // var y = that.moveY;
                // 正解，得到的坐标刚好是canvas内部坐标
                var x = e.layerX;
                var y = e.layerY;
                var ctrInfo = e.dataTransfer.getData("text");
                // 添加控件
                var Ctrl = new Hilo.Bitmap({
                    id: 'ground',
                    image: that.asset.ground
                }).addTo(that.stage);
                Hilo.copy(Ctrl, Hilo.drag);
                Ctrl.startDrag();
                // 设置控件位置
                Ctrl.x = x;
                Ctrl.y = y;
                e.preventDefault();
            }
            // ======= 控件拖放(END)  =======

            //启动计时器
            this.ticker = new Hilo.Ticker(60);
            this.ticker.addTick(Hilo.Tween);
            this.ticker.addTick(this.stage);
            this.ticker.start();

            //舞台更新
            this.stage.onUpdate = this.onUpdate.bind(this);

            //初始化
            this.initBackground();
            this.initScenes();

            // 开始
            this.gameReady();
        },

        initBackground: function () {
            //背景
            var bgWidth = this.width * this.scale;
            var bgHeight = this.height * this.scale;
            document.getElementById("box").insertBefore(Hilo.createElement('div', {
                id: 'bg',
                style: {
                    background: 'url(src/img/bg.png) no-repeat',
                    backgroundSize: bgWidth + 'px, ' + bgHeight + 'px',
                    position: 'absolute',
                    width: bgWidth + 'px',
                    height: bgHeight + 'px'
                }
            }), this.stage.canvas);
            //地面
            this.ground = new Hilo.Bitmap({
                id: 'ground',
                image: this.asset.ground
            }).addTo(this.stage);
            //设置地面的y轴坐标
            this.ground.y = 0;//this.height - this.ground.height;

            //移动地面
            //Hilo.Tween.to(this.ground, { x: -60 }, { duration: 300, loop: true });
            // 开启drag
            Hilo.copy(this.ground, Hilo.drag);
            //[0, 0, width, height]
            this.ground.startDrag();
            this.ground.on(Hilo.event.POINTER_START,
                function (params) {
                }.bind(this));
            this.ground.on(Hilo.event.POINTER_END,
                function (params) {
                }.bind(this));
            this.ground.on(Hilo.event.POINTER_MOVE,
                function (e) {
                    //  并不需要手动设置位置
                }.bind(this));
            // 事实上也可以这么用
            //  this.ground.on("dragStart", function(e){
            //     //  console.log("dragStart", e.detail.x, e.detail.y);
            // });
            //  this.ground.on("dragEnd", function(e){
            //     //  console.log("dragEnd", e.detail.x, e.detail.y);
            // });
            //  this.ground.on("dragMove", function(e){
            //     // console.log("dragMove", e.detail.x, e.detail.y);
            // });
        },

         

        initScenes: function () {
            //准备场景
            this.gameReadyScene = new Editor_2d.ReadyScene({
                width: this.width,
                height: this.height,
                image: this.asset.ready
            }).addTo(this.stage);
        },

        // 画控件至面板
        onUserInput: function (e) {
            if (this.state !== 'over') {
                //启动游戏场景
                if (this.state !== 'playing')
                    this.gameStart();
            }
        },

        onUpdate: function (delta) {
            if (this.state === 'ready') {
                return;
            }
        },

        gameReady: function () {
            this.state = 'ready';
            this.score = 0;
            this.gameReadyScene.visible = true;
        },
        gameStart: function () {
            this.state = 'playing';
            this.gameReadyScene.visible = false;
        },
        gameOver: function () {
            if (this.state !== 'over') {
                this.state = 'over';
            }
        },

        // 提交监控画面
        savePagedata: function () {
            var score = this.score, best = 0;
            if (Hilo.browser.supportStorage) {
                best = parseInt(localStorage.getItem('hilo-flappy-best-score')) || 0;
            }
            if (score > best) {
                best = score;
                localStorage.setItem('hilo-flappy-best-score', score);
            }
            return best;
        }
    };

})();