'use strict';

var recipeControllers = angular.module('recipesControllers', [])

recipeControllers.controller('RecipeCtrl', ['$scope', 'RecipeList', '$location',
    function RecipeCtrl($scope, RecipeList, checkCreds, $location) {

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

recipeControllers.controller('RecipeViewCtrl',
    ['$scope', '$routeParams', 'Recipe', 'checkCreds',
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

