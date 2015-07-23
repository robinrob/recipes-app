'use strict';

var recipesControllers = angular.module('recipesControllers', [])

recipesControllers.controller('RecipesCtrl', ['$scope', 'RecipeList', '$location',
    function RecipeCtrl($scope, RecipeList, $location) {

        RecipeList.get({},
            function success(response) {
                console.log("Success:" + JSON.stringify(response));
                $scope.recipeList = response;
            },
            function error(errorResponse) {
                console.log("Error:" + JSON.stringify(errorResponse));
            }
        );
    }])

recipesControllers.controller('RecipeViewCtrl',
    ['$scope', '$routeParams', 'Recipe',
        function RecipeViewCtrl($scope, $routeParams, Recipe) {
            var recipeId = $routeParams.id;

            Recipe.get({id: recipeId},
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.recipeEntry = response;
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                })
        }]);