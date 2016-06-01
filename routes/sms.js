/**
 * Created by yichen on 6/1/16.
 */

var smsArray = [];

exports.get = function(req, res){
    res.send(200, {
        smsArray: smsArray
    });
};
exports.addNew = function(req, res) {
    smsArray.push(req.body);
    res.send(200, {
        smsArray: smsArray
    });
};