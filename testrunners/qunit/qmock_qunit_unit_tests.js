module("QMock");

/**
 * All tests follow this simple process:
 * 
 *  1. Setup: Instantiate mocks and set expected interactions upon them. Sometimes located in the 'setup' phase of the testrunner before each test block.
 *  2. Exercise: Execute the relevant collaborator code to interact with the mock object.
 *  3. Verify: Call the verify method on each mock object to establish if it was interacted with correctly.
 *  4. Reset: [Optional] Call reset method on the mock to return it's internal state to the end of the setup phase. Sometimes located in the 'teardown' phase of the testrunner after each test phase.
 *
 */

test("mock with single parameterless method (explicit execution call total, no return value)", function () {
	
	expect(16);
	var ninja = new Mock();	
    
	// Test invalid method naming - protect API if using mocked member interface to set methods and properties
	try {
		ninja.expects(1).method('expects');
		fail("mock should detect bad method name 'expects'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown when bad method name 'expects' is used. Actual was");
		equals(e[0].type, "InvalidMethodNameException", "error type should be InvalidMethodNameException");
	}
	
	var ninja = new Mock();	// Can't call reset as mock is broken, must re-instantiate mock instance.
    
	try {
		ninja.expects(1).method('andExpects');
		fail("mock should detect bad method name 'andExpects'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidMethodNameException", "error type should be InvalidMethodNameException");
	}
	
	ninja = new Mock(); // Can't call reset as mock is broken, must re-instantiate mock instance.
	
	try {
		ninja.expects(1).method('expectsArguments');
		fail("mock should detect bad method name 'expectsArguments'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidMethodNameException", "error type should be InvalidMethodNameException");
	}
	
	ninja = new Mock(); // Can't call reset as mock is broken, must re-instantiate mock instance.
	
	try {
		ninja.expects(1).method('reset');
		fail("mock should detect bad method name 'reset'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidMethodNameException", "error type should be InvalidMethodNameException");
	}
	
	ninja = new Mock(); // Can't call reset as mock is broken, must re-instantiate mock instance.
	
	ninja
		.expects(1)
			.method('swing');
    
	// Test Bad Exercise phase - no method call
    try {
        ninja.verify();
        fail("verify() should throw exception when swing not called");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }

	ninja.reset();
	
	// Too many method calls
	ninja.swing();
    ninja.swing();

	try {
        ninja.verify();
        fail("verify() should throw exception when swing called too many times");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }	
    
    ninja.reset();

	// Test undefined return value
    equals(ninja.swing(), undefined, "swing() without return value set should return undefined");
	// Test Good Exercise Phase
    ok(ninja.verify(), "verify() should pass after swing called");

	// False Positive, expect ZERO calls
	
	var samurai = new Mock();
	
	samurai
		.expects(0)
			.method('swing');
	ok(samurai.verify(), "verify() should pass if swing not called");
	
	// Lots of calls
	
	var wizard = new Mock();
	
	wizard
		.expects(2000)
			.method('sendFireball');
			
	for(var i = 0; i < 2000; i++) {
		wizard.sendFireball();
	}
				
	ok(wizard.verify(), "verify() should pass if sendFireball called 2000 times");	
});

test("w/ JSON: mock with single parameterless method (explicit execution call total, no return value)", function () {
	
	expect(18);

	var ninja,
	 	samarui,
	 	wizard;
    
	// Test invalid method naming - protect API if using mocked member interface to set methods and properties
	try {
		ninja = new Mock({
			"expects" 	: {
				// expectations
			}
		});
		fail("mock should detect bad method name 'expects'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidMethodNameException", "error type should be InvalidMethodNameException");
	}
    
	try {
		// Can't call reset as mock is broken, must re-instantiate mock instance.
		ninja = new Mock({
			"andExpects" 	: {
				// expectations
			}
		});
		fail("mock should detect bad method name 'andExpects'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidMethodNameException", "error type should be InvalidMethodNameException");
	}
		
	try {
		// Can't call reset as mock is broken, must re-instantiate mock instance.
		ninja = new Mock({
			"expectsArguments" 	: {
				// expectations
			}
		});
		fail("mock should detect bad method name 'expectsArguments'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidMethodNameException", "error type should be InvalidMethodNameException");
	}
	
	ninja = new Mock(); // Can't call reset as mock is broken, must re-instantiate mock instance.
	
	try {
		// Can't call reset as mock is broken, must re-instantiate mock instance.
		ninja = new Mock({
			"expectsArguments" 	: {
				// expectations
			}
		});
		fail("mock should detect bad method name 'reset'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidMethodNameException", "error type should be InvalidMethodNameException");
	}
	// Can't call reset as mock is broken, must re-instantiate mock instance.
	ninja = new Mock({
		"swing"	: {
			// expectations
			calls : 1
		}
	});
  
	// Test Bad Exercise phase - no method call
    try {
        ninja.verify();
        fail("verify() should throw exception when swing not called");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }

	ninja.reset();
	
	// Too many method calls
	ninja.swing();
    ninja.swing();
	try {
        ninja.verify();
        fail("verify() should throw exception when swing called too many times");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }	
    
    ninja.reset();

	// Test undefined return value
    equals(ninja.swing(), undefined, "swing() without return value set should return undefined");

	// Test Good Exercise Phase
    ok(ninja.verify(), "verify() should pass after swing called");

	// False Positive, expect ZERO calls
	samurai = new Mock({
		"swing": {
			calls: 0
		}
	});
			
	ok(samurai.verify(), "verify() should pass if swing not called");
	
	// Should fail if called
	samurai.swing();
	try {
        samurai.verify();
        fail("verify() should throw exception when swing called too many times (test false positive)");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }

	// Lots of calls
	
	wizard = new Mock({	
		"sendFireball": {
			calls: 2000
		}
	});
			
	for(var i = 0; i < 2000; i++) {
		wizard.sendFireball();
	}
				
	ok(wizard.verify(), "verify() should pass if sendFireball called 2000 times");	
});


