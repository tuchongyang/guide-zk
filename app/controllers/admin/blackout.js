const mongoose = require('mongoose');
const { wrap: async } = require('co');
var fs = require('fs')
var path = require("path")
var multiparty = require('multiparty');
const User = mongoose.model('User');
const Image = mongoose.model("Image");
const Blackout = mongoose.model("Blackout");
const OffArea = mongoose.model("OffArea");
const _ = require('underscore');
const moment = require('moment');

const { respond, respondOrRedirect } = require('../../utils');
const config = require('../../../config')


exports.list = async(function* (req, res){
	const page = (req.query.page > 0 ? req.query.page : 1) - 1;
	const limit = parseInt(req.query.page_size) || 20;

	const options = {
		limit: limit,
		page: page
	};
	const list = yield Blackout.list(options);
	const count = yield Blackout.count();
	respond(res, 'admin/blackout/blackout_list',{
		title: "停电信息",
	    list: list,
	    page: page + 1,
	    pages: Math.ceil(count / limit),
        count: count,
        query:'page_size='+limit
	})
})
exports.new = async(function* (req, res){
	respond(res, 'admin/blackout/blackout_detail',{
		title: "新增停电信息",
		data:{}
	})
})

function saveOffarea(data){
	var _offArea;
	OffArea.findOne({town_name:data.area_town}).exec(function(err, offArea){
		if(!offArea){
			_offArea = new OffArea({
				"town_name": data.area_town,
				"town_village": data.area_village,
				"change_name": data.change_name
			})
			_offArea.save();
		}else{
			_offArea = {
				"town_name": data.area_town,
				"town_village": data.area_village,
				"change_name": data.change_name
			}
			offAreaObj = _.extend(offArea, _offArea);
			offAreaObj.save();
		}
	});
}

exports.save = async(function* (req, res){
	var userObj = req.body.data;
	if(userObj.area_village){
		userObj.area_village = userObj.area_village.split(',');
	}
	if(userObj.change_name){
		userObj.change_name = userObj.change_name.split(',');
	}
	var _user = new Blackout(userObj)
	saveOffarea(userObj);
	if(userObj._id){/*保存操作*/
        let user = yield Blackout.findOneAndUpdate({_id:userObj._id},userObj)
     
        respondOrRedirect({ req, res }, `/admin/blackout/list`, {}, {
            type: 'success',
            text: '保存成功!'
        });
	}else{/*新增操作*/
		try{
            yield _user.save();
            respondOrRedirect({ req, res }, `/admin/blackout/list`, {}, {
                type: 'success',
                text: '保存成功!'
            });
			
		}catch(err){
			const errors = Object.keys(err.errors).map(field => err.errors[field].message);
			respondOrRedirect({ req, res }, `/admin/blackout/new`, {}, {
				type: 'error',
				text: errors.toString()
			});			
		}
	
	}
})
exports.detail = async(function* (req, res){
	try{
		var data = yield Blackout.load(req.params.id);
		data.area_village = data.area_village.join(',');
		data.change_name = data.change_name.join(',');
		respond(res, 'admin/blackout/blackout_detail',{
			title: "停电信息",
		    data: data || {}
		})
	}catch(err){
		const errors = Object.keys(err.errors).map(field => err.errors[field].message);
		respondOrRedirect({ req, res }, `/admin/blackout/list`, {title: "停电信息",movie:{}}, {
			type: 'error',
			text: errors.toString()
		});
	}
})
exports.delete = async(function* (req, res){
    const id=req.params.id;
    try{
        var user = yield Blackout.findOne({_id:id}).exec()
        yield user.remove();
        var data={"success":true,"msg":"删除成功"}
        res.json(data);
    }catch(err){
        var data={"success":false,"msg":"删除失败"}
        res.json(data);
    }
})

exports.getOffareas = async(function* (req, res){
	const list = yield OffArea.list({});
	res.json({
		success: true,
		list: list
	})
})

exports.blackout_list = async(function* (req, res){
	const page = (req.query.page_no > 0 ? req.query.page_no : 1) - 1;
	const limit = parseInt(req.query.page_size) || 20;

	const options = {
		limit: limit,
		page: page
	};
	let list = yield Blackout.list(options);
	const count = yield Blackout.count();
	// list = list.map(function(item){
	// 		item.start_time = moment(item.start_time).format('YYYY-MM-DD hh:mm:ss');
	// 		item.end_time = moment(item.end_time).format('YYYY-MM-DD hh:mm:ss');
	// 		console.log(item)
	// 		return item;
	// 	})
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