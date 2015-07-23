var recipesServices = angular.module('recipesServices', ['ngResource'])

recipesServices.factory('Recipe', ['$resource', function($resource) {
    return $resource("http://localhost:4567/recipes/:id", {}, {
        get: {method: 'GET', cache: false, isArray: false},
        save: {method: 'POST', cache: false, isArray: false},
        update: {method: 'PUT', cache: false, isArray: false},
        delete: {method: 'DELETE', cache: false, isArray: false}
    });
}])

recipesServices.factory('RecipeList', ['$resource', function($resource) {
    return $resource("http://localhost:4567/recipes", {}, {
        get: {method: 'GET', cache: false, isArray: true}
    });

}]);