 /**
 * QMock - Copyright (c) 2008
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * @author Mark Meyer // Andy Beeching
 * @classDescription qMock is a lightweight object mocking library
 * @dependencies None - free as a bird
 * @example var mock = new Mock();
 *
 * TODO: Support multiple callbacks with correlating arguments
 * TODO: Optional strict method ordering flag? e.g. {ordered: true}
 * TODO: Document Mock object (plus Method) API
 * TODO: Add 'Collection' Argument for DOM Manipulation
 * TODO: Skin testrunner
 * TODO: Add scriptDoc support for instance methods and IDE completion
 * TODO: Support for custom exceptions?
 * TODO: Force array literals in params via JSON
 * TODO: Strict flag for argument literal checking...
 * TODO: Expectations on invocations to go through calls only - ditch syntactic sugar...
 * TODO: Support for HTMLCollections, nodeLists?
 * TODO: Support for DOM Element References
 * TODO: Refactor out strict type checking function into unit testable privileged object.
 * TODO: Better support for multiple parameter error messages.
 * TODO: Decide how to flag overload vs strict argumement NUMBER check
 * TODO: Ensure support for all major testruners - QUnit/YUI/GOOG/Evidence/ScrewUnit/JsSpec..
 * TODO: Figure out a way to re-use mockedMember constructor wih mock constructors...SERIOUSLY NEED THIS, Constuctor features are messy as f*ck.
 * TODO: Refactor out object checking logic and make leaner....
 * TODO: Make code more readable with if (key in obj) notation... (rather than if(obj[key]))...
 * TODO: Question use of Constructor flag exception object? Really needed if execption thrown has enough detail? Or refactor as propert on exception thrown? e.g. e.objectType: "Constructor", "Method".
 * TODO: Add in optimisations for compilers like YUI & Google Closure.
 * TODO: add a end() utility function for restoration of scope to Mock obj (instead of member)
 * TODO: Look into dynamic generation of mocks based on code lib, and or pdoc comments? Mental.
 * TODO: Refactor conditionals with short-circuit evaluation...
 * TODO: Strict return support for single expected presentations? Too complex?
 * TODO: Protect against API collisions between QMock and Mocks through internal re-mapping (can I not just invoke directly off prototype chain?)
 * TODO: Extend callback parameter invocation to support multiple callback scenarios
 * TODO: Write simple helper function to test valid stuff in loops
 * TODO: Early exclusions via returns
 * TODO: Need to look into using getPrototypeOf method for object type checking...
 * TODO: Does assertHash check keys as well as values??!
 * TODO: Check able to delete QMock for clean-up purposes?
 * TODO: Add in support for NaN data type
 * TODO: Check whether my assertHash handles {DontEnum} enumeration...!
 * TODO: Group QUnit tests into sub-modules?
 * TODO: Support for identifiers.. might wait until refactor of all constructor/methods to subclassed mockMember instances.
 * TDOO: Support for classical, protypical, & parasitic inheritance instance checking
 * TODO: Double check inheritance properties of instanceof - plus support for 'interface' conformance as well?
 * TODO: Patch QUnit to support a sentence like: 700 tests of 702 run passed, 2 failed and 150 weren't run.
 * TODO: Change behaviour of the mock so that when passed functions it matches by type (for literals and constructors)
 * TODO: Change expose function to accept list of expected methods (e.g. get, set, reset - save memory!)
 * TODO: Add ability for desciptor on Mock Constructors
 * TODO: Make autoMockConstructor thing work for constructors (i.e. call)
 * Refactor hasOWnProperty into method()
 * TODO: Allow deep option for recursing through trees - typed or stric (or even varied?)
 * TODO: Publish CommonJS compliant API for ASSAY

 */

///////////////////////////////////

// START of QMOCK

/*
 * QMock requires a comparison routine for all object types (e.g. QUnit.equiv, assert.deepEquals, or Assay.compare)
 * CommonJS assert interface offers a quasi-standard to adhere to for both test runners and matchers
 *
*/

//////////////////////////////////

