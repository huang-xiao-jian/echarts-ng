var DimensionPage = require("../page/dimension.page");
var $tool = require("../util/visualize.util");

describe("risk center authorize page", function () {
  var $dimension = new DimensionPage();

  beforeAll(function() {
    browser.get("/dynamic.html");
  });

  it("should support multiple echarts dimension adapt", function () {
    $dimension.chooseSpecificSeries(1);
    expect($dimension.getEchartsDimension()).toEqual("405px");

    // give echarts repaint time period
    browser.sleep(800);
    $tool.takeScreenShot("multi-dimension.png");
  });

  it("should support medium echarts dimension adapt", function () {
    $dimension.chooseSpecificSeries(2);
    expect($dimension.getEchartsDimension()).toEqual("180px");

    // give echarts repaint time period
    browser.sleep(800);
    $tool.takeScreenShot("medium-dimension.png");
  });

  it("should support single echarts dimension adapt", function () {
    $dimension.chooseSpecificSeries(3);
    expect($dimension.getEchartsDimension()).toEqual("60px");

    // give echarts repaint time period
    browser.sleep(800);
    $tool.takeScreenShot("single-dimension.png");
  });
});