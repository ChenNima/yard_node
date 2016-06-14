/**
 * Created by yichen on 6/3/16.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
    name: String,
    nick_name: String,
    pass:String,
    role:String
});
var user = mongoose.model('users', userSchema);

exports.login = function(req, res){
    var password =  crypto.createHash('md5').update(req.query.pass).digest('base64');
    user.findOne({'name':req.query.name},
        function (err, users) {
            if (err) return console.error(err);
            if(users){
                if (users.pass == password){
                    res.status(200).send(users);
                }else {
                    res.status(417).send({
                        message:"wrong pass"
                    });
                }
            }else {
                res.status(412).send({
                    message:'no user found'
                });
            }

        });
};
exports.register = function(req, res) {
    user.findOne({'name':req.body.name},
        function (err, users) {
            if (err) return console.error(err);
            if(users){
                res.status(412).send({
                    message:'user already exists'
                });
                return;
            }
            req.body.pass =  crypto.createHash('md5').update(req.body.pass).digest('base64');
            var newUser = new user(req.body);
            newUser.save(function (err, user) {
                if (err) return console.error(err);
                res.status(200).send(user);
            });
    });
};