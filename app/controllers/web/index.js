
const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond, respondOrRedirect } = require('../../utils');


const Office = mongoose.model("Office");
const Guide = mongoose.model("Guide");

exports.index = async(function* (req, res) {
	const offices = yield Office.list({});

	respond(res, 'web/index',{
		title: "首页",
		offices: offices
	})
})

exports.office_detail = async(function* (req, res){
	
	const offices = yield Office.list({});
	const guides = yield Guide.list({criteria:{office: req.params.office_id}});
	const office = offices.find(function(item){return item._id == req.params.office_id})
	respond(res, 'web/office',{
		title: "智能供电营业厅",
		office: office,
		offices: offices,
		guides: guides
	})
})
