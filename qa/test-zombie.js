const Browser = require('zombie');

Browser.localhost('example.com', 3000);

describe('User visits rate page', function(){
    const browser = new Browser();

    before(function(){
        browser.visit('/tours/request-group-rate');
    });
    
    describe('submits form', function(){
        before(function(){
            browser.fill('email', 'zombie@underworld.dead');
        return  browser.pressButton('Submit');
        });    

        it('should be succefful', function(){
            browser.assert.success();
        });
    });
});