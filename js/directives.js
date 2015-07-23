'use strict'

var recipesDirectives = angular.module('recipesDirectives', [])

recipesDirectives.directive('recipesMenu', function() {
    return {
        restrict: 'A',
        templateUrl: 'partials/menu.html',
        link: function(scope, el, attrs) {
            scope.label = attrs.menuTitle
        }
    }
})