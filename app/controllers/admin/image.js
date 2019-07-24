const mongoose = require('mongoose');
const { wrap: async } = require('co');
const Image = mongoose.model('Image');

const { respond, respondOrRedirect } = require('../../utils');


exports.list = async(function* (req, res){
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const limit = parseInt(req.query.page_size) || 20;
    const options = {
        limit: limit,
        page: page
    };
    const images = yield Image.list(options);
    const count = yield Image.count();
    respond(res, 'admin/image/image_list',{
        title: "图片列表",
        list: images,
        page: page + 1,
        pages: Math.ceil(count / limit),
        count: count
    })
})
exports.save = async(function* (req, res){
    let id = req.body.id;
    let name = req.body.name;
    try{
        if(id){
            yield Image.findOneAndUpdate({_id:id,name:name});
            var data={success:true,msg:"保存成功"}
            res.json(data)
        }else{
            var _Channel = new Image({name:name})
            yield _Channel.save();
            var data={success:true,msg:"保存成功"}
            res.json(data)
        }
    }catch(err){
        const errors = Object.keys(err.errors).map(field => err.errors[field].message);     
        var data={success:false,msg:errors.toString()}
        res.json(data)   
    }
    
})
exports.delete = async(function* (req, res){
    const id=req.params.id;
    try{
        var image = yield Image.load(id);
        yield image.remove();
        var data={"success":true,"msg":"删除成功"}
        res.json(data);
    }catch(err){
        var data={"success":false,"msg":err.message || "删除失败"}
        res.json(data);
    }
})

exports.account_list = async(function* (req, res){
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const limit = parseInt(req.query.page_size) || 20;
    const options = {
        limit: limit,
        page: page,
        criteria: { creator: req.session.user._id}
    };
    let creator;
   
    const images = yield Image.list(options);
    const count = yield Image.count();

    res.json(images)

})