test("mock with single parameterless method (arbitrary execution call range, no return value)", function() {
	
	expect(12);
	
	var ninja = new Mock();
	
	ninja
		.expects(1, 3)
			.method('swing');
	
	// Bad Exercise - no swings
	try {
        ninja.verify();
        fail("verify() should throw exception when swing not called");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }

	ninja.reset();

	// One swing
	ninja.swing();
	ok(ninja.verify(), "verify() should pass after swing was called once");
	
	// Two swing
	
	ninja.swing();
	ok(ninja.verify(), "verify() should pass after swing was called twice");
	
	// Three swing
	ninja.swing();
	ok(ninja.verify(), "verify() should pass after swing was called thrice");
	
	// Too many swings
	ninja.swing();
	
	try {
        ninja.verify();
        fail("verify() should throw exception when swing called too many times");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }

	// At LEAST one swing...
	
	var samurai = new Mock();
	samurai
		.expects(1, Infinity)// Can use any string, inifinity symbol used here.
			.method('swing');
			
	samurai.swing();
	ok(samurai.verify(), "verify() should pass after swing was called once");
	
	for(var i = 0; i < 4999; i++) {
		samurai.swing();
	}
	ok(samurai.verify(), "verify() should pass after swing was called 5000 times");
	
	// Range of calls
	
	var wizard = new Mock();
	
	wizard
		.expects()
			.method('sendFireball')
			.atLeast(100)
			.noMoreThan(250);
			
	for(var i = 0; i < ( 100 + Math.floor(Math.random() * (250 - 100 + 1))); i++) {
		wizard.sendFireball();
	}
				
	ok(wizard.verify(), "verify() should pass if sendFireball called a random amount of times between a specified range");	
	
	wizard.reset();
	
	wizard.sendFireball();
	try {
        wizard.verify();
        fail("verify() should throw exception when swing out of defined call execution range");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
	
});

test("w/ JSON: mock with single parameterless method (arbitrary execution call range, no return value)", function() {
	
	expect(12);
	
	var ninja, 
		samurai,
		wizard;
	
	ninja = new Mock({
		swing: {
			min: 1,
			max: 3
		}
	});
	
	// Bad Exercise - no swings
	try {
        ninja.verify();
        fail("verify() should throw exception when swing not called");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }

	ninja.reset();

	// One swing
	ninja.swing();
	ok(ninja.verify(), "verify() should pass after swing was called once");
	
	// Two swing
	
	ninja.swing();
	ok(ninja.verify(), "verify() should pass after swing was called twice");
	
	// Three swing
	ninja.swing();
	ok(ninja.verify(), "verify() should pass after swing was called thrice");
	
	// Too many swings
	ninja.swing();
	
	try {
        ninja.verify();
        fail("verify() should throw exception when swing called too many times");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }

	// At LEAST one swing...
	
	samurai = new Mock({
		swing: {
			min: 0,
			max: Infinity // Can use any string, inifinity symbol used here.
		}
	});
			
	samurai.swing();
	ok(samurai.verify(), "verify() should pass after swing was called once");
	
	for(var i = 0; i < 4999; i++) {
		samurai.swing();
	}
	ok(samurai.verify(), "verify() should pass after swing was called 5000 times");
	
	// Range of calls
 	wizard = new Mock({
		sendFireball: {
			atLeast: 100,
			noMoreThan: 250
		}
	});
				
	for(var i = 0; i < ( 100 + Math.floor(Math.random() * (250 - 100 + 1))); i++) {
		wizard.sendFireball();
	}
	wizard.verify();
		
	ok(wizard.verify(), "verify() should pass if sendFireball called a random amount of times between a specified range");	
	
	wizard.reset();
	
	wizard.sendFireball();
	try {
        wizard.verify();
        fail("verify() should throw exception when swing out of defined call execution range");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
	
});

test("mock with multiple parameterless methods", function () {
   
	expect(3);
    
    var ninja = Mock();
    
    ninja
		.expects(1)
			.method('swing')
		.andExpects(1)
			.method('run')
		.andExpects(1)
			.method('block');
    
	// Bad Exercise
    try {
        ninja.verify();
        fail("verify() should throw exception when no methods called");
    } catch (e) {
        equals(e.length, 3, "verify() should return an array of 3 errors");
        equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
    ninja.reset();

    ninja.swing();
    ninja.run();
    ninja.block();

	// Good Exercise
    
	ok(ninja.verify(), "verify() should return true once swing, run and block called");

});

test("w/ JSON: mock with multiple parameterless methods", function () {
   
	expect(3);

    var ninja = new Mock({
		"swing": {
			calls: 1
		},
		"run": {
			calls: 1
		},
		"block": {
			calls: 1
		}
	});
    
	// Bad Exercise
    try {
        ninja.verify();
        fail("verify() should throw exception when no methods called");
    } catch (e) {
        equals(e.length, 3, "verify() should return an array of 3 errors");
        equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
    ninja.reset();

    ninja.swing();
    ninja.run();
    ninja.block();

	// Good Exercise
    
	ok(ninja.verify(), "verify() should return true once swing, run and block called");

});

test("mock with stubbed properties", function () {
	
	expect(16);
	
	var ninja = new Mock();
    
	// Test invalid property naming
	try {
		ninja.expects(1).property('expects');
		fail("mock should detect bad property name 'expects'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidPropertyNameException", "error type should be InvalidPropertyNameException");
	}
	
	var ninja = new Mock();
	
	ninja
		.expects()
			.property("rank")
			.withValue("apprentice");
		
	ok( (ninja.rank === "apprentice") , "ninja mock object should have a property called rank with correct value" );
	
	ninja = new Mock();
	
	ninja
		.expects()
			.property("rank")
			.withValue("apprentice")
		.andExpects()
			.property("master")
			.withValue("The Chrome");
		
	ok( ( (ninja.rank === "apprentice") && (ninja.master === "The Chrome") ) , "ninja mock object should have a two properties set correctly")
	
	// Composite
	var samurai = new Mock();
	
	samurai
		.expects()
			.property("rank")
			.withValue("apprentice")
		.andExpects(1,2)
			.method("swing")
		.andExpects()
			.property("master")
			.withValue("The Chrome");
			
	samurai.swing();
	
	// Good Exercise
	ok( samurai.verify(), "verify() should pass after swing was called once" );
	ok( ( (samurai.rank === "apprentice") && (samurai.master === "The Chrome") ) , "ninja mock object should have a two properties set correctly")
	
	// Test all object types can be stored on property
	
	var wizard = new Mock();
	
	function Custom () {};
	
	wizard
		.expects()
			.property("number")
			.withValue(1)
		.andExpects()
			.property("boolean")
			.withValue(true)
		.andExpects()
			.property("string")
			.withValue("string")
		.andExpects()
			.property("null")
			.withValue(null)	
		.andExpects()
			.property("undefined")
			.withValue(undefined)
		.andExpects()
			.property("function")
			.withValue(function stubbedFunction () {})
		.andExpects()
			.property("object")
			.withValue({})
		.andExpects()
			.property("array")
			.withValue([])
		.andExpects()
			.property("regExp")
			.withValue(/RegExp/)
		.andExpects()
			.property("date")
			.withValue(new Date())	
		.andExpects()
			.property("custom object")
			.withValue(new Custom());
			
	// No need to exercise - all stubs
	ok( (wizard["number"] === 1) , "wizard mock object should have a stubbed property of 'number' with a value of '1'");
	ok( (wizard["boolean"] === true) , "wizard mock object should have a stubbed property of 'boolen' with a value of 'true'");
	ok( (wizard["null"] === null) , "wizard mock object should have a stubbed property of 'null' with a value of 'null'");
	ok( (wizard["undefined"] === undefined) , "wizard mock object should have a stubbed property of 'undefined' with a value of undefined");
	ok( Mock._assertArray( [wizard["function"]], [function() {}] ) , "wizard mock object should have a stubbed property of 'function' with a value of 'function stubbedFunction () {}'");
	ok( Mock._assertArray( [wizard["object"]], [{}] ) , "wizard mock object should have a stubbed property of 'object' with a value of '{}'");
	ok( Mock._assertArray( [wizard["array"]], [[]] ) , "wizard mock object should have a stubbed property of 'array' with a value of '[]'");
	ok( Mock._assertArray( [wizard["regExp"]], [/RegExp/] ) , "wizard mock object should have a stubbed property of 'regExp' with a value of '/RegExp/'");
	ok( Mock._assertArray( [wizard["date"]], [new Date()] ) , "wizard mock object should have a stubbed property of 'date' with a value of 'new Date()'");
	ok( Mock._assertArray( [wizard["custom object"]], [new Custom()] ) , "wizard mock object should have a stubbed property of 'custom object' with a value of 'new Custom()'");
	
});

test("w/ JSON: mock with stubbed properties", function () {
	
	expect(15);
	
	var ninja,
	 	samurai,
		wizard;
    
	// Test invalid property naming
	try {
		ninja = new Mock({
			"expects": { 
				value: Variable
			}
		});
		fail("mock should detect bad property name 'expects'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidPropertyNameException", "error type should be InvalidPropertyNameException");
	}
	
	ninja = new Mock({
		"rank": {
			value: "apprentice"
		}
	});
		
	ok( (ninja.rank === "apprentice") , "ninja mock object should have a property called 'rank' with correct value" );
	
	ninja = new Mock();
	
	ninja = new Mock({
		"rank"	: {
			value: "apprentice"
		},
		"master": {
			value: "The Chrome"
		}
	});
		
	ok( ( (ninja.rank === "apprentice") && (ninja.master === "The Chrome") ) , "ninja mock object should have a two properties set correctly");
	
	// Composite - Methods and properties mixed
	samurai = new Mock({
		"rank"	: {
			value: "apprentice"
		},
		"master": {
			value: "The Chrome"
		},
		"swing"	: {
			calls: 1
		}
	});
			
	samurai.swing();
	
	// Good Exercise
	ok( samurai.verify(), "verify() should pass after swing was called once" );
	ok( ( (samurai.rank === "apprentice") && (samurai.master === "The Chrome") ) , "ninja mock object should have a two properties set correctly")
	
	// Test all object types can be stored on property
	
	function Custom () {};
	
	wizard = new Mock({
		"number"	: {
			value	: 1
		},
		"boolean"	: {
			value	: true
		},
		"string"	: {
			value	: "string"
		},
		"null"		: {
			value	: null
		},
		"function"	: {
			value	: function stubbedFunction () {}
		},
		"object"	: {
			value	: {}
		},
		"array"		: {
			value	: []
		},
		"regExp"	: {
			value	: /RegExp/
		},
		"date"		: {
			value	: new Date()
		},
		"custom object": {
			value	: new Custom()
		}
	});
			
	// No need to exercise - all stubs
	ok( (wizard["number"] === 1) , "wizard mock object should have a stubbed property of 'number' with a value of '1'");
	ok( (wizard["boolean"] === true) , "wizard mock object should have a stubbed property of 'number' with a value of 'true'");
	ok( (wizard["null"] === null) , "wizard mock object should have a stubbed property of 'null' with a value of 'null'");
	ok( Mock._assertArray( [wizard["function"]], [function() {}] ) , "wizard mock object should have a stubbed property of 'function' with a value of 'function stubbedFunction () {}'");
	ok( Mock._assertArray( [wizard["object"]], [{}] ) , "wizard mock object should have a stubbed property of 'object' with a value of '{}'");
	ok( Mock._assertArray( [wizard["array"]], [[]] ) , "wizard mock object should have a stubbed property of 'array' with a value of '[]'");
	ok( Mock._assertArray( [wizard["regExp"]], [/RegExp/] ) , "wizard mock object should have a stubbed property of 'regExp' with a value of '/RegExp/'");
	ok( Mock._assertArray( [wizard["date"]], [new Date()] ) , "wizard mock object should have a stubbed property of 'date' with a value of 'new Date()'");
	ok( Mock._assertArray( [wizard["custom object"]], [new Custom()] ) , "wizard mock object should have a stubbed property of 'custom object' with a value of 'new Custom()'");
	
});

test("mock with no parameters, return values", function () {
    
	expect(15);
    
    var mock = new Mock();
    
    mock
		.expects(1)
			.method('getNumericValue').returns(10)
		.andExpects(1)
			.method('getStringValue').returns('data')
		.andExpects(1)
			.method('getArrayValue').returns( [ 1, 2, 3] )
		.andExpects(1)
			.method('getFunctionValue').returns( function () { return 'function'; } )
		.andExpects(1)
			.method('getObjectValue').returns( { id: 5, value: 'value' } )
		.andExpects(1)
			.method('getNullValue').returns(null)
		.andExpects(1)
			.method('getUndefinedValue').returns(undefined)
		.andExpects(1)
			.method('getEmptyStringValue').returns("")
		.andExpects(1)
			.method('getZeroValue').returns(0)
		.andExpects(1)
			.method('getTrueValue').returns(true)
		.andExpects(1)
			.method('getFalseValue').returns(false)
		.andExpects(1)
			.method('getEmptyArrayValue').returns([ ])
		.andExpects(1)
			.method('getEmptyObjectValue').returns({ });
	// Use exposed qMock's exposed assertArray & assertObject helper methods as check contents of array/object, rather than strict checking instance like QUnit.
	equals(mock.getNumericValue(), 10, "getNumericValue() should return 10");
    equals(mock.getStringValue(), 'data', "getStringValue() should return 'data'");
    ok(Mock._assertArray(mock.getArrayValue(), [ 1, 2, 3 ]), "getArrayValue() should return [ 1, 2, 3 ]");
    equals(mock.getFunctionValue()(), 'function', "getFunctionValue() when invoked should return 'function'");
    ok(Mock._assertObject(mock.getObjectValue(), { id: 5, value: 'value' }), "getObjectValue() should return object");
    equals(mock.getNullValue(), null, "getNullValue() should return null");
    equals(mock.getUndefinedValue(), undefined, "getUndefinedValue() should return undefined");
    equals(mock.getEmptyStringValue(), "", "getEmptyStringValue() should return ''");
    equals(mock.getZeroValue(), 0, "getZeroValue() should return 0");
    equals(mock.getTrueValue(), true, "getTrueValue() should return true");
    equals(mock.getFalseValue(), false, "getFalseValue() should return false");
    ok(Mock._assertArray(mock.getEmptyArrayValue(), [ ]), "getEmptyArrayValue() should return [ ]");
    ok(Mock._assertObject(mock.getEmptyObjectValue(), { }), "getEmptyObjectValue() should return { }");
    ok(mock.verify(), "verify() should be true");

	mock = new Mock();
	mock
		.expects(1)
			.method('returnsTest')
			.returns('return')
		.andExpects(1)
			.method('isMethod')
			.accepts(Variable);
			
	mock.returnsTest()
	mock.isMethod("test");
	ok(mock.verify(), "verify() should be true");		
	
});

test("w/ JSON: mock with no parameters, return values", function () {
    
	expect(15);
    
    var mock = new Mock({
		"getNumericValue": {
			returns: 10
		},
		"getStringValue": {
			returns: 'data'
		},
		"getArrayValue": {
			returns: [ 1, 2, 3 ]
		},
		"getFunctionValue": {
			returns: function () { return 'function'; }
		},
		"getObjectValue": {
			returns: { id: 5, value: 'value' }
		},
		"getNullValue": {
			returns: null
		},
		"getUndefinedValue": {
			returns: undefined
		},
		"getEmptyStringValue": {
			returns: ""
		},
		"getZeroValue": {
			returns: 0
		},
		"getTrueValue": {
			returns: true
		},
		"getFalseValue": {
			returns: false
		},
		"getEmptyArrayValue": {
			returns: []
		},
		"getEmptyObjectValue": {
			returns: {}
		}
	});
    
	// Use exposed qMock's exposed assertArray & assertObject helper methods as check contents of array/object, rather than strict checking instance like QUnit.
		
	equals(mock.getNumericValue(), 10, "getNumericValue() should return 10");
    equals(mock.getStringValue(), 'data', "getStringValue() should return 'data'");
    ok(Mock._assertArray(mock.getArrayValue(), [ 1, 2, 3 ]), "getArrayValue() should return [ 1, 2, 3 ]");
    equals(mock.getFunctionValue()(), 'function', "getFunctionValue() when invoked should return 'function'");
    ok(Mock._assertObject(mock.getObjectValue(), { id: 5, value: 'value' }), "getObjectValue() should return object");
    equals(mock.getNullValue(), null, "getNullValue() should return null");
    equals(mock.getUndefinedValue(), undefined, "getUndefinedValue() should return undefined");
    equals(mock.getEmptyStringValue(), "", "getEmptyStringValue() should return ''");
    equals(mock.getZeroValue(), 0, "getZeroValue() should return 0");
    equals(mock.getTrueValue(), true, "getTrueValue() should return true");
    equals(mock.getFalseValue(), false, "getFalseValue() should return false");
    ok(Mock._assertArray(mock.getEmptyArrayValue(), [ ]), "getEmptyArrayValue() should return [ ]");
    ok(Mock._assertObject(mock.getEmptyObjectValue(), { }), "getEmptyObjectValue() should return { }");
		
    ok(mock.verify(), "verify() should be true");

	mock = new Mock({
		"returnsTest": {
			returns: "return"
		},
		"isMethod": {
			accepts: Variable
		}
	});
			
	mock.returnsTest()
	mock.isMethod("test");
	ok(mock.verify(), "verify() should be true");		
	
});

test("mocked method interface with single (Number) primitive parameter expectation >> default type check and required", function () {

	expect(124);
	
	// refactor to use pdoc syntax
	// See also mdc for conventional interface declarations
	
	/**
	*
	* @description Setup mock with single method 'swing'.
	* @param swing() {String} mock expects argument of type (String) to be passed.
	*
	**/
	
	/**
	*
	* Re-run tests with mocked method interface declared with a Constructor and with typed parameter assertion.
	*
	**/
	var ninja = new Mock();
	ninja
		.expects(1)
			.method("swing")
			.accepts(Number);
	
	// BAD EXERCISES
	
	ninja.swing(); // Test no arguments

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed No parameters");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed no parameters");
	    equals(error[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException for (String)");
	}

	ninja.reset();
	
	// Test invalid argument type - Constructors

	ninja.swing(String);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (String)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (String)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String)");
	}

	ninja.reset(); 
	
	ninja.swing(Boolean);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Boolean)");
	}
	
	ninja.reset();
	
	ninja.swing(Array);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Array)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Array)");
	}
	
	ninja.reset();
	
	ninja.swing(Object);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Object)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Object)");
	}
	
	ninja.reset();
	
	ninja.swing(Function);
	
	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Function)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Function)");
	}
	
	ninja.reset();
	
	ninja.swing(RegExp);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (RegExp)");
	}

	ninja.reset();
	
	// Test invalid argument type - values
	
	ninja.swing("string");

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (String: string)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String: string)");
	}

	ninja.reset(); 
	
	ninja.swing(false);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Boolean: false)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Boolean: false)");
	}
	
	ninja.reset();
	
	ninja.swing([]);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Array: [])");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Array: [])");
	}
	
	ninja.reset();
	
	ninja.swing({});

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Object: {})");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Object: {})");
	}
	
	ninja.reset();
	
	ninja.swing(function(){});
	
	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Function: function(){})");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Function: function(){})");
	}
	
	ninja.reset();
	
	ninja.swing(/test/);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (RegExp: /test/)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (RegExp: /test/)");
	}

	ninja.reset();

	// Test false positive

	ninja.swing("1");

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (String: 1)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String: 1)");
	}

	ninja.reset();

	// GOOD Exercises

	ninja.swing(0); // Test same argument type - falsy value
	
	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 0) - right type, non-matching value" );

	ninja.reset();

	// Test same argument type

	ninja.swing(2);
	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 2) - right type, non-matching value" );

	ninja.reset();

	// Test same argument AND value

	ninja.swing(1);
	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 1) - right type, matching value" );
	
	/**
	*
	* Re-run tests with mocked method interface declared with a value and with typed parameter assertion.
	*
	**/
	
    var ninja = new Mock();
	ninja
		.expects(1)
			.method('swing')
			.accepts(1);

	// BAD EXERCISES

	ninja.swing(); // Test no arguments

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed no parameters");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed no parameters");
	    equals(error[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException for (String)");
	}

	ninja.reset();

	// Test invalid argument type - Constructors

	ninja.swing(String);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (String)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (String)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String)");
	}

	ninja.reset(); 

	ninja.swing(Boolean);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Boolean)");
	}

	ninja.reset();

	ninja.swing(Array);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Array)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Array)");
	}

	ninja.reset();

	ninja.swing(Object);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Object)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Object)");
	}

	ninja.reset();

	ninja.swing(Function);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Function)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Function)");
	}

	ninja.reset();

	ninja.swing(RegExp);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (RegExp)");
	}

	ninja.reset();

	// Test invalid argument type - values

	ninja.swing("string");

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (String: string)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String: string)");
	}

	ninja.reset(); 

	ninja.swing(false);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Boolean: false)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Boolean: false)");
	}

	ninja.reset();

	ninja.swing([]);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Array: [])");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Array: [])");
	}

	ninja.reset();

	ninja.swing({});

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Object: {})");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Object: {})");
	}

	ninja.reset();

	ninja.swing(function(){});

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Function: function(){})");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Function: function(){})");
	}

	ninja.reset();

	ninja.swing(/test/);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (RegExp: /test/)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (RegExp: /test/)");
	}

	ninja.reset();

	// Test false positive

	ninja.swing("1");

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (String: 1)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String: 1)");
	}

	ninja.reset();

	// GOOD Exercises

	ninja.swing(0); // Test same argument type - falsy value

	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 0) - right type, non-matching value" );

	ninja.reset();

	// Test same argument type

	ninja.swing(2);
	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 2) - right type, non-matching value" );

	ninja.reset();

	// Test same argument AND value

	ninja.swing(1);
	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 1) - right type, matching value" );
	
	/**
	*
	* Re-run tests with mocked method interface declared via interface() helper function with a Constructor and with typed parameter assertion.
	*
	**/
	
	// Test single parameter value expectations, no return value
	var ninja = new Mock();
	ninja
		.expects(1)
		.method('swing')
		.interface(
			{accepts: [Number]}
		);
		
	// BAD EXERCISES
	ninja.swing(); // Test no arguments

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed no parameters");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed no parameters");
	    equals(error[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException for (String)");
	}

	ninja.reset();

	// Test invalid argument type - Constructors

	ninja.swing(String);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (String)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (String)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String)");
	}

	ninja.reset(); 

	ninja.swing(Boolean);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Boolean)");
	}

	ninja.reset();

	ninja.swing(Array);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Array)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Array)");
	}

	ninja.reset();

	ninja.swing(Object);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Object)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Object)");
	}

	ninja.reset();

	ninja.swing(Function);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Function)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Function)");
	}

	ninja.reset();

	ninja.swing(RegExp);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (RegExp)");
	}

	ninja.reset();

	// Test invalid argument type - values

	ninja.swing("string");

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (String: string)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String: string)");
	}

	ninja.reset(); 

	ninja.swing(false);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Boolean: false)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Boolean: false)");
	}

	ninja.reset();

	ninja.swing([]);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Array: [])");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Array: [])");
	}

	ninja.reset();

	ninja.swing({});

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Object: {})");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Object: {})");
	}

	ninja.reset();

	ninja.swing(function(){});

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Function: function(){})");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Function: function(){})");
	}

	ninja.reset();

	ninja.swing(/test/);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (RegExp: /test/)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (RegExp: /test/)");
	}

	ninja.reset();

	// Test false positive

	ninja.swing("1");

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (String: 1)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String: 1)");
	}

	ninja.reset();

	// GOOD Exercises

	ninja.swing(0); // Test same argument type - falsy value

	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 0) - right type, non-matching value" );

	ninja.reset();

	// Test same argument type

	ninja.swing(2);
	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 2) - right type, non-matching value" );

	ninja.reset();

	// Test same argument AND value

	ninja.swing(1);
	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 1) - right type, matching value" );

	/**
	*
	* Re-run tests with mocked method interface declared via interface() helper function with a value and with typed parameter assertion.
	*
	**/
	
	// Test single parameter value expectations, no return value
	var ninja = new Mock();
	ninja
		.expects(1)
		.method('swing')
		.interface(
			{accepts: [1]}
		)
		.required(1);
		
	// BAD EXERCISES

	ninja.swing(); // Test no arguments

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed no parameters");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed no parameters");
	    equals(error[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException for NO parameters");
	}

	ninja.reset();

	// Test invalid argument type - Constructors

	ninja.swing(String);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (String)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (String)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String)");
	}

	ninja.reset(); 

	ninja.swing(Boolean);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Boolean)");
	}

	ninja.reset();

	ninja.swing(Array);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Array)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Array)");
	}

	ninja.reset();

	ninja.swing(Object);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Object)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Object)");
	}

	ninja.reset();

	ninja.swing(Function);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (Function)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Function)");
	}

	ninja.reset();

	ninja.swing(RegExp);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (RegExp)");
	}

	ninja.reset();

	// Test invalid argument type - values

	ninja.swing("string");

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (String: string)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String: string)");
	}

	ninja.reset(); 

	ninja.swing(false);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Boolean: false)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Boolean: false)");
	}

	ninja.reset();

	ninja.swing([]);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Array: [])");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Array: [])");
	}

	ninja.reset();

	ninja.swing({});

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Object: {})");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Object: {})");
	}

	ninja.reset();

	ninja.swing(function(){});

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (Function: function(){})");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (Function: function(){})");
	}

	ninja.reset();

	ninja.swing(/test/);

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (RegExp: /test/)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (RegExp: /test/)");
	}

	ninja.reset();

	// Test false positive

	ninja.swing("1");

	try {
		ninja.verify();	
	    fail("verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	} catch (error) {	
	    equals(error.length, 1, "verify() should return 1 error when swing() passed incorrect parameter type (String: 1)");
	    equals(error[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException for (String: 1)");
	}

	ninja.reset();

	// GOOD Exercises

	ninja.swing(0); // Test same argument type - falsy value

	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 0) - right type, non-matching value" );

	ninja.reset();

	// Test same argument type

	ninja.swing(2);
	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 2) - right type, non-matching value" );

	ninja.reset();

	// Test same argument AND value

	ninja.swing(1);
	ok( ninja.verify(), "verify() should pass after swing was called once with (Number: 1) - right type, matching value" );
	
});

