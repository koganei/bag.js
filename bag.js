/**
 * @file
 * The bag factory.
 *
 * Modeled after the jQuery core
 * https://github.com/jquery/jquery/blob/master/src/core.js
 *
 * @author Marc Khoury <marc.khoury@net-forge.com>
 * @author Netforge Inc. <net-forge.com>
 * 
 * 
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - http://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {



		var

			/**
			 * A central reference to the root bag (document)
			 * Like... window.rootbag will be used to point to an empty rootSlotFactory, or the "originator" of all future slotFactories.
			 */
			rootbag,

			/**
			 * Map over bag in case of overwrite
			 */
			_bag = window.bag,
			_b = window.b,

			/**
			 * some core properties and methods
			 */
			
			core_version = "@VERSION",

			// A simple way to check for HTML strings
			// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
			// Strict HTML recognition (#11290: must start with <)
			rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

			/**
			 * An empty slot item
			 */
			_slot = {
				id 			: 0,
				name 		: '',
				quantity	: 0,
				level 		: 0,
				quickslot	: 0,
				owner 		: 0,
				type		: 0,
				_fields		: {} // namespaced into a private place so that field() can be used to get/set
			},

			/**
			 * Define a local copy of bag
			 */
			bag = function( selector, context, options ) {
				return new bag.fn.init( selector, context, options, rootbag );
			};


		bag.fn = bag.prototype = {
			// the current version of bag being used
			bag: core_version,

			constructor: bag,
			init: function( selector, context, options, rootbag ) {
				var match;

				// Handle bag(""), bag(null), bag(undefined), bag(false)
				if ( !selector ) {

					return this;
				}

				// Handle HTML strings
				$slots = $(selector).find('.slot');
				$slots = $slots.length ? $slots : $(selector).filter('.slot');
				
				if( $slots.length ) {

					var _this = this;

					$slots.each( function(i) {
						// make into slots
						var newSlot = _this.htmlToSlots(this);
						// bnewSlot = $.merge([], [_slot]);
						$.merge(_this, [newSlot])
					});

					return this;
					
				}

				// Handle single slot
				if( this.compare(selector, _slot) ) {
					// add the slot to the bag object
					this.push(selector);
					//this.length++;
					return this;
				}

				// Handle array of slots
				if( selector instanceof Array ) {
					for (var i = selector.length - 1; i >= 0; i--) {
						if( this.compare(selector[i], _slot) ) {
							this.push(selector[i]);
							//this.length++;
						}

					}
					return this;
				}

				// Handle a bag
				if( selector.bag ) {
					$.merge(this, selector.splice(0));
					return this;
				}



			},

			selector: "",

			/**
			 * length, splice, push, sort make it look like an array
			 */
			length: 0,
			push: [].push,
			sort: [].sort,
			splice: [].splice,

			toArray: function() {
				return [].slice.call( this );
			},

			// Get the Nth element in the matched element set OR
			// Get the whole matched element set as a clean array
			get: function( num ) {
				return num == null ?

					// Return itself
					this :

					// Return a bag of the object
					bag( this[ num ] );
			},

			compare: function(a, b) {
				
				if( a instanceof Array && b instanceof Array ) {
					// compare keys if they're arrays
					var hasSameKeys = true;
					for(var key in a) { if(b[key] == undefined) { hasSameKeys = false; } }
					return hasSameKeys;
				}

				if( a instanceof Object && b instanceof Object ) {
					// compare keys if they're objects
					var aKeys = Object.keys(a).sort();
					var bKeys = Object.keys(b).sort();
					return JSON.stringify(aKeys) === JSON.stringify(bKeys);
				}
			},

			htmlToSlots: function( html ) {
				// get all the html fields of the slot
				var $fields	= $(html).find('.views-field');

				// a holder to put 'field-title':'field-content' in to sanitize later
				var temporaryFields = {};

				// we get the content
				$fields.each( function(i) {
					var label	= $(this).find('.views-label').text(),
						content = $(this).find('.field-content').text();

					label = label || i;
					temporaryFields[label] = content;
				} );

				newSlot = $.extend({}, _slot);
				newSlot._fields = temporaryFields;

				return newSlot;
			},

			fields: function( selector, value ) {
				var returnArray = [];

				// Handle bag().fields(  )
				if(this.length == 0) { return [] }

				// Handle fields( selector, value )
				if( selector && value ) {
						// set
						for (var i = this.length - 1; i >= 0; i--) {
							slot = this[i];
							slot._fields[selector] = value;
						}

						return this;
				}

				// Handle bag($slots).fields( selector ) or bag ($slots).fields()
				for ( var i = this.length - 1; i >= 0; i-- ) {
					currentSlot = this[i];
					returnArray[i] = [];

					// Handle .fields( selector )
					if( selector ) {
						if(this.length == 1) { return currentSlot._fields[selector]; }
						returnArray[i] = currentSlot._fields[selector];

					// Handle .fields()
					} else {
						if(this.length == 1) { return currentSlot._fields; }
						for( var j in currentSlot._fields) {
							currentField = currentSlot._fields[j];
							returnArray[i][j] = currentField;	
						}
					}
					
				}

				return returnArray; // return all fields if selector is empty
			},

			first: function() {
				return this.get(0);
			},

			each: function( fn ) {
				for (var i = 0; i < this.length; i++) {
					var slot = this[i];

					if($.isFunction(fn)) {
						fn.call(bag(slot), i);
					}

				}

				return this;
			}
		};

		// Give the init function the jQuery prototype for later instantiation
		bag.fn.init.prototype = bag.fn;

		// All jQuery objects should point back to these
		// rootbag = bag(document);

		window.bag = window.b = bag;



})(jQuery, '', this, this.document);