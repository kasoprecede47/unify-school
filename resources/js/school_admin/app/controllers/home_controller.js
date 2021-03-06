/* global App */
/**
 * Created by Ak on 4/7/2015.
 */

App.controller('HomeController',['$scope','SchoolDataService','$window','$rootScope','SchoolService','toaster',
    function ($scope,SchoolDataService,$window,$rootScope,SchoolService,toaster) {
        $scope.school = SchoolDataService.school;
        $scope.updatingFirstTimeLogin = false;
        console.log($scope.school);

        $rootScope.$on('SCHOOL_CONTEXT_CHANGED',function(event,obj){
            console.log('I hear ya @ HomeController');
        });
        
        $scope.updateFirstTimeLoginState = function(){
            $scope.updatingFirstTimeLogin = true;
            SchoolService.updateFirstTimeLoginState({id: $scope.school.id},{}).$promise.then(function(){
                $scope.$emit('refreshSchoolData'); 
            },function(){
                toaster.pop('error', "School Status Update", "Failed Saving changes");
                $scope.updatingFirstTimeLogin = false;
            });
        };

        $scope.$on('refreshSchoolDataComplete',function(){
            $scope.school = SchoolDataService.school;
        });
    }]
);

