// Require
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


// init
const app = express();

const port = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cors());

//Database key
const db = require('./config/key').mongoURI;

// connect to MongoDb
mongoose.connect(db)
    .then(() => console.log('MongoDB Connected.'))
    .catch(err => console.log(err)); 

// Routes
const shorten = require('./routes/api/shorten');
app.use('/api/shorten',shorten);

const redirect = require('./routes/api/redirect');
app.use('/api/redirect',redirect);

app.get('/:hash',(req,res) => {
    const uid = req.params.hash;
    URL.findOne({id:uid}, (err, doc) => {
        if(doc){
            res.redirect(doc.url);
        }else{
            res.redirect('/');
        }
    })
})

// path
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
      
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
  }


// Port

app.listen(port, () => console.log(`Server is running on ${port}`));