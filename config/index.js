'use strict';

const path = require('path');

module.exports = {
 	db: process.env.MONGOHQ_URL,
	root: path.join(__dirname, '..'),
	//# 上传文件类型白名单
	UPLOAD_ACCEPT_FILE_TYPES: {
	    'image': ['jpg', 'jpeg', 'png', 'gif'],
	    'video': ['mp4', 'ogv', 'webm', 'mov'],
	    'audio': ['mp3'],
	    'document': ['docx', 'pdf', 'xlsx', 'pptx', 'ppsx', 'txt', 'rar', 'zip']
	},
	//# 上传文件大小限制为 10M
	UPLOAD_FILE_SIZE_LIMIT: 10 * 1024 * 1024,
	ueditor:{
		"imageUrl": process.env.BASE_URL + "/api/ueditor/controller?action=uploadimage",
	    "imagePath": "/upload/",
	    "imageUrlPrefix": process.env.BASE_URL,
	    "imageFieldName": "file",
	    "imageActionName": "upfile",
	    "imageMaxSize": 2048,
	    "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"]
	}
}