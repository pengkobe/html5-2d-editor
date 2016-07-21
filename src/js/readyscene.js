
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
        baseMap: null,
        init: function (properties) {
            //this.addChild(tap, getready);
        },
        addCtrl: function (Ctrl, type) {
            this.addChild(Ctrl);
            if (!type) {
                this.ctrlList.push(Ctrl);
            }
        },
        getCtrlData:function (params) {
            
        }
    });
})(window.Editor_2d);