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

recipesControllers.controller('RecipeEditCtrl',
    ['$scope', '$routeParams', 'Recipe',
        function RecipeViewCtrl($scope, $routeParams, Recipe) {
            var recipeId = $routeParams.id;

            Recipe.get({id: recipeId},
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.recipe = response;
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                })
        }]);


recipesControllers.controller('NewRecipeCtrl',
    ['$scope', 'Recipe', '$location', '$http', 'getToken',
        function NewBlogPostCtrl($scope, Recipe, $location, $http, getToken) {
            $scope.submit = function() {
                $scope.sub = true;
                $http.defaults.headers.common['Authorization'] = 'Basic ' +
                    getToken();

                var postData = {
                    name: $scope.name,
                    origin: $scope.origin,
                    ingredients: $scope.ingredients,
                    method: $scope.method
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
