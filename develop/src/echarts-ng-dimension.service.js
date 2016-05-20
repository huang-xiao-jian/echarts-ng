(function (angular) {
  "use strict";

  angular.module("echarts-ng").provider("$dimension", DimensionAssistanceProvider);

  /**
   * @ngdoc service
   * @name echarts-ng.service:$dimensionProvider
   *
   * @description - echarts-ng dimension service
   */
  function DimensionAssistanceProvider() {
    var ctx = this;

    /**
     * @ngdoc service
     * @name echarts-ng.service:$dimension
     *
     * @description - echarts-ng dimension method
     */
    ctx.$get = [function () {
      var dimension = {};

      dimension.shouldAdaptDimension = shouldAdaptDimension;
      dimension.shouldAdjustEchartsDimension = shouldAdjustEchartsDimension;
      dimension.adaptEchartsDimension = adaptEchartsDimension;
      dimension.calculateDynamicDimension = calculateDynamicDimension;
      dimension.removeEchartsDimension = removeEchartsDimension;
      dimension.synchronizeEchartsDimension = synchronizeEchartsDimension;
      dimension.adjustEchartsDimension = adjustEchartsDimension;

      return dimension;

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$dimension
       * @name echarts-ng.service:$dimension#shouldAdaptDimension
       *
       * @param {object} element - echarts instance container html element
       * @param {string} dimension - shortcut pixel ratio, format as width:height
       * @return {boolean}
       *
       * @todo - handle the situation when element has css control height
       *
       * @description - whether should wrap the element dimension
       */
      function shouldAdaptDimension(element, dimension) {
        if (!angular.isString(dimension)) {
          console.warn("The Pass Pixel Ratio Not Assign, Please Make Sure Height Already Specified"); //eslint-disable-line no-console
          return false;
        }

        if (dimension.split(":").length !== 2) {
          console.warn("The Pass Pixel Ratio Invalid, Please Verify Param"); //eslint-disable-line no-console
          return false;
        }

        return true;
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$dimension
       * @name echarts-ng.service:$dimension#adaptEchartsDimension
       *
       * @param {object} element - echarts instance container html element
       * @param {string} dimension - shortcut pixel ratio, format as width:height
       *
       * @todo - 计算应基于content宽度，不包含padding部分
       *
       * @description - adapt element dimension
       */
      function adaptEchartsDimension(element, dimension) {
        var width
          , height
          , ratio = dimension.split(":").reverse().map(Number);

        width = element.clientWidth;
        height = width * ratio[0] / ratio[1];

        element.style.height = height + "px";
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$dimension
       * @name echarts-ng.service:$dimension#removeEchartsDimension
       *
       * @param {object} element - echarts instance container html element
       *
       * @description - remove echarts dimension
       */
      function removeEchartsDimension(element) {
        element.style.removeProperty ? element.style.removeProperty("height") : element.style.removeAttribute("height");
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
       * @name echarts-ng.service:$dimension#calculateDynamicDimension
       *
       * @param {object} series - echarts instance config series
       *
       * @description - calculate dynamic element height
       */
      function calculateDynamicDimension(series) {
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

        return base * length + "px";
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$dimension
       * @name echarts-ng.service:$dimension#shouldAdjustEchartsDimension
       *
       * @param {boolean} dynamic - whether adjust dynamic dom height
       * @param {array} series - standard echarts series
       * @return {boolean}
       *
       * @description - whether adjust dynamic echarts dimension
       */
      function shouldAdjustEchartsDimension(dynamic, series) {
        if (!dynamic) return false;
        if (!angular.isArray(series) || !series[0]) return false;

        return angular.isArray(series[0].data);
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
        element.style.height = dimension.calculateDynamicDimension(series);
      }
    }];
  }
})(angular);