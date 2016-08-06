
var label = require('./label/label.js');
var unit = require('./unit/unit.js');
var value = require('./value/value.js');
var state = require('./state/state.js');

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
    getSwitch: function (options) {
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
    }
}

module.exports = ctlFactory;