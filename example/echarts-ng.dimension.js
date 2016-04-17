(function (angular) {
  "use strict";

  angular.module('example', ['echarts-ng'])
    .controller('DimensionCtrl', ['$scope', '$timeout', '$echarts', function ($scope, $timeout, $echarts) {
      $scope.distribution = {
        identity: $echarts.generateInstanceIdentity(),
        dimension: '16:9',
        config: {
          xAxis: {
            type: 'category',
            data: ["日用品数", "伙食费", "交通费", "水电费", "房租"]
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '生活费',
            type: 'bar',
            data: [300, 900, 200, 300, 1200]
          }]
        }
      };

      $timeout(function() {
        $scope.distribution.dimension = '4:3';
      }, 1200);
    }])
})(angular);