/**
 * @description - echarts factory specs, how to write suit and case ???
 */
'use strict';

import { Bridge } from '@bornkiller/echarts-bridge';
import { DECORATE_NAME } from '../src/index';

/* globals module:true, inject: true */
describe('echarts factory', function () {
  let $echarts;

  beforeEach(function () {
    module(DECORATE_NAME);
  });

  beforeEach(function () {
    inject(function (_$echarts_) {
      $echarts = _$echarts_;
    });
  });

  it('should generate Bridge instance', function () {
    expect($echarts.create('roma', {}, []) instanceof Bridge).toBeTruthy();
  });
});