test("mock with single & multiple (String) primitive parameter expectation - default type check", function () {
	
	// Test String primitive
	
	var samurai = new Mock();
	
	samurai
		.expects(1)
			.method('run')
			.accepts('fast');
				
	// Bad exercise
			
	// Test invalid argument type
			
	samurai.run(1);
	try {
	       samurai.verify();	
	       fail("verify() should throw exception when run called with incorrect argument type");
	   } catch (e) {	
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
    
	samurai.reset();
	
	// Test same argument type - falsy value
	
	samurai.run("");
	ok( samurai.verify(), "verify() should pass after swing was called once with string primitive type - falsy value ''" );
	
	samurai.reset();
	
	// Test same argument type
			
	samurai.run("slow");
	ok( samurai.verify(), "verify() should pass after swing was called once with string primitive type but wrong value" );

	samurai.reset();
	
	// Test same argument AND value
			
	samurai.run("fast");
	ok( samurai.verify(), "verify() should pass after swing was called once with string primitive type and exact expected value" );
	
});

test("mock with single & multiple (Boolean) primitive parameter expectation - default type check", function () {
	
	// Test Boolean primitive
	
	var wizard = new Mock();
	
	wizard
		.expects(1)
			.method('fireball')
			.accepts(true);
			
	// Bad Exercise
			
	// Test invalid argument type

	wizard.fireball("true");

	try {
	       wizard.verify();	
	       fail("verify() should throw exception when run called with incorrect argument type");
	   } catch (e) {	
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
	
	wizard.reset();
	
	// Good Exercise
	
	// Test same argument type - falsy value
			
	wizard.fireball(false);
	ok( wizard.verify(), "verify() should pass after fireball was called once with boolean primitive type" );
	
	wizard.reset();
		
	// Test same argument type and exact same value
	
	wizard.fireball(true);
			
	ok( wizard.verify(), "verify() should pass after fireball was called once with boolean primitive type and exact expected value" );
	
});

test("mock with single & multiple primitive parameter expectation - strict value check", function () {
    
	expect(22);
	
	// Test string primitive
    
    var ninja = new Mock();
	ninja
		.expects(1)
			.method('swing')
			.accepts(1)
			.strict();
			
	// Test invalid argument type
			
	ninja.swing("one");
			
	try {
	       ninja.verify();	
	       fail("verify() should throw exception when swing called with incorrect argument type");
	   } catch (e) {	
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentValueException", "verify() error type should be IncorrectArgumentValueException");
	   }
    
	ninja.reset();
			
	// Test invalid argument value
			
	ninja.swing(2);
	try {
	       ninja.verify();	
	       fail("verify() should throw exception when swing called with incorrect argument value");
	   } catch (e) {	
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentValueException", "verify() error type should be IncorrectArgumentValueException");
	   }
	
	// Good Exercise
	
	ninja.reset();
			
	ninja.swing(1);
			
	ok( ninja.verify(), "verify() should pass after swing was called once with number primitive type" );
	
	// Test number primitive
	
	var samurai = new Mock();
	
	samurai
		.expects(1)
			.method('run')
			.accepts('fast')
			.strict();
			
	// Bad Exercises
	
	// Test invalid argument type
	
	samurai.run(1)
	
	try {
	       samurai.verify();	
	       fail("verify() should throw exception when swing called with incorrect argument type");
	   } catch (e) {	
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentValueException", "verify() error type should be IncorrectArgumentValueException");
	   }
    
	samurai.reset();
	
	// Test invalid argument value
	
	samurai.run("slow")
	
	try {
	       samurai.verify();	
	       fail("verify() should throw exception when swing called with incorrect argument type");
	   } catch (e) {	
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentValueException", "verify() error type should be IncorrectArgumentValueException");
	   }
    
	samurai.reset();
	
	// Good Exercise
			
	samurai.run("fast");
			
	ok( samurai.verify(), "verify() should pass after run was called once with string primitive type" );
	
	// Test Boolean primitives
	
	var wizard = new Mock();
	
	wizard
		.expects(1)
			.method('fireball')
			.accepts(true)
			.strict();

	// Bad Exercises

	// Test invalid argument type

	wizard.fireball("true")

	try {
	       wizard.verify();	
	       fail("verify() should throw exception when swing called with incorrect argument type");
	   } catch (e) {	
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentValueException", "verify() error type should be IncorrectArgumentValueException");
	   }

	wizard.reset();

	// Test invalid argument value

	wizard.fireball(false)

	try {
	       wizard.verify();	
	       fail("verify() should throw exception when swing called with incorrect argument type");
	   } catch (e) {	
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentValueException", "verify() error type should be IncorrectArgumentValueException");
	   }

	wizard.reset();
	
	// Good Exercise
			
	wizard.fireball(true);
			
	ok( wizard.verify(), "verify() should pass after fireball was called once with boolean primitive type" );
	
	// Test multiple parameter value expectations, no return value
	var jedi = new Mock({
		"setForceLevel" : {
			calls: 1,
			accepts: [{
					params: [3] // 1st presentation to interface
				}, {
					params: [9] // 2nd presentation to interface
				}
			],
			required: 1
		}
	});
	
	
/*	Proposed API - purty.
	
	var jedi = new Mock({
		"setForceLevel" : {
			"calls": 1,
			"interface": [
				{ accepts: [3, Object], returns: true },
				{ accepts: [9, Object], returns: false}
			],
			required: 1
		}
	}); */
		
	// Bad Exercises
		
	// Test no argument type

	jedi.setForceLevel();
	try {
	   jedi.verify();	
       fail("verify() should throw exception when 'setForceLevel' called with no arguments");
    } catch (e) {	
       equals(e.length, 1, "verify() should return an array of 1 errors");
       equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
    }

	jedi.reset();
	
	// Test invalid argument types
	
	jedi.setForceLevel("one");
	try {
	   jedi.verify();	
       fail("verify() should throw exception when 'setForceLevel' called with incorrect argument type");
    } catch (e) {	
       equals(e.length, 2, "verify() should return an array of 2 errors correlating with two interface expectations");
       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
    }

	jedi.reset();
	
	// Good exercises
	// Test overloaded method with correct parameter type but wrong value
	jedi.setForceLevel(2, "overloaded");
	
	ok( jedi.verify(), "verify() should pass after 'setForceLevel' was called once with Number primitive type but wrong exact expected value" );
	jedi.reset();
	
	// Test method with correct parameter type and exact value ('first presentation')
	
	jedi.setForceLevel(3);
	ok( jedi.verify(), "verify() should pass after 'setForceLevel' was called once with Number primitive type and first exact expected value" );
	jedi.reset();
	
	// Test method with correct parameter type and exact value ('second presentation')
	
	jedi.setForceLevel(9);
	ok( jedi.verify(), "verify() should pass after 'setForceLevel' was called once with Number primitive type and second exact expected value" );
	jedi.reset();
	

});


test("mock with falsey (null & undefined) argument types - strict value check only [default] (no type check available)", function () {
    
	expect(25);
    
    var ninja = new Mock();

	ninja
		.expects(1)
			.method('giveUp')
			.accepts(null);
			
	// Bad Exercise
			
	// Test invalid argument type
			
	ninja.giveUp("ok");
	try {
	       ninja.verify();
	       fail("verify() should throw exception when 'giveUp' called with incorrect argument type: String");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
    
	ninja.reset();
	
	// Test potential false positive - undefined
	
	ninja.giveUp(undefined);
	try {
	       ninja.verify();
	       fail("verify() should throw exception when 'givep' called with incorrect argument type: undefined");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
    
	ninja.reset();

	// Test potential false positive - falsy 0
	
	ninja.giveUp(undefined);
	try {
	       ninja.verify();
	       fail("verify() should throw exception when swing called with incorrect argument type: 0");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
    
	ninja.reset();
	
	// Test potential false positive - falsy ""
	
	ninja.giveUp(undefined);
	try {
	       ninja.verify();
	       fail("verify() should throw exception when 'giveUp' called with incorrect argument type: ''");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
    
	ninja.reset();
	
	// Test potential false positive - false
	
	ninja.giveUp(false);
	try {
	       ninja.verify();
	       fail("verify() should throw exception when 'giveUp' called with incorrect argument type: false");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
    
	ninja.reset();
			
	// Good Exercise
			
	ninja.giveUp(null);
			
	ok( ninja.verify(), "verify() should pass after 'giveUp' was called once with null type" );
	
	var samurai = new Mock();
	
	samurai
		.expects(1)
			.method('fear')
			.accepts(undefined);
			
	// Bad Exercise
	
	// Test invalid argument type
			
	samurai.fear('everything');
			
	try {
	       samurai.verify();
	       fail("verify() should throw exception when 'fear' called with incorrect argument type: String");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
	
	samurai.reset();
	
	// Test potential false positive - null
	
	samurai.fear(null);
			
	try {
	       samurai.verify();
	       fail("verify() should throw exception when 'fear' called with incorrect argument type: null");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
	
	samurai.reset();
	
	// Test potential false positive - false
	
	samurai.fear(false);
			
	try {
	       samurai.verify();
	       fail("verify() should throw exception when 'fear' called with incorrect argument type: String");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
	
	samurai.reset();
	
	// Good Exercise
	
	samurai.fear(undefined);
	
	ok( samurai.verify(), "verify() should pass after 'fear' was called once with falsey type" );
	
	var wizard = new Mock();
	
	wizard
		.expects(1)
			.method('teleport')
			.accepts(false);
			
	// Bad Exercise
	
	// Test invalid argument type
			
	wizard.teleport('maybe');
			
	try {
	       wizard.verify();
	       fail("verify() should throw exception when 'teleport' called with incorrect argument type: String");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
	
	wizard.reset();
	
	// Test potential false positive - null
	
	wizard.teleport(null);
			
	try {
	       wizard.verify();
	       fail("verify() should throw exception when 'teleport' called with incorrect argument type: null");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
	
	wizard.reset();
	
	// Test potential false positive - false
	
	wizard.teleport(undefined);
			
	try {
	       wizard.verify();
	       fail("verify() should throw exception when 'teleport' called with incorrect argument type: undefined");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
	   }
	
	wizard.reset();
	
	// Good Exercise
	
	wizard.teleport(false);
	
	ok( wizard.verify(), "verify() should pass after 'teleport' was called once with falsey type" );

});

test("mock with composite argument types: object (literal) [enum] - type checking members", function () {
    
	expect(10);
    
    var ninja = new Mock();
    
    ninja.expects(1)
		.method('describe')
		.accepts({
			 name: "Jackie",
			 surname: "Chan",
			 age: 46
		});
		
	// Bad Exercise

	// Test no arguments
    
    try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
	ninja.reset();
	
	// Test incomplete arguments

	ninja.describe('Jet Li');
    
    try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify()[0] error type should be IncorrectArgumentsException");
    }

	ninja.reset();
	
	// Good Exercise
	
	// Test complete arguments, different values
	
	ninja.describe({
		 name: "Jet",
		 surname: "Li",
		 age: 37
	});
	
	ok(ninja.verify(), "verify() should be true");
	
	ninja.reset();
	
	// Test exact arguments - ensure no false positive
	
	ninja.reset();
	
	ninja.describe({
		 name: "Jackie",
		 surname: "Chan",
		 age: 46
	});
	
	ok(ninja.verify(), "verify() should be true");
	
	// Nested Composites - setup
	
	var samurai = new Mock();
	
	samurai
		.expects(1)
			.method('describe')
			.accepts({
				name: "Jet Li",
				age: 37,
				'marshal arts': ['karate', 'kung-fu', 'boxing'],
				weapon: {
					damage: '+2',
					type: 'sword'
				}				
			})
		.andExpects()
			.property("rank")
			.withValue("General")
		.andExpects(1)
			.method("getDamage")
			.returns(-30);
			
	// Good Exercise
	
	// Test correct argument types - wrong values
	
	samurai.describe({
		name: "Jet Li",
		age: 37,
		'marshal arts': ['karate', 'boxing', 'kung-fu'],
		weapon: {
			damage: '+2',
			type: 'sword'
		}				
	});
	
	samurai.getDamage();
	
	ok(samurai.verify(), "verify() should be true");
	ok((samurai.rank === "General"), "verify() should be true");

	samurai.reset();
	
	// Test correct argument types and exact values
	
	samurai.describe({
		name: "Jet Li",
		age: 37,
		'marshal arts': ['karate', 'kung-fu', 'boxing'],
		weapon: {
			damage: '+2',
			type: 'sword'
		}				
	});
	
	samurai.getDamage();
	
	ok(samurai.verify(), "verify() should be true");
	ok((samurai.rank === "General"), "verify() should be true");
	
});

test("mock with composite argument types: object (literal) [enum] - strict type checking members", function () {
    
	expect(11);
    
    var ninja = new Mock();
    
    ninja.expects(1)
		.method('describe')
		.accepts({
			 name: "Jackie",
			 surname: "Chan",
			 age: 46
		})
		.strict();
		
	// Bad Exercise

	// Test no arguments
    
    try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
	ninja.reset();
	
	// Test incomplete arguments

	ninja.describe('Jet Li');
    
    try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify()[0] error type should be IncorrectArgumentsException");
    }

	ninja.reset();
	
	// Test complete arguments, different values
	
	ninja.describe({
		 name: "Jet",
		 surname: "Li",
		 age: 37
	});
	
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify()[0] error type should be IncorrectArgumentsException");
    }
		
	ninja.reset();
	
	// Test exact arguments - ensure no false positive
	
	ninja.reset();
	
	ninja.describe({
		 name: "Jackie",
		 surname: "Chan",
		 age: 46
	});
	
	ok(ninja.verify(), "verify() should be true");
	
	// Nested Composites - setup
	
	var samurai = new Mock();
	
	samurai
		.expects(1)
			.method('describe')
			.accepts({
				name: "Jet Li",
				age: 37,
				'marshal arts': ['karate', 'kung-fu', 'boxing'],
				weapon: {
					damage: '+2',
					type: 'sword'
				}				
			})
			.strict()
		.andExpects()
			.property("rank")
			.withValue("General")
		.andExpects(1)
			.method("getDamage")
			.returns(-30);
			
	// Bad Exercise
	
	// Test correct argument types - wrong values
	
	samurai.describe({
		name: "Jet Li",
		age: 37,
		'marshal arts': ['karate', 'boxing', 'kung-fu'],
		weapon: {
			damage: '+2',
			type: 'sword'
		}				
	});
	
	samurai.getDamage();
	
	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify()[0] error type should be IncorrectArgumentsException");
    }
	
	samurai.reset();
	
	// Test correct argument types and exact values
	
	samurai.describe({
		name: "Jet Li",
		age: 37,
		'marshal arts': ['karate', 'kung-fu', 'boxing'],
		weapon: {
			damage: '+2',
			type: 'sword'
		}				
	});
	
	samurai.getDamage();
	
	ok(samurai.verify(), "verify() should be true");
	ok((samurai.rank === "General"), "verify() should be true");
	
});

test("mock with composite argument types: array", function () {
    
	expect(8);
    
    var ninja = Mock();
    
    ninja
		.expects(1)
			.method('setSkills')
				.accepts(['swordplay', 'kung-fu', 'stealth']);
    
	// No arg
    try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 2 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
	ninja.reset();

	// Invalid arg
	ninja.setSkills(['swordplay', 1, true]);
    try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify()[0] error type should be IncorrectArgumentsException");
    }

	ninja.reset();

	// Correct Usage
	
	ninja.setSkills(['swordplay', 'kung-fu', 'stealth']);
	ok(ninja.verify(), "verify() should be true");
	
	// Nested object Literals within array
	
	var jedi = new Mock();
	
	jedi
		.expects(0, 1)
			.method('setMasters')
			.accepts([{
				'mace windu': 'Samual L Jackson'
			},{
				'yoda': 'CGI'
			},{
				'Obi-wan Kenobi': 'Ewan McGregor'
			}]);
			
	
	// Invalid arg
	jedi.setMasters([{
		'mace windu': 'Samual L Jackson'
	},{
		'yoda': 'CGI'
	},{
		'Qui-Gon Jinn': 'Liam Neeson'
	}]);
	
    try {
        jedi.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify()[0] error type should be IncorrectArgumentsException");
    }

	jedi.reset();

	// Correct Usage

	jedi.setMasters([{
		'mace windu': 'Samual L Jackson'
	},{
		'yoda': 'CGI'
	},{
		'Obi-wan Kenobi': 'Ewan McGregor'
	}]);
	ok(jedi.verify(), "verify() should be true");
	
});

test("mock with composite argument types: Date & RegExp", function () {
	
	expect(4)
	
	// Not sure how can compare beyond looking at constructors...
	
	var ninja = new Mock();
	
	ninja
		.expects(1)
			.method("chooseTarget")
			.accepts("Jet Li, Bruce Lee, Chuck Norris", /Bruce Lee/)
			.strict(true);
		
	ninja.chooseTarget("Jet Li, Bruce Lee, Chuck Norris", /Bruce Lee/);
	
	ok(ninja.verify(), "verify() should be true");
	
	var samurai = new Mock();
	
	var date = new Date();
	
	samurai
		.expects(1)
			.method("timeOfFight")
			.accepts(date)
			.strict(true);
		
		samurai.timeOfFight(new Date(1970));

	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify()[0] error type should be IncorrectArgumentsException");
    }

	samurai.reset();
	
	samurai.timeOfFight(date);
	
	ok(samurai.verify(), "verify() should be true");
		
});

test("mock with custom object argument types", function () {
	
	var Sword = function Sword() {},
		Shield = function Shield() {},
		katana = new Sword(),
		wooden = new Shield();
    
	expect(7)
	
	// Use to check strict argument checking
	
	var ninja = new Mock();
	
	ninja
		.expects(1)
			.method("setSword")
			.accepts(katana);
			
	ninja.setSword(wooden);
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
    }

    ninja.reset();

	// Try with null types
	ninja.setSword(null);
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
    }

    ninja.reset();

	ninja.setSword(undefined);
			
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
    }

    ninja.reset();
		
	ninja.setSword(katana);
	
	ok(ninja.verify(), "verify() should be true");
	
});


test("mock with pass-through argument types: Selector & Variable", function () {
	
	expect(15);
	
	function Custom () {};
	
	// Allow pass-through argument types (and implicitly values)
	
	var ninja = new Mock();
	
	ninja
		.expects(1)
			.method("hitOpponents")
			.accepts(Variable);
			
	// Good Exercise
	
	// Test primitives
	
	ninja.hitOpponents(1);
	
	ok(ninja.verify(), "verify() should be true with primitive argument type: 1");
	
	ninja.reset();
	
	ninja.hitOpponents("hard");
	
	ok(ninja.verify(), "verify() should be true with primitive argument type: \"hard\"");
	
	ninja.reset();
	
	ninja.hitOpponents(true);
	
	ok(ninja.verify(), "verify() should be true with primitive argument type: true");
	
	ninja.reset();
	
	// Test Composites
	
	ninja.hitOpponents(function() {});
	
	ok(ninja.verify(), "verify() should be true with composite argument type: Function () {}");
	
	ninja.reset();
	
	ninja.hitOpponents({});
	
	ok(ninja.verify(), "verify() should be true with composite argument type: {}");
	
	ninja.reset();
	
	ninja.hitOpponents([]);
	
	ok(ninja.verify(), "verify() should be true with composite argument type: []");
	
	ninja.reset();
	
	ninja.hitOpponents(new Date());
	
	ok(ninja.verify(), "verify() should be true with composite argument type: new Date ()");
	
	ninja.reset();
	
	ninja.hitOpponents(new Custom ());
	
	ok(ninja.verify(), "verify() should be true with composite argument type: new Custom ()");
	
	ninja.reset();
	
	// Test falsy values
	
	ninja.hitOpponents(null);
	
	ok(ninja.verify(), "verify() should be true with falsy argument type: null");
	
	ninja.reset();
	
	ninja.hitOpponents(undefined);
	
	ok(ninja.verify(), "verify() should be true with falsy argument type: undefined");
	
	ninja.reset();
	
	ninja.hitOpponents(false);
	
	ok(ninja.verify(), "verify() should be true with falsy argument type: false");
	
	ninja.reset();
	
	ninja.hitOpponents("");
	
	ok(ninja.verify(), "verify() should be true with falsy argument type: \"\"");
	
	ninja.reset();
	
	ninja.hitOpponents(0);
	
	ok(ninja.verify(), "verify() should be true with falsy argument type: 0");
	
	ninja.reset();
			
	ninja.hitOpponents(Variable);
	
	ok(ninja.verify(), "verify() should be true with pass-through object: Variable");
	
	var samurai = new Mock();
	
	samurai
		.expects(1)
			.method("findArmour")
			.accepts(Selector);
			
	samurai.findArmour(Selector);
	
	ok(samurai.verify(), "verify() should be true with pass-through object: Selector");
		
});

test("mock with multiple parameters - required total arguments", function () {
	
	expect(7);
	
	function Custom() {};
	
	var ninja = new Mock();
	
	ninja
		.expects(1)
			.method("testMultipleParameters")
			.accepts(1, "string", true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom() )
			.required(11)
			.overload(false);
 			// Could use same logic for RANGES on call method?
		
	// Bad Exercise
	
	// Test no arguments	
	
	ninja.testMultipleParameters();
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
    }
		
	ninja.reset();
	
	// Test too few arguments - method underloading	
	
	ninja.testMultipleParameters("string", 1, true, null, undefined, {} );
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
    }
		
	ninja.reset();
	
	// Test too many arguments - method overloading
	
	ninja.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom(), "string" );
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
    }
		
	ninja.reset();
	
	// Test incorrect arguments - first two switched
	
	ninja.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom() );
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
        equals(e[1].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}

	ninja.reset();
	
	// Good Exercise
	
	ninja.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom() );
	ok(ninja.verify(), "verify() should be true");

});

