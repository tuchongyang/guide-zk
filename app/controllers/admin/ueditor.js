const mongoose = require('mongoose');
const { wrap: async } = require('co');
var fs = require('fs')
var path = require("path")
var multiparty = require('multiparty');
const User = mongoose.model('User');
const Image = mongoose.model("Image")


const { respond, respondOrRedirect } = require('../../utils');
const config = require('../../../config')

exports.controller = function(req,res){
	var action = req.query.action;
	if(action=="config"){
		res.json(config.ueditor);
	}

	

}

const upload = async(function* (req, res, next){

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
				res.json({
					"state": "SUCCESS",
				    "url": image.file,
				    "title": image.name,
				    "original": image.file
				})
			}
		}));
    	// console.log(inputFile.headers)
    	
        // return res.json({success:false,msg:err})
    	
    	

    	// res.redirect("/admin/user/new")
    });
})

exports.controller_post = function(req,res,next){
	var action = req.query.action;
	if(action=="upfile"){
		upload(req, res, next)
	}
	
	

}