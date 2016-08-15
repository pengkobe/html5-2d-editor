
var label = require('./label/label.js');
var unit = require('./unit/unit.js');
var value = require('./value/value.js');
var state = require('./state/state.js');
var device = require('./device/device.js');

/**
 * 控件工厂
 */
var CtrlCount = 1;
var ctlFactory = {

    /**
   * 获取值控件
   * @param  {[Object]} options [配置]
   * @return {[Object]} [值控件对象]
   */
    getValue: function (options, info) {
        options.CtrlCount = ++CtrlCount;
        return value(options, info);
    },

   /**
   * 获取开关状态控件
   * @param  {[Object]} options [配置]
   * @return {[Object]} [开关控件对象]
   */
    getState: function (options, info) {
        options.CtrlCount = ++CtrlCount;
        return state(options, info);
    },

   /**
   * 获取单位控件
   * @param  {[Object]} options [配置]
   * @return {[Object]} [单位控件对象]
   */
    getUnit: function (options) {
        options.CtrlCount = ++CtrlCount;
        return unit(options);
    },

   /**
   * 获取标签控件
   * @param  {[Object]} options [配置]
   * @return {[Object]} [标签控件对象]
   */
    getLabel: function (options) {
        options.CtrlCount = ++CtrlCount;
        return label(options);
    },

    /**
    * [getDevice 获取设备控件]
    * @param  {[Object]} options [配置]
    */
    getDevice: function (options, info) {
        options.CtrlCount = ++CtrlCount;
        return device(options, info);
    },

    /**
     * [getControlByType 按类型获取控件]
     * @param  {[String]}  type    [控件类型]
     * @param  {[Object]}  options [定位配置]
     * @param  {[Object]}  info    [显示值配置]
     * @return {[Object]}          [控件对象]
     */
    getControlByType: function (type, options, info) {
        var ctrl;
        switch (type) {
            case "value":
                ctrl = this.getValue(options, info);
                break;
            case "unit":
                ctrl = this.getUnit(options);
                break;
            case "label":
                ctrl = this.getLabel(options);
                break;
            case "state":
                ctrl = this.getState(options, info);
                break;
            case "device":
                ctrl = this.getDevice(options, info);
                break;
            default: return;
        }

        return ctrl;

    }
}

module.exports = ctlFactory;