test("w/ JSON: mock with multiple parameters - required total arguments", function () {
	
	expect(7);
	
	function Custom() {};
	
	var ninja = new Mock({
		"testMultipleParameters": {
			accepts: [1, "string", true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom()],
			calls: 1,
			required: 11,
			overload: false
		}
	});
			
	// Bad Exercise
	
	// Test no arguments	
	
	ninja.testMultipleParameters();
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
    }
		
	ninja.reset();
	
	// Test too few arguments - method underloading	
	
	ninja.testMultipleParameters("string", 1, true, null, undefined, {} );
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
    }
		
	ninja.reset();
	
	// Test too many arguments - method overloading
	
	ninja.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom(), "string" );
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
    }
		
	ninja.reset();
	
	// Test incorrect arguments - first two switched
	
	ninja.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom() );
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
        equals(e[1].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}

	ninja.reset();
	
	// Good Exercise
	
	ninja.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom() );
	ok(ninja.verify(), "verify() should be true");

});


test("mock with multiple parameters - all optional arguments", function () {
	
	expect(15);
	
	function Custom() {};
	
	var samurai = new Mock();
	
	samurai
		.expects(1)
			.method("testMultipleParameters")
			.accepts(1, "string", true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom() )
	
	// Bad Exercises
	
	// Single incorrect argument

	samurai.testMultipleParameters("string");
	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}
	
	samurai.reset();
	
	// Some arguments - first two switched around to be incorrect
	
	samurai.testMultipleParameters("string", 1, true, null, undefined, {});
	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
        equals(e[1].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}
	
	samurai.reset();
	
	// All arguments - last two switched around to be incorrect
	
	samurai.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom() )
	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
        equals(e[1].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}	

	samurai.reset();
	
	// Too many arguments - method overloading - first two switched to be incorrect - overloaded arguments should be ignored
	
	samurai.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom(), null );
	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
        equals(e[1].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}

	samurai.reset();
	
	// Good Exercises
	
	// No Arguments
	samurai.testMultipleParameters();
	ok(samurai.verify(), "verify() should be true");
	
	samurai.reset();
	
	// Some Arguments
	samurai.testMultipleParameters(1, "string", true, null, undefined, {});
	ok(samurai.verify(), "verify() should be true");
	
	samurai.reset();
	
	// All Arguments - test false positive
	
	samurai.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom() );
	ok(samurai.verify(), "verify() should be true");
	
	samurai.reset();
	
	// Overloaded method call
	samurai.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom(), null );
	ok(samurai.verify(), "verify() should be true");
	
});

