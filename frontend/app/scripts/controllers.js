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

        $scope.commentForm.$setPristine();

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
            .$promise.then(function(res) {$state.go($state.current, {}, {reload: true});});
    }

    $scope.submitVoteYes = function () {
        $scope.myvoteyes = {
            vote: 1,
        };
        voteFactory
            .save({id: $stateParams.id}, $scope.myvoteyes)
            .$promise.then(function(res) {
                $state.go($state.current, {}, {reload: true});
            }, function(error) {
                console.log("in error");
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
            .$promise.then(function(res) {$state.go($state.current, {}, {reload: true});});
    }

    $scope.submitVoteAbstention = function () {
        $scope.myvoteabstention = {
            vote: 3,
        };
        voteFactory
            .save({id: $stateParams.id}, $scope.myvoteabstention)
            .$promise.then(function(res) {$state.go($state.current, {}, {reload: true});});
    }

}])

.controller('DelegateController', ['$scope', '$state', '$stateParams', 'userFactory', 'partyFactory',
            function ($scope, $state, $stateParams, userFactory, partyFactory) {
    $scope.party = {};
    $scope.showDelegatedParty = false;
    $scope.message = "Loading ...";

    $scope.party = userFactory.get({
        id: $stateParams.id
    })
    .$promise.then(
        function (response) {
            console.log(response.id);
            $scope.partyId = response.id;
            $scope.party = partyFactory.get({
                id: $scope.partyId
            })
            .$promise.then(
                function (response) {
                    console.log(response);
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
        userFactory.save({ party: "pp"});
        $state.go($state.current, {}, {reload: true});
    }
    $scope.submitDelegatePartyPsoe = function () {
        userFactory.save({ party: "psoe"});
        $state.go($state.current, {}, {reload: true});
    }
    $scope.submitDelegatePartyPodemos = function () {
        userFactory.save({ party: "podemos"});
        $state.go($state.current, {}, {reload: true});
    }
    $scope.submitDelegatePartyCiudadanos = function () {
        userFactory.save({ party: "ciudadanos"});
        $state.go($state.current, {}, {reload: true});
    }
    $scope.submitDelegatePartyErc = function () {
        userFactory.save({ party: "erc"});
        $state.go($state.current, {}, {reload: true});
    }
    $scope.submitDelegatePartyPnv = function () {
        userFactory.save({ party: "pnv"});
        $state.go($state.current, {}, {reload: true});
    }
    $scope.submitDelegatePartyMixto = function () {
        userFactory.save({ party: "mixto"});
        $state.go($state.current, {}, {reload: true});
    }

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
        $timeout(callAtTimeout, 40000);
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
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);

        ngDialog.close();

    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
}])
;