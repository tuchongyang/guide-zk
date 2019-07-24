
const Index = require('../app/controllers/web/index')
const auth = require('./middlewares/authorization');

const Admin = require('../app/controllers/admin/admin')
const Install = require('../app/controllers/admin/install')

module.exports = function (app, passport) {
	const pauth = passport.authenticate.bind(passport);

	app.use(function(req, res, next){
		res.locals.user = req.session.user;
		next();
	});


	//web

	app.get('/', Index.index);
	app.get('/o/:office_id', Index.office_detail);

	app.get('/install',Install.install);
	app.post('/install/create',Install.install_create);

	//admin
	app.get('/admin',auth.admin.requiresLogin, auth.admin.adminAuth,Admin.main)

	//admin login
	app.get('/admin/login', Admin.user.loginView)
	app.post('/admin/login', Admin.user.login)
	app.get('/logout', Admin.user.logout)

	//admin user
	app.get('/admin/user/list',auth.admin.requiresLogin, auth.admin.adminAuth,Admin.user.list)
	app.post('/admin/user/save',auth.admin.requiresLogin, auth.admin.adminAuth,Admin.user.save)
	app.get('/admin/user/detail/:id',auth.admin.requiresLogin, auth.admin.adminAuth,auth.admin.requiresLogin, auth.admin.adminAuth, Admin.user.detail)
	app.get('/admin/user_new',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.user.new)
	app.delete('/admin/user/:id',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.user.delete)
	app.get('/api/account/image/list', auth.admin.requiresLogin, Admin.image.account_list)

	//admin image
	app.get('/admin/image/list',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.image.list)
	app.post('/admin/image/update',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.image.save)
	app.delete('/admin/image/:id',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.image.delete)


	app.post('/api/upload',Admin.user.upload)
	app.get('/api/ueditor/controller',Admin.ueditor.controller)
	app.post('/api/ueditor/controller',Admin.ueditor.controller_post)
	

	app.get('/admin/nopower', Admin.nopower)

	//admin 营业网点
	app.get('/admin/office/list', auth.admin.requiresLogin, auth.admin.adminAuth, Admin.office.list)
	app.post('/admin/office/save',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.office.save)
	app.get('/admin/office/detail/:id',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.office.detail)
	app.get('/admin/office/new',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.office.new)
	app.delete('/admin/office/:id', auth.admin.requiresLogin, auth.admin.adminAuth, Admin.office.delete)
	app.get('/admin/office/guide/:id',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.office.guide)
	app.post('/api/office/guide', auth.admin.requiresLogin, Admin.office.guide_save)
	app.get('/api/guide/list',  Admin.office.guide_list)
	app.get('/api/office/list', Admin.office.office_list)

	//admin 用电常识
	app.get('/admin/faq/list',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.faq.list)
	app.post('/admin/faq/save',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.faq.save)
	app.get('/admin/faq/detail/:id',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.faq.detail)
	app.get('/admin/faq/new',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.faq.new)
	app.delete('/admin/faq/:id', auth.admin.requiresLogin, auth.admin.adminAuth, Admin.faq.delete)
	app.get('/api/faq/list', Admin.faq.faq_list)

	//admin 停电信息
	app.get('/admin/blackout/list',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.blackout.list)
	app.post('/admin/blackout/save',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.blackout.save)
	app.get('/admin/blackout/detail/:id',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.blackout.detail)
	app.get('/admin/blackout/new',auth.admin.requiresLogin, auth.admin.adminAuth, Admin.blackout.new)
	app.delete('/admin/blackout/:id', auth.admin.requiresLogin, auth.admin.adminAuth, Admin.blackout.delete)
	app.get('/api/blackout/list', Admin.blackout.blackout_list)


	app.get('/api/offarea/list', auth.admin.requiresLogin, Admin.blackout.getOffareas)


	/**
   * Error handling
   */

	app.use(function (err, req, res, next) {
		// treat as 404
		if (err.message
		  && (~err.message.indexOf('not found')
		  || (~err.message.indexOf('Cast to ObjectId failed')))) {
		  return next();
		}

		console.error(err.stack);

		if (err.stack.includes('ValidationError')) {
		  res.status(422).render('422', { error: err.stack });
		  return;
		}

		// error page
		res.status(500).render('500', { error: err.stack });
	});

	// assume 404 since no middleware responded
	app.use(function (req, res) {
		const payload = {
		  url: req.originalUrl,
		  error: 'Not found'
		};
		// if (req.accepts('json')) return res.status(404).json(payload);
		res.status(404).render('404', payload);
	});

}