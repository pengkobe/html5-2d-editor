function CrtlObj(id, opts, ele) {
    this.id = id;
    this.info = {};
    this.opts = opts;
    this.target = ele;

    /**
     * [setDomData 输入面板html]
     */
    this.setDomData = function() {
        $("#labelField").val(this.info.name);
    }

    /**
     * [setInfo 设置输入控件值]
     */
    this.setInfo = function() {
        var data = $("#labelField").val();
        this.info.name=data;
        $("#" + this.id).html(data);
    }

    /**
     * [setFinalState 返回控件信息]
     */
    this.setFinalState = function(){
        this.opts.x = this.target.x;
        this.opts.y = this.target.y;
        this.opts.height = this.target.height;
        this.opts.width = this.target.width;

        return {
            id:this.id,
            type:this.type,
            info:this.info,
            opts:this.opts
        };
    }
}

CrtlObj.prototype.type = "label";
CrtlObj.prototype.inputdDom = __inline('input.tpl');



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
    var data = {
        name:  _default.name
    };
    var content = __inline("label.handlebars")(data);
    var elem = new Hilo.DOMElement({
        id: "label_" + options.CtrlCount,
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
        // 开启后无法实现拖拽，迷茫中
        //scaleX: 0.8,
        //scaleY: 0.8 //缩放约定
    });

    return new CrtlObj("label_" + options.CtrlCount, opts, elem);
}

module.exports = c;
