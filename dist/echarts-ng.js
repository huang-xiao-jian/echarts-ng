(function (angular) {
  "use strict";

  /**
   * @ngdoc overview
   *
   * @module echarts-ng
   * @name echarts-ng
   *
   * @description - simple angular wrap for baidu echarts
   */
  angular.module('echarts-ng', []);
})(angular);
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
(function (angular) {
  "use strict";
  
  angular.module('echarts-ng').provider('$echarts', EchartsAssistanceProvider);

  /**
   * @constructor AdaptableMap
   *
   * @description - simple shim for ES6 Map, Do Not Use It directly
   */
  function AdaptableMap() {
    this.storage = {};
  }

  AdaptableMap.prototype.has = function (identity) {
    return this.storage.hasOwnProperty(identity);
  };

  AdaptableMap.prototype.get = function (identity) {
    return this.storage[identity];
  };

  AdaptableMap.prototype.set = function (identity, instance) {
    this.storage[identity] = instance;
  };

  AdaptableMap.prototype.delete = function (identity) {
    delete this.storage[identity];
  };

  Object.defineProperty(AdaptableMap.prototype, 'size', {
    enumerable: true,
    configurable: false,
    get: function () {
      return Object.keys(this.storage).length;
    }
  });
  
  /**
   * @ngdoc service
   * @name echarts-ng.service:$echartsProvider
   *
   * @description - echarts-ng util service
   */
  function EchartsAssistanceProvider() {
    var ctx = this;
    
    // base echarts options
    ctx.GLOBAL_OPTION = {
      theme: 'macarons',
      title: {
        left: 'center',
        top: 'top',
        padding: [20, 10, 10, 10]
      },
      grid: {
        top: '15%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },
      backgroundColor: 'rgba(255, 255, 255, .5)',
      legend: {
        left: 'center',
        top: 'top',
        padding: [20, 10, 10, 10]
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      }
    };
    
    // modify base echarts options
    ctx.setGlobalOption = function (option) {
      angular.extend(ctx.GLOBAL_OPTION, option);
    };
    
    /**
     * @ngdoc service
     * @name echarts-ng.service:$echarts
     *
     * @requires $q
     * @requires $timeout
     *
     * @description - echarts-ng util method
     */
    ctx.$get = ['$q', '$timeout', '$waterfall', function ($q, $timeout, $waterfall) {
      var assistance = {};
      
      /**
       * @ngdoc property
       * @name echarts-ng.service:storage
       *
       * @type {object}
       *
       * @description - storage for echarts instance
       */
      assistance.storage = angular.isDefined(Map) ? new Map() : new AdaptableMap();
      assistance.generateInstanceIdentity = generateInstanceIdentity;
      assistance.getEchartsGlobalOption = getEchartsGlobalOption;
      assistance.registerEchartsInstance = registerEchartsInstance;
      assistance.queryEchartsInstance = queryEchartsInstance;
      assistance.removeEchartsInstance = removeEchartsInstance;
      assistance.updateEchartsInstance = updateEchartsInstance;
      assistance.driftPaletteProperty = driftPaletteProperty;
      assistance.driftEchartsPalette = driftEchartsPalette;

      return assistance;
      
      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$echarts
       * @name echarts-ng.service:$echarts#getEchartsGlobalOption
       *
       * @description - query the global base echarts option
       */
      function getEchartsGlobalOption() {
        return ctx.GLOBAL_OPTION;
      }
      
      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$echarts
       * @name echarts-ng.service:$echarts#generateInstanceIdentity
       *
       * @return {string}
       *
       * @description - generate unique id for different echarts instance
       */
      function generateInstanceIdentity() {
        return Math.random().toString(36).substr(2, 9);
      }
      
      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$echarts
       * @name echarts-ng.service:$echarts#registerEchartsInstance
       *
       * @param {string} identity - the identity generated before
       * @param {object} instance - the echarts instance
       *
       * @description - store the specific instance
       */
      function registerEchartsInstance(identity, instance) {
        assistance.storage.set(identity, instance);
      }
      
      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$echarts
       * @name echarts-ng.service:$echarts#queryEchartsInstance
       *
       * @param {string} identity - the unique instance id generated by {@link echarts-ng.service:$echarts#generateInstanceIdentity}
       * @return {promise<object>}
       *
       * @description - get the specific echarts instance for event bind or something else
       */
      function queryEchartsInstance(identity) {
        var deferred = $q.defer();
        
        $timeout(function () {
          if (assistance.storage.has(identity)) {
            deferred.resolve(assistance.storage.get(identity));
          } else {
            console.error('Echarts Identity Not Registered, Please Verify The Process');
            deferred.reject({errorDesc: 'Echarts Identity Not Registered, Please Verify The Process'});
          }
        }, 0);
        
        return deferred.promise;
      }
      
      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$echarts
       * @name echarts-ng.service:$echarts#removeEchartsInstance
       *
       * @param {string} identity - the unique instance id generated by {@link echarts-ng.service:$echarts#generateInstanceIdentity}
       *
       * @description - remove specific instance
       */
      function removeEchartsInstance(identity) {
        if (assistance.storage.has(identity)) {
          assistance.storage.delete(identity);
        }
      }
      
      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$echarts
       * @name echarts-ng.service:$echarts#updateEchartsInstance
       *
       * @param {string} identity - the identity generated before
       * @param {object} config - the echarts adaptable option
       *
       * @description - update the instance, switch between loading and draw
       */
      function updateEchartsInstance(identity, config) {
        var instance = assistance.storage.get(identity);
        
        if (angular.isUndefined(instance)) {
          console.warn("The instance not registered. Probably the exception belongs to the directive wrap");
          return;
        }

        $waterfall.wrapWaterfallSeries(config, config.waterfall);

        if (angular.isObject(config) && angular.isArray(config.series) && config.series.length) {
          instance.hideLoading();
          instance.setOption(config);
        } else {
          instance.clear();
          instance.showLoading();
        }
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$echarts
       * @name echarts-ng.service:$echarts#driftEchartsPalette
       *
       * @param {array} instance - the echarts instance
       *
       * @description - drift the palette, improve echarts appearance when multiple similar instance but can't implode
       */
      function driftEchartsPalette(instance) {
        var option = instance.getOption()
          , originPalette = angular.copy(option.color)
          , palette = driftPaletteProperty(originPalette, assistance.storage.size);

        instance.setOption({color: palette});
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$echarts
       * @name echarts-ng.service:$echarts#driftPaletteProperty
       *
       * @param {array} palette - the palette which echarts make use of.
       * @param {number} offset - the palette offset
       *
       * @description - implement for drift the palette
       */
      function driftPaletteProperty(palette, offset) {
        var relative
          , clip
          , length = palette.length;

        relative = offset < length ? offset : offset % length;
        clip = palette.splice(0, relative);

        return palette.concat(clip);
      }
    }];
  }
})(angular);
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
  echartsDirective.$inject = ['$echarts', '$waterfall'];
  function echartsDirective($echarts, $waterfall) {
    return {
      priority: 5,
      restrict: 'A',
      scope: {
        echarts: '=',
        config: '='
      },
      bindToController: true,
      controller: function ($scope, $element) {
        var vm = this;

        var GLOBAL_OPTION = $echarts.getEchartsGlobalOption()
          , identity = vm.echarts
          , config = vm.config
          , theme = GLOBAL_OPTION.theme
          , element = $element[0];

        if (!identity) {
          throw new Error('Echarts Instance Identity Required');
        }

        var instance = theme ? echarts.init(element, theme) : echarts.init(element);

        instance.setOption(GLOBAL_OPTION);

        $echarts.driftEchartsPalette(instance);
        $echarts.registerEchartsInstance(identity, instance);

        $waterfall.adaptWaterfallTooltip(instance, config.waterfall);
        $waterfall.wrapWaterfallSeries(config, config.waterfall);

        angular.isObject(config) && angular.isArray(config.series)
          ? instance.setOption(config)
          : instance.showLoading();

        $scope.$watchCollection('vm.config.title', function () {
          $waterfall.wrapWaterfallSeries(config, config.waterfall);
          $echarts.updateEchartsInstance(identity, config);
        });

        $scope.$watchCollection('vm.config.series', function () {
          $waterfall.wrapWaterfallSeries(config, config.waterfall);
          $echarts.updateEchartsInstance(identity, config);
        });

        $scope.$on('$destroy', function () {
          instance.clear();
          instance.dispose();
          $echarts.removeEchartsInstance(identity);
        });
      },
      controllerAs: 'chart'
    }
  }
})(angular, echarts);