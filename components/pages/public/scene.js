/**
客户视图，不可编辑
*/

var CustomerScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function (properties) {
        CustomerScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },
    baseMap: false,
    init: function (properties) {
    },
    /**
    * 添加底图
    */
    addBaseMap: function (basemap) {
        this.baseMap = true;
        this.addChild(basemap);
    },
    /**
   * 添加控件
   * @Ctrl {Hilo.DOMElement}   [底图对象]
   * @type {String} [控件类型/valueComp/unitComp/labelComp]
   */
    addCtrl: function (Ctrl, type) {
        this.addChild(Ctrl);
    },
    // 绑定后台数据
    bindData: function (data) {
    },

});

module.exports = CustomerScene;