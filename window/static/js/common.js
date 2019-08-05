(function(){
	function Navigate(opt){
		var _this = this;
		setTimeout(function(){
			if(!opt){
				throw new Error("参数不能为空");
			}
			var box = document.querySelector(opt.container);
			if(!box){
				throw new Error(opt.container+"容器不存在");
			}
			_this.list = opt.list;
			_this.currentPosition = opt.currentPosition
			_this.box = box;
			var bgImg = new Image();
			bgImg.onload = function(){
				_this.init(bgImg, box);
				_this.bg = bgImg;
				if(_this.afterBgLoaded && (_this.afterBgLoaded instanceof Function)){
					_this.afterBgLoaded();
				}
			}
			bgImg.src = opt.bg;
		})
		
	}
	Navigate.prototype.init = function(bgImg, box){
		box.appendChild(bgImg);
		var iw = bgImg.offsetWidth,ih = bgImg.offsetHeight,w,h;
		if(iw/ih > box.offsetWidth/box.offsetHeight){
			w = iw>box.offsetWidth?box.offsetWidth:iw;
			h = w * ih/iw;
			bgImg.style.width = w +'px';
			bgImg.style.height = h +"px";
			this.scale = w/iw;
		}else{
			h = iw>box.offsetHeight?box.offsetHeight:ih;
			w = h * iw/ih
			bgImg.style.height = h +'px';
			bgImg.style.width = w+"px";
			this.scale = h/ih;
		}
		box.style.width=w+'px';
		box.style.height=h+'px';

		window.onresize = function(){
			var pw = $(box).parent().width();
			var ph = $(box).parent().height();
			var scale = pw/$(box).width();
			$(box).css({'transform':'translate(-50%,-50%) scale('+scale+')','transform-origin':'center center'})
			
		}
		
	}
	
	
	Navigate.prototype.showCurrent = function(){
		var _this = this;
		if(!_this.bg){
			_this.afterBgLoaded = function(){
				var curP = document.getElementById('currentPoint')
				curP.style.display = "block";
				curP.style.left = _this.currentPosition.left*_this.scale+"px";
				curP.style.top = _this.currentPosition.top*_this.scale+"px";
				curP.style.width = 70 * _this.scale+'px';
				curP.style.height = 70 * _this.scale+'px';
			};
		}else{
			var curP = document.getElementById('currentPoint')
			curP.style.display = "block";
			curP.style.left = _this.currentPosition.left*_this.scale+"px";
			curP.style.top = _this.currentPosition.top*_this.scale+"px";
		}
		
	}
	Navigate.prototype.show = function(id){
		var _this = this;
		var area = _this.list.find(function(item){return item._id == id});
		var showPathItem = function(imgItem){
			var pathDom = document.querySelector("#path_img_"+imgItem.id)
			if(!pathDom){
				var pathImg = new Image();
				pathImg.onload = function(){
					this.style.width = imgItem.width*_this.scale+'px';
					this.style.height = imgItem.height*_this.scale+'px';
					this.style.top = imgItem.top*_this.scale+"px";
					this.style.left = imgItem.left*_this.scale+"px";
					this.classList.add('path_img');
					_this.box.appendChild(pathImg);
				}
				pathImg.src=imgItem.image;
			}
		}
		var showPath = function(){
			$('.path_img').hide();
			setTimeout(function(){
				_this.showCurrent();
				area.area_list.map(function(item){
					showPathItem(item);
				})
			},100)
		}
		if(area){
			if(!_this.bg){
				_this.afterBgLoaded = showPath;
			}else{
				showPath()
			}
			
		}
	}
	window.Navigate = Navigate;
})()




// 定义一个控件类，即function    
function ZoomControl(){    
    // 设置默认停靠位置和偏移量  
    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;    
    this.defaultOffset = new BMap.Size(10, 10);    
}    
// 通过JavaScript的prototype属性继承于BMap.Control   
ZoomControl.prototype = new BMap.Control();

// 自定义控件必须实现initialize方法，并且将控件的DOM元素返回   
// 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中   
ZoomControl.prototype.initialize = function(map){    
    // 创建一个DOM元素   
    var div = document.createElement("div");    
    // 添加文字说明    
    div.appendChild(document.createTextNode("回到中心"));    
    div.classList.add('map-back-center');
    // 绑定事件，点击一次放大两级    
    div.onclick = function(e){  
        map.panTo(new BMap.Point(114.158951,30.486044));    
    }    
    // 添加DOM元素到地图中   
    map.getContainer().appendChild(div);    
    // 将DOM元素返回  
    return div;    
 }

