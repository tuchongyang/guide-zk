const mongoose = require('mongoose');
const { wrap: async } = require('co');
var fs = require('fs')
var path = require("path")
var multiparty = require('multiparty');
const User = mongoose.model('User');
const Image = mongoose.model("Image")


const { respond, respondOrRedirect } = require('../../utils');
const config = require('../../../config')


exports.list = async(function* (req, res){
	const page = (req.query.page > 0 ? req.query.page : 1) - 1;
	const limit = parseInt(req.query.page_size) || 30;

	const options = {
		limit: limit,
		page: page
	};
	const users = yield User.list(options);
	const count = yield User.count();
	respond(res, 'admin/user/user_list',{
		title: "用户列表",
	    list: users,
	    page: page + 1,
	    pages: Math.ceil(count / limit),
        count: count,
        query:'page_size='+limit
	})
})
exports.new = async(function* (req, res){
	respond(res, 'admin/user/user_edit',{
		title: "用户新增",
		data:{}
	})
})
exports.upload = async(function* (req, res, next){
	//生成multiparty对象，并配置上传目标路径
	var uploadDir = config.root+'/public'
    var form = new multiparty.Form({uploadDir: uploadDir+'/upload/',maxFilesSize: config.UPLOAD_FILE_SIZE_LIMIT});

    var removeFile = function(inputFile){
		fs.unlinkSync(inputFile.path,function (err) {
            if (err) throw err;
        });
    }
    form.parse(req, function(err, fields, files) {
    	if(err){
    		return res.status(err.statusCode).json({success:false,msg: err.message})
    	}
    	var inputFile = files.file[0];//获取当前上传的文件对象
    	var types = inputFile.headers['content-type'].split('/');
    	//判断是否是系统支持的文件类型
    	if(!config.UPLOAD_ACCEPT_FILE_TYPES[types[0]]){
    		removeFile(inputFile);
    		return res.json({success:false,msg:"不支持上传此文件类型"})
    	}
    	//生成对应目录，这里按照年月的方式生成目录
    	var date = new Date();
    	var fileDir = '/upload/'+types[0]+'/'+date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+'/'
    	var nowDir = uploadDir+fileDir;
    	var uploadBaseDir = uploadDir+"/upload";
    	if(!fs.existsSync(uploadBaseDir)){
    		fs.mkdirSync(uploadBaseDir);
    	}
    	if(!fs.existsSync(uploadBaseDir+'/'+types[0]+'/')){
    		fs.mkdirSync(uploadBaseDir+'/'+types[0]+'/');
    	}
    	if(!fs.existsSync(uploadBaseDir+'/'+types[0]+'/'+date.getFullYear()+'/')){
    		fs.mkdirSync(uploadBaseDir+'/'+types[0]+'/'+date.getFullYear()+'/');
    	}
    	if(!fs.existsSync(uploadBaseDir+'/'+types[0]+'/'+date.getFullYear()+'/'+(date.getMonth()+1)+'/')){
    		fs.mkdirSync(uploadBaseDir+'/'+types[0]+'/'+date.getFullYear()+'/'+(date.getMonth()+1)+'/');
    	}
    	if(!fs.existsSync(uploadBaseDir+'/'+types[0]+'/'+date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+'/')){
    		fs.mkdirSync(uploadBaseDir+'/'+types[0]+'/'+date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+'/');
    	}
    	
    	//重命名为真实文件名
    	var filePath = Math.round((new Date().valueOf() * Math.random())) + '.'+inputFile.path.split(".").pop();
    	var dstPath = nowDir + filePath;
		fs.rename(inputFile.path, dstPath, async(function* (err) {
			if(err){
				console.log('rename error: ' + err);
				res.json({success:false,msg:err})
			} else {
				var img = {
					name: inputFile.originalFilename.split('.').shift(),
					format: inputFile.originalFilename.split('.').pop().toLowerCase(),
					file: fileDir+filePath,
					size: inputFile.size
				}
				if(req.session.user){
					img.creator = req.session.user._id
				}
				var _image = new Image(img);
				const image = yield _image.save();
				res.json({success:true,msg:"上传成功",obj: image})
			}
		}));
    	// console.log(inputFile.headers)
    	
        // return res.json({success:false,msg:err})
    	
    	

    	// res.redirect("/admin/user/new")
    });
})

