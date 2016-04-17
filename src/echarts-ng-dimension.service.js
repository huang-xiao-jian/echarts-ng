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

    /**
     * @ngdoc service
     * @name echarts-ng.service:$dimension
     *
     *
     * @description - echarts-ng dimension method
     */
    ctx.$get = [function () {
      var dimension = {};

      dimension.adaptEchartsDimension = adaptEchartsDimension;
      dimension.removeEchartsDimension = removeEchartsDimension;
      dimension.synchronizeEchartsDimension = synchronizeEchartsDimension;

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
    }];
  }
})(angular);