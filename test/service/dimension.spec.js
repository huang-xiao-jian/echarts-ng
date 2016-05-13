describe('echarts-ng waterfall service', function () {
  var $dimension;

  beforeEach(module('echarts-ng'));

  beforeEach(inject(function (_$dimension_) {
    $dimension = _$dimension_;
  }));
  
  it('should provide proposal for dynamic height', function () {
    expect($dimension.calculateDynamicDimension([{data: [10, 20, 15]}])).toEqual('180px');
    expect($dimension.calculateDynamicDimension([{data: [10, 20, 15, 25, 45, 50]}])).toEqual('270px');
    expect($dimension.calculateDynamicDimension([{data: [10, 20, 15, 10, 20, 15, 10, 20, 15, 20]}])).toEqual('350px');
  });

  it('should wrap echarts instance resize', function () {
    var instance = jasmine.createSpyObj('instance', ['resize']);

    expect(instance.resize).not.toHaveBeenCalled();

    $dimension.synchronizeEchartsDimension(instance);
    expect(instance.resize).toHaveBeenCalled();
  });
});