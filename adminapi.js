var express = require('express'),
    fs = require('fs'),
    multer  =   require('multer'),
    router = express.Router(),
    User = require('../models/user.js'),
    adminIngredient = require('../models/admin.js').ingredient,
    adminCocktail = require('../models/admin.js').cocktail;



  var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './client/public/uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        },

    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
/*fs.unlink("../client/public/uploads/file-1454258919482.png", function(err){
  if(err)console.log(err);
  else console.log('ok');
})
*/

    /////////////////////    routes users      /////////////////////////////
 router.post('/getusers', function (req, res, next) {
User.find({}, function(err, users){
        if(err) {
          console.log(err)
        }else{
          res.json(users);
        }
      })
   })
    /////////////////////   end routes users      /////////////////////////////

    /////////////////////    routes adminIngredient      /////////////////////////////

    router.use('/', function (req, res, next) {
      console.log(req.isAuthenticated());
if(!req.isAuthenticated()){

 // return res.redirect('/login')
}
next();
    })
    router.use('/', express.static('client/admin'));


    router.post('/addIng', function(req, res) {
      upload(req,res,function(err){
        var imgUrl = "";
          if(err){
            console.log(err);
              res.json({error_code:1,err_desc:err});
              return;
          }else{
            imgUrl = req.file.filename
          }
          console.log(req.body.formData);
          console.log(imgUrl);
          var ingredient = new adminIngredient( {
            id: req.body.formData.id,
            short_name: req.body.formData.short_name,
            display_name: req.body.formData.display_name,
            description: req.body.formData.description,
            active: req.body.formData.active,
            type: req.body.formData.type,
            image: imgUrl

          });
          ingredient.save(function (err, room) { 
              if (err) {
                 console.log('ingredient');
               }else{
                res.json({error_code:0,err_desc:null,dataObj: room });
               }
          });
     
      });
    });

    router.post('/dataIng', function(req, res) {
      adminIngredient.find({}, function(err, items){
        if(err) {
          console.log(err)
        }else{
          res.json(items);
        }
      })
        
     })

    router.post('/deleteIng', function(req, res) {
     console.log(req.body);
      adminIngredient.remove({ _id: req.body.dataId }, function (err) {
        if(err) {
          console.log(err)
          res.json({error_code:err});
        }else{
          res.json({error_code:0,err_desc:null});
        }
      });
        
     })

 /////////////////////  END  routes adminIngredient      /////////////////////////////


/////////////////////    routes adminCocktail      /////////////////////////////

    router.post('/addCocktail', function(req, res) {
      upload(req,res,function(err){
        var imgUrl = "";
          if(err){
            console.log(err);
              // res.json({error_code:1,err_desc:err});
               //return;
          }else{
            imgUrl = req.file.filename
          }
          console.log(req.body.formData);

          console.log(imgUrl);
          var dataObj = {
            short_name: req.body.formData.short_name,
            display_name: req.body.formData.display_name,
            ingredients: req.body.formData.indegredirntOunce,
            description: req.body.formData.description,
            active: req.body.formData.active,
            alkfree: req.body.formData.alkfree,
            image: imgUrl

          }
          var cocktail = new adminCocktail(dataObj);
          cocktail.save(function (err,room) { 
              if (err) {
                 console.log('ingredient');
               }else{
                res.json({error_code:0,err_desc:null,dataObj: room });
               }
               
          });
          
      });
    });

    router.post('/dataCocktail', function(req, res) {
      adminCocktail.find({}, function(err, items){
        if(err) {
          console.log(err)
        }else{
          res.json(items);
        }
      })
        
     })
    router.post('/deleteCocktail', function(req, res) {
     console.log(req.body);
      adminCocktail.remove({ _id: req.body.dataId }, function (err) {
        if(err) {
          console.log(err)
        }else{
            console.log("ok");
          res.json({error_code:0,err_desc:null});

        }
      });
        
     })
    router.post('/editCocktailImg', function(req, res) {
      upload(req,res,function(err){
              var imgUrl = "";
                if(err){
                  console.log(err);
                    // res.json({error_code:1,err_desc:err});
                     //return;
                }else{
                  imgUrl = req.file.filename
                }
                console.log(req.body.formData);
                console.log(imgUrl);
                var dataObj = {
                  short_name: req.body.formData.short_name,
                  display_name: req.body.formData.display_name,
                  ingredients: req.body.formData.ingredients,
                  description: req.body.formData.description,
                  active: req.body.formData.active,
                  alkfree: req.body.formData.alkfree,
                  image: imgUrl

                }
                 var conditions =  {_id:req.body.dataId};
                var options =  { multi: true }; 
                 adminCocktail.update(conditions, dataObj, options, function (err, raw) {
                  if (err){
                      console.log(err);
                    } else{

                      console.log(raw);
                      res.json({error_code:0,err_desc:null, dataObj:dataObj});
                  }
                });

              });
            
              
    })
    router.post('/editCocktail', function(req, res) {
        var conditions =  {_id:req.body.dataId};
        var options =  { multi: true }; 
        var doc = req.body.formData;
            adminCocktail.update(conditions, doc, options, function (err, raw) {
            if (err){
                console.log(err);
              } else{

                console.log(raw);
                res.json({error_code:0,err_desc:null,dataObj:doc});
            }
      });




















  })
     
/////////////////////  END  routes adminCocktail      /////////////////////////////

module.exports = router;