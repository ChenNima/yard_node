var express = require('express');
var router = express.Router();

var sms = require('./sms');
var login = require('./login');

//sms
router.get('/sms', sms.getList);
router.get('/sms-count', sms.count);
router.post('/add_sms', sms.addNew);


//login
router.get('/login', login.login);
router.post('/register', login.register);

module.exports = router;
