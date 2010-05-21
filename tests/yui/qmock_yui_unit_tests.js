/* 

// Test Case Template 

YAHOO.qMock.unitTests.singleMethod = new YAHOO.tool.TestCase({

	name: "title of testcase",

	setUp: function() {
	
	},
	tearDown: function() {

	},
	// expected fails or errors
	_should: {
	    fail: {
	        testName: true
	        testName2: true
	    },
	    error: {
	        testGenericError: true, // any error
	        testStringError: "I'm a specific error message.", // error msg
	        testObjectError: new TypeError("Number expected."), // error obj            
	    }
	},
	// All test methods must start with 'test'
	testName: function() {
		
	}
});

*/
	
YAHOO.namespace("qMock.unitTests");
   
   	YAHOO.qMock.unitTests.singleMethod = new YAHOO.tool.TestCase({

	    name: "mock with single parameterless method (explicit execution call total, no return value)",
    
		setUp: function() {
			// Setup expectations
			this.ninja = new Mock();
			this.ninja
				.expects(1)
					.method('swing');
		},
		testInvalidMockMethodNaming: function() {
			// Exercise
			try {
				var badNinja = new Mock();
				badNinja
					.expects(1)
						.method('expects');
				fail("mock should detect bad method name 'expects'");
			} catch (e) {
				assertEquals(e.length, 1, "array of 1 error should be thrown");
				assertEquals(e[0].type, "InvalidMethodNameException", "error type should be InvalidMethodNameException");
			}
		},
		testNoExercisePhase: function() {
			// Test Bad Exercise phase - no method call
		    try {
		        this.ninja.verify();
		        fail("verify() should throw exception when swing not called");
		    } catch (e) {
		        assertEquals(e.length, 1, "verify() should return an array of 1 error");
		        assertEquals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
		    }
		},
		testOverdoneExercisePhase: function() {
			// Too many calls
			this.ninja.swing();
		    this.ninja.swing();
			try {
		        this.ninja.verify();
		        fail("verify() should throw exception when swing called too many times");
		    } catch (e) {
		        assertEquals(e.length, 1, "verify() should return an array of 1 error");
		        assertEquals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
		    }
		},
		testUndefinedReturnValue: function() {
			// Test undefined return value
		    assertEquals(this.ninja.swing(), undefined, "swing() without return value set should return undefined");
		},
		testGoodExercisePhase: function() {
			// Test Good Exercise Phase
			this.ninja.swing();
		    assert(this.ninja.verify(), "verify() should pass after swing called");
		}
	}); 
	
	YAHOO.qMock.unitTests.singleMethodMultipleExpectations = new YAHOO.tool.TestCase({

	    name: "mock with single parameterless method (arbitrary execution call range, no return value)",
    
		setUp: function() { 
			// Setup expectations
			this.ninja = new Mock();
			this.ninja
				.expects(1,3)
					.method('swing');
			
			this.samurai = new Mock();
			this.samurai
				.expects(1, Infinity)// Can use any string, inifinity symbol used here.
					.method('swing');
					
			this.wizard = new Mock();
			this.wizard
				.expects()
					.method('sendFireball')
					.atLeast(100)
					.noMoreThan(250);
		},
		testNoSwingMethodInvocation: function() {
			try {
		        this.ninja.verify();
		        fail("verify() should throw exception when swing not called");
		    } catch (e) {
		        assertEquals(e.length, 1, "verify() should return an array of 1 error");
		        assertEquals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
		    }
		},
		testOneSwingMethodInvocation: function() {
			// One swing
			this.ninja.swing();
			assert(this.ninja.verify(), "verify() should pass after swing was called once");
		},
		testTwoSwingMethodInvocations: function() {
			// One swing
			this.ninja.swing();
			this.ninja.swing();
			assert(this.ninja.verify(), "verify() should pass after swing was called once");
		},
		testThreeSwingMethodInvocations: function() {
			// One swing
			this.ninja.swing();
			this.ninja.swing();
			this.ninja.swing();
			assert(this.ninja.verify(), "verify() should pass after swing was called once");
		},
		testFourSwingMethodInvocations: function() {
			// One swing
			this.ninja.swing();
			this.ninja.swing();
			this.ninja.swing();
			this.ninja.swing();
			try {
		        this.ninja.verify();
		        fail("verify() should throw exception when swing called too many times");
		    } catch (e) {
		        assertEquals(e.length, 1, "verify() should return an array of 1 error");
		        assertEquals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
		    }
		},
		testAtLeastOneSwing: function() {
			this.samurai.swing();
			assert(this.samurai.verify(), "verify() should pass after swing was called once");
			for(var i = 0; i < 4999; i++) {
				this.samurai.swing();
			}
			assert(this.samurai.verify(), "verify() should pass after swing was called 5000 times");
		},
		testRangeOfInvocations: function() {
			for(var i = 0; i < ( 100 + Math.floor(Math.random() * (250 - 100 + 1))); i++) {
				this.wizard.sendFireball();
			}
			assert(this.wizard.verify(), "verify() should pass if sendFireball called a random amount of times between a specified range");
			this.wizard.reset();
			this.wizard.sendFireball();
			try {
		        this.wizard.verify();
		        fail("verify() should throw exception when swing out of defined call execution range");
		    } catch (e) {
		        assertEquals(e.length, 1, "verify() should return an array of 1 error");
		        assertEquals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
		    }
		}
	});
	
	YAHOO.qMock.unitTests.multipleParamterlessMethods = new YAHOO.tool.TestCase({

	    name: "mock with multiple paramterless methods",
    
		setUp: function() {
			// Setup expectations
			this.ninja = Mock();
		  	this.ninja
				.expects(1)
					.method('swing')
				.andExpects(1)
					.method('run')
				.andExpects(1)
					.method('block');
		},
		testBadExercisePhase: function() {
			 try {
		        this.ninja.verify();
		        fail("verify() should throw exception when no methods called");
		    } catch (e) {
		        assertEquals(e.length, 3, "verify() should return an array of 3 errors");
		        assertEquals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
		    }
		},
		testGoodExercisePhase: function() {
			this.ninja.swing();
		    this.ninja.run();
		    this.ninja.block();
			assert(this.ninja.verify(), "verify() should return true once swing, run and block called");
		}
	});
	
	YAHOO.qMock.unitTests.stubbedProperties = new YAHOO.tool.TestCase({

	    name: "mock with stubbed properties",
    
		setUp: function() {
			// Setup expectations
			this.ninja = new Mock();
			this.ninja
				.expects()
					.property("rank")
					.withValue("apprentice")
				.andExpects()
					.property("master")
					.withValue("The Chrome");
					
			this.samurai = new Mock();

			this.samurai
				.expects()
					.property("rank")
					.withValue("apprentice")
				.andExpects(1,2)
					.method("swing")
				.andExpects()
					.property("master")
					.withValue("The Chrome");					
			
		},
		testBadExercisePhase: function() {
			 // Test invalid property naming
			try {
				this.ninja = new Mock();
				this.ninja.expects(1).property('expects');
				fail("mock should detect bad property name 'expects'");
			} catch (e) {
				assertEquals(e.length, 1, "array of 1 error should be thrown");
				assertEquals(e[0].type, "InvalidPropertyNameException", "error type should be InvalidPropertyNameException");
			}
		},
		testGoodExercisePhase: function() {
			assert( ( (this.ninja.rank === "apprentice") && (this.ninja.master === "The Chrome") ) , "ninja mock object should have a two properties set correctly")
			this.samurai.swing();
			this.samurai.swing();
			// Good Exercise
			assert( this.samurai.verify(), "verify() should pass after swing was called once" );
			assert( ( (this.samurai.rank === "apprentice") && (this.samurai.master === "The Chrome") ) , "ninja mock object should have a two properties set correctly")
		}
	});
	
	YAHOO.qMock.unitTests.returnValues = new YAHOO.tool.TestCase({

		name: "mock with no parameters, return values",

		setUp: function() {
			this.mock = new Mock();
		    this.mock
				.expects(1)
					.method('getNumericValue').andReturn(10)
				.andExpects(1)
					.method('getStringValue').andReturn('data')
				.andExpects(1)
					.method('getArrayValue').andReturn( [ 1, 2, 3] )
				.andExpects(1)
					.method('getFunctionValue').andReturn( function () { return 'function'; } )
				.andExpects(1)
					.method('getObjectValue').andReturn( { id: 5, value: 'value' } )
				.andExpects(1)
					.method('getNullValue').andReturn(null)
				.andExpects(1)
					.method('getUndefinedValue').andReturn(undefined)
				.andExpects(1)
					.method('getEmptyStringValue').andReturn("")
				.andExpects(1)
					.method('getZeroValue').andReturn(0)
				.andExpects(1)
					.method('getTrueValue').andReturn(true)
				.andExpects(1)
					.method('getFalseValue').andReturn(false)
				.andExpects(1)
					.method('getEmptyArrayValue').andReturn([ ])
				.andExpects(1)
					.method('getEmptyObjectValue').andReturn({ });
		},
		testReturnValues: function() {
			assertEquals(this.mock.getNumericValue(), 10, "getNumericValue() should return 10");
		    assertEquals(this.mock.getStringValue(), 'data', "getStringValue() should return 'data'");
		    YAHOO.util.ArrayAssert.itemsAreEqual(this.mock.getArrayValue(), [ 1, 2, 3 ], "getArrayValue() should return [ 1, 2, 3 ]");
		    assertEquals(this.mock.getFunctionValue()(), 'function', "getFunctionValue() when invoked should return 'function'");
		    YAHOO.util.ObjectAssert.propertiesAreEqual(this.mock.getObjectValue(), { id: 5, value: 'value' }, "getObjectValue() should return object");
		    assertEquals(this.mock.getNullValue(), null, "getNullValue() should return null");
		    assertEquals(this.mock.getUndefinedValue(), undefined, "getUndefinedValue() should return undefined");
		    assertEquals(this.mock.getEmptyStringValue(), "", "getEmptyStringValue() should return ''");
		    assertEquals(this.mock.getZeroValue(), 0, "getZeroValue() should return 0");
		    assertEquals(this.mock.getTrueValue(), true, "getTrueValue() should return true");
		    assertEquals(this.mock.getFalseValue(), false, "getFalseValue() should return false");
		    YAHOO.util.ArrayAssert.itemsAreEqual(this.mock.getEmptyArrayValue(), [ ], "getEmptyArrayValue() should return [ ]");
		    YAHOO.util.ObjectAssert.propertiesAreEqual(this.mock.getEmptyObjectValue(), { }, "getEmptyObjectValue() should return { }");
		    assert(this.mock.verify(), "verify() should be true");
		}
	});
	
	YAHOO.qMock.unitTests.primitiveArguments = new YAHOO.tool.TestCase({

		name: "mock with primitive argument types",

		setUp: function() {
			
			this.ninja = new Mock();
			this.ninja
				.expects(1)
					.method('swing')
					.withArguments(1);
			
			this.samurai = new Mock();
			this.samurai
				.expects(1)
					.method('run')
					.withArguments('fast');
		
			this.wizard = new Mock();
			this.wizard
				.expects(1)
					.method('fireball')
					.withArguments(true);
					
		},
		testBadArgumentType: function() {

			this.ninja.swing("one");

			try {
			   this.ninja.verify();	
			    fail("verify() should throw exception when swing called with incorrect argument type");
			} catch (e) {	
			    assertEquals(e.length, 1, "verify() should return an array of 1 errors");
			    assertEquals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
			}

		},
		testBadArgumentValue: function() {

			this.ninja.swing(2);

			try {
			   this.ninja.verify();	
			    fail("verify() should throw exception when swing called with incorrect argument type");
			} catch (e) {	
			    assertEquals(e.length, 1, "verify() should return an array of 1 errors");
			    assertEquals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
			}

		},
		testGoodArguments: function() {
		
			this.ninja.swing(1);
			assert( this.ninja.verify(), "verify() should pass after swing was called once with number primitive type" );

			this.samurai.run('fast')
			assert( this.samurai.verify(), "verify() should pass after run was called once with string primitive type" );

			this.wizard.fireball(true);
			assert( this.wizard.verify(), "verify() should pass after fireball was called once with boolean primitive type" );
			
		}
	});
	
	YAHOO.qMock.unitTests.falseyArguments = new YAHOO.tool.TestCase({

		name: "mock with falsey (null & undefined) argument types",

		setUp: function() {

		this.ninja = new Mock();
		this.ninja
			.expects(1)
				.method('giveUp')
				.withArguments(null);
		
		this.samurai = new Mock();
		this.samurai
			.expects(1)
				.method('fear')
				.withArguments(undefined);

		},
		// All test methods must start with 'test'
		testTruthyArgument: function() {
		
			this.ninja.giveUp("ok");

			try {
			    this.ninja.verify();
			    fail("verify() should throw exception when swing called with incorrect argument type");
			} catch (e) {
			    assertEquals(e.length, 1, "verify() should return an array of 1 errors");
			    assertEquals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
			}
			
			this.samurai.fear('everything');

			try {
			    this.samurai.verify();
			    fail("verify() should throw exception when fear called with incorrect argument type");
			} catch (e) {
			    assertEquals(e.length, 1, "verify() should return an array of 1 errors");
			    assertEquals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
			}
			
		},
		testFalseyArguments: function() {
			
			this.ninja.giveUp(null);
			assert( this.ninja.verify(), "verify() should pass after giveUp was called once with null" );

			this.samurai.fear(undefined);
			assert( this.samurai.verify(), "verify() should pass after giveUp was called once with undefined" );
			
		}
	});
 
	YAHOO.util.Event.onDOMReady(function runTests(){
	    //create the logger
	    var logger = new YAHOO.tool.TestLogger("testLogger");
	    YAHOO.tool.TestRunner.add(YAHOO.qMock.unitTests.singleMethod);
	    YAHOO.tool.TestRunner.add(YAHOO.qMock.unitTests.singleMethodMultipleExpectations);
	    YAHOO.tool.TestRunner.add(YAHOO.qMock.unitTests.multipleParamterlessMethods);
	    YAHOO.tool.TestRunner.add(YAHOO.qMock.unitTests.stubbedProperties);
	    YAHOO.tool.TestRunner.add(YAHOO.qMock.unitTests.returnValues);
	    YAHOO.tool.TestRunner.add(YAHOO.qMock.unitTests.primitiveArguments);
	    YAHOO.tool.TestRunner.add(YAHOO.qMock.unitTests.falseyArguments);
		
	    //run the tests
	    YAHOO.tool.TestRunner.run();
	});