module.exports = function () {

    this.Given(/^Go to login page$/, function (callback) {
        browser.get('#!/login').then(callback);
    });

    this.Then(/^I could see input line$/, function (callback) {
        expect(element.all(by.id('pass')).count()).to.eventually.eql(1);
        expect(element.all(by.id('user')).count()).to.eventually.eql(1).notify(callback);
    });

    this.When(/^I input username and pass$/, function (callback) {
        element.all(by.id('user')).first().sendKeys('fennu637');
        element.all(by.id('pass')).first().sendKeys('ffffff').then(callback);
    });

    this.When(/^I click the login button$/, function (callback) {
        element.all(by.css('.btn-primary')).first().click().then(callback);
    });

};