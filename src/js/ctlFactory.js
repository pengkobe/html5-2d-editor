
/**
 * 绘图背景
 */
(function (ns) {
    var CtrlCount = 1;
    var ctlFactory = ns.ctlFactory = {
        getValue: function (position) {
            var font = "18px arial";
            var content = 'Value组件。<div class="drag-clock"></div>';
            var elem = new Hilo.DOMElement({
                id: "value_" + CtrlCount,
                class:"drag-element",
                element: Hilo.createElement('div', {
                    innerHTML: content,
                    style: {
                        position: 'absolute',
                        font: font,
                        color: "#fff",
                        background: "#000",
                    }
                }),
                width: 100,
                height: 40,
                x: position.x,
                y: position.y,
            });
            CtrlCount++;
            return elem;
        },
        getUnit: function (position) {
            var font = "14px arial";
            var content = "Unit组件。";
            var elem = new Hilo.DOMElement({
                id: "unit_" + CtrlCount,
                 class:"drag-element",
                element: Hilo.createElement('div', {
                    innerHTML: content,
                    style: {
                        position: 'absolute',
                        font: font
                    }
                }),
                width: 100,
                height: 35,
                x: position.x,
                y: position.y,
            });
            CtrlCount++;
            return elem;
        },
        getLabel: function (position) {
            var font = "14px arial bold";
            var content = "Label组件。";
            var elem = new Hilo.DOMElement({
                id: "label_" + CtrlCount,
                 class:"drag-element",
                element: Hilo.createElement('div', {

                    innerHTML: content,
                    style: {
                        position: 'absolute',
                        font: font
                    }
                }),
                width: 100,
                height: 35,
                x: position.x,
                y: position.y,
            });
            CtrlCount++;
            return elem;
        }
    }
})(window.Editor_2d);


