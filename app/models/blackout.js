'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BlackoutSchema = new Schema({
	title: String,
	start_time: Date,
	end_time: Date,
	area_town: String,//镇,
	area_village: Array,//乡或者厂
	
	dead_line: String,//停电线路
	change_name: Array,//公变名称
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

BlackoutSchema.path('title').required(true, '停电标题不能为空');
BlackoutSchema.path('start_time').required(true, '停电开始时间不能为空');
BlackoutSchema.path('end_time').required(true, '停电终止时间不能为空');

BlackoutSchema.pre('save', function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
        return next();
    }
    next();
});


BlackoutSchema.statics = {
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

mongoose.model('Blackout', BlackoutSchema);