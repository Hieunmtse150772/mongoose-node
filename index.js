// const mongoose = require('mongoose')
// const Nations = require('./models/nations')

// const url = 'mongodb://127.0.0.1:27017/fbWC'
// const connect = mongoose.connect(url)
// connect.then((db) => {
//     console.log('Connected correctly to server');
//     var newNation = Nations({
//         name: 'VN3',
//         description: 'test'
//     });
//     newNation.save().then((nation) => {
//         console.log(nation);
//         return Nations.find({});
//     }).then((nations)=>{
//         console.log(nations)
//         return Nations.deleteOne({})
//     }).then(()=>{
//         return mongoose.connection.close()
//     }).catch((err)=>{
//         console.log(err)
//     })
// });

const express = require('express');
const createError = require('http-errors');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Initialize DB
require('./initDB')();

const nationRoute = require('./Routes/nationRouter');
const playerRoute = require('./Routes/playerRouter');
const userRoute = require('./Routes/userRouter');

app.use('/nations', nationRoute);
app.use('/players', playerRoute);
app.use('/user', userRoute);


//404 handler and pass to error handler
app.use((req, res, next) => {
  /*
  const err = new Error('Not found');
  err.status = 404;
  next(err);
  */
  // You can use the above code if your not using the http-errors module
  next(createError(404, 'Not found'));
});

//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});