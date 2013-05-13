$(function() {
    
    /**
     *
     * 
     * 
     */
    var $slots = $('.slot');


    test( "bag(jQuery) - one", function() {
      mybag = bag($slots.first());

      equal(mybag.length, 1, mybag.get(0));
    } );

    test( "bag(jQuery) - many", function() {
      ok( bag($slots).length > 1, 'length: ' + $slots.length );
    } );

    test( "bag(bag(jQuery))", function() {
      var testbag = bag(bag($slots));
      ok( testbag instanceof Object, "bag of bags! length:" + testbag.length);
    })

    test( "bag(jQuery).get(0)", function() {
      var testbag = bag($slots).get(0);
      ok( testbag.length == 1, "get 0! length:" + testbag.length);
    })


    test( "bag(jQuery).fields()", function() {

      ok( bag($slots.first()).fields() instanceof Object, "fields is an object. length: ");
    } );

    test( "bag(jQuery).fields('Caffeine') - one", function() {
      var testbag = bag($slots.first()).fields('Caffeine');
      var testbag2 = bag($slots.first()).fields('');
      
      ok( testbag instanceof Object || typeof testbag == "string", "fields('Caffeine'). Field is a String: " + testbag);
      ok( testbag2 instanceof Object || typeof testbag2 == "string", "fields(''). Field is a String: " + testbag2);

    })

    test( "bag(jQuery).fields('Caffeine') - many", function() {
      var testbag = bag($slots).fields('Caffeine');

      ok( testbag instanceof Array, "Field is an array. " + testbag );
    })

    test( "bag(jQuery).fields('Caffeine', '50 mg')", function() {
      var testbag = bag($slots).fields('Caffeine', '50 mg');
      
      ok( testbag.get(0).fields('Caffeine') == '50 mg' && testbag.get(5).fields('Caffeine') == '50 mg', "Fields have been changed to: " + testbag.get(0).fields('Caffeine'));
    })

    test( "bag(jQuery).first()", function() {
      var testbags = bag($slots);
      var myBag = testbags.first();

      ok( myBag.length == 1, "Length of bag is 1");
    });

    test( "bag(jQuery).each(function() {})", function() {
      var testbags = bag($slots);

      var myBag = testbags.each(function(i) {
        var myField = this.fields();

        ok( myField instanceof Object, "myField is an object of fields: " + Object.keys(myField) );

      });

    });

    test( "bag().options('test', '2')", function() {
        var myBag = bag().options('test', '2');
        var myBag2 = bag().options('test', '4');

        ok( myBag.options('test') == 4, "Global options for 'test' have changed from 2 to ", myBag.options('test') )

    });

    
});