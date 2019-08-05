<template>
    <div class="draw-container">
    	<canvas id="draw_canvas"></canvas>
    	<a class="btn btn-confirm" @click="save">确认</a>
		<a class="btn btn-cancel" @click="clear">重写</a>
    </div>
</template>

<script type="text/ecmascript-6">
var draw;
var preHandler = function(e){if (e.cancelable) {if (!e.defaultPrevented) {e.preventDefault();}}}
function Draw(el) {
    
        this.el = el
        this.canvas = document.getElementById(this.el)
        this.cxt = this.canvas.getContext('2d')
        this.stage_info = this.canvas.getBoundingClientRect()
        this.path = {
            beginX: 0,
            beginY: 0,
            endX: 0,
            endY: 0
        }
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

}
Draw.prototype.init = function(btn) {
        var that = this; 
        
        var isSupportTouch = 'ontouchstart' in window ? true : false;
        that.touchEvent = {};
            that.touchEvent.start= isSupportTouch?'touchstart':'mousedown';
            that.touchEvent.move= isSupportTouch?'touchmove':'mousemove';
            that.touchEvent.end= isSupportTouch?'touchend':'mouseup';
        this.canvas.addEventListener(that.touchEvent.start, function(event) {
            document.addEventListener(that.touchEvent.start, preHandler, false); 
            that.drawBegin(event)
        })
        this.canvas.addEventListener(that.touchEvent.end, function(event) { 
            document.addEventListener(that.touchEvent.end, preHandler, false); 
            that.drawEnd()
            
        })
        this.clear(btn)
    }
Draw.prototype.drawBegin = function(e) {
        var that = this;
        var touch = e;
        if(e.changedTouches){
            touch = e.changedTouches[0];
        }
        window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
        this.cxt.strokeStyle = "#000"
        this.cxt.lineWidth= 8;
        this.cxt.beginPath()
        this.cxt.moveTo(
            touch.clientX - this.stage_info.left,
            touch.clientY - this.stage_info.top
        )
        this.path.beginX = touch.clientX - this.stage_info.left
        this.path.beginY = touch.clientY - this.stage_info.top
        this.stop = false;
        document.addEventListener(that.touchEvent.move,function(event){
            that.drawing(event)
        })
    }
Draw.prototype.drawing = function(e) {
        var touch = e;
        if(e.changedTouches){
            touch = e.changedTouches[0];
        }
        if(this.stop) return;
        this.cxt.lineTo(
            touch.clientX - this.stage_info.left,
            touch.clientY - this.stage_info.top
        )
        this.path.endX = touch.clientX - this.stage_info.left
        this.path.endY = touch.clientY - this.stage_info.top
        this.cxt.stroke()
    }
Draw.prototype.drawEnd = function() {
        document.removeEventListener(this.touchEvent.start, preHandler, false); 
        document.removeEventListener(this.touchEvent.end, preHandler, false);
        document.removeEventListener(this.touchEvent.move, preHandler, false);
        this.stop = true;
    }
Draw.prototype.clear = function(btn) {
        this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    Draw.prototype.save = function(){
       return this.canvas.toDataURL("image/png")
    }


export default {
  data :function() {
    return {
      val:true,
      url:""
    }
  },
  mounted:function() {
  	setTimeout(function(){//签名在弹出时有个3s的动画
  		draw = new Draw('draw_canvas');
    	draw.init();
  	},300);
		
  },
  methods:{
    clear:function(){
        draw.clear();
    },
    save:function(){
        var data=draw.save();
        this.url = data;
        this.$emit('onSave',data)
    }
  }
}


</script>

<style scoped lang="scss">
.draw-container{
	position: relative;
	canvas{
		width: 100%;
		height: 32vh;
	}
	.btn{
		position: absolute;
		height: 8vh;
		line-height: 8vh;
		width: 20vh;
		text-align: center;
		color: #fff;
		font-size: 4vh;
		right: 10vh;
		border-radius: 8vh;
		z-index: 10;
	}
	.btn-confirm{
		top: 5.5vh;
		background: #20c97f;
	}
	.btn-cancel{
		top: 18vh;
		background: #a6a6a6;
	}
}
</style>
