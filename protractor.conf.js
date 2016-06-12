// conf.js
exports.config = {
  // selenium server related
  // The address of a running Selenium Server. If specified, Protractor will
  // connect to an already running instance of Selenium. This usually looks like
  // seleniumAddress: 'http://localhost:4444/wd/hub'
  seleniumAddress: "http://localhost:4444/wd/hub",

  // @todo Protractor connect remote server
  // Boolean. If true, Protractor will connect directly to the browser Drivers
  // at the locations specified by chromeDriver and firefoxPath. Only Chrome
  // and Firefox are supported for direct connect.
  directConnect: true,

  // browser launch related
  // Protractor can launch your tests on one or more browsers.
  capabilities: {
    browserName: "chrome",
    name: "echarts-ng",
    logName: "Chrome - English"
  },
  
  // A base URL for your application under test.
  // with relative paths will be resolved against this URL
  baseUrl: "http://localhost:3000",
  
  // Spec patterns are relative to the location of this config
  specs: ["e2e/spec/*.spec.js"],

  // jasmine spec related
  // Test framework to use.
  framework: "jasmine",

  jasmineNodeOpts: {
    // If true, print colors to the terminal.
    showColors: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 30000
  },
  
  // prepare the browser window size
  onPrepare: function () {
    browser.driver.manage().window().maximize();
  }
};