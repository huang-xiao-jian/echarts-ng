(function (angular, echarts) {
  "use strict";

  angular.module("echarts-ng").directive("echarts", echartsDirective);

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
  echartsDirective.$inject = ["$echarts", "$dimension"];
  function echartsDirective($echarts, $dimension) {
    return {
      priority: 5,
      restrict: "A",
      scope: {
        echarts: "=",
        echartsDimension: "=",
        config: "="
      },
      bindToController: true,
      controller: ["$scope", "$element", function ($scope, $element) {
        var vm = this;

        var OPTION = $echarts.getEchartsGlobalOption()
          , identity = vm.echarts
          , element = $element[0];

        if (!identity) {
          throw new Error("Echarts Instance Identity Required");
        }

        /**
         * @type number
         *
         * @description - 初始化高度设定，避免echarts绘制失败
         */
        $dimension.shouldAdaptDimension(element, vm.echartsDimension) && $dimension.adaptEchartsDimension(element, vm.echartsDimension);
        /**
         * @type object
         *
         * @description - echarts 实例对象
         */
        var instance;

        instance = echarts.init(element, OPTION.theme);
        instance.setOption(OPTION);

        // 调色板增强
        $echarts.driftEchartsPalette(instance, OPTION.driftPalette);
        // 注册当前实例对象
        $echarts.registerEchartsInstance(identity, instance);
        // 绘制实例对象
        $echarts.updateEchartsInstance(identity, vm.config);

        $scope.$watchCollection("chart.config.title", function (current, prev) {
          if (!angular.equals(current, prev)) {
            $echarts.updateEchartsInstance(identity, vm.config);
          }
        });

        $scope.$watchCollection("chart.config.series", function (current, prev) {
          if (!angular.equals(current, prev)) {
            $echarts.updateEchartsInstance(identity, vm.config);
          }
        });

        $scope.$on("$destroy", function () {
          instance.clear();
          instance.dispose();
          $echarts.removeEchartsInstance(identity);
          $dimension.removeEchartsDimension(element);
        });
      }],
      controllerAs: "chart"
    };
  }
})(angular, echarts);