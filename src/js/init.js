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

        init: function () {
            this.asset = new Editor_2d.Asset();
            this.asset.on('complete', function (e) {
                this.asset.off('complete');
                this.initStage();
            }.bind(this));
            this.asset.load();
        },

        initStage: function () {
            this.width = 1420;
            this.height = 1280;
            this.scale = 0.5;

            //舞台
            this.stage = new Hilo.Stage({
                renderType: 'canvas',
                width: this.width,
                height: this.height,
                scaleX: this.scale,
                scaleY: this.scale
            });
            document.getElementById("box").appendChild(this.stage.canvas);

            //启动计时器
            this.ticker = new Hilo.Ticker(60);
            this.ticker.addTick(Hilo.Tween);
            this.ticker.addTick(this.stage);
            this.ticker.start();

            //绑定交互事件
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
            this.stage.enableDOMEvent(Hilo.event.POINTER_MOVE, true);
            this.stage.enableDOMEvent(Hilo.event.POINTER_END, true);

            this.stage.on(Hilo.event.POINTER_START,
                this.onUserInput.bind(this));


            //舞台更新
            this.stage.onUpdate = this.onUpdate.bind(this);

            //初始化
            this.initBackground();
            this.initScenes();

            //准备游戏
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
            this.ground.y = this.height - this.ground.height;

            //移动地面
            //Hilo.Tween.to(this.ground, { x: -60 }, { duration: 300, loop: true });
            Hilo.copy(this.ground, Hilo.drag);
            //[0, 0, width, height]
            this.ground.startDrag();
            this.ground.on(Hilo.event.POINTER_START,
                function (params) {
                }.bind(this));
            this.ground.on(Hilo.event.POINTER_END,
                function (params) {
                    // this.ground.stopDrag();
                }.bind(this));
            this.ground.on(Hilo.event.POINTER_MOVE,
                function (e) {
                    debugger;
                    //  console.log(e.x+":"+e.y);
                    //  并不需要手动设置位置
                    //  this.ground.x = e.x;
                    //  this.ground.y = e.y;
                }.bind(this));
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
                //设置当前状态为结束over
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