(function (angular) {
  "use strict";

  angular.module('example', ['echarts-ng'])
    .controller('WaterfallCtrl', ['$scope', '$timeout', '$echarts', function ($scope, $timeout, $echarts) {
      $scope.distribution = {
        identity: $echarts.generateInstanceIdentity(),
        config: {
          xAxis: {
            type: 'category',
            splitLine: {show: false},
            data: ["日用品数", "伙食费", "交通费", "水电费", "房租", "总费用"]
          },
          yAxis: {
            type: 'value'
          },
          waterfall: true,
          series: [{
            name: '生活费',
            type: 'bar',
            data: [300, 900, 200, 300, 1200, 2900]
          }]
        }
      };
    }])
})(angular);