(function (angular) {
  "use strict";
  
  angular.module('echarts-ng').provider('$waterfall', WaterfallAssistanceProvider);
  
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
     *
     * @description - echarts-ng waterfall method
     */
    ctx.$get = [function () {
      var waterfall = {};

      waterfall.adaptWaterfallTooltip = adaptWaterfallTooltip;
      waterfall.calculateWaterfallFlow = calculateWaterfallFlow;
      waterfall.wrapWaterfallSeries = wrapWaterfallSeries;

      return waterfall;

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$waterfall
       * @name echarts-ng.service:$waterfall#adaptWaterfallTooltip
       *
       * @param {array} instance - the echarts instance
       * @param {boolean} override - whether modify tooltip setting
       *
       * @description - adapt tooltip when transfer waterfall
       */
      function adaptWaterfallTooltip(instance, override) {
        if (!override) return;

        var setting = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{a1}: <br/> {b1}: {c1}'
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
       * @name echarts-ng.service:$waterfall#calculateWaterfallHelper
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
       * @name echarts-ng.service:$waterfall#wrapWaterfallSeries
       *
       * @param {object} config - the echarts instantiation configuration
       * @param {boolean} override - whether adapt waterfall mode
       *
       * @description - transfer instance into waterfall mode
       */
      function wrapWaterfallSeries(config, override) {
        if (!override || !angular.isArray(config.series) || config.series.length !== 1) return;

        var target = config.series[0];
        if (!angular.isArray(target.data)) return;

        var extension = {
          stack: 'waterfall',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          }
        };

        angular.extend(target, extension);

        var helper = {
          name: 'helper',
          type: 'bar',
          stack: 'waterfall',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,1)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            }
          },
          data: waterfall.calculateWaterfallFlow(target.data)
        };

        config.series = [helper, target];
      }
    }];
  }
})(angular);