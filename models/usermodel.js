var mongoose = require('mongoose'),
UserSchema = mongoose.Schema({
  displayName: String,
  email: String,
  name: {
    familyName: String,
    givenName: String
  },
  logins: {type: Number, default: 0}
}),

UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;