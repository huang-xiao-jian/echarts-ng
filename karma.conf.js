// Karma configuration
// Generated on Tue Sep 20 2016 18:36:39 GMT+0800 (CST)

const babel = require('rollup-plugin-babel');
const istanbul = require('rollup-plugin-istanbul');
const resolve = require('rollup-plugin-node-resolve');
const ngAnnotate = require('rollup-plugin-ng-annotate');

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/echarts/dist/echarts.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'test/*.spec.js'
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/*.spec.js': ['rollup', 'sourcemap']
    },

    rollupPreprocessor: {
      plugins: [
        resolve({ jsnext: true, main: true }),
        ngAnnotate(),
        istanbul({
          exclude: ['test/*.spec.js', 'node_modules/**/*']
        }),
        babel()
      ],
      external: ['echarts', 'angular'],
      globals: {
        echarts: 'echarts',
        angular: 'angular'
      },
      format: 'iife',
      sourceMap: 'inline'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcov', subdir: 'lcov' }
      ]
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
