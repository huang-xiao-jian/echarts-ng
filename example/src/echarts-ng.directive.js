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
   * @param {string} echartsDimension - the instance container pixel ratio
   * @param {object} config  - echarts adaptable options
   *
   * @description - simple angular directive wrap for echarts
   */
  echartsDirective.$inject = ['$echarts', '$waterfall', '$dimension'];
  function echartsDirective($echarts, $waterfall, $dimension) {
    return {
      priority: 5,
      restrict: 'A',
      scope: {
        echarts: '=',
        echartsDimension: '=',
        config: '='
      },
      bindToController: true,
      controller: ['$scope', '$element', function ($scope, $element) {
        var vm = this;

        var GLOBAL_OPTION = $echarts.getEchartsGlobalOption()
          , identity = vm.echarts
          , config = vm.config
          , theme = GLOBAL_OPTION.theme
          , driftPalette = GLOBAL_OPTION.driftPalette
          , element = $element[0]
          , calculateHeight = $dimension.calculateEchartsDimension(element, vm.echartsDimension);

        if (!identity) {
          throw new Error('Echarts Instance Identity Required');
        }

        $dimension.adaptEchartsDimension(element, calculateHeight);

        var instance = theme ? echarts.init(element, theme) : echarts.init(element);

        instance.setOption(GLOBAL_OPTION);

        $echarts.driftEchartsPalette(instance, driftPalette);
        $echarts.registerEchartsInstance(identity, instance);

        $waterfall.adaptWaterfallTooltip(instance, config);
        $waterfall.adaptWaterfallSeries(config);

        angular.isObject(config) && angular.isArray(config.series)
          ? instance.setOption(config)
          : instance.showLoading();

        $scope.$watch('chart.echartsDimension', function (current, prev) {
          if (!angular.equals(current, prev)) {
            calculateHeight = $dimension.calculateEchartsDimension(element, vm.echartsDimension);
            $dimension.adaptEchartsDimension(element, calculateHeight);
            $dimension.synchronizeEchartsDimension(instance);
          }
        });

        $scope.$watchCollection('chart.config.title', function (current, prev) {
          if (!angular.equals(current, prev)) {
            $waterfall.adaptWaterfallSeries(vm.config);
            $echarts.updateEchartsInstance(identity, vm.config);
          }
        });

        $scope.$watchCollection('chart.config.series', function (current, prev) {
          if (!angular.equals(current, prev)) {
            $waterfall.adaptWaterfallSeries(vm.config);
            $echarts.updateEchartsInstance(identity, vm.config);
          }
        });

        $scope.$on('$destroy', function () {
          instance.clear();
          instance.dispose();
          $echarts.removeEchartsInstance(identity);
          $dimension.removeEchartsDimension(element);
        });
      }],
      controllerAs: 'chart'
    }
  }
})(angular, echarts);