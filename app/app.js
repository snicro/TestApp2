
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('formApp', ['ngAnimate', 'ui.router'])

// configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider

        .state('appState', {
            url: '/{page:home|form|emplist|numberinput|about}',
            templateUrl: function ($stateParams) {
                    var page = $stateParams.page;
                return "app/components/" + page +"/" +page + '.html'
            },
            controllerProvider: function ($stateParams) {
                return $stateParams.page + 'Controller';
            }
        })

        .state('form', {
            abstract: true,
            url: '/form',
            templateUrl: 'app/components//form/form.html',
            controller: 'formController'
        })
        
        // nested state
        // each of these sections will have their own view
        // url will be nested (/form/1)
        // url: '/{page:(?:/[^/]+)?}'
        .state('form.step', {
            url: '/:step',
            templateUrl: function ($stateParams) {
                    var step = $stateParams.step;
                    if(!step){
                        step = 1;
                    }
                return 'app/components/form/partial/step' + step + '.html'
            }
        })

       
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/home');
})

// our services - used to pass data between controllers
// =============================================================================
.service("employee", function(){
    var employee = this;
})


// our controllers
// =============================================================================
.controller('formController', function($scope, $state, $stateParams, employee) {
    
    // we will store all of our form data in this object
    $scope.formData = employee;
    
    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');  
    };


    if($state.is('appState')){
        var step = $stateParams.step;  
        if(!step){
            step = 1;
        }      
        $state.go('form.step', { step : step });
    }
    
})

.controller('homeController', function($scope, employee) {
    
    $scope.homeData = employee;
})

.controller('aboutController', function($scope) {
    
    //nothing yet
})

.controller('numberinputController', function($scope) {
      $scope.items = [ { value: 100, weight: 33 }, { value: 100, weight: 33 }, { value: 100, weight: 33} ];

 $scope.sum = function() {
  var total=0;
    angular.forEach($scope.items , function(item){
        total+= parseInt(item.value);
    });

    angular.forEach($scope.items, function(item){
        item.weight = (item.value * 100)/total;
    });
 $scope.total = total;
  return total;
 }

 $scope.distribute = function(total) {
    angular.forEach($scope.items, function(item){
        item.value = (item.weight * total)/100;
        console.log(item.value + " " + item.weight + " " + total);
    });
  return total;
 }

$scope.sum(); 

})

.controller('emplistController', function($scope,$state, employee) {
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchEmployee   = ''; 

    $scope.reloadRoute = function() {
        $state.reload();
    };


    $scope.employees = [
        {
            name: 'John Doe',
            phoneNumber: '(051) 754 3010',
            salary: 50
        },
        {
            name: 'Joe Don',
            phoneNumber: '(051) 754 3010',
            salary: 10000
        },
        {
            name: 'Rosa Hemsworth',
            phoneNumber: '(051) 754 3010',
            salary: 20000
        }
    ];

    function fillEmployeeArray(len) {
    var arr = $scope.employees;
        for (var i = 0; i < len; i++) {
            var value = {
                name: Math.random().toString(36).substr(2, 5) + " John Doe",
                phoneNumber: '(051) 754 3010',
                salary: 50
            }
            arr.push(value);
        }
        return arr;
    }

    fillEmployeeArray(47);
})

// our directives
// =============================================================================
.directive('currencyInput', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {

            return ctrl.$parsers.push(function(inputValue) {
                var inputVal = element.val();

                //clearing left side zeros
                while (inputVal.charAt(0) == '0') {
                    inputVal = inputVal.substr(1);
                }

                inputVal = inputVal.replace(/[^\d.\',']/g, '');

                var point = inputVal.indexOf(".");
                if (point >= 0) {
                    inputVal = inputVal.slice(0, point + 3);
                }

                var decimalSplit = inputVal.split(".");
                var intPart = decimalSplit[0];
                var decPart = decimalSplit[1];

                intPart = intPart.replace(/[^\d]/g, '');
                if (intPart.length > 3) {
                    var intDiv = Math.floor(intPart.length / 3);
                    while (intDiv > 0) {
                        var lastComma = intPart.indexOf(",");
                        if (lastComma < 0) {
                            lastComma = intPart.length;
                        }

                        if (lastComma - 3 > 0) {
                            intPart = intPart.slice(0, lastComma - 3) + "," + intPart.slice(lastComma - 3);
                        }
                        intDiv--;
                    }
                }

                if (decPart === undefined) {
                    decPart = "";
                }
                else {
                    decPart = "." + decPart;
                }
                var res = intPart + decPart;
                    
                if(res){
                    res ='$' + res;
                }                

                if (res != inputValue) {
                    ctrl.$setViewValue(res);
                    ctrl.$render();
                    scope.$apply();
                }

            });

        }
    };
})

.directive("phoneformat", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attr, ngModelCtrl) {
            var phoneParse = function (value) {
                var val = element.val();
                var numbers = val.replace(/[^\d.\'-']/g, '');
                if (/^\d{10}$/.test(numbers) && numbers!=value) {
                    return numbers;
                }

                return undefined;
            }
            //Formatting is done from view to model (e.g. when you set $scope.telephone)
            //Function to insert hyphens if 10 digits were entered.
            var phoneFormat = function (value) {
                var val = element.val();
                var numbers = val.replace(/[^\d.\'-']/g, '');
                var matches = numbers.match(/^(\d{3})(\d{3})(\d{4})$/);

                if (matches && numbers != value) {
                    return "("+matches[1] + ") " + matches[2] + "-" + matches[3];
                }

                return undefined;
            }

           //Add these functions to the formatter and parser pipelines
           ngModelCtrl.$parsers.push(phoneParse);
           ngModelCtrl.$formatters.push(phoneFormat);

           var handler = function () {
                var value = phoneFormat(element.val());
                var isValid = !!value;
                if (isValid) {
                    ngModelCtrl.$setViewValue(value);
                    ngModelCtrl.$render();
                }

                ngModelCtrl.$setValidity("telephone", isValid);
                scope.$apply();
            };

           element.bind("blur", handler);
           element.bind("keydown", handler);
           element.bind("change", handler);
           element.bind("paste cut", handler);
        }
    };
});

