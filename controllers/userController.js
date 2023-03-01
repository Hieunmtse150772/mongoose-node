const createError = require('http-errors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const User = require('../Models/user');

module.exports = {
  index: async (req, res, next) => {
    try {
      res.render('register',{
        title: 'Register'
      })
    } catch (error) {
      console.log(error.message);
    }
  },

  regist: async (req, res, next) => {
    try {
            const { username, password } = req.body;
            let errors = []; 
            if (!username || !password ) {
              errors.push({ msg: 'Please enter all fields' });
            } 
           if (password.length < 6) {
              errors.push({ msg: 'Password must be at least 6 characters' });
            } 
            if (errors.length > 0) {
              res.render('register', {
                title: 'Register',
                errors,
                username,
                password
              });
            } 
            else {
              User.findOne({username: username}).then(user => {
                if (user) {
                  errors.push({ msg: 'Username already exists' });
                  res.render('register', {
                    title: 'Register',
                    errors,
                    username,
                    password
                  });
                } 
                else {
                  const newUser = new User({
                    username,
                    password
                  });
                    //Hash password
                    bcrypt.hash(newUser.password, 10, function(err, hash) {
                      if (err) throw err;
                      newUser.password = hash;
                      newUser.save()
                        .then(user =>{
                          res.redirect('/user/login');
                        })
                        .catch(next);
                  }); 
                }
              });
            }
      
    } catch (error) {
      console.log(error.message);
      if (error.name === 'ValidationError') {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  loginForm: async (req, res, next) => {
    try {
      res.render('login',{
        title: 'Login',
      })
    } catch (error) {
      next(error);
    }
  },
  login: async(req, res, next)=>{
    try{
      // if(!req.session.user) {
        var authHeader = req.headers.authorization;
        
        if (!authHeader) {
          var err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
        }
      
        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        var username = auth[0];
        var password = auth[1];
      
        User.findOne({username: username})
        .then((user) => {
          console.log("password1: ", password)

          console.log("password2: ", user.password)

          if (user === null) {
            var err = new Error('User ' + username + ' does not exist!');
            err.status = 403;
            return next(err);
          }
          else if (user.password !== password) {
            var err = new Error('Your password is incorrect!');
            err.status = 403;
            return next(err);
          }
          else if (user.username === username && user.password === password) {
            req.session.user = 'authenticated';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You are authenticated!')
          }
        })
        .catch((err) => next(err));
      }
    //   else {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/plain');
    //     res.end('You are already authenticated!');
    //   }
    // }
    catch(error){

    }
  }
};