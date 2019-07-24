const mongoose = require('mongoose');
const { wrap: async } = require('co');
var fs = require('fs')
var path = require("path")
var multiparty = require('multiparty');
const User = mongoose.model('User');
const Image = mongoose.model("Image");
const Faq = mongoose.model("Faq");


const { respond, respondOrRedirect } = require('../../utils');
const config = require('../../../config')


exports.list = async(function* (req, res){
	const page = (req.query.page > 0 ? req.query.page : 1) - 1;
	const limit = parseInt(req.query.page_size) || 20;

	const options = {
		limit: limit,
		page: page
	};
	const list = yield Faq.list(options);
	const count = yield Faq.count();
	respond(res, 'admin/faq/faq_list',{
		title: "用电常识",
	    list: list,
	    page: page + 1,
	    pages: Math.ceil(count / limit),
        count: count,
        query:'page_size='+limit
	})
})
exports.new = async(function* (req, res){
	respond(res, 'admin/faq/faq_detail',{
		title: "新增用电常识",
		data:{}
	})
})

exports.save = async(function* (req, res){
	var userObj = req.body.data;
	var _user = new Faq(userObj)
	if(userObj._id){/*保存操作*/
        let user = yield Faq.findOneAndUpdate({_id:userObj._id},userObj)
     
        respondOrRedirect({ req, res }, `/admin/faq/list`, {}, {
            type: 'success',
            text: '保存成功!'
        });
	}else{/*新增操作*/
		try{
            yield _user.save();
            respondOrRedirect({ req, res }, `/admin/faq/list`, {}, {
                type: 'success',
                text: '保存成功!'
            });
			
		}catch(err){
			const errors = Object.keys(err.errors).map(field => err.errors[field].message);
			respondOrRedirect({ req, res }, `/admin/faq/new`, {}, {
				type: 'error',
				text: errors.toString()
			});			
		}
	
	}
})
exports.detail = async(function* (req, res){
	try{
		var data = yield Faq.load(req.params.id);
		respond(res, 'admin/faq/faq_detail',{
			title: "用电常识",
		    data: data || {}
		})
	}catch(err){
		const errors = Object.keys(err.errors).map(field => err.errors[field].message);
		respondOrRedirect({ req, res }, `/admin/faq/list`, {title: "用电常识",movie:{}}, {
			type: 'error',
			text: errors.toString()
		});
	}
})
exports.delete = async(function* (req, res){
    const id=req.params.id;
    try{
        var user = yield Faq.findOne({_id:id}).exec()
        yield user.remove();
        var data={"success":true,"msg":"删除成功"}
        res.json(data);
    }catch(err){
        var data={"success":false,"msg":"删除失败"}
        res.json(data);
    }
})

exports.faq_list = async(function* (req, res){
	const page = (req.query.page_no > 0 ? req.query.page_no : 1) - 1;
	const limit = parseInt(req.query.page_size) || 20;

	const options = {
		limit: limit,
		page: page
	};
	const list = yield Faq.list(options);
	const count = yield Faq.count();

	res.json({
		success: true,
		list: list,
		map: {
			page_no: page+1,
			page_size: limit,
			total_pages: Math.ceil(count / limit),
			count: count
		}
	})
	
})