describe('echarts-ng $echarts service', function () {
  var $echarts
    , $timeout;
  
  beforeEach(module('echarts-ng'));
  
  beforeEach(inject(function (_$echarts_, _$timeout_) {
    $echarts = _$echarts_;
    $timeout = _$timeout_;
  }));
  
  it('should provide unique identity each time', function () {
    var first = $echarts.generateInstanceIdentity()
      , second = $echarts.generateInstanceIdentity();
    
    expect(first).not.toEqual(second);
  });
  
  it('should register each echarts instance', function () {
    var identity = $echarts.generateInstanceIdentity()
      , instance = 'jasmine-test';
    
    $echarts.registerEchartsInstance(identity, instance);
    
    expect($echarts.storage.has(identity)).toBeTruthy();
    expect($echarts.storage.get(identity)).toEqual(instance);
    
    $echarts.removeEchartsInstance(identity);
    expect($echarts.storage.has(identity)).toBeFalsy();
  });
  
  it('should drift the original palette property', function () {
    var palette = ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980"]
      , driftPalette = ["#5ab1ef", "#ffb980", "#2ec7c9", "#b6a2de"]
      , driftOverflowPalette = ["#b6a2de", "#5ab1ef", "#ffb980", "#2ec7c9"];
    
    expect($echarts.driftPaletteProperty(palette, 2)).toEqual(driftPalette);
    expect($echarts.driftPaletteProperty(palette, 5)).toEqual(driftOverflowPalette);
  });
  
  it('should drift instance palette', function () {
    var identity = $echarts.generateInstanceIdentity()
      , instance = jasmine.createSpyObj('instance', ['getOption', 'setOption']);
    
    instance.getOption.and.returnValues({color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980"]});
    
    $echarts.registerEchartsInstance(identity, instance);
    
    $echarts.driftEchartsPalette(instance);
    expect(instance.setOption).not.toHaveBeenCalled();
    
    $echarts.driftEchartsPalette(instance, true);
    expect(instance.setOption).not.toHaveBeenCalled();
    $timeout.flush(10);
    expect(instance.setOption).toHaveBeenCalledWith({color: ["#b6a2de", "#5ab1ef", "#ffb980", "#2ec7c9"]});
    $timeout.verifyNoPendingTasks();
  });
});