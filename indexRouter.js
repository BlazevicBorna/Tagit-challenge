var express = require('express');
var indexRouter = express.Router();

var router = function () {
    var indexController = require('./indexController')();
    indexRouter.route('/')
         .get(indexController.getIndex)
         .post(indexController.postIndex);
    return indexRouter;
};

module.exports = router;