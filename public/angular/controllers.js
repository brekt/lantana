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
      url: 'api/login',
      data: {username: username, password: password},
    }).success(function(data) {
        console.log(data);
    });
  };
});