exports.save = async(function* (req, res){
	var userObj = req.body.data;
	var _user = new User(userObj)
	if(userObj._id){/*保存操作*/
        let user = yield User.findOneAndUpdate({_id:userObj._id},userObj)
        //保存时如果是修改的当前登录管理员，更新缓存
        if(req.session && req.session.user && req.session.user._id == userObj._id){
        	req.session.user = user;
        }
        respondOrRedirect({ req, res }, `/admin/user/list`, {}, {
            type: 'success',
            text: '保存成功!'
        });
	}else{/*新增操作*/
		try{
            yield _user.save();
            respondOrRedirect({ req, res }, `/admin/user/list`, {}, {
                type: 'success',
                text: '保存成功!'
            });
			
		}catch(err){
			const errors = Object.keys(err.errors).map(field => err.errors[field].message);
			respondOrRedirect({ req, res }, `/admin/user/new`, {}, {
				type: 'error',
				text: errors.toString()
			});			
		}
	
	}
})
exports.detail = async(function* (req, res){
	try{
		var user = yield User.load({criteria:{_id:req.params.id}});
		respond(res, 'admin/user/user_edit',{
			title: "用户详情",
		    data: user || {}
		})
	}catch(err){
		const errors = Object.keys(err.errors).map(field => err.errors[field].message);
		respondOrRedirect({ req, res }, `/admin/user/list`, {title: "用户列表",movie:{}}, {
			type: 'error',
			text: errors.toString()
		});
	}
})
exports.delete = async(function* (req, res){
    const id=req.params.id;
    try{
        var user = yield User.findOne({_id:id}).exec()
        yield user.remove();
        var data={"success":true,"msg":"删除成功"}
        res.json(data);
    }catch(err){
        var data={"success":false,"msg":"删除失败"}
        res.json(data);
    }
})



exports.loginView = function (req, res) {
	res.render('admin/login',{
		title: "登录"
	})
}
exports.login = async(function* (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	if(!username){
		respondOrRedirect({ req, res }, `/admin/login`, {}, {
            type: 'error',
            text: '用户名或邮箱不能为空!'
        });return;
	}
	if(!password){
		respondOrRedirect({ req, res }, `/admin/login`, {}, {
            type: 'error',
            text: '密码不能为空!'
        });return;
	}
	var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	var criteria = {};
	if(emailReg.test(username)){
		criteria.email = username
	}else{
		criteria.username = username
	}

	try{
        var user = yield User.load({criteria:criteria});
        if(!user){
 			respondOrRedirect({ req, res }, `/admin/login`, {}, {
	            type: 'error',
	            text: '用户不存在!'
	        });
        }else if(!user.authenticate(password)){
        	respondOrRedirect({ req, res }, `/admin/login`, {}, {
	            type: 'error',
	            text: '密码错误!'
	        });
        }else{
        	const redirectTo = req.session.returnTo
			    ? req.session.returnTo
			    : '/';
			delete req.session.returnTo;
        	req.session.user = user
        	respondOrRedirect({ req, res }, redirectTo, {}, {
	            type: 'success',
	            text: '登录成功!'
	        });
        }
       
		
	}catch(err){
		const errors = Object.keys(err.errors).map(field => err.errors[field].message);

		respondOrRedirect({ req, res }, `/admin/login`, {}, {
			type: 'error',
			text: errors.toString()
		});			
	}
	
})
exports.logout = function(req, res){
	delete req.session.user;
	respondOrRedirect({ req, res }, `/`, {});
}