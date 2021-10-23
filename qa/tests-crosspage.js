var Browser = require('zombie'),
        assert = require('chai').assert;

var browser;

suite('Cross-Page Tests', function(){
    /*
    setup(function(){
        browser = new Browser();
    });
    */
    browser = new Browser();

    console.log("start testing");

    test('requesting a group rate quote from the hood river tour page' + 
            'should populate the referrer field', function(done){
                var referrer = 'http://localhost:3000/tours/hood-river';
                //console.log(referrer);
                browser.visit(referrer, function(){                    
                    browser.clickLink('.requestGroupRate', function(){
                        assert(browser.field('referrer').value === referrer);
                        //console.log(browser.field('referrer'));
                        //browser.assert.success();
                        done();
                    });               
                });
            });
    /*
    test('requesting a group rate from the oregon coast tour page should ' +
                'populate the refferer field', function(done){
            var referrer = 'https://localhost:3000/tours/oregon-coast';
            browser.visit(referrer, function(){
                browser.clickLink('.reqestGroupRate', function(){
                    assert(browser.field('referrer').value === referrer);
                    done();
                });
            });
        });
    
    test('visiting the "request group rate" page directly should result ' +
                'in an empty referrer field', function(done){
            browser.visit('https://localhost:3000/tours/request-group-page', function(){
                console.log("page loaded.");
                assert(browser.field('referrer').value === '');
                console.log(browser.name('referrer'));
                console.log(browser.field('referrer'));
                done();
            });
        });
    */
});