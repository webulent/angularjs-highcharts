/**
 * Created by bulent on 17.05.2016.
 */

myApp.directive("footerview", function () {
    return {
        restrict: 'A',
        templateUrl: 'footer.html',
        scope: true,
        transclude: false,
        controller: 'FooterController'
    };
});

myApp.controller("FooterController", function ($scope, $timeout) {
    // Footer action...





});