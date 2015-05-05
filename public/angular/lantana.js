(function() {
  var app = angular.module('lantana', []);
  chordNotes = [];

  app.filter('split', function() {
    return function(input, splitChar, splitIndex) {
      if (input) {
        console.log(input);
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
      scope: {},
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
      scope: {},
      templateUrl: '../angular/playChord.html',
      controller: function($scope) {
        $scope.playChord = function() {
          // console.log(chordNotes);  
        };
      }
    };
  });

})();