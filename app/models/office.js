'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OfficeSchema = new Schema({
	name: String,
  rank: Number,//网点级别，1:A类 ，2:B类，3：C类，4：非三型一化
  address: {//网点地址
    province: String,
    city: String,
    area: String,
    town: String,
    address: String
  },
  image: String,//网点图片
  tel: String,//网点电话
  worktime: String,//工作时间
  plan: { //大厅平面图
    bg: String /*{ type: Schema.Types.ObjectId, ref: "image" }*/ ,
    current: {//当前位置基于大厅平面图坐标
      left: Number,
      top: Number
    }
  },
  lat: Number,//纬度
  lng: Number,//经度
  creator:{ type: Schema.Types.ObjectId, ref: "User"},
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

OfficeSchema.path('name').required(true, '营业网点名称不能为空');

OfficeSchema.pre('save', function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
        return next();
    }
    next();
});

OfficeSchema.statics = {
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
      // .populate('image', 'file')
      .sort({ "meta.createAt": -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('Office', OfficeSchema);