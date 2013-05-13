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
var myBag = bag( $('#my-item') );
```

takes in the input and returns a bag element

### .fields( selector )

```javascript
var myFields = bag( $('#my-item') ).fields(); // array
var myField  = bag( $('#my-item') ).fields( 'customProperty' ); // string
```

gets array of value from every item in the bag *(for a single item, a string is returned)*

### .fields( selector, value ), .fields( obj )

```javascript
var myBag  =  bag( $('#my-item') ).fields( 'customProperty', true );
var myBag2 =  bag( $('#my-item') ).fields({
  'customProperty'  : true,
  'myOtherProperty' : false
});
```

sets values to every item in the bag

### .first(  )

```javascript
var myItem = bag( $('#my-item') ).first();
```

returns a bag containing the first element

### .each( function( index ) )
```javascript
var myBag =  bag( $('#my-item') ).each( function(i) {
  this.fields('myItemIndex', i);
});
```

calls the given function on every item in the bag, `this` is a bag containing the item
