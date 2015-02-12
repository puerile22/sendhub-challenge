app.controller('HomeController', ['$scope', '$interval', 'HomeService', function($scope, $interval, HomeService) {
  $scope.loudTime = 0;
  $scope.checkVolume = $interval(function() {
    if (typeof soundMeter !== 'undefined') {
      HomeService.checkVolume($scope);
    }
  }, 200);
  $scope.outputArray = HomeService.outputArray;
  $scope.outputIdArray = [];
  $scope.output = {
    'sum': 0,
    'time': 0,
    'id': 0
  };
  $scope.getOutput = $interval(function() {
    if (typeof soundMeter !== 'undefined') {
      HomeService.getOutput($scope);
    }
  }, 50);
  $scope.checkOutputPeriod = $interval(function() {
    HomeService.checkOutputPeriod($scope);
  }, 1500);
}]);