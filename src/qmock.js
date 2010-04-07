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
     * == Config ==
     *  Configuration settings for QMock - can be modified during runtime.
     *  Exposed as <code>QMock.config</code>.
     **/

    /** section: Config
     * Config
     *  _Note_: This is not a global object, but simply a separate
     *  documentation section for QMock config options
     **/
    var config = {
      /**
       * Config.failSlow -> true | Boolean
       *
       *  Allows a developer to specify whether errors built up during a
       *  verify phase should be thrown or suppressed (by default set to
       *  <code>true</code>).
       *
       *  If in 'fail fast' mode then exceptions are thrown as part of the
       *  verify phase, and it is up to the invoking test runner code to
       *  catch and handle them for assertion.
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
       *  <pre><code>QMock.failSlow = true;</code></pre>
       **/
      failSlow: true,
      /**
       * Config.compare -> false | Function
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
      compare: false
    };

    /**
     * QMock.is( nativeType, obj ) -> Boolean
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
     * QMock.isNot( nativeType, obj ) -> Boolean
     *  - nativeType (String): Native type to test object against
     *  - obj (Object): Object to test
     *
     *  Inverse of QMock.Utils.is(), see notes for more details.
     *
     *  #### Example
     *  <pre><code>QMock.Utils.is( "foo", "Number"); // true </code></pre>
     **/
    function isNot () {
      return !is.apply( null, arguments );
    }

    /**
     * QMock.testParameters( presentation, method[, property] ) -> Boolean | Object
     *  - method (Mock | Member): Mock object to which the presentation
     *  is / would be passed
     *  - presentation (Array): Array representing a method/constructor interface
     *  'presentation' to test (arguments collection or parameter list)
     *  - property (String) _optional_: Optional key used to lookup associated
     *  data held on an expectation object
     *
     *  returns If optional property name is passed then will use that as key
     *  on any matching expectation objects and return the correlating value.
     *
     *  For example, internally QMock uses the method to return canned stubbed
     *  responses during an exercise phase. The method can be used as
     *  standalone to test the Stub interface.
     *
     *  If no property parameter passed then a Boolean value is returned
     *  depending on match success.
     *
     *  #### Example
     *  <pre><code>comparePresentation(["foo"], new Member, "returns");</code></pre>
     **/
    function comparePresentation ( mock, presentation, property ) {
      // Check dependencies
      if ( isCompare() ) {
        // Dependency available, let's roll
        for ( var result = false, i = 0, len = mock._expected.length; i < len; i++ ) {
          // If match found against presentation return bound object (or self if chained)
          if ( config.compare( presentation, mock._expected[ i ].accepts ) ) {
            result = ( property )
              ? mock._expected[ i ][ property ]
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
      return ( isNot( obj, "Array" )
        || ( obj.length === 1 && is( obj[0], "Array" ) ) ) ? [ obj ] : obj;
    }

    // SETUP PHASE Functions

    /* [Private]
     *
     * createStub( method ) -> Function
     *  - method ( Mock | Stub ): Mock object to which stub function is bound.
     *
     *  Factory for creating a mock stub function - acts as a mutator and
     *  operates on a specific mock object state. Instance state is mutated
     *  when a stub is invoked as part of a 'system under test' (SUT)
     *  exercise phase.
     *
     *  _Returns_: Closure-bound mock stub function. Function object also has
     *  static accessor (<code>_getState</code>) which returns the internal
     *  state of the bound mocked method instance as an object. This can be
     *  useful for debugging purposes.
     **/
    function createStub ( mock ) {

      function stub () {
        // Normalise actual parameters
        var presentation = slice.call( arguments );
        // Mutate state
        mock._called++;
        mock._received.push( presentation );
        // Stub responses
        exerciseCallbacks( mock, presentation );
        return exerciseReturn( mock, presentation );
      }

      /** section: Mock
       * Mock#_getState() -> Object (Mock State)
       *
       *  Utility method for retrieving the internal state of a mock object
       *  for debugging
       **/
      stub._getState = function () {
        return mock;
      };

      return stub;
    }

    /* [Private]
     *
     * createMember( [ min ] [, max ] [, receiver ] ) -> Member
     *  - min (Number) _optional_: minimum number of invocations to expect
     *  - max (Number) _optional_: Maximum number of invocations to expect
     *  - receiver (Object) _optional_: Receiver object to associate 'hold'
     *  returned Member.
     *
     *  Factory for instantiating a new mocked Member object and associating it
     *  with a receiver object (aka a Mock instance).
     *
     *  Internally the receiver is _always_ a Mock instance.
     **/
    function createMember ( min, max, receiver ) {
      var mock = new Member( min, max );
      // If receiver provided setup references for recording interactions
      if ( receiver ) {
        // Store reference to receiver on each member instance
        mock._receiver = receiver;
        // Store reference to method in method list for reset functionality
        // <str>and potential strict execution order tracking<str>.
        receiver._methods && receiver._methods.push( mock );
      }
      return mock;
    }

    /* [Private]
     *
     * createMock( mock, definition ) -> Boolean
     *  - mock (Mock): Mock instance to augment
     *  - definition (Hash): Hash of Mock expectations mapped to Mock object
     *  API.
     *
     *  Function which interprets a JSON map of a desired mock object interface
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

      // interface checks
      if ( typeof mock.expects === "undefined" || definition == null ) {
        throw new Error("createMock() requires a defintion map {}");
      }

      var name, obj, prop;

      // iterate through mock expectation and set configuration for each
      setExpectations: for ( name in definition ) {
        if ( hasOwnProperty.call( definition, name ) ) {

          // mock === receiver || constructor
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

    // EXERCISE PHASE functions

    /* [Private]
     *
     * exerciseCallbacks(presentation, method) -> Boolean
     *  - mock (Mock | Member): mock object to exercise callbacks on
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
          data = comparePresentation( mock, presentation, "data" ) || mock._data;
          if ( data != null ) {
            presentation[ i ].apply( null, normaliseToArray( data ) );
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
     *  - mock (Mock | Stub): mock object to exercise return
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
      return comparePresentation( mock, presentation, "returns" ) || mock._returns;
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

    /** section: QMock
     * QMock.verifyInvocations( mock ) -> Boolean
     * - method (Mock | Stub): mock object to test
     *
     *  Evaluates if amount of times a mock object (method/constructor) has been
     *  invoked matches expectations
     **/
    function verifyInvocations ( mock ) {
      return ( mock._minCalls == null )
        // No invocation expectation so result is true.
        ? true
        // If one expression below true then return else expectations not met
        // so false
        : (
          // explicit call number defined
          mock._minCalls === mock._called
          // arbitrary range defined
          || ( mock._minCalls <= mock._called )
            && ( mock._maxCalls >= mock._called )
          // at least n calls
          || ( mock._minCalls < mock._called )
            && ( mock._maxCalls === Infinity )
        );
    }

    /**
     * QMock.verifyOverloading( mock ) -> Boolean
     * - method (Mock | Stub): mock object to test
     *
     *  Evaluates if number of parameters passed to mock object falls
     *  below / exceeeds expectations
     **/
    function verifyOverloading ( mock ) {
      return ( ( mock._overload )
        // At least n Arg length checking - overloading allowed
        ? ( mock._requires > mock._received[0].length )
        // Strict Arg length checking - no overload
        : ( mock._requires !== mock._received[0].length )
      );
    }

    /**
     * QMock.verifyPresentation( mock, presentation ) -> Boolean
     *  - mock (Mock | Stub): mock object to test against
     *  - presentation (Array): Presentation made / to be made to mock object
     *  interface
     *
     *  Evaluate a single presentation against all mock object interface
     *  expectations. Single match equals true.
     **/
    function verifyPresentation ( mock, presentation ) {
      if ( isCompare() ) {
        for (var i = 0, len = mock._expected.length, expected, result = true; i < len; i++) {
          // reset so that empty presentation and empty expectation return true
          // If no expectations then won't be reached... returns true.
          result = false;

          // expectation to compare
          expected = mock._expected[ i ].accepts;

          // If overloading allowed only want to check parameters passed-in
          // (otherwise will fail). Must also trim off overloaded args as no
          // expectations for them.
          if ( mock._overload === true ) {
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

    /**
     * QMock.verifyInterface( mock [, raise] ) -> Boolean
     *  - mock (Mock | Member): mock object to test
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
      var params = 0, total = mock._received.length, result = true;
      // For each presentation to the interface...
      for (; params < total; params++) {
        // ...Check if a matching expectation
        result &= verifyPresentation( mock, mock._received[ params ] );
        // Record which presentations fail
        if ( !!!result ) {
          raise && raise(
            mock._received[ params ],
            mock._expected,
            "IncorrectParameterException",
            mock._id + '()'
          );
        }
      }
      return !!result;
    }

    /**
     * QMock.verifyReceiver( receiver [, raise] ) -> Boolean | Exception
     *  - receiver (Mock): mock / receiver object to test
     *  - raise (Function) _optional_: Function to handle false comparison
     *  results
     *
     *  Verifies the receiver object (the parent mock object) first, then
     *  individual members. Only passes if whole object tree passes, else
     *  throws exception (fail fast).
     **/
    function verifyReceiver ( receiver, raise ) {
      // Verify Self (Constructor)
      var result = Member.prototype.verify.call( receiver, raise );

      // Verify Members
      for (var i = 0, len = receiver._methods.length; i < len; i++) {
        result &= receiver._methods[ i ].verify( raise );
      }

      // Live() or Die()
      if ( !!!result && !config.failSlow ) {
        // Pants.
        throw receiver._exceptions;
      } else {
        // WIN.
        return !!result;
      }
    }

    // TEARDOWN PHASE functions

    /* [Private]
     * resetMock( mock ) -> Boolean
     *
     *  Utility method to reset the state of any mock object to before any
     *  interaction was recorded.
     **/
    function resetMockState ( mock ) {
      if ( mock._exceptions ) {
        mock._exceptions = [];
      }
      mock._called = 0;
      mock._received = [];
      return true;
    }

    /**
      * QMock.resetMock( mock ) -> Boolean
      *  - mock (Mock): Mock object to reset
      *
      *  Resets internal state of the receiver mock object to before any
      *  interaction occurred, and any child mock objects associated with it.
      **/
    function resetMock ( mock ) {
      resetMockState( mock );
      if ( mock._methods ) {
        for (var i = 0, len = mock._methods.length; i < len; i++) {
          mock._methods[ i ].reset();
        }
      }
      return true;
    }

    /**
     * == Mock ==
     *  Meh.
     **/

    /** section: Mock
     * class Mock
     *
     *  Main Stub, or mocked method class
     **/

    /* [Private]
     * new Member( [ min = 0 ] [, max = null ] )
     *  - min (Number) _optional_: Miniumum number of times mocked method
     *  should be called. If max parameter not passed then number becomes a
     *  'strict' invocation expectation (even zero).
     *  - max (Number) _optional_: Maximum number of times mocked method
     *  should be called. If want 'at least _n_' then just pass Infinity.
     *
     *  Prototype for mock objects (constructors, methods & properties).
     **/

    function Member ( min, max ) {
      // Default mock behaviours
      this._returns   = undefined;
      this._id        = "anonymous";
      this._requires  = 0;
      this._overload  = true;
      this._chained   = false;
      this._data      = null;
      // Default mock expectations
      this._expected  = [];
      this._received  = [];
      this._minCalls  = min || null;
      this._maxCalls  = max || null;
      this._called    = 0;
    }

    // Inherited members
    // All methods return the execution scope for cascading invocations
    Member.prototype = {

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
      "id": function ( descriptor ) {
        this._id = descriptor;
        return this;
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
      "method": function ( name ) {
        // Throw error if collision with mock API
        if ( hasOwnProperty.call( this._receiver, name ) ) {
          throw {
            type: "InvalidMethodNameException",
            msg: "Qmock expects a unique identifier for each mocked method"
          };
        }

        // Useful for error messages / debugging
        this._id = name;

        // Register public pointer to mocked method instance on receiver object
        this._receiver[ name ] = createStub( this );
        return this;
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
      "receives": function () {
        // Check for valid input to interface
        for (var i = 0, len = arguments.length; i < len; i++) {
          var acceptsProperty = arguments[ i ].accepts || false; // attach hasOwnProperty check.
          if ( acceptsProperty === false ) {
            throw {
              type: "MissingAcceptsPropertyException",
              msg: "Qmock expects arguments to expectations() to contain an accepts property"
            };
          } else if ( isNot( acceptsProperty, "Array" ) ) {
            throw {
              type: "InvalidAcceptsValueException",
              msg: "Qmock expects value of 'accepts' in arguments to be an Array"
            };
          }
        }

        // Set minimum expectations
        this._requires = arguments[ 0 ].accepts.length;

       // TODO: Support for different requires per expected presentation
       // Assign explicit expectation if exist
       /* for ( var i = 0, len = arguments.length; i < len; i++ ) {
          if ( !arguments[ i ][ "required" ] ) {
            arguments[ i ][ "required" ] = arguments[ i ][ "accepts" ].length;
          }
        }*/
        this._expected = normaliseToArray( slice.call( arguments ) );
        return this;
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
       *  takes precedent. If multiple expectations are required see the
       *  <code>Mock.interface</code> method.
       *
       *  #### Example
       *
       *  <pre><code>Mock.method("foo").accepts("bar", "baz");</code></pre>
       **/
      "accepts": function () {
        this._requires = arguments.length;
        this._expected.push( { "accepts" : slice.call( arguments ) } );
        return this;
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
      "returns": function ( obj ) {
        this._returns = obj;
        return this;
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
      "required": function ( num ) {
        this._requires = num;
        return this;
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
      "overload": function ( bool ) {
        this._overload = bool;
        return this;
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
      "data": function () {
        this._data = slice.call( arguments );
        return this;
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
      "property": function ( prop, value ) {
        if ( hasOwnProperty.call( this._receiver, prop ) ) {
          throw {
            type: "InvalidPropertyNameException",
            msg: "Qmock expects a unique key for each stubbed property"
          };
        }
        this._receiver[ prop ] = value;
        return this;
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
      "chain": function () {
        this._returns = this._receiver || this;
        return this;
      },

      /** alias of: Mock#expects, deprecated
       * Mock#andExpects( [min][, max] ) -> Mock
       **/
      "andExpects": function ( min, max ) {
        return this._receiver.expects( min, max );
      },

      /**
       * Mock#reset() -> Mock
       *
       *  Resets the internal state of the mock and any bound child mock objects.
       **/
      "reset": function () {
        resetMock( this );
        return this;
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
      "verify": function ( raise ) {
        // If true and no calls thenx exclude from further interrogation
        if ( verifyInvocations( this ) ) {
          if ( this._called === 0 ) {
            return true;
          }
        } else {
          raise && raise(
            this._called,
            this._minCalls,
            "IncorrectNumberOfMethodCallsException",
            this._id
          );
          return false;
        }

        // TBD: This doesn't seem to support multiple presentations to an interface?
        // Checks 'global' _received to see if any paramters actually required, if so,
        // verify against overloading behaviour
        if ( this._requires && verifyOverloading( this ) ) {
          raise && raise(
              this._received[ 0 ].length,
              this._expected.length,
              "IncorrectNumberOfArgumentsException",
              this._id
            );
          return false;
        }

        // 3. Assert all presentations to interface
        return verifyInterface( this, raise );
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
        this._minCalls = num;
        this._maxCalls = Infinity;
        return this;
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
        this._maxCalls = num;
        return this;
      },

      /**
       * Mock#calls( min [, max = null] ) -> Mock
       *  - min (Number): Miniumum number of times mock object should be
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
        this._minCalls = Object( min ) ? min : this._minCalls;
        this._maxCalls = Object( max ) ? max : this._maxCalls;
        return this;
      },

      /**
       * Mock#end() -> Mock
       *
       *  Utility function to end a mock method expectation declaration, or
       *  retrieve the receiver object a mock object is bound to.
       *
       *  This can be thought of analogous to jQuery's <code>end</code> method
       *  which is used on 'wrapped sets' to restore a collection to it's
       *  original state post-destructive operations (like
       *  <code>$().filter()</code>).
       *
       *  #### Example
       *  <pre><code>Mock.expects().method('foo').end(); // returns Mock</code></pre>
       **/
      end: function () {
        return this._receiver || this;
      }

    }; // End Member.prototype declaration

    // Backward compatibility for QMock v0.1/0.2 API
    /** alias of: Mock#receives(), deprecated
     * Mock#interface() -> Mock
     *
     *  See Mock#receives for usage.
     **/
    Member.prototype.interface        = Member.prototype.receives;
    Member.prototype.withArguments    = Member.prototype.accepts;
    Member.prototype.andReturns       = Member.prototype.returns;
    Member.prototype.andChain         = Member.prototype.chain;
    Member.prototype.callFunctionWith = Member.prototype.data;

    /**
     * new Mock( definition )
     *  - definition (Hash): Hash of Mock expectations mapped to Mock object
     *  API.
     *
     *  Constructor for mock receiver, methods and properties. The return
     *  object is a function that can act as a namespace object (aka a
     *  'receiver'), or as a mocked function / constructor with expectations,
     *  or both (e.g. jQuery $).
     *
     *  #### Example
     *  <pre><code>// Via API
     *  var ninja = new Mock();
     *
     *  ninja.expects(1).method('foo').returns('bar');
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
    function Receiver ( definition ) {

      // The stub
      function mock () {
        // Update Receiver instance state and return itself or explicit value
        return recorder.apply( null, arguments );
      }

      // Create internal state
      var state = new Member(),
          // Bind delegated stub invocation to Receiver instance state
          recorder = createStub( mock );

      // Can't use receiver.prototype as function literal prototype not in prototype chain,
      // e.g. a lookup for (function () {}).foo goes to Function.prototype.foo (__proto__)
      // Pseudo-inheritance by copying values & references over to instance
      // Internal state is thus public, otherwise all methods on Member.prototype would
      // need manual scoping with .call() which too much of a dependency.
      for ( var key in state ) {
        // Ultra-protective but Mr. D is right...
        if ( hasOwnProperty.call( state, key )
          || hasOwnProperty.call( Member.prototype, key ) ) {
          mock[ key ] = state[ key ];
        }
      }

      /**
       * Mock#expects( [min = null] [, max = null] ) -> Mock
       * - min (Number): Miniumum number of times mock object should be
       *  invoked. If max parameter not passed then number becomes a 'strict'
       *  invocation expectation (even zero). Default is <code>null</code>.
       * - max (Number) _optional_: Maximum number of times mocked method
       *  should be called. If want 'at least _n_' then just pass
       *  <code>Infinity</code>. Default is <code>null</code>
       *
       *  Factory for creating new mock objects (methods / properties) on the
       *  mock receiver object.
       *
       *  See QMock wiki for patterns.
       *
       **/
      mock.expects = function ( min, max ) {
        return createMember( min, max, mock );
      };

      // Test *both* receiver mock and bound mock methods.
      mock.verify = function () {
        return verifyReceiver( mock, function () {
          mock._exceptions.push( createException.apply( null, arguments ) );
        });
      }

      /**
       * Mock#_getExceptions() -> Array
       *
       *  Returns an array of exception objects, used for debugging when
       *  <code>Mock.verify()</code> returns <code>false</code> in 'fail slow'
       *  test runner setups (see Config section).
       **/
      mock.getExceptions = function () {
        return mock._exceptions;
      }

      // Update default return state on Constuctors to themselves (for
      // cascade-invocation-style declarations). If the return value is overidden
      // post-instantiation then it is assumed the mock is a standalone function
      // constuctor and not acting as a receiver object (aka namespace / class)
      mock._returns = mock;

      // Store methods declared on receiver
      mock._methods = [];

      // Store verification errors
      mock._exceptions = [];

      // Backward compatibility with QMock v0.1 API
      mock.expectsArguments = mock.accepts;
      mock.andExpects = mock.expects;

      // If params passed to Mock constructor auto-magikally create mocked
      // interface from definition map
      return ( definition ) ? createMock( mock, definition ) : mock;
    }

    // PUBLIC API

    /** section: QMock
     * class QMock
     *
     **/
    return {
      /** alias of: Config
       * QMock.config -> Hash
       **/
      config  : config,
      create  : createQMock,
      /** alias of: Mock
       * QMock.Mock() -> mock receiver / constructor / method / property object
       **/
      Mock : Receiver,
      // Privileged Pointers
      verifyInvocations   : verifyInvocations,
      verifyOverloading   : verifyOverloading,
      verifyParameters    : verifyPresentation,
      verifyAllParameters : verifyInterface,
      verifyMock          : verifyReceiver,
      resetMock           : resetMock,
      // Utils
      is    : is,
      isNot : isNot,
      testParameters : comparePresentation,
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