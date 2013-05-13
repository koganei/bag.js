bag.js
======

A jQuery-like class structure to hold any custom object.

See test file for examples


Modular, Chainable
------------------

Modeled after jQuery, it allows for any collection of object to be used in the same way.
We try to keep the format of the bag element simple.

Every item in a bag has two properties:
- `id`: a unique id to represent the item.
- `_fields`: an object containing your item's properties. (accessible through fields())



Methods
-------

### bag( [bag, jQuery, html]  )

```javascript
var myBag = bag( $('#my-items-container') );
```

takes in the input and returns a bag element

### options( option, value ), options( obj )
```javascript
bag().options('itemSelector', '.slot')  // set the jQuery selector for a single item
     .options({
        'fieldSelector': '.field',      // set the jQuery selector for an item's field
        'labelSelector': '.label',      // set the jQuery selector for a field's label
        'contentSelector': '.content'   // set the jQuery selector for a field's content
     }); 
```

Sets global options for all bags in the page. It is recommended to only set this up once on page load before first bag call.

### .fields( selector )

```javascript
var myFields  = bag( $('#my-items-container') ).fields(); // object
var myFields2 = bag( $('#my-items-container') ).fields( 'customProperty' ); // array

var myField   = bag( $('#my-items-container') ).first().fields(); // object
var myField2  = bag( $('#my-items-container') ).first().fields( 'customProperty' ); // string

```

gets field values from every item in the bag

### .fields( selector, value ), .fields( obj )

```javascript
var myBag  =  bag( $('#my-items-container') ).fields( 'customProperty', true );
var myBag2 =  bag( $('#my-items-container') ).fields({
  'customProperty'  : true,
  'myOtherProperty' : false
});
```

sets values to every item in the bag

### .first(  )

```javascript
var myItem = bag( $('#my-items-container') ).first();
```

returns a bag containing the first element

### .each( function( index ) )

```javascript
var myBag =  bag( $('#my-items-container') ).each( function(i) {
  this.fields('myItemIndex', i);
});
```

calls the given function on every item in the bag, `this` is a bag containing the item
