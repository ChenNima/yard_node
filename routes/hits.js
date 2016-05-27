/**
 * Created by yichen on 5/27/16.
 */
/*
 * HIT service
 */
var hits = 0;
exports.count = function(req, res){
    alert("");
    res.send(200, {
        hits: hits
    });
};
exports.registerNew = function(req, res) {
    hits += 1;
    res.send(200, {
        hits: hits
    });
};
