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
          $scope.notesArray = $scope.notes.split(' ');
          console.log($scope.notesArray);

          // code imported from audiotest.html

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


          function soundChord(note1, note2, note3, note4, note5, note6, duration) {
              osc1.frequency.value = note1;
              osc2.frequency.value = note2;
              osc3.frequency.value = note3;
              osc4.frequency.value = note4;
              osc5.frequency.value = note5;
              osc6.frequency.value = note6;
              osc1.start();
              osc1.stop(audioContext.currentTime + 2);
              osc2.start();
              osc2.stop(audioContext.currentTime + 2);
              osc3.start();
              osc3.stop(audioContext.currentTime + 2);
              osc4.start();
              osc4.stop(audioContext.currentTime + 2);
              osc5.start();
              osc5.stop(audioContext.currentTime + 2);
              osc6.start();
              osc6.stop(audioContext.currentTime + 2);
          }

          soundChord(440, 600, 750, 900, 1050, 1300);

        };
      }
    };
  });

})();
