describe("echarts-ng dimension service element irrelevant operation", function () {
  var $dimension;

  beforeEach(module("echarts-ng"));

  beforeEach(inject(function (_$dimension_) {
    $dimension = _$dimension_;
  }));
  
  it("should determine whether insert inline height when initialize", function () {
    var warn = spyOn(console, "warn");
    expect(warn).not.toHaveBeenCalled();
    expect($dimension.shouldAdaptDimension()).toBeFalsy();
    expect($dimension.shouldAdaptDimension(null, 25)).toBeFalsy();
    expect(warn).toHaveBeenCalled();
  });

  it("should determine whether insert inline height when initialize", function () {
    var warn = spyOn(console, "warn");
    expect(warn).not.toHaveBeenCalled();
    expect($dimension.shouldAdaptDimension(null, "100px")).toBeFalsy();
    expect(warn).toHaveBeenCalled();
  });

  it("should determine whether insert inline height when initialize", function () {
    var warn = spyOn(console, "warn");
    expect(warn).not.toHaveBeenCalled();
    expect($dimension.shouldAdaptDimension(null, "16:9")).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
  });

  it("should provide algorithm for dynamic height calculate", function () {
    expect($dimension.calculateDynamicDimension([{data: [10, 20, 15]}])).toEqual("180px");
  });

  it("should provide algorithm for dynamic height calculate", function () {
    expect($dimension.calculateDynamicDimension([{data: [10, 20, 15, 25, 45, 50]}])).toEqual("270px");
  });

  it("should provide algorithm for dynamic height calculate", function () {
    expect($dimension.calculateDynamicDimension([{data: [10, 20, 15, 10, 20, 15, 10, 20, 15, 20]}])).toEqual("350px");
  });

  it("should determine whether active dynamic height insert", function () {
    expect($dimension.shouldAdjustEchartsDimension(false)).toBeFalsy();
    expect($dimension.shouldAdjustEchartsDimension(true)).toBeFalsy();
  });

  it("should determine whether active dynamic height insert", function () {
    expect($dimension.shouldAdjustEchartsDimension(false)).toBeFalsy();
    expect($dimension.shouldAdjustEchartsDimension(true)).toBeFalsy();
  });

  it("should determine whether active dynamic height insert", function () {
    expect($dimension.shouldAdjustEchartsDimension(true, null)).toBeFalsy();
    expect($dimension.shouldAdjustEchartsDimension(true, [])).toBeFalsy();
  });

  it("should determine whether active dynamic height insert", function () {
    expect($dimension.shouldAdjustEchartsDimension(true, [{data: []}])).toBeTruthy();
  });

  it("should wrap echarts instance resize", function () {
    var instance = jasmine.createSpyObj("instance", ["resize"]);

    expect(instance.resize).not.toHaveBeenCalled();
    $dimension.synchronizeEchartsDimension(instance);
    expect(instance.resize).toHaveBeenCalled();
  });
});

describe("echarts-ng dimension service element related operation", function () {
  var $dimension
    , body = $("body")
    , template
    , element;

  beforeEach(module("echarts-ng"));

  beforeEach(inject(function (_$dimension_) {
    $dimension = _$dimension_;
  }));

  beforeEach(function () {
    template = $("<div style=\"width: 100px; padding: 0\"></div>").appendTo(body);
    element = template[0];
  });

  afterEach(function () {
    template.remove();
    element = null;
  });

  it("should provide original height avoid echarts error", function () {
    $dimension.adaptEchartsDimension(element, "10:7");
    expect(template.height()).toEqual(70);
  });

  it("should remove inline height", function () {
    var originalHeight = template.height();

    $dimension.adaptEchartsDimension(element, "10:7");
    $dimension.removeEchartsDimension(element);
    expect(template.height()).toEqual(originalHeight);
  });
  
  it("should provide dynamic height avoid ugly visual", function () {
    spyOn($dimension, "calculateDynamicDimension").and.returnValue("70px");
    $dimension.adjustEchartsDimension(element, []);
    expect(template.height()).toEqual(70);
  });
});