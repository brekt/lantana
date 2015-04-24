(function() {
  var app = angular.module('lantana', []);

  app.filter('split', function() {
    return function(input, splitChar, splitIndex) {
      if (input) {
        return input.split(splitChar)[splitIndex];
      }
    };
  });

})();