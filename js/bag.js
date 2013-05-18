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

(function ($, Drupal, window, document, undefined) {



		var

			/**
			 * A central reference to the root bag (document)
			 * Like... window.rootbag will be used to point to an empty rootitemFactory, or the "originator" of all future itemFactories.
			 */
			rootbag,

			/**
			 * Map over bag in case of overwrite
			 */
			_bag = window.bag,
			_b = window.b,

			// global options for bag
			_options = {
				itemSelector : ".slot", // you can change it whatever
				fieldSelector: '.views-field',
				labelSelector: '.views-label',
				contentSelector: '.field-content',
			}, 

			/**
			 * some core properties and methods
			 */
			
			core_version = "@VERSION",

			// A simple way to check for HTML strings
			// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
			// Strict HTML recognition (#11290: must start with <)
			rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

			/**
			 * The template for the item
			 */
			_item = {
				id 			: 0,
				_fields		: {} // underscore-spaced fields() can be used to get/set
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
				$items = $(selector).find(_options['itemSelector']);
				$items = $items.length ? $items : $(selector).filter(_options['itemSelector']);
				
				if( $items.length ) {

					var _this = this;

					$items.each( function(i) {
						// make into items
						var newitem = _this.import(this);
						// bnewitem = $.merge([], [_item]);
						$.merge(_this, [newitem])
					});

					return this;
					
				}

				// Handle single item
				if( this.compare(selector, _item) ) {
					// add the item to the bag object
					this.push(selector);
					//this.length++;
					return this;
				}

				// Handle array of items
				if( selector instanceof Array ) {
					for (var i = selector.length - 1; i >= 0; i--) {
						if( this.compare(selector[i], _item) ) {
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

			options: function( options, value ) {
				// handle .options({ test: 'test' })
				if( options instanceof Object ) {
					for(var index in options) {
						_options[index] = options[index];
					}

					return this;
				}

				// handle .options('test')
				if( typeof options == "string" ) {
					// handle .options('test', 4)
					if( value ) {
						_options[options] = value;
						return this;
					}

					return _options[options];
				}

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

			import: function( html ) {
				// get all the html fields of the item
				var $fields	= $(html).find(_options['fieldSelector']);

				// a holder to put 'field-title':'field-content' in to sanitize later
				var temporaryFields = {};

				// we get the content
				$fields.each( function(i) {
					var label	= $(this).find(_options['labelSelector']).text(),
						content = $(this).find(_options['contentSelector']).text();

					label = label || i;
					temporaryFields[label] = content;
				} );

				newitem = $.extend({}, _item);
				newitem._fields = temporaryFields;

				return newitem;
			},

			fields: function( selector, value ) {
				var returnArray = [];

				// Handle bag().fields(  )
				if(this.length == 0) { return [] }

				// Handle fields( selector, value )
				if( selector && value ) {
						// set
						for (var i = this.length - 1; i >= 0; i--) {
							item = this[i];
							item._fields[selector] = value;
						}

						return this;
				}

				// Handle bag($items).fields( selector ) or bag ($items).fields()
				for ( var i = this.length - 1; i >= 0; i-- ) {
					currentitem = this[i];
					returnArray[i] = [];

					// Handle .fields( selector )
					if( selector ) {
						if(this.length == 1) { return currentitem._fields[selector]; }
						returnArray[i] = currentitem._fields[selector];

					// Handle .fields()
					} else {
						if(this.length == 1) { return currentitem._fields; }
						for( var j in currentitem._fields) {
							currentField = currentitem._fields[j];
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
					var item = this[i];

					if($.isFunction(fn)) {
						fn.call(bag(item), i);
					}

				}

				return this;
			},

			add: function( items ) {
				if(item.bag) {
					var newItems = [].splice.call(item, 0);

					this.push(newItems);
				}

				return this;
			},

			where: function ( filter ) {
				var returnArray = [];

				for ( var i = this.length - 1 ; i >= 0 ; i-- ) {
					var item 		= this[i],
						thisItem	= false;
					
					for( var f in filter ) {
						
						if( item._fields[f] == filter[f] ) {
							thisItem = true;
						}
					}

					if(thisItem) {
						returnArray.push(item);
					}

				};

				return bag(returnArray);
			},

			average: function( fieldName ) {
				var averages = {};
				
				for (var i = this.length - 1; i >= 0; i--) {
					var item = this[i];

					for( var f in item._fields ) {
						var numb = item._fields[f].match(/[0-9]+/);
							
						if(numb instanceof Array) {
							numb = numb.join("");
						}

						if(fieldName) {
							if($.isNumeric(numb) && fieldName == f) {
								if(!averages[f]) { averages[f] = 0; }
								averages[f] += parseInt(numb, 10);
							}
						} else {
							if($.isNumeric(numb)) {
								if(!averages[f]) { averages[f] = 0; }
								averages[f] += parseInt(numb, 10);
							}
						}
					}

					
				}

				for( var a in averages ) {
					averages[a] = averages[a] / this.length;
				}

				return averages;
			}
		};



		// Give the init function the jQuery prototype for later instantiation
		bag.fn.init.prototype = bag.fn;

		// All jQuery objects should point back to these
		rootbag = bag(document);

		window.bag = window.b = bag;





})(jQuery, '', this, this.document);