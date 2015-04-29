(function() {
  var app = angular.module('lantana', []);

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
      controller: function ($scope, $element) {
        $scope.add = function() {
          var el = $compile('<chord-box></chord-box>')($scope);
          // $scope.$destroy();
          // $element.remove('chord-adder');
          var el2 = $compile('<add-chord></add-chord>')($scope);
          $element.append(el);
          $element.append(el2);
        };
      }
    };
  });

})();