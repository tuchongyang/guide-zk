'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GuideSchema = new Schema({
	name: String,
  area_list: [{
    id: Number,
    image: String,//导览图片
    width: Number,
    height: Number,
    left: Number,
    top: Number
  }],
	sort: {
    type: Number,
    default: 1
  },
	office: {type: Schema.Types.ObjectId, ref: "office"},
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

GuideSchema.path('name').required(true, '导览名称不能为空');

GuideSchema.pre('save', function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
        return next();
    }
    next();
});

GuideSchema.statics = {
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
      .sort({"sort": 1, "meta.createAt": 1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('Guide', GuideSchema);