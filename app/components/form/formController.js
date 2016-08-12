formApp.controller('formController', function($scope, $state, $stateParams, employee) {
    
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