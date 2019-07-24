$(function(){
	$(document).on('click','.modal-tab-item',function(e){
		$(this).addClass('active').siblings().removeClass('active');
		var index = $(this).parent().find('.modal-tab-item').index($(this));
		$(this).parent().next('.modal-tab-con').find('.modal-tab-panel').eq(index).addClass('active').siblings().removeClass('active');
	})
});
(function($){
    var loading = {};
    var defaults = {
        text: "",
    }
    var timer;
    loading.show = function(opt){
        var opts = $.extend(true,{},defaults, opt);
        var temp = $('<div class="loading back-cover" id="loading"><div class="inner"><img class="loading-img" src="/static/pc/images/loading.png"><span class="text"></span></div></div>');
        if($('#loading').length > 0){
            temp = $('#loading');
        }else{
            $('body').append(temp);
        }

        window.clearTimeout(timer);

        if(opts.text){
            temp.find('.text').html(opts.text);
        }
        if(opts.template){
            temp.find('.inner').html(opts.template);
        }
        if(opts.noCover){
            temp.removeClass('back-cover');
        }
        if(opts.duration){
            timer = setTimeout(function(){
                loading.hide();
            },parseInt(opts.duration));
        }


    }
    loading.hide = function(){
        $('#loading').remove();
    }

    $.extend({
        loading: loading
    });
})(jQuery);

(function ($) {
	
	$.extend({
		imageService:function(option){
			var defaults = {
				max: 1,
		        select: undefined
		    };
		    var selectImgs = [],
		        imgs = {user:[],system:[]};
		    

		    var api = {
		        
		        init:function(opt){
		        	selectImgs = [];imgs = {user:[],system:[]};
		        	var opts = $.extend(defaults, opt);
		            model.show(opts);
		            
		        }
		    };
		    var model = {
		    	temp: $('<div class="popupwindow" id="picPopup">\
                            <div class="modal">\
                                <div class="modal-header">\
                                    <a class="close icon-popclose closeBtn"></a><h3 class="modal-title">选择图片</h3>\
                                </div>\
                                <div class="modal-body">\
                                    <div class="modal-tab">\
                                        <div class="modal-tab-item active" >我的图片</div>\
                                        <div class="modal-tab-item" style="display:none;">系统图库</div>\
                                    </div>\
                                    <div class="modal-tab-con">\
                                        <div class="modal-tab-panel active">\
                                            <div class="modal-inner">\
                                                <ul class="pic-list" id="picList" title="用户图库">\
                                                    <li class="item active" style=""></li>\
                                                </ul>\
                                            </div>\
                                        </div>\
										<div class="modal-tab-panel">\
											<ul class="modal-submenu" id="sysImgmenu">\
												<li>asd</li>\
											</ul>\
											<div class="modal-inner">\
												<ul class="pic-list" id="picSysList" title="系统图库">\
												</ul>\
											</div>\
											<div class="pagination" id="pagination">\
												<div class="pages"></div>\
												<div class="info"></div>\
											</div>\
										</div>\
                                    </div>\
                                    <div class="modal-btnarea clearfix">\
                                        <a class="btn btn-warning btnConfirm">确认</a>\
                                        <a class="btn btn-default btnCancel">取消</a>\
                                    </div>\
                                </div>\
                            </div>\
		                </div>'),
		        'show':function(opts){
		            $('body').append(model.temp).append('<div class="popupwindow-cover" id="popupwindowCover"></div>');
		            model.temp.css({top:$(window).height()/2 - model.temp.height()/2+"px",left:$(window).width()/2 - model.temp.width()/2+"px"}).addClass("active")
		            //绑定确认按钮
		            model.temp.off('click').on('click','.btnConfirm',function(){
		                if(selectImgs.length <= 0) return;
		                opts.select && opts.select(selectImgs);
		                model.remove();
		            });
		            //绑定取消按钮
		            model.temp.find(".btnCancel").on('click',model.remove);
		            //绑定关闭按钮
		            model.temp.find(".closeBtn").on('click',model.remove);
		            //拖拽
		            model.temp.dragable();
		            model.temp.find(".modal-body").on('mousedown',function(e){e.stopPropagation();});           

		            model.bindData(opts);
		        },
		        bindData:function(opts){
		            /**********    user     ************/
		            $("#picList").on('click','.item:not(.upload-item)',function(event){
		            	var _this = this;
		            	if(selectImgs.length >= opts.max && !$(this).hasClass('active')){
		            		return;
		            	}
		            	if($(this).hasClass('active')){
		            		$(this).removeClass('active');
		            		selectImgs.forEach(function(item,i,a){
		            			if(item.id == $(_this).data('id')){
		            				a.splice(i,1);
		            			}
		            		});
		            	}else{
		            		$(this).addClass("active");
		            		selectImgs.push(imgs[$(this).attr("data-type")][$(this).attr("data-index")]);
		            	}
		                
		            })
		            $("#picList").parent().on('scroll',function(e){
		                if($(this).scrollTop()>=$(this)[0].scrollHeight-$(this).height()){
		                    userImg.getData();
		                }
		            })
		            $("#picList").empty().append('<li class="item upload-item" style=""><input type="file" name="file" multiple  accept="image/jpg,image/jpeg,image/png,image/gif"></li>');
		            var userImg = {
		                page:0,
		                moredata:true,
		                getData:function(){
		                    if(!userImg.moredata) return;
		                    userImg.page++;
		                    $.ajax({
		                    	url:'/api/account/image/list?page='+userImg.page,
		                    	method:'get',
		                    	success:function(data){
		                    		if(data.length < 20){
		                            userImg.moredata = false;
		                        }else{
		                            userImg.moredata = true;
		                        }         
		                        var len = imgs.user.length;
		                        for(i=0;i<data.length;i++){
		                            imgs.user.push(data[i]);
		                            $("#picList").append('<li class="item" data-type="user" data-id="'+data[i].id+'" data-index="'+(i+len)+'" style="background-image:url('+data[i].file+')"></li>');
		                        }
		                    	},
		                    	error:function(data){
		                    		console.log(data);
		                    	}
		                    });
		                }
		            }
		            userImg.getData();
		            //upload
		            $("#picList").on('change','.upload-item input[type="file"]',function(event){
		            	var _this = this;
		            	var addData = function(file){
		            		var formData = new FormData();
		            		formData.append('file',file);
		            		$.loading.show();
		            		$.ajax({
		            			url: '/api/upload',
								method: 'post',
								contentType : false,
								processData: false,
								data: formData,
								success: function(res){
									var data = res.obj
									imgs.user.push(data);
				            		_this.value = "";
				                    $("#picList .upload-item").after('<li class="item" data-type="user" data-id="'+data.id+'" data-index="'+(imgs.user.length-1)+'" style="background-image:url('+data.file+')"></li>');
				                
								},
								complete:function(){
									$.loading.hide();
								}
		            		})
		            		
		            	}
		            	for(var i=0;i<_this.files.length;i++){
		            		addData(_this.files[i]);
		            	}
		       
		            	
		            }).on('click','.upload-item input[type="file"]',function(event){
		            	this.value = null;
		            })
		            


		        },
		        'remove':function(){
		            model.temp.remove();$("#popupwindowCover").remove();
		            //api.destroy();
		        }
		    }

		    api.init(option);
		}
	});
	

})(jQuery);