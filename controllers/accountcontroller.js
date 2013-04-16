var UserModel = require('../models/usermodel');

var AccountController = {
  
  show:function(req,res){
    res.render('account/show',{user:req.user});
  },
  
  update:function(req,res){
    console.log(req.files);
    var image = req.files.image.path.split('/').pop();
    UserModel.findByIdAndUpdate(req.user._id, {avatar:image}, function(err,user){
      res.render('account/show',{user:user});
    });
  }//update
  
};//AccountControler

module.exports = AccountController;