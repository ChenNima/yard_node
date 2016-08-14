/**
 * Created by yichen on 6/3/16.
 */
var mongoose = require('mongoose');

var labSchema = new mongoose.Schema({
    date: Date,
    lat: Number,
    long:Number,
    network:String,
    heading:Number,
    accuracy:Number,
    bandwidth:Number
});
var lab = mongoose.model('lab', labSchema);

exports.post = function(req, res){
    var newLab = new lab(req.body);
    newLab.save(function (err, lab) {
        if (err) return console.error(err);
        res.status(200).send(lab);
    });
};