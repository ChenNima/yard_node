/**
 * Created by yichen on 6/3/16.
 */
var mongoose = require('mongoose');

var loginSchema = new mongoose.Schema({
    name: String,
    pass:String,
    color:String
});
var login = mongoose.model('chat_log', loginSchema);

exports.login = function(req, res){
    res.send(200, {
        smsArray: smsArray
    });
};
exports.register = function(req, res) {
    var newUser = new login(req.body.data);

    newUser.save(function (err, user) {
        if (err) return console.error(err);
        res.send(200, {
            user: user
        });
    });
};