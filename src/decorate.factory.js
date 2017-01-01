/**
 * @description - shortcut usage for echarts-bridge
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
'use strict';

import { Bridge } from '@bornkiller/echarts-bridge';

export /*@ngInject*/ function echartsDecorateFactory() {
  return {
    create
  };
  
  /**
   * @description - create echarts bridge instance
   *
   * @param {string} theme - echarts theme
   * @param {object} initOptions - echarts init options
   */
  function create(theme, initOptions) {
    return Reflect.construct(Bridge, [theme, initOptions]);
  }
}