test("w/ JSON: mock with multiple parameters - all optional arguments", function () {
	
	expect(15);
	
	function Custom() {};
	
	var samurai = new Mock({
		"testMultipleParameters": {
			accepts: [1, "string", true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom()],
			calls: 1
		}
	});
	
	// Bad Exercises
	
	// Single incorrect argument

	samurai.testMultipleParameters("string");
	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}
	
	samurai.reset();
	
	// Some arguments - first two switched around to be incorrect
	
	samurai.testMultipleParameters("string", 1, true, null, undefined, {});
	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
        equals(e[1].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}
	
	samurai.reset();
	
	// All arguments - last two switched around to be incorrect
	
	samurai.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom() )
	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
        equals(e[1].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}	

	samurai.reset();
	
	// Too many arguments - method overloading - first two switched to be incorrect - overloaded arguments should be ignored
	
	samurai.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom(), null );
	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
        equals(e[1].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}

	samurai.reset();
	
	// Good Exercises
	
	// No Arguments
	samurai.testMultipleParameters();
	ok(samurai.verify(), "verify() should be true");
	
	samurai.reset();
	
	// Some Arguments
	samurai.testMultipleParameters(1, "string", true, null, undefined, {});
	ok(samurai.verify(), "verify() should be true");
	
	samurai.reset();
	
	// All Arguments - test false positive
	
	samurai.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom() );
	ok(samurai.verify(), "verify() should be true");
	
	samurai.reset();
	
	// Overloaded method call
	samurai.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date(), /RegExp/, Selector, new Custom(), null );
	ok(samurai.verify(), "verify() should be true");
	
});

