// var express = require('express');
var db = require('../db/db.js');
var helpers = require('../helpers/helpers.js');
var controllers = require('../controllers/controllers.js');

module.exports = function (router) {

/*************************************
                     Login Routes
**************************************/

  router.get('/login', controllers.loginUserForm);
  router.post('/login', controllers.loginUser);

  router.get('/logout', controllers.logoutUser);

  router.get('/signup', controllers.signupUserForm);
  router.post('/signup', controllers.signupUser);

/*************************************
                     User Routes
**************************************/

  router.get('/users/:id', controllers.getUserInfo);


  /*************************************
                       Package Routes
  **************************************/
  router.get('/packages/:id', controllers.fetchPackages);
  router.get('/package', controllers.checkUser, controllers.fetchPackage);
  router.post('/packages', controllers.checkUser, controllers.savePackageEntry);


  //======Default Route=========
  router.get('/*', function (req, res) {
    res.redirect('/');
  });
};








    // requestHandler.getUserById(id)
    //   .then(function(data) {
    //     res.status(200).send(data);
    //   .catch(function(err) {
    //     console.error(err);
    //     res.status(404).send(err);
    //   });

// exports.getUserById = function(id) {
//   return db.Users.find({
//       where: { id: id }
//     })
//     .then(function(user) {
//       console.log(user);
//       return user;
//     });
