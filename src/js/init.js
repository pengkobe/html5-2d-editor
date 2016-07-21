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
        readyScene: null,

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
            var that = this;
            var box = document.getElementById("box");
            this.width = window.innerWidth - 300;
            this.height = 720;
            this.scale = 1;
            // 舞台自适应宽高
            window.addEventListener("resize", resizeStage, false);
            function resizeStage() {
                that.stage.resize(window.innerWidth - 300, 720, true);
            }
            //舞台
            this.stage = new Hilo.Stage({
                renderType: 'canvas',
                width: this.width,
                height: this.height,
                scaleX: this.scale,
                scaleY: this.scale
            });

            box.appendChild(this.stage.canvas);

            //开启事件交互
            this.stage.enableDOMEvent([Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END]);
            this.stage.on(Hilo.event.POINTER_START,
                this.onUserInput.bind(this));

            // ======= 控件拖放(BEGIN) =======
            box.ondragenter = function (e) {
                e.preventDefault();
            }
            box.ondragover = function (e) {
                e.preventDefault();
            }
            var that = this;
            // 添加控件
            box.ondrop = function (e) {
                var x = e.layerX;
                var y = e.layerY;
                var ctrInfo = e.dataTransfer.getData("text");
                var ctrl = null;
                var position = { x: x, y: y }
                switch (ctrInfo) {
                    case "valueComp": ctrl = Editor_2d.ctlFactory.getValue(position); break;
                    case "unitComp": ctrl = Editor_2d.ctlFactory.getUnit(position); break;
                    case "labelComp": ctrl = Editor_2d.ctlFactory.getLabel(position); break;
                    default: break;
                }
                if (ctrl == null) {
                    return;
                } else {
                    that.readyScene.addCtrl(ctrl);
                    //ctrl.addTo(that.stage);
                    Hilo.copy(ctrl, Hilo.drag);
                    ctrl.startDrag();
                }
                // var Ctrl = new Hilo.Bitmap({
                //     id: 'ground',
                //     image: that.asset.ground
                // }).addTo(that.stage);
                // Hilo.copy(Ctrl, Hilo.drag);
                // Ctrl.startDrag();
                // Ctrl.x = x;
                // Ctrl.y = y;
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
            this.ready();
        },

        initBackground: function () {
            // var bgWidth = that.width * that.scale;
            // var bgHeight = that.height * that.scale;
            // document.getElementById("box").insertBefore(Hilo.createElement('div', {
            //     id: 'bg',
            //     style: {
            //         background: 'url(' + urlData + ') no-repeat',
            //         backgroundSize: bgWidth + 'px, ' + bgHeight + 'px',
            //         position: 'absolute',
            //         width: bgWidth + 'px',
            //         height: bgHeight + 'px'
            //     }
            // }), that.stage.canvas);
        },
        // 选择底图
        addBaseMap: function () {
            var that = this;
            var openfile = document.querySelector("#openFileButton"),
                file = document.querySelector("#file")
            file.onchange = function (e) {
                var resultFile = e.target.files[0];
                if (!/image/.test(resultFile.type)) {
                    m("抱歉，暂时不支持非图片格式，后续会加强的！");
                    return;
                }
                if (openfile) {
                    openfile.setAttribute("loading", "yes");
                    openfile.innerHTML = "Loading...";
                }
                if (resultFile) {
                    var reader = new FileReader();
                    reader.readAsDataURL(resultFile);
                    reader.onload = function (e) {
                        var urlData = this.result;
                        var img = new Image();
                        img.src = urlData;
                        // TODO:保存图片至服务端
                        img.onload = function () {
                            //BitMap无法动态修改宽高
                            var bmp = new Hilo.Bitmap({
                                image: urlData,
                                rect: [0, 0, that.width, that.height],
                                x: 0,
                                y: 0,
                                scaleY: 0.9
                            });
                            that.readyScene.addCtrl(bmp,"baseMap");
                            file.blur();
                            openfile && openfile.remove();
                        }
                    };
                }
            };
            // 打开文件
            openfile.onclick = function () {
                if (openfile.getAttribute("loading") == "yes") return;
                file.click();
            };
        },
        //准备场景
        initScenes: function () {
            this.readyScene = new Editor_2d.ReadyScene({
                width: this.width,
                height: this.height,
                image: this.asset.ready
            }).addTo(this.stage);
      //      this.readyScene.enableDOMEvent([Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END]);
        },

        // 画控件至面板
        onUserInput: function (e) {
            if (this.state !== 'over') {
            }
        },

        onUpdate: function (delta) {
            if (this.state === 'ready') {
                return;
            }
        },

        ready: function () {
            this.state = 'ready';
            this.addBaseMap();
            this.readyScene.visible = true;
        },
        start: function () {
            this.state = 'beginning';
            //  this.readyScene.visible = false;
        },
        // 提交监控画面
        savePagedata: function () {
            if (Hilo.browser.supportStorage) {
                var best = parseInt(localStorage.getItem('hisData')) || 0;
            }
            return true;
        }
    };
})();