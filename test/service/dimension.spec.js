describe('echarts-ng dimension service', function () {
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
  
  it('should add inline height property when element not specific', function () {
    var element = document.createElement('div')
      , targetHeight = 100;

    $dimension.adaptEchartsDimension(element, targetHeight);
  
    expect($(element).height()).toEqual(targetHeight);
  });

  it('should remove height property when unnecessary', function () {
    var element = document.createElement('div')
      , targetHeight = 100;
  
    $dimension.adaptEchartsDimension(element, targetHeight);
    $dimension.removeEchartsDimension(element);
  
    expect($(element).height()).toEqual(0);
  });

  it('should calculate initialize height avoid draw silent error', function () {
    var element = document.createElement('div')
      , warn = spyOn(console, 'warn');

    expect(warn).not.toHaveBeenCalled();
    $dimension.calculateEchartsDimension(element);
    expect(warn).toHaveBeenCalled();
  });
  
  it('should calculate initialize height avoid draw silent error', function () {
    var element = document.createElement('div')
      , warn = spyOn(console, 'warn');
    
    expect(warn).not.toHaveBeenCalled();
    $dimension.calculateEchartsDimension(element, '16:8:7');
    expect(warn).toHaveBeenCalled();
  });

  it('should calculate initialize height avoid draw silent error', function () {
    var element = $('<div style="width: 160px"></div>').appendTo(document.body)[0]
      , warn = spyOn(console, 'warn')
      , targetHeight = 70
      , calculateHeight;
  
    expect(element.clientWidth).toEqual(160);
    expect(warn).not.toHaveBeenCalled();
  
    calculateHeight = $dimension.calculateEchartsDimension(element, '16:7');
    
    expect(warn).not.toHaveBeenCalled();
    expect(calculateHeight).toEqual(targetHeight);
  });


  it('should wrap echarts instance resize', function () {
    var instance = jasmine.createSpyObj('instance', ['resize']);

    expect(instance.resize).not.toHaveBeenCalled();

    $dimension.synchronizeEchartsDimension(instance);
    expect(instance.resize).toHaveBeenCalled();
  });
});