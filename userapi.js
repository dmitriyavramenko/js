var express = require('express'),
    multer  =   require('multer'),
    router = express.Router(),
    adminIngredient = require('../models/admin.js').ingredient,
    adminCocktail = require('../models/admin.js').cocktail,
    Planer = require('../models/planer.js');
var path = require('path');
var fs=require('fs');
var PDFDocument = require('pdfkit');


  var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, '../admin/uploads/');
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




    /////////////////////    routes adminIngredient      /////////////////////////////
    router.post('/upload', function(req, res) {
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
          var ingredient = new adminIngredient( {
            short_name: req.body.formData.short_name,
            display_name: req.body.formData.display_name,
            description: req.body.formData.description,
            active: req.body.formData.active,
            type: req.body.formData.type,
            image: imgUrl

          });
          ingredient.save(function (err) { 
              if (err) // ...
                console.log('ingredient');
          });
      
          res.json({error_code:0,err_desc:null});
      });
    });

    router.post('/data', function(req, res) {
      adminIngredient.find({}, function(err, items){
        if(err) {
          console.log(err)
        }else{
          res.json(items);
        }
      })
        
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
    router.post('/cocktail', function(req, res) {
      adminCocktail.findById(req.body.cocktailId, function(err, items){
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
  router.post('/createPdfx', function(req, res) {
    console.log( req.body.data[0].ingredients[0].ingredient.name.name);
  })
  router.post('/addPlaner', function(req, res) {
    var planerOption = req.body.dataPlaner;
     var planers = new Planer(planerOption);
          planers.save(function (err,room) { 
              if (err) {
                 console.log(err);
               }else{
                res.json({error_code:0,err_desc:null,dataObj: room });
               }
               
          });
  }) 
  router.post('/planerdata', function(req, res) {
    console.log(req.body);
      Planer.find({userID: req.body.userId}, function(err, items){
        if(err) {
          console.log(err)
        }else{
          res.json(items);
        }
      })
  })
   router.post('/deleteplaner', function(req, res) {
     console.log(req.body);
      Planer.remove({ _id: req.body.dataId }, function (err) {
        if(err) {
          console.log(err)
          res.json({error_code:err});
        }else{
          res.json({error_code:0,err_desc:null});
        }
      });
        
     })
  router.post('/createPdf', function(req, res) {
  /* var example = [
               {display_name:'Manhattan', image:'file-1453538772779.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['1 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'PINK LADY', image:'cocktail.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['2 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'GIN DAISY', image:'swimming-pool.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['3 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'Tom Collins', image:'14_swimming-pool.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['4 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'Manhattan', image:'file-1453538772779.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['1 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'PINK LADY', image:'cocktail.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['2 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'GIN DAISY', image:'swimming-pool.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['3 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'Tom Collins', image:'14_swimming-pool.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['4 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'Manhattan', image:'file-1453538772779.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['1 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'PINK LADY', image:'cocktail.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['2 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'GIN DAISY', image:'swimming-pool.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['3 oz. gin','1 dashes grenadine','2 egg white']},
               {display_name:'Tom Collins', image:'14_swimming-pool.png', description:'Shake ingredients very well with ice and strain into cocktail glass. Garnish with a cherry.', ingredients: ['4 oz. gin','1 dashes grenadine','2 egg white']}
             ];
	*/
    var arr = req.body.data;
    var oddColor = req.body.oddColor;
    var evenColor = req.body.evenColor;              
    var arr4n = []; 
    var arr4n1 = []; 
    var arr4n2 = []; 
    var arr4n3 = [];
    for(var n=0; 4*n<arr.length; n++){
      arr4n.push(arr[4*n]);
      if((4*n+1)<arr.length){
        arr4n1.push(arr[4*n+1]);
      }
      if((4*n+2)<arr.length){
        arr4n2.push(arr[4*n+2]);  
      }
      if((4*n+3)<arr.length){
        arr4n3.push(arr[4*n+3])
      }
        
    }  
  doc = new PDFDocument;
  var img_path = "./client/public/uploads/";
  var today = new Date()
  var time = today.getTime(); 
  doc.pipe( fs.createWriteStream('./client/public/cards/CocktailCard-'+time+'.pdf') );
// 4n
  for(var k = 0; k<arr4n.length; k++){
      grad = doc.linearGradient(86, 125*2*k+5, 220, 125)
      grad.stop(0, oddColor)
      doc.rect(86,  125*2*k+5, 220, 125)
      doc.fill(grad)
      doc.fontSize(10)
      doc.image(img_path+arr4n[k].image, 236, 125*2*k+5+10, {width: 60}).fillColor('black')
       .text (arr4n[k].display_name.toUpperCase(),136, 125*2*k+5+25, {width: 90, align: 'left'})
       doc.fontSize(6)
       doc.moveDown(0.1)
       arr4n[k].ingredients.forEach(function(val){
        doc.fillColor('green')
          .text (val.ounce+" "+val.ingredient.name.name, {width: 90, align: 'left'})
       }) 
       
      doc.fontSize(5)
      doc.moveDown()
      doc.text (arr4n[k].description, {width: 90, align: 'left'}) 

  }
// 4n+1  
  for(var m = 0; m<arr4n1.length; m++){
      grad = doc.linearGradient(306, 125*2*m+5, 220, 125)
      grad.stop(0, evenColor)
      doc.rect(306, 125*2*m+5, 220, 125)
      doc.fill(grad)
      doc.fontSize(10)
      doc.image(img_path+arr4n1[m].image, 456, 125*2*m+5+10, {width: 60}).fillColor('black')
       .text (arr4n1[m].display_name.toUpperCase(),356, 125*2*m+5+25, {width: 90, align: 'left'})
       doc.fontSize(6)
       doc.moveDown(0.1) 
       arr4n1[m].ingredients.forEach(function(val){
        doc.text (val.ounce+" "+val.ingredient.name.name, {width: 90, align: 'left'})
       }) 
      doc.fontSize(5)
      doc.moveDown()
      doc.text (arr4n1[m].description, {width: 90, align: 'left'}) 
  }
// 4n+2
  for(var z = 0; z<arr4n2.length; z++){
      grad = doc.linearGradient(86, 125*2*z+130, 220, 125)
      grad.stop(0, evenColor)
      doc.rect(86,  125*2*z+130, 220, 125)
      doc.fill(grad)
      doc.fontSize(10)
      doc.image(img_path+arr4n2[z].image, 96,  125*2*z+130+15, {width: 60}).fillColor('black')
       .text (arr4n2[z].display_name.toUpperCase(),166,  125*2*z+130+30, {width: 90, align: 'left'})
       doc.fontSize(6)
       doc.moveDown(0.1) 
       arr4n2[z].ingredients.forEach(function(val){
        doc.text (val.ounce+" "+val.ingredient.name.name, {width: 90, align: 'left'})
       }) 
      doc.fontSize(5)
      doc.moveDown()
      doc.text (arr4n2[z].description, {width: 90, align: 'left'}) 
  }
// 4n+3
  for(var v = 0; v<arr4n3.length; v++){
      grad = doc.linearGradient(306, 125*2*v+130, 220, 125)
      grad.stop(0, oddColor)
      doc.rect(306, 125*2*v+130, 220, 125)
      doc.fill(grad)
      doc.fontSize(10)
      doc.image(img_path+arr4n3[v].image, 316, 125*2*v+130+15, {width: 60}).fillColor('black')
       .text (arr4n3[v].display_name.toUpperCase(),386, 125*2*v+130+30, {width: 90, align: 'left'})
       doc.fontSize(6)
       doc.moveDown(0.1) 
       arr4n3[v].ingredients.forEach(function(val){
        doc.text (val.ounce+" "+val.ingredient.name.name, {width: 90, align: 'left'})
       }) 
      doc.fontSize(5)
      doc.moveDown()
      doc.text (arr4n3[v].description, {width: 90, align: 'left'}) 
  }
	
	doc.end();
	res.writeHead(200, {"Content-Type": "text/html"});
	res.end('CocktailCard-'+time+'.pdf');

});

     
/////////////////////  END  routes adminCocktail      /////////////////////////////

module.exports = router;