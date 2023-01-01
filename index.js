const express = require('express')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const con = require('./utils/database');
const app = express()

//errorhandler import
const errorHandlerMiddleware = require('./utils/errorHandler');
const catchAsyncErrors = require('./utils/catchAsyncErrors');

//routes
const doctorRoutes = require('./routes/doctorRoutes')

app.use(express.json());
app.use(cookieParser());

//setting up config file
dotenv.config({path:'config/config.env'});
app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
 //to prevent CORS
 app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/',(req,res,next)=>{
    res.send('<html><body><h1>Hello!</h1></body></html>');
})
app.use('/api/doctor',doctorRoutes);
app.use(errorHandlerMiddleware);

// con.connect((err)=>{
    // if (err) console.log(err);
    app.listen(process.env.PORT || 3000,(err)=>{
      console.log("Connected!");
      setInterval(function () {
        con.query('SELECT 1');
    }, 5000);
    });
// });
