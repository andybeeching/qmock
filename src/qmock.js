/*
 *  QMock - an 'expect-run-verify' JavaScript object mocking library
 *  ===========================================================================
 *
 *  Copyright (c) 2007-2010, Andy Beeching <andybeeching at gmail dot com>
 *  Dual licensed under the MIT and GPL Version 3 licenses.
 *
 *  jslint laxbreak: true, newcap: true
 *
 **/

/**
 * == QMock ==
 *  Static methods, config options and Classes available on QMock namespace.
 **/
;(function ( container, undefined ) {

  // Trap original methods - protected scope
  var slice          = Array.prototype.slice,
      toString       = Object.prototype.toString,
      hasOwnProperty = Object.prototype.hasOwnProperty;

  /** section: QMock
   * QMock.create() -> QMock instance
   *
   *  Factory method for instantiating a new QMock instance with separate
   *  state and copies of private/public members
   *
   *  This is potentially useful for running two versions side-by-side with
   *  custom comparison methods, or modifiying any of the public members.
   *
   *  #### Example
   *
   *  <pre><code>QMock.create(); // Object (API)</code></pre>
   **/
  function createQMock () {

    /**
     * QMock.config
     *  Configuration settings for QMock - can be modified during runtime.
     **/
    var config = {

      /**
       * QMock.config.failslow -> true | Boolean
       *
       *  Allows a developer to specify whether errors built up during a
       *  verify phase should be thrown or suppressed (by default set to
       *  <code>true</code>).
       *
       *  If in 'fail fast' mode (e.g. <code>QMock.config.failslow = false;</code>)
       *  then exceptions are thrown as part of the verify phase, and it is
       *  up to the invoking test runner code to catch and handle them for
       *  assertion.
       *
       *  This can result in scenarios where expected 'good' exercise phase
       *  fails, an exception is thrown, and the testrunner stops due an
       *  unhandled exception.
       *
       *  An alternative (and the default setting) is a 'fail slow' appraoch.
       *  Here, the <code>Mock._getExceptions()</code> method can be called
       *  to see which exceptions were thrown, and inspect their properties.
       *
       *  #### Example
       *
       *  <pre><code>QMock.failslow = true;</code></pre>
       **/
      failslow: true,

      /**
       * QMock.config.compare -> null | Function
       *
       *  Reference to comparison routine used internally by QMock, and by
       *  <code>QMock.comparePresentation</code>.
       *
       *  Default value is <code>false</code>, and if function not set than an
       *  <code>Error</code> is thrown. This method should override the default
       *  <code>Boolean</code> value, and be set before any tests are run, or
       *  mock instantiated.
       *
       *  #### Example
       *
       *  <pre><code>QMock.config.compare = QUnit.equiv;</code></pre>
       **/
      compare: null,

      /**
       * QMock.config.delay -> 100 | Number
       *
       *  Configuration for the delay on Ajax callbacks. This is used to help
       *  simulate asynchronous transactions and the latency of a round-trip
       *  to a server. In turn this encourages developers to developers to
       *  ensure callbacks enact upon the right data or view when executed.
       **/
      delay: 100
    };

    /**
     * QMock.utils.is( nativeType, obj ) -> Boolean
     *  - obj (Object): Object to test
     *  - nativeType (String): Native type to test object against
     *
     *  Borrowed from jQuery but main credit to Mark Miller for his
     *  'Miller Device'
     *
     *  Supported 'Types': <code>String, Number, Boolean, RegExp, Date,
     *  Function, Array, Object</code>
     *
     *  #### Example
     *
     *  <pre><code>QMock.Utils.is( "foo", "String"); // true </code></pre>
     **/
    function is ( obj, nativeType ) {
      return toString.call( obj ) === "[object " + nativeType + "]";
    }

    /**
     * QMock.utils.enumerate( obj, fn[, scope][, bool] ) -> Object
     *  - obj (Object): Object whose properties to enumerate
     *  - fn (Function): Callback function applied to current property. Passed
     *  three parameters, the current property value, the property
     *  identifier (the key) it's associated by on receiver, and the object
     *  (receiver) it is bound to.
     *  - scope (Object) _optional_: Object to set as execution context on
     *  callback invocation (i.e. <code>this</code> binding). Defaults to the
     *  <code>obj</code> parameter value.
     *  - bool (Boolean) _optional_: Optional flag to determine enumeration
     *  upon inherited (via [[prototype]]) properties. Default is
     *  <code>false</code>.
     *
     *  This is a helper function inspired by the functional programming
     *  syntactic sugar methods on Array.prototype. It's purpose to provide a
     *  simple mechanism for enumerating over an object interface, and
     *  enacting upon it's properties.
     *
     *  It also aims to fix the broken enumeration in browsers (IE6-8) which
     *  fails to enumerate any keys which shadow natively inherited properties
     *  (even where ES3/5 spec states they should indeed be enumerable).
     *
     *  Currently it's really to ensure <code>toString</code> and
     *  <code>valueOf</code> properties are accessible for enactment
     *  (e.g. copying/invoking/overriding).
     *
     *  The esteemed Garrett Smith has the bullet on DHTMLKitchen.
     *
     *  TODO: Get dhtmlkitchen link
     *
     *  #### Example
     *
     *  <pre><code>// Enumrate over object
     *  QMock.utils.enumerate({
     *      "toString": "stringify"
     *    },
     *    function ( prop, key, obj ) {
     *      console.log( prop === obj[ key ] ); // true
     *    },
     *    this, // Execution context of callback
     *    true // Enumerate prototypically inherited properties
     *  );
     *  </code></pre>
     **/
    function enumerate ( obj, fn, scope, bool ) {
      for ( var key in obj ) {
        if ( ( bool || hasOwnProperty.call( obj, key) )
          && obj.propertyIsEnumerable( key ) || key === "toString"
          || key === "valueOf" ) {
            fn.call( scope || obj, obj[ key ], key, obj );
          }
      }
    }

    /**
     * QMock.utils.iterate( obj, fn[, scope] ) -> Array || Collection
     *  - obj (Collection): Collection to iterate through, can be any object
     *  with a <code>length</code> property.
     *  - fn (Function): Callback function applied to current item. Passed
     *  three parameters, the current item value, the current index
     *  (identifier) the item corresponds to, and the collection itself.
     *
     *  This basically emulates <code>Array.prototype.forEach</code> but
     *  ensures the order of items is maintained when iterating through a
     *  collection.
     *
     *  Functional programming FTW! 8-)
     *
     *  #### Example
     *
     *  <pre><code>// Iterate through a collection
     *  QMock.utils.iterate([
     *      "foo", "bar", "baz"
     *    ],
     *    function ( item, index, collection ) {
     *      console.log( item === collection[ index ] ); // true
     *    },
     *    this // scope
     *  );
     *  </code></pre>
     **/
    function iterate ( obj, fn, scope ) {
      for ( var i = 0, len = obj.length; i < len; i++ ) {
        fn.call( scope || obj, obj[ i ], i, obj );
      }
    }

    /**
     * QMock.utils.test( presentation, method[, prop] ) -> Boolean | Object | undefined
     *  - method (Mock): Mock object to which the presentation
     *  is / would be passed
     *  - presentation (Array): Array representing a method/constructor
     *  interface 'presentation' to test (arguments collection or parameter
     *  list)
     *  - key (String) _optional_: Optional key used to lookup associated
     *  data held on an expectation object
     *
     *  Utility method for testing a known parameter list against a mock's
     *  expected parameters.
     *
     *  Can also be used to retrieve associated metadata from an Expectation
     *  instance.
     *
     *  #### Returns
     *
     *  * If optional property name is passed then will use that as key
     *  on any matching expectation objects and return the correlating value.
     *  e.g. Internally QMock uses the method to return canned stubbed
     *  responses during an exercise phase. The method can be used as
     *  standalone to test the Stub interface.
     *
     *  * If no property parameter passed then a Boolean value is returned
     *  depending on match success.
     *
     *  #### Example
     *
     *  <pre><code>var mock = new Mock;
     *  mock.accepts("bar");
     *
     *  // Test - Boolean
     *  QMock.utils.test(mock, ["foo"]) // true;
     *  QMock.utils.test(mock, ["bar"]) // false;
     *
     *  // Augment
     *  mock.receives({accepts:"baz", returns:"fuz"});
     *
     *  // Test
     *  QMock.utils.test(mock, ["foo"], "returns") // undefined;
     *  QMock.utils.test(mock, ["baz"], "returns") // "fuz";
     *
     *  </code></pre>
     **/
    function comparePresentation ( mock, presentation, key ) {
      checkCompare();
      var result  = false,
          mapping = {"returns": "returnValue","data": "dataRep"},
          stop    = false;
      // Compare presention vs expectations
      iterate( mock.expected, function( item ) {
        if ( !stop && config.compare( presentation, item.accepts ) ) {
          result = key ? item[ key ] || mock[ mapping[ key ] ] : true;
          stop = true;
        }
      });
      return result;
    }

    /* [Private]
     *
     * trimCollection( a, b ) -> Array
     *  - a (Collection): Collection to normalise
     *  - b (Collection): Target collection to normalise against
     *
     *  Utility function to normalise the length of two collections.
     **/
    function trimCollection ( a, b ) {
      return slice.call( a, 0, b.length );
    }

    /* [Private]
     *
     * checkCompare() -> Boolean | Error
     *
     *  Utility function to assert whether a comparison routine has been set on
     *  QMock namespace.
     **/
    function checkCompare () {
      if ( !config.compare ) {
        throw new Error('Comparison routine must be set on QMock.compare with signature fn( a, b )');
      }
      return true;
    }

    /* [Private]
     *
     * toArray( obj ) -> Array
     *  - obj (Object): Object to nest in array
     *
     *  Function that determines whether an input (aka expectated prameters, or
     *  associated properties like 'data') need to be normalised into an
     *  array structure for the purpose of functional programming / iteration.
     *
     *  Necessary as QMock supports the setting of expected parameters (via
     *  accepts property), or callback arguments (via 'data') without having
     *  to be serialised as arrays where there is only one parameter.
     *
     *  e.g.
     *  <pre><code>normaliseToArray( 'foo' ); // ['foo']</code></pre>
     **/
    function toArray ( obj ) {
      return !is( obj, "Array" ) ? [ obj ] : obj;
    }

    /* [Private]
     *
     * mixin( target, obj[, re ] ) -> undefined
     *  - target (Object): Receiver object to be extended
     *  - obj (Object): Giver object interface to merge into target
     *  - re (RegExp) _optional_: RegExp to run against interface keys to cache
     *  and execute old method if overwriting.
     *
     *  Function to merge the properties / interface of a target object
     *  with another object. Used for rudimentary inheritance as deep
     *  class hierarchies are not cool. Also used to merge optional config
     *  objects with defaults (a la jQuery).
     *
     *  If optional <code>re</code> parameter passed then runs match on object
     *  keys and partially applies function in a new closure, running it before
     *  the new bound function. This is mainly used when overriding an existing
     *  function through augmented prototypal inheritance. Note the parent
     *  closure delegates both it's execution context and received parameters
     *  to the cached method and override method. Sort of wholesale currying
     *  if you will (work with me here!). Mmm, bacon.
     *
     *  _Note: Using <code>typeof</code> to test property type (and not
     *  <code>QMock.utils.is()</code>) as a bit quicker, and method not
     *  being exposed publically. We (maybe foolishly), trust the input!_
     **/
     function mixin ( target, obj, re ) {
       enumerate( obj, function( prop, key ) {
         // Handle overriding
         target[ key ] = re && re.test( key ) && (typeof prop == "function")
          ? (function ( zuper, nue ) {
              return function () {
                zuper.apply(this, arguments);
                return nue.apply(this, arguments);
              }
            })( target[ key ], prop ) // mitigate pesky multiples
          : prop
       });
     }

    /* [Private]
     *
     * bind( fn, scope ) -> Function
     *  - fn (Function): Function to be bound
     *  - scope (Object): Object to bind function to (execution scope)
     *
     *  Utility function to bind a function to a specific execution context.
     *  This only partially implements Function.prototype.bind (as seen in
     *  prototype js and ES5), as haven't required currying arguments yet.
     **/
    function bind ( fn, scope ) {
      return function () {
        return fn.apply( scope, arguments );
      };
    }

    /* [Private]
     *
     *  bindInterface( obj, receiver, scope )
     *  - target (Object): Object to copy interface to
     *  - obj (Object): Interface to copy and bind (e.g. Mock.prototype)
     *  - scope (Object): The execution context to bind methods to
     *
     *  Utility function to copy a given object's interface over with bound
     *  function calls to the receiver instance scope (e.g. bind
     *  <code>this</code>).
     **/
    function bindInterface ( target, obj, scope ) {
      enumerate(obj, function( prop, key ) {
        if ( typeof prop == "function" ) {
          target[ key ] = bind( prop, scope );
        }
      });
    }

    /* [Private]
     * TODO: Define this!
     *  get#methodName(parameters)
     **/
    function getState ( obj ) {
      if ( obj instanceof Expectation ) { return obj; }
      if ( is( obj, "Function") ) {
        if ( obj.__getState ) {
          return obj.__getState();
        }
        // TODO: Add central repository of *all* mocks to search for cached __getState method
      }
      return false;
    }

    // KLASS DEFINITIONS

    /**
     * == Receiver ==
     *
     *  Receiver mock objects are simply pseudo-namespaces for mocked methods 
     *  and stubbed properties. 
     *  
     *  QMock allows receivers to be either plain old object literals, or 
     *  functions (aka smart mocks) depending on the requirement to accurately 
     *  replicate a given real-world collaborator object interface (with 
     *  associated behaviours).
     **/

    /** section: Receiver
     * class Receiver
     *  
     *  Receiver is the central superclass in QMock for the simple reason that 
     *  Mock objects (aka functions), can also be receiver mock objects. Hence 
     *  the Mock klass (and insatnces) implements the Receiver klass interface.
     *  
     *  So if one were to define a Constructor akin to jQuery's <code>$</code>, 
     *  they can also still attach member methods and properties to that.
     *  
     *  The public interface for both klasses act identically no matter which 
     *  type the mock is.
     **/
    function Receiver () {
      if( !(this instanceof Receiver ) ) {
        return new Receiver;
      }
      this.methods    = [];
      this.properties = {};
      this.namespaces = [];
      // Conventionally overridden in factory to reference public proxy interface
      this.self       = this;
    }

    Receiver.prototype = {

      // Used to support expects() - Receiver instance method till 0.5 is tagged.
      tmp: {},

     /**
      * Receiver#method( name ) -> new Mock
      *  - name (String): Name of the method
      *
      *  When <code>method()</code> is called on a receiver object it is
      *  augmented with a new method bound to the identifier <code>name</code>.
      *
      *  Throws <code>InvalidMethodNameException</code> if member with key
      *  <code>name</code> already exists on receiver.
      *
      *  #### Example
      *
      *  <pre><code>Mock.method('foo');</code></pre>
      **/
      method: function ( prop, min, max ) {
        if ( hasOwnProperty.call( this.self, prop ) ) {
          throw {
            type: "InvalidMethodNameException",
            msg: "Qmock expects a unique identifier for each mocked method"
          };
        }

        // Register public pointer to mocked method instance on receiver object
        this.self[ prop ] = Mock.create(
          new Mock(
            min || this.tmp.min || this.min,
            max || this.tmp.max || this.max,
            this.self
          )
        );

        // Track methods
        this.methods.push( this.self[ prop ] );

        // Wham!
        return this.self[ prop ].id( prop );
      },

     /**
      * Receiver#property( prop, val ) -> Receiver | Mock
      *  - prop (String): Name of the property to attach to receiver object
      *  - val (Object): Value to set on <code>prop</code>.
      *
      *  When <code>method()</code> is called on a receiver object it is
      *  augmented with a new property bound to the identifier
      *  <code>prop</code> with the value <code>val</code>.
      *
      *  Throws <code>InvalidPropertyNameException</code> if member with key
      *  <code>name</code> already exists on receiver.
      *
      *  #### Example
      *
      *  <pre><code>Mock.property('foo', 'bar');
      *  console.log( Mock.foo ); // "bar"</code></pre>
      **/
      property: function ( prop, value ) {
        if ( hasOwnProperty.call( this.self, prop ) ) {
          throw {
            type: "InvalidPropertyNameException",
            msg: "Qmock expects a unique key for each stubbed property"
          };
        }

        // New property on receiver + track properties
        this.self[ prop ] = this.properties[ prop ] = value;

        // Bam!
        return this.self;
      },

     /**
      * Receiver#namespace( id [, definition ] ) -> new Receiver
      *  - id (String): Identifer or key for the nested namespace receiver
      *  instance on the Mock. Instance implements all Receiver klass
      *  methods.
      *  - definition (Map) _optional_: TODO
      *
      *  #### Example
      *
      *  <pre><code>var mock = new Mock;
      *  // Create a nested namespace with a method called 'bar' on it.
      *  Mock.namespace("foo")
      *    .method("bar");
      *  </code></pre>
      **/
      namespace: function ( prop, desc ) {
        if ( hasOwnProperty.call( this.self, prop ) ) {
          throw {
            type: "InvalidNamespaceIdentiferException",
            msg: "Qmock expects a unique key for a namespace identifer"
          };
        }

        // New property on receiver + track namespaces
        this.self[ prop ] = Receiver.create( desc, false );

        // Track namespace
        this.namespaces.push( this.self[ prop ] );

        // Return correct receiver scope for augmentation
        // Pow!
        return this.self[ prop ];
      },

      /** deprecated
       * Mock#expects( [min = null] [, max = null] ) -> Mock
       * - min (Number): Miniumum number of times mock object should be
       *  invoked. If max parameter not passed then number becomes a 'strict'
       *  invocation expectation (even zero). Default is <code>null</code>.
       * - max (Number) _optional_: Maximum number of times mocked method
       *  should be called. If want 'at least _n_' then just pass
       *  <code>Infinity</code>. Default is <code>null</code>
       *
       *  *DEPRECATED*: Was a factory method for creating new mock objects
       *  (methods / properties) on a receiver object, but mock receiver
       *  object.
       *
       *  Till version 0.5 will be backward compatible, but developers should
       *  use <code>Mock.method( name, min, max )</code>, or
       *  <code>Mock.calls()</code> instead.
       **/
      expects: function ( min, max ) {
        this.tmp.min = min;
        this.tmp.max = max;
        return this.self;
      },

      /**
       * Receiver#verify( [raise] ) -> Boolean
       *
       *  Method recurses through all the child mock object members of a
       *  receiver mock object, verifying their interactions. It delegates
       *  the actual instance verification routine to Mock#verify. It will
       *  returns a Boolean, wher an overall result is determined by whether
       *  the receiver, or any 'leaves' had a negative result.
       *
       *  It will also throw an error if _optional_ <code>raise</code>
       *  parameter is passed. This is thrown if <code>QMock.config.failfast</code>
       *  is set to <code>true</code>. It can also be retrieve by calling
       *  <code>Mock.__getExceptions()</code>.
       *
       *  See <code>Mock#verify</code> for mock object verification
       *  details.
       **/
      verify: function () {
        // Verify 'leaf' member mock objects
        var result  = true,
            members = this.methods.concat( this.namespaces ),
            i       = 0,
            len     = members.length,
            tmp     = config.failslow;

        // Suppress errors thrown at higher level
        // Allows all errors to be collated and thrown as a set
        config.failslow = true;

        iterate( members, function ( item ) {
          result &= item.verify();
        });

        // Restore failslow setting
        config.failslow = tmp;

        // Gather all exceptions
        var exceptions = this.__getExceptions();

        // Live() || Die()
        if ( !config.failslow && exceptions.length ) {
          // Pants.
          throw exceptions;
        } else {
        // WIN. \o/
          return (!!result) && (exceptions.length === 0);
        }
      },

      /**
       * Receiver#reset() -> Boolean
       *
       *  Resets the Receiver instance internal state machine, and mock
       *  instances that comprise it's interface. Also resets any properties
       *  (set by <code>Mock.property()</code>) to their original value (in
       *  case of mutation) during the exercise phase.
       *
       *  See Mock#property for details on resetting mock function objects.
       **/
      reset: function () {
        // Reset all child mocks
        var members = this.methods.concat( this.namespaces );

        iterate( members, function ( item ) {
          item.reset();
        });

        // Reset Properties (could have been mutated)
        enumerate(this.properties, function ( prop, key ) {
          this.self[ key ] = prop;
        }, this);
      },

     /**
      * Receiver#excise() -> Boolean | Error
      *
      *  Utility method to 'excise' a Mock object interface from itself, to
      *  reduce the chance of errors generated by interactions and
      *  manipulations of the Mock object on behalf collaborator objects
      *  due to existence of the Mock object API.
      *
      *  For example if a controller were to blindly iterate over the keys
      *  of a Mock instance, even with a <code>hasOwnProperty</code> check,
      *  both the mocked interface methods/properties, and the Mock instance
      *  API will be accessible and/or operated upon.
      *
      *  Most often this will not cause issues, but if a true representation
      *  of a collaborator object is required sans extraneous members, then
      *  this method will prune the Mock object interface from the instance.
      *
      *  If the instance needs further augmentation, or simply verification
      *  and resetting, developers can either use
      *  <code>QMock.utils.verify</code>, <code>QMock.utils.reset</code>
      *  static methods, or any method on <code>Mock.prototype</code> while
      *  using <code>.call()</code> to set the execution context to the mock
      *  instance.
      *
      *  #### Example
      *
      *  <pre><code>var mock = new Mock;
      *
      *  // Setup
      *  mock.calls(1);
      *
      *  mock.excise();
      *
      *  // Augmention 'post-excision'
      *  QMock.Mock.prototype.calls(mock, 2)
      *
      *  // Check expectation updated
      *  mock._getState()._minCalls === 2 // true;
      *  </code></pre>
      **/
      excise: function () {
        // 'excise' receiver
        enumerate( Receiver.prototype, function ( prop, key ) {
          delete this.self[ key ];
        }, this);

        // 'excise' children
        var members = this.methods.concat( this.namespaces );

        iterate( members, function ( item ) {
          item.excise();
        });
      },

      // Privileged references for debugging

      /**
       * Receiver#__getExceptions() -> Array
       *
       *  Returns an array of exception objects, used for debugging when
       *  <code>Mock.verify()</code> returns <code>false</code> in 'fail slow'
       *  test runner setups (see Config section).
       **/
      __getExceptions: function () {
        var exceptions = this.self.__getState && this.self.__getState().exceptions || [];
        iterate( this.methods, function ( item ) {
          exceptions = exceptions.concat( item.__getExceptions() );
        });
        return exceptions;
      },

      /**
       * Receiver#__getState() -> Object (Mock instance state machine)
       *
       *  Utility method for retrieving the internal state of a mock object
       *  for debugging and inspection
       **/
      __getState: function () {
        return this;
      }
    };

    // Backward compatibility with QMock API v0.1
    Receiver.prototype.andExpects = Receiver.prototype.expects;

    // Receiver Factory Method
    Receiver.create = function ( desc, bool ) {

      var receiver = new Receiver,

      // Create mock + recorder if definition supplied else plain old object
      proxy = receiver.self = bool ? Mock.create() : {};

      // Bind private state to public interface
      if ( typeof proxy == "object" ) {
        bindInterface( proxy, Receiver.prototype, receiver );
      }

      // Update default return state on Constuctors to themselves (for
      // cascade-invocation-style declarations). If the return value is
      // overidden post-instantiation then it is assumed the mock is a
      // standalone function constuctor and not acting as a receiver object
      // (aka namespace / class)
      if ( bool ) {
        proxy.chain();
      }

      // Auto-magikally create mocked interface from mock descriptor
      return desc ? bootstrap( proxy, desc ) : proxy;
    };

    /**
     * == Mock ==
     *  #### TODO
     *
     *  # Implement excise method to decouple collaborator interface from mock interface
     *  # Public method unit tests (aka verify/reset), with excised mock
     *  # Refactor Expectations and Presentation Constructors, and expose.
     *  # Change behaviour of Mock.property, Mock.method & Mock.namespace to nest instead
     *    of return to parent for association...
     *  # Best practice to look for parent id's if set for errors
     *  # Pull out setUp Mock stuff from createMock factory.
     *  # createMock's duty to setup inheritance model & actual object
     *
     **/

    /** section: Mock
     * class Mock < Receiver
     *  includes mixin
     *
     *  // TODO
     *  Chips
     **/

    /* [Private]
     * new Expectation( map )
     *  - map (Hash): Data properties for Expectation object, can be custom
     *  if required.
     **/
    function Expectation ( map ) {
      var config = {
        accepts   : null,
        requires  : 0,
        returns   : undefined,
        chained   : false,
        data      : null,
        async     : true
      };
      // augment base expectations
      enumerate( config, function ( prop, key ) {
        map[ key ] = prop;
      });
      return map;
    }

    /**
     * new Mock( definition [, bool] )
     *  - desc (Hash): Hash of Mock expectations mapped to Mock object
     *  API.
     *  - bool (Boolean): Designated whether receiver object itself is a
     *  stub function (a la jQuery constructor). Default for QMock is true.
     *
     *  Constructor for mock receiver, methods and properties. The return
     *  object is a function that can act as a namespace object (aka a
     *  'receiver'), or as a mocked function / constructor with expectations,
     *  or both (e.g. jQuery $).
     *
     *  Can be called with or without the <code>new</code> keyword
     *
     *  #### Example
     *
     *  <pre><code>// Via API
     *  var ninja = new Mock();
     *
     *  ninja.method('foo').returns('bar');
     *
     *  // Via definition map
     *  ninja = new Mock({
     *    // method
     *    "foo": {
     *      "id"        : "Descriptor / Identifier"
     *      "accepts"   : "bar",
     *      "receives"  : {"accepts": "foo", data: "stub", returns: "bar"}
     *      "returns"   : "baz",
     *      "required"  : 1,
     *      "namespace" : "faz"
     *      "overload"  : true,
     *      "data"      : "response",
     *      "async"     : true,
     *      "chain"     : true // arg not used, readability only
     *      "calls"     : 1
     *    },
     *    // property
     *    "bar": {
     *      "value": "stub"
     *    }
     *    // namespace
     *    "buz": {
     *      // method
     *      "stub": {
     *        "accepts": 1
     *      }
     *      // property
     *      "key": {
     *        "value": false
     *      },
     *      // nested namespace
     *      "ns": {}
     *    }
     *  })
     *  </code></pre>
     **/
    function Mock ( min, max, receiver ) {
      // Constructor protection, Mock should be only used as constructor
      if ( !(this instanceof Mock) ) {
        return new Mock( min, max, receiver );
      }
      // Default mock expectations + behaviour
      this.expected     = [];
      this.requires     = 0;
      this.returnVal    = undefined;
      this.chained      = false;
      this.dataRep      = null;
      // Mock interface constraints
      this.overloadable = true;
      // Default mock state
      this.name         = "anonymous";
      this.received     = [];
      this.minCalls     = min || null;
      this.maxCalls     = max || null;
      this.called       = 0;
      this.exceptions   = [];
      // Instance references
      this.receiver     = receiver;
      this.self         = this;
      // Implements Receiver
      this.methods      = [];
      this.properties   = {};
      this.namespaces   = [];
    }

    Mock.prototype = {

      /**
       * Mock#id( identifier ) -> Mock
       *  - identifier (String): ID of the mock object
       *
       *  Identifier is used to create more meaningful error messages. By
       *  default it is _"anonymous"_, or the method name (assigned by
       *  <code>Mock.method()</code>).
       *
       *  #### Example
       *
       *  <pre><code>// Without setting the id
       *  var $ = new Mock;
       *  $.method('foo'); // just says function 'foo' in error message
       *  // With id
       *  $.foo.id('$.foo'); // Will now output '$.foo' in error message</code></pre>
       **/
      id: function ( identifier ) {
        this.name = identifier;
        return this.self;
      },

      /**
       * Mock#accepts( parameters ) -> Mock
       *  - parameters (Object...n): Parameter list which mocked method is expecting.
       *
       *  Method is used to set a single expected parameter list of _n_ length
       *  for a mock object. During verification this is tested against the
       *  actual <code>presentation</code> made to a mock object interface.
       *
       *  When called multiple times on a mock object the last expectation
       *  takes precedent in relation to the number of required arguments. If
       *  multiple expectations are required see the
       *  <code>Mock.receives</code> method.
       *
       *  #### Example
       *
       *  <pre><code>Mock.method("foo").accepts("bar", "baz");</code></pre>
       **/
      accepts: function () {
        this.requires = arguments.length;
        this.expected.push( { "accepts" : slice.call( arguments ) } );
        return this.self;
      },

      /**
       * Mock#receives( expectations ) -> Mock
       *  - expectations (Expectation...n): Expectation object format is:
       *  <pre><code>{accepts: [ parameters ], returns: value, data: [ values ]}</code></pre>
       *
       *  Where the <code>returns</code> & <code>data</code> properties are
       *  _optional_. For more info on these properties see
       *  <code>Mock.returns</code> and <code>Mock.data</code> resepctively.
       *
       *  Method can be overloaded with as many expectations as required.
       *  During verification each actual <code>presentation</code> made to a
       *  mock object interface is tested against all expectations for a match.
       *
       *  #### Example
       *
       *  <pre><code>Mock.method("foo").receives({
       *    "accepts": ["bar", callback],
       *    "returns": "baz",
       *    "data": "stub"
       *  });</code></pre>
       **/
      receives: function () {
        // Check for valid input to parameterList
        // TODO: Needs to be refactored to factory for creating Expectations
        iterate( arguments, function ( item ) {
          if ( !item.accepts ) {
            throw {
              type: "MissingAcceptsPropertyException",
              msg: "Qmock expects arguments to expectations() to contain an accepts property"
            }
          }
          item.accepts = toArray( item.accepts );
        });

        // Set minimum expectations
        this.requires = arguments[ 0 ].accepts.length;

       // TODO: Support for different requires per expected presentation
       // Assign explicit expectation if exist
       /* for ( var i = 0, len = arguments.length; i < len; i++ ) {
          if ( !arguments[ i ][ "required" ] ) {
            arguments[ i ][ "required" ] = arguments[ i ][ "accepts" ].length;
          }
        }*/
        this.expected = this.expected.concat( slice.call( arguments ) );
        return this.self;
      },

      /**
       * Mock#returns( obj ) -> Mock
       *  - obj (Object): Object mock object to return
       *
       *  _Note_: This return value simply overrides the default of
       *  <code>undefined</code>. It does not correlate with any particular
       *  parameter expectations. See <code>Mock.interface</code> to bind
       *  return values to an expected parameter list (a
       *  <code>presentation</code>).
       *
       *  By default mock objects return <code>undefined</code> as per ECMA
       *  specification.
       *
       *  #### Example
       *
       *  <pre><code>Mock.method("foo").accepts('bar').returns('baz');</code></pre>
       **/
      returns: function ( obj ) {
        this.returnVal = obj;
        return this.self;
      },

      /**
       * Mock#required( num ) -> Mock
       *  - num (Number): Number of required parameters
       *
       *  A mock object interface can accept parameters, which can be either
       *  required or optional. By default the number of required parameters
       *  is set by <code>Mock.accepts</code> to the length of the expected
       *  parameter list, but <code>Mock.required</code> can be used to override
       *  this in the case where some parameters are optional.
       *
       *  It is used in conjunction with <code>Mock.overload()</code> to set
       *  parameter expectations on a mock object interface.
       *
       *  #### Example
       *
       *  <pre><code>// All parameters optional, overloading is set to true (by default)
       *  Mock.method('foo').accepts('bar', 'baz').required(0);</code></pre>
       *
       *  Verification of presentations to interface will allow 0, 1, or 2
       *  parameters to be passed (though will still test type/value)
       *
       *  _Note_: In the above example, if method overloading has been set to
       *  false then the verify phase would *only* allow presentations of ZERO
       *  parameters to the mock object interface.
       **/
      required: function ( num ) {
        this.requires = num;
        return this.self;
      },

      /**
       * Mock#overload( bool ) -> Mock
       *  - bool (Boolean): Boolean flag to allow method overloading
       *
       *  This flag determines whether the required number of parameters is a
       *  strict expectation or not.
       *
       *    * If overloading is set to <code>true</code> (default setting) then
       *  the verify phase will pass presentations to the mock object interface
       *  with _at least_ the required number of parameters.
       *    * If overloading is set to <code>false</code> then the verify phase
       *  will only pass presentations to the mock object interface of _exactly_
       *  the required number of parameters.
       *
       *  #### Example
       *
       *  <pre><code>Mock.method('foo').accepts('bar', 'baz').overload(false);</code></pre>
       **/
      overload: function ( bool ) {
        this.overloadable = !!bool;
        return this.self;
      },

      /**
       * Mock#data() -> Mock
       *  - data (Array| Object): Array of values, or single Object, which is
       *  passed as arguments to a callback function set on a mock object
       *  parameter list expectation
       *
       *  Method allows developer to declare stubbed data (e.g. a web service
       *  response or DOM elements) to pass to callback functions defined
       *  passed to the mock object interface in an exercise phase.
       *
       *  This is most commonly done to test asynchronous operations or event
       *  callbacks. See the QMock wiki for more use cases and patterns.
       *
       *  #### Example
       *
       *  <pre><code>// Invoked by the mock object during exercise phase
       *  // Stubbed data being passed in at time of invocation
       *  function callback ( str ) { console.log( str ); }
       *
       *  // Single params
       *  Mock.method('foo').accepts(callback).data('stub');
       *
       *  // Multiple params
       *  Mock.method('foo').accepts(callback).data(['stub', 'another stub']);
       *  </code></pre>
       **/
      data: function () {
        this.dataRep = slice.call( arguments );
        return this.self;
      },

      /**
       * Mock#async( bool ) -> Mock
       *  - bool (Boolean): Boolean flag indicating whether callbacks are
       *  executed asynchronously (even with a delay of 0ms - queued on thread)
       *  or synchronously (blocking operation).
       *
       *  Functions can be passed for a variety of reasons, most commonly as
       *  callbacks for Ajax transactions, but also as references in closures
       *  (binding/currying), or as mutators that enact on data structures
       *  ( e.g. arrays and <code>Array.filter()</code>).
       *
       *  Additionally Ajax calls can also be made synchronously (though rarely
       *  done), thus a mock collaborator object should be configurable as to
       *  replicate the behaviour of a real callaborator as closely as possible
       **/
      async: function ( bool ) {
        this.async = !!bool;
        return this.self;
      },

      /**
       * Mock#chain() -> Mock
       *
       *  Tells the mocked method to return the receiver object it is bound
       *  to enable cascading (chained) invocations during the exercise phase.
       *
       *  #### Example
       *
       *  <pre><code>var $ = new Mock;
       *  $.method('foo')
       *    .chain()
       *    .end()
       *  .method('bar');
       *
       *  // Exercise
       *  $.foo().bar();
       *  </code></pre>
       *
       *  _Note_: Can be overwritten if <code>Mock.returns</code> is used
       *  after in Mock declaration (or better, in conjunction to override
       *  it with <code>Mock.interface</code> for specific use cases)
       **/
      chain: function () {
        this.returnVal = this.receiver || this.self;
        return this.self;
      },

      /** alias of: Receiver#verify
       * Mock#verify( [raise] ) -> Boolean
       *
       *  Tests actual mock interaction with expected interaction on mock
       *  object and any associated mock objects. Happens in the following
       *  order:
       *
       *    * Verify number of invocations
       *    * Verify number of parameters passed to interface
       *    * Verify all sets of parameters passed to interface
       *
       *  Method will bail as any point the verification is false (fail fast),
       *  and return <code>false</code>.
       *
       *  It will also throw an error if _optional_ <code>raise</code>
       *  parameter is passed.
       *
       *  See <code>Receiver#verify</code> for receiver object verification
       *  details.
       **/
      verify: function ( raise ) {
        raise = raise || new ErrorHandler( this.exceptions );
        // If true and no calls then exclude from further interrogation
        if ( verifyInvocations( this ) ) {
          if ( this.called === 0 ) {
            return true;
          }
        } else {
          raise && raise(
            this.called,
            this.minCalls,
            "IncorrectNumberOfMethodCallsException",
            this.name
          );
          return false;
        }

        // TBD: This doesn't seem to support multiple presentations to an interface?
        // Checks 'global' _received to see if any paramters actually required, if so,
        // verify against overloading behaviour
        if ( this.requires && verifyOverloading( this ) ) {
          raise && raise(
              this.received[ 0 ].length,
              this.expected.length,
              "IncorrectNumberOfArgumentsException",
              this.name
            );
          return false;
        }

        // 3. Assert all presentations to interface
        return verifyInterface( this, raise );
      },

      /**
       * Mock#calls( min [, max = null] ) -> Mock
       *  - min (Number): Minimum number of times mock object should be
       *  invoked. If max parameter not passed then number becomes a 'strict'
       *  invocation expectation (even zero). Default is <code>null</code>.
       *  - max (Number) _optional_: Maximum number of times mocked method
       *  should be called. If want 'at least _N_' then just pass Infinity.
       *  Default is <code>null</code>
       *
       *  This method mainly used to set invocation expectations on
       *  constructors / receiver objects, as conventional usage for mock
       *  methods is to pass parameters to <code>Mock.method()</code>.
       *
       *  However, <code>Mock.calls</code> can be called on an instance of
       *  <code>Mock</code>.
       *
       *  #### Example
       *
       *  <pre><code>// Set expected calls on mock constructor / receiver
       *  Mock.calls(1,5);
       *
       *  // Set calls on mockmethod
       *  Mock.method('foo').calls(1,5);
       *  </code></pre>
       **/
      calls: function ( min, max ) {
        this.minCalls = min;
        this.maxCalls = (max !== undefined) ? max : this.maxCalls;
        return this.self;
      },

      /**
       * Mock#end() -> Mock
       *
       *  Utility method to end a mock method expectation declaration, or
       *  retrieve the receiver object a mock object is bound to. In other
       *  words it sets the receiver object context for setting new methods,
       *  properties, or namespaces on mock interfaces. It should also be used
       *  as the last item in a mock declaration cascading invocation chain (or
       *  rather wherever the last method is set).
       *
       *  Why? Since functional mocks can also act as receivers / namespaces in
       *  their own right, it allows more fine-grained control over what object
       *  a mock is actually set upon, especially when objects have deep(ish)
       *  hierarchies.
       *
       *  The common use case when setting mocks via cascading invocation is
       *  to set new member mocks on the _same_ receiver, so
       *  <code>mock.end()</code> *must* be used after expectations for a mock
       *  at the same level have been set. This means subsequent mock
       *  declarations are set within the same receiver object context.
       *
       *  Without calling <code>Mock.end()</code> then subsequent mocks are
       *  set on the current mock, and are thus nested at a deeper level.
       *
       *  For this reason it might be less work to set your mocks up by passing
       *  the mock constructor a 'property mapping' (see main Mock docs), and
       *  let the constructor handle the work for you.
       *
       *  _Please note calling <code>Mock.end()</code> does not mean a mock
       *  object cannot be further augmented/manipulated (that would be
       *  <code>Mock.excise()</code>)_.
       *
       *  For the jQuery-conversant, the method acts in part like the
       *  <code>$("..").end()</code> method, which is used to restore the
       *  execution context to a given jQuery 'wrapped set' (thanks Cody!) (as
       *  well as it's original state), post-manipulation (via
       *  $.find()/$.filter()).
       *
       *  #### Example
       *
       *  <pre><code>// Declare nested methods...
       *  var mock = new Mock;
       *  mock.method('foo').method("bar");
       *
       *  // Looks like...
       *  mock = {
       *    foo: { // foo is also a function (functions are first-class citizens too!)
       *      bar: function () {}
       *    }
       *  }
       *
       *  // Declare methods on equal level
       *  // Note last call *required*!! Else mock set to 'bar' mock, not it's
       *  // receiver.
       *  mock.method('foo').end().method("bar").end();
       *
       *  // Looks like...
       *  mock = {
       *    foo: function () {},
       *    bar: function () {}
       *  }
       *  </code></pre>
       **/
      end: function () {
        return this.receiver;
      },

      /** alias of: Receiver#reset
       * Mock#reset() -> Mock
       *
       *  Resets the internal state machine of a mock instance.
       *
       *  See <code>Receiver#reset()</code> for details on resetting Receiver
       *  mock objects.
       **/
      reset: function () {
        this.exceptions = [];
        this.called = 0;
        this.received = [];
        return true;
      },

      /** alias of: Mock#expects, deprecated
       * Mock#andExpects( [min][, max] ) -> Mock
       **/
      andExpects: function ( min, max ) {
        return this.receiver.expects( min, max );
      },

      /** deprecated
       * Mock#atLeast( num ) -> Mock
       *  - num (Number): Number of times mock object should _at least_ be
       *  invoked.
       *
       *  Utility method (well, syntactic sugar) for setting up invocation
       *  expectations of 'at least _n_ invocations'.
       *
       *  Recommended to use <code>Mock.method()</code> or
       *  <code>Mock.calls()</code> instead.
       **/
      atLeast: function ( num ) {
        this.minCalls = num;
        this.maxCalls = Infinity;
        return this.self;
      },

      /** deprecated
       * Mock#noMoreThan( num ) -> Mock
       *  - num (Number):
       *
       *  Utility method (well, syntactic sugar) for setting up invocation
       *  expectations of 'no more than _n_ invocations'.
       *
       *  Recommended to use <code>Mock.method()</code> or
       *  <code>Mock.calls()</code> instead.
       **/
      noMoreThan: function ( num ) {
        this.maxCalls = num;
        return this.self;
      },

      /** alias of: Receiver#excise
       * Mock#excise() -> Object
       **/
      excise: function () {
        enumerate( Mock.prototype, function ( prop, key ) {
          delete this.self[ key ];
        }, this);
      }

      // Inherited methods from Receiver - docs

      /** alias of: Receiver#property
       * Mock#property( prop, value ) -> Receiver | Mock
       **/

      /** alias of: Receiver#namespace
       * Mock#namespace( id, map ) -> new Receiver
       **/

      /** alias of: Receiver#method
       * Mock#method( identifier, min, max) -> new Mock
       **/

      /** alias of: Receiver#__getState
       * Mock#__getState() -> Object (Mock instance State machine)
       **/

      /** alias of: Receiver#__getExceptions
       * Mock#__getExceptions() -> Array (of exception objects)
       **/

    }; // end Mock.prototype declaration

    // Mixin Receiver and Mock klasses
    mixin( Mock.prototype, Receiver.prototype, /verify|reset/ );

    // Backward compatibility for QMock v0.1/0.2 API
    Mock.prototype.interface        = Mock.prototype.receives;
    Mock.prototype.withArguments    = Mock.prototype.accepts;
    Mock.prototype.andReturns       = Mock.prototype.returns;
    Mock.prototype.andChain         = Mock.prototype.chain;
    Mock.prototype.callFunctionWith = Mock.prototype.data;
    Mock.prototype.expectsArguments = Mock.prototype.accepts;
    Mock.prototype.expects          = Mock.prototype.andExpects;

    // SETUP PHASE Functions
    // Mainly factory methods that handle instantiation and bindings

    /* [Private]
     * Mock.create( mock ) -> Function
     *  state (Mock) _optional_: Mock instance to bind recorder to.
     *
     *  Factory method to create a stub function to be attached to a receiver
     *  object, bound to a passed mock instance. Upon invocation within an SUT
     *  the mock state will be mutated, callbacks (sync/async) will be applied
     *  and any corresponding set return values will be retrieved and output.
     **/
    Mock.create = function ( mock ) {
      // instantiate statemachine if not passed
      if ( !mock || !mock instanceof Mock ) { mock = new Mock; }

      // Mutator for mock instance statemachine
      // Exercises callbacks for async transactions
      // Returns itself, explicit value, or undefined
      function recorder () {
        return exerciseMock( mock, slice.call( arguments ) );
      };

      // Public API - Bind inherited methods to private statemachine
      bindInterface( recorder, Mock.prototype, mock );

      // Reference to bound mutator on instance itself (in case of detachment)
      return mock.self = recorder;
    };

    /* [Private]
     *
     * bootstrap( mock, definition ) -> Boolean
     *  - mock (Mock): Mock instance to augment
     *  - descriptor (Map): Hash of Mock expectations mapped to Mock object
     *  API.
     *
     *  Helper method which interprets a JSON formatted map of a desired mock
     *  object interface, and augments a given Mock instance by performing the
     *  set-up cascading invocation for you (i.e. the bootstrap phase).
     *
     *  #### Example
     *
     *  <pre><code>
     *  new Mock({
     *    // method
     *    "foo": {
     *      "id"      : "Descriptor / Identifier"
     *      "accepts"   : "bar",
     *      "receives"  : {"accepts": "foo", data: "stub", returns: "bar"}
     *      "returns"   : "baz",
     *      "required"  : 1,
     *      "namespace" : "faz",
     *      "async"     : true
     *      "overload"  : true,
     *      "data"      : "response",
     *      "chain"     : true // arg not used, readability only
     *      "calls"     : 1
     *    },
     *    // property
     *    "bar": {
     *      "value": "stub"
     *    }
     *  })
     *  </code></pre>
     *
     *  _See integration tests or wiki for more in-depth patterns_.
     **/
    var bootstrap = ( function () {

      // Fn to test object definition against defined interface
      function getDescriptorType ( map ) {
        var isMethod = false, key;
        for( key in map ) {
          if( key in Mock.prototype ) {
            isMethod = true;
            break;
          }
        }
        return ( isMethod )
          ? "method" : !!( "value" in ( map || {} ) )
            ? "property" : "namespace";
      }

      // Function which invokes methods on an interface based on a mapping
      function invoker ( obj, map ) {
        enumerate( map, function ( prop, key ) {
          if( is( obj[ key ], "Function" ) ) {
            // Use apply in conjunction to toArray in case of
            // multiple values per expectation (e.g. mock.receives)
            // Support for [] grouping notation
            obj[ key ].apply( obj, toArray( prop ) );
          }
        });
      }

      return function ( mock, desc ) {
        // interface checks - duck type mock check since proxied interface
        if ( !mock.property && !mock.method && !mock.namespace ) {
          // If not valid then create a new mock instance to augment
          // Use Mock function as receiver since implements Receiver interface
          mock = Mock.create();
        }

        // pseudo-break;
        var stop = false;

        // iterate through mock expectations and setup config for each
        enumerate( desc, function ( prop, key, obj ) {
          if ( stop ) { return; }
          // mock type...
          var bool = typeof mock[ key ] == "undefined",
              expectations = ( bool ) ? prop : obj || {},
              // method || namespace || property
              type = getDescriptorType( expectations ),
              member;

          // if member augment receiver object with new mocked member
          if ( bool ) {
            member = mock[ type ]( key, type === "property"
              ? expectations.value
              : expectations
            );
          }
          // Auto-setup methods
          if( type === "method" ) {
            invoker( member || mock, expectations );
          }
          // If standalone fn then stop (constructor or method)
          if ( !bool ) {
            stop = true;
          }
        });
        return mock;
      };
    })();

    /* [Private]
     * new ErrorHandler( mock ) -> Function
     *  - mock ( Mock ): Mock instance to associate error with
     **/
    function ErrorHandler ( exceptions ) {
      return function () {
        exceptions.push( createException.apply( null, arguments ) );
      };
    }

    // EXERCISE PHASE functions

    /* [Private]
     *
     * exerciseMock( mock ) -> Function
     *  - mock (Mock): mock instance to mutate
     *  - presentation (Array): Array(-like) object containing parameters
     *  passed to associated proxy recorder function.
     *
     *  Utility for recording inputs to a given mock and mutating it's internal
     *  state. Instance state is mutated when a stubbed function is invoked as
     *  part of a 'system under test' (SUT) exercise phase.
     *
     *  Has to use <code>this</code> as arguments to recorder consititute a
     *  'presentation' to the mocked member / object interface.
     *
     *  _Returns_: The mapped return value for the presentation made to the
     *  stub interface, or the default mock return (at instantiation is
     *  <code>undefined</code>).
     **/
    function exerciseMock ( mock, presentation ) {
      // Mutate state
      mock.called++;
      mock.received.push( presentation );
      // Stub responses
      exerciseCallbacks( mock, presentation );
      return exerciseReturn( mock, presentation );
    }

    /* [Private]
     *
     * exerciseCallbacks(mock, method) -> Boolean
     *  - mock (Mock): mock instance to exercise callbacks on
     *  - presentation (Array): Presentation made / to be made to
     *  mocked method
     *
     *  If the presentation made to the mock object interface contains a
     *  function object, then the presentation is tested for a matching 'data'
     *  expectation on the mocked method instance.
     *
     *  If a match is found then the canned data parameters are passed to what
     *  is assumed to be callback and it is invoked.
     *
     *  This is mostly used to simulate ajax or event callbacks during an
     *  exercise phase.
     **/
    function exerciseCallbacks ( mock, presentation ) {
      iterate( presentation, function ( item, i, ar ) {
        // Check if potential callback passed
        if ( is( item, "Function" ) ) {
          // Use data on presentation, or default to common properties
          var data = comparePresentation( mock, ar, "data" ) || mock.dataRep;
          // If response data declared then invoke callbacks in timely manner
          // default is asynchronous / deferred execution
          // else a blocking invocation on same thread
          if ( data != null ) {
            if ( mock.async && setTimeout ) {
              // Use a setTimeout to simulate an async transaction
              setTimeout((function ( callback, params ) {
                return function () {
                  callback.apply( null, toArray( params ) );
                }
              })( item, data ), config.delay);
            } else {
              item.apply( null, toArray( data ) );
            }
          }
          // reset data to undefined for next pass (multiple callbacks)
          data = null;
        }
      });
      return true;
    }

    /* [Private]
     *
     * exerciseReturn(presentation, method) -> Object | undefined
     *  - mock (Mock): mock instance to exercise return on
     *  - presentation (Array): Presentation made / to be made to mocked method
     *
     *  Function tests presentation against mock object interface expectations.
     *
     *  If match found then lookup is made for a corresponding 'returns'
     *  property.
     *
     *  If not found then catch-all 'return' value is returned, which defaults
     *  to <code>undefined</code> (as per spec).
     **/
    function exerciseReturn ( mock, presentation ) {
      return comparePresentation( mock, presentation, "returns" ) || mock.returnVal;
    }

    // TODO: Either abstract this out or simplify

    /* [Private]
     *
     * createException( actual, expected, exceptionType, identifier ) -> Hash
     *  - actual (Object): The presentation received by the mock interface
     *  - expected (Object): Expectations set on the mock object
     *  - exceptionType (String): Exception type
     *  - identifier (String): Identifier for mock instance
     *
     * _returns_: Hash with pertinent information regarding the error caused.
     **/
    function createException ( actual, expected, exceptionType, identifier ) {

      var e = {
          type : exceptionType
        },
        fn = "'" + identifier + "'";

      switch (exceptionType) {
        case "IncorrectNumberOfArgumentsException":
        case "MismatchedNumberOfMembersException":
          e.message = fn + " expected: " + expected
            + " items, actual number was: " + actual;
          break;
        case "IncorrectNumberOfMethodCallsException":
          e.message = fn + " expected: " + expected
            + " method calls, actual number was: " + actual;
          break;
        case "MissingHashKeyException":
          e.message = fn + " expected: " + expected
            + " key/property to exist on 'actual' object, actual was: " + actual;
          break;
        default:
          e.message = fn + " expected: " + expected
            + ", actual was: " + actual;
      }
      return e;
    }

    // VERIFY PHASE functions

    /* [Private]
     * QMock.verifyInvocations( mock ) -> Boolean
     * - mock (Mock): mock instance to test
     *
     *  Evaluates if amount of times a mock object (method/constructor) has been
     *  invoked matches expectations
     **/
    function verifyInvocations ( mock ) {
      return ( mock.minCalls == null )
        // No invocation expectation so result is true.
        ? true
        // If one expression below true then return else expectations not met
        // so false
        : (
          // explicit call number defined
          mock.minCalls === mock.called
          // arbitrary range defined
          || ( mock.minCalls <= mock.called )
            && ( mock.maxCalls >= mock.called )
          // at least n calls
          || ( mock.minCalls < mock.called )
            && ( mock.maxCalls === Infinity )
        );
    }

    /* [Private]
     * QMock.verifyOverloading( mock ) -> Boolean
     * - mock (Mock): mock instance to test
     *
     *  Evaluates if number of parameters passed to mock object falls
     *  below / exceeeds expectations
     **/
    function verifyOverloading ( mock ) {
      return ( ( mock.overloadable )
        // At least n Arg length checking - overloading allowed
        ? ( mock.requires > mock.received[0].length )
        // Strict Arg length checking - no overload
        : ( mock.requires !== mock.received[0].length )
      );
    }

    /* [Private]
     * QMock.verifyPresentation( mock, presentation ) -> Boolean
     *  - mock (Mock): mock object to test against
     *  - presentation (Array): Presentation made / to be made to mock object
     *  interface
     *
     *  Evaluate a single presentation against all mock object interface
     *  expectations. Single match equals true.
     **/
    function verifyPresentation ( mock, presentation ) {
      checkCompare();
      var result = true, stop = false;
      iterate( mock.expected, function ( item ) {
        if ( stop ) { return; }
        // reset so that empty presentation and empty expectation return true
        // If no expectations then won't be reached... returns true.
        result = false;

        // expectation to compare
        var expected = item.accepts;

        // If overloading allowed only want to check parameters passed-in
        // (otherwise will fail). Must also trim off overloaded args as no
        // expectations for them.
        if ( mock.overloadable === true ) {
          presentation = trimCollection( presentation, expected );
          expected  = trimCollection( expected, presentation );
        }

        // Else if overloading disallowed just pass through expected and
        // actual
        result |= config.compare( presentation, expected );

        // If true then exit early
        if ( !!result ) {
          stop =  true;
        }
      });
      return !!result;
    }

    /* [Private]
     * QMock.verifyInterface( mock [, raise] ) -> Boolean
     *  - mock (Mock): mock object to test
     *  - raise (Function) _optional_: Function to handle false comparison
     *  results
     *
     *  Evaluate *all* presentations made to mock object interface against all
     *  mock interface expectations.
     *
     *  Each presentation must match an expectation.
     *
     *  If no match and optional error handler passed then error raised.
     **/
    function verifyInterface ( mock, raise ) {
      var result = true;
      // For each presentation to the interface...
      iterate( mock.received, function ( presentation ) {
        // ...Check if a matching expectation
        result &= verifyPresentation( mock, presentation );
        // Record which presentations fail
        if ( !!!result ) {
          raise && raise(
            presentation,
            mock.expected,
            "IncorrectParameterException",
            mock.name + '()'
          );
        }
      });
      return !!result;
    }

    // PUBLIC API

    /** section: QMock
     * class QMock
     **/
    return {
      version: "0.4rc",
      config: config,
      create: createQMock,
      /** alias of: Mock
       * QMock.Mock() -> mock receiver / constructor / method / property object
       **/
      Mock:  function ( map, bool ) {
        return Receiver.create( map || {}, is( bool, "Boolean") ? bool : true );
      },
      /**
       * QMock.utils
       *  Utility methods for use on 'excised' mock instances or testing.
       **/
      utils: {
        /**
         * QMock.utils.verify( receiver [, raise] ) -> Boolean | Exception
         *  - receiver (Mock): mock / receiver object to test
         *  - raise (Function) _optional_: Function to handle false comparison
         *  results
         *
         *  Verifies the receiver object (the parent mock object) first, then
         *  individual members (both methods and nested namespaces).
         *
         *  Only passes if whole object tree passes, else throws exception
         *  or returns <code>false</code> depending on mode (fail slow/fast).
         **/
        verify: function ( mock ) {
          if ( mock.verify ) {
            return mock.verify();
          }
        },
        reset: function ( mock) {
          if ( mock.reset ) {
            return mock.reset();
          }
        },
        is: is,
        eumerate: enumerate,
        test: function () {
          arguments[0] = getState( arguments[0] );
          return comparePresentation.apply( null, arguments );
        }
      },
      // only exposed for integration tests
      __bootstrap: bootstrap
    };

  }// end init

  // Initialise a QMock instance
  container.QMock = container.QMock || createQMock();

  // Alias QMock.Mock for simple use
  container.Mock = container.QMock.Mock;

  // Bish bash bosh.
  return true;

// if exports available assume CommonJS
})( (typeof exports !== "undefined") ? exports : this );