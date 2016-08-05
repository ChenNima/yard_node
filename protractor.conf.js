/**
 * Created by yichen on 8/5/16.
 */
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['features/**/*.feature'],
    exclude: [],
    mocks: {
        default: [],
        dir: 'features/mock-data'
    },
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    cucumberOpts: {
        require: 'features/**/step_definitions/*.js',
        format: 'pretty'
    },
    capabilities: {
        browserName: 'chrome'
    },
    baseUrl: 'http://localhost:3000',
    resultJsonOutputFile: 'features/report.json',
    onPrepare: function () {
        var chai = require('chai');
        var mock = require('protractor-http-mock');

        chai.use(require('chai-as-promised'));
        chai.use(require('chai-string'));
        // chai.should();
        global.expect = chai.expect;
        global.Q = require('q');
        global.wait_until_modal_open = function (element) {
            return browser.wait(function () {
                return element.isPresent().then(function (present) {
                    return present;
                });
            }, 1500);
        };

        global.wait_until_modal_close = function (element) {
            return browser.wait(function () {
                return element.isPresent().then(function (present) {
                    return !present;
                });
            }, 1500);
        };

        global.wait_until_element_present = function (element) {
            return browser.wait(function () {
                return element.isPresent().then(function (present) {
                    return present;
                });
            }, 3000);
        };


        // set the window size
        var window = browser.manage().window();

        // set the window size
        browser.getCapabilities()
            .then(function(dimensions) {  // setWindowSize
                return window.setSize(1280, 1024);
            })
            .then(function(dimensions) {  // showWindowSize
                console.log('Running e2e tests...');
            });

    }
};
