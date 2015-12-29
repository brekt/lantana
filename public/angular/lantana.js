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

  app.controller('chordController', function($scope) {
    console.log($scope.notes);
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
        $scope.add = function() {
          var el = $compile('<chord-box></chord-box>')($scope);
          var progression = angular.element(document.getElementById('progression'));
          progression.append(el);
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
          var chord = $scope.notes.split(' ');
          console.log(chord);
          soundChord(chord[0]);
          // soundChord(root, third, fifth, seventh, ninth, thirteenth);
        };
      }
    };
  });

})();

// this function parses the note input, makes the instrument, and plays the chords

function soundChord(note1, note2, note3, note4, note5, note6, duration) {

  var audioContext = new (window.AudioContext || window.webkitAudioContext)();

  var osc1 = audioContext.createOscillator();
  var osc2 = audioContext.createOscillator();
  var osc3 = audioContext.createOscillator();
  var osc4 = audioContext.createOscillator();
  var osc5 = audioContext.createOscillator();
  var osc6 = audioContext.createOscillator();

  var oscArray = [osc1, osc2, osc3, osc4, osc5, osc6];

  osc1.type = 'sine';
  osc2.type = 'sine';
  osc3.type = 'sine';
  osc4.type = 'sine';
  osc5.type = 'sine';
  osc6.type = 'sine';

  var gainNode = audioContext.createGain();

  oscArray.forEach(function(osc) {
    osc.connect(gainNode);
  });

  gainNode.connect(audioContext.destination);
  gainNode.gain.value = 0.01;

  var root = 0.0;
  var third = 0.0;
  var fifth = 0.0;
  var seventh = 0.0;
  var ninth = 0.0;
  var thirteenth = 0.0;

  switch (note1) {
    case 'G#':
    case 'Ab':
      root = 103.83;
      break;
    case 'Bbb':
    case 'A':
    case 'GX':
      root = 110.00;
      break;
    case 'A#':
    case 'Bb':
      root = 116.54;
      break;
    case 'AX':
    case 'B':
    case 'Cb':
      root = 123.47;
      break;
    case 'B#':
    case 'C':
    case 'Dbb':
      root = 130.81;
      break;
    case 'C#':
    case 'Db':
      root = 138.59;
      break;
    case 'CX':
    case 'D':
    case 'Ebb':
      root = 146.83;
      break;
    case 'D#':
    case 'Eb':
      root = 155.56;
      break;
    case 'DX':
    case 'E':
    case 'Fb':
      root = 164.81;
      break;
    case 'E#':
    case 'F':
    case 'Gbb':
      root = 174.61;
      break;
    case 'F#':
    case 'Gb':
      root = 185.00;
      break;
    case 'FX':
    case 'G':
    case 'Abb':
      root = 196.00;
      break;
    default:
      root = 0;
  }

    osc1.frequency.value = root;
    osc1.start();
    osc1.stop(audioContext.currentTime + 2);
    setTimeout(function() {
      audioContext.close();
    }, 2000);
}
