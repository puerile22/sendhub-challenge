app.controller('HomeController', ['$scope', '$interval', 'HomeService', function($scope, $interval, HomeService) {
  $interval(function() {
    if (typeof soundMeter !== 'undefined') {
      $scope.slow = soundMeter.slow.toFixed(2);
      if ($scope.slow > Number($scope.threshold) && $scope.output.sum > Number($scope.threshold) && $scope.output.sum > $scope.outputArray[0].sum && $scope.outputIdArray.indexOf($scope.output.id) === -1) {
        $scope.outputIdArray.push($scope.output.id);
        console.log('too loud!');
      }
    }
  }, 200);
  $scope.outputArray = HomeService.outputArray;
  $scope.outputIdArray = [];
  $scope.output = {
    'sum': 0,
    'time': 0,
    'id': 0
  };
  $interval(function() {
    if (typeof soundMeter !== 'undefined') {
      $scope.output.sum += soundMeter.instant.toFixed(2) * 0.05;
      $scope.output.time += 50;
    }
  }, 50);
  $interval(function() {
    if ($scope.output.time > 2000 && $scope.slow < 0.001 * Number($scope.threshold)) {
      if ($scope.output.sum > $scope.outputArray[0].sum) {
        $scope.outputArray.shift();
        $scope.outputArray.push($scope.output);
        $scope.outputArray.sort(HomeService.sortBySum);
        // console.log($scope.outputArray);
      }
      HomeService.resetOutput($scope);
    }
  }, 1500);
}]);