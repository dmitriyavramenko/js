var express = require('express'),
    multer  =   require('multer'),
    router = express.Router();




router.get('/',function(req, res) {
 res.render('login', {success : "ok"});
})

module.exports = router;