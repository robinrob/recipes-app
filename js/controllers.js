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
    ['$scope', '$routeParams', '$location', 'Recipe',
        function RecipeViewCtrl($scope, $routeParams, $location, Recipe) {
            var recipeId = $routeParams.id;

            $scope.edit = function() {
                $location.path('recipes/' + recipeId + '/edit')
            }

            Recipe.get({id: recipeId},
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.recipe = response;
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                })
        }]);

recipesControllers.controller('RecipeEditCtrl',
    ['$scope', '$routeParams', '$location', 'Recipe',
        function RecipeViewCtrl($scope, $routeParams, $location, Recipe) {
            var recipeId = $routeParams.id;

            Recipe.get({id: recipeId},
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.recipe = response;
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                })

            $scope.submit = function() {
                var putData = {
                    recipe: $scope.recipe
                };
                Recipe.update({id: recipeId}, putData,
                    function success(response) {
                        console.log("Success:" + JSON.stringify(response));
                        $location.path('/recipes/' + recipeId);
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                    })
            }
        }]);


recipesControllers.controller('NewRecipeCtrl',
    ['$scope', 'Recipe', '$location', '$http', 'getToken',
        function NewBlogPostCtrl($scope, Recipe, $location, $http, getToken) {
            $scope.submit = function() {
                $scope.sub = true;
                $http.defaults.headers.common['Authorization'] = 'Basic ' +
                    getToken();

                var postData = {
                    recipe: {
                        "name": $scope.name,
                        "origin": $scope.origin,
                    }
                };

                Recipe.save({}, postData,
                    function success(response) {
                        console.log("Success:" + JSON.stringify(response));
                        $location.path('/');
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                    });
            };
        }]);
