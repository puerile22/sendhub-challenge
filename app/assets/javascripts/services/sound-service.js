app.service('HomeService', ['$http', function($http) {
  var params = {
    username: '6504194373',
    api_key: 'cc3216282c0552dc1432b67b9c879c2cc760cf68'
  };
  this.sortBySum = function(a, b) {
    return b.sum - a.sum;
  };
  this.outputArray = [{'sum': 0,'time': 0}, {'sum': 0,'time': 0}, {'sum': 0,'time': 0}];
  this.resetOutput = function(scope) {
    scope.output = {
      'sum': 0,
      'time': audioContext.currentTime.toFixed(2),
      'startTime': this.getCurrentTime(),
      'endTime': 0,
      'id': scope.output.id + 1
    };
  };
  this.getCurrentTime = function() {
    var currentTime = new Date();
    return currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
  }; 
// Check if the volume crosses the minimum threshold for more than 1 sec by comparing the slow volume and threshold
// Also check if the volume meets both criteria, if so, send out the message.
  this.checkVolume = function(scope) {
    scope.slow = soundMeter.slow.toFixed(2);
    if (scope.slow > Number(scope.threshold) && scope.output.sum > Number(scope.threshold) && scope.output.sum > scope.outputArray[2].sum && scope.outputIdArray.indexOf(scope.output.id) === -1) {
      scope.outputIdArray.push(scope.output.id);
      this.sendMsg(scope.number).success(function(data) {
        console.log("Message has been sent.");
        scope.loudTime += 1;
        if (scope.loudTime > 10) {
          this.superLoud(scope);
        }
      });
    }
  };
// Calculate volume output
  this.getOutput = function(scope) {
    scope.output.sum += soundMeter.instant.toFixed(2) * 0.05;
  };
// Check if the output period is longer than 2 sec and has been quite for more than 1 sec, if so reset the output
  this.checkOutputPeriod = function(scope) {
    if (audioContext.currentTime - scope.output.time > 2 && scope.slow < 0.001 * Number(scope.threshold)) {
      if (scope.output.sum > scope.outputArray[2].sum) {
        scope.output.endTime = this.getCurrentTime();
        scope.outputArray.splice(2,1);
        scope.outputArray.push(scope.output);
        scope.outputArray.sort(this.sortBySum);
      }
      this.resetOutput(scope);
    }
    if (scope.output.sum > 50 * Number(scope.threshold)) {
      this.superLoud(scope);
    }
  };
// Send message to the spcific number 
  this.sendMsg = function(number) {
    return $http({
      method: 'post',
      url: "https://cors-anywhere.herokuapp.com/https://api.sendhub.com/v1/messages/",
      data: {
        "contacts": [
          "+1" + number
        ],
        "text": "Too Loud!"
      },
      params: params
    });
  };
// Disable the mic if the user is too loud
  this.superLoud = function(scope) {
    soundMeter.stop();
    this.resetOutput(scope);
    scope.getOutput = scope.checkVolume = scope.checkOutputPeriod = "";
    alert('Because you are too loud, your mic has been disabled!!');
    soundMeter.slow = 0;
  };
}]);