module.exports = DynamicPage;

/**
 * @description - dynamic dimension page operation
 *
 * @constructor
 */
function DynamicPage() {
  this.options = element.all(by.options("item as item.description for item in optionalDistributionList"));
  this.echarts = element(by.css(".echarts-wrap"));
  this.browser = browser;
}

/**
 * @description - choose specific option
 * 
 * @param {number} index
 */
DynamicPage.prototype.chooseSpecificSeries = function(index) {
  this.options.get(index).click();
};

/**
 * @description - get the echarts box height
 * 
 * @returns {string} - the element calculated height
 */
DynamicPage.prototype.getEchartsDimension = function() {
  return this.echarts.getCssValue("height");
};
