<template>
  <div id="app" ref="barrage_wrap" style="height:100%;">
    <div class="logo"></div>
    <!-- <keep-alive> -->
    	<router-view></router-view>
    <!-- </keep-alive> -->
    <div class="logo-foot"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  created:function(){
  	var _this = this;
  	this.$nextTick(function(){
  		_this.send = _this.$start(_this.$refs.barrage_wrap);
	  	_this.soket_init();
  	})
  	
  },
  methods:{
  	soket_init:function(){
  		var _this = this;
  		var ws = new WebSocket(this.$util.ROOT_CONFIG.socket_domain+'/barrage'); 
		ws.onopen = function() { 
		    console.log('打开socke链接：');
		}

		function replate_msg(str){
		  return str.replace(/\[\/handclap\]/g,'<span class="barrager-emo"><img src="'+_this.$util.ROOT_CONFIG.domain+'/web/images/ico-emo-1.png"></span>')
		            .replace(/\[\/thumbsup\]/g,'<span class="barrager-emo"><img src="'+_this.$util.ROOT_CONFIG.domain+'/web/images/ico-emo-2.png"></span>')
		            .replace(/\[\/crown\]/g,'<span class="barrager-emo"><img src="'+_this.$util.ROOT_CONFIG.domain+'/web/images/ico-emo-3.png"></span>')
		            .replace(/\[\/flower\]/g,'<span class="barrager-emo"><img src="'+_this.$util.ROOT_CONFIG.domain+'/web/images/ico-emo-4.png"></span>')
		}
		ws.onmessage = function(evt) { 
		    var item={
		        text: replate_msg(evt.data), //文字 
		        speed: 3, //延迟,单位秒,默认8
		    	color:'#fff', //颜色,默认白色 
	  			classname: 'barrage-item'
		    }
		   	_this.send(item);
		}

		ws.onclose = function(evt) {  
		    console.log("WebSocketClosed!");
		    // console("close");
		}

		ws.onerror = function(evt) {  
		    console.log("WebSocketError!");
		}
  	}
  }
}
</script>

<style lang="scss" scope>
.barrage-item{
	background: rgba(20,45,84,.6);
	border: 1px solid rgba(30,231,211,.2);
	border-radius: 5vh!important;
	height: 5.2vh;
	line-height: 5vh;
	padding: 0 20px;
	font-size: 2.4vh;
}
.barrager-emo{
	height: 4vh;
	line-height: 4vh;
	display:inline-block;
	position: relative;
	margin-right: 10px;
	width: 6.5vh;
	vertical-align:middle;
	img{
		position: absolute;
		bottom:1vh;
		left: 0;
		width: 100%;
	}
}
</style>
