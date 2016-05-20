(function (angular) {
  "use strict";
  
  angular.module("echarts-ng").provider("$waterfall", WaterfallAssistanceProvider);
  
  /**
   * @ngdoc service
   * @name echarts-ng.service:$waterfallProvider
   *
   * @description - echarts-ng waterfall service
   */
  function WaterfallAssistanceProvider() {
    var ctx = this;
    
    /**
     * @ngdoc service
     * @name echarts-ng.service:$waterfall
     *
     * @description - echarts-ng waterfall helper
     */
    ctx.$get = [function () {
      var waterfall = {};

      waterfall.shouldAdaptWaterfall = shouldAdaptWaterfall;
      waterfall.adaptWaterfallTooltip = adaptWaterfallTooltip;
      waterfall.calculateWaterfallSummary = calculateWaterfallSummary;
      waterfall.calculateWaterfallFlow = calculateWaterfallFlow;
      waterfall.adaptWaterfallSeries = adaptWaterfallSeries;

      return waterfall;

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$waterfall
       * @name echarts-ng.service:$waterfall#shouldAdaptWaterfall
       *
       * @param {object} config - the echarts instance
       * @return {boolean} - whether active waterfall adapt
       *
       * @description - adapt tooltip when active waterfall transfer
       */
      function shouldAdaptWaterfall(config) {
        if (!angular.isObject(config) || !angular.isArray(config.series) || config.series.length !== 1) return false;

        var target = config.series[0];

        return (angular.isArray(target.data) && angular.equals(target.type, "waterfall"));
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$waterfall
       * @name echarts-ng.service:$waterfall#adaptWaterfallTooltip
       *
       * @param {object} instance - the echarts instance
       * @param {object} config - the echarts instance configuration
       *
       * @description - adapt tooltip when active waterfall transfer
       */
      function adaptWaterfallTooltip(instance, config) {
        if (!waterfall.shouldAdaptWaterfall(config)) return;

        var setting = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: "{a1}: <br/> {b1}: {c1}"
          }
        };

        instance.setOption(setting);
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$waterfall
       * @name echarts-ng.service:$waterfall#calculateWaterfallSummary
       *
       * @param {array} series - standard array
       *
       * @description - calculate array sum value
       */
      function calculateWaterfallSummary(series) {
        return series.reduce(function (prev, value) {
          return prev + value;
        }, 0);
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$waterfall
       * @name echarts-ng.service:$waterfall#calculateWaterfallFlow
       *
       * @param {array} flow - standard echarts series item data
       *
       * @description - calculate step stone series data
       */
      function calculateWaterfallFlow(flow) {
        var staircase;
        
        staircase = flow.reduce(function (prev, value, index, origin) {
          if (index > 0 && index < origin.length - 1) {
            var end = index
              , segment = origin.slice(0, end)
              , sum = calculateWaterfallSummary(segment);
            
            prev.push(sum);
          }
          return prev;
        }, []);
        
        staircase.unshift(0) && staircase.push(0);
        
        return staircase;
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$waterfall
       * @name echarts-ng.service:$waterfall#adaptWaterfallSeries
       *
       * @param {object} config - the echarts instantiation configuration
       *
       * @description - transfer instance into waterfall mode
       */
      function adaptWaterfallSeries(config) {
        if (!waterfall.shouldAdaptWaterfall(config)) return config;

        config = angular.copy(config);

        var target = config.series[0]
          , extension = {
            stack: "waterfall",
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "inside"
              }
            }
          };

        angular.extend(target, extension);

        var helper = {
          name: "helper",
          type: "bar",
          stack: "waterfall",
          itemStyle: {
            normal: {
              barBorderColor: "rgba(0,0,0,1)",
              color: "rgba(0,0,0,0)"
            },
            emphasis: {
              barBorderColor: "rgba(0,0,0,0)",
              color: "rgba(0,0,0,0)"
            }
          },
          data: waterfall.calculateWaterfallFlow(target.data)
        };

        config.series = [helper, target];

        return config;
      }
    }];
  }
})(angular);