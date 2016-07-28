/**
客户视图，不可编辑
*/
(function (ns) {
    var ReadyScene = ns.ReadyScene = Hilo.Class.create({
        Extends: Hilo.Container,
        constructor: function (properties) {
            ReadyScene.superclass.constructor.call(this, properties);
            this.init(properties);
        },
        index: 1,
        //{type: type, target: Ctrl,info: {}} 
        ctrlList: [],
        baseMap: false,
        selectedCtrl: null,
        init: function (properties) {
            $("#delCtrl").hide();
            $("#submitPage").hide();
        },
        // 添加底图
        addBaseMap: function (basemap) {
            this.baseMap = true;
            this.addChild(basemap);
        },
        // 渲染控件
        renderCtrl: function (ctrlinfo) {
            // if (!this.baseMap) {
            //     m("请先添加底图！");
            //     return;
            // }
            // this.addChild(Ctrl);
            // var ctrlobj = {
            //     type: type,
            //     target: Ctrl,
            //     info: {}
            // }
            // 需要记住ID动态设置DOM元素的值
            //this.ctrlList.push(ctrlobj);
        },
        // 绑定后台数据
        bindData: function (data) {

        },
      
    });
})(window.Editor_2d);