test("mock with single / multiple parameters and matched return values", function () {

	expect(13);
	
	var ninja = new Mock();
	ninja
		.expects(1)
			.method("swing")
			.interface(
				{accepts: ["hard"], returns: "hit"} // presentation 1
			);
			
	// Bad Exercises
	
	// Wrong Argument Type
	
	ninja.swing(1);
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 errors");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
 	}

	ninja.reset();

	// Good Exercises
	
	// No argument type - should just return 'global' / default undefined
	
	equals( ninja.swing() , undefined, "ninja.swing() should return 'undefined' when called without parameters");
    ok(ninja.verify(), "verify() should be true");

	ninja.reset();
	
	// Argument of right type but wrong value
	equals( ninja.swing("soft") , undefined, "ninja.swing() should return 'undefined' when called with argument of right type but non-predefined value");
    ok(ninja.verify(), "verify() should be true");

	ninja.reset();
	
	// Argument of right type and matching value
	equals( ninja.swing("hard") , "hit", "ninja.swing() should return 'hit' when called with 'hard'");
    ok(ninja.verify(), "verify() should be true");

	ninja.reset();
	
	// TETSTSTSTSTSTSS!
	
	// Juice Tests
	
	// mock the file interface			
	var fileMock = new Mock({
		"readWhole" : {
			returns : 'Foo bar baz'
		}
	});
	// mock there being no .tt or .haml template, but there being a .tash template
	var fs = new Mock({
		isFile : {
			interface: [
				{accepts: ['templates/index.tt'], returns: false},
				{accepts: ['templates/index.haml'], returns: false},
				{accepts: ['templates/index.tash'], returns: true},
			],
			calls: 3 // Only use if bothered about strict number of calls.
		},
		rawOpen : {
			accepts: ['templates/index.tash'], // alternative declaration of expectations without interface()
			returns: fileMock,
			calls: 1
		}
	});
	
	equals( fs.isFile('templates/index.tt') , false, "fs.isFile('templates/index.tt') should return 'false'");
	equals( fs.isFile('templates/index.haml') , false, "fs.isFile('templates/index.haml') should return 'false'");
	equals( fs.isFile('templates/index.tash') , true, "fs.isFile('templates/index.tash') should return 'true'");
	equals( fs.rawOpen('templates/index.tt').readWhole() , 'Foo bar baz' , "fs.rawOpen('templates/index.tt') should return 'fileMock'");
	ok(fs.verify(), "verify() should be true");

});

