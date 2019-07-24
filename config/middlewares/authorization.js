'use strict';

exports.requiresLogin = function(req, res, next){
	if(req.session.user) return next();
	if (req.method == 'GET') req.session.returnTo = req.originalUrl;
	res.redirect('/login');
	
}

exports.admin = {
	requiresLogin: function(req, res, next){
		if(req.session.user) return next();
		if (req.method == 'GET') req.session.returnTo = req.originalUrl;
		res.redirect('/admin/login');
	},
	adminAuth: function(req, res, next){
		if(req.session.user.role<100){
			return res.redirect('/admin/nopower');
		}
		next()
	}
}