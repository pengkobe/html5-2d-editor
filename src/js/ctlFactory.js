
/**
 * 绘图背景
 */
(function (ns) {

    var ctlFactory = ns.ctlFactory = {
        getValue: function (position) {
            var font = "14px arial";
            var content = "只是一个Value组件。";
            var elem = new Hilo.DOMElement({
                element: Hilo.createElement('div', {
                    innerHTML: content,
                    style: {
                        position: 'absolute',
                        font: font,
                        color:"#000"
                    }
                }),
                width: 250,
                height: 100,
                x: position.x,
                y: position.y,
            });
            return elem;
        },
        getUnit: function (position) {
            var font = "14px arial";
            var content = "只是一个Unit组件。";
            var elem = new Hilo.DOMElement({
                element: Hilo.createElement('div', {
                    innerHTML: content,
                    style: {
                        position: 'absolute',
                        font: font
                    }
                }),
                width: 250,
                height: 100,
                x: position.x,
                y: position.y,
            });
            return elem;
        },
        getLabel: function (position) {
            var font = "14px arial";
            var content = "只是一个Label组件。";
            var elem = new Hilo.DOMElement({
                element: Hilo.createElement('div', {
                    innerHTML: content,
                    style: {
                        position: 'absolute',
                        font: font
                    }
                }),
                width: 250,
                height: 100,
                x: position.x,
                y: position.y,
            });

            return elem;
        }
    }
})(window.Editor_2d);


