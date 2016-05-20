describe("echarts-ng echarts directive", function () {
  var $echarts
    , $rootScope
    , $scope
    , $compile
    , body = $("body")
    , template = $("<div echarts=\"identity\" config=\"config\" echarts-dimension=\"dimension\" style=\"width: 100px\"></div>").appendTo(body);

  beforeEach(function () {
    module("echarts-ng");
  });

  beforeEach(inject(function (_$echarts_, _$rootScope_, _$compile_) {
    $echarts = _$echarts_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  describe("echarts-ng echarts directive exception handle", function () {
    it("should throw error when miss identity", function () {
      expect($compile(template).bind(this, $scope)).toThrow();
    });
  });

  describe("echarts-ng echarts directive core implement", function () {
    var updateEchartsInstance;

    beforeEach(function () {
      updateEchartsInstance = spyOn($echarts, "updateEchartsInstance").and.stub();
      $scope.identity = $echarts.generateInstanceIdentity();
      $scope.dimension = "5:4";
      $scope.config = {
        title: {
          text: "Pie Chart",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },
        xAxis: [{
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        }],
        yAxis: [{
          type: "value"
        }],
        series: [{
          name: "搜索引擎",
          type: "bar",
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }]
      };
    });

    beforeEach(function () {
      $compile(template)($scope);
      $scope.$digest();
    });

    it("should synchronize title change", function () {
      $scope.config.title.left = "left";
      $scope.$digest();
      expect(updateEchartsInstance).toHaveBeenCalledWith($scope.identity, $scope.config);
    });

    it("should synchronize title change", function () {
      $scope.config.title.textStyle = {fontStyle: "italic"};
      $scope.$digest();
      expect(updateEchartsInstance).toHaveBeenCalledWith($scope.identity, $scope.config);
    });

    it("should synchronize series change", function () {
      $scope.config.series[0] = {
        name: "jasmine",
        type: "bar",
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      };
      $scope.$digest();
      expect(updateEchartsInstance).toHaveBeenCalledWith($scope.identity, $scope.config);
    });

    it("should synchronize series change", function () {
      $scope.config.series[1] = {
        name: "jasmine",
        type: "line",
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      };
      $scope.$digest();
      expect(updateEchartsInstance).toHaveBeenCalledWith($scope.identity, $scope.config);
    });
  });
});