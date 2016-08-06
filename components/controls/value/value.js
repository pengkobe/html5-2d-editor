function c(options) {
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
    var content = '<span class="breakword">' + opts.name + '</span><div class="drag-clock"></div>';
    var elem = new Hilo.DOMElement({
        id: "value_" +  options.CtrlCount,
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
     return elem;
}
module.exports = c;