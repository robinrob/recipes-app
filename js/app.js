var jQuery = require ('../bower_components/jquery-ui/jquery-ui.min.js')
var _ = require('../bower_components/lodash/lodash.min.js')
require('../bower_components/angular-aside/dist/js/angular-aside.min.js')

var recipesApp = angular.module('recipesApp', [
    'ngRoute',
    'recipesControllers',
    'recipesServices',
    'recipesDirectives'
])

recipesApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'RecipesCtrl'
            })
            .when('/recipes/:id', {
                templateUrl: 'partials/recipe.html',
                controller: 'RecipeViewCtrl'
            })
            .when('/recipes/:id/edit', {
                templateUrl: 'partials/editRecipe.html',
                controller: 'RecipeEditCtrl'
            })
            .when('/newRecipe', {
                templateUrl: 'partials/newRecipe.html',
                controller: 'NewRecipeCtrl'
            })

        $locationProvider.html5Mode(false).hashPrefix('!');
    }])