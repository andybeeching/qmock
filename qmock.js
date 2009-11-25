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
 * TODO: Support easy mock creation, e.g. take JSON tree of data to map? {"html": {expects: 1, args: ["<div />"], andReturn: "self"}};
 * TODO: Support multiple callbacks with correlating arguments
 * TODO: Optional strict method ordering flag? e.g. {ordered: true}
 * TODO: Document Mock object (plus Method) API
 * TODO: Add 'Collection' Argument for DOM Manipulation
 * TODO: Skin testrunner
 * TODO: Add scriptDoc support for instance methods and IDE completion
 * TODO: Support for custom exceptions?
 *
 */

var Mock = (function () {
	
	// PRIVATE static methods
	
	// Allow pass-through argument checking - declares objects of type 'Variable' in global namespace.
	function Variable () {}
	this.Variable = this.Selector = new Variable();
	
	// Function to strict type check length & elements of an array, returns Boolean to callee (assertCollection)
	function assertArray (expected, actual) {		
		return ( expected && actual 
			&& expected.constructor === Array 
			&& actual.constructor === Array 
			&& expected.length === actual.length ) ?
				( assertCollection ({
					expected: expected,
					actual: actual,
					name: "",
					exceptions: [],
					isConstuctor: false,
					exceptionType: ""			
				}) ) ? true : false
			: false; // Bad Arguments
	}
	
	// Function to strict type check members of an object, returns Boolean to callee (assertCollection)
	function assertObject (expected, actual) {
		var result = true; 
		if ( expected && actual ) {
			for ( var property in expected ) {
				if ( !assertCollection({
						expected: [expected[property]],
						actual: [actual[property]],
						name: "",
						exceptions: [],
						isConstructor: false,
						exceptionType: ""
					})
				) { result = false; }
			} 
		} else {
			result = false;
		}
		return result;
	}
	
	// Delegate function that strict type checks elements of a collection
	function assertCollection (params) {
		
		// Used to push errors into correct array
		function throwException () {
			params.exceptions.push(
				buildException.apply(undefined, arguments)
			);
		}
		
		// params === object literal with associated properties for correct scoping
		with ( params ) {			
		
			testingArgumentTypes: for (var i = 0, len = expected.length; i < len; i++) {
				
				switch(expected[i] && expected[i].constructor) {
					// Pass-through
					case Variable:
						continue testingArgumentTypes;
					// Composites - compare by constructor
					case Function: 
						if ( (actual[i] && actual[i].constructor) !== Function ) {
							throwException(exceptionType, name, "Function", actual[i]); }
							continue testingArgumentTypes;
					case Object: 
						if ( !assertObject(expected[i],actual[i]) ) {
							throwException(exceptionType, name, "Object", actual[i]); }
							continue testingArgumentTypes;
					case Array: 
						if ( !assertArray(expected[i],actual[i]) ) { 
							throwException(exceptionType, name, expected[i], actual[i]); }
							continue testingArgumentTypes;
					case RegExp:
						if ( (actual[i] && actual[i].constructor) !== RegExp ) {
							throwException(exceptionType, name, "RegExp", actual[i]); }
							continue testingArgumentTypes;
					case Date:						
						if ( (actual[i] && actual[i].constructor) !== Date ) {
							throwException(exceptionType, name, "Date", actual[i]);
						} else if ( expected[i].toUTCString() !== actual[i].toUTCString() ) {
							throwException(exceptionType, name, expected[i].toUTCString(), actual[i].toUTCString());
						}
						continue testingArgumentTypes;
					// Primitives - compare by value (inc. falsey values)
					case Number:
					case String:
					case Boolean:
					case null:
					case undefined:
					case "":
					case 0:
					case false:
						if ( expected[i] !== actual[i] ) {
							throwException(exceptionType, name, expected[i], actual[i]); }
							continue testingArgumentTypes;
					// Custom - compare by constructor
					default: 
						if ( expected[i].constructor !== (actual[i] && actual[i].constructor) ) {
							throwException(exceptionType, name, "Custom Object", actual[i]); }
				};
			}

			// Can just return a Boolean for recursive calls, ignored by assertArguments call.
			return ( exceptions.length === 0 ) ? true : false;
		}
	}
	
	// Function to build pretty exception objects
    function buildException (exceptionType, name, expected, actual) {
        return {
            type: exceptionType,
            message: name + " expected: " + expected + ", actual: " + actual
        };
    }
	
	// PUBLIC MOCK OBJECT CONSTRUCTOR
	return function MockConstructor () {

	    var mock = function MockObject () {
				// Can't use MockObject fn name, dies in IE
	        	arguments.callee.actualArguments = arguments;
				return arguments.callee;
			},
			methods = [], // List of MockedMember method instances declared on mock
	        exceptions = []; // List of exceptions thrown by verify/verifyMethod functions
		
		// Function to push arguments into Mock exceptions list
		function throwException () {
			exceptions.push(
				buildException.apply(undefined, arguments)
			);
		}
	
		// Function to compare expected and actual arguments for mock method & constructor
		function assertArguments (expected, actual, isConstructor) {
			// Check not parameterless constructor.
			if ( isConstructor && expected.constructor === Function ) { return; } 	
			// Iterate over collection testing arguments
			assertCollection({
				expected: expected,
				actual: actual,
				isConstructor: isConstructor || false,
				exceptionType: ( arguments.length === 3 ) ? "InvalidConstructorException" : "IncorrectArgumentException",
				name: ( arguments.length === 3 ) ? "Constructor" : this.name,
				exceptions: exceptions
			});
		}

	    // CONSTRUCTOR for mocked methods
	    function MockedMember (min, max) {
			this.name = "";
	        this.expectedCalls = min || 0;
			this.maxCalls = max || false;
	        this.actualCalls = 0;
	        this.expectedArgs = [];
	        this.actualArgs = [];
	        this.callbackArgs = [];
	        this.returnValue = undefined;
			// Store reference to method in method list for reset functionality and potential strict execution order tracking.
			methods.push(this);
		};
    	
	    MockedMember.prototype = {
	        method: function (name) {
				if (mock[name] !== undefined) {
					throwException("InvalidMethodNameException", "Constructor function", "undefined method name", "should be unique (was " + name + ")");
					throw exceptions;
				}
	            // Register public interface to mocked method instance on mock object, bind to curried function
	            mock[name] = (function (_self, name) {
	                _self.name = name;
	                // Invoked when mock is called in collaborator object.
	                return function updateMethodState () {
	                    _self.actualCalls++;
	                    _self.actualArgs = arguments; // last method invocation arguments cached.
	                    // Execute any callback functions specified with associated args.
	                    for (var i = 0, len = arguments.length; i < len; i++) {
	                        if (arguments[i] && arguments[i].constructor === Function) {
	                            arguments[i].apply(undefined, _self.callbackArgs);
	                        }
	                    }
	                    return _self.returnValue;
	                };
	            })(this, name);
	            // Chain
	            return this;
	        },
	        withArguments: function () {
	            this.expectedArgs = arguments;
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
	        andReturn: function (stub) {
	            // User-defined stubbed return value
				this.returnValue = stub;
	            return this;
	        },		
			andChain: function () {
				return this.returnValue = mock;
			},
			andExpects: function () {
				return mock.expects.apply(undefined, arguments);
			},
	        verifyMethod: function () {
	            errorChecking: with (this) {
                	// Assert Number of Method Calls 
					switch ( true ) {
						// max is infinite
						case (maxCalls === Infinity) && (actualCalls > expectedCalls):
							break;
						// arbitrary range defined
						case (maxCalls > 0) && (actualCalls >= expectedCalls) && (actualCalls <= maxCalls):
							break;
						// explicit call number defined
						case (expectedCalls === actualCalls):
							break;
						default:
							throwException("IncorrectNumberOfMethodCallsException", name, expectedCalls, actualCalls);
		                    break errorChecking;
					}
	                // Assert Number of Arguments
	                if (expectedArgs.length !== actualArgs.length) {
						throwException("IncorrectNumberOfArgumentsException", name, expectedArgs, actualArgs);
	                }
					assertArguments.apply(this, [expectedArgs, actualArgs]);
	            }
	        },
			// Syntactic Sugar
			atLeast: function (n) {
				this.expectedCalls = n;
				this.maxCalls = "∞";
				return this;
			},
			noMoreThan: function (n) {
				this.maxCalls = n;
				return this;
			}
	    };
	
		// PUBLIC METHODS on mock
		// Creates new MockedMember instance on Mock Object and sets-up initial method expectation
	    mock.expects = mock.andExpects = function mockExpectsNewMethod (min, max) {
	        return new MockedMember(min, max);
	    };
		
		mock.expectsArguments = function mockExpectsArguments () {
	        mock.expectsArguments = arguments;
	        return mock;
	    };
		
		mock.actualArguments = [];
	
	    // Verify method, tests both constructor and declared method's respective states.
	    mock.verify = function verifyMock () {
			// Constructor
			with ( mock ) {
				if (expectsArguments.length !== actualArguments.length) {
					throwException("IncorrectNumberOfArgumentsException", "Constructor function", expectsArguments.length, actualArguments.length);
		        }
				assertArguments(expectsArguments, actualArguments, true);
			}
	        // Methods
			for (var i = 0, len = methods.length; i < len; i++) {
		       methods[i].verifyMethod();
	        }
	        if (exceptions.length !== 0) {
	            throw exceptions;
	        }
	        return true;
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
	
		// Pseudo-private pointers for unit tests
		arguments.callee._assertArray = assertArray;
		arguments.callee._assertObject = assertObject;
		arguments.callee._buildException = buildException;
		
		

	    // On my command, unleash the mock! :-)
	    return mock;
	};
})();