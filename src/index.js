/**
 * @description - decorate echarts for angularjs
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
'use strict';

import angular from 'angular';
import echartsDecorateFactory  from './decorate.factory';
import echartsDecorateDirective  from './decorate.directive';

const ECHARTS_NG = 'echarts-ng';

angular.module(ECHARTS_NG, [])
  .factory('$echarts', echartsDecorateFactory)
  .directive('echarts', echartsDecorateDirective);

export { ECHARTS_NG };
