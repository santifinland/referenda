'use strict';

angular.module('referendaApp')
.constant("baseURL", "https://referenda.es:3443/api/")

.factory('lawFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "laws/:id", null, {
            'update': {
                method: 'PUT'
            }
        });

}])

.factory('voteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "laws/:id/votes/:voteId", {id:"@Id", voteId:"@VoteId"}, {
            'update': {
                method: 'PUT'
            }
        });
}])

.factory('commentVoteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "laws/:id/comments/:commentId/votes", {id:"@Id", commentId: "@CommentId"}, {
            'update': {
                method: 'PUT'
            }
        });
}])

.factory('partyFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "parties/:id", null, {
        });

}])

.factory('delegatePartyFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "users/delegateparty", {
        });
}])

.factory('delegateUserFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "users/delegateuser/:id", {id:"@Id"}, {
        });
}])

.factory('userFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "users/find/:username", {username:"@username"}, {
        });
}])

.factory('commentFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        return $resource(baseURL + "laws/:id/comments/:commentId", {id:"@Id", commentId: "@CommentId"}, {
            'update': {
                method: 'PUT'
            }
        });
}])

.factory('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource(baseURL + "feedback/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
}])

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog',
         function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){

    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;


  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.username != undefined) {
      useCredentials(credentials);
    }
  }

  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }

  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;

    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }

    authFac.login = function(loginData) {

        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token});
              isAuthenticated = true;
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
              isAuthenticated = false;

              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'

                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        );
    };

    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response){
        });
        destroyUserCredentials();
        $rootScope.$broadcast('logout:Successful');
    };

    authFac.register = function(registerData) {

        $resource(baseURL + "users/register")
        .save(registerData,
           function(response) {
              authFac.login({username:registerData.username, password:registerData.password});
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password});
            }

              $rootScope.$broadcast('registration:Successful');
           },
           function(response){

              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message +
                  '</p><p>' + response.data.err.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }

        );
    };

    authFac.checkLogged = function checkLogged() {
        $resource(baseURL + "users/logged")
            .get(function(response) {
                isAuthenticated = true;
                $rootScope.$broadcast('logged:Successful');
            }, function (response) {
                isAuthenticated = false;
                $rootScope.$broadcast('logged:Failure');
            })
    };

    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };

    authFac.getUsername = function() {
        return username;
    };

    loadUserCredentials();

    return authFac;

}])
;
