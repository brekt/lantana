(function() {
  var app = angular.module('lantana', []);

  // constants and global variables

  var progression = [];

  var possibleNotes = ["A", "B", "C", "D", "E", "F", "G", "Ab", "Bb", "Cb", "Db", "Eb", "Fb", "Gb", "A#", "B#", "C#", "D#", "E#", "F#", "G#", "Abb", "Bbb", "Cbb", "Dbb", "Ebb", "Fbb", "Gbb", "AX", "BX", "CX", "DX", "EX", "FX", "GX"];

  
  // constructor functions

  function GrowSong(chordNotes) {
    progression.push(chordNotes);
    console.log(chordNotes);
  }

  // angular components

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
      templateUrl: '../angular/playChord.html',
      controller: function($scope) {
        $scope.playChord = function() {
          console.log($scope.notes);
        }
      }
    };
  });

})();