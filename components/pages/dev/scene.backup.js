/**
 * 绘图
 * edit by pengyi at 2016-07-22
 */
var ReadyScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties) {
        ReadyScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },
    // index: 1,
    ctrlList: [], // {type: type, target: Ctrl,info: {}}
    baseMap: null,
    selectedCtrl: null,
    state: '', //move
    /**
     * 初始化
     * @properties  {Object} [配置]
     */
    init: function(properties) {
        this.bindEvent();
    },
    /**
     * 全局事件
     */
    bindEvent: function() {
        var that = this;
        // 删除元素
        $("#delCtrl").on('click', function() {
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
        $("#submitPage").on('click', function(e) {
            that.submitCtrlData();
        });
        // 保存控件信息提交事件
        this.saveCtrlData();
        // 鼠标移动事件
        this.moveCtrl();
        // 拖拽/放大选中元素
        $("#dragmoveCtrl").on('click', function() {
            that.selectedCtrl.startDrag();
            $(this).css("background", "#777");
        });
        this.on(Hilo.event.POINTER_MOVE,
            function(e) {
                if (that.state == "scale") {
                    var X = that.selectedCtrl.x;
                    var Y = that.selectedCtrl.y;
                    var preX = e.stageX;
                    var preY = e.stageY;
                    that.selectedCtrl.width = e.movementX + that.selectedCtrl.width;
                    that.selectedCtrl.height = e.movementY + that.selectedCtrl.height;
                }
            });

        this.on(Hilo.event.POINTER_END, function(e) {
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
    addBaseMap: function(basemap) {
        if (this.baseMap) {
            this.removeChild(this.baseMap);
        }
        this.baseMap = basemap;
        this.addChild(basemap);
    },
    /**
     * 添加控件
     * @Ctrl {Hilo.DOMElement}   [底图对象]
     * @type {String} [控件类型/value/unit/label]
     */
    addCtrl: function(Ctrl, type) {
        if (!this.baseMap) {
            m("请先添加底图！");
            return;
        }
        this.bindCtrlEvent(Ctrl);
        this.addChild(Ctrl);
        var ctrlobj = {
            type: type,
            target: Ctrl,
            info: {}
        }
        this.ctrlList.push(ctrlobj);
    },
    /**
     * 控件事件
     * @Ctrl {Hilo.DOMElement}   [底图对象]
     */
    bindCtrlEvent: function(Ctrl) {
        var that = this;
        // 拖拽事件
        Hilo.copy(Ctrl, Hilo.drag);
        Ctrl.startDrag();
        Ctrl.cursor = "pointer";

        // 选中事件
        Ctrl.on(Hilo.event.POINTER_START,
            function(e) {
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
                    //  切换输入面板
                    that.switchCtrlInput(type, ctrlList, target);
                }
            }.bind(this));
    },
    /**
     * 控件信息输入面板切换
     * @type {String} [控件类型/value/unit/label]
     * @ctrlList {Array} [控件列表]
     * @target {Object} [当前选中控件]
     */
    switchCtrlInput: function(type, ctrlList, target) {
        switch (type) {
            case "value":
                $("#value_block").show().siblings().hide();
                break;
            case "unit":
                $("#unit_block").show().siblings().hide();
                break;
            case "label":
                $("#label_block").show().siblings().hide();
                break;
            case "switch":
                $("#switch_block").show().siblings().hide();
                break;
            default:
                that.selectedCtrl = null;
                return;
        }

        // 设置信息输入框值
        var ctlLength = ctrlList.length;
        for (var i = 0; i < ctlLength; i++) {
            if (ctrlList[i].target.id == target.id) {
                var data = ctrlList[i].info.data;
                switch (ctrlList[i].type) {
                    case "value":
                        $("#valueField").val(data);
                        break;
                    case "unit":
                        $("#unitField").val(data);
                        break;
                    case "label":
                        $("#labelField").val(data);
                        break;
                    case "switch":
                        $("#switchField").val(data);
                        break;
                    default:
                        return;
                }
                break;
            }
        }
    },
    /**
     * 鼠标微调
     */
    moveCtrl: function() {
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
    removeCtrl: function(Ctrl) {
        this.removeChild(Ctrl);
    },
    /**
     * 保存控件配置
     */
    saveCtrlData: function() {
        var that = this;
        $("#label_submit").on('click', function() {
            var selectedCtrl = that.selectedCtrl;
            var ctrlList = that.ctrlList;
            var data = $("#labelField").val();
            var ctlLength = ctrlList.length;
            for (var i = 0; i < ctlLength; i++) {
                if (ctrlList[i].target.id == selectedCtrl.id) {
                    ctrlList[i].info.data = data;
                    $("#" + ctrlList[i].target.id).html(data);
                    break;
                }
            }

        });
        $("#unit_submit").on('click', function() {
            var selectedCtrl = that.selectedCtrl;
            var ctrlList = that.ctrlList;
            var data = $("#unitField").val();
            var ctlLength = ctrlList.length;
            for (var i = 0; i < ctlLength; i++) {
                if (ctrlList[i].target.id == selectedCtrl.id) {
                    ctrlList[i].info.data = data;
                    $("#" + ctrlList[i].target.id).html(data);
                    break;
                }
            }
        });
        $("#value_submit").on('click', function() {
            var selectedCtrl = that.selectedCtrl;
            var ctrlList = that.ctrlList;
            var data = $("#valueField").val();
            var color = $("#colorFiled").val();
            var ctlLength = ctrlList.length;
            for (var i = 0; i < ctlLength; i++) {
                if (ctrlList[i].target.id == selectedCtrl.id) {
                    ctrlList[i].info.data = data;
                    ctrlList[i].info.color = color;
                    $("#" + ctrlList[i].target.id).find("span").text("{{" + data + "}}").css("color", color);
                    break;
                }
            }
        });
        $("#switch_submit").on('click', function() {
            var selectedCtrl = that.selectedCtrl;
            var ctrlList = that.ctrlList;
            var data = $("#switchField").val();
            var color = $("#colorFiled").val();
            var ctlLength = ctrlList.length;
            for (var i = 0; i < ctlLength; i++) {
                if (ctrlList[i].target.id == selectedCtrl.id) {
                    ctrlList[i].info.data = data;
                    ctrlList[i].info.color = color;
                    $("#" + ctrlList[i].target.id).find("span").text("{{" + data + "}}").css("color", color);
                    break;
                }
            }
        });
    },
    /**
     * 提交监控画面
     */
    submitCtrlData: function() {
        var ctrlList = this.ctrlList;
        var data = { // {name,x,y}
            valueCtrls: [],
            unitCtrls: [],
            labelCtrls: [],
            switchCtrls: []
        };
        var ctrlList = this.ctrlList;
        var ctlLength = ctrlList.length;
        for (var i = 0; i < ctlLength; i++) {
            var ctrl = ctrlList[i];
            if (ctrl.info.data == "") {
                m("信息输入不完整");
                return;
            }
            switch (ctrlList[i].type) {
                case "value":
                    data.valueCtrls.push({
                        name: ctrl.info.data,
                        x: ctrl.target.x,
                        y: ctrl.target.y,
                        height: ctrl.target.height,
                        width: ctrl.target.width
                    });
                    break;
                case "unit":
                    data.unitCtrls.push({
                        name: ctrl.info.data,
                        x: ctrl.target.x,
                        y: ctrl.target.y,
                        height: ctrl.target.height,
                        width: ctrl.target.width
                    });
                    break;
                case "label":
                    data.labelCtrls.push({
                        name: ctrl.info.data,
                        x: ctrl.target.x,
                        y: ctrl.target.y,
                        height: ctrl.target.height,
                        width: ctrl.target.width
                    });
                    break;
                case "switch":
                    data.switchCtrls.push({
                        name: ctrl.info.data,
                        x: ctrl.target.x,
                        y: ctrl.target.y,
                        height: ctrl.target.height,
                        width: ctrl.target.width
                    });
                    break;
                default:
                    return;
            }
        }

        // 暂存至localStorage
        var data = JSON.stringify(data);
        if (Hilo.browser.supportStorage) {
            window.localStorage.removeItem("monitorPageData");
            window.localStorage.setItem("monitorPageData", data);
        }
    }
});

module.exports = ReadyScene;
