(function () {
  'use strict';
  angular.module('app')
    .controller('PackageCreateCtrl', PackageCreateCtrl);

  PackageCreateCtrl.$inject = ['ApiFactory', '$state'];

  function PackageCreateCtrl (ApiFactory, $state) {
    var self = this;

    // Start with empty fields.  Title and at least one command are required.
    self.fields = {
      title: '',
      description: '',
      commands: [],
      command: '',
      action: '',
      errorList: []
    };

    self.errorMessages = {
      title: 'Please only use letters and numbers.',
      command: 'Please only use letters, numbers, and spaces.',
      variable: "Please format variable as follow: \<ARG del='+' quote=true case='proper'\>",
      del: "Delimiter(del) can only have 5 or fewer characters of: space, '+', '-', '_', '*', '.'",
      cap: "Cap can either be 'upper', 'lower', or 'proper'.",
      quote: "Quote can either have true or false boolean values.",
      dup: "You already have that command.",
      validCommand: "Please add a valid command/action.",
      validTitle: "Please enter a valid title."
    };

    self.isInputInvalid = function (input) {
      return input.$dirty && input.$invalid;
    };

    self.isInputValid = function (input) {
      return input.$dirty && input.$valid;
    };

    self.setPristine = function (field) {
      if (field.$$lastCommittedViewValue === '') {
        field.$setPristine();
      }
    };

    self.validateAndPost = function () {
      var validated = true;
      self.fields.errorList = [];
      if (!self.fields.title) {
        self.fields.errorList.push(self.errorMessages.validTitle);
        validated = false;
      }
      if (self.fields.commands.length < 1) {
        self.fields.errorList.push(self.errorMessages.validCommand);
        validated = false;
      }
      if (validated) {
        self.addPackage();
      }
    };

    self.actionValidation = function (action) {
      var substring = "<ARG";
      var allowedDel = " _-*%+";

      //check if action is an ARG
      if (action.indexOf(substring) > -1) {
        var delPat = 'del="(?:.{1,5})"';
        var casePat = 'case=(?:"upper"|"lower"|"proper")';
        var quotePat = 'quote=(?:true|false)';

        var arg_pattern = '<ARG (' + delPat + '|' + casePat + '|' + quotePat + ')\\s?(' + delPat + '|' + casePat + '|' + quotePat + ')?\\s?(' + delPat + '|' + casePat + '|' + quotePat + ')?>';
        var arg_re = new RegExp(arg_pattern);
        var match = action.match(arg_re);

        if (!match) {
          //show variable error
          self.fields.errorList.push(self.errorMessages.variable, self.errorMessages.del, self.errorMessages.cap, self.errorMessages.quote);
          return false;
        } else {
          for (var i = 0; i < match.length; i++) {
            if (match[i] && match[i].indexOf("del=") === 0) {
              var del = match[i].match(/"([^']+)"/)[1];
              for (var i = 0; i < del.length; i++) {
                if (allowedDel.indexOf(del[i]) === -1) {
                  //show  del error
                  self.fields.errorList.push(self.errorMessages.del);
                  return false;
                }
              }
            }
          }
        }
      }
      return true;
    };

    // adds a command
    self.addCommand = function () {
      self.fields.errorList = [];
      // show error if duplicate command
      for (var i = 0; i < self.fields.commands.length; i++) {
        if (self.fields.commands[i].command === self.command) {
          self.fields.errorList.push(self.errorMessages.dup);
          return;
        }
      }
      if (!self.command || !self.action) {
        self.fields.errorList.push(self.errorMessages.validCommand);
      } else if (self.actionValidation(self.action)) {
        self.fields.commands.push({
          command: self.command,
          action: self.action
        });
        self.command = '';
        self.action = '';
      }
    };

    self.addPackage = function () {
      var pkgContents = {};
      for (var i = 0; i < self.fields.commands.length; i++) {
        pkgContents[self.fields.commands[i].command] = self.fields.commands[i].action;
      }

      ApiFactory.post('/packages', {
        title: self.fields.title,
        description: self.fields.description,
        packageContents: pkgContents
      }).then(function (r) {
        // if successful, redirect to recently added package
        $state.go('package', {packageName: self.fields.title});
      });
    };

  }
})();

