const mongoose = require('mongoose');
const { wrap: async } = require('co');
const User = mongoose.model('User');

const { respond, respondOrRedirect } = require('../../utils');


exports.install = async(function* (req, res){
    
    const users = yield User.list({criteria:{role:100}});
    console.log('users',users)
    respond(res, 'admin/install/index',{
        title: "安装",
        users: users
    })
})
exports.install_create = async(function* (req,res){
	var reqData = req.body;
	if(!reqData.username){
		respondOrRedirect({ req, res }, `/install`, {}, {
			type: 'error',
			text: '请输入用户名'
		});return;
	}
	if(!reqData.email){
		respondOrRedirect({ req, res }, `/install`, {}, {
			type: 'error',
			text: '请输入邮箱'
		});return;
	}
	if(!reqData.password){
		respondOrRedirect({ req, res }, `/install`, {}, {
			type: 'error',
			text: '请输入密码'
		});return;
	}
	reqData.role=100;
	reqData.name = reqData.username;
	var _user = new User(reqData);
	try{
        yield _user.save();
        respondOrRedirect({ req, res }, `/install`, {}, {
            type: 'success',
            text: '保存成功!'
        });
		
	}catch(err){
		const errors = Object.keys(err.errors).map(field => err.errors[field].message);
		respondOrRedirect({ req, res }, `/install`, {}, {
			type: 'error',
			text: errors.toString()
		});			
	}
})