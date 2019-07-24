/*
*	适用于PC拖拽
*/
(function ($) {	
    $.fn.dragable = function (options) {
		return this.each(function () {			
			var s = $(this);
			var dragEvent = {
				"flag":false,
				"target":s,
				"currentX":0,
				"currentY":0
			}
			var defaults = {
				'target':s,
				'dragElement':s,
				'moveable':true, /* 默认为移动事件 */
				'scaling':1, /*页面缩放比例，页面缩放会导致拖动速度与鼠标移动不一致*/
				'start':null,
				'move':null,
				'end':null
			}
			var opts = $.extend(defaults,options);
			dragEvent.target = opts.dragElement;
			opts.target.bind("mousedown", function(e){
				if (e.originalEvent) e = e.originalEvent;e.stopPropagation();
				if(e.type == 'mousedown') {
					dragEvent.flag=true;
					var currentLeft = dragEvent.target.css("left") == 'auto'? 0 : dragEvent.target.css("left"),
						currentTop = dragEvent.target.css("top") == 'auto'? 0 : dragEvent.target.css("top");
					dragEvent.currentX = e.pageX/opts.scaling - parseInt(currentLeft);
					dragEvent.currentY = e.pageY/opts.scaling - parseInt(currentTop);
					opts.dragElement.stop(true,false).fadeTo(20,0.9);//点击后开始拖动并透明

					if(opts.start){						
						opts.start(e);
					}
				}
			});
			$(document).mousemove(function(e){
				if (e.originalEvent) e = e.originalEvent;e.preventDefault();
				if(!dragEvent.flag) return;
				
				if(opts.moveable){/* 默认移动方法 */
					var endX = e.pageX/opts.scaling-dragEvent.currentX,
						endY = e.pageY/opts.scaling-dragEvent.currentY;
					dragEvent.target.css({top:endY,left:endX});
				}
				if(opts.move){ /* 调用自定义move事件 */
					opts.move(e,dragEvent);
				}
				
			}).mouseup(function(e){
				dragEvent.flag=false;s
				dragEvent.target.stop(true,false).fadeTo("fast",1);//松开鼠标后停止移动并恢复成不透明
				if(opts.end){						
					opts.end(e,dragEvent);
				}
			});
		})	
		
		
	}
})(jQuery);