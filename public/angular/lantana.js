(function() {
  var app = angular.module('lantana', ['ngSanitize']);
  var chordBoxes = [];

  var counter = 0;

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
  	}
  });

  app.directive('addChord', function($compile) {
    return {
      restrict: 'E',
      templateUrl: '../angular/addChord.html',
      controller: function adder ($scope, $element) {
        $scope.add = function() {
          chordBoxes.push('<chord-box>');
          console.log(chordBoxes);
        };
      }
    };
  });


  app.controller('ChordRender', function($scope, $sce) {
    $scope.Chords = chordBoxes;
    for (var i = 0; i < $scope.Chords.length; i++) {
      $scope.Chords[i] = $sce.trustAsHtml($scope.Chords[i]);
    }
  });

})();