'use strict';

angular.module('referendaApp', ['ui.router','ngResource','ngDialog', 'ngCookies', 'ngSanitize', 'swaggerUi', 'nvd3',
                                'ngAnimate', 'ngTouch', 'ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider

            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })

            // route for the profile page
            .state('app.profile', {
                url:'profile',
                views: {
                    'content@': {
                        templateUrl : 'views/profile.html',
                        controller  : 'ProfileController'
                    }
                }
            })

            // route for the aboutus page
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html',
                        controller  : 'AboutController'
                    }
                }
            })

            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'
                    }
                }
            })

            // route for the results page
            .state('app.result', {
                url: 'result',
                views: {
                    'content@': {
                        templateUrl : 'views/result.html',
                        controller  : 'ResultController'
                    }
                }
            })

            // route for the delegate vote page
            .state('app.delegate', {
                url: 'delegate',
                views: {
                    'content@': {
                        templateUrl : 'views/delegate.html',
                        controller  : 'DelegateController'
                    }
                }
            })


            // route for the stats page
            .state('app.stats', {
                url: 'stats',
                views: {
                    'content@': {
                        templateUrl : 'views/stats.html',
                        controller  : 'StatsController'
                    }
                }
            })



            // route for the lawdetail page
            .state('app.lawdetails', {
                url: 'law/:slug',
                views: {
                    'content@': {
                        templateUrl : 'views/lawdetail.html',
                        controller  : 'LawDetailController'
                   }
                }
            })

            // route for the data protection page
            .state('app.dataprotection', {
                url: 'dataprotection',
                views: {
                    'content@': {
                        templateUrl : 'views/dataprotection.html',
                        controller  : 'DataProtectionController'
                   }
                }
            })

            // route for the data protection page
            .state('app.cookies', {
                url: 'cookies',
                views: {
                    'content@': {
                        templateUrl : 'views/cookies.html',
                        controller  : 'CookiesController'
                   }
                }
            })

            // route for the developers page
            .state('app.developers', {
                url: 'developers',
                views: {
                    'content@': {
                        templateUrl : 'views/developers.html',
                        controller  : 'DevelopersController'
                   }
                }
            })

            // route for the debug api page
            .state('app.debug', {
                url: 'debug',
                views: {
                    'content@': {
                        templateUrl : 'views/debug.html',
                        controller  : 'DebugController'
                   }
                }
            })

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    })
;