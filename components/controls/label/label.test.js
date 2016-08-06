
function c(options) {
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
    var content = '<span  class="breakword">' + _default.name + '</span><div class="drag-clock"></div>';
    var elem = new Hilo.DOMElement({
        id: "label_" +  options.CtrlCount,
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
        scaleX: 0.8, scaleY: 0.8//缩放约定
    });

    return {
        // 数据配置
        type:"label",
        info:{},
        // 控件本身
        dom:elem,
        // 控件配置
        opts:opts
    }
}

module.exports = c;