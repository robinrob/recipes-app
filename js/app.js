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

        $locationProvider.html5Mode(false).hashPrefix('!');
    }])
