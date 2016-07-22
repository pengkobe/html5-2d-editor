+function () {
    //var info = document.getElementById("info");  
    //获得被拖放的元素，本示例为相册所在的DIV  
    var src = document.getElementById("components");
    //开始拖放操作  
    src.ondragstart = function (e) {
        //获得被拖放的照片ID  
        var dragImgId = e.target.id;
        //获得被拖动元素  
        var dragImg = document.getElementById(dragImgId);
        //拖放操作结束  
        dragImg.ondragend = function (e) {
            //恢复提醒信息  
            //info.innerHTML="<h2>温馨提示：可将照片直接拖到垃圾箱中</h2>";  
        };
        e.dataTransfer.setData("text", dragImgId);
    };
    //拖放过程中  
    src.ondrag = function (e) {
        //info.innerHTML="<h2>--照片正在被拖动--</h2>";  
    }

    //获得拖放的目标元素  
    var target = document.getElementById("control");

    //关闭默认处理；  
    target.ondragenter = function (e) {
        e.preventDefault();
    }
    target.ondragover = function (e) {
        e.preventDefault();
    }

    //有东西拖放到了目标元素  
    target.ondrop = function (e) {
        var draggedID = e.dataTransfer.getData("text");
        //获取相册中的DOM对象  
        var oldElem = document.getElementById(draggedID);
        //从相册DIV中删除该照片的节点  
        oldElem.parentNode.removeChild(oldElem);
        //将被拖动的照片DOM节点添加到垃圾桶DIV中；  
        target.appendChild(oldElem);
        //info.innerHTML="<h2>温馨提示：可将照片直接拖到垃圾箱中</h2>";  
        e.preventDefault();
    }
}

