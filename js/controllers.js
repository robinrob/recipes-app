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
            $scope.newIngredient = ""

            Recipe.get({id: recipeId},
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.recipe = response;
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                })

            $scope.removeIngredient = function(ingredient) {
                $scope.recipe.ingredients = jQuery.grep($scope.recipe.ingredients,
                    function(value) {
                        return value != ingredient;
                    }
                );
            }

            $scope.saveIngredient = function() {
                $scope.recipe.ingredients.push({name: "Robin", amount: 1, unit: "quantity"})
                $scope.newIngredient = ""
            }

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
                        console.log("Error:" + angular.toJson(errorResponse));
                    })
            }
        }]);


recipesControllers.controller('NewRecipeCtrl',
    ['$scope', '$routeParams', '$location', 'Recipe',
        function RecipeViewCtrl($scope, $routeParams, $location, Recipe) {
            var recipeId = $routeParams.id;
            var newIngredient = {name: "", unit: "", quantity: "" }
            var newStage = { description: "", steps: [""] }

            $scope.recipe = {name: "", origin: "", ingredients: [$.extend({}, newIngredient)], method: [$.extend({}, newStage)]}

            $scope.addIngredient = function() {
                $scope.recipe.ingredients.push($.extend({}, newIngredient))
            }

            $scope.addStage = function() {
                $scope.recipe.method.push($.extend({}, newStage))
            }

            $scope.removeIngredient = function(ingredient) {
                $scope.recipe.ingredients = jQuery.grep($scope.recipe.ingredients,
                    function(value) {
                        return value != ingredient;
                    }
                );
            }

            $scope.addStep = function(stage) {
                var wanker = jQuery.grep($scope.recipe.method,
                    function(value) {
                        return value == stage;
                    }
                )[0].steps.push("")
            }

            $scope.removeStage = function(stage) {
                $scope.recipe.ingredients = jQuery.grep($scope.recipe.method,
                    function(value) {
                        return value != stage;
                    }
                );
            }

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
                        console.log("Error:" + angular.toJson(errorResponse));
                    })
            }
        }]);