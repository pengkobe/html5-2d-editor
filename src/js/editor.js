// canvas面板
var can = document.querySelector("#can")

  
  , move = document.querySelector("#move")
  , select = document.querySelector("#select")
  , width, height;

var githubURL = "http://ghbtns.com/github-btn.html?user=pengkobe&repo=html5-2d-editor&type=watch&count=true&size=middle";
// 判断语言
var isCN = document.body.getAttribute("lang") == "cn";
// 判断浏览器
if(navigator.appVersion.indexOf("MSIE") > -1) {
    HTMLElement.prototype.remove = HTMLElement.prototype.remove || function(){
        this.parentNode && this.parentNode.removeChild(this);
    };
};

// Toggle class "on"
function tCls(that){
    [].slice.call(document.querySelectorAll("#control div")).forEach(function(item){
        item.className = "";
    });
    if(that) Core.toggleClass("on", that);
}

// 弹出框
function m(msg){
    var mask = document.createElement("div");
    mask.className = "mask";
    var maskInfo = document.createElement("div");
    maskInfo.className = "mask-info";

    maskInfo.innerHTML = "<a href='#' id='maskInfoClose'>×</a>";

    if(msg) {
        maskInfo.innerHTML += msg;
    } else {
        if(isCN){
            maskInfo.innerHTML += "欢迎体验使用监控画面编辑器，适用于底图＋简单控件的监控画面制作。<br />" +
                "<a href='#' target='_blank'>演示地址</a>"
        }
    }

    document.body.appendChild(mask);
    document.body.appendChild(maskInfo);

    document.querySelector("#maskInfoClose").onclick = function(e){
        e.preventDefault();
        mask.remove();
        maskInfo.remove();
    }
};
//m();


window.onload = function() {
    var delLines = [];

    // move
    move.onclick = function(){
        Core.setTurnerTag('moveObjTag');
        tCls(this);

        Core.moveObj(box, true);
    };

    // Select to delete
    select.onclick = function(){
        Core.setTurnerTag('selectlinesInRectTag');
        tCls(this);
        Core.drawRectange(box, function(rect){
            Core.detectInRectange(document.querySelectorAll(".line, .ruler"), rect, function(lines){
                [].slice.call(lines).forEach(function(item){
                    if(item.getAttribute("data-del") == "yes"){
                        item.removeAttribute("data-del");
                    } else {
                        item.setAttribute("data-del", 'yes');
                    }
                });
                delLines = delLines.concat(lines);
            });
        });
    };
    // Cancal / reselect delete for some lines
    document.addEventListener("click", function(e){
        var $this = e.target;
        if($this.getAttribute("data-del") == "yes"){
            $this.removeAttribute("data-del");
        }

        delLines = [];
        [].slice.call(document.querySelectorAll(".line, .ruler")).forEach(function(item){
            if(item.getAttribute("data-del") == 'yes'){
                delLines.push(item);
            }
        });

    }, true);

    document.addEventListener("keyup", function(e){
        // console.log(e.keyCode);

        // fix bug
        window.focus();

        switch(e.keyCode) {
            case 32: // space
            case 77: // M
                move.click();
                break;
            case 83: // S
                select.click();
                break;
            case 67: // C
                color.click();
                break;
            case 79: // O
                file.click();
                break;
        }
    }, false);

    document.querySelector(".github-star").setAttribute("src", githubURL);
};

