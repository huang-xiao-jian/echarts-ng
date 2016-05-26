(function (window) {
  "use strict";

  /*global Map:true*/
  if (!Map) window.Map = AdaptableMap;

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
    if (this.has(identity)) delete this.storage[identity];
  };

  Object.defineProperty(AdaptableMap.prototype, "size", {
    enumerable: true,
    configurable: false,
    get: function () {
      return Object.keys(this.storage).length;
    }
  });
})(window);
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
  angular.module("echarts-ng", []);
})(angular);
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
(function (angular) {
  "use strict";
  
  angular.module("echarts-ng").provider("$echarts", EchartsAssistanceProvider);
  
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
      theme: "macarons",
      driftPalette: true,
      title: {
        left: "center",
        top: "top",
        padding: [20, 10, 10, 10]
      },
      grid: {
        top: "15%",
        left: "5%",
        right: "5%",
        bottom: "5%",
        containLabel: true
      },
      backgroundColor: "rgba(255, 255, 255, .5)",
      legend: {
        left: "center",
        top: "top",
        padding: [20, 10, 10, 10]
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      }
    };
    
    // modify base echarts options
    ctx.setGlobalOption = function (option) {
      angular.merge(ctx.GLOBAL_OPTION, option);
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
    ctx.$get = ["$q", "$timeout", "$waterfall", "$dimension", function ($q, $timeout, $waterfall, $dimension) {
      var assistance = {};

      /*global Map*/

      /**
       * @ngdoc property
       * @name echarts-ng.service:storage
       *
       * @type {object}
       *
       * @description - storage for echarts instance, provide decorative shim avoid unexpected situation
       */
      assistance.storage = new Map();
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
            console.error("Echarts Identity Not Registered, Please Verify The Process"); //eslint-disable-line no-console
            deferred.reject({errorDesc: "Echarts Identity Not Registered, Please Verify The Process"});
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
        assistance.storage.delete(identity);
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
        var instance = assistance.storage.get(identity)
          , decorativeConfig;

        if (angular.isUndefined(instance)) {
          console.warn("The instance not registered. Probably the exception belongs to the directive wrap"); //eslint-disable-line no-console
          return;
        }

        $waterfall.adaptWaterfallTooltip(instance, config);
        $dimension.shouldAdjustEchartsDimension(config.dynamic, config.series) && $dimension.adjustEchartsDimension(instance.getDom(), config.series);
        decorativeConfig = $waterfall.adaptWaterfallSeries(config);

        if (angular.isObject(decorativeConfig) && angular.isArray(decorativeConfig.series) && decorativeConfig.series.length) {
          instance.hideLoading();
          instance.resize();
          instance.setOption(decorativeConfig);
        } else {
          //instance.clear();
          instance.showLoading("default", {maskColor: "rgba(255, 255, 255, 1)"});
        }
      }

      /**
       * @ngdoc method
       * @methodOf echarts-ng.service:$echarts
       * @name echarts-ng.service:$echarts#driftEchartsPalette
       *
       * @param {array} instance - the echarts instance
       * @param {boolean} driftPalette - whether active palette drift
       *
       * @description - drift the palette, improve echarts appearance when multiple similar instance but can't implode
       */
      function driftEchartsPalette(instance, driftPalette) {
        if (!driftPalette) return;

        var option = instance.getOption()
          , originPalette = angular.copy(option.color)
          , palette = driftPaletteProperty(originPalette, assistance.storage.size);

        $timeout(function() {
          instance.setOption({color: palette});
        }, 0);
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
        palette = angular.copy(palette);
        
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