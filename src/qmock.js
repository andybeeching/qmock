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
(function ( container, undefined ) {

  // Trap original methods - protected scope
  var slice = Array.prototype.slice,
      toString = Object.prototype.toString,
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
       *  <pre><code>QMock.failslow = true;</code></pre>
       **/
      failslow: true,

      /**
       * QMock.config.compare -> false | Function
       *
       *  Pointer to comparison method used internally by QMock, and by
       *  <code>QMock.comparePresentation</code>.
       *
       *  Default value is <code>false</code>, and if function not set than an
       *  <code>Error</code> is thrown. This method should override the default
       *  <code>Boolean</code> value, and be set before any tests are run, or
       *  mock instantiated.
       *
       *  #### Example
       *  <pre><code>QMock.config.compare = QUnit.equiv;</code></pre>
       **/
      compare: false,

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
     *  <pre><code>QMock.Utils.is( "foo", "String"); // true </code></pre>
     **/
    function is ( obj, nativeType ) {
      return toString.call( obj ) === "[object " + nativeType + "]";
    }

    /**
     * QMock.utils.test( presentation, method[, prop] ) -> Boolean | Object | undefined
     *  - method (Mock): Mock object to which the presentation
     *  is / would be passed
     *  - presentation (Array): Array representing a method/constructor
     *  interface 'presentation' to test (arguments collection or parameter
     *  list)
     *  - prop (String) _optional_: Optional key used to lookup associated
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
    function comparePresentation ( state, presentation, prop ) {
      // Check dependencies
      if ( isCompare() ) {
        // Dependency available, let's roll
        for ( var result = false, i = 0, len = state.expected.length; i < len; i++ ) {
          // If match found against presentation return bound object (or self if chained)
          if ( config.compare( presentation, state.expected[ i ].accepts ) ) {
            result = ( prop )
              ? state.expected[ i ][ prop ]
                || state[ ( prop === "returns" ) ? "returnValue" : ( prop === "data") ? "dataRep" : prop ]
              : true;
            break;
          }
        }
        return result;
      }
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
     * isCompare() -> Boolean | Error
     *
     *  Utility function to assert whether a comparison routine has been set on
     *  QMock namespace.
     **/
    function isCompare () {
      // Check dependencies
      if ( !config.compare ) {
        throw new Error('Comparison routine must be set on QMock.compare with signature fn( a, b )');
      }
      return true;
    }

    /* [Private]
     *
     * normaliseToArray( obj ) -> Array
     *  - obj (Object): Object to normalise
     *
     *  Function that determines whether an input (aka expectated prameters, or
     *  associated properties like 'data)
     *  needs to be normalised into a collection for the purpose of functional
     *  programming / iteration.
     *
     *  Necessary as QMock supports the setting of expected parameters (via
     *  accepts property), or callback arguments (via 'data') without having
     *  to be serialised as arrays where there is only one parameter.
     *
     *  e.g.
     *  <pre><code>normaliseToArray( 'foo' ); // ['foo']</code></pre>
     **/
    function normaliseToArray ( obj ) {
      return ( !is( obj, "Array" )
        || ( obj.length === 1 && is( obj[0], "Array" ) ) ) ? [ obj ] : obj;
    }

    /* [Private]
     * TODO: Ensure this conforms to ES5 spec if one
     *
     * bind( fn, scope ) -> Function
     *  - fn (Function): Function to be bound
     *  - scope (Object): Object to bind function to (execution scope)
     *
     *  Utility function to bind a function to a specific execution context
     **/
    function bind ( fn, scope ) {
      return function () {
        return fn.apply( scope, arguments );
      };
    }

    /* [Private]
     *
     *  bindInterface( obj, receiver, scope [, re] )
     *  - obj (Object): Interface to copy and bind (e.g. Mock.prototype)
     *  - receiver (Object): Object to copy interface to
     *  - scope (Object): The execution context to bind methods to
     *  - re (RegExp) _optional_: RegExp to run against interface keys to cache
     *  and execute old method if overwriting.
     *
     *  Utility function to copy a given object's interface over with bound
     *  function calls to the receiver instance scope (e.g. bind
     *  <code>this</code>).
     *  
     *  If optional <code>re</code> parameter passed then runs match on object
     *  keys and partially applies function in a new closure, running it before
     *  the new bound function. This is mainly used when overriding an existing
     *  function through cloned prototypal inheritance.
     *
     *  _Note_: Check if member is a function can be made more robust using 
     *  QMock.is(), but since private can rely on collaborator callees.
     *  Hopefully.
     **/
    function bindInterface ( obj, receiver, scope, re ) {
      for ( var key in obj ) {
        if( hasOwnProperty.call( obj, key ) && ( typeof obj[ key ] === "function" ) ) {
          // Create bound function
          var fn = bind( obj[ key ], scope );
          // Determine if need to cache (and execute) original function if exists
          receiver[ key ] = ( re && re.test( key ) )
            ? (function ( original, overide ) {
                return function () {
                  original();
                  return overide();
                }
              })( receiver[ key ], fn )
            : fn;
        }
      }
    }

    /* [Private]
     * TODO: Define this!
     *  get#methodName(parameters)
     **/
    function getState ( obj ) {
      // early exclusion
      if ( obj instanceof Expectation ) { return obj; }
      // else try and find it
      if ( is( obj, "Function") ) {
        if ( obj.__getState ) {
          return obj.__getState();
        }
        // TODO: Add central repository of *all* mocks to search for cached __getState method
      }
      return false;
    }

    // KLASS DECLARATIONS

    /**
     * == Mock ==
     *  h2. TODO
     *  
     *  # Implement excise method to decouple collaborator interface from mock interface
     *  # Public method unit tests (aka verify/reset), with excised mock
     *  # Refactor Expectations and Presentation Constructors, and expose.
     *  # Add support via a flag for namespace receivers through __createMock factory
     *  
     **/

    /** section: Mock
     * class Mock
     *
     *  Main Stub, or mocked method class
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
      },
      prop;
      // augment base expectations
      for ( prop in config ) {
        if ( hasOwnProperty.call( config, prop ) ) {
          map[ prop ] = config[ prop ];
        }
      }
      return map;
    }

    /*
     * Class#methodName(parameters)
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
    }

    Mock.prototype = {

      /**
       * Mock#id( descriptor ) -> Mock
       *  - identifier (String): ID of the mock object
       *
       *  Identifier is used to create meaningful error messages. By default
       *  it is <code>"anonymous"</code>, or the method name
       *  (assigned by <code>Mock.method</code>).
       *
       *  #### Example
       *  <pre><code>Mock.expects().method('foo').id('fooBar');</code></pre>
       **/
      id: function ( descriptor ) {
        this.name = descriptor;
        return this.self;
      },

      /**
       * Mock#method( name ) -> Mock
       *  - name (String): Name of the method
       *
       *  When <code>method()</code> is called on a receiver object it is
       *  augmented with a new method bound to the identifier <code>name</code>.
       *
       *  Throws <code>InvalidMethodNameException</code> if member with key
       *  <code>name</code> already exists on receiver.
       *
       *  #### Example
       *  <pre><code>Mock.expects().method('foo');</code></pre>
       **/
      method: function ( identifier, min, max ) {
        return this.receiver.method( identifier, min, max );
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
       *
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
        // Check for valid input to interface
        for (var i = 0, len = arguments.length; i < len; i++) {
          var acceptsProperty = arguments[ i ].accepts || false; // attach hasOwnProperty check.
          if ( acceptsProperty === false ) {
            throw {
              type: "MissingAcceptsPropertyException",
              msg: "Qmock expects arguments to expectations() to contain an accepts property"
            };
          } else if ( !is( acceptsProperty, "Array" ) ) {
            throw {
              type: "InvalidAcceptsValueException",
              msg: "Qmock expects value of 'accepts' in arguments to be an Array"
            };
          }
        }

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
       * Mock#property( prop, val ) -> Mock
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
       *  <pre><code>Mock.expects().property('foo', 'bar');
       *  console.log( Mock.foo ); // "bar"</code></pre>
       **/
      property: function ( prop, value ) {
        return this.receiver.property( prop, value );
      },

      /**
       * Mock#namespace( id ) -> Mock
       *  - id (String): Identifer or key for the nested namespace receiver
       *  instance on the Mock. Instance implements all Receiver klass 
       *  methods.
       **/
      namespace: function ( id ) {
        return this.receiver.namespace( id );
      },

      /*
       * Mock#chain() -> Mock
       *
       *  Tells the mocked method to return the receiver object it is bound
       *  to enable cascading (chained) invocations during the exercise phase.
       *
       *  #### Example
       *  <pre><code>var $ = new Mock;
       *  $.expects()
       *    .method('foo').chain()
       *  .expects()
       *    .method('bar');
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

      /**
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
            this.id
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
              this.id
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
       *  methods is to pass parameters to <code>Mock.expects</code>.
       *
       *  However, <code>Mock.calls</code> can be called on an instance of
       *  <code>Mock</code>.
       *
       *  #### Examples
       *
       *  <pre><code>// Set expected calls on mock constructor / receiver
       *  Mock.calls(1,5);
       *
       *  // Set calls on mockmethod
       *  Mock.expects().method('foo').calls(1,5);
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
       *  retrieve the receiver object a mock object is bound to.
       *
       *  This can be thought of analogous to jQuery's <code>end()</code> method
       *  which is used on 'wrapped sets' to restore a collection to it's
       *  original state post-destructive operations (like
       *  <code>$().filter()</code>).
       *
       *  #### Example
       *  <pre><code>Mock.expects().method('foo').end(); // returns Mock</code></pre>
       **/
      end: function () {
        return this.receiver;
      },

      /**
       * Mock#reset() -> Mock
       *
       *  Resets the internal state of the mock and any bound child mock objects.
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
       *  Recommended to use <code>Mock.expects</code> or
       *  <code>Mock.calls</code> instead.
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
       *  Recommended to use <code>Mock.expects</code> or
       *  <code>Mock.calls</code> instead.
       **/
      noMoreThan: function ( num ) {
        this.maxCalls = num;
        return this.self;
      },

      /*
       * Mock#excise() -> Mock
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
       *  // Augment post-'excision'
       *  QMock.Mock.prototype.calls(mock, 2)
       *
       *  // Check expectation updated
       *  mock._getState()._minCalls === 2 // true;
       *  </code></pre>

      excise: function () {
        for ( var key in this ) {
          if ( key in Recorder.prototype ) {
            delete this[ key ];
          }
        }
      },

      // Privileged pointers for debugging

      /**
       * Mock#__getExceptions() -> Array
       *
       *  Returns an array of exception objects, used for debugging when
       *  <code>Mock.verify()</code> returns <code>false</code> in 'fail slow'
       *  test runner setups (see Config section).
       **/
      __getExceptions: function () {
        return this.exceptions;
      },

      /** section: Mock
       * Mock#__getState() -> Object (Mock State)
       *
       *  Utility method for retrieving the internal state of a mock object
       *  for debugging
       **/
      __getState: function () {
        return this;
      }

    }; // end Mock.prototype declaration

    function Receiver () {
      // Constructor protection
      if( !(this instanceof Receiver ) ) {
        return new Receiver;
      }
      // Carry on Charlie...
      this.methods    = [];
      this.properties = {};
      this.namespaces = [];
      // Normally overridden in factory to reference public receiver object
      this.self       = this;
      // Used to support expects() Receiver instance method till 0.5 is tagged.
      this.tmp        = {};
    }

    Receiver.prototype = {

      method: function ( identifier, min, max ) {
        // Throw error if collision with mock instance interface
        if ( hasOwnProperty.call( this.self, identifier ) ) {
          throw {
            type: "InvalidMethodNameException",
            msg: "Qmock expects a unique identifier for each mocked method"
          };
        }

        // Register public pointer to mocked method instance on receiver object
        this.self[ identifier ] = createRecorder(
          new Mock(
            this.tmp.min || min,
            this.tmp.max || max,
            this.self
          )
        );

        // Track methods
        this.methods.push( this.self[ identifier ] );

        // Bam!
        return this.self[ identifier ].id( identifier );
      },

      property: function ( prop, value ) {
        // Throw error if collision with mock instance interface
        if ( hasOwnProperty.call( this.self, prop ) ) {
          throw {
            type: "InvalidPropertyNameException",
            msg: "Qmock expects a unique key for each stubbed property"
          };
        }

        // New property on receiver + track properties
        this.self[ prop ] = this.properties[ prop ] = value;
        return this.self;
      },

      namespace: function ( id, map, bool ) {
        // Throw error if collision with mock instance interface
        if ( hasOwnProperty.call( this.self, id ) ) {
          throw {
            type: "InvalidNamespaceIdentiferException",
            msg: "Qmock expects a unique key for a namespace identifer"
          };
        }

        // New property on receiver + track namespaces
        this.self[ id ] = createReceiver( map || {}, !!bool );
        
        // Track namespace
        this.namespaces.push( this.self[ id ] );

        // Return correct receiver scope for augmentation
        return this.self[ id ];
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
       *  use <code>.method( name, min, max )</code>, or <code>.calls()</code>
       *  instead.
       **/
      expects: function ( min, max ) {
        this.tmp.min = min;
        this.tmp.max = max;
        return this.self;
      },

      verify: function () {
        // Verify receiver if fn
        var result  = true,
            members = this.methods.concat( this.namespaces ),
            i       = 0,
            len     = members.length,
            exceptions;

        // Verify members
        for (; i < len; i++) {
          result &= members[ i ].verify();
        }
        
        // Gather all exceptions
        exceptions = this.__getExceptions();
        
        // Live() or Die()
        if ( !config.failslow && exceptions.length ) {
          // Pants.
          throw exceptions;
        } else {
        // WIN. \o/
          return !!result;
        }
      },

      reset: function () {
        var members = this.methods.concat( this.namespaces ),
            i = 0, 
            len = members.length;
        // Reset all members on receiver
        for (;i < len; i++) {
          members[ i ].reset();
        }
        // Reset Properties (could have been mutated)
        for ( var key in this.properties ) {
          if( hasOwnProperty.call( this.properties, key ) ) {
            this.self[ key ] = this.properties[ key ];
          }
        }
        return true;
      },
      
      __getExceptions: function () {
        var exceptions = ( this.self.__getState ) ? this.self.__getState().exceptions : [],
            i = 0,
            len = this.methods.length;
        for (; i < len; i++) {
          exceptions = exceptions.concat( this.methods[ i ].__getExceptions() );
        }
        return exceptions;
      }
    }

    // SETUP PHASE Functions
    // Mainly factory methods that handle instantiation and bindings

    /* [Private]
     * createRecorder( mock ) -> Function
     *
     *  Factory method to create a stub function to be attached to a receiver
     *  object, bound to a passed mock instance. Upon invocation within an SUT
     *  the mock state will be mutated, and any corresponding declared return
     *  values will be retrieved and output.
     **/
    function createRecorder ( mock ) {

      // Check mock implements correct interface
      if ( !(mock instanceof Mock) ) {
        throw new Error("createRecorder() expects an instance of mock as the only parameter");
      }

      // Mutator for mock instance state
      // Exercises callbacks for async transactions
      // Returns itself or explicit value
      function recorder () {
        return exerciseMock( mock, slice.call( arguments ) );
      };

      // Public API - Bind prototypal inherited methods and to private receiver state
      bindInterface( Mock.prototype, recorder, mock );

      // Backward compatibility for QMock v0.1/0.2 API

      /** alias of: Mock#receives(), deprecated
       * Mock#interface() -> Mock
       *
       *  See Mock#receives for usage.
       **/
      recorder.interface        = recorder.receives;
      recorder.withArguments    = recorder.accepts;
      recorder.andReturns       = recorder.returns;
      recorder.andChain         = recorder.chain;
      recorder.callFunctionWith = recorder.data;

      // Reference to bound mutator on instance itself (in case of detachment)
      mock.self = recorder;
      // Do it. Just do it.
      return recorder;
    }

    /**
     * new Mock( definition [, isFunction] )
     *  - definition (Hash): Hash of Mock expectations mapped to Mock object
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
     *  <pre><code>// Via API
     *  var ninja = new Mock();
     *
     *  ninja.method('foo').returns('bar');
     *
     *  // Via definition map
     *  ninja = new Mock({
     *    // method
     *    "foo": {
     *      "id"      : "Descriptor / Identifier"
     *      "accepts"   : "bar",
     *      "receives"  : {"accepts": "foo", data: "stub", returns: "bar"}
     *      "returns"   : "baz",
     *      "required"  : 1,
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
     **/
    function createReceiver ( definition, bool ) {

      // Private Receiver state
      var receiver = new Receiver,

      // Create mock + recorder if definition supplied, else use passed object
      // or object literal as simple proxy receiver
      // update receiver pointer to proxy so methods/props attached correctly
      proxy = receiver.self = ( !!bool )
        ? createRecorder( new Mock )
        : {};

      // Public API - Bind prototypal inherited methods and to private 
      // receiver state
      bindInterface( 
        Receiver.prototype,
        proxy,
        receiver,
        !!bool ? /verify|reset/ : null // If proxy is a fn then curry interface
      );

      // Update default return state on Constuctors to themselves (for
      // cascade-invocation-style declarations). If the return value is 
      // overidden post-instantiation then it is assumed the mock is a 
      // standalone function constuctor and not acting as a receiver object 
      // (aka namespace / class)
      if ( proxy.__getState && proxy.__getState() instanceof Mock ) {
        proxy.chain();
      }

      // Backward compatibility with QMock v0.1 API
      proxy.expectsArguments  = proxy.accepts;
      proxy.andExpects        = proxy.expects;

      // If params passed to Mock constructor auto-magikally create mocked
      // interface from definition map
      return ( definition ) ? createMock( proxy, definition ) : recorder;
    }

    /* [Private]
     *
     * createMock( mock, definition ) -> Boolean
     *  - mock (Mock): Mock instance to augment
     *  - definition (Hash): Hash of Mock expectations mapped to Mock object
     *  API.
     *
     *  Factory method which interprets a JSON map of a desired mock object interface
     *  (with expectations) and augments a Mock instance with them.
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
    function createMock ( mock, definition ) {

      // interface checks - duck type mock check since instanceof won't work
      if ( typeof mock.expects === "undefined" ) {
        // If not valid then create a new mock instance to augment
        mock = createRecorder( new Mock );
      } else if ( definition == null ) {
        throw new Error("createMock() requires a defintion map {}");
      }

      var name, obj, prop;

      // iterate through mock expectation and set configuration for each
      setExpectations: for ( name in definition ) {
        if ( hasOwnProperty.call( definition, name ) ) {

          // determine if mock === receiver || constructor
          var isBound = typeof mock[ name ] === "undefined",
              // set config for mock type
              config = ( isBound ) ? definition[ name ] : definition,
              // expectation === method || property
              isMethod = !!( typeof config.value === "undefined" );

          // augment receiver object with mocked property or method if doesn't exist
          // else assume mock is a constructor and augment that instance itself
          if ( isBound ) {
            mock = mock.expects()[ isMethod ? "method" : "property" ]( name );
          }

          // For each method expectation check if callable method and invoke
          if ( isMethod ) {
            configExpectation: for ( prop in config ) {
              if ( hasOwnProperty.call( config, prop ) && is( mock[ prop ], "Function" ) ) {
                  // Use apply in conjunction to normaliseToArray in case of
                  // multiple values per expectation (e.g. mock.receives)
                  // Support for [] grouping notation
                  mock[ prop ].apply( mock, normaliseToArray( config[ prop ] ) );
              }
            } // end configExpectation...
          } else {
            // If expectation not method then simply set property
            mock[ name ] = config.value;
          }
        }
        // For now break since only setting expecations on one mock instance
        // aka the constructor
        if ( !isBound ) {
          break setExpectations;
        }
      } // end setExpectations...
      return mock;
    }

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
     *  - presentation (Array | Collection): Presentation made / to be made to
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
      // Execute any callback functions specified with associated args
      for (var i = 0, len = presentation.length, data; i < len; i++) {
        // Check if potential callback passed
        if ( presentation[ i ] && is( presentation[ i ], "Function" ) ) {
          // Use data associated with presentation, or default to 'global' data
          // if available
          data = comparePresentation( mock, presentation, "data" ) || mock.dataRep;
          // If response data declared then invoke callbacks in timely manner
          if ( data != null ) {
            // default is asynchronous / deferred execution
            if ( mock.async ) {
              // Use a setTimeout to simulate an async transaction
              // Need to bind scope to avoid pesky multiples
              setTimeout((function ( callback, params ) {
                return function () {
                  callback.apply( null, normaliseToArray( params ) );
                }
              })( presentation[ i ], data ), config.latency);
            } else {
              // else a blocking invocation on same 'thread'
              presentation[ i ].apply( null, normaliseToArray( data ) );
            }
          }
          // reset data to undefined for next pass (multiple callbacks)
          data = null;
        }
      }
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
      if ( isCompare() ) {
        for (var i = 0, len = mock.expected.length, expected, result = true; i < len; i++) {
          // reset so that empty presentation and empty expectation return true
          // If no expectations then won't be reached... returns true.
          result = false;

          // expectation to compare
          expected = mock.expected[ i ].accepts;

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
            return true;
          }
        }
        return !!result;
      }
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
      var params = 0, total = mock.received.length, result = true;
      // For each presentation to the interface...
      for (; params < total; params++) {
        // ...Check if a matching expectation
        result &= verifyPresentation( mock, mock.received[ params ] );
        // Record which presentations fail
        if ( !!!result ) {
          raise && raise(
            mock.received[ params ],
            mock.expected,
            "IncorrectParameterException",
            mock.id + '()'
          );
        }
      }
      return !!result;
    }

    // PUBLIC API

    /** section: QMock
     * class QMock
     **/
    return {
      config : config,
      create : createQMock,
      /** alias of: Mock
       * QMock.Mock() -> mock receiver / constructor / method / property object
       **/
      Mock   :  function ( map, bool ) {
        return createReceiver( map || {}, is( bool, "Boolean") ? bool : true );
      },
      /**
       * QMock.utils
       *  Utility methods for use on 'excised' mock instances or testing.
       **/
      utils  : {
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
        verify : function ( mock ) {
          if ( mock.verify ) {
            return mock.verify();
          }
        },
        reset  : function ( mock) {
          if ( mock.reset ) {
            return mock.reset();
          }
        },
        is     : is,
        test   : function () {
          arguments[0] = getState( arguments[0] );
          return comparePresentation.apply( null, arguments );
        }
      },
      // only exposed for integration tests
      __createMock : createMock
    };

  }// end init

  // Initialise a QMock instance
  container.QMock = createQMock();

  // Alias QMock.Mock for simple use
  container.Mock = container.QMock.Mock;

  // Bish bash bosh.
  return true;

// if exports available assume CommonJS
})( (typeof exports !== "undefined") ? exports : this );