test("mock with constructor function parameters - i.e. jQuery", function () {
    
	expect(8);
    
	// Mock jQuery
    var $ = new Mock ();
	
	$.accepts("#id")
       .expects(1)
			.method('html')
            .accepts('<span>blah</span>');

	// Bad Exercise
	
	// Test invalid parameter type
	
    $(1).html('<span>blah</span>');
    
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {	
        equals(e.length, 1, "verify() should return an array of 1 error: test invalid parameter type");
        equals(e[0].type, "InvalidConstructorException", "verify() error type should be InvalidConstructorException");
    }
    
    $.reset();

	// Test valid parameter type but wrong value
    
    $("#customid").html('<span>blah</span>');
    ok($.verify(), "verify() should be true");
    
	// Trigger strict argument checking
	
	$ = new Mock ();
	
	$.accepts("#id")
		.strict()
    	.expects(1)
			.method('html')
            .accepts('<span>blah</span>');
	

	// Test valid parameter type but wrong value - same as before but in strict mode
	
	$("#customid").html('<span>blah</span>');
	try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentValueException", "verify() error type should be IncorrectArgumentValueException");
    }

	$.reset();

	// Test valid parameter type and value, but invalid argument type to method

    $("#id").html(true);
    
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentValueException");
    }
	
    // Good Exercise

    $("#id").html('<span>blah</span>');

	// Mock the query of the J
	
	var jQuery = new Mock();
	
	jQuery
		.accepts(".ninjas")
			.expects(1)
				.method('each')
				.accepts(Function)
			.andExpects(3)
				.method('wrap')
				.accepts('<div />')
			.andExpects()
				.property('browser')
				.withValue({
					ie: false,
					mozilla: false,
					safari: false,
					opera: false,
					chrome: true
				});
	
	// Exercise
	
	jQuery(".ninjas").each(function() {
		if ( jQuery.browser.chrome === true ) {
			jQuery.wrap('<div />');
			jQuery.wrap('<div />');
			jQuery.wrap('<div />');
		}
	});
	
	// Verify
	
	ok(jQuery.verify(), "verify() should be true: jQuery is mocked :-)");
});

test("chaining", function () {
    
	expect(14);
    var $ = new Mock();
    $.accepts(".ninja")
        .expects(2)
			.method('run')
            .accepts(Variable)
            .andChain()
        .expects(1)
			.method('fight')
            .accepts('hard')
            .andChain();

    // Invalid constructor param
    
    $(1);
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 3, "verify() should return an array of 3 errors");
        equals(e[0].type, "InvalidConstructorException", "verify() error type should be InvalidConstructorException");
        equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
        equals(e[2].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
    $.reset();
    
    // No constructor param
    $().run('slow').fight('hard').run('again');
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 error");
        equals(e[0].type, "InvalidConstructorException", "verify() error type should be InvalidConstructorException");
        equals(e[1].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
    }
    
    $.reset();
    
    // Missed call to fight
    
    $(".ninja").run('at a canter');
     
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
    $.reset();

	// Good Exercises

	// Overloaded constructor param with incorrect parameter values
    
    $('.samauri').run('slow').fight('hard').run('again');
     
	ok($.verify(), "verify() should be true");
    
    $.reset();
	
	// Flag strict argument value checking
	$.strict();
	
	// Bad Exercise - invalid parameter value
	
	$('.samauri').run('slow').fight('hard').run('again');
	
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 /* should be 2*/, "verify() should return an array of 2 error");
        equals(e[0].type, "IncorrectArgumentValueException", "verify() error type should be IncorrectArgumentValueException");
        // equals(e[1].type, "IncorrectArgumentTypeException", "verify() error type should be IncorrectArgumentTypeException");
    }

	$.reset();

    // Constuctor invocation with correct parameter type and exact value

    $(".ninja").run('slow').fight('hard').run('again');

    ok($.verify(), "verify() should be true");

	// Mock jQuery with chaining
	
	var jQuery = new Mock();
	
	jQuery
		.accepts(".ninjas")
			.expects(2)
				.method('each')
				.accepts(function() {})
				.andChain()
			.andExpects(3)
				.method('wrap')
				.accepts('<div />')
				.andChain()
			.andExpects()
				.property('browser')
				.withValue({
					ie: false,
					mozilla: false,
					safari: false,
					opera: false,
					chrome: true
				});
	
	// Exercise
	
	jQuery(".ninjas").each(function() {
		if ( jQuery.browser.chrome === true ) {
			jQuery.wrap('<div />').wrap('<div />').wrap('<div />');
		}
	}).each(function () {
		//do stuff..
	});
	
	// Verify
	
	ok(jQuery.verify(), "verify() should be true: jQuery is mocked with chaining");

});

test("callbacks", function () {
    
	expect(3);
    
	var $ = new Mock();
    
    // Invalid callback
    
    $.expects(1).method('get')
        .accepts('some/url', Function)
		.required(2)
        .callFunctionWith('data response');

    var called = false;
    $.get('some/url');

    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
    }
    
    $.reset();
    
    // Correct Usage

    var called = false;    

    $.get('some/url', function (data) { called = true });
    
	equals(called, true, "called should be set to true");

});

test("QMock version 0.1 Constructor and mockedMember object API backward compatibility", function () {

	expect(2);
	
	// Setup - Test support for expectsArguments on mock Constructors
	var $ = new Mock ();
	$.expectsArguments("className");
	
	// Good Exercise
	$('.myClassName');
	
	ok($.verify(), "verify() should be true: mock supports 'expectsArguments' on mock constructors");
	
	// Setup - Test support for withArguments method on mocked methods
	
	var mock = new Mock ();
	mock
		.expects(1)
			.method("swing")
			.withArguments(1)
			.andChain()
		.andExpects(1)
			.method("run")
			.withArguments("string");
						
	// Good exercise
	mock.swing(1).run("string");
	// Verify
	ok(mock.verify(), "verify() should be true: mock supports 'withArguments' setup method on mocked members");
				
});

