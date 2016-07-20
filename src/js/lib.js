;(function(window, undefined){

    var Core = {};
    var config = {
        MAX_STEPS: 8,
        DECIMAL: 3,
        drawlinesInRectTag: false,
        selectlinesInRectTag: false,
        drawInfoRectTag: false,
        moveObjTag: false,
        colorTag: false,
        rulerTag: false,
        ready: false
    };
    var uid = 0;

    /**
     * getUID generate unique id.
     * @return {Number} id
     */
    function getUID(){
        return ++uid;
    }
   
    /**
     * toggleClass toggle class
     * @param  {Sting} cls   classname
     * @param  {DOM} context context
     */
    function toggleClass(cls, context){
        var n = context.className
          , regHasCls = new RegExp("(^|\\s)" + cls + "($|\\s)");

        context = context.length > 0 ? context : [context];

        [].slice.call(context).forEach(function(item){
            if(!regHasCls.test(n)){
                item.className += cls;
            } else {
                item.className = item.className.replace(regHasCls, "");
            }
        });
    }

    /**
     * _getOffset get object offsetTop and offsetLeft
     * @param {DOM} obj
     * @return {Object} left and top
     */
    function _getOffset(obj){
        var l = 0, t = 0;

        while(obj){
            t += parseInt(obj.offsetTop);
            l += parseInt(obj.offsetLeft);
            obj = obj.offsetParent;
        }

        return {
            left: l,
            top: t
        }
    }

    /**
     * moveObj move the paint obj
     */
    function moveObj(obj, tag){

        obj.style.cursor = "move";  

        if(!config['ready'] && config['moveObjTag'] && tag) {
            obj.onmousedown = null;
            obj.style.cursor = "default";  
            return;
        }

        obj.onmousedown = function(e){

            obj.style.cursor = "move";  

            var sX = e.pageX - parseInt(obj.style.left||0)
              , sY = e.pageY - parseInt(obj.style.top||0)
              , oX = e.pageX
              , oY = e.pageY;

            obj.onmousemove = function(e){

                obj.onmouseup = function(e){
                    obj.onmousemove = obj.onmouseup = null;
                }

                with(obj.style){
                    left = e.pageX - sX;
                    top = e.pageY - sY;
                }
            }
        }
    }

    /**
     * [getColor description]
     */
    function getColor(){
        can.style.cursor = "pointer";

        if(!config['ready'] && config['colorTag']) {
            can.onmousedown = null;
            can.style.cursor = "default";  
            return;
        }

        var colorInfo = document.createElement("div");

        colorInfo.className = "color-info-box";


        var bDelta = _getOffset(document.querySelector(".wrapper"));
        var delta = _getOffset(box);
        can.onmousemove = function(e){
              var x = e.pageX 
                , y = e.pageY;

            var pixel = ctx.getImageData(x - delta.left, y - delta.top, 1, 1).data;

            var ret = "rgba(", c = "#";

            [].slice.call(pixel).forEach(function(item, index){
                if(index == pixel.length - 1){
                    ret += ((item / 255).toFixed(8) + ")");
                    return;
                }
                ret += item + ",";

                var s = item.toString(16);
                c += (s < 10 ? "0" + s : s);
            });

            with(colorInfo.style){
                top = y - 20  - delta.top;
                left = x + 20  - delta.left;

                top = Math.max(bDelta.top, top);
                left = Math.min(bDelta.left + box.offsetWidth, left);
            }

            colorInfo.innerHTML = "<span></span>" + c.toUpperCase();

            box.appendChild(colorInfo);

            colorInfo.getElementsByTagName("span").item(0).style.backgroundColor = c;
        };

        can.onclick = function(e){
            var x = e.pageX - delta.left
              , y = e.pageY - delta.top;

            if(!colorInfo.textContent) return;

            var c = document.createElement("div");

            c.className = "color-box line";
            with(c.style){
                top = y - 14;
                left = x + 18;
            }

            c.innerHTML =  "<span></span>" + colorInfo.textContent;
            c.getElementsByTagName("span").item(0).style.backgroundColor = colorInfo.textContent;

            box.appendChild(c);
        };
    }

    return window.Core = Core = {
        config:            config,
        toggleClass:       toggleClass,
        moveObj:           moveObj,
        getColor:          getColor,
    }

})(window, undefined);