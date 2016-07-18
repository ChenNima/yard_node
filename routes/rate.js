/**
 * Created by CYF on 16/7/18.
 */
var mongoose = require('mongoose');

var rateSchema = new mongoose.Schema({
    like: Number,
    dislike: Number
});

var rate = mongoose.model('rate', rateSchema);

var rateData = {};

var findRate = function (callback) {
    rate.find(function (err, data) {
        if (err) return console.error(err);
        if (data.length === 0) {
            var tempRate={
                like: 0,
                dislike: 0
            };
            var newRate = new rate(tempRate);
            newRate.save(function(err, rate){
                if (err) return console.error(err);
                rateData = rate;
                callback();
            });
        }else{
            rateData = data[0];
            callback();
        }
    });
};

exports.get = function (req, res) {
    findRate(function(){
        res.status(200).send(rateData);
    });
};

exports.like = function (req, res) {
    findRate(function(){
        rateData.like++;
        rateData.save(function(err, rate){
            res.status(200).send({message:'success'});
        });
    });
};

exports.dislike = function (req, res) {
    findRate(function(){
        rateData.dislike++;
        rateData.save(function(err, rate){
            res.status(200).send({message:'success'});
        });
    });
};