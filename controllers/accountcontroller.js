var UserModel = require('../models/usermodel');

var AccountController = {
  
  show:function(req,res){
    console.log(req.user);
    res.render('account/show',{user:req.session.user});
  },
  
  update:function(req,res){
    console.log(req.files);
    var image = req.files.image.path.split('/').pop();
    UserModel.findByIdAndUpdate(req.user._id, {avatar:image}, function(err,user){
      req.session.user = user;
      res.render('account/show',{user:user});
    });
    console.log(req.user);
  }//update
  
};//AccountControler

module.exports = AccountController;