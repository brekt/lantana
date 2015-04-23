(function() {
  var app = angular.module('lantana', []);

  app.filter('split', function() {
    return function(input, splitChar, splitIndex) {
      return input.split(splitChar)[splitIndex];
    };
  });

})();