var Browser = require('zombie');
 
// We're going to make requests to http://example.com/signup
// Which will be routed to our test server localhost:3000
Browser.localhost('example.com', 3000);
 
describe('User visits signup page', function() {
 
  var browser = new Browser();
 
  before(function() {
    return browser.visit('/signup');
  });
 
  describe('submits form', function() {
 /*
    before(function() {
      browser
        .fill('input[name="email"]',    'zombie@underworld.dead')
        .fill('input[name="password"]', 'eat-the-living');
      return browser.pressButton('Sign Me Up!');
    });
 */
    before(function(){
        browser.fill('email', 'test@gmail.com');
        browser.fill('password', 'abcdef');
        //browser.pressButton('Submit');
    });
    

    it('should be successful', function() {
      browser.assert.success();
    });
 
    it('should see welcome page', function() {
      browser.assert.text('title', 'Meadowlark Travel');
    });
  });
 
});