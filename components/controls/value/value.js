function CrtlObj(id, opts, ele) {
    this.id = id;
    this.info = {};
    this.opts = opts;
    this.target = ele;

    /**
     * [setDomData 输入面板html]
     */
    this.setDomData = function() {
        $("#valueField").val(this.info.name);
        $("#colorFiled").val(this.info.color);
    }

    /**
     * [setInfo 设置输入控件值]
     */
    this.setInfo = function() {
        debugger;
        var data = $("#valueField").val();
        var color = $("#colorFiled").val();
        this.info.name = data;
        this.info.color = color;
        $("#" + this.id).find("span").html(data).text("{{" + data + "}}").css("color", color);;
    }

    /**
     * [setFinalState 返回控件信息]
     */
    this.setFinalState = function() {
        this.opts.x = this.target.x;
        this.opts.y = this.target.y;
        this.opts.height = this.target.height;
        this.opts.width = this.target.width;

        return {
            id: this.id,
            type: this.type,
            info: this.info,
            opts: this.opts
        };
    }
}

CrtlObj.prototype.type = "value";
CrtlObj.prototype.inputdDom = __inline('input.tpl');

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
    var data = {
        name: _default.name
    };
    var content = __inline("value.handlebars")(data);

    var elem = new Hilo.DOMElement({
        id: "value_" + options.CtrlCount,
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
    return new CrtlObj("value_" + options.CtrlCount, opts, elem);
}

module.exports = c;
