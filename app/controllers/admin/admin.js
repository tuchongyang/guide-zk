'use strict';
const mongoose = require('mongoose');
const { wrap: async } = require('co');
const userCtrl = require('./user')
const imageCtrl = require('./image')
const officeCtrl = require('./office')
const faqCtrl = require('./faq')
const blackoutCtrl = require('./blackout')
const ueditorCtrl = require('./ueditor')

const User = mongoose.model('User');
const Image = mongoose.model('Image');
const Office = mongoose.model('Office');
const Faq = mongoose.model('Faq');
const Blackout = mongoose.model('Blackout');

exports.main = async(function* (req, res) {
	let count = {};
	
	count.office = yield Office.count();
	count.faq = yield Faq.count();
	count.blackout = yield Blackout.count();
	count.user = yield User.count();
	count.image = yield Image.count();

	res.render('admin/index',{
		title: "后台首页",
		count: count
	})
})
exports.nopower = function (req, res) {
	res.render('admin/403',{
		title: "没有权限"
	})
}
/*用户*/
exports.user = userCtrl

/*轮播图相关*/
exports.image = imageCtrl

/*营业厅*/
exports.office = officeCtrl

/*用电常识*/
exports.faq = faqCtrl

/*停电信息*/
exports.blackout = blackoutCtrl

exports.ueditor = ueditorCtrl