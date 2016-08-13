function CrtlObj(id, opts, ele) {
    this.id = id;
    this.info = {};
    this.opts = opts;
    this.target = ele;

    /**
     * [setDomData 输入面板html]
     */
    this.setDomData = function () {
        if (this.info.name) {
            $("#stateField").val("{" + this.info.name + "}");
        }
        // 事件注册
        $(".state-add-button").on('click', function (e) {
            var inputTpl = $("#value-key-tpl").html();
            $(".key-value-ul").append(inputTpl);
        });
    }

    /**
     * [setInfo 设置输入控件值]
     */
    this.setInfo = function () {
        var that = this;
        var data = $("#stateField").val();
        that.info.name = data;
        var value_key_list = $(".key-value-ul");

        that.info.key_color_list = [];

        $.each(value_key_list, function (e) {
            var key = $(this).find("[type=text]").val();
            var color = $(this).find("[type=color]").val();
            that.info.key_color_list.push({
                key: key,
                color: color
            });
        });

        $("#" + this.id).find("span").html(data);
    }

    /**
     * [setFinalState 返回控件信息]
     */
    this.setFinalState = function () {
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

CrtlObj.prototype.type = "state";
CrtlObj.prototype.inputdDom = __inline('input.tpl');


function c(options) {
    var _default = {
        x: 0,
        y: 0,
        width: 100,
        height: 40,
        name: '开关控件'
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
    var content = __inline("state.handlebars")(data);
    var elem = new Hilo.DOMElement({
        id: "state_" + options.CtrlCount,
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
    var obj = new CrtlObj("state_" + options.CtrlCount, opts, elem);
    return obj;
}
module.exports = c;
