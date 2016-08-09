
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
     * @options {Object} [配置]
     */
    getValue: function (options) {
        options.CtrlCount = ++CtrlCount;
        return value(options);
    },

    /**
     * 获取开关状态控件
     * @options {Object} [配置]
     */
    getState: function (options) {
        options.CtrlCount = ++CtrlCount;
        return state(options);
    },

    /**
   * 获取单位控件
   * @options {Object} [配置]
   */
    getUnit: function (options) {
        options.CtrlCount = ++CtrlCount;
        return unit(options);
    },
    /**
   * 获取标签控件
   * @options {Object} [配置]
   */
    getLabel: function (options) {
        options.CtrlCount = ++CtrlCount;
        return label(options);
    },

    /**
    * [getDevice 获取设备控件]
    * @param  {[Object]} options [配置]
    */
    getDevice: function (options) {
        options.CtrlCount = ++CtrlCount;
        return device(options);
    },

    /**
     * [getControlByType 按类型获取控件]
     * @param  {[String]} type    [控件类型]
     * @param  {[Object]} options [配置]
     * @return {[Object]}         [控件对象]
     */
    getControlByType: function (type, options) {
        var ctrl;
        switch (type) {
            case "value":
                ctrl = this.getValue(options);
                break;
            case "unit":
                ctrl = this.getUnit(options);
                break;
            case "label":
                ctrl = this.getLabel(options);
                break;
            case "state":
                ctrl = this.getState(options);
                break;
            case "device":
                ctrl = this.getDevice(options);
                break;
            default: return;
        }

        return ctrl;

    }
}

module.exports = ctlFactory;
