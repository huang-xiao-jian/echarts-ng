(function (angular) {
  "use strict";

  angular.module('echarts-ng').provider('$dimension', DimensionAssistanceProvider);

  /**
   * @ngdoc service
   * @name echarts-ng.service:$dimensionProvider
   *
   * @description - echarts-ng dimension service
   */
  function DimensionAssistanceProvider() {
    var ctx = this;

    ctx.calculateDynamicDimension = function(series) {
      var base = 45
        , split = series.length
        , length = series[0].data.length * split;

      switch (true) {
        case length < 5:
          base = 60;
          break;
        case length >= 5 && length < 10:
          base = 45;
          break;
        case length >= 10:
          base = 35;
          break;
      }

      return base * length + 'px';
    };
    /**
     * @ngdoc service
     * @name echarts-ng.service:$dimension
     *
     * @description - echarts-ng dimension method
     */
    ctx.$get = [function () {
      var dimension = {};

      dimension.adaptEchartsDimension = adaptEchartsDimension;
      dimension.removeEchartsDimension = removeEchartsDimension;
      dimension.synchronizeEchartsDimension = synchronizeEchartsDimension;
      dimension.adjustEchartsDimension = adjustEchartsDimension;

      return dimension;

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$dimension
       * @name echarts-ng.service:$dimension#adaptEchartsDimension
       *
       * @param {object} element - angular jqLite wrap
       * @param {string} dimension - shortcut pixel ratio, format as width:height
       *
       * @description - adapt element dimension
       */
      function adaptEchartsDimension(element, dimension) {
        if (!angular.isString(dimension)) {
          console.warn("The Pass Pixel Ratio Not Assign, Please Make Sure Height Already Specified");
          return;
        }

        var dom = element[0]
          , width
          , height
          , ratio = dimension.split(':').reverse().map(Number);

        if (ratio.length !== 2) {
          console.warn("The Pass Pixel Ratio Invalid, Please Verify Param");
          return;
        }

        width = dom.clientWidth;
        height = width * ratio[0] / ratio[1];

        dom.style.height = height + 'px';
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$dimension
       * @name echarts-ng.service:$dimension#removeEchartsDimension
       *
       * @param {object} element - angular jqLite wrap
       *
       * @description - remove echarts dimension
       */
      function removeEchartsDimension(element) {
        var dom = element[0];

        dom.style.removeProperty ? dom.style.removeProperty('height') : dom.style.removeAttribute('height');
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$dimension
       * @name echarts-ng.service:$dimension#synchronizeEchartsDimension
       *
       * @param {object} instance - the echarts instance
       *
       * @description - synchronize echarts pixel ratio, just for wrap
       */
      function synchronizeEchartsDimension(instance) {
        instance.resize();
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$dimension
       * @name echarts-ng.service:$dimension#adjustEchartsDimension
       *
       * @param {object} element - echarts instance container html element
       * @param {array} series - standard echarts series
       *
       * @description - adjust echarts dimension dynamic
       */
      function adjustEchartsDimension(element, series) {

        if (!angular.isArray(series) || !angular.isObject(series[0]) || !angular.isArray(series[0].data)) return;

        element.style.height = ctx.calculateDynamicDimension(series);
      }
    }];
  }
})(angular);