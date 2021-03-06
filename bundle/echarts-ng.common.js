'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var angular = _interopDefault(require('angular'));
var echartsBridge = require('echarts-bridge');

/**
 * @description - shortcut usage for echarts-bridge
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
/* @ngInject */
function echartsDecorateFactory() {
  return {
    create: create
  };

  /**
   * @description - create echarts bridge instance
   *
   * @param {string} theme - echarts theme
   * @param {object} initOptions - echarts init options
   * @param {object} mediaOptions - echarts media options
   */
  function create(theme, initOptions, mediaOptions) {
    return Reflect.construct(echartsBridge.Bridge, [theme, initOptions, mediaOptions]);
  }
}

/**
 * @description - echarts decorate directive
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

/* @ngInject */
function echartsDecorateDirective() {
  return {
    restrict: 'A',
    scope: {
      echarts: '<'
    },
    controller: ['$scope', '$element', function ($scope, $element) {
      var _this = this;

      this.$onInit = function () {
        _this.echarts.connect($element[0]).replay();
      };

      /**
       * @description - re-connect element when bridge changed
       */
      this.$onChanges = function (changes) {
        // mark to avoid repeated connect operation
        var isSubsequentChange = !changes.echarts.isFirstChange();
        var _changes$echarts = changes.echarts,
            currentValue = _changes$echarts.currentValue,
            previousValue = _changes$echarts.previousValue;


        previousValue.disconnect && previousValue.disconnect();
        isSubsequentChange && currentValue.connect($element[0]).replay();
      };

      /**
       * @description - disconnect element before directive destroyed
       */
      this.$onDestroy = function () {
        _this.echarts.disconnect();
      };
    }],
    controllerAs: 'vm',
    bindToController: true
  };
}

/**
 * @description - decorate echarts for angularjs
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

var ECHARTS_NG = 'echarts-ng';

angular.module(ECHARTS_NG, []).factory('$echarts', echartsDecorateFactory).directive('echarts', echartsDecorateDirective);

exports.ECHARTS_NG = ECHARTS_NG;
