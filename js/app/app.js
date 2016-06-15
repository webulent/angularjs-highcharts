/**
 * Created by bulent on 17.05.2016.
 */

var myApp = angular.module('myApp', ['ngRoute', 'ngCookies', 'highcharts-ng']);

myApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/home',
        {templateUrl: 'content.html', controller: 'MainController'}
    ).when('/login',
        {templateUrl: 'login.html', controller: 'LoginController'}
    ).otherwise(
        {redirectTo: '/home'}
    );
}).run(function ($rootScope, $location) {
    // login listener to watch route changes
    // console.log(sessionStorage.loginSucceeded);
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (sessionStorage.loginSucceeded == false || sessionStorage.loginSucceeded == null) {
            // no logged user, we should be going to #login
            if (next.templateUrl == "login.html") {
                // already going to #login, no redirect needed
                //console.log("already login.html");
            } else {
                // not going to #login, we should redirect now
                //console.log("redirect to login.html");
                $location.path("/login");
            }
        } else {
            // next.templateUrl == "content.html"
            //console.log("home page");
            $location.path("/home");
        }
    });
}).service('authService', function ($rootScope, $http, $window) {
    var svc = {};
    svc.login = function (data) {
        if (!data.loginSucceeded) {
            $rootScope.loginfailed = true;
            return;
        }
        sessionStorage.loginSucceeded = data.loginSucceeded;
        sessionStorage.username = data.username;
        sessionStorage.sessionId = data.sessionId;
        $rootScope.loginSucceeded = data.loginSucceeded;
        $rootScope.username = data.username;
        $rootScope.sessionId = data.sessionId;
        $window.location.reload();
    };
    svc.logout = function () {
        var wsparams = "sessionid=" + sessionStorage.sessionId;
        delete sessionStorage.loginSucceeded;
        delete sessionStorage.sessionId;
        delete sessionStorage.username;
        $rootScope.loginSucceeded = false;
        $rootScope.sessionId = null;
        $rootScope.username = null;
        $http.get("http://localhost:8080/logout?" + wsparams)
            .then(function (response) {
                // console.log(response.data);
                // logout...
            });
        $window.location.reload();
    };
    return svc;
}).service('webService', function ($rootScope, $http) {
    var ws = {};
    var service_url = 'http://localhost:8080';
    var sessionId = sessionStorage.sessionId;


    ws.salesManData = function () {
        var wsparams = "sessionid=" + sessionId;
        return $http.get(service_url + "/salesmandata?" + wsparams)
            .then(function (response) {
                //$rootScope.salesManDatachartConfig = response.data;
                return response.data;
            });
    };

    ws.lastYearData = function () {
        var wsparams = "sessionid=" + sessionId;
        return $http.get(service_url + "/lastyeardata?" + wsparams)
            .then(function (response) {
                //$rootScope.chartdata = response.data;
                return response.data;
            });
    };

    ws.topSalesOrders = function () {
        var wsparams = "sessionid=" + sessionId;
        return $http.get(service_url + "/topsalesorders?" + wsparams)
            .then(function (response) {
                $rootScope.chartdata = response.data;
                return response.data;
            });
    };

    ws.topSalesMen = function () {
        var wsparams = "sessionid=" + sessionId;
        return $http.get(service_url + "/topsalesmen?" + wsparams)
            .then(function (response) {
                $rootScope.chartdata = response.data;
                return response.data;
            });
    };

    return ws;
});


