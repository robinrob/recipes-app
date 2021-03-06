var recipesDirectives = angular.module('recipesDirectives', [])

recipesDirectives.directive('recipesNav', function() {
    return {
        restrict: 'A',
        templateUrl: 'partials/nav.html',
        link: function(scope, el, attrs) {
            scope.label = attrs.navTitle
        }
    }
})

recipesDirectives.directive('recipesSidebar', function() {
    return {
        restrict: 'A',
        templateUrl: 'partials/sidebar.html'
    }
})