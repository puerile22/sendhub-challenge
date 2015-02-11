app.service('HomeService', ['$interval', function($interval) {
  this.sortBySum = function(a, b) {
    return a.sum - b.sum;
  };
  this.outputArray = [{'sum': 0,'time': 0}, {'sum': 0,'time': 0}, {'sum': 0,'time': 0}];
  this.resetOutput = function(scope) {
    scope.output = {
      'sum': 0,
      'time': 0,
      'id': scope.output.id + 1
    };
  };
}]);