const mongoose = require('mongoose');
const { wrap: async } = require('co');
var fs = require('fs')
var path = require("path")
var multiparty = require('multiparty');
const User = mongoose.model('User');
const Image = mongoose.model("Image");
const Office = mongoose.model("Office");
const Guide = mongoose.model("Guide");


const { respond, respondOrRedirect } = require('../../utils');
const config = require('../../../config')


exports.list = async(function* (req, res){
	const page = (req.query.page > 0 ? req.query.page : 1) - 1;
	const limit = parseInt(req.query.page_size) || 20;
	const q = req.query.q || "";
	const rank = req.query.rank || "";

	let options = {
		limit: limit,
		page: page,
		criteria:{ name: new RegExp(q+'.*','i') }
	};
	if(rank) options.criteria.rank = rank;
	const Offices = yield Office.list(options);
	const count = yield Office.count();
	respond(res, 'admin/office/office_list',{
		title: "营业厅网点",
	    list: Offices,
	    q: q,
	    rank: rank,
	    page: page + 1,
	    pages: Math.ceil(count / limit),
        count: count,
        query:'page_size='+limit
	})
})
exports.new = async(function* (req, res){
	respond(res, 'admin/office/office_detail',{
		title: "新增营业厅网点",
		data:{ }
	})
})

exports.save = async(function* (req, res){
	var userObj = req.body.data;
	/* 处理地址 */
	userObj.address = {
		province: userObj.province,
		city: userObj.city,
		area: userObj.area,
		town: userObj.town,
		address: userObj.address_des
	}
	/* 处理背景 */
	userObj.plan = {
		bg: userObj.plan_bg,
		current: {
			left: userObj.plan_current_left,
			top: userObj.plan_current_top
		}
	}
	if(req.session.user){
		userObj.creator = req.session.user._id
	}
	var _user = new Office(userObj);
	if(userObj._id){/*保存操作*/
        let user = yield Office.findOneAndUpdate({_id:userObj._id},userObj)
     
        respondOrRedirect({ req, res }, `/admin/office/list`, {}, {
            type: 'success',
            text: '保存成功!'
        });
	}else{/*新增操作*/
		try{
            yield _user.save();
            respondOrRedirect({ req, res }, `/admin/office/list`, {}, {
                type: 'success',
                text: '保存成功!'
            });
			
		}catch(err){
			const errors = Object.keys(err.errors).map(field => err.errors[field].message);
			respondOrRedirect({ req, res }, `/admin/office/new`, {}, {
				type: 'error',
				text: errors.toString()
			});			
		}
	
	}
})
exports.detail = async(function* (req, res){
	try{
		var office = yield Office.load(req.params.id);
		office.province = office.address.province;
		office.city = office.address.city;
		office.area = office.address.area;
		office.town = office.address.town;
		office.address_des = office.address.address;

		office.plan_bg = office.plan.bg;
		office.plan_current_top = office.plan.current.top;
		office.plan_current_left = office.plan.current.left;

		respond(res, 'admin/office/office_detail',{
			title: "营业厅详情",
		    data: office || {}
		})
	}catch(err){
		const errors = Object.keys(err.errors).map(field => err.errors[field].message);
		respondOrRedirect({ req, res }, `/admin/office/list`, {title: "营业厅网点",movie:{}}, {
			type: 'error',
			text: errors.toString()
		});
	}
})
exports.delete = async(function* (req, res){
    const id=req.params.id;
    try{
        var user = yield Office.findOne({_id:id}).exec()
        yield user.remove();
        var data={"success":true,"msg":"删除成功"}
        res.json(data);
    }catch(err){
        var data={"success":false,"msg":"删除失败"}
        res.json(data);
    }
})

exports.guide = async(function* (req, res){
	try{
		var office = yield Office.load(req.params.id);

		office.plan_bg = office.plan.bg;
		office.plan_current_top = office.plan.current.top;
		office.plan_current_left = office.plan.current.left;


		respond(res, 'admin/office/guide',{
			title: "营业厅导览图",
		    data: office || {}
		})
	}catch(err){
		const errors = Object.keys(err.errors).map(field => err.errors[field].message);
		respondOrRedirect({ req, res }, `/admin/office/list`, {title: "营业厅网点",movie:{}}, {
			type: 'error',
			text: errors.toString()
		});
	}
})
exports.office_list = async(function* (req, res){
	var offices = yield Office.list({});
	
	res.json({success:true,list:offices});
})
exports.guide_list = async(function* (req, res){
	var guides = yield Guide.list({criteria:{office: req.query.office}});

	res.json({success:true,list:guides});
})

exports.guide_save = async(function* (req, res){
	var dataObj = req.body;
	var _data = new Guide(dataObj);
	if(dataObj._id){/*保存操作*/
        let user = yield Guide.findOneAndUpdate({_id:dataObj._id},dataObj)
     
        res.json({
        	success: true,
        	msg: "保存成功"
        })
	}else{/*新增操作*/
		try{
            yield _data.save();
            res.json({
	        	success: true,
	        	msg: "保存成功"
	        })
			
		}catch(err){
			const errors = Object.keys(err.errors).map(field => err.errors[field].message);
			res.json({success: false,msg:errors.toString()})		
		}
	
	}
})
exports.guide_delete = async(function* (req, res){
    const id=req.params.id;
    try{
        var guide = yield Guide.findOne({_id:id}).exec()
        yield guide.remove();
        var data={"success":true,"msg":"删除成功"}
        res.json(data);
    }catch(err){
        var data={"success":false,"msg":"删除失败"}
        res.json(data);
    }
})
