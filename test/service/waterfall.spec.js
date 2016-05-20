describe("echarts-ng waterfall service", function () {
  var $waterfall;

  beforeEach(module("echarts-ng"));

  beforeEach(inject(function (_$waterfall_) {
    $waterfall = _$waterfall_;
  }));

  it("should provide assay result whether waterfall adapt should active", function () {
    expect($waterfall.shouldAdaptWaterfall()).toBeFalsy();
    expect($waterfall.shouldAdaptWaterfall({})).toBeFalsy();
    expect($waterfall.shouldAdaptWaterfall({series: [1, 2]})).toBeFalsy();
    expect($waterfall.shouldAdaptWaterfall({series: [{data: "hello world!"}]})).toBeFalsy();
    expect($waterfall.shouldAdaptWaterfall({series: [{type: "bar"}]})).toBeFalsy();

    expect($waterfall.shouldAdaptWaterfall({series: [{type: "waterfall", data: [10, 20, 30]}]})).toBeTruthy();
  });

  it("should provide switch adapt waterfall tooltip", function () {
    var instance = jasmine.createSpyObj("instance", ["setOption"]);

    spyOn($waterfall, "shouldAdaptWaterfall").and.returnValues(false, true);

    $waterfall.adaptWaterfallTooltip(instance, false);
    expect(instance.setOption).not.toHaveBeenCalled();

    $waterfall.adaptWaterfallTooltip(instance, true);
    expect(instance.setOption).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it("should provide util sum method", function () {
    expect($waterfall.calculateWaterfallSummary([1, 2, 3, 4])).toEqual(10);
  });

  /**
   * @see {@link http://echarts.baidu.com/demo.html#bar-waterfall}
   */
  it("should provide waterfall step stone series", function () {
    var base = [300, 900, 200, 300, 1200, 2900]
      , target = [0, 300, 1200, 1400, 1700, 0];

    expect($waterfall.calculateWaterfallFlow(base)).toEqual(target);
  });
  
  it("should provide waterfall ultimate decoration", function () {
    var original = {
      series: [{
        name: "生活费",
        type: "waterfall",
        data: [300, 900, 200, 300, 1200, 2900]
      }]
    };

    var target = {
      series: [{
        name: "helper",
        type: "bar",
        stack: "waterfall",
        itemStyle: {
          normal: {barBorderColor: "rgba(0,0,0,1)", color: "rgba(0,0,0,0)"},
          emphasis: {barBorderColor: "rgba(0,0,0,0)", color: "rgba(0,0,0,0)"}
        },
        data: [0, 300, 1200, 1400, 1700, 0]
      }, {
        name: "生活费",
        type: "bar",
        data: [300, 900, 200, 300, 1200, 2900],
        stack: "waterfall",
        label: {normal: {"show": true, position: "inside"}}
      }]
    };

    expect($waterfall.adaptWaterfallSeries(original)).toEqual(target);
  });
});