// Implied Global
var Mock = Mock || (function () {

  /**
  * Helpers - Protected
  */

  // Really this is ultra defensive but since undefined is used in parameter verification code let's be sure it actually is typeof "undefined".
  var undefined,
      slice = Array.prototype.slice,
      toString = Object.prototype.toString,
      // ....
      _Utils = {
        // Utilising the 'Miller Device'
        // http://www.caplet.com/ (Mark Miller's (of the Google) website)
        // http://profiles.yahoo.com/blog/GSBHPXZFNRM2QRAP3PXNGFMFVU?eid=fam48bo6nChhLpXTWLYuo2PoctbJjTIo34SjoLBF9VV3glXt.w#comments
        // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
        // http://gist.github.com/47997
        // http://zaa.ch/1q
        // http://groups.google.com.au/group/comp.lang.javascript/browse_frm/thread/368a55fec19af7b2/efea4aa2d12a3aa4?hl=en&lnk=gst&q=+An+isArray+test+(and+IE+bugs)+#efea4aa2d12a3aa4
        // Similar to QUnit.is()
        // Function name can't be can't be typeof or typeOf because Safari barfs on
        // the reserved word use.  Non-IE browsers report the browser object classes
        // in the toString e.g. '[object HTMLDivElement]', but IE always returns
        // '[object Object]' for DOM objects and methods because they are COM objects
        type: function ( obj ) {
          // Don't add string checks for undefined/null as easy to get false positives with other unknown objects
          var TYPES = {
            "[object Number]"   : "number",
            "[object Boolean]"  : "boolean",
            "[object String]"   : "string",
            "[object Function]" : "function",
            "[object RegExp]"   : "regexp",
            "[object Array]"    : "array",
            "[object Date]"     : "date",
            "[object Error]"    : "error"
          };

          return ( obj === undefined )
            ? "undefined"
            : TYPES[ toString.call( obj ) ]
              || ( obj ? "object" : "null" );
        }
      };

  // Check for required interface
  /*if ( !compare || _Utils.type( compare ) !== "function" ) {
    return false;
  }*/


  // PRIVATE static methods

  // Function to handle JSON based mock creation
  function createMockFromJSON ( mockedMembers ) {

    if ( !mockedMembers ) { return false; }

    var blacklisted = /^(?:calls|min|max)$/; // List of method/property identifiers that are used in Qmock - protected.

    // loop through expected members on mock
    for ( var key in mockedMembers ) {

      var memberConfig = mockedMembers[key],
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
              && memberConfig[ expectation ].constructor === Array)
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
    return undefined;
  }

  // Function to build pretty exception objects - TBR function signature
  // Can be improved by using Assay.type for expected and actual
  // function createException ( exceptionType, objName, expected, actual ) {
  function createException ( actual, expected, exceptionType, descriptor ) {

    var e = {
        type : exceptionType
      },
      fn = "'" + descriptor + "'";

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

  // PUBLIC MOCK OBJECT CONSTRUCTOR
  function MockConstructor () {

    var mock = function MockObject () {
          // Can't use MockObject fn name, dies in IE <<< Changed to be ES5 compatible - test in IE!!
          MockObject.actualArguments = slice.call(arguments); // Need to be normalised to same object type (since arguments don't share prototype with Arrays, thus would fail CommonJS deepEquals assertion)
          return MockObject;
        },
        methods = [], // List of MockedMember method instances declared on mock
        exceptions = []; // List of exceptions thrown by verify/verifyMethod functions,
        //"'Constructor' (#protip - you can pass in a (String) when instantiating a new Mock, which helps inform constructor-level error messages)";

    // Function to push arguments into Mock exceptions list
    function throwMockException () {
      exceptions.push( createException.apply( null, arguments ) );
    }

    // CONSTRUCTOR for mocked methods
    function MockedMember ( min, max ) {
      this.name = "";
      this.expectedCalls = ( min !== undefined ) ? min : false;
      this.maxCalls = max || false;
      this.actualCalls = 0;
      this.expectedArgs = [{"accepts": [undefined]}];
      this.actualArgs = [];
      this.callbackArgs = [];
      this.requiredNumberofArguments = false;
      this.allowOverload = true;
      this.returnValue = undefined;
      this.strictValueChecking = false;
      // Store reference to method in method list for reset functionality <str>and potential strict execution order tracking<str>.
      methods.push(this);
    };

    MockedMember.prototype = {

      "method": function ( name ) {

        // Throw error if collision with mockMember API
        if (mock[ name ] !== undefined) {
          throwMockException("was reserved method name '" + name + "'", "a unique method name", "InvalidMethodNameException", "Constructor function");
          throw exceptions;
        }

          // Register public interface to mocked method instance on mock klass, bind to curried function
          mock[ name ] = (function ( method, name ) {

          method[ "name" ] = name;

          function getState () {
            return method;
          }

          // Invoked when mock is called within SUT object.
          function updateMethodState () {

            // Normalise Arguments
            var parameters = slice.call( arguments );

            // Track method invocations
            method.actualCalls++;

            // Store method call params for verification
            method.actualArgs.push( parameters );

            // Execute any callback functions specified with associated args.
            for (var i = 0, len = parameters.length; i < len; i++) {
              if (parameters[i] && parameters[i].constructor === Function) {
                  parameters[i].apply( null, method.callbackArgs );
              }
            }

            // Assert arguments against expected presentations and return appropriate object
            return ( function getReturnValue ( presentation ) {

              // Make default return value the default method value (undefined || Object || self (mock - chained))
              var obj = method.returnValue;

              // Compare actual with expected arguments and if true return correct object
              assertingPresentations:
                for ( var i = 0, len = method.expectedArgs.length; i < len; i++ ) {

                  try {
                    if ( compare(
                          method.expectedArgs[i]["accepts"], // 'expected' inputs
                          presentation // 'actual' inputs
                        )
                    ) {
                      // If match found against presentation return bound object (or self if chained)
                      obj = (method.returnValue && method.returnValue === mock)
                        ? mock
                        : ( "returns" in method.expectedArgs[i] )
                          ? method.expectedArgs[i]["returns"]
                          : method.returnValue;
                    }
                  } catch (e) {
                    if ( e[0] && e[0].type === "MissingHashKeyException" ) {
                      continue assertingPresentations;
                    }
                  }

              }

              return obj;

           })( parameters )}

           updateMethodState._getState = getState;

           return updateMethodState;

          })( this, name );

        // chain
        return this;

      },

      "interface": function setInterfaceExpectations () {
        // Check for valid input to interface
        for (var i = 0, len = arguments.length; i < len; i++) {
          var acceptsProperty = arguments[ i ][ "accepts" ] || false; // attach hasOwnProperty check.
          if ( acceptsProperty === false ) {
            throw {
              type: "MissingAcceptsPropertyException",
              msg: "Qmock expects arguments to setInterfaceExpectations() to contain an accepts property"
            }
          } else if ( _Utils.type( acceptsProperty ) !== "array" ) {
            throw {
              type: "InvalidAcceptsValueException",
              msg: "Qmock expects value of 'accepts' in arguments to be an Array"
            }
          }
        }

        // Expected format of arguments - {accepts: [], returns: value}

        // Where arguments can equal either any type, or overloadable pairings.
        // e.g. "string" or {params: foo, returns: bar}. Note array literals must be nested ({params: ["string", [1,2,3]], returns: "meh"})
        // Normalize input to accepts into key/value expectation pairings

        // THIS NEEDS A DEBATE - DEFAULT IS FOR IMPLICT STRICT NUMBER OF, & VALUE OF, ARG CHECKING FOR 'PRESENTATIONS'.
        // If required number of arguments not already set, then implicitly set it to length of param array (so let ppl customise it)
        // Add in per presentation strict argument length unless already set either globally or locally (recommendation to keep it consistent locally - don't let mocks change behaviour in test group too much)
        // This should probably be part of the refactor... feels messy!
        if ( this.requiredNumberofArguments === false ) {

          // Set minimum expectations
          this.requiredNumberofArguments = arguments[ 0 ][ "accepts" ].length;

          // Assign explicit expectation if exist
          for ( var i = 0, len = arguments.length; i < len; i++ ) {
            if ( !arguments[ i ][ "required" ] ) {
              arguments[ i ][ "required" ] = arguments[ i ][ "accepts" ].length;
            }
          }
        }
        this.expectedArgs = arguments;
        return this;
      },

      "accepts": function setSingleInterfaceExpectation () {
        this.requiredNumberofArguments = arguments.length;
        this.expectedArgs = [ { "accepts" : slice.call( arguments, 0 ) } ];
        return this;
      },

      "returns": function ( stub ) {
        this.returnValue = stub; // default is undefined
        return this;
      },

      "required": function ( requiredArgs ) {
        this.requiredNumberofArguments = requiredArgs;
        return this;
      },

      "overload": function ( isOverload ) {
        this.allowOverload = isOverload;
        return this;
      },

      "strict": function () {
        this.strictValueChecking = true;
        return this;
      },

      "property": function ( name ) {
        if ( mock[ name ] !== undefined ) {
          throwMockException( "should be unique (was " + name + ")", "undefined property name", "InvalidPropertyNameException", "Constructor function" );
          throw exceptions;
        }
        mock[ name ] = "stub";
        return this;
      },

      "withValue": function ( value ) {
        for ( property in mock ) {
          if ( mock.hasOwnProperty( property ) ) {
            if ( mock[ property ] === "stub" ) {
              mock[ property ] = value;
            }
          }
        }
        return this;
      },

      "callFunctionWith": function () {
        // Callback function arguments - useful for async requests
        this.callbackArgs = arguments;
        return this;
      },

      "chain": function () {
        return this.returnValue = mock;
      },

      "andExpects": function ( calls ) {
        return mock.expects( calls );
      },

      "verifyMethod": function () {
        assertMethod:
          with (this) {
           // Evaluate expected method invocations against actual
           assertMethodCalls:
             switch ( expectedCalls !== false ) {
               // max is infinite
               case (maxCalls === Infinity) && (actualCalls > expectedCalls):
               // arbitrary range defined
               case (maxCalls > 0) && (actualCalls >= expectedCalls) && (actualCalls <= maxCalls):
               // explicit call number defined
               case (expectedCalls === actualCalls):
                 // Return verifyMethod early if no args to assert.
                 if (actualCalls === 0) {
                   return;
                 } else {
                   break assertMethodCalls;
                 }
               default:
                 throwMockException( actualCalls, expectedCalls, "IncorrectNumberOfMethodCallsException", name);
                 break assertMethod;
             }

          // assert presentations.... LET's DO THAT AFTERWARDS...IN fact more like a loop around the old atomic presentation checking mechanism...

          // Evaluate method interface expectations against actual
          assertInterface: switch ( true ) {
            // Strict Arg length checking - no overload
            case ( allowOverload === false) && ( requiredNumberofArguments !== false ) && ( requiredNumberofArguments !== actualArgs[0].length ):
            // At least n Arg length checking - overloading allowed - Global check
            case ( allowOverload === true) && ( requiredNumberofArguments !== false ) && ( requiredNumberofArguments > actualArgs[0].length )  :
              throwMockException( actualArgs.length, expectedArgs.length, "IncorrectNumberOfArgumentsException", name );
              break assertMethod;

            default:
              (function () {

              // Only check arguments if some available or explicitly required
              // By default functions returned 'undefined'
              // This feels hacky also... refactor out if possible!
              if ( requiredNumberofArguments !== false || ( actualCalls > 0 && actualArgs[0].length > 0 ) ) {

                assertPresentations: // For each presentation to the interface...

                  for (var i = 0, len = actualArgs.length; i < len; i++) {

                    // Use to restore exceptions object to pre-presentation assertion state in case of match
                    var cachedExceptionTotal = exceptions.length;

                    assertExpectations: // ...Check if a matching expectation

                      for (var j = 0, _len = expectedArgs.length; j < _len; j++) {

                        // Assert Number of Arguments if expectation explicitly set...
                        // At least n Arg length checking - overloading allowed - Global check
                        if ( expectedArgs[ j ][ "required" ] > actualArgs[ i ].length )  {
                          throwMockException( actualArgs.length, expectedArgs.length, "IncorrectNumberOfArgumentsException", name );
                          continue assertPresentations;
                        }

                        var actual = ( allowOverload === false && requiredNumberofArguments !== false )
                                   ? actualArgs[ i ]
                                   // Else assume default mode of overloading and type checking against method interface
                                   : slice.call(actualArgs[ i ], 0, expectedArgs[ j ][ "accepts" ].length),
                            expected = ( allowOverload === false && requiredNumberofArguments !== false )
                                     ? expectedArgs[ j ][ "accepts" ]
                                     // Else assume default mode of overloading and type checking against method interface
                                     : slice.call(expectedArgs[ j ][ "accepts" ], 0, actualArgs[ i ].length);

                        // If a match (strict value checking) between a presentation and expectation restore exceptions object and assert next interface presentation.
                        // If strict argument total checking is on just pass through expected and actual
                        if ( compare( actual, expected ) ) {
                              /*,
                              {
                                "strictValueChecking": strictValueChecking, // done automatically for 'values', follow CommonJS assertion logic for non-primitves / date objects
                                "exceptionType": (strictValueChecking) ? "IncorrectArgumentValueException" : "IncorrectArgumentTypeException", // Mmm, yes and no
                                "exceptionHandler": throwMockException, // This seems like a flawed concept?
                                "descriptor": name + '()', // We have this information to build up part of a meaningful error msg
                                "delegate": true, // this can be part of curried fn
                                "typed": true // this can be part of curried fn
                              }*/
                              // If match remove exceptions raised during checks and move on to next presentation.
                              exceptions = exceptions.splice(0, cachedExceptionTotal);
                              continue assertPresentations;
                            } else {
                              throwMockException( actual, expected, (strictValueChecking) ? "IncorrectParameterException" : "IncorrectParameterException", name + '()' )
                            }

                      } // end assertExpectations loop
                  } // end assertPresentations loop
                }
              }).call(this);
            } // end assertInterface
          } // end assertMethod
      },

      atLeast: function (n) {
        this.expectedCalls = n;
        this.maxCalls = Infinity;
        return this;
      },

      noMoreThan: function (n) {
        this.maxCalls = n;
        return this;
      }

    }; // End MockedMember.prototype declaration

    // Backward compatibility for QMock v0.1 API
    MockedMember.prototype["withArguments"] = MockedMember.prototype.accepts;
    MockedMember.prototype["andReturns"] = MockedMember.prototype.returns;
    MockedMember.prototype["andChain"] = MockedMember.prototype.chain;

    // PUBLIC METHODS on mock
    // Creates new MockedMember instance on Mock Object and sets-up initial method expectation
    mock.expects = mock.andExpects = function mockExpectsNewMethod (min, max) {
      return new MockedMember(min, max);
    };

    mock.accepts = function mockExpectsArguments () {
      mock.expectsArguments = slice.call(arguments);
      return mock;
    };

    mock.actualArguments = []; // Stub, used for symbol binding
    mock.strictValueChecking = false; // Default is type checking

    mock.strict = function mockExpectsStrictParameterValues () {
      mock.strictValueChecking = true;
      return mock;
    };

    // Verify method, tests both constructor and declared method's respective states.
    mock.verify = function verifyMock () {

      // Check Constructor Arguments
      if ( mock.expectsArguments.push ) {
        if ( mock.expectsArguments.length !== mock.actualArguments.length ) {
          // Thrown in to satisfy tests (for consistency's sake) - NEEDS TO BE REFACTORED OUT!
          throwMockException( mock.actualArguments.length, mock.expectsArguments.length, "IncorrectNumberOfArgumentsException", "Constructor function" );
        } else if ( !compare( mock.actualArguments, mock.expectsArguments ) ) {
          throwMockException( mock.actualArguments, mock.expectsArguments, "IncorrectParameterException", "Constructor function" );
            /*{
              "strictValueChecking": mock.strictValueChecking,
              "exceptionHandler": throwMockException,
              "delegate": true,
              "descriptor": "Mock Constructor",
              "typed": true
            }*/
        }
      }

      // Verify Mocked Methods
      for (var i = 0, len = methods.length; i < len; i++) {
        methods[ i ].verifyMethod();
      }

      // Moment of truth...
      if (exceptions.length !== 0) {
        throw exceptions; // D'OH! :(
      } else {
        return true; // WIN! \o/
      }
    };

    // Resets internal state of Mock instance
    mock.reset = function resetMock () {
      exceptions = [];
      this.actualArguments = [];
      for (var i = 0, len = methods.length; i < len; i++) {
        methods[ i ].actualCalls = 0;
        methods[ i ].actualArgs = [];
      }
    };

    // Backward compatibility for QMock v0.1 API
    mock.expectsArguments = mock.accepts;

    // If params passed to Mock constructor auto-magikally create mocked interface from JSON tree.
    if ( typeof arguments[ 0 ] === "object" ) {
      createMockFromJSON.call( mock, arguments[ 0 ] );
    }

    // On my command, unleash the mock! :-)
    return mock;

  }

  // PUBLIC static members on Mock class

  // Version number
  MockConstructor["version"] = "0.3";

  // Expose internal methods for unit tests
  /*if ( undefined !== expose ) {
    // mock generator
    ;;;; assert.expose( createMockFromJSON, "_createMockFromJSON", MockConstructor );
  }*/

  // QMock was successfully initialised!
  return MockConstructor;

})( QUnit.equiv );

// CommonJS export
if ( typeof exports !== "undefined" ) {
  exports.Mock = Mock;
}