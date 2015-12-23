(function() {

  var app = angular.module('lantana', []);

  var chordCounter = 0;
  var userExists = false;

  app.controller('SignupController', function($scope, $http, $window) {
    $scope.ph = '';
    $scope.doesUserExist = function(username) {
      if (username) {
        username = username.toLowerCase();
      }
      $http({
        method: 'POST',
        url: '/api/doesuserexist',
        data: {username: username}
      }).success(function(data) {
        if (data === true) {
          $scope.username = '';
          $scope.ph = 'Sorry, that name is taken.';
        }
        else {
          $scope.ph = '';
        }
      });
    };
    $scope.newUser = function(username, password, email) {
      if (username && password && email) {
        username = username.toLowerCase();
      }
      $http({
        method: 'POST',
        url: '/api/signup',
        data: {'username': username, 'password': password, 'email': email}
      }).success(function(data) {
        localStorage.setItem('LantanaToken', data);
        console.log(localStorage.LantanaToken);
        $window.location.href = '/';
      });
    };
  });

  app.controller('LoginController', function($scope, $http) {
    $scope.authenticate = function(username, password) {
      username = username.toLowerCase();
      $http({
        method: 'POST',
        url: 'api/authenticate',
        data: {username: username, password: password},
      }).success(function(data) {
          console.log(data);
      });
    };
  });

  app.directive('ngPlaceholder', function() {
    return {
      restrict: 'A',
      scope: {
        placeholder: '=ngPlaceholder'
      },
      controller: 'SignupController',
      link: function(scope, elem, attr) {
        scope.$watch('placeholder', function() {
          elem[0].placeholder = scope.placeholder;
        })
      }
    };
  });

  app.filter('split', function() {
    return function(input, splitChar, splitIndex) {
      if (input) {
        return input.split(splitChar)[splitIndex];
      }
    };
  });

  app.directive('chordBox', function() {
  	return {
  		restrict: 'E',
  		scope: {},
  		templateUrl: '../angular/chordBox.html'
  	};
  });

  app.directive('addChord', function($compile, $document) {
    return {
      restrict: 'E',
      templateUrl: '../angular/addChord.html',
      controller: function($scope, $compile) {
        $scope.chords = [];
        $scope.add = function() {
          var el = $compile('<chord-box></chord-box>')($scope);
          var progression = angular.element(document.getElementById('progression'));
          progression.append(el);
          // var progression = $document.find('div');
          // console.log(progression[1]);
        };
      }
    };
  });

  app.directive('playChord', function() {
    return {
      restrict: 'E',
      templateUrl: '../angular/playChord.html',
      controller: function($scope) {
        $scope.playChord = function() {
          $scope.notesArray = $scope.notes.split(' ');
          console.log($scope.notesArray);
        };
      }
    };
  });

})();
