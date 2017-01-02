/**
 * @description - echarts decorate directive
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
'use strict';

export /* @ngInject */ function echartsDecorateDirective() {
  return {
    restrict: 'A',
    scope: {
      echarts: '<',
    },
    controller: ['$scope', '$element', function ($scope, $element) {
      this.$onInit = () => {
        this.echarts.connect($element[0]).replay();
      };
  
      /**
       * @description - re-connect element when bridge changed
       */
      this.$onChanges = (changes) => {
        // mark to avoid repeated connect operation
        let isSubsequentChange = !changes.echarts.isFirstChange();
        let { currentValue, previousValue } = changes.echarts;
        
        previousValue.disconnect && previousValue.disconnect();
        isSubsequentChange && currentValue.connect($element[0]).replay();
      };
  
      this.$onDestroy = () => {
        this.echarts.disconnect();
      };
    }],
    controllerAs: 'vm',
    bindToController: true
  };
}