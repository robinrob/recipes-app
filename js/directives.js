'use strict'

var recipeDirectives = angular.module('recipeDirectives', [])

recipeDirectives.directive('recipeMenu', function() {
    return {
        restrict: 'A',
        templateUrl: 'partials/menu.html',
        link: function(scope, el, attrs) {
            scope.label = attrs.menuTitle
        }
    }
})