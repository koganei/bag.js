bag.js
======

A jQuery-like class structure to hold any custom object.

See test file for examples


Modular, Chainable
------------------

Modeled after jQuery, it allows for any collection of object to be used in the same way.
We try to keep the format of the bag element simple.

It has two properties:
- *id*: a unique id to represent the object.
- *_fields*: an object containing your object's properties. (accessible through fields())


Methods
-------

### bag( [bag, jQuery, html]  )

takes in the input and returns a bag element

### .fields( selector )
gets array of value from every item in the bag *(for a single item, a string is returned)*

### .fields( selector, value ), .fields( obj )

sets values to every item in the bag
