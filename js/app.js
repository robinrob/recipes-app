global.jQuery = require ('../bower_components/jquery/dist/jquery.min.js')
global._ = require('../bower_components/lodash/lodash.min.js')

require('../bower_components/jquery-ui/jquery-ui.min.js')
require('../bower_components/angular/angular.min.js')
require('../bower_components/angular-route/angular-route.min.js')
require('../bower_components/angular-resource/angular-resource.min.js')
require('../bower_components/angular-aside/dist/js/angular-aside.min.js')
require('../bower_components/angular-animate/angular-animate.min.js')
require('../bower_components/angular-bootstrap/ui-bootstrap.min.js')

require('./services.js')
require('./controllers.js')
require('./directives.js')

var recipesApp = angular.module('recipesApp', [
    'ngRoute',
    'ui.bootstrap',
    'recipesControllers',
    'recipesServices',
    'recipesDirectives'
])

recipesApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/sidebarPage.html',
                controller: 'SidebarPageCtrl'
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