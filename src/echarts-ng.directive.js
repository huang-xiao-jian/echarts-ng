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
          , element = $element[0];

        if (!identity) {
          throw new Error('Echarts Instance Identity Required');
        }

        /**
         * @type property
         *
         * @description - 基于宽高比计算动态高度
         */
        var calculateHeight = $dimension.calculateEchartsDimension(element, vm.echartsDimension);
        $dimension.adaptEchartsDimension(element, calculateHeight);

        var instance = echarts.init(element, theme)
          , decorativeConfig = $waterfall.adaptWaterfallSeries(vm.config);

        instance.setOption(GLOBAL_OPTION);

        $echarts.driftEchartsPalette(instance, driftPalette);
        $echarts.registerEchartsInstance(identity, instance);
        $waterfall.adaptWaterfallTooltip(instance, vm.config);

        angular.isObject(decorativeConfig) && angular.isArray(decorativeConfig.series)
          ? instance.setOption(decorativeConfig)
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
            decorativeConfig = $waterfall.adaptWaterfallSeries(vm.config);
            $waterfall.adaptWaterfallTooltip(instance, vm.config);
            $echarts.updateEchartsInstance(identity, decorativeConfig);
          }
        });

        $scope.$watchCollection('chart.config.series', function (current, prev) {
          if (!angular.equals(current, prev)) {
            decorativeConfig = $waterfall.adaptWaterfallSeries(vm.config);
            $waterfall.adaptWaterfallTooltip(instance, vm.config);
            $echarts.updateEchartsInstance(identity, decorativeConfig);
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