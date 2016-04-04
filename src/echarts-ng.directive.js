(function (angular, echarts) {
  "use strict";

  angular.module('echarts-ng').directive('echarts', echartsDirective);

  /**
   * @ngdoc directive
   * @name echarts-ng.directive:echarts
   *
   * @require echarts-ng.service:$echarts
   *
   * @priority 5
   * @restrict A
   *
   * @param {string} echarts - the instance assigned
   * @param {object} config  - echarts adaptable options
   *
   * @description - simple angular directive wrap for echarts
   */
  echartsDirective.$inject = ['$echarts'];
  function echartsDirective($echarts) {
    return {
      priority: 5,
      restrict: 'A',
      scope: {
        echarts: '=',
        config: '='
      },
      bindToController: true,
      controller: function ($scope, $element) {
        var GLOBAL_OPTION = $echarts.getEchartsGlobalOption()
          , chart = $scope.chart
          , identity = chart.echarts
          , element = $element[0];

        if (!identity) {
          throw new Error('Echarts Instance Identity Required');
        }

        var instance = echarts.init(element);

        instance.setOption(GLOBAL_OPTION);
        $echarts.registerEchartsInstance(identity, instance);

        angular.isObject(chart.config) && angular.isArray(chart.config.series)
          ? instance.setOption(chart.config)
          : instance.showLoading();

        $scope.$watchCollection('chart.config.title', function() {
          instance.setOption(chart.config)
        });

        $scope.$watchCollection('chart.config.series', function() {
          instance.setOption(chart.config)
        });

        $scope.$on('$destroy', function () {
          instance.clear();
          instance.dispatch();
          $echarts.removeEchartsInstance(identity);
        });
      },
      controllerAs: 'chart'
    }
  }
})(angular, echarts);