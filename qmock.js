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
 */

(function initialiseQMock (Mock, container) {
  
  /**
  * Helpers - Protected
  */
  
  // So Dmitry Baranovskiy doesn't shout at me ([O:O]) - http://sitepoint.com/blogs/2009/11/12/google-closure-how-not-to-write-javascript/
  // Really this is ultra defensive but since undefined is used in parameter verification code let's be sure it actually is typeof "undefined".
  var undefined,
    slice = [].slice;
    
  // Allow pass-through argument checking
  // Either reference static member off Mock class (Mock.Variable), or alias - e.g. var Selector = Mock.Variable;
  function Variable () {};
  
  // PRIVATE static methods
  
  // Function to expose private objects on a target object for testing (plus injection of mocks/stubs and reset functionality)
  function expose (obj, context, key) {
    
    var cachedObj = obj; // can this part be improved by one cache for all or many atomic caches?
    
    context[key] = {
      
      get: function() {
        return obj;
      },
      
      set: function() {
        obj = arguments[0] || null; 
      },
      
      restore: function() {
        obj = cachedObj;
      }
      
    }
  }
  
  // Function to handle JSON based mock creation
  function createMockFromJSON (mockedMembers) {
    
    if ( !mockedMembers ) { return false; }
    
    var propertyWhitelist = "calls min max"; // List of method/property identifiers that are used in Qmock - protected.

    // loop through expected members on mock
    for (var key in mockedMembers) {
      
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
      if ( true === isMethod ) {

        setExpectations:
          for (var expectation in memberConfig) {

          // Check property exists on mock object and is a callable method
          if ( (member[expectation] !== undefined) 
            && (member[expectation].constructor === Function) ) {

            // Disco.
            member[expectation][
              ( (expectation === "interface" || expectation === "accepts") 
              && memberConfig[expectation].constructor === Array)
                ? "apply"
                : "call"
            ](member, memberConfig[expectation]);

          // If not callable check property not whitelisted before throwing error
          } else if ( !!/propertyWhitelist/.test(expectation) ) {
            throwMockException("InvalidExpectationMethodCallException", member["name"] + '.' + expectation, "Key to mutator method on mockedMember object", name);
          }
  
        } // end setExpectations loop
      } else {
        // If expectation not method then simply set property
        member.withValue(memberConfig["value"]);
      }
    }
  }
  
  var assertObject = (function () {
    
    // PRIVATE Helper functions
        
    // Function to assert members of an object, returns Boolean
    function assertHash (expected, actual, opt_strictValueChecking, opt_exceptionType, opt_exceptionHandler) {
      var result = true;
      // Is this the correct check? Everything in JS is essentially a hash (as all derive from Object.prototype), except for falsy data types (undefined, null, NaN)?
      // Worth testing to see if absolutely generic (aka can enumerate over non object literal hashes)
      // What about DontEnum stuff? Sort of taken by hasOwnProperty, so what about checking inherited props? Or make clear in description really meant for object literals? If so, should text for object literal? How - Array trick-esque thingy?
      if ( expected && actual ) {
        
        checkingMembers:
          for ( var key in expected ) {
            // expectations don't support prototypical inheritance...
            if ( expected.hasOwnProperty(key) ) {
              // but actual values do (and also shadowed natives, e.g. toString as a key - see {DontEnum} tests)
              // We 'objectify' the 'actual' object as the in operator throws errors when executed against primitive values (e.g. key in "" --> key in Object("")))
              // We use the in operator as opposed to a dynamic lookup because in the case of an assigned falsy value to actual[key] the result is false (as opposed to true - the property does exist on the actual object)
              // in operator performs lookup resolution on [[Prototype]] chain
              // FF 3.6 won't eumerate function instance prototype property (https://developer.mozilla.org/En/Firefox_3.6_for_developers#JavaScript)
              if ( key in Object(actual) ) {
                result &= assertObject(expected[key], actual[key], opt_strictValueChecking, opt_exceptionType, opt_exceptionHandler);
              } else {
                opt_exceptionHandler && opt_exceptionHandler( "MissingHashKeyException", "assertHash", key, "not found on object" )
                result = false;
                continue checkingMembers;
              }
            }
          }
          
      }
      return !!result;
    }
    
    // Delegate function that asserts elements of a collection
    function assertCollection (expected, actual, opt_strictValueChecking, opt_exceptionType, opt_exceptionHandler, opt_identifier) {

      var result = true;

      // assertCollection interface checks
      if (arguments.length < 2) {
        throw {
          type: "MissingParametersException",
          msg: "assertCollection() requires at least an expected and actual parameter to be passed to interface"
        }
      } else if ( (!expected || expected.length === undefined) || (!actual || actual.length === undefined) ) {
        throw {
          type: "MalformedArgumentsException",
          msg: "assertCollection() requires the 'expected' and 'actual' collection parameters to be an Array-like collection"
        }
      }

      // assertCollection parameter checks
      if ( expected.length !== actual.length ) {
        opt_exceptionHandler && opt_exceptionHandler ('MismatchedNumberOfMembersException', opt_identifier || 'Function()', expected.length, actual.length )
        result = false;
      } else {

        // Only assert on absolute number of params declared in method signature as expectations don't exist for overloaded interfaces
        for (var i = 0, len = actual.length; i < len; i++) {
          // 1:1 assertion
          result &= assertObject ( expected[i], actual[i], opt_strictValueChecking, opt_exceptionType, opt_exceptionHandler );
        }
      }

      // Return a Boolean for recursive calls, exceptions handled in opt_exceptionsHandler.
      return !!result;
    }
    
    // Key function to test objects against each other.
    function assertObject (expected, actual, opt_strictValueChecking, opt_exceptionType, opt_exceptionHandler) {
            
      // Test whether expected is a constructor for native object types (aside from null // undefined)
      var expectedType = (expected !== null && expected !== undefined) ? expected.constructor : expected
        /*expectedType = (expected !== null && expected !== undefined) 
          ? ( expected.constructor === Function ) // but also matches function literals :-(
            ? expected
            : expected.constructor
              : expected,*/
        isValue = isRegExp = isCollection = false,
        strictValueChecking = opt_strictValueChecking || false,
        exceptionType = opt_exceptionType || ( strictValueChecking === true ? "IncorrectArgumentValueException" : "IncorrectArgumentTypeException"),
        // What happened to isNative fn?!? - see Kangax blog... damn me and my lack of self-documentation sometimes.
        nativeTypes = [Number, String, Boolean, Date, Function, Object, Array, RegExp, Variable],
        result = true,
        // WTF?
        identifier = "getClass()";
        
      function _compare (expected, actual, serialiser) {
        return ( expected && expected[serialiser] && expected[serialiser]() ) === ( actual && actual[serialiser] && actual[serialiser]() )
      }

      assertNativeType: 
        for (var i = 0, len = nativeTypes.length; i < len; i++) {
          if ( expected === nativeTypes[i] ) {
            expectedType = expected;
            break assertNativeType;
          }
        }
      
      // n.b. switch statements check by identity (aka strict === rather than ... ? See Nyman talk)
      switch(expectedType) {

        // Pass-through
        case Variable:
          break;

        // False (however unlikely) - compare by type
        case null:
        case undefined:
        // case NaN: TBD
          if ( expected !== actual ) {
            opt_exceptionHandler && opt_exceptionHandler(exceptionType, identifier, expected, actual);
            result = false;
          }
          break;
          
        // Primitives (plus Date) - compare by prototype or value (where strictValue === true)
        case Date:
        case Number:
        case String:
        case Boolean:
          // set Primitive flag
          isValue = true;
          
        default:

          // set RegExp flag
          if ( expectedType === RegExp ) {
            isRegExp = true; 
          }
          
          // set collection flag
          // We use hasOwnProperty() because a lookup a force to Boolean lookup generates false positives (e.g. 0), and the 'in' operator crawls the prototype chain
          if ( expected.hasOwnProperty && expected.hasOwnProperty('length') ) {
            isCollection = true;
          }
        
        
          // Let's make sure the types match first of all...
          // If not strict then check if a instance of expectation - acts on CURRENT prototype object - DOUBLE CHECK this - surely traverses [[Prototype]] chain to check all sub/superclasses and root node(s)?
          // May need refactoring to use getPrototypeOf() for more robust solution
          // Or check received value is not simply a constructor itself.
          // Alternative code for 1st expression (which uses Object())
          //} else if  {
          /*} else if ( ( (actual !== null && actual !== undefined) ? actual.constructor : actual ) === expectedType ) {
            return true;
          } else {
            // Otherwise throw exception
            throwException(exceptionType, name, "getClass() - Number/String/Boolean/Array/Object", actual); // Need to inject correct className
          }*/
          // Use of Object() converts primitve literal values into objects which plays nice with the instanceof operator (n.b. [[Prototype]] *is* setup, e.g. "".constuctor (which lives on __proto__, the prototype of the constructor function, exists)).
          // I'd love to know why! instanceof crawls [[Prototype]]
          
          if ( Object ( actual ) instanceof expectedType || actual === expectedType ) {
            
            // If strict then 'deep' assertion
            if ( strictValueChecking === true ) {
              
              // Catch errors thrown by collaborator object interface (e.g. assertHash())
              try {
                
                // Handle primtive values - if correct types then identity check
                // Using Object.prototype.valueOf() allows us to compare Dates along with the normal primitve values w/o custom handling (e.g. UTC conversion)
                if ( ( isValue === true && !_compare(expected, actual, "valueOf") )

                // Handle regular expression objects. Note: NOT testing implementation, just the string representation of the object
                || ( isRegExp === true && !_compare(expected, actual, "toString") )

                // Handle composite values & custom Data Types - first check for match on constructor, then match on collection, e.g. members (strict checking)
                || ( (isValue === false) && ( actual !== expectedType ) && ( ( (isCollection === true) ? assertCollection : assertHash)(expected, actual, true, exceptionType, (isCollection === true) ? null : opt_exceptionHandler) === false ) ) ) {
                
                  // FAIL.
                  result = false;
                
                }
                
              } catch (error) {

                // If MissingHashKeyException thrown then create custom error listing the missing keys.
                if ( error && error[0] && error[0].type === "MissingHashKeyException" ) {
                  opt_exceptionHandler && opt_exceptionHandler("MissingHashKeyException", identifier, "object with native and custom keys", (function (a) {
                    for ( var i = 0, len = error.length; i < len; i++ ) {
                      a.push((error[i].message.split(':')[1]) || null);
                    }
                    return a.join('')
                  })(['missing keys:']));
                } else {
                  throw error;
                }
                // Ensure normal flow control plays out
                result = false;
              }

          }
          // Handle expected object literals whose Type match all types (aside from falsy types)  
          // aka check Object actually is an Object instance
          else if ( ( expectedType === Object ) && ( actual && actual.constructor !== Object.prototype.constructor ) ) {
            result = false;
          }
          
        // If not strict check actual isn't a constructor in own right
        } else if ( actual !== expectedType ) {
          result = false;
        }
        // Throw error if negative match
        if ( result === false ) {
          opt_exceptionHandler && opt_exceptionHandler(exceptionType, identifier, expected, actual); // Need to inject correct className
        }
      } // end switch
       return result;
    }

    // Expose for testing
    ;;;; expose( assertHash, assertObject, "_assertHash" );
    ;;;; expose( assertCollection, assertObject, "_assertCollection" );
    
    // Return privileged function
    return assertObject;
    
  })(); // end assertObject declaration
  
  // Function to build pretty exception objects - TBR function signature
  function createException (exceptionType, objName, expected, actual) {
    var e = {
        type : exceptionType
      },
      fn = "'" + objName + "'";
    
    switch (true) {
      case "IncorrectNumberOfArgumentsException" === exceptionType   :
      case "MismatchedNumberOfMembersException" === exceptionType     :
        e.message = fn + " expected: " + expected + " items, actual number was: " + actual;
        break;
      case "IncorrectNumberOfMethodCallsException" === exceptionType  :
        e.message = fn + " expected: " + expected + " method calls, actual number was: " + actual;
        break;
      case "MissingHashKeyException" :
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
          MockObject.actualArguments = arguments;
          return MockObject;
        },
        methods = [], // List of MockedMember method instances declared on mock
        exceptions = [], // List of exceptions thrown by verify/verifyMethod functions,
        identifier = ( assertObject( String, arguments && arguments[0] ) ) ? arguments[0] : "'Constructor' (#protip - you can pass in a (String) when instantiating a new Mock, which helps inform constructor-level error messages)",
        assertCollection = assertObject["_assertCollection"].get(); // TBR
  
    // Function to push arguments into Mock exceptions list
    function throwMockException () {
      exceptions.push( createException.apply(null, arguments) );
    }

    // CONSTRUCTOR for mocked methods
    function MockedMember (min, max) {
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
      
      "method": function (name) {

        // Throw error if collision with mockMember API
        if (mock[name] !== undefined) {
          throwMockException("InvalidMethodNameException", "Constructor function", "unique method name", "was reserved method name '" + name + "'");
          throw exceptions;
        }
      
          // Register public interface to mocked method instance on mock klass, bind to curried function
          mock[name] = (function (method, name) {
        
          method["name"] = name;

          // Invoked when mock is called within SUT object.
          return function updateMethodState () {
                   
            // Normalise Arguments
            var parameters = slice.call(arguments, 0);
                         
            // Track method invocations
            method.actualCalls++;
         
            // Store method call params for verification
            method.actualArgs.push(parameters);
                   
            // Execute any callback functions specified with associated args.
            for (var i = 0, len = parameters.length; i < len; i++) {
              if (parameters[i] && parameters[i].constructor === Function) {
                  parameters[i].apply(undefined, method.callbackArgs);
              }
            }
           
            // Assert arguments against expected presentations and return appropriate object
            return (function getReturnValue(presentation) {
     
              // Make default return value the defualt method value (undefined || Object || self (mock - chained))
              var obj = method.returnValue;
            
              // Compare actual with expected arguments and if true return correct object
              assertingPresentations:
                for (var i = 0, len = method.expectedArgs.length; i < len; i++) {
                  try {
                    if ( assertCollection(
                          method.expectedArgs[i]["accepts"], // 'expected' inputs
                          presentation, // 'actual' inputs
                          true // Must be strict 1:1 match to return a certain value
                        )
                    ) {
                      // If match found against presentation return bound object (or self if chained)
                      obj = (method.returnValue && method.returnValue === mock) 
                        ? mock 
                        : method.expectedArgs[i]["returns"];
                    }
                  } catch (e) {
                    if ( e[0] && e[0].type === "MissingHashKeyException" ) {
                      continue assertingPresentations;
                    }
                  }
              }
          
              return obj;
           
           })(parameters)};
          
          })(this, name);
      
        // chain
        return this; 

      },
      
      "interface": function setInterfaceExpectations () {
      
        /*// Check for valid input to interface
        for (var i = 0, len = arguments.length, i++) {
          var acceptsProperty = arguments[i][accepts] || false; // attach hasOwnProperty check.
          if ( acceptsProperty === false ) { 
            throw {
              type: "MissingAcceptsPropertyException",
              msg: "Qmock expects arguments to setInterfaceExpectations() to contain an accepts property"
            }
          } else if ( acceptsProperty.constructor !== Array ) {
            throw {
              type: "InvalidAcceptsValueException",
              msg: "Qmock expects value of 'accepts' in arguments to be an Array"
            }  
          }
        }*/
      
        // Expected format of arguments - {accepts: [], returns: value}
  
        // Where arguments can equal either any type, or overloadable pairings.
        // e.g. "string" or {params: foo, returns: bar}. Note array literals must be nested ({params: ["string", [1,2,3]], returns: "meh"})
        // Normalize input to accepts into key/value expectation pairings
        
        // THIS NEEDS A DEBATE - DEFAULT IS FOR IMPLICT STRICT NUMBER OF, & VALUE OF, ARG CHECKING FOR 'PRESENTATIONS'.
        // If required number of arguments not already set, then implicitly set it to length of param array (so let ppl customise it)
        // Add in per presentation strict argument length unless already set either globally or locally (recommendation to keep it consistent locally - don't let mocks change behaviour in test group too much)
        // This should probably be part of the refactor... feels messy!
        if (this.requiredNumberofArguments === false) {
        
          // Set minimum expectations
          this.requiredNumberofArguments = arguments[0]["accepts"].length; 
        
          // Assign explicit expectation if exist
          for(var i = 0, len = arguments.length; i < len; i++) {
            if(!arguments[i]["required"]) {
              arguments[i]["required"] = arguments[i]["accepts"].length;
            }
          }
        }
        this.expectedArgs = arguments;
        return this;
      },
      
      "accepts": function setSingleInterfaceExpectation () {
        this.requiredNumberofArguments = arguments.length;
        this.expectedArgs = [{"accepts": slice.call(arguments, 0)}];
        return this;
      },
      
      "returns": function (stub) {
        this.returnValue = stub; // default is undefined
        return this;
      },
      
      "required": function (requiredArgs) {
        this.requiredNumberofArguments = requiredArgs;
        return this;
      },
      
      "overload": function (overload_flag) {
        this.allowOverload = overload_flag;
        return this;
      },
      
      "strict": function () {
        this.strictValueChecking = true;
        return this;
      },
      
      "property": function (name) {
        if (mock[name] !== undefined) {
          throwMockException("InvalidPropertyNameException", "Constructor function", "undefined property name", "should be unique (was " + name + ")");
          throw exceptions;
        }
        mock[name] = "stub";
        return this;
      },
      
      "withValue": function (value) {
        for(property in mock) {
          if ( mock.hasOwnProperty(property) ) {
            if ( mock[property] === "stub" ) {
              mock[property] = value;
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
      
      "andChain": function () {
        return this.returnValue = mock;
      },
      
      "andExpects": function (calls) {
        return mock.expects(calls);
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
                 throwMockException("IncorrectNumberOfMethodCallsException", name, expectedCalls, actualCalls);
                 break assertMethod;
             }
    
          // assert presentations.... LET's DO THAT AFTERWARDS...IN fact more like a loop around the old atomic presentation checking mechanism...
    
          // Evaluate method interface expectations against actual
          assertInterface: switch ( true ) {
      
            // Strict Arg length checking - no overload
            case ( allowOverload === false) && ( requiredNumberofArguments !== false ) && ( requiredNumberofArguments !== actualArgs[0].length ): 
            // At least n Arg length checking - overloading allowed - Global check
            case ( allowOverload === true) && ( requiredNumberofArguments !== false ) && ( requiredNumberofArguments > actualArgs[0].length )  :
              throwMockException("IncorrectNumberOfArgumentsException", name, expectedArgs.length, actualArgs.length);
              break assertMethod;

            default:
              (function () {
          
              // Only check arguments if some available or explicitly required
              // By default functions returned 'undefined'
              // This feels hacky also... refactor out if possible!
              if ( requiredNumberofArguments !== false || ( actualCalls > 0 && actualArgs[0].length > 0 ) ) {
          
                assertPresentations: // For each presentation to the interface...
            
                  for (var i = 0, len = actualArgs.length; i < len; i++) {
            
                    assertExpectations: // ...Check if a matching expectation
                
                      for (var j = 0, _len = expectedArgs.length; j < _len; j++) {
            
                        // Assert Number of Arguments if expectation explicitly set...
                        // At least n Arg length checking - overloading allowed - Global check
                        if ( expectedArgs[j]["required"] > actualArgs[i].length )  {
                          throwMockException("IncorrectNumberOfArgumentsException", name, expectedArgs.length, actualArgs.length);
                          continue assertPresentations;
                        }      
            
                        // Use to restore exceptions object to pre-presentation assertion state in case of match                         
                        var cachedExceptionTotal = exceptions.length;
          
                        // If a match (strict value checking) between a presentation and expectation restore exceptions object and assert next interface presentation.
                        // If strict argument total checking is on just pass through expected and actual
                        if ( assertCollection(
                              // expected
                              ( allowOverload === false && requiredNumberofArguments !== false ) 
                                ? expectedArgs[j]["accepts"]
                                // Else assume default mode of overloading and type checking against method interface
                                : slice.call(expectedArgs[j]["accepts"], 0, actualArgs[i].length),
                              // actual
                              ( allowOverload === false && requiredNumberofArguments !== false ) 
                                ? actualArgs[i]
                                // Else assume default mode of overloading and type checking against method interface
                                : slice.call(actualArgs[i], 0, expectedArgs[j]["accepts"].length),
                              strictValueChecking,
                              (strictValueChecking) ? "IncorrectArgumentValueException" : "IncorrectArgumentTypeException",
                              throwMockException,
                              name,
                              exceptions
                            ) 
                          ) {
                              // If match remove exceptions raised during checks and move on to next presentation.
                              exceptions.slice(0, cachedExceptionTotal);
                              continue assertPresentations;
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

    // PUBLIC METHODS on mock
    // Creates new MockedMember instance on Mock Object and sets-up initial method expectation
    mock.expects = mock.andExpects = function mockExpectsNewMethod (min, max) {
      return new MockedMember(min, max);
    };
      
    mock.accepts = function mockExpectsArguments () {
      mock.expectsArguments = arguments;
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
      with ( mock ) {
        if (expectsArguments.length !== actualArguments.length) {
          // Thrown in to satisfy tests (for consistency's sake) - NEEDS TO BE REFACTORED OUT!
          throwMockException("IncorrectNumberOfArgumentsException", "Constructor function", expectsArguments.length, actualArguments.length);
        } else {
          assertCollection(expectsArguments, actualArguments, strictValueChecking, null, throwMockException);
        }
      }
          
      // Verify Mocked Methods
      for (var i = 0, len = methods.length; i < len; i++) {
        methods[i].verifyMethod();
      }
      
      // Did it go bad?
      if (exceptions.length !== 0) {
        throw exceptions;
      } else {
        return true;
      }
    };

    // Resets internal state of Mock instance
    mock.reset = function resetMock () {
      exceptions = [];
      this.actualArguments = [];
      for (var i = 0, len = methods.length; i<len; i++) {
        methods[i].actualCalls = 0;
        methods[i].actualArgs = [];
      }
    };
  
    // Backward compatibility for QMock v0.1 API
    mock.expectsArguments = mock.accepts;
    
    // If params passed to Mock constructor auto-magikally create mocked interface from JSON tree.
    if ( assertObject( Object, arguments && arguments[0] ) ) {
      createMockFromJSON.call(mock, arguments[0]);
    }
    
    // On my command, unleash the mock! :-)
    return mock;
  
  };
      
  // PUBLIC static members on Mock class
  
  // Version number  
  MockConstructor["QMock"] = "0.2";
  MockConstructor["Variable"] = Variable;
  
  // Expose internal methods for unit tests
  // Base object checker method
  ;;;; expose( assertObject, MockConstructor, "_assertObject" )
  // exception object builder
  ;;;; expose( createException, MockConstructor, "_createException" );
  // mock generator
  ;;;; expose( createMockFromJSON, MockConstructor, "_createMockFromJSON" );
  
  // API Registration - register qMock in mapped scope
  container.Mock = MockConstructor;
  
  // Register qMock as a Common JS module
  if ( typeof exports !== "undefined" && typeof require !== "undefined" ) {
    exports.Mocks = MockConstructor;
  }
  
})('Mock', this);