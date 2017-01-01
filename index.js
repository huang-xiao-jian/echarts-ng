/**
 * @description - decorate echarts for angularjs
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
'use strict';

import angular from 'angular';
import { echartsDecorateFactory } from './src/decorate.factory';
import { echartsDecorateDirective } from './src/decorate.directive';

const DECORATE_NAME = 'echarts-ng';

angular.module(DECORATE_NAME, [])
  .factory('$echarts', echartsDecorateFactory)
  .directive('echarts', echartsDecorateDirective);

export { DECORATE_NAME };
