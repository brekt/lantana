(function() {
  var app = angular.module('lantana', []);

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

})();

// angular.module('moduleName')
//     .directive('myDirective', function () {
//     return {
//         restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
//         scope: {
//             //@ reads the attribute value, = provides two-way binding, & works with functions
//             title: '@'         },
//         template: '<div>{{ myVal }}</div>',
//         templateUrl: 'mytemplate.html',
//         controller: controllerFunction, //Embed a custom controller in the directive
//         link: function ($scope, element, attrs) { } //DOM manipulation
//     }
// });