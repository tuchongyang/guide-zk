'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ImageSchema = new Schema({
	format: String,
  file: String,//文件路径，相对路径
  size: Number,//文件大小
  name: String,//文件名称
  creator:{type: Schema.Types.ObjectId, ref:"User"},
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
})

ImageSchema.path('file').required(true, '文件不能为空');


ImageSchema.pre('save', function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
        return next();
    }
    next();
});

ImageSchema.statics = {

  /**
   * Find by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (_id) {
    return this.findOne({ _id })
      // .populate('genre', 'name')
      .exec();
  },

  /**
   * List
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('creator', 'name')
      .sort({ "meta.createAt": -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('Image', ImageSchema);