test("private Mock._assertArray method", function () {
		
	expect(54);
	
	var mock = new Mock();
	
	function Custom() {};
	
	// Bad Arguments
	
	ok(!Mock._assertArray(1, 2), "Mock._assertArray should be false");
	
	// Check element type - simple
	ok(Mock._assertArray([0], [0], true), "Mock._assertArray should be true (matching numbers 0)");
	ok(Mock._assertArray([10], [10]), "Mock._assertArray should be true (matching numbers)");
	ok(Mock._assertArray([10], [1]), "Mock._assertArray should be true (non-matching numbers)");
	ok(Mock._assertArray([""], [""]), "Mock._assertArray should be true (falsy matching empty strings)");
	ok(Mock._assertArray(["string"], ["string"]), "Mock._assertArray should be true (matching strings)");
	ok(Mock._assertArray([""], ["different string"]), "Mock._assertArray should be true ([\"\"], [\"different string\"])");
	ok(Mock._assertArray([false], [false]), "Mock._assertArray should be true (matching false Booleans)");
	ok(Mock._assertArray([true], [false]), "Mock._assertArray should be true (matching true Booleans)");
	ok(Mock._assertArray([false], [true]), "Mock._assertArray should be true (mismatched Booleans)");
	ok(Mock._assertArray([true], [true]), "Mock._assertArray should be true (mismatched Booleans)");
	ok(Mock._assertArray([[]], [[]]), "Mock._assertArray should be true (empty array)");
	ok(Mock._assertArray([{}], [{}]), "Mock._assertArray should be true (empty object)");
	ok(Mock._assertArray([{test: "string"}], [{test: "string"}]), "Mock._assertArray should be true (object)");
	ok(Mock._assertArray([{test: "string"}], [{test: "different string"}]), "Mock._assertArray should be true (object)");
	ok(Mock._assertArray([["nested"]], [["nested"]]), "Mock._assertArray should be true (nested arrays)");
	ok(Mock._assertArray([function() {}], [function() {}]), "Mock._assertArray should be true (function)");
	ok(Mock._assertArray([null], [null]), "Mock._assertArray should be true (null)");
	ok(Mock._assertArray([undefined], [undefined]), "Mock._assertArray should be true (undefined)");
	ok(Mock._assertArray([/re/], [/re/]), "Mock._assertArray should be true (RegExp)");
	ok(Mock._assertArray([new Date()], [new Date()]), "Mock._assertArray should be true (Date)");
	ok(Mock._assertArray([new Date()], [new Date(1970)]), "Mock._assertArray should be false: [new Date()], [new Date(1970)]");
	ok(Mock._assertArray([new Custom()], [new Custom()]), "Mock._assertArray should be true (Custom object)");
	ok(Mock._assertArray([0,"string", true, [], {}, function() {}, null, undefined, /re/, new Date()], [0,"string", true, [], {}, function() {}, null, undefined, /re/, new Date()]), "Mock._assertArray should be true (All types)");
	
	// Falsy 

	ok(!Mock._assertArray([10], [""]), "Mock._assertArray should be false: [10], [\"\"]");
	ok(!Mock._assertArray([""], [10]), "Mock._assertArray should be false: [\"\"], [10]");
	ok(!Mock._assertArray([{test: "one"}], [{test: 1}]), "Mock._assertArray should be false: [{test: \"one\"}], [{test: 1}]");
	ok(!Mock._assertArray([function() {}], []), "Mock._assertArray should be false: [function() {}], []");
	ok(!Mock._assertArray([null], [undefined]), "Mock._assertArray should be false: [null], [undefined]");
	ok(!Mock._assertArray([undefined], ["string"]), "Mock._assertArray should be false: [undefined], [\"string\"]");
	ok(!Mock._assertArray([/re/], [9]), "Mock._assertArray should be false: [/re/], [9]");
	ok(!Mock._assertArray([new Custom()], [new Number()]), "Mock._assertArray should be false: [new Custom()], [new Number()]");
	
	// Nested
	
	ok(Mock._assertArray([[[["test"]]]], [[[["test"]]]]), "Mock._assertArray should be true (nested array to 4 levels)");
	ok(Mock._assertArray(["one", ["two", ["three", ["four"]]]], ["one", ["two", ["three", ["four"]]]]), "Mock._assertArray should be true (nested array to 4 levels)");	
	
	// Test strict value checking

	ok(Mock._assertArray([0], [0], true), "Mock._assertArray should be true (matching numbers 0)");
	ok(!Mock._assertArray([10], [1], true), "Mock._assertArray should be false (non-matching numbers)");
	ok(Mock._assertArray([""], [""], true), "Mock._assertArray should be true (falsy matching empty strings)");
	ok(!Mock._assertArray([""], ["different string"], true), "Mock._assertArray should be false ([\"\"], [\"different string\"])");
	ok(Mock._assertArray([false], [false], true), "Mock._assertArray should be true (matching false Booleans)");
	ok(!Mock._assertArray([true], [false], true), "Mock._assertArray should be false (mismatched Booleans)");
	ok(!Mock._assertArray([false], [true], true), "Mock._assertArray should be true (mismatched Booleans)");
	ok(Mock._assertArray([true], [true], true), "Mock._assertArray should be true (mismatched Booleans)");
	ok(Mock._assertArray([[]], [[]], true), "Mock._assertArray should be true (empty array)");
	ok(Mock._assertArray([{}], [{}], true), "Mock._assertArray should be true (empty object)");
	ok(Mock._assertArray([{test: "string"}], [{test: "string"}], true), "Mock._assertArray should be true (object)");
	ok(!Mock._assertArray([{test: "string"}], [{test: "different string"}], true), "Mock._assertArray should be false (object)");
	ok(Mock._assertArray([["nested"]], [["nested"]], true), "Mock._assertArray should be true (nested arrays)");
	ok(Mock._assertArray([function() {}], [function() {}], true), "Mock._assertArray should be true (function)");
	ok(Mock._assertArray([null], [null], true), "Mock._assertArray should be true (null)");
	ok(Mock._assertArray([undefined], [undefined], true), "Mock._assertArray should be true (undefined)");
	ok(Mock._assertArray([/re/], [/re/], true), "Mock._assertArray should be true (RegExp)");
	ok(!Mock._assertArray([new Date()], [new Custom()], true), "Mock._assertArray should be false (Date)");
	ok(!Mock._assertArray([new Custom()], [new Date()], true), "Mock._assertArray should be true (Custom object)");
	ok(!Mock._assertArray([0,"string", true, [], {}, function() {}, null, undefined, /re/, new Date()], [1,"string", true, [], {}, function() {}, null, undefined, /re/, new Date()], true), "Mock._assertArray should be true (All types)");
	
});

test("private Mock._assertObject method", function () {
		
	expect(46)
	
	var mock = new Mock();
	
	function Custom() {};
	
	// Check bad arguments
	
	ok(!Mock._assertObject(undefined, false), "Mock._assertObject should be false");
	
	// Check element type - simple
	
	ok(Mock._assertObject({Number: 0}, {Number: 0}), "Mock._assertObject should be true (number)");
	ok(Mock._assertObject({Number: 10}, {Number: 10}), "Mock._assertObject should be true (number)");
	ok(Mock._assertObject({String: ""}, {String: ""}), "Mock._assertObject should be true (empty string)");
	ok(Mock._assertObject({String: "string"}, {String: "string"}), "Mock._assertObject should be true (string)");
	ok(Mock._assertObject({Boolean: false}, {Boolean: false}), "Mock._assertObject should be true (false Boolean)");
	ok(Mock._assertObject({Boolean: true}, {Boolean: true}), "Mock._assertObject should be true (true Boolean)");
	ok(Mock._assertObject({Array: []}, {Array: []}), "Mock._assertObject should be true (empty array)");
	ok(Mock._assertObject({Object: {}}, {Object: {}}), "Mock._assertObject should be true (empty object)");
	ok(Mock._assertObject({Object: ["one"]},{Object: ["one"]}), "Mock._assertObject should be true (object)");
	ok(Mock._assertObject({Object: {test: "one"}}, {Object: {test: "one"}}), "Mock._assertObject should be true (nested arrays)");
	ok(Mock._assertObject({Function: function() {}}, {Function: function() {}}), "Mock._assertObject should be true (function)");
	ok(Mock._assertObject({"null": null},{"null": null}), "Mock._assertObject should be true (null)");
	ok(Mock._assertObject({"undefined": undefined},{"undefined": undefined}), "Mock._assertObject should be true (undefined)");
	ok(Mock._assertObject({RegExp: /re/},{RegExp: /re/}), "Mock._assertObject should be true (RegExp)");
	ok(Mock._assertObject({Date: new Date()},{Date: new Date()}), "Mock._assertObject should be true (Date)");
	ok(Mock._assertObject({Date: new Date()},{Date: new Date(1970)}), "Mock._assertObject should be false");
	ok(Mock._assertObject({Custom: new Custom()},{Custom: new Custom()}), "Mock._assertObject should be true (Custom object)");
	ok(Mock._assertObject({Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date()}, {Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date()}), "Mock._assertObject should be true (Many native types)");
	
	// Falsy 

	ok(!Mock._assertObject({Number: 10}, {Number: "string"}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({String: "string"}, {String: function() {}}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({Array: []}, {Array: {}}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({Object: ["one"]},{Object: false}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({Function: function() {}}, {Function: false}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({"null": null},{"null": undefined}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({"undefined": undefined},{"undefined": 0}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({RegExp: /re/},{RegExp: "/re/"}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({Custom: new Custom()},{Custom: new Date()}), "Mock._assertObject should be false (Custom object)");
	
	// Nested
	ok(Mock._assertObject({"one": {"two": {"three": {"four": "value"}}}}, {"one": {"two": {"three": {"four": "value"}}}}), "Mock._assertObject should be true (nested object literals to 4 levels)");
	
	// Test strict value checking
	
	ok(Mock._assertObject({String: ""}, {String: ""}, true), "Mock._assertObject should be true (empty string)");
	ok(!Mock._assertObject({String: "string"}, {String: "different string"}, true), "Mock._assertObject should be false (empty string)");
	ok(Mock._assertObject({Boolean: true}, {Boolean: true}, true), "Mock._assertObject should be true (false Boolean)");
	ok(Mock._assertObject({Boolean: false}, {Boolean: false}, true), "Mock._assertObject should be true (false Boolean)");
	ok(!Mock._assertObject({Boolean: false}, {Boolean: true}, true), "Mock._assertObject should be false (false Boolean)");
	ok(Mock._assertObject({Number: 0}, {Number: 0}, true), "Mock._assertObject should be true (number)");
	ok(Mock._assertObject({Number: 10}, {Number: 10}, true), "Mock._assertObject should be true (number)");
	ok(!Mock._assertObject({Number: 1}, {Number: 2}, true), "Mock._assertObject should be false (true Boolean)");
	ok(!Mock._assertObject({Array: [1]}, {Array: [2]}, true), "Mock._assertObject should be false (empty array)");
	ok(!Mock._assertObject({Object: {test: 1}}, {Object: {test: 2}}, true), "Mock._assertObject should be false (empty object)");
	ok(!Mock._assertObject({Object: ["one"]},{Object: ["two"]}, true), "Mock._assertObject should be false (object)");
	ok(!Mock._assertObject({"null": null},{"null": undefined}, true), "Mock._assertObject should be false (null)");
	ok(!Mock._assertObject({"undefined": undefined},{"undefined": null}, true), "Mock._assertObject should be false (undefined)");
	ok(!Mock._assertObject({RegExp: /re/},{RegExp: ""}, true), "Mock._assertObject should be false (RegExp)");
	ok(!Mock._assertObject({Date: new Date()},{Date: new Custom()}, true), "Mock._assertObject should be false (Date)");
	ok(!Mock._assertObject({Custom: new Custom()},{Custom: new Date()}, true), "Mock._assertObject should be false (Custom object)");
	ok(!Mock._assertObject({Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date()}, {Number: 1,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date()}, true), "Mock._assertObject should be false (Many native types)");
	
	
});