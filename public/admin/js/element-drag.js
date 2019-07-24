$(function(){

	var container = $('#img_wraper');
	var remScale = 1;
	var dragEvent = {
	    'target':undefined,
	    'currentEvent' :undefined,
	    'flag': false,
	    'startX': 0,
	    'endX': 0,
	    "currentX": 0,
	    "currentY": 0,
	    'startL': 0,
	    'startT': 0,
	    'startW': 0,
	    'startH': 0,
	    'currentAngle': 0,
	    'startO':1,
	    'ele': null
	};mulEvents = [];
	var startTime = 1,ctrlBtn = false;

	var methodMove = {
	    'drag':function(e){ e.preventDefault();
	        
            var endX = dragEvent.currentX - dragEvent.startX + dragEvent.startL,
                endY = dragEvent.currentY - dragEvent.startY + dragEvent.startT;
            if(endX >= -3 && endX <= 3){endX = 0;}
            if(endY >= -3 && endY <= 3){endY = 0;}
            if(endX >= container.width() - dragEvent.startW - 3 && endX <= container.width() - dragEvent.startW + 3){endX = container.width() - dragEvent.startW;}
            if(endY >= container.height() - dragEvent.startH - 3 && endY <= container.height() - dragEvent.startH + 3){endY = container.height() - dragEvent.startH;}
            dragEvent.target.css({'top':endY*remScale+'px','left':endX*remScale+'px'});
	        
	        
	        //console.log(mulEvents);
	    },
	    'se':function(e){ e.preventDefault();
	        var scale = dragEvent.startW / dragEvent.startH;
	        var endW = dragEvent.currentX - dragEvent.startX + dragEvent.startW;
	            endH = endW/scale;
	        dragEvent.target.find('.el-content').css({'width':endW*remScale+'px','height':endH*remScale+'px'});
	    },
	    'nw':function(e){e.preventDefault();
	        var scale = dragEvent.startW / dragEvent.startH;
	        var endX = dragEvent.currentX - dragEvent.startX;
	        var endW = - endX + dragEvent.startW;
	            endH = endW/scale;
	        var endY = dragEvent.startT - (endH - dragEvent.startH);
	        dragEvent.target.find('.el-content').css({'width':endW*remScale+'px','height':endH*remScale+'px'});
	        dragEvent.target.css({'top':endY+'px','left':endX+dragEvent.startL+'px'});
	    },
	    'ne':function(e){e.preventDefault();
	        var scale = dragEvent.startW / dragEvent.startH;
	        var endX = dragEvent.currentX - dragEvent.startX;
	        var endW = endX + dragEvent.startW;
	            endH = endW/scale;
	        var endY = dragEvent.startT - (endH - dragEvent.startH);
	        dragEvent.target.find('.el-content').css({'width':endW*remScale+'px','height':endH*remScale+'px'});
	        dragEvent.target.css({'top':endY+'px'});
	    },
	    'sw':function(e){e.preventDefault();
	        var scale = dragEvent.startW / dragEvent.startH;
	        var endX = dragEvent.currentX - dragEvent.startX;
	        var endW = - endX + dragEvent.startW;
	            endH = endW/scale;

	        dragEvent.target.find('.el-content').css({'width':endW*remScale+'px','height':endH*remScale+'px'});
	        dragEvent.target.css({'left':endX+dragEvent.startL+'px'});
	    },
	    'left':function(e){e.preventDefault();
	        var endW = -dragEvent.currentX + dragEvent.startX + dragEvent.startW;
	        var endL = dragEvent.currentX - dragEvent.startX + dragEvent.startL;
	        dragEvent.target.find('.el-content').css({'width': endW+'px'});
	        dragEvent.target.css({'left': endL+'px'});
	    },
	    'top':function(e){e.preventDefault();
	        var endH = -dragEvent.currentY + dragEvent.startY + dragEvent.startH;
	        var endT = dragEvent.currentY - dragEvent.startY + dragEvent.startT;
	        dragEvent.target.find('.el-content').css({'height': endH+'px'});
	        dragEvent.target.css({'top': endT+'px'});
	    },
	    'right':function(e){e.preventDefault();
	        var endW = dragEvent.currentX - dragEvent.startX + dragEvent.startW;
	        dragEvent.target.find('.el-content').css({'width': endW+'px'});
	    },
	    'bottom':function(e){e.preventDefault();
	        var endH = dragEvent.currentY - dragEvent.startY + dragEvent.startH;
	        dragEvent.target.find('.el-content').css({'height': endH+'px'});
	    },
	    'rotate':function(e){e.preventDefault();

	        var ex = dragEvent.currentX - dragEvent.startX;
	        var ey = dragEvent.currentY - dragEvent.startY;

	        var currentAngle = dragEvent.currentAngle;

	        var offsetX = dragEvent.target.offset().left;
	        var offsetY = dragEvent.target.offset().top;
	        var mouseX = e.pageX - offsetX;/*计算出鼠标相对于画布顶点的位置,无pageX时用clientY + body.scrollTop - body.clientTop代替,可视区域y+body滚动条所走的距离-body的border-top,不用offsetX等属性的原因在于，鼠标会移出画布*/
	        var mouseY = e.pageY - offsetY;
	        var ox = mouseX - dragEvent.startW/2;/*cx,cy为圆心*/
	        var oy = mouseY - dragEvent.startH/2;
	        var to = Math.abs( ox/oy );
	        var angle = Math.atan( to )/( 2 * Math.PI ) * 360;/*鼠标相对于旋转中心的角度*/
	        if( ox < 0 && oy < 0)/*相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系*/
	        {
	                angle = 360 - angle;
	        }else if( ox < 0 && oy > 0)/*左下角,3象限*/
	        {
	                angle =  180 + angle;
	        }else if( ox > 0 && oy < 0)/*右上角，1象限*/
	        {
	                angle = angle;
	        }else if( ox > 0 && oy > 0)/*右下角，2象限*/
	        {
	                angle = 180 -  angle;
	        }
	        var offsetAngle = angle - parseFloat(currentAngle);

	        dragEvent.target.css({'transform': 'rotateZ('+offsetAngle+'deg)','-webkit-transform': 'rotateZ('+offsetAngle+'deg)','-moz-transform': 'rotateZ('+offsetAngle+'deg)','-o-transform': 'rotateZ('+offsetAngle+'deg)','-ms-transform': 'rotateZ('+offsetAngle+'deg)'});
	        
	        dragEvent.target.attr('data-rotate',offsetAngle);
	        dragEvent.ele.css.transform = 'rotateZ('+offsetAngle+'deg)';
	    }

	},moveFun='';
	 function startFun(e,s){
	    if (e.originalEvent) e = e.originalEvent;
	    var touch = e;
	    if(e.type != 'click' && e.touches && e.touches.length > 0){
	        touch = e.touches[0];
	    }

	    if(s){
	        dragEvent.currentEvent = e;
	        dragEvent.target = s;
	    }
	    startTime = 0;

	    dragEvent.flag = true;

	    dragEvent.startW = dragEvent.target.find('.el-content').css("width") == 'auto'? 0 : parseFloat(dragEvent.target.find('.el-content').css("width"));
	    dragEvent.startH = dragEvent.target.find('.el-content').css("height") == 'auto'? 0 : parseFloat(dragEvent.target.find('.el-content').css("height"));
	    dragEvent.startL = dragEvent.target.css("left") == 'auto'? 0 : parseFloat(dragEvent.target.css("left"));
	    dragEvent.startT = dragEvent.target.css("top") == 'auto'? 0 : parseFloat(dragEvent.target.css("top"));
	    dragEvent.startX = touch.pageX;
	    dragEvent.startY = touch.pageY;
	    
	    dragEvent.currentAngle = dragEvent.target.attr('data-rotate') || 0;

	    //dragEvent.startO = dragEvent.target.css('opacity');
	    //dragEvent.target.stop(true,false).fadeTo(0,0.8);
	    $(dragEvent.currentEvent.currentTarget).addClass('activated');

	    

	}

	$(document).on({
	    'mousemove':function(e){
	        if (e.originalEvent) e = e.originalEvent;
	        if(!dragEvent.flag) return;
	        e.preventDefault();
	        var touch = e;
	        if(e.type != 'click' && e.touches && e.touches.length > 0){
	            touch = e.touches[0];
	        }
	        if(startTime <= 0 && dragEvent.target){
	            startFun(e);startTime ++;
	        }
	        dragEvent.currentX = touch.pageX,
	        dragEvent.currentY = touch.pageY;
	        if(methodMove[moveFun]) methodMove[moveFun](e);

	    },
	    'mouseup':function(e){            
	        if(dragEvent.target && dragEvent.flag){
	            dragEvent.flag = false;
	            if(update_area){
		        	update_area(dragEvent);
		        }
	        }

	        if(dragEvent.currentEvent) $(dragEvent.currentEvent.currentTarget).removeClass('activated');
	    }
	})
	$(document).on('click','.el-content',function(e){
	    e.stopPropagation();
	    
	    
	}).on('mousedown','.el-content',function(e){
	    var s = $(this).parent().parent();
	    // if(s.attr("ele-drag") == undefined){return;}
	    $(".pst-element").removeClass('active');
	    s.addClass('active');
	    startFun(e,s); moveFun = 'drag';

	}).on("mousedown",'#img_wraper .nbar-se',function(e){
	    var s = $(this).parent();
	    if(!s.hasClass('active')) return;
	    startFun(e,s); moveFun = 'se';
	}).on("mousedown",'#img_wraper .nbar-nw',function(e){
	    var s = $(this).parent();
	    if(!s.hasClass('active')) return;
	    startFun(e,s);moveFun = 'nw';
	}).on("mousedown",'#img_wraper .nbar-ne',function(e){
	    var s = $(this).parent();
	    if(!s.hasClass('active')) return;
	    startFun(e,s); moveFun = 'ne';
	}).on("mousedown",'#img_wraper .nbar-sw',function(e){
	    var s = $(this).parent();
	    if(!s.hasClass('active')) return;
	    startFun(e,s); moveFun = 'sw';
	}).on("mousedown",'#img_wraper .nbar-w',function(e){
	    var s = $(this).parent();
	    if(!s.hasClass('active')) return;
	    startFun(e,s); moveFun = 'left';
	}).on("mousedown",'#img_wraper .nbar-n',function(e){
	    var s = $(this).parent();
	    if(!s.hasClass('active')) return;
	    startFun(e,s); moveFun = 'top';
	}).on("mousedown",'#img_wraper .nbar-e',function(e){
	    var s = $(this).parent();
	    if(!s.hasClass('active')) return;
	    startFun(e,s); moveFun = 'right';
	}).on("mousedown",'#img_wraper .nbar-s',function(e){
	    var s = $(this).parent();
	    if(!s.hasClass('active')) return;
	    startFun(e,s); moveFun = 'bottom';
	}).on("mousedown",'#img_wraper .nbar-rotate',function(e){
	    var s = $(this).parent();
	    if(!s.hasClass('active')) return;
	    startFun(e,s); moveFun = 'rotate';
	});

	
})