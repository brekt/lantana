var hotKeysOn = true;

(function() {

  var app = angular.module('lantana', []);

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
        hotKeysOn = true;
        $window.location.href = '/';
      });
    };
  });

  app.controller('LoginController', function($scope, $http, $window) {
    $scope.phlogin = '';
    $scope.login = function(username, password, token) {
      var token = localStorage.getItem('LantanaToken');
      $scope.loggedInUser = username;
      console.log($scope.loggedInUser);
      console.log('token: ' + token);
      $http({
        method: 'POST',
        url: 'api/login',
        data: {username: username, password: password, token: token},
      }).success(function(response) {
          if (response.loginStatus === 'success') {
            hotKeysOn = true;
            $window.location.href = '/';
          } else {
            var loginPassword = document.getElementById('password');
            $scope.password = '';
            $scope.phlogin = data.loginStatus;
            $scope.loggedInUser = null;
          }
      });
    };
  });

  app.factory('UserFactory', function() {

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
  		templateUrl: '../angular/chordbox.html'
  	};
  });

  app.directive('addChord', function($compile, $document) {
    return {
      restrict: 'E',
      templateUrl: '../angular/addchord.html',
      controller: function($scope, $compile) {
        $scope.add = function() {
          var el = $compile('<chord-box></chord-box>')($scope);
          var progression = angular.element(document.getElementById('progression'));
          progression.append(el);
          console.log(el);
        };
      }
    };
  });

  app.directive('playChord', function() {
    return {
      restrict: 'E',
      templateUrl: '../angular/playchord.html',
      controller: function($scope) {
        $scope.playChord = function() {
          var chord = $scope.notes.split(' ');
          console.log(chord);
          soundChord(chord[0], chord[1], chord[2]);
          // soundChord(root, third, fifth, seventh, ninth, thirteenth);
        };
      }
    };
  });

  app.directive('saveSong', function() {
    return {
      restrict: 'E',
      templateUrl: '../angular/savesong.html',
      controller: function($scope, $http, $window, $compile) {
        $scope.saveSong = function() {
          console.log('$scope.loggedInUser: ' + $scope.loggedInUser);
          if (!$scope.loggedInUser) {
            var progression = angular.element(document.querySelector('#progression'));
            console.log('progression: ', progression);
            progression.detach();
            var top = angular.element(document.querySelector('top-of-page'));
            var el = $compile('<login></login>');
            top.after(el);
          } else {
            var song = {
              author: $scope.loggedInUser,
              name: 'my song',
              chords: [],
              tempo: 80
            };
            var chordInputs = document.getElementsByClassName('note-input');
            for (var i = 0; i < chordInputs.length; i++) {
              var chordString = chordInputs[i]['value'];
              var noteArray = chordString.split(' ');
              song.chords.push(noteArray);
            }
            console.log(song);
            $http({
              method: 'POST',
              url: 'api/savesong',
              data: song
            }).success(function(response) {
              console.log(response);
            });
          }
        }
      }
    }
  });

  app.directive('songName', function() {
    return {
      restrict: 'E',
      templateUrl: '../angular/songname.html',
      controller: function($scope) {
        $scope.songName = 'Song Name';
        $scope.addQuotes = function() {
          if ($scope.songName.charAt(0) != '"' && $scope.songName.charAt(-1) != '"') {
            $scope.songName = '"' + $scope.songName + '"';
          }
        }
        $scope.stripQuotes = function() {
          var str = $scope.songName;
          $scope.songName = str.slice(1, str.length - 1);
          console.log(str);
        }
      }
    }
  });

})();


// this function

window.onkeyup = function(event) {
  var key = event.keyCode ? event.keyCode : event.which;
  if (key === 80 && hotKeysOn) {
    var chordInputs = document.getElementsByClassName('note-input');
    var howManyChords = chordInputs.length;
    var chordCounter = 0;
    // play first chord immediately
    var chordString = chordInputs[0]['value'];
    var noteArray = chordString.split(' ');
    soundChord(noteArray[0], noteArray[1], noteArray[2]);
    chordCounter++;
    // then play the the other chords at tempo
    var delay = 2000;
    var playIntervalID = window.setInterval(playChords, delay);
    function playChords() {
      var chordString = chordInputs[chordCounter]['value'];
      var noteArray = chordString.split(' ');
      soundChord(noteArray[0], noteArray[1], noteArray[2]);
      chordCounter++;
      if (chordCounter === howManyChords) {
        clearInterval(playIntervalID);
      }
    }
  }
}



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
  gainNode.gain.value = 0.05;

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

  switch (note2) {
    case 'A#':
    case 'Bb':
      third = 116.54;
      break;
    case 'AX':
    case 'B':
    case 'Cb':
      third = 123.47;
      break;
    case 'B#':
    case 'C':
    case 'Dbb':
      third = 130.81;
      break;
    case 'C#':
    case 'Db':
      third = 138.59;
      break;
    case 'CX':
    case 'D':
    case 'Ebb':
      third = 146.83;
      break;
    case 'D#':
    case 'Eb':
      third = 155.56;
      break;
    case 'DX':
    case 'E':
    case 'Fb':
      third = 164.81;
      break;
    case 'E#':
    case 'F':
    case 'Gbb':
      third = 174.61;
      break;
    case 'F#':
    case 'Gb':
      third = 185.00;
      break;
    case 'FX':
    case 'G':
    case 'Abb':
      third = 196.00;
      break;
    case 'G#':
    case 'Ab':
      third = 207.65;
      break;
    case 'Bbb':
    case 'A':
    case 'GX':
      third = 220.00;
      break;
    default:
      third = 0;
  }

  switch (note3) {
    case 'B#':
    case 'C':
    case 'Dbb':
      fifth = 130.81;
      break;
    case 'C#':
    case 'Db':
      fifth = 138.59;
      break;
    case 'CX':
    case 'D':
    case 'Ebb':
      fifth = 146.83;
      break;
    case 'D#':
    case 'Eb':
      fifth = 155.56;
      break;
    case 'DX':
    case 'E':
    case 'Fb':
      fifth = 164.81;
      break;
    case 'E#':
    case 'F':
    case 'Gbb':
      fifth = 174.61;
      break;
    case 'F#':
    case 'Gb':
      fifth = 185.00;
      break;
    case 'FX':
    case 'G':
    case 'Abb':
      fifth = 196.00;
      break;
    case 'G#':
    case 'Ab':
      fifth = 207.65;
      break;
    case 'Bbb':
    case 'A':
    case 'GX':
      fifth = 220.00;
      break;
    case 'A#':
    case 'Bb':
      fifth = 233.08;
      break;
    case 'AX':
    case 'B':
    case 'Cb':
      fifth = 246.94;
      break;
    default:
      fifth = 0;
  }

    // root
    osc1.frequency.value = root;
    osc1.start();
    // third
    osc2.frequency.value = third;
    osc2.start();
    // fifth
    osc3.frequency.value = fifth;
    osc3.start();

    setTimeout(function() {
      gainNode.gain.value = 0;
    }, 1900);

    setTimeout(function() {
      audioContext.close();
    }, 2000);
}
