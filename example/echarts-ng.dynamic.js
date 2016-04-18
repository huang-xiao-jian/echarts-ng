(function (angular) {
  "use strict";

  angular.module('example', ['echarts-ng'])
    .config(['$echartsProvider', function($echartsProvider) {
      $echartsProvider.setGlobalOption({
        grid: {
          top: 'top',
          left: '5%',
          right: '5%',
          bottom: '5%'
        }
      });
    }])
    .controller('DynamicCtrl', ['$scope', '$timeout', '$echarts', function ($scope, $timeout, $echarts) {
      $scope.optionalDistributionList = [
        {
          account: 'World',
          description: '这是个多条目系列',
          config: {
            xAxis: {
              type: "value"
            },
            yAxis: {
              type: "category",
              data: ["条目A", "条目B", "条目C", "条目D", "条目E", "条目F", " 条目G", "条目H", "条目I"]
            },
            dynamic: true,
            series: [{
              name: "专属统计",
              type: "bar",
              data: [15, 25, 7, 9, 8, 5, 12, 9, 2]
            }]
          }
        },
        {
          account: 'Medium',
          description: '这是个中等条目系列',
          config: {
            xAxis: {
              type: 'value'
            },
            yAxis: {
              type: 'category',
              data: ["条目A", "条目B", "条目C"]
            },
            dynamic: true,
            series: [{
              name: '专属统计',
              type: 'bar',
              data: [22, 5, 16]
            }]
          }
        },
        {
          account: 'Single',
          description: '这是个单条目系列',
          config: {
            xAxis: {
              type: 'value'
            },
            yAxis: {
              type: 'category',
              data: ["条目A"]
            },
            dynamic: true,
            series: [{
              name: '专属统计',
              type: 'bar',
              data: [22]
            }]
          }
        }
      ];

      $scope.chosenDistribution = $scope.optionalDistributionList[0];
      $scope.distribution = {
        identity: $echarts.generateInstanceIdentity(),
        dimension: '16:9',
        config: $scope.chosenDistribution.config
      };

      $scope.handleDistributionChange = function(item) {
        $scope.distribution.config = item.config;
      };
    }])
})(angular);