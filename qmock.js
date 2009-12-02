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
 * TODO: Add flag for strict value checking.. default is type checking...
 * TODO: Figure out a way to re-use mockedMember constructor wih mock constructors...SERIOUSLY NEED THIS, Constuctor features are messy as f*ck.
 * TODO: Refactor out object checking logic and make leaner....
 * TODO: Make code more readable with if (key in obj) notation... (rather than if(obj[key]))...
 * TODO: Question use of Constructor flag exception object? Really needed if execption thrown has enough detail? Or refactor as propert on exception thrown? e.g. e.objectType: "Constructor", "Method".
 * TODO: Add in optimisations for compilers like YUI & Google Closure.
 * TODO: add a end() utility function for restoration of scope to Mock obj (instead of member)
 * TODO: SUPPORT Native types in accepted arguments for type checking (otherwise people have to think of examples all the time!)
 * TODO: Look into dynamic generation of mocks based on code lib, and or pdoc comments? Mental.
 * TODO: Refactor conditionals with short-circuit evaluation...
 * TODO: Strict return support for single expected presentations? Too complex?
 * TODO: Protect against API collisions between QMock and Mocks through internal re-mapping
 * TODO: Extend callback parameter invocation to support multiple callback scenarios
 * TODO: Write simple helper function to test valid stuff in loops
 * TODO: Early exclusions via returns
 */

(function initialiseQMock (Mock, container) {
  
  /**
  * Helpers - Protected
  */
  
  // So Dmitry Baranovskiy doesn't shout at me ([O:O]) - http://sitepoint.com/blogs/2009/11/12/google-closure-how-not-to-write-javascript/
  // Really this is ultra defensive but since undefined is used in parameter verification code let's be sure it actually is typeof "undefined".
  var undefined,
    slice = Array.prototype.slice,
    Mock;
    
  // Allow pass-through argument checking - declares objects of type 'Variable' in global namespace.
  container.Variable = container.Selector = new function Variable () {} ();
  
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
    
    var propertyWhitelist = "calls min max"; // List of expectations that are used in API/JSON args.

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
		            : [(memberConfig.min) 
		              ? memberConfig.min
		              : 0,
		            (memberConfig.max) 
		              ? memberConfig.max
		              : Infinity]
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
	            throwException("InvalidExpectationMethodCallException", member["name"] + '.' + expectation, "Key to mutator method on mockedMember object", name);
	          }
	
        } // end setExpectations
      } else {
				// If expectation not method then simply set property
        member.withValue(memberConfig["value"]);
      }
    }
  }
  
  // Function to assert length & members of an array, returns Boolean
  function assertArray (expected, actual, opt_strictValueChecking) {    
    return ( expected && actual 
      && expected.constructor === Array 
      && actual.constructor === Array 
      && expected.length === actual.length ) 
				? assertCollection ({
						expected      			: expected,
						actual        			: actual,
						strictValueChecking	: ( opt_strictValueChecking !== undefined ) ? opt_strictValueChecking : false,
          	name        				: "",
          	exceptions      		: [], // stubbed but not referenced atm in error logging.
          	isConstuctor    		: false,
          	exceptionType    		: ""      
					}) 	? true 
							: false
      	: false; // Bad Arguments
  }

  // Function to assert members of an object, returns Boolean
  function assertObject (expected, actual, opt_strictValueChecking) {
    var result = true; 
    if ( expected && actual ) {
      for ( var property in expected ) {
        if ( !assertCollection ({
            		expected    				: [expected[property]],
	            	actual      				: [actual[property]],
	            	strictValueChecking	: ( opt_strictValueChecking !== undefined ) ? opt_strictValueChecking : false,
	            	name      					: "",
	            	exceptions    			: [], // stubbed but not referenced atm in error logging.
	            	isConstructor  			: false,
	            	exceptionType  			: ""
          		})
        ) { result = false; }
      } 
    } else {
      result = false;
    }
    return result;
  }

  // Delegate function that asserts elements of a collection
  function assertCollection (config) {
		
		// Check required args exist
		if (!config || arguments.length > 1) {
			throw {
        type: "MissingConfigObjectException",
        msg: "assertCollection() requires single configuration object to be passed"
      }
		}
  
    // Used to push errors into correct array
    // Try and refactor out to use normal private static fn
    function _throwException () {
      config.exceptions.push(
        createException.apply(null, arguments)
      );
    }
  
    // params === object literal with associated properties - used for readability
    with ( config ) {      
  
      // Only assert on absolute number of params declared in method signature as expectations don't exist for overloaded interfaces
      testingArgumentTypes: for (var i = 0, len = actual.length; i < len; i++) {
        
        // hack in support for native object types (aside from null // undefined)
        var nativeTypes = [Number, String, Boolean, Date, Function, Object, Array, RegExp],
          expectation = (expected[i] !== null && expected[i] !== undefined) ? expected[i].constructor : expected[i]; // falsy values 0,'',false still resolve constructor property
        
        assertType: 
          for (var j = 0, _len = nativeTypes.length; j < _len; j++) {
            if ( expected[i] === nativeTypes[j] ) {
              expectation = expected[i];
              break assertType;
            }
          }
        
        switch(expectation) {
          // Pass-through
          case container.Variable.constructor:
            continue testingArgumentTypes;
          // Primitives  - compare by constructor unless strictValue flag is true (where compare by identity).
          case Number:
					case String:
					case Boolean:
						// If strict then simply do an identity check
            if ( ( strictValueChecking === true ) && ( expected[i] !== actual[i] ) ) {
              _throwException("IncorrectArgumentValueException", name, expectation, actual[i]);
						// If not strict then check if null/undefined else test constructor
            } else if ( 
							( (actual[i] !== null && actual[i] !== undefined ) ? actual[i].constructor : actual[i] ) !== expectation
									// Or check received value is not simply a constructor itself.
 								&& expectation !== actual[i]) {
									// Otherwise throw exception
                	_throwException(exceptionType, name, "Number/String/Boolean", actual[i]);
            }
            continue testingArgumentTypes;
          case Date:           
            if ( (actual[i] && actual[i].constructor) !== Date ) {
              _throwException("IncorrectArgumentValueException", name, "Date", actual[i]);
            } else if ( ( strictValueChecking === true ) 
              && ( expected[i].toUTCString() !== actual[i].toUTCString() ) ) {
              _throwException(exceptionType, name, expected[i].toUTCString(), actual[i].toUTCString());
            }
            continue testingArgumentTypes;
          // Composites - compare by constructor
          case Function: 
            if ( (actual[i] && actual[i].constructor) !== Function ) {
              _throwException(exceptionType, name, "Function", actual[i]); }
              continue testingArgumentTypes;
          case Object: 
            if ( !assertObject(expected[i], actual[i], strictValueChecking ) ) {
              _throwException(exceptionType, name, "Object", actual[i]); }
              continue testingArgumentTypes;
          case Array: 
            if ( !assertArray(expected[i], actual[i], strictValueChecking ) ) { 
              _throwException(exceptionType, name, expected[i], actual[i]); }
              continue testingArgumentTypes;
          case RegExp:
            if ( (actual[i] && actual[i].constructor) !== RegExp ) {
              _throwException(exceptionType, name, "RegExp", actual[i]); }
              continue testingArgumentTypes;
          // Falsy - compare by type
          case null:
          case undefined:
            if ( expected[i] !== actual[i] ) {
              _throwException(exceptionType, name, expected[i], actual[i]); }
              continue testingArgumentTypes;
          // Custom Object - compare by constructor
          default: 
            if ( expected[i].constructor !== (actual[i] && actual[i].constructor) ) {
              _throwException(exceptionType, name, "Custom Object", actual[i]); }
        };
      }

      // Can just return a Boolean for recursive calls, ignored by assertArguments call.
      return ( exceptions.length === 0 ) ? true : false;
    }
  }

  // Function to build pretty exception objects
	function createException (exceptionType, objName, expected, actual) {
  	var e = {
        type : exceptionType
      },
      fn = "'" + objName + "'";
    
    switch (true) {
      case "IncorrectNumberOfArgumentsException" === exceptionType   :
        e.message = fn + " expected: " + expected + " arguments, actual number was: " + actual;
        break;
      case "IncorrectNumberOfMethodCallsException" === exceptionType  :
        e.message = fn + " expected: " + expected + " method calls, actual number was: " + actual;
        break;
      default:
        e.message = fn + " expected: " + expected + ", actual was: " + actual;
    }
    return e;
	}
  
  Mock = (function createMockConstructor () {
  
    // PUBLIC MOCK OBJECT CONSTRUCTOR
    return function MockConstructor () {

	    var mock = function MockObject () {
	      // Can't use MockObject fn name, dies in IE <<< Changed to be ES5 compatible - test in IE!!
	      MockObject.actualArguments = arguments;
	      return MockObject;
	    },
	    methods = [], // List of MockedMember method instances declared on mock
	    exceptions = []; // List of exceptions thrown by verify/verifyMethod functions
    
      // Function to push arguments into Mock exceptions list
      function throwException () {
        exceptions.push(
          createException.apply(undefined, arguments)
        );
      }
  
      // Function to compare expected and actual arguments for mock method & constructor
      function assertArguments (expected, actual, opt_strictValueChecking, opt_isConstructor) {
        // Check not parameterless constructor.
        if ( opt_isConstructor && expected.constructor === Function ) { return; }   
        // Iterate over collection testing arguments
        return assertCollection({
          expected: expected,
          actual: actual,
          strictValueChecking: opt_strictValueChecking || false,
          isConstructor: opt_isConstructor || false,
          exceptionType: ( opt_isConstructor === true ) ? "InvalidConstructorException" : "IncorrectArgumentTypeException",
          name: ( opt_isConstructor === true ) ? "Constructor" : this["name"],
          exceptions: exceptions
        });
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
        
				method: function (name) {

					// Throw error if collision with mockMember API
	        if (mock[name] !== undefined) {
	          throwException("InvalidMethodNameException", "Constructor function", "unique method name", "was reserved method name '" + name + "'");
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
             for (var i = 0, len = method.expectedArgs.length; i < len; i++) {
               if ( 
                 assertArray (
                   method.expectedArgs[i]["accepts"], // 'expected' inputs
                   presentation, // 'actual' inputs
                   true // flag strict value checking to match correct expectation for return value
                 ) 
               ) {
                  // If match found against presentation return bound object (or self if chained)
                  obj = (method.returnValue && method.returnValue === mock) 
                    ? mock 
                    : method.expectedArgs[i]["returns"];
                }
             			}
	             			return obj;
	           	})(parameters);
	          
						};
        
					})(this, name);
        
	        // chain
	       	return this; 

	      },
	      interface: function setInterfaceExpectations () {
        
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
	      accepts: function setSingleInterfaceExpectation () {
	        this.requiredNumberofArguments = arguments.length;
	        this.expectedArgs = [{"accepts": slice.call(arguments, 0)}];
	        return this;
	      },
	      returns: function (stub) {
	        this.returnValue = stub; // default is undefined
	        return this;
	      },
	      required: function (requiredArgs) {
	        this.requiredNumberofArguments = requiredArgs;
	        return this;
	      },
	      overload: function (overload_flag) {
	        this.allowOverload = overload_flag;
	        return this;
	      },
	      strict: function () {
	        this.strictValueChecking = true;
	        return this;
	      },
	      property: function (name) {
	        if (mock[name] !== undefined) {
	          throwException("InvalidPropertyNameException", "Constructor function", "undefined property name", "should be unique (was " + name + ")");
	          throw exceptions;
	        }
	        mock[name] = "stub";
	        return this;
	      },
	      withValue: function (value) {
	        for(property in mock) {
	          if ( mock.hasOwnProperty(property) ) {
	            if ( mock[property] === "stub" ) {
	              mock[property] = value;
	            }
	          }
	        }
	        return this;
	      },
	      callFunctionWith: function () {
	          // Callback function arguments - useful for async requests
	          this.callbackArgs = arguments;
	          return this;
	      },
	      andChain: function () {
	        return this.returnValue = mock;
	      },
	      andExpects: function (calls) {
	        return mock.expects(calls);
	      },
	      verifyMethod: function () {
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
	               throwException("IncorrectNumberOfMethodCallsException", name, expectedCalls, actualCalls);
	               break assertMethod;
	           }
      
	        // assert presentations.... LET's DO THAT AFTERWARDS...IN fact more like a loop around the old atomic presentation checking mechanism...
      
	        // Evaluate method interface expectations against actual
	        assertInterface: switch ( true ) {
        
	          // Strict Arg length checking - no overload
	          case ( allowOverload === false) && ( requiredNumberofArguments !== false ) && ( requiredNumberofArguments !== actualArgs[0].length ): 
	          // At least n Arg length checking - overloading allowed - Global check
	          case ( allowOverload === true) && ( requiredNumberofArguments !== false ) && ( requiredNumberofArguments > actualArgs[0].length )  :
	            throwException("IncorrectNumberOfArgumentsException", name, expectedArgs.length, actualArgs.length);
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
	                        throwException("IncorrectNumberOfArgumentsException", name, expectedArgs.length, actualArgs.length);
	                        continue assertPresentations;
	                      }      
              
	                      // Use to restore exceptions object to pre-presentation assertion state in case of match                         
	                      var cachedExceptionTotal = exceptions.length;
            
	                      // If a match (strict value checking) between a presentation and expectation restore exceptions object and assert next interface presentation.
	                      if (assertArguments(
	                          expectedArgs[j]["accepts"],
	                          // If strict argument total checking is on just pass through expected and actual
	                           ( allowOverload === false && requiredNumberofArguments !== false ) 
	                            ? actualArgs[i] 
	                            // Else assume default mode of overloading and type checking against method interface
	                            : slice.call(actualArgs[i], 0, expectedArgs[j]["accepts"].length), 
	                          strictValueChecking
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
        var isConstructor = true;
        // Check Constructor Arguments
        with ( mock ) {
          if (expectsArguments.length !== actualArguments.length) {
            // Thrown in to satisfy tests (for consistency's sake) - NEEDS TO BE REFACTORED OUT!
            throwException("InvalidConstructorException", "Constructor function", expectsArguments, actualArguments);
            throwException("IncorrectNumberOfArgumentsException", "Constructor function", expectsArguments.length, actualArguments.length);
          }
          assertArguments(expectsArguments, actualArguments, strictValueChecking, isConstructor);
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
      createMockFromJSON.call(mock, arguments[0]);
      
      // On my command, unleash the mock! :-)
      return mock;
    
		};
    
  })();
  
  // PUBLIC static members on Mock class
  
  // Expose internal methods for unit tests
  ;;;; expose( assertArray, Mock, "_assertArray" );
  ;;;; expose( assertObject, Mock, "_assertObject" );
  ;;;; expose( assertCollection, Mock, "_assertCollection" );
  ;;;; expose( createException, Mock, "_createException" );
  ;;;; expose( createMockFromJSON, Mock, "_createMockFromJSON" );
  
  // Version number  
  Mock["qMock"] = "0.2";
  
  // API Registration - register qMock in mapped scope
  container.Mock = Mock;
  
  // Register qMock as a Common JS module
  if ( typeof exports !== "undefined" && typeof require !== "undefined" ) {
    exports.Mocks = Mock;
  }
  
})('Mock', this);