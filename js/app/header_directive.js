/**
 * Created by bulent on 17.05.2016.
 */

myApp.directive("headerview", ['$parse', '$http', '$compile', '$templateCache', function ($parse, $http, $compile, $templateCache) {

    if (sessionStorage.loginSucceeded == false || sessionStorage.loginSucceeded == null) {
        return {
            restrict: 'A',
            templateUrl: 'login-header.html',
            scope: true,
            transclude: false,
            controller: 'LoginHeaderController'
        };
    } else {
        return {
            restrict: 'A',
            templateUrl: 'header.html',
            scope: {
                name: "@",
                color: "=",
                reverse: "&"
            },
            transclude: false,
            controller: 'HeaderController'
        };
    }
}]);

myApp.controller("HeaderController", function ($scope, $rootScope, authService) {
    $scope.pagetitle = "Sales Management";
    $scope.username = sessionStorage.username;
    $scope.logout = function ($scope) {
        authService.logout();
    }
});

myApp.controller("LoginHeaderController", function ($scope, $rootScope) {
    $rootScope.pagetitle = "Welcome to Sales Management Web Application Example";

});