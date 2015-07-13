(function() {

  var app = angular.module('lantana', []);

  var chordCounter = 0;
  var chordArray = [];
  var userExists = false;

  app.controller('SignupController', function($scope, $http) {
    $scope.ph = ' ';
    $scope.doesUserExist = function(username) {
      console.log(username);
      $http({
        method: 'POST',
        url: '/api/doesuserexist',
        data: {username: username}
      }).success(function(data) {
        console.log(data);
        if (data === true) {
          $scope.username = '';
          $scope.ph = 'Sorry, that name is taken.';
        }
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

  app.directive('addChord', function($compile) {
    return {
      restrict: 'E',
      templateUrl: '../angular/addChord.html',
      controller: function($scope, $element) {
        $scope.add = function() {
          var el = $compile('<chord-box></chord-box>')($scope);
          $element.after(el);
          chordCounter++;
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