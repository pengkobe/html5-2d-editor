'use strict';

var each = require('each');
var Asset = require('./asset.js');
var Scene = require('./scene.js');
var controls = require('controls');

/**
 * 渲染menu模块
 * @param {HTMLElement} dom
 */
exports.render = function (dom) {
    // 使用__inline函数嵌入其他文件、图片。这里用作内嵌模板，
    // scrat已经配置了对handlebars后置的文件进行预编译，因此
    // 可以直接内嵌这里文件当做js函数执行
    var tpl = __inline('dev.handlebars');
    // 模板数据
    var data = {
        // 使用__uri函数来定位任意工程文件，scrat构建之后，会
        // 将其替换为发布地址，这样工程就不用关心部署相关问题了
        logo: __uri('logo.png'),
        home: '/#!/index',
    };
    // 使用模板+数据得到html
    dom.innerHTML = tpl(data);
    setTimeout(function () {
        init();
    }, 20);

};


var Editor_2d = window.Editor_2d = {
    width: 0,
    height: 0,

    asset: null,
    stage: null,
    ticker: null,
    readyScene: null,
    /**
    * 初始化静态资源
    */
    init: function () {
        this.asset = new Asset();
        this.asset.on('complete', function (e) {
            this.asset.off('complete');
            this.initStage();
        }.bind(this));
        this.asset.load();
    },
    /**
    * 初始化舞台
    */
    initStage: function () {
        var that = this;

        var container = document.getElementById("box");
        this.width = window.innerWidth - 300;
        this.height = 720;
        this.scale = 1;

        //舞台
        this.stage = new Hilo.Stage({
            renderType: 'canvas',
            width: this.width,
            height: this.height,
            scaleX: this.scale,
            scaleY: this.scale
        });
        container.appendChild(this.stage.canvas);
        // 事件绑定(拖拽等)
        this.binEvents();

        //启动计时器
        this.ticker = new Hilo.Ticker(60);
        this.ticker.addTick(Hilo.Tween);
        this.ticker.addTick(this.stage);
        this.ticker.start();

        //舞台更新事件
        this.stage.onUpdate = this.onUpdate.bind(this);
        this.initScenes();
        this.ready();
    },
    /**
    * 事件绑定
    */
    binEvents: function () {
        var that = this;
        //开启事件交互
        this.stage.enableDOMEvent([Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END]);
        this.stage.on(Hilo.event.POINTER_START,
            this.onUserInput.bind(this));

        // 舞台自适应宽高
        window.addEventListener("resize", resizeStage, false);
        function resizeStage() {
            that.stage.resize(window.innerWidth - 300, 720, true);
        }

        // ======= 控件拖放(BEGIN) =======
        box.ondragenter = function (e) {
            e.preventDefault();
        }
        box.ondragover = function (e) {
            e.preventDefault();
        }
        // 添加控件
        box.ondrop = function (e) {
            e.preventDefault();
            var x = e.layerX;
            var y = e.layerY;
            var ctrInfo = e.dataTransfer.getData("text");
            var ctrl = null;
            var position = { x: x, y: y }
            switch (ctrInfo) {
                case "value":
                    ctrl = controls.getValue(position);
                    break;
                case "unit":
                    ctrl = controls.getUnit(position);
                    break;
                case "label":
                    ctrl = controls.getLabel(position);
                    break;
                case "switch":
                    ctrl = controls.getSwitch(position);
                    break;

                default: return;
            }
            that.readyScene.addCtrl(ctrl, ctrInfo);
        }
        // ======= 控件拖放(END)  =======
    },
    /**
    * 加载底图[背景法](废弃)
    */
    initBackground: function () {
    },
    /**
    * 加载底图
    */
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
                        that.readyScene.addBaseMap(bmp);
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
    /**
    * 初始化场景
    */
    initScenes: function () {
        this.readyScene = new Scene({
            width: this.width,
            height: this.height,
            image: this.asset.ready
        }).addTo(this.stage);
    },
    /**
    * 用户交互
    */
    onUserInput: function (e) {
        if (this.state !== 'over') {
        }
    },
    /**
    *  场景刷新
    */
    onUpdate: function (delta) {
        if (this.state === 'ready') {
            return;
        }
    },
    /**
    * 场景准备完毕
    */
    ready: function () {
        this.state = 'ready';
        // 加载底图事件
        this.addBaseMap();
        this.readyScene.visible = true;
    },
};

function init() {
    var src = document.getElementById("components");
    src.ondragstart = function (e) {
        var tag = e.target.getAttribute("data-tag");
        e.dataTransfer.setData("text", tag);
    };
    src.ondrag = function (e) { }
    // 判断语言
    var isCN = document.body.getAttribute("lang") == "cn";
    // 判断浏览器
    if (navigator.appVersion.indexOf("MSIE") > -1) {
        HTMLElement.prototype.remove = HTMLElement.prototype.remove || function () {
            this.parentNode && this.parentNode.removeChild(this);
        };
    };

    Editor_2d.init();
}