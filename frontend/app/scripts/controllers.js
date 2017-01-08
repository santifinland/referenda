'use strict';

angular.module('referendaApp')

.controller('ProfileController', ['$scope', function ($scope) {

    $scope.showProfile = false;
}])

.controller('ContactController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.sendFeedback = function () {


        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
        }
    };
}])

.controller('LawDetailController', ['$scope', '$state', '$stateParams', 'lawFactory', 'commentFactory', 'voteFactory',
            'commentVoteFactory','ngDialog',
            function ($scope, $state, $stateParams, lawFactory, commentFactory, voteFactory, commentVoteFactory,
                ngDialog) {

    $scope.law = {};
    $scope.showLaw = false;
    $scope.resultsCongreso = false;
    $scope.message = "Loading ...";

    $scope.law = lawFactory.get({
            slug: $stateParams.slug
        })
        .$promise.then(
            function (response) {
                $scope.law = response;
                $scope.showLaw = true;
                var today = new Date();
                if (new Date($scope.law.vote_end) < today) $scope.resultsCongreso = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.mycomment = {
        comment: ""
    };

    $scope.submitComment = function () {

        commentFactory
            .save({slug: $stateParams.slug}, $scope.mycomment)
            .$promise.then(function(res) {
                $state.go($state.current, {}, {reload: true});
            });

        $scope.mycomment = {
            comment: ""
        };
    }

    $scope.submitCommentVote = function (commentId, vote) {
        $scope.mycommentvote = {
            vote: vote
        };
        commentVoteFactory
            .save({slug: $stateParams.slug, commentId: commentId}, $scope.mycommentvote,
                function (response) {
                    $scope.law = response;
                    $state.go($state.current, {}, {reload: true});
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
    }

    $scope.submitVoteYes = function () {
        $scope.myvoteyes = {
            vote: 1,
        };
        voteFactory
            .save({slug: $stateParams.slug}, $scope.myvoteyes)
            .$promise.then(function(res) {
                $scope.law.positive = res.positive;
                $scope.law.negative = res.negative;
                $scope.law.abstention = res.abstention;
            }, function(error) {
                $scope.loggedIn = false;
                ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default',
                    controller:"LoginController" });
            });
    }

    $scope.submitVoteNo = function () {
        $scope.myvoteno = {
            vote: 2,
        };
        voteFactory
            .save({slug: $stateParams.slug}, $scope.myvoteno)
            .$promise.then(function(res) {
                $scope.law.positive = res.positive;
                $scope.law.negative = res.negative;
                $scope.law.abstention = res.abstention;
            }, function(error) {
                $scope.loggedIn = false;
                ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default',
                    controller:"LoginController" });
            });
    }

    $scope.submitVoteAbstention = function () {
        $scope.myvoteabstention = {
            vote: 3,
        };
        voteFactory
            .save({slug: $stateParams.slug}, $scope.myvoteabstention)
            .$promise.then(function(res) {
                $scope.law.positive = res.positive;
                $scope.law.negative = res.negative;
                $scope.law.abstention = res.abstention;
            }, function(error) {
                $scope.loggedIn = false;
                ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default',
                    controller:"LoginController" });
            });
    }
}])

.controller('DelegateController', ['$scope', '$rootScope', '$state', '$stateParams', 'delegatePartyFactory',
            'partyFactory', 'AuthFactory', 'userFactory', 'delegateUserFactory',
            function ($scope, $rootScope, $state, $stateParams, delegatePartyFactory, partyFactory, AuthFactory,
                      userFactory, delegateUserFactory) {
    $scope.delegation = "none";
    $scope.party = {};
    $scope.delegatedUser = {};
    $scope.message = "Loading ...";
    $scope.loggedIn = false;
    AuthFactory.checkLogged();

    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
    }

    $rootScope.$on('logout:Successful', function () {
        $scope.loggedIn = false;
    });

    $rootScope.$on('login:Successful', function () {
        $scope.party = delegatePartyFactory.get(
            function (response) {
                $scope.party = response;
                $scope.delegation = "party";
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
        $scope.delegatedUser = delegateUserFactory.get(
                function (response) {
                    $scope.delegatedUser = response;
                    $scope.delegation = "user";
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
        $scope.loggedIn = true;
    });

    $rootScope.$on('logged:Successful', function () {
        $scope.party = delegatePartyFactory.get(
            function (response) {
                $scope.party = response;
                $scope.delegation = "party";
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
        $scope.delegatedUser = delegateUserFactory.get(
            function (response) {
                $scope.delegatedUser = response;
            $scope.delegation = "user";
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
        $scope.loggedIn = true;
    });

    $rootScope.$on('logged:Failure', function () {
        $scope.loggedIn = false;
    });

    $scope.submitDelegatePartyPP = function () {
        delegatePartyFactory
            .save({ party: "pp"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyPsoe = function () {
        delegatePartyFactory
            .save({ party: "psoe"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyPodemos = function () {
        delegatePartyFactory
            .save({ party: "podemos"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyCiudadanos = function () {
        delegatePartyFactory
            .save({ party: "ciudadanos"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyErc = function () {
        delegatePartyFactory
            .save({ party: "erc"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyPnv = function () {
        delegatePartyFactory
            .save({ party: "pnv"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyCC = function () {
        delegatePartyFactory
            .save({ party: "cc"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyNC = function () {
        delegatePartyFactory
            .save({ party: "nc"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyCompromis = function () {
        delegatePartyFactory
            .save({ party: "compromis"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyFA = function () {
        delegatePartyFactory
            .save({ party: "fa"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyUpn = function () {
        delegatePartyFactory
            .save({ party: "upn"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyBildu = function () {
        delegatePartyFactory
            .save({ party: "bildu"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "party";
            });
    }
    $scope.submitDelegatePartyNoDelegar = function () {
        delegatePartyFactory
            .save({ party: "nd"})
            .$promise.then(function(res) {
                $scope.party = res;
                $scope.delegation = "none";
            });
    }

    $scope.submitDelegateUser = function (username) {
        delegateUserFactory
            .save({ username: username},
                function (response) {
                    console.log(response);
                    $scope.delegatedUser = response;
                    $scope.delegation = "user";
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
    }

    function getUsers(username){
        userFactory.query({
            username: username
        })
        .$promise.then(
            function (response) {
                $scope.users = response;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
    }

    $scope.search = '';
    var regex;
    $scope.$watch('search', function (value) {
        if (value.length > 3) {
            getUsers(value);
        } else {
            $scope.users = [];
        }
    });
}])

// implement the IndexController and About Controller here

.controller('HomeController', ['$scope', 'lawFactory', 'voteFactory',
            function ($scope, lawFactory, voteFactory) {

    $scope.showLaws = false;
    $scope.message = "Cargando leyes ...";

    lawFactory.query(
        function (response) {
            $scope.laws = response;
            if ($scope.laws.length < 1) {
                $scope.showLaws = false;
                $scope.message = "Esta semana no se debaten propuestas en el pleno del Congreso de los Diputados.";
                $scope.message2 = "Puedes consultar las votaciones anteriores en la pestaña de Resultados.";
            } else {
                $scope.showLaws = true;
            }
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
}])

.controller('ResultController', ['$scope', 'lawFactory', function ($scope, lawFactory) {

    $scope.showLaws = false;
    $scope.message = "Loading ...";

    lawFactory.query({"results": "true"},
        function (response) {
            $scope.laws = response;
            $scope.showLaws = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );
}])

.controller('DataProtectionController', ['$scope', function ($scope) {
}])

.controller('CookiesController', ['$scope', function ($scope) {
}])

.controller('DevelopersController', ['$scope', function ($scope) {
}])

.controller('DebugController', ['$scope', function ($scope) {
}])

.controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {

    $scope.leaders = corporateFactory.query();

}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', '$timeout', '$cookies',
            function ($scope, $state, $rootScope, ngDialog, AuthFactory, $timeout, $cookies) {

    $scope.loggedIn = false;
    $scope.username = '';
    AuthFactory.checkLogged();

    $scope.cookiesConsent = $cookies.get('cookieConsent');

    $scope.consentCookie = function () {
        $cookies.put('cookieConsent', true);
        $scope.cookiesConsent = $cookies.get('cookieConsent');
    }

    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }

    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };

    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $timeout(callAtTimeout, 6 * 60 * 60 * 1000);
    });

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $rootScope.$on('logged:Successful', function () {
        $scope.loggedIn = true;
    });

    $rootScope.$on('logged:Failure', function () {
        $scope.loggedIn = false;
    });

    $scope.stateis = function(curstate) {
       return $state.is(curstate);
    };

    function callAtTimeout() {
        AuthFactory.checkLogged();
    }

}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory',
    function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo','{}');

    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default',
        controller:"RegisterController" });
    };

}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory',
    function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.usernameEmpty = false;
    $scope.passwordMatch = true;
    $scope.usernameLabel = "Nombre de usuario";
    $scope.passwordLabel = "Contraseña";
    $scope.register={};
    $scope.loginData={};
    $scope.registration = {} ;
    $scope.registration.password == null;
    $scope.registration.username == null;

    $scope.doRegister = function() {
        if ($scope.registration.password == null || $scope.registration.password.length == 0 ||
            $scope.registration.password != $scope.registration.password_confirmation ||
            $scope.registration.username == null) {
            if($scope.registration.username == null || $scope.registration.username.length == 0) {
                $scope.usernameEmpty = true;
                $scope.usernameLabel = "Nombre de usuario: el nombre de usuario está vacío";
            } else {
                $scope.usernameEmpty = false;
                $scope.usernameLabel = "Nombre de usuario";
            }
            if ($scope.registration.password != $scope.registration.password_confirmation) {
                $scope.passwordMatch = false;
                $scope.passwordLabel = "Contraseña: las contraseñas no coinciden.";
            } else {
                $scope.passwordMatch = true;
                $scope.passwordLabel = "Contraseña";
            }
            if ($scope.registration.password == null || $scope.registration.password.length == 0) {
                $scope.passwordMatch = false;
                $scope.passwordLabel = "Contraseña: la contraseña está vacía";
            }
        } else {
            $scope.passwordMatch = true;
            $scope.passwordLabel = "Contraseña";
            $scope.usernameEmpty = false;
            $scope.usernameLabel = "Nombre de usuario";
            if ($scope.acceptLOPD) {
                AuthFactory.register($scope.registration);
                ngDialog.close();
            }
        }
    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default',
        controller:"RegisterController" });
    };
}])
;