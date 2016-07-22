
/**
 * 绘图
 */
(function (ns) {
    var ReadyScene = ns.ReadyScene = Hilo.Class.create({
        Extends: Hilo.Container,
        constructor: function (properties) {
            ReadyScene.superclass.constructor.call(this, properties);
            this.init(properties);
        },
        index: 1,
        ctrlList: [],
        baseMap: false,
        selectedCtrl: null,
        init: function (properties) {
            // 删除元素
            var that = this;
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
                    that.removeChild(that.selectedCtrl);
                    ctrlList.splice(deleindex, 1);
                }
            });
        },
        addBaseMap: function (basemap) {
            this.baseMap = true;
            this.addChild(basemap);
        },
        addCtrl: function (Ctrl, type) {
            if(!this.baseMap){
                alert("请先添加底图！");
                return;
            }
            this.bindEvent(Ctrl);
            // ReadyScene与孩子之间没有"事件"冒泡
            this.addChild(Ctrl);
            var ctrlobj = {
                type: type,
                target: Ctrl,
                info: {}
            }
            this.ctrlList.push(ctrlobj);
        },
        bindEvent: function (Ctrl) {
            var that = this;
            // 拖拽事件
            Hilo.copy(Ctrl, Hilo.drag);
            Ctrl.startDrag();
            // 鼠标移动事件
            this.moveCtrl();
            // 选中事件
            Ctrl.on(Hilo.event.POINTER_START,
                function (e) {
                    var target = e.eventTarget;
                    var _id = target.id;
                    var _index = _id.indexOf('_');
                    var type = _id.substring(0, _index);
                    switch (type) {
                        case "value":
                            break;
                        case "unit":
                            break;
                        case "label":
                            break;
                        default:
                            this.selectedCtrl = null;
                            return;
                    }
                    var ctlLength = that.ctrlList.length;
                    for (var i = 0; i < ctlLength; i++) {
                        var ele = document.getElementById(that.ctrlList[i].target.id);
                        ele.style.border = "none";
                    }
                    // 选中样式()
                    var ele = document.getElementById(_id);
                    ele.style.border = "1px dotted red";
                    // 选中组件
                    this.selectedCtrl = target;
                }.bind(this));


        },
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
        // removeCtr: function (Ctrl) {
        //     this.removeChild(Ctrl);
        // },
        // 获取所有控件信息
        getCtrlData: function (params) {

        },
        // 选中某个空间

    });
})(window.Editor_2d);