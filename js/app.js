'use strict'

var recipesApp = angular.module('recipesApp', [
    'ngRoute',
    'recipesControllers',
    'recipesServices'
])

recipesApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'Recipes'
            })
            .when('/recipes/:id', {
                templateUrl: 'partials/recipe.html',
                controller: 'RecipeView'
            })

        $locationProvider.html5Mode(false).hashPrefix('!');
    }])
