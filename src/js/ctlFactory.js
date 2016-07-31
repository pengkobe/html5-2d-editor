
/**
 * 控件工厂
 */
(function (ns) {
    var CtrlCount = 1;
    var ctlFactory = ns.ctlFactory = {
      /**
       * 获取值控件
       * @options {Object} [配置]
       */
        getValue: function (options) {
            var _default = {
                x: 0,
                y: 0,
                width: 100,
                height: 40,
                name: 'Value组件。'
            };
            var opts = options || {};
            for (var k in _default) {
                if (typeof opts[k] === 'undefined') {
                    opts[k] = _default[k];
                }
            }


            var font = "18px arial";
            var content = '<span>' + opts.name + '</span><div class="drag-clock"></div>';
            var elem = new Hilo.DOMElement({
                id: "value_" + CtrlCount,
                class: "drag-element",
                element: Hilo.createElement('div', {
                    innerHTML: content,
                    style: {
                        position: 'absolute',
                        font: font,
                        color: "#fff",
                        background: "#000",
                    }
                }),
                width: opts.width,
                height: opts.height,
                x: opts.x,
                y: opts.y,
            });
            CtrlCount++;
            return elem;
        },
        /**
       * 获取单位控件
       * @options {Object} [配置]
       */
        getUnit: function (options) {
            var _default = {
                x: 0,
                y: 0,
                width: 100,
                height: 35,
                name: 'Unit组件。'
            };
            var opts = options || {};
            for (var k in _default) {
                if (typeof opts[k] === 'undefined') {
                    opts[k] = _default[k];
                }
            }


            var font = "14px arial";
            var content = opts.name;
            var elem = new Hilo.DOMElement({
                id: "unit_" + CtrlCount,
                class: "drag-element",
                element: Hilo.createElement('div', {
                    innerHTML: content,
                    style: {
                        position: 'absolute',
                        font: font,
                        color: "#fff",
                    }
                }),
                width: opts.width,
                height: opts.height,
                x: opts.x,
                y: opts.y,
            });
            CtrlCount++;
            return elem;
        },
        /**
       * 获取标签控件
       * @options {Object} [配置]
       */
        getLabel: function (options) {
            var _default = {
                x: 0,
                y: 0,
                width: 100,
                height: 35,
                name: 'Label组件。'
            };
            var opts = options || {};
            for (var k in _default) {
                if (typeof opts[k] === 'undefined') {
                    opts[k] = _default[k];
                }
            }

            var font = "14px arial bold";
            var content = _default.name;
            var elem = new Hilo.DOMElement({
                id: "label_" + CtrlCount,
                class: "drag-element",
                element: Hilo.createElement('div', {
                    innerHTML: content,
                    style: {
                        position: 'absolute',
                        font: font
                    }
                }),
                width: opts.width,
                height: opts.height,
                x: opts.x,
                y: opts.y,
            });
            CtrlCount++;
            return elem;
        }
    }
})(window.Editor_2d);