myApp.controller('MainController', function ($scope, webService) {

    // webService.salesManData();
    // webService.lastYearData();
    // webService.topSalesOrders();
    // webService.topSalesMen();

    $scope.show_chart1 = true;
    $scope.show_chart2 = true;
    $scope.show_chart3 = true;
    $scope.show_chart4 = true;

    $scope.charts = function(){
        $("#sortable .chart-content").resizable({
            handles: 'e, w'
        });

        $('#sortable .chart-content').resizable().bind({
            resizecreate: function (event, ui) {
                // console.log('C')
            },
            resizestart: function (event, ui) {
                // console.log('RS')
            },
            resize: function (event, ui) {
                // console.log('R')
            },
            resizestop: function (event, ui) {
                // var childScope=angular.element('#'+$(this).attr('id')).scope();
                // childScope.getData();
                $scope.$broadcast('highchartsng.reflow');
            }
        });

        $("#sortable").sortable({revert: false});
        var a = 3;
        $("#sortable .chart-content").draggable({
            containment: "parent",
            start: function(event, ui) { $(this).css("z-index", a++); }
        });

        $('#sortable .chart-content').click(function() {
            // $(this).addClass('top').removeClass('bottom');
            // $(this).siblings().removeClass('top').addClass('bottom');
            $(this).css("z-index",a++);

        });
        $("#sortable").disableSelection();
    };

    $scope.charts();

    $scope.closeChart = function (chart_id, value) {
        $scope[chart_id] = value;
        //console.log(chart_id);
    };
});


myApp.controller('salesManDataController', function ($scope, webService) {
    $scope.chart_title = "Sales Total per Sales Man";

    $scope.getData = function () {
        //salesManData
        ch1 = webService.salesManData();
        ch1.then(function (result) {
            var log = [];
            angular.forEach(result.data, function (value) {
                this.push({name: value[0], 'y': parseInt(value[1])});
            }, log);
            //console.log(angular.fromJson(log));
            $scope.salesManDatachartConfig = {
                options: {
                    chart: {
                        type: 'pie',
                        plotShadow: false
                    },
                    title: {
                        text: $scope.chart_title
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: true
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Sales',
                    data: angular.fromJson(log)
                }],
                loading: false
            };
        });
    };

    $scope.getData();
});


myApp.controller('lastYearDataController', function ($scope, webService) {
    $scope.chart_title = "Sales Total per Month";

    $scope.getData = function () {
        //lastYearData
        ch1 = webService.lastYearData();
        ch1.then(function (result) {
            //console.log(result);
            var log = [];
            var months = [];
            angular.forEach(result.data, function (value) {
                this.push({name: value[0], 'y': parseInt(value[1])});
            }, log);
            angular.forEach(result.data, function (value) {
                this.push(value[0]);
            }, months);
            //console.log(angular.fromJson(log));
            $scope.lastYearDatachartConfig = {
                options: {
                    chart: {
                        type: 'bar',
                        plotShadow: false
                    },
                    title: {
                        text: $scope.chart_title
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: true
                            },
                            showInLegend: true
                        }
                    }
                },
                series: [{
                    type: 'bar',
                    name: 'Sales',
                    data: angular.fromJson(log)
                }],
                xAxis: {
                    categories: angular.fromJson(months),
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Sales'
                    }
                },
                loading: false
            };
        });
    };

    $scope.getData();
});


myApp.controller('topSalesOrdersController', function ($scope, webService) {
    $scope.chart_title = "Top 5 Sales Order";

    $scope.getData = function () {
        //topSalesOrders
        ch1 = webService.topSalesOrders();
        ch1.then(function (result) {
            $scope.salesData = result.data;
        });
    };

    $scope.getData();
});

myApp.controller('topSalesMenController', function ($scope, webService) {
    $scope.chart_title = "Top 5 Sales Men";

    $scope.getData = function () {
        //topSalesOrders
        ch1 = webService.topSalesMen();
        ch1.then(function (result) {
            $scope.salesData = result.data;
        });
    };

    $scope.getData();
});


myApp.controller('LoginController', function ($scope, $rootScope, $http, $window, authService) {
    $scope.submitForm = function () {
        $http.get("http://localhost:8080/login?username=" + $scope.username + "&password=" + $scope.password)
            .then(function (response) {
                //console.log(response.data);
                if (response.data.loginSucceeded) {
                    response.data.username = $scope.username;
                }
                authService.login(response.data);
            });
    };
});

