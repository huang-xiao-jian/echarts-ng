(function (angular) {
  "use strict";

  angular.module('example', ['echarts-ng'])
    .controller('WaterfallCtrl', ['$scope', '$timeout', '$echarts', function ($scope, $timeout, $echarts) {
      $scope.distribution = {
        identity: $echarts.generateInstanceIdentity(),
        dimension: '16:9',
        config: {
          xAxis: {
            type: 'category',
            splitLine: {show: false},
            data: ["日用品数", "伙食费", "交通费", "水电费", "房租", "总费用"]
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '生活费',
            type: 'waterfall',
            data: [300, 900, 200, 300, 1200, 2900]
          }]
        }
      };

      $timeout(function () {
        $scope.distribution.config.series[0] = {
          name: '生活费',
          type: 'waterfall',
          data: [400, 1000, 100, 400, 1100, 3000]
        };
      }, 1200);
    }])
})(angular);