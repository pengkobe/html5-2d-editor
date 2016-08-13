/**
 * 绘图
 * edit by pengyi at 2016-07-22
 */
var ReadyScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function (properties) {
        ReadyScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },
    ctrlList: [],
    baseMap: null,
    selectedCtrl: null,
    state: '', //move
    /**
     * 初始化
     * @properties  {Object} [配置]
     */
    init: function (properties) {
        this.bindEvent();
    },
    /**
     * 全局事件
     */
    bindEvent: function () {
        var that = this;
        // 删除元素
        $("#delCtrl").on('click', function () {
            if (that.selectedCtrl) {
                var ctrlList = that.ctrlList;
                var ctlLength = ctrlList.length;
                var deleindex = -1;
                for (var i = 0; i < ctlLength; i++) {
                    if (ctrlList[i].target.id == that.selectedCtrl.id) {
                        deleindex = i;
                        break;
                    }
                }
                that.removeCtrl(that.selectedCtrl);
                ctrlList.splice(deleindex, 1);
            }
        });

        // 提交页面
        $("#submitPage").on('click', function (e) {
            that.submitCtrlData();
        });

        // 鼠标移动事件
        this.moveCtrl();

        // 保存控件信息提交事件
        this.saveCtrlData();

        // 拖拽/放大选中元素
        $("#dragmoveCtrl").on('click', function () {
            that.selectedCtrl.startDrag();
            $(this).css("background", "#777");
        });
        this.on(Hilo.event.POINTER_MOVE,
            function (e) {
                if (that.state == "scale") {
                    var X = that.selectedCtrl.x;
                    var Y = that.selectedCtrl.y;
                    var preX = e.stageX;
                    var preY = e.stageY;
                    that.selectedCtrl.width = e.movementX + that.selectedCtrl.width;
                    that.selectedCtrl.height = e.movementY + that.selectedCtrl.height;
                }
            });

        this.on(Hilo.event.POINTER_END, function (e) {
            that.state = "";
            $("#dragmoveCtrl").css("background", "#efefef");
            if (that.selectedCtrl) {
                that.selectedCtrl.stopDrag();
            }
        });
    },
    /**
     * 添加底图
     * @basemap {Hilo.Bitmap}   [底图对象]
     */
    addBaseMap: function (basemap) {
        if (this.baseMap) {
            this.removeChild(this.baseMap);
        }
        this.baseMap = basemap;
        this.addChild(basemap);
    },

    /**
     * 添加控件-
     * @Ctrl {Hilo.DOMElement}   [底图对象]
     * @type {String} [控件类型/value/unit/label]
     */
    addCtrl: function (Ctrl) {
        debugger;
        if (!this.baseMap) {
            m("请先添加底图！");
            return;
        }
        this.bindCtrlEvent(Ctrl.target);
        this.addChild(Ctrl.target);
        this.ctrlList.push(Ctrl);
    },

    /**
     * 控件事件
     * @Ctrl {Hilo.DOMElement}   [底图对象]
     */
    bindCtrlEvent: function (Ctrl) {
        var that = this;
        // 拖拽事件
        Hilo.copy(Ctrl, Hilo.drag);
        Ctrl.startDrag();
        Ctrl.cursor = "pointer";

        // 选中事件
        Ctrl.on(Hilo.event.POINTER_START,
            function (e) {
                var target = e.eventTarget;
                that.selectedCtrl = target;
                // 拖拽放大缩小，方块为10个像素
                if ((e.layerX - target.x) >= (target.width - 10) && (e.layerY - target.y) >= (target.height - 10)) {
                    that.state = "scale";
                    e.preventDefault();
                } else {
                    that.state = "";
                    var _id = target.id;
                    var _index = _id.indexOf('_');
                    var type = _id.substring(0, _index);

                    var ctrlList = that.ctrlList;
                    var ctlLength = ctrlList.length;

                    for (var i = 0; i < ctlLength; i++) {
                        var ele = document.getElementById(ctrlList[i].target.id);
                        ele.style.border = "none";
                    }

                    // 选中样式
                    var ele = document.getElementById(_id);
                    ele.style.border = "1px dotted red";
                    $("#input_submit").show();
                    //  切换输入面板
                    that.switchCtrlInput(type, ctrlList, target);
                }
            }.bind(this));
    },

    /**
     * 鼠标微调
     */
    moveCtrl: function () {
        var that = this;

        function move() {
            if (!that.selectedCtrl) {
                return false;
            }
            key = event.keyCode;
            var x = parseInt(that.selectedCtrl.x);
            var y = parseInt(that.selectedCtrl.y);
            var distance = 2;
            // 左
            if (key == 37) that.selectedCtrl.x = x - distance;
            // 右
            if (key == 39) that.selectedCtrl.x = x + distance;
            // 上
            if (key == 38) that.selectedCtrl.y = y - distance;
            // 下
            if (key == 40) that.selectedCtrl.y = y + distance;
        }
        document.onkeydown = move;
    },

    /**
     * 删除控件
     * @Ctrl {Hilo.DOMElement}   [控件]
     */
    removeCtrl: function (Ctrl) {
        this.removeChild(Ctrl);
    },

    /**
     * 控件信息输入面板切换
     * @type {String} [控件类型/value/unit/label]
     * @ctrlList {Array} [控件列表]
     * @target {Object} [当前选中控件]
     */
    switchCtrlInput: function (type, ctrlList, target) {
        var ctlLength = ctrlList.length;
        for (var i = 0; i < ctlLength; i++) {
            if (ctrlList[i].type == type) {
                $(".paramInput").html(ctrlList[i].inputdDom);
                break;
            }
        }

        // 设置信息输入框值
        var ctlLength = ctrlList.length;
        for (var i = 0; i < ctlLength; i++) {
            if (ctrlList[i].target.id == target.id) {
                ctrlList[i].setDomData();
                break;
            }
        }
    },

    /**
     * 保存控件配置
     */
    saveCtrlData: function () {
        var that = this;
        $("#input_submit").on('click', function () {
            var selectedCtrl = that.selectedCtrl;
            var ctrlList = that.ctrlList;
            var ctlLength = ctrlList.length;
            for (var i = 0; i < ctlLength; i++) {
                if (ctrlList[i].target.id == selectedCtrl.id) {
                    ctrlList[i].setInfo();
                    break;
                }
            }
        });
    },

    /**
     * [submitCtrlData 提交监控画面]
     * @return {[void]} []
     */
    submitCtrlData: function () {
        var result = [];
        var ctrlList = this.ctrlList;
        var ctlLength = ctrlList.length;
        for (var i = 0; i < ctlLength; i++) {
            var ctrl = ctrlList[i];
            if (ctrl.info.data == "") {
                m("信息输入不完整");
                return;
            }
            var ret = ctrl.setFinalState();

            result.push(ret);
        }

        // 暂存至localStorage
        var data = JSON.stringify(result);

        debugger;

        if (Hilo.browser.supportStorage) {
            // window.localStorage.removeItem("monitorPageData");
            // window.localStorage.setItem("monitorPageData", data);
        }
    }
});

module.exports = ReadyScene;
