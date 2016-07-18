var express = require('express');
var router = express.Router();

var sms = require('./sms');
var login = require('./login');
var rate = require('./rate');

//sms
router.get('/sms', sms.getList);
router.get('/sms-count', sms.count);
router.post('/add_sms', sms.addNew);


//login
router.get('/login', login.login);
router.post('/register', login.register);

//rate
router.get('/like', rate.like);
router.get('/dislike', rate.dislike);
router.get('/get-rate', rate.get);


module.exports = router;
