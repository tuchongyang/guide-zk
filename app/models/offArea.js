'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OffAreaSchema = new Schema({
	
	town_name: String,
	town_village: Array,   //乡或者厂
	change_name: Array, //公变名称
	
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

// OffAreaSchema.path('town_name').required(true, '停电标题不能为空');

OffAreaSchema.pre('save', function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
        return next();
    }
    next();
});

OffAreaSchema.statics = {
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
      .sort({ "meta.createAt": -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('OffArea', OffAreaSchema);