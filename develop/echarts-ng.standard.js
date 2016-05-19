(function (angular) {
  "use strict";

  angular.module('example', ['echarts-ng'])
    .controller('ExampleCtrl', ['$scope', '$interval', '$timeout', '$echarts', function ($scope, $interval, $timeout, $echarts) {
      var xAxis = [{
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }];

      var yAxis = [{
        type: 'value'
      }];

      var series = [
        {
          name: '邮件营销',
          type: 'bar',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '联盟广告',
          type: 'bar',
          data: [220, 182, 191, 234, 290, 330, 310]
        }
        ,
        {
          name: '视频广告',
          type: 'bar',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '直接访问',
          type: 'bar',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '搜索引擎',
          type: 'bar',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ];

      $scope.barExampleList = [0, 1, 2, 3].map(function (value) {
        return {
          identity: $echarts.generateInstanceIdentity(),
          dimension: '16:9',
          config: {
            xAxis: xAxis,
            yAxis: yAxis,
            series: [series[value]]
          }
        };
      });

      $scope.gauge = {
        identity: $echarts.generateInstanceIdentity(),
        dimension: '16:9',
        config: {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}%"
          },
          series: [{
            name: '业务指标',
            type: 'gauge',
            detail: {formatter: '{value}%'},
            data: [{value: 55, name: '完成率'}]
          }]
        }
      };

      $scope.distribution = {
        identity: $echarts.generateInstanceIdentity(),
        dimension: '16:9',
        config: {
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
          },
          series : [
            {
              name: '访问来源',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              label: {
                normal: {
                  show: true,
                  formatter: "{b} : {c} ({d}%)"
                }
              },
              data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
              ]
            }
          ]
        }
      };

      $timeout(function () {
        $scope.gauge.config.series[0].data = [{value: 75, name: '完成率'}];
        $echarts.updateEchartsInstance($scope.gauge.identity, $scope.gauge.config);
      }, 800);
    }])
})(angular);