const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Load URL Module
const URL = require('../../models/Urls');

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next(); 
});

// @routes GET /api/shorten/test
// @desc Test API end point
// @access Public

 router.get('/test',(req, res) => res.json({msg:'API is working.'}));



 const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://dev-82j78ewk.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
    audience: 'R39nihdl4ltxuc3Mz0DSvB4Vj0xrgOl5',
    issuer: `https://dev-82j78ewk.auth0.com/`,
    algorithms: ['RS256']
  });

// @route POST api/shorten
// @desc POST a url to shorten
// @access Public
router.post('/',checkJwt,(req,res)=>{
    // Did you get the req?
    console.log(req);
    if(req.body.url){
        urlData = req.body.url;
    }
    console.log('URL is: ', urlData);

    // check if the URL already exists
    URL.findOne({url : urlData},(err, doc)=>{
            if(doc){
                res.send({
                    hash : doc.id
                })
            }else{
                const webaddress = new URL({
                    id : uniqid(),
                    url : urlData,

                });

                webaddress.save((err) =>{
                    if(err){
                        return console.error(err);
                    }
                    res.send({
                        url: urlData,
                        hash : webaddress.id,
                        status : 200,
                        statusTxt : 'Success' 
                    })
                })
            }
    });


});

 module.exports = router; 