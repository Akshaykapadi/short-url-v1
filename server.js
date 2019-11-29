// Require
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


// init
const app = express();

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
app.get('/',(req, res)=>{
    res.send('Hello ok');
});

// Port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on ${port}`));