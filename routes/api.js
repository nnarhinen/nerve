var express = require('express'),
    router = module.exports = express.Router(),
    oauth = require('./oauth2').oauth2,
    expenses = require('./expenses');

router.use(oauth.authorise());
router.get('/expenses/pending', expenses.pending); 
router.use(oauth.errorHandler());
