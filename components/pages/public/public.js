'use strict';

var each = require('each');
var asset = require('./asset.js');

// 在require函数中可以使用相对路径引用文件
// 注意：不可以省略后缀名
/**
 * 渲染menu模块
 * @param {HTMLElement} dom
 */
exports.render = function (dom) {
    // 使用__inline函数嵌入其他文件、图片。这里用作内嵌模板，
    // scrat已经配置了对handlebars后置的文件进行预编译，因此
    // 可以直接内嵌这里文件当做js函数执行
    var tpl = __inline('public.handlebars');
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
        customerScene: null,
        valueRefreshArr: [],  // 值控件
        /**
        * 初始化静态资源
        */
        init: function () {
            this.asset = asset;
            debugger;
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
            var box = document.getElementById("box");
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
            box.appendChild(this.stage.canvas);
            // 事件绑定
            this.binEvents();
            // 加载场景
            this.initScenes();
            // 从服务端拉取数据
            this.ajaxLoadData();

            //启动计时器
            this.ticker = new Hilo.Ticker(60);
            this.ticker.addTick(Hilo.Tween);
            this.ticker.addTick(this.stage);
            this.ticker.start();
            //舞台更新
            this.stage.onUpdate = this.onUpdate.bind(this);
            // 开始
            this.ready();
            // 刷新数据
            this.dataRefresh();
        },
        /**
        * 事件绑定
        */
        binEvents: function () {
            var that = this;
            //开启事件交互
            this.stage.enableDOMEvent([Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END]);
            // 舞台自适应宽高
            window.addEventListener("resize", resizeStage, false);
            function resizeStage() {
                that.stage.resize(window.innerWidth - 300, 720, true);
            }
        },
        /**
        * 加载数据
        */
        ajaxLoadData: function () {
            // 从服务端拉取数据
            var dataJson = window.localStorage.getItem("monitorPageData");
            if (!dataJson) {
               // dataJson = '{"valueCtrls":[{"name":"dddd","x":126,"y":91,"height":73,"width":120}],"unitCtrls":[{"name":"dx","x":255,"y":128,"height":35,"width":100}],"labelCtrls":[{"name":"lx","x":125,"y":168,"height":35,"width":100}]}'
                dataJson='{"valueCtrls":[{"x":142,"y":33,"height":51,"width":114},{"x":909,"y":336,"height":40,"width":100}],"unitCtrls":[{"x":135,"y":159,"height":35,"width":100}],"labelCtrls":[{"x":155,"y":264,"height":35,"width":100}],"switchCtrls":[{"x":369,"y":34,"height":51,"width":115},{"x":979,"y":45,"height":40,"width":100}]}';    
        }
            var dataObj = JSON.parse(dataJson);
            // 值控件
            var valueCtrls = dataObj.valueCtrls;
            for (var i in valueCtrls) {
                ctrl = Editor_2d.ctlFactory.getValue(valueCtrls[i]);
                var ctrlId = ctrl.id;
                var bindName = valueCtrls[i].name;
                this.valueRefreshArr.push({ ctrlId: ctrlId, bindName: bindName });
                this.customerScene.addCtrl(ctrl, "valueComp");
            }

            // 单位控件
            var unitCtrls = dataObj.unitCtrls;
            for (var i in unitCtrls) {
                ctrl = Editor_2d.ctlFactory.getUnit(unitCtrls[i]);
                this.customerScene.addCtrl(ctrl, "unitComp");
            }

            // 标签控件
            var labelCtrls = dataObj.labelCtrls;
            for (var i in labelCtrls) {
                ctrl = Editor_2d.ctlFactory.getLabel(labelCtrls[i]);
                this.customerScene.addCtrl(ctrl, "labelComp");
            }

             // 开关控件
            var switchCtrls = dataObj.switchCtrls;
            for (var i in switchCtrls) {
                ctrl = Editor_2d.ctlFactory.getSwitch(switchCtrls[i]);
                this.customerScene.addCtrl(ctrl, "switchComp");
            }
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
                            that.customerScene.addBaseMap(bmp);
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
        *  初始化场景
        */
        initScenes: function () {
            this.customerScene = new Editor_2d.CustomerScene({
                width: this.width,
                height: this.height,
                image: this.asset.ready
            }).addTo(this.stage);
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
        *  场景切换
        */
        ready: function () {
            this.state = 'ready';
            this.addBaseMap();
            this.customerScene.visible = true;
        },
        /**
        * 数据刷新
        */
        dataRefresh: function () {
            var that = this;
            this.state = 'beginning';
            // 刷新值数据
            var data = {
                value1: 123,
                value2: "停止",
                value3: "正常区",
            }
            var cha = 1;
            setInterval(function (params) {
                for (var i = 0; i < that.valueRefreshArr.length; i++) {
                    var temp = that.valueRefreshArr[i];
                    var value = data[temp.bindName];
                    if (value) {
                        $("#" + temp.ctrlId).html(value + cha);
                    }
                    cha++;
                }
            }, 5000);
        }
    };

function init() {
    Editor_2d.init();
}