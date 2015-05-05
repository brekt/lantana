(function() {
  var app = angular.module('lantana', []);

  app.filter('split', function($scope) {
    return function(input, splitChar, splitIndex) {
      $scope.chordNotes = input;
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
  	}
  });

  app.directive('addChord', function($compile) {
    var counter = 0;
    return {
      restrict: 'E',
      templateUrl: '../angular/addChord.html',
      controller: function($scope, $element) {
        $scope.add = function() {
          var el = $compile('<chord-box></chord-box>')($scope);
          $element.after(el);
          counter++;
        };
      }
    };
  });

  app.directive('playChord', function() {
    return {
      restrict: 'E',
      templateUrl: '../angular/addChord.html',
      controller: function($scope) {
        $scope.playChord = function() {
          console.log($scope.chordNotes);  
        };
      }
    };
  });

})();