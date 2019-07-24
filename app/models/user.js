'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;


/**
 * User Schema
 */

const UserSchema = new Schema({
  name: { type: String, default: '' },//昵称
  email: { type: String, default: '' },
  username: { type: String, default: '' },//用户名
  hashed_password: { type: String, default: '' },
  is_active: { type: Number, default: 1 },
  last_login: String,
  role: {type: Number, default: 1},// 用户角色,这里规定role >= 100为管理员 >= 200为超级管理员
  salt: { type: String, default: '' },
  avatar: String,//保存头像地址
  meta:{
    createAt:{
      type: Date,
      default: Date.now()
    },
    updateAt:{
      type: Date,
      default: Date.now()
    }
  }
});

const validatePresenceOf = value => value && value.length;

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

/**
 * Validations
 */

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path('email').validate(function (email) {
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate({
  isAsync: true,
  validator: function (email, fn) {
    const User = mongoose.model('User');
    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
      User.find({ email: email }).exec(function (err, users) {
        fn(!err && users.length === 0);
      });
    } else fn(true);
  }, 
  message: 'Email already exists'
});

UserSchema.path('username').validate(function (username) {
  return username.length;
}, 'Username cannot be blank');
UserSchema.path('username').validate({
  isAsync: true,
  validator: function (username, fn) {
    const User = mongoose.model('User');
    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('username')) {
      User.find({ username: username }).exec(function (err, users) {
        fn(!err && users.length === 0);
      });
    } else fn(true);
  }, 
  message: 'Email already exists'
});
UserSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length && this._password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
        return next();
    }
  if (!validatePresenceOf(this.password)) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

};

/**
 * Statics
 */

UserSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options) {
    options.select = options.select || '';
    return this.findOne(options.criteria)
      .select(options.select)
      .exec();
  },
  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .sort({ "meta.createAt": -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('User', UserSchema);