function init_map(opt){
	map = new BMap.Map(opt.container); // 创建地图实例 
	if(opt.markers.length){
		var point = new BMap.Point(opt.markers[0].lng,opt.markers[0].lat);  // 创建点坐标 
	}else{
		var point = new BMap.Point(114.158951,30.486044);  // 创建点坐标 
	}
	map.centerAndZoom(point, 14);                 // 初始化地图，设置中心点坐标和地图级别

	map.addControl(new BMap.NavigationControl());    
	map.addControl(new BMap.ScaleControl());    
	map.addControl(new BMap.OverviewMapControl());    

	// map.setCurrentCity("武汉"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用  

	// 创建控件实例    
	var myZoomCtrl = new ZoomControl();    
	// 添加到地图当中    
	map.addControl(myZoomCtrl);


	load_marker(opt.markers);
}


function load_marker(list){
	// var list = [{
	// 	"lon": 111.739425,
	// 	"lat": 30.430509,
	// 	"name": "枝江市供电公司客户服务中心",
	// 	"rank": "4",
	// 	"address": "枝江市迎宾大道153号",
	// 	"tel": "0717-4207742",
	// 	"worktime": "8:30-18：00",
	// 	"service": "人工柜台、自助设备、电子渠道",
	// 	"iscurrent": 0
	// }]
	
	var a = {
		"1":{
			icon: "/static/images/marker-2.png",
			rank: "三型一化A级厅"
		},
		"2":{
			icon: "/static/images/marker-1.png",
			rank: "三型一化B级厅"
		},
		"3":{
			icon: "/static/images/marker-4.png",
			rank: "三型一化C级厅"
		},
		"4":{
			icon: "/static/images/marker-3.png",
			rank: "非三型一化厅"
		}
	}
	
	/*保存当前点*/
	var current = list.find(function(a){return a.iscurrent});
	var currentPoint = current?new BMap.Point(current.lng,current.lat):null;
	list.map(function(item){
		add_marker(item);
	});

	function add_marker(item){
		var rank = a[item.rank];
		var pageScale = $(window).width()>600?$(window).width()/1920:600/1920;
		var myIcon = new BMap.Icon(rank.icon, new BMap.Size(40*pageScale, 57*pageScale), {
	        anchor: new BMap.Size(20*pageScale, 57*pageScale)/*下尖角距离图片左上角坐标*/
	    });
	    var myPoint = new BMap.Point(item.lng,item.lat);
		var marker = new BMap.Marker(myPoint,{icon: myIcon});//创建标注
		//计算距离
		var distance = '';
		if(currentPoint && item.iscurrent){
			distance = "当前营业厅";
			rank.rank += "（本厅）"
		}else{
			distance = "距离当前位置"+parseFloat(map.getDistance(currentPoint,myPoint)/1000).toFixed(1)+"公里";
		}
		var content = ` <div class="map-info-window">
							<div class="left">
								<div class="img"><img src="/static/images/demo-1.jpg"></div>
								<p>${distance}</p>
							</div>
							<div class="det">
								<table>
									<tr>
										<td width="80">网点类型：</td><td>${rank.rank}</td>
									</tr>
									<tr>
										<td width="80">网点地址：</td><td>${item.address.town+item.address.address}</td>
									</tr>
									<tr>
										<td>联系电话：</td><td>${item.tel}</td>
									</tr>
									<tr>
										<td>营业时间：</td><td>${item.worktime}</td>
									</tr>
								</table>
							</div>
						</div>`;
		map.addOverlay(marker);
		addClickHander(item.name,content, marker);
	}


	function addClickHander(title,content,marker){  
        marker.addEventListener("touchstart",function(e){  
        openInfo(title," "+content,e)});  
        marker.addEventListener("click",function(e){  
        openInfo(title," "+content,e)});  
    }  
    //++  
    var opts = {  
        width : 560,     // 信息窗口宽度  
        height: 150,     // 信息窗口高度  
        title : "" , // 信息窗口标题  
        enableMessage:true//设置允许信息窗发送短息  
	}; 
    function openInfo(title,content,e){  
        var p = e.target;  
        opts.title = title;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);  
        var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象   
        map.openInfoWindow(infoWindow,point);                //开启信息窗口  
    }  
}

