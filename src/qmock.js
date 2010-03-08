/**
 * == QMock API ==
 * 
 * QMock - an 'expect-run-verify' JavaScript mocking library
 *
 *  Copyright (c) 2007-2010, Andy Beeching <andybeeching at gmail dot com>
 *  & Mark Meyer <markdotmeyer at gmail dot com>.
 *
 * Dual licensed under the MIT and GPL Version 3 licenses.
 * 
 **/

(function ( container, undefined ) {

  // Trap original methods,
  var slice = Array.prototype.slice,
      toString = Object.prototype.toString,
      hasOwnProperty = Object.prototype.hasOwnProperty;

      /** section: QMock API
       * QMock.config
       *
       *  Configuration settings for QMock - can be modified during runtime.
       *
       **/
      config = {

        /*
         * QMock.config.failFast -> Boolean
         **/

        failFast: true,

        /**
         * QMock.config.compare -> false | Function
         * 
         *  Pointer to comparison method used internally by QMock, and by QMock.comparePresentation.
         *
         *  Default value is <code>false</code>, and if function not set than an <code>Error</code> is thrown.
         *  This method should override the default <code>Boolean</code> value, and be set before any tests are run, or mock instantiated.
         *
         * #### Example
         *  <pre><code>QMock.config.compare = QUnit.equiv;</code></pre> 
         * 
         **/
        compare: false
      };

  /**
   * QMock.is( nativeType, obj ) -> Boolean
   * - nativeType (String): Native type to test object against
   * - obj (Object): Object to test
   * 
   * Borrowed from jQuery but main credit to Mark Miller for his 'Miller Device'
   *
   *  Supported 'Types': String, Number, Boolean, RegExp, Date, Function, Array, Object
   *
   *  #### Example
   *
   *  <pre><code>QMock.Utils.is( "String", "foo"); // true </code></pre>
   *
   **/
  function is ( nativeType, obj ) {
    return toString.call( obj ) === "[object " + nativeType + "]";
  }

  /**
   * QMock.isNot( nativeType, obj ) -> Boolean
   * - nativeType (String): Native type to test object against
   * - obj (Object): Object to test
   * 
   *  Inverse of QMock.Utils.is(), see notes for more details.
   * 
   **/
  function isNot () {
    return !is.apply( null, arguments );
  }

  /**
   * QMock.comparePresentation( presentation, method[, property] ) -> Boolean | Object
   *  - method (Mock | Member): Mock object to which the presentation is / would be passed
   *  - presentation (Array): Array representing a method/constructor interface
   *   'presentation' to test (arguments collection or parameter list)
   *  - property (String): Optional key used to lookup associated data held on an expectation object
   *
   *  returns If optional property name is passed then will use that as key
   *  on any matching expectation objects and return the correlating value.
   *
   *  For example, internally QMock uses the method to return canned stubbed responses
   *  during an exercise phase. The method can be used as standalone to test the Stub interface.
   *
   *  If no property parameter passed then a Boolean value is returned depending on match success
   *
   *  #### Example
   *
   *  <pre><code>comparePresentation(["foo"], new Member, "returns");</code></pre>
   * 
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
   * - a (Collection): Collection to normalise
   *  - b (Collection): Target collection to normalise against
   * 
   *  Utility function to normalise the length of two collections.
   *
   **/
  function trimCollection ( a, b ) {
    return slice.call( a, 0, b.length );
  }

  /* [Private]
   *
   * isCompare() -> Boolean | Error
   * 
   * Utility function to assert whether a comparison routine has been set on QMock namespace.
   * 
   **/
  function isCompare () {
    // Check dependencies
    if ( !config.compare ) {
      throw new Error('QMock expects a comparison routine to be set on QMock.compare with signature fn( a, b )');
    }
    return true;
  }

  // SETUP PHASE Functions

  /* [Private]
   *
   * createStub( method ) -> Function
   *  - method ( Mock | Member ): Mock object to which stub function is bound.
   * 
   * Factory for creating a mock stub function - acts as a mutator and operates on a specific mock object state.
   *  Instance state is mutated when a stub is invoked as part of a 'system under test' (SUT) exercise phase.
   *
   *  Returns: Closure-bound mock stub function. Function object also has static accessor (<code>_getState</code>) which
   *  returns the internal state of the bound mocked method instance as an object. This can be useful for debugging purposes.
   * 
   **/
  function createStub ( mock ) {

    function stub () {
      // Normalise actual parameters
      var presentation = slice.call( arguments );
      // Mutate state
      mock._calls++;
      mock._received.push( presentation );
      // Stub responses
      exerciseCallbacks( mock, presentation );
      return exerciseReturn( mock, presentation );
    }

    // Accessor to internal state of mock
    stub._getState = function () {
      return mock;
    };

    return stub;
  }

  /* [Private]
   *
   * createMember( [ min ] [, max ] [, receiver ] ) -> Member
   *  - min (Number): minimum number of invocations to expect
   *  - max (Number): Maximum number of invocations to expect
   *  - receiver (Object): Receiver object to associate 'hold' returned Member.
   * 
   *  Factory for instantiating a new mocked Member object and associating it with a receiver object (aka a Mock instance).
   *
   *  Internally the receiver is always a Mock instance.
   * 
   **/
  function createMember ( min, max, receiver ) {
    var self = new Member( min, max );
    // If namespace provided setup references for recording interactions
    if ( receiver ) {
      // Store reference to receiver on each member instance
      self._mock = receiver;
      // Store reference to method in method list for reset functionality
      // <str>and potential strict execution order tracking<str>.
      receiver._methods && receiver._methods.push( self );
    }
    return self;
  }

  /* [Private]
   *
   * createMock( definition ) -> Boolean
   *  - mock (Mock): Mock instance to augment
   * - definition (JSON): JSON mapping of Mock expectations
   *
   *  Function which interprets a JSON mapping of a mock object interface (with expectations) and augments a Mock instance with them.
   *
   *  #### Example
   * <pre><code>
   *  new Mock({
   *    "foo": {
   *      accepts: "bar",
   *      returns: "baz"
   *    }
   *  })
   *  </code></pre>
   *
   *  * See JSON tests or wiki for more in-depth patterns.
   * 
   **/
  function createMock ( mock, definition ) {

    if ( typeof mock.expects === "undefined" || definition != null ) {
      throw new Error("createMock() requires a valid mock object and defintion JSON mapping");
    }

    var blacklisted = /^(?:calls|min|max)$/; // List of method/property identifiers that are used in Qmock - protected.

    // loop through expected members on mock
    for ( var key in definition ) {

      var memberConfig = definition[ key ],
          isMethod = !!( memberConfig["value"] === undefined ),

      // register property or method onto mock interface
      member = this
        .expects
          .apply(member,
            (memberConfig.calls !== undefined)
              ? [memberConfig.calls]
              : [ (memberConfig.min) ? memberConfig.min : 0,
                  (memberConfig.max) ? memberConfig.max : Infinity ]
              )[( isMethod ) ? "method" : "property"](key);

      // Set expectations for method or value of property
      if ( isMethod ) {

        setExpectations:
          for (var expectation in memberConfig) {

          // Check property exists on mock object and is a callable method
          if ( (member[expectation] !== undefined)
            && (member[expectation].constructor === Function) ) {

            // Disco.
            member[ expectation ][
              ( (expectation === "interface" || expectation === "accepts")
              && !isNot( "Array", memberConfig[ expectation ] ))
                ? "apply"
                : "call"
            ](member, memberConfig[ expectation ]);

          } else if ( blacklisted.test( expectation ) ) {
            // If not callable check property not whitelisted before throwing error
            //throwMockException("Identifier for method on new Mock instance", "Mock." + member["name"] + "[" + expectation + "]", "InvalidMockInstanceMethodException", member["name"] + '.' + expectation);
          }

        } // end setExpectations loop

      } else {
        // If expectation not method then simply set property
        member.withValue(memberConfig["value"]);
      }

    }
    return mock;
  }

  // EXERCISE PHASE functions

  /* [Private]
   *
   * exerciseCallbacks(presentation, method) -> Boolean
   *  - mock (Mock | Member): mock object to exercise callbacks on
   *  - presentation (Array | Collection): Presentation made / to be made to mocked method
   * 
   * If the presentation made to the mock object interface contains a function object, then the
   *  presentation is tested for a matching 'data' expectation on the mocked method instance.
   *
   *  If a match is found then the canned data parameters are passed to what is assumed to be callback and it is invoked.
   *
   *  This is mostly used to simulate ajax or event callbacks during an exercise phase.
   * 
   **/
  function exerciseCallbacks ( mock, presentation ) {
    // Execute any callback functions specified with associated args
    for (var i = 0, len = presentation.length, data; i < len; i++) {
      // Check if potential callback passed
      if ( presentation[ i ] && is( "Function", presentation[ i ] ) ) {
        // Test for presentation match to expectations, and assign callback data if declared
        // Use data associated with presentation, or default to 'global' data if available
        data = comparePresentation( mock, presentation, "data" ) || mock._data;
        //
        if ( data != null ) {
          presentation[ i ].apply( null, data );
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
   *  - mock (Mock | Member): mock object to exercise return
   *  - presentation (Array | Collection): Presentation made / to be made to mocked method
   *
   *  Function tests presentation against mock object interface expectations.
   *
   *  If match found then lookup is made for a corresponding 'returns' property. If not found then
   *  catch-all 'return' value is returned, which defaults to 'undefined' (as per spec).
   * 
   **/
  function exerciseReturn ( mock, presentation ) {
    return comparePresentation( mock, presentation, "returns" ) || mock._returns;
  }

  // TODO: Either abstract this out or simplify

  /* [Private]
   *
   * createException( actual, expected, exceptionType, identifier ) -> Object
   *  - actual (Object): The presentation received by the mock interface
   *  - expected (Object): Expectations set on the mock object
   *  - exceptionType (String): Exception type
   *  - identifier (String): Identifier for mock instance
   *
   * returns Object literal with pertinent information regarding the error caused.
   *
   **/
  function createException ( actual, expected, exceptionType, identifier ) {

    var e = {
        type : exceptionType
      },
      fn = "'" + identifier + "'";

    switch (true) {
      case "IncorrectNumberOfArgumentsException" === exceptionType:
      case "MismatchedNumberOfMembersException" === exceptionType:
        e.message = fn + " expected: " + expected + " items, actual number was: " + actual;
        break;
      case "IncorrectNumberOfMethodCallsException" === exceptionType:
        e.message = fn + " expected: " + expected + " method calls, actual number was: " + actual;
        break;
      case "MissingHashKeyException":
        e.message = fn + " expected: " + expected + " key/property to exist on 'actual' object, actual was: " + actual;
      default:
        e.message = fn + " expected: " + expected + ", actual was: " + actual;
    }
    return e;
  }


  // VERIFY PHASE functions

  /**
    *
    * QMock#verifyInvocations( method ) -> Boolean
    * - method (Mock | Method): mock object to test
    *
    * Evaluates if amount of times a mock object (method/constructor) has been invoked matches expectations
    *
    **/
  function verifyInvocations ( mock ) {
    return ( mock._minCalls == null )
      // No inovation expectations so result is true.
      ? true
      // If one expression below true then return else expectations not met so false
      : (
        // explicit call number defined
        mock._minCalls === mock._calls
        // arbitrary range defined
        || ( mock._minCalls <= mock._calls ) && ( mock._maxCalls >= mock._calls )
        // at least n calls
        || ( mock._minCalls < mock._calls ) && ( mock._maxCalls === Infinity ) );
  }

  /**
    * QMock#verifyOverloading( method ) -> Boolean
    * - method (Mock | Method): mock object to test
    *
    * Evaluates if number of parameters passed to mock object falls below / exceeeds expectations
    *
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
    * QMock#verifyPresentation( presentation, expectations[, overload] ) -> Boolean
    *  - mock (Mock | Member): mock object to test against
    *  - presentation (Array | Collection): Presentation made / to be made to mock object interface
    *
    * Evaluate a single presentation against all mock object interface expectations. Single match equals true.
    *
    **/
  function verifyPresentation ( mock, presentation ) {
    if ( isCompare() ) {
      for (var i = 0, len = mock._expected.length, expected, result = true; i < len; i++) {
        // reset so that empty presentation and empty expectation return true
        // If no expectations then won't be reached... returns true.
        result = false;

        // expectation to compare
        expected = mock._expected[ i ].accepts;

        // If overloading allowed only want to check parameters passed-in (otherwise will fail)
        // Must also trim off overloaded args as no expectations for them.
        if ( !!mock._overload ) {
          presentation = trimCollection( presentation, expected );
          expected  = trimCollection( expected, presentation );
        }

        // Else if overloading disallowed just pass through expected and actual
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
    * QMock#verifyInterface( mock [, raise] ) -> Boolean
    *  - mock (Mock | Member): mock object to test
    *  - raise (Function): Function to handle false comparison results
    *
    * Evaluate *all* presentations made to mock object interface against all mock interface expectations.
    * Each presentation must match an expectation. If no match and optional error handler passed then error raised.
    *
    **/
  function verifyInterface ( mock, raise ) {
    // For each presentation to the interface...
    for (var params = 0, total = mock._received.length, result = true; params < total; params++) {
      // ...Check if a matching expectation
      result &= verifyPresentation( mock, mock._received[ params ] );
      // Record which presentations fail
      if ( !!!result ) {
        raise && raise( mock._received[ params ], mock._expected, "IncorrectParameterException", mock._id + '()' );
      }
    }
    return !!result;
  }

  /**
    * QMock#verifyReceiver( receiver [, raise] ) -> Boolean | Exception
    *  - receiver (Mock): mock / receiver object to test
    *  - raise (Function): Function to handle false comparison results
    *
    * Verifies the receiver object (the parent mock object) first, then individual members.
    * Only passes if whole object tree passes, else throws exception (fail fast).
    *
    **/
  function verifyReceiver ( receiver, raise ) {
    // Verify Self (Constructor)
    var result = Member.prototype.verify.call( receiver, raise );

    // Verify Members
    for (var i = 0, len = receiver._methods.length; i < len; i++) {
      result &= receiver._methods[ i ].verify( raise );
    }

    // Live() or Die()
    if ( !!!result ) {
      // Pants.
      throw receiver._exceptions;
    } else {
      // WIN.
      return !!result;
    }
  }

  // TEARDOWN

  /**
    * QMock#resetReceiver( receiver ) -> Boolean
    *  - receiver (Mock): mock / receiver object to reset
    *
    * Resets internal state of the receiver mock object to before any interaction occurred.
    *
    **/
  function resetReceiver ( receiver ) {
    receiver._exceptions = [];
    Member.prototype.reset.call( receiver );
    for (var i = 0, len = receiver._methods.length; i < len; i++) {
      receiver._methods[ i ].reset();
    }
    return true;
  }

  /**
   * == Method API ==
   * Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
   **/

  /** section: Method API
   * class Mock
   * Main Stub, or mocked method class
   *
   *  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
   **/

  /**
   * new Mock( [ min = 0 ] [, max = null ] )
   * - min (Number): Miniumum number of times mocked method should be called. If max parameter not
   *  passed then number becomes a 'strict' invocation expectation (even zero).
   *  - max (Number): Maximum number of times mocked method should be called. If want 'at least N'
   *  then just pass Infinity
   *
   *  Constructor for mocked method and property members.
   * 
   **/
  function Member ( min, max ) {
    // Default mock behaviours
    this._returns = undefined;
    this._requires = 0;
    this._overload = true;
    this._chained = false;
    this._data = null;
    // Default mock expectations
    this._expected = [];
    this._received = [];
    this._minCalls = min || null;
    this._maxCalls = max || null;
    this._calls = 0;
  };

  Member.prototype = {

    "name": function ( identifier ) {
      this._id = identifier;
      return this;
    },

    "method": function ( key ) {
      // Throw error if collision with Member API
      if ( hasOwnProperty.call( this._mock, key ) ) {
        throw {
          type: "InvalidMethodNameException",
          msg: "Qmock expects a unique identifier for each mocked method"
        };
      }

      // Useful for error messages / debugging
      this._id = key;

      // Register public interface to mocked method instance on target object
      this._mock[ key ] = createStub( this );

      // chain for pretty declaration
      return this;
    },

    // Expected format of arguments - {accepts: [ values ] [, returns: value] [, data: [ values ]] }
    "interface": function () {
      // Check for valid input to interface
      for (var i = 0, len = arguments.length; i < len; i++) {
        var acceptsProperty = arguments[ i ][ "accepts" ] || false; // attach hasOwnProperty check.
        if ( acceptsProperty === false ) {
          throw {
            type: "MissingAcceptsPropertyException",
            msg: "Qmock expects arguments to setInterfaceExpectations() to contain an accepts property"
          }
        } else if ( isNot( "Array", acceptsProperty ) ) {
          throw {
            type: "InvalidAcceptsValueException",
            msg: "Qmock expects value of 'accepts' in arguments to be an Array (note true array, not array-like)"
          }
        }
      }

      // Set minimum expectations
      this._requires = arguments[ 0 ][ "accepts" ].length;

     // TBD: Support for different requires per expected presentation
     // Assign explicit expectation if exist
     /* for ( var i = 0, len = arguments.length; i < len; i++ ) {
        if ( !arguments[ i ][ "required" ] ) {
          arguments[ i ][ "required" ] = arguments[ i ][ "accepts" ].length;
        }
      }*/
      this._expected = arguments;
      return this;
    },

    "accepts": function () {
      this._requires = arguments.length;
      this._expected.push( { "accepts" : slice.call( arguments ) } );
      return this;
    },

    "returns": function ( obj ) {
      this._returns = obj; // default is undefined
      return this;
    },

    "required": function ( num ) {
      this._requires = num;
      return this;
    },

    "overload": function ( bool ) {
      this._overload = bool;
      return this;
    },

    "data": function () {
      this._data = arguments;
      return this;
    },

    "property": function ( key ) {
      if ( hasOwnProperty.call( this._mock, key ) ) {
        throw {
          type: "InvalidPropertyNameException",
          msg: "Qmock expects a unique key for each stubbed property"
        };
      }
      this._mock[ key ] = "stub";
      return this;
    },

    "withValue": function ( value ) {
      for ( var key in this._mock ) {
        if ( hasOwnProperty.call( this._mock, key ) ) {
          if ( this._mock[ key ] === "stub" ) {
            this._mock[ key ] = value;
          }
        }
      }
      return this;
    },

    "chain": function () {
      this._returns = this._mock;
      return this;
    },

    "andExpects": function ( min, max ) {
      return this._mock.expects( min, max );
    },

    "reset": function () {
      this._calls = 0;
      this._received = [];
    },

    "verify": function ( raise ) {
      // 1. Check number of method invocations if set
      if ( verifyInvocations( this ) ) {
        // If true and no calls then exclude from further interrogation
        if ( this._calls === 0 ) {
          return true;
        }
      } else {
        raise && raise( this._calls, this._minCalls, "IncorrectNumberOfMethodCallsException", this._id );
        return false;
      }

      // 2. Check number of parameters received
      // TBD: This doesn't seem to support multiple presentations to an interface? Checks 'global' _received
      // See if any paramters actually required, if so, verify against overloading behaviour
      if ( this._requires && verifyOverloading( this ) ) {
        raise && raise( this._received[ 0 ].length, this._expected.length, "IncorrectNumberOfArgumentsException", this._id );
        return false;
      }

      // 3. Assert all presentations to interface
      return verifyInterface( this, raise );
    },

    atLeast: function ( num ) {
      this._minCalls = num;
      this._maxCalls = Infinity;
      return this;
    },

    noMoreThan: function ( num ) {
      this._maxCalls = num;
      return this;
    },

    calls: function ( min, max ) {
      this._minCalls = min || this._minCalls;
      this._maxCalls = max || this._maxCalls;
    },

    end: function () {
      return this._mock || this;
    }

  }; // End MockedMember.prototype declaration

  // Backward compatibility for QMock v0.1 API
  Member.prototype["withArguments"] = Member.prototype.accepts;
  Member.prototype["andReturns"] = Member.prototype.returns;
  Member.prototype["andChain"] = Member.prototype.chain;
  Member.prototype["callFunctionWith"] = Member.prototype.data;

  // Receiver Object Constructor
  // Receiver's can either be simple namespaces-esque functions,
  // or full Constructor functions in their own right (a la jQuery $)
  /**
   * == Mock API ==
   * Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
   **/

  /** section: Mock API
   * class Mock < Member
   * Main Stub, or mocked method class
   *
   *  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
   **/

  /**
   * new Mock( [ definition ])
   * - definition (Hash):
   *
   *  Constructor for mocked method and property members.
   *
   **/

  function Receiver ( definition ) {

    // Create internal state
    var state = new Member,
    // Bind delegated stub invocation to Receiver instance state
        recorder = createStub( mock );

    function mock () {
      // Update Receiver instance state and return itself or explicit value
      return recorder.apply( null, arguments );
    }

    // Can't use receiver.prototype as function literal prototype not in prototype chain, e.g. a
    // lookup for (function () {}).foo goes to Function.prototype.foo (__proto__)
    // Pseudo-inheritance by copying values & references over to instance
    // Internal state is thus public, otherwise all methods on Member.prototype would
    // need manual scoping with .call() which too much of a dependency (and not future-proof)
    for ( var key in state ) {
      mock[ key ] = state[ key ];
    }

    // Augment with Receiver methods

    // Factory for creating new Members on receiver objects
    mock.expects = function ( min, max ) {
      return createMember( min, max, this );
    };

    // Overriding some 'inherited' methods
    // Verify method, tests both constructor and declared method's respective states.
    mock.verify = function () {
      return verifyReceiver( this, function () {
        mock._exceptions.push( createException.apply( null, arguments ) );
      });
    }

    // Reset method, resets both mock Constructor and associated mock member states
    mock.reset = function () {
      resetReceiver( this );
    };

    // Augment with Receiver properties

    // Update default return state on Constuctors to themselves (for cascade-invocation declarations)
    // If the return value is overidden post-instance then it is assumed the mock is a standalone
    // constuctor and not acting as a receiver object (aka namespace)
    mock._returns = mock;

    // Store methods declared on receiver
    mock._methods = [];

    // Store verification errors
    mock._exceptions = [];

    // Backward compatibility with QMock v0.1 API
    mock.expectsArguments = mock.accepts;
    mock.andExpects = mock.expects;

    // If params passed to Mock constructor auto-magikally create mocked interface from JSON tree
    // Else just return a fresh mock.
    return ( definition ) ? createMock( mock, definition ) : mock;
  }

  /** section: QMock API
   * QMock
   * lorem ipsum
   **/
  container.QMock = {
    config: config,

    /** alias of: Mock
     * QMock.Mock() -> receiver object
     **/

    Mock: Receiver,

    /** alias of: Member
     * QMock.Member() -> mock object
     **/

    Member: Member,
    verifyInvocations: verifyInvocations,
    verifyOverloading: verifyOverloading,
    verifyParameters: verifyPresentation,
    verifyAllParameters: verifyInterface,
    verifyMock: verifyReceiver,
    resetMock: resetReceiver,
    resetMethod: function ( method ) {
      method.reset();
    },
    is: is,
    isNot: isNot,
    testParameters: comparePresentation
  };

  // Alias QMock.Mock for pretty Mock initialisation 
  // (i.e. new Mock( [Definition {}] )
  container.Mock = Receiver;
  container.Stub = Member;

  // Expose internal methods for unit tests
  /*if ( undefined !== expose ) {
    // mock generator
    ;;;; assert.expose( createMockFromJSON, "_createMockFromJSON", MockConstructor );
  }*/

  // QMock was successfully initialised!
  return true;

// if exports available assume CommonJS
})( (typeof exports !== "undefined") ? exports : this );