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
    $scope.message = "Loading ...";

    $scope.law = lawFactory.get({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.law = response;
                $scope.showLaw = true;
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
            .save({id: $stateParams.id}, $scope.mycomment)
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
            .save({id: $stateParams.id, commentId: commentId}, $scope.mycommentvote)
            .$promise.then(function(res) {
                $scope.law = res;
            });
    }

    $scope.submitVoteYes = function () {
        $scope.myvoteyes = {
            vote: 1,
        };
        voteFactory
            .save({id: $stateParams.id}, $scope.myvoteyes)
            .$promise.then(function(res) {
                $scope.law = res;
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
            .save({id: $stateParams.id}, $scope.myvoteno)
            .$promise.then(function(res) {
                $scope.law = res;
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
            .save({id: $stateParams.id}, $scope.myvoteabstention)
            .$promise.then(function(res) {
                $scope.law = res;
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
    $scope.party = {};
    $scope.showDelegatedParty = false;
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
        $scope.party = delegatePartyFactory.get({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.partyId = response.id;
                $scope.party = partyFactory.get({
                    id: $scope.partyId
                })
                .$promise.then(
                    function (response) {
                        $scope.party = response;
                        $scope.showDelegatedParty = true;
                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
        $scope.loggedIn = true;
    });

    $rootScope.$on('logged:Successful', function () {
        $scope.party = delegatePartyFactory.get({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.partyId = response.id;
                $scope.party = partyFactory.get({
                    id: $scope.partyId
                })
                .$promise.then(
                    function (response) {
                        $scope.party = response;
                        $scope.showDelegatedParty = true;
                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
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

    $scope.party = delegatePartyFactory.get({
        id: $stateParams.id
    })
    .$promise.then(
        function (response) {
            $scope.partyId = response.id;
            $scope.party = partyFactory.get({
                id: $scope.partyId
            })
            .$promise.then(
                function (response) {
                    $scope.party = response;
                    $scope.showDelegatedParty = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

    $scope.submitDelegatePartyPP = function () {
        delegatePartyFactory
            .save({ party: "pp"})
            .$promise.then(function(res) {
                $scope.party = res;
            });
    }
    $scope.submitDelegatePartyPsoe = function () {
        delegatePartyFactory
            .save({ party: "psoe"})
            .$promise.then(function(res) {
                $scope.party = res;
            });
    }
    $scope.submitDelegatePartyPodemos = function () {
        delegatePartyFactory
            .save({ party: "podemos"})
            .$promise.then(function(res) {
                $scope.party = res;
            });
    }
    $scope.submitDelegatePartyCiudadanos = function () {
        delegatePartyFactory
            .save({ party: "ciudadanos"})
            .$promise.then(function(res) {
                $scope.party = res;
            });
    }
    $scope.submitDelegatePartyErc = function () {
        delegatePartyFactory
            .save({ party: "erc"})
            .$promise.then(function(res) {
                $scope.party = res;
            });
    }
    $scope.submitDelegatePartyPnv = function () {
        delegatePartyFactory
            .save({ party: "pnv"})
            .$promise.then(function(res) {
                $scope.party = res;
            });
    }
    $scope.submitDelegatePartyMixto = function () {
        delegatePartyFactory
            .save({ party: "mixto"})
            .$promise.then(function(res) {
                $scope.party = res;
            });
    }

    $scope.delegatedUser = delegateUserFactory.get({
        id: $stateParams.id
    })
    .$promise.then(
        function (response) {
            $scope.delegatedUSer = response;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

    $scope.submitDelegateUser = function (id) {
        delegateUserFactory
            .save({ id: id})
            .$promise.then(function(res) {
            });
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
    $scope.message = "Loading ...";

    lawFactory.query(
        function (response) {
            $scope.laws = response;
            $scope.showLaws = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
}])

.controller('ResultController', ['$scope', function ($scope) {
}])

.controller('DataProtectionController', ['$scope', function ($scope) {
}])

.controller('CookiesController', ['$scope', function ($scope) {
}])

.controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {

    $scope.leaders = corporateFactory.query();

}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', '$timeout',
            function ($scope, $state, $rootScope, ngDialog, AuthFactory, $timeout) {

    $scope.loggedIn = false;
    $scope.username = '';
    AuthFactory.checkLogged();

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

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo','{}');

    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };

}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.register={};
    $scope.loginData={};

    $scope.doRegister = function() {
        AuthFactory.register($scope.registration);
        ngDialog.close();
    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
}])
;