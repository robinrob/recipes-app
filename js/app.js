'use strict'

var recipesApp = angular.module('recipesApp', [
    'ngRoute',
    'recipesControllers'
])

recipesApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'Recipes'
            })
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
            })
            .when('/logout', {
                templateUrl: 'partials/login.html',
                controller: 'LogoutCtrl'
            })
            .when('/blogPost/:id', {
                templateUrl: 'partials/blogPost.html',
                controller: 'BlogViewCtrl'
            })

        $locationProvider.html5Mode(false).hashPrefix('!');
    }])
