'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FaqSchema = new Schema({
	title: String,
	content: String,
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

FaqSchema.path('title').required(true, '常识名称不能为空');
FaqSchema.path('content').required(true, '常识内容不能为空');

FaqSchema.pre('save', function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
        return next();
    }
    next();
});

FaqSchema.statics = {
  load: function (_id) {
    return this.findOne({ _id })
      // .populate('genre', 'name')
      .exec();
  },
  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('image', 'file')
      .sort({ "meta.createAt": -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('Faq', FaqSchema);