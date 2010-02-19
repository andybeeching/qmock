(function QMockTests () {

  // Closure scoped aliases to internal qMock functions
  var undefined;

	// Stub to test support for user-defined objects
	function Custom () {};

	/**
	 *
	 * Unit tests for Mock instance interface - asserting against mock API
	 *
	 */

	//module( "qMock Internal Integration Test" );

	/*

  	test("createMockFromJSON()", function() {

  	});

  */

	/**
	 * All tests follow this simple process:
	 *
	 *  1. Setup: Instantiate mocks and set expected interactions upon them. Sometimes located in the 'setup' phase of the testrunner before each test block.
	 *  2. Exercise: Execute the relevant collaborator code to interact with the mock object.
	 *  3. Verify: Call the verify method on each mock object to establish if it was interacted with correctly.
	 *  4. Reset: [Optional] Call reset method on the mock to return it's internal state to the end of the setup phase. Sometimes located in the 'teardown' phase of the testrunner after each test phase.
	 *
	 */
	module( "QMock: Stubbed properties & methods" );

 	test("mock with multiple stubbed properties", function () {

 	  expect(15);

 	  var ninja = new Mock;

 	  // Test invalid property naming
 	  try {
 	    ninja.expects(1).property('expects');
 	    ok(false, "mock should throw 'InvalidPropertyNameException' when trying to set a bad property name of 'expects'");
 	  } catch (e) {
 	    equals(e.length, 1, "array of 1 exception should be thrown");
 	    equals(e[0].type, "InvalidPropertyNameException", "exception type should be InvalidPropertyNameException");
 	  }

 	  var ninja = new Mock;

 	  ninja
 	    .expects()
 	      .property("rank")
 	      .withValue("apprentice");

 	  ok( (ninja.rank === "apprentice") , "ninja mock object should have a property with an identifier 'rank' that has a value of 'apprentice'" );

 	  ninja = new Mock;

 	  ninja
       .expects()
         .property("rank")
         .withValue("apprentice")
       .andExpects()
         .property("master")
         .withValue("The Chrome");

 	  ok( ( (ninja.rank === "apprentice") && (ninja.master === "The Chrome") ) , "ninja mock object should have two properties with the identifiers 'rank' & 'master', and values of 'apprentice' and 'The Chrome' respectively")

 	  // Composite
 	  var samurai = new Mock;

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

 	  var wizard = new Mock;

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
 	      .withValue("foo")
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
 	      .withValue(new Date(1970))
 	    .andExpects()
 	      .property("custom object")
 	      .withValue(new Custom);

 	  // No need to exercise - all stubs
 	  equals( wizard["number"], 1, "wizard mock object should have a stubbed property of 'number' with a value of (Number: 1)");
 	  equals( wizard["boolean"], true, "wizard mock object should have a stubbed property of 'number' with a value of (Boolean: true)");
 	  equals( wizard["null"], null, "wizard mock object should have a stubbed property of 'null' with a value of (null)");
 	  equals( typeof wizard["function"], "function", "wizard mock object should have a stubbed property of 'function' with a value of (Function: function stubbedFunction () {})");
 	  equals( typeof wizard["object"], "object", "wizard mock object should have a stubbed property of 'object' with a value of (Object: {})");
 	  equals( wizard["array"].constructor, Array, "wizard mock object should have a stubbed property of 'array' with a value of (Array: [])");
 	  equals( wizard["regExp"].constructor, RegExp, "wizard mock object should have a stubbed property of 'regExp' with a value of (RegExp: /RegExp/)");
 	  equals( wizard["date"].constructor, Date, "wizard mock object should have a stubbed property of 'date' with a value of (Date: new Date)");
 	  equals( wizard["custom object"].constructor, Custom, "wizard mock object should have a stubbed property of 'custom object' with a value of (Custom: new Custom)");

 	});


 	test("multiple mocked methods with defined return values", function () {

 	  expect(14);

 	    var mock = new Mock;

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

      equals( mock.getNumericValue(), 10, "getNumericValue() on mock should return (Number: 10)");
      equals( mock.getStringValue(), 'data', "getStringValue() on mock should return (String: data)");
      equals( mock.getArrayValue().constructor, Array, "getArrayValue() on mock should return (Array: [ 1, 2, 3 ])");
      equals( mock.getFunctionValue()(), 'function', "getFunctionValue() on mock, when invoked, should return (String: 'function')");
      equals( mock.getObjectValue().constructor, Object.prototype.constructor, "getObjectValue() on mock should return (Object: {id: 5, value: 'value'})");
      equals( mock.getNullValue(), null, "getNullValue() on mock should return (null)");
      equals( mock.getUndefinedValue(), undefined, "getUndefinedValue() on mock should return (undefined)");
      equals( mock.getEmptyStringValue(), "", "getEmptyStringValue() on mock should return (String: '')");
      equals( mock.getZeroValue(), 0, "getZeroValue() on mock should return (Number: 0)");
      equals( mock.getTrueValue(), true, "getTrueValue() on mock should return (Boolean: true)");
      equals( mock.getFalseValue(), false, "getFalseValue() on mock should return (Boolean: false)");
      equals( mock.getEmptyArrayValue().constructor, Array, "getEmptyArrayValue() on mock should return (Array: [])");
      equals( mock.getEmptyObjectValue().constructor, Object.prototype.constructor, "getEmptyObjectValue() on mock should return (Object: {})");
      ok(mock.verify(), "verify() should be true");

 	});

	module( "QMock: Method Invocation expectations" );

	test("mocked method with explicit invocation call expectation", function () {

	  expect(16);
	  var ninja = new Mock;

	  // Test invalid method naming - protect API if using mocked member interface to set methods and properties
	  try {
	    ninja.expects(1).method('expects');
	    ok(false, "mock should detect bad method name 'expects'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown when bad method name 'expects' is used. Actual was");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  var ninja = new Mock;  // Can't call reset as mock is broken, must re-instantiate mock instance.

	  try {
	    ninja.expects(1).method('andExpects');
	    ok(false, "mock should detect bad method name 'andExpects'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  ninja = new Mock; // Can't call reset as mock is broken, must re-instantiate mock instance.

	  try {
	    ninja.expects(1).method('expectsArguments');
	    ok(false, "mock should detect bad method name 'expectsArguments'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  ninja = new Mock; // Can't call reset as mock is broken, must re-instantiate mock instance.

	  try {
	    ninja.expects(1).method('reset');
	    ok(false, "mock should detect bad method name 'reset'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  ninja = new Mock; // Can't call reset as mock is broken, must re-instantiate mock instance.

	  ninja
	    .expects(1)
	      .method('swing');

	  // Test Bad Exercise phase - no method call
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when swing not called");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
    }

	  ninja.reset();

	  // Too many method calls
	  ninja.swing();
	  ninja.swing();

	  try {
	    ninja.verify();
	    ok(false, "verify() should throw exception when swing called too many times");
	  } catch (e) {
	    equals(e.length, 1, "verify() should return an array of 1 exception");
	    equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
	  }

	  ninja.reset();

	  // Test undefined return value
	  equals(ninja.swing(), undefined, "swing() without return value set should return undefined");
	  // Test Good Exercise Phase
	  ok(ninja.verify(), "verify() should pass after swing called");

	  // False Positive, expect ZERO calls
	  var samurai = new Mock;

	  samurai
	    .expects(0)
	      .method('swing');

		ok(samurai.verify(), "verify() should pass if swing not called");

	  // Lots of calls

	  var wizard = new Mock;

	  wizard
	    .expects(2000)
	      .method('sendFireball');

	  for(var i = 0; i < 2000; i++) {
	    wizard.sendFireball();
	  }

	  ok(wizard.verify(), "verify() should pass if sendFireball called 2000 times");

	});

	test("mocked method with arbitrary invocation call expectation", function() {

	  expect(13);

	  var ninja = new Mock;

	  ninja
	    .expects(1, 3)
	      .method('swing');

	  // Test _getState for mockedMembers.
	  var state = ninja.swing._getState();
	  equals(state._calls, 0, "verify() should be true. Result");

	  // Bad Exercise - no swings
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when swing not called");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
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
      ok(false, "verify() should throw exception when swing called too many times");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
    }

	  // At LEAST one swing...

	  var samurai = new Mock;
	  samurai
	    .expects(1, Infinity)
	      .method('swing');

	  samurai.swing();
	  ok(samurai.verify(), "verify() should pass after swing was called once");

	  for(var i = 0; i < 4999; i++) {
	    samurai.swing();
	  }

	  ok(samurai.verify(), "verify() should pass after swing was called 5000 times");

	  // Range of calls

	  var wizard = new Mock;

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
      ok(false, "verify() should throw exception when swing out of defined call execution range");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
    }

	});

	test("multiple mocked methods with explicit invocation call expectation", function () {

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
      ok(false, "verify() should throw exception when NO methods called");
    } catch (e) {
      equals(e.length, 3, "verify() should return an array of 3 exceptions");
      equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
    }

    ninja.reset();

    ninja.swing();
    ninja.run();
    ninja.block();

	  // Good Exercise

	  ok(ninja.verify(), "verify() should return true once swing, run and block called");

	});

	module( "QMock: Parameter expectations" );

  test("mocked method with single strict (String: 'foo') parameter expectation", function () {

    // Test single parameter value expectations, no return value
    var ninja = new Mock
        // expectations
        ninja
        .expects( 1 )
        .method( 'swing' )
          .accepts( 'foo' );

    // BAD EXERCISES

    // Test no arguments

    ninja.swing();

    try {
      ninja.verify();
        ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
        equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
        equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter type - (Function: Constructor)

    ninja.swing(String);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (String: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (String: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: Constructor)");
    }

    ninja.reset();

    ninja.swing(Object);

    try {
      ninja.verify();
        ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
        equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Object: Constructor)");
        equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

    // Test invalid parameter type - Primitives

    ninja.swing(1);

    try {
      ninja.verify();
        ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Number: 1)");
    } catch (exception) {
        equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Number: 1)");
        equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 1)");
    }

    ninja.reset();

    ninja.swing(true);

    try {
      ninja.verify();
        ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Boolean: true)");
    } catch (exception) {
        equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: true)");
        equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: true)");
    }

    ninja.reset();

    ninja.swing({});

    try {
      ninja.verify();
        ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: {})");
    } catch (exception) {
        equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
        equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
    }

    ninja.reset();

    // Test invalid values

    ninja.swing('bar');

    try {
      ninja.verify();
        ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (String: 'bar')");
    } catch (exception) {
        equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (String: 'bar')");
        equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 'bar')");
    }

    ninja.reset();

    ninja.swing('');

    try {
      ninja.verify();
        ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (String: '')");
    } catch (exception) {
        equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (String: '')");
        equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: '')");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value

    ninja.swing('foo');
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed *correct* parameter (String: 'foo')" );

  });

	test("mocked method with single strict (Number: 1) parameter expectation", function () {

    // Test single parameter value expectations, no return value
    var ninja = new Mock;
        // expectations
        ninja
          .expects( 1 )
          .method( 'swing' )
            .accepts( 1 );

    // BAD EXERCISES

    // Test no arguments

    ninja.swing();

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter type - (Function: Constructor)

    ninja.swing(Number);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Number: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Number: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: Constructor)");
    }

    ninja.reset();

    ninja.swing(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

    // Test invalid parameter type - Primitives

    ninja.swing("1");

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (String: '1')");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: '1')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: '1')");
    }

    ninja.reset();

    ninja.swing(false);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Boolean: false)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: false)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: false)");
    }

    ninja.reset();

    ninja.swing({});

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: {})");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
    }

    ninja.reset();

    // Test invalid values

    ninja.swing(0);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: 0)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (Number: 0)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 0)");
    }

    ninja.reset();

    ninja.swing(2);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: 2)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (Number: 2)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 2)");
    }

    ninja.reset();

    ninja.swing(Infinity);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: Infinity)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (Number: Infinity)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: Infinity)");
    }

    ninja.reset();

    ninja.swing(NaN);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: NaN)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (Number: NaN)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: NaN)");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value

    ninja.swing(1);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed *correct* parameter (Number: 1)" );

  });

	test("mocked method with single strict (Boolean: true) parameter expectation", function () {

    // Test single parameter value expectations, no return value
    var ninja = new Mock;
        // expectations
        ninja
          .expects( 1 )
          .method( 'swing' )
            .accepts( true );

    // BAD EXERCISES

    // Test no arguments

    ninja.swing();

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter type - (Function: Constructor)

    ninja.swing(Boolean);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Boolean: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Boolean: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: Constructor)");
    }

    ninja.reset();

    ninja.swing(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

    // Test invalid parameter type - Primitives

    ninja.swing("foo");

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (String: 'foo')");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 'foo')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 'foo')");
    }

    ninja.reset();

    ninja.swing(1);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Number: 1)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Number: 1)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 1)");
    }

    ninja.reset();

    ninja.swing({});

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: {})");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
    }

    ninja.reset();

    // Test invalid values

    ninja.swing(false);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Boolean: false)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (Boolean: false)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: false)");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value

    ninja.swing(true);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed *correct* parameter (Boolean: true)" );

  });

  test("mocked method with single strict (Date: 2010) parameter expectation", function () {

    // Test single parameter value expectations, no return value
    var ninja = new Mock;
        // expectations
        ninja
          .expects( 1 )
          .method( 'swing' )
            .accepts( new Date( 2010 ) );

    // BAD EXERCISES

    // Test no arguments

    ninja.swing();

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter type - (Function: Constructor)

    ninja.swing(Date);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Date: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Date: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Date: Constructor)");
    }

    ninja.reset();

    ninja.swing(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

    // Test invalid values

    ninja.swing(new Date);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Date: new instance)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (Date: new instance)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Date: new instance)");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value

    ninja.swing( new Date (2010) );
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed *correct* parameter (Date: 2010)" );

  });

  test("mocked method with single strict (RegExp: /foo/) parameter expectation", function () {

    // Test single parameter value expectations, no return value
    var ninja = new Mock,
        // RegExps with CommonJS are the same as Objects, although the string representation can be idenity matched
        // e.g. Object.prototype.toString.call(re)
        re = /foo/;
        // expectations
        ninja
          .expects( 1 )
          .method( 'swing' )
            .accepts( re );

    // BAD EXERCISES

    // Test no arguments

    ninja.swing();

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter type - (Function: Constructor)

    ninja.swing(RegExp);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (RegExp: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (RegExp: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (RegExp: Constructor)");
    }

    ninja.reset();

    ninja.swing(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

    // Test invalid values

    ninja.swing(/bar/);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (RegExp: /bar/)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (RegExp: /bar/)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (RegExp: /bar/)");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value

    ninja.swing( re );
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed *correct* parameter (RegExp: /foo/)" );

  });

  test("mocked method with single strict (Function: functionDeclaration [fn]) parameter expectation", function () {

    // Functions with assert in CommonJS are the same as Objects
    function fn () {};

    // Test single parameter value expectations, no return value
    var ninja = new Mock;
        // expectations
        ninja
          .expects( 1 )
          .method( 'swing' )
            .accepts( fn );

    // BAD EXERCISES

    // Test no arguments

    ninja.swing();

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter type - (Function: Constructor)

    ninja.swing(Function);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Function: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Function: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Function: Constructor)");
    }

    ninja.reset();

    ninja.swing(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

    // Test invalid values

    ninja.swing(function () {});

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Function: functionExpression)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (Function: functionExpression)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Function: functionExpression)");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value

    ninja.swing( fn );
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed *correct* parameter (Function: functionDeclaration [fn])" );

  });

  test("mocked method with single strict (Array: ['foo', 1, true]) parameter expectation", function () {

	  expect(15);

    var ninja = new Mock;
    // expectations
    ninja
      .expects(1)
      .method('describe')
        .accepts(["foo", 1, true]);

	  // Bad Exercise

	  // Test no arguments

    try {
      ninja.verify();
      ok(false, "verify() should throw 'IncorrectNumberOfMethodCallsException' exception when ninja.describe() NOT invoked");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException when method ninja.describe() not invoked");
    }

	  ninja.reset();

	  // Test invalid parameter type - (Function: Constructor)

    ninja.describe(Array);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.describe() passed incorrect parameter type (Array: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when describe() passed incorrect parameter (Array: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Array: Constructor)");
    }

    ninja.reset();

    ninja.describe(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when describe() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

	  // Test wrong argument

	  ninja.describe('foo');
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when when ninja.describe() passed the parameter (String: 'foo')");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectArgumentsException for (String: 'foo')");
    }

    // correct type, empty object

	  ninja.reset();

	  ninja.describe({});
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when when ninja.describe() passed the parameter (Object: {})");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectArgumentsException for (Object: {})");
    }

	  ninja.reset();

	  // Correct type, wrong members

	  ninja.describe(['foo', 1, true, 'bar']);

	  try {
      ninja.verify();
      ok(false, "verify() should throw exception when when ninja.describe() passed the parameter (Object: [extra member])");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectArgumentsException for (Object: [extra member])");
    }

    ninja.reset();

    // Correct type, wrong member values

	  ninja.describe(['bar', 1, true]);

	  try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.describe() passed the parameter (Object: [incorrect values])");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectArgumentsException for (Object: [incorrect values])");
    }

    ninja.reset();

	  // Good Exercise

	  // Test correct argument, different values - same rules as Object
	  ninja.describe(['foo', 1, true]);

	  ok(ninja.verify(), "verify() should be true when ninja.describe() passed the parameter (Array: ['foo', 1, true])");

	  ninja.reset();

	});

	test("mocked method with single strict (Object: {foo: 'bar', baz: 1}) parameter expectation", function () {

	  expect(13);

    var ninja = new Mock;
    // expectations
    ninja
      .expects(1)
      .method('describe')
        .accepts({
          foo: "bar",
          baz: 1
        });

	  // Bad Exercise

	  // Test no arguments

    try {
      ninja.verify();
      ok(false, "verify() should throw 'IncorrectNumberOfMethodCallsException' exception when ninja.describe() NOT invoked");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException when method ninja.describe() not invoked");
    }

	  ninja.reset();

	  // Test invalid parameter type - (Function: Constructor)

    ninja.describe(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.describe() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.describe() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

	  // Test wrong argument

	  ninja.describe('foo');
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when when ninja.describe() passed the parameter (String: 'foo')");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectArgumentsException for (String: 'foo')");
    }

    // correct type, empty object

	  ninja.reset();

	  ninja.describe({});
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when when ninja.describe() passed the parameter (Object: {})");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectArgumentsException for (Object: {})");
    }

	  ninja.reset();

	  // Correct type, wrong members

	  ninja.describe({
	     foo: "bar",
	     baz: 1,
	     fish: true
	  });

	  try {
      ninja.verify();
      ok(false, "verify() should throw exception when when ninja.describe() passed the parameter (Object: [extra member])");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectArgumentsException for (Object: [extra member])");
    }

    ninja.reset();

    // Correct type, wrong member values

	  ninja.describe({
	     foo: "bar",
	     bar: 1
	  });

	  try {
      ninja.verify();
      ok(false, "verify() should throw exception when when ninja.describe() passed the parameter (Object: [incorrect values])");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectArgumentsException for (Object: [incorrect values])");
    }

    ninja.reset();

	  // Good Exercise

	  // Test correct argument, different values
	  // Note: This is completely dependent on the implementation of the compare method.
	  // Expected behaviour would be to conform to the Common JS spec which uses the following
	  // to determine if two objects are equal (via deepEquals method):
	  // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	  // 7.4. For all other Object pairs, including Array objects, equivalence is determined by having
	  // the same number of owned properties (as verified with Object.prototype.hasOwnProperty.call),
	  // the same set of keys (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical "prototype" property.
	  // Note: this accounts for both named and indexed properties on Arrays.
	  ninja.describe({
	     foo: "bar",
	     baz: 1
	  });
	  ok(ninja.verify(), "verify() should be true");

	  ninja.reset();

	});

	test("mocked method with single strict (Custom: instance) parameter expectation", function () {

	  expect(10);

    var ninja = new Mock,
        obj = new Custom;
    // expectations
    ninja
      .expects(1)
      .method('describe')
        .accepts(obj);

	  // Bad Exercise

	  // Test no arguments

    try {
      ninja.verify();
      ok(false, "verify() should throw 'IncorrectNumberOfMethodCallsException' exception when ninja.describe() NOT invoked");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException when method ninja.describe() not invoked");
    }

	  ninja.reset();

	  // Test invalid parameter type - (Function: Constructor)

    ninja.describe(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.describe() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.describe() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

	  // Test wrong argument

	  ninja.describe('foo');
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when when ninja.describe() passed the parameter (String: 'foo')");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectArgumentsException for (String: 'foo')");
    }

    // matching keys (since Custom returns empty object - dfferent prototype)

	  ninja.reset();

	  ninja.describe({});
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when when ninja.describe() passed the parameter (Object: {})");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectArgumentsException for (Object: {})");
    }

	  ninja.reset();

	  // Good Exercise

	  // Note: This is completely dependent on the implementation of the comparison method.
	  // Expected behaviour would be to conform to the Common JS spec which uses the following
	  // to determine if two objects are equal (via deepEquals method):
	  // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	  // 7.4. For all other Object pairs, including Array objects, equivalence is determined by having
	  // the same number of owned properties (as verified with Object.prototype.hasOwnProperty.call),
	  // the same set of keys (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical "prototype" property.
	  // Note: this accounts for both named and indexed properties on Arrays.
	  ninja.describe( obj );
	  ok(ninja.verify(), "verify() should be true");

	  ninja.reset();

	  // Also matches other (non-mutated) instances
	  ninja.describe( new Custom );
	  ok(ninja.verify(), "verify() should be true");

	  ninja.reset();

	});

	test("mocked method with single strict (null) parameter expectation", function () {

	  expect( 11 );

	  var ninja = new Mock;
	  ninja
	    .expects( 1 )
	      .method( 'giveUp' )
	      .accepts( null );

	  // Bad Exercise

	  // Test invalid argument type

	  ninja.giveUp( "foo" );
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.giveUp() passed actual parameter (String: 'foo')" );
    } catch ( e ) {
      equals( e.length, 1, "verify() should return an array of 1 exceptions" );
      equals( e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException" );
    }

	  ninja.reset();

	  // Test potential false positive - undefined

	  ninja.giveUp( undefined );
    try {
      ninja.verify();
      ok( false, "verify() should throw exception when ninja.giveUp() passed actual parameter (undefined)" );
    } catch ( e ) {
      equals( e.length, 1, "verify() should return an array of 1 exceptions" );
      equals( e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException" );
    }

	  ninja.reset();

	  // Test potential false positive - falsy 0

	  ninja.giveUp( 0 );
	  try {
      ninja.verify();
      ok(false, "verify() should throw exception when swing called with actual parameter (Number: 0)");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exceptions");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
    }

	  ninja.reset();

	  // Test potential false positive - falsy ""

	  ninja.giveUp( '' );
	  try {
      ninja.verify();
      ok(false, "verify() should throw exception when 'giveUp' called with actual parameter (String: '')");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exceptions");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
    }

	  ninja.reset();

	  // Test potential false positive - false

	  ninja.giveUp( false );
	  try {
      ninja.verify();
      ok(false, "verify() should throw exception when 'giveUp' called with actual parameter (Boolean: false)");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exceptions");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
    }

	  ninja.reset();

	  // Good Exercise

	  ninja.giveUp(null);
	  ok( ninja.verify(), "verify() should pass after 'giveUp' was called once with null type" );

	});

	test("mocked method with single strict (undefined) parameter expectation", function () {

	  expect( 11 );

	  var ninja = new Mock;
	  ninja
	    .expects( 1 )
	      .method( 'giveUp' )
	      .accepts( undefined );

    // Bad Exercise

    // Test invalid argument type

    ninja.giveUp( "foo" );
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.giveUp() passed actual parameter (String: 'foo')" );
    } catch ( e ) {
      equals( e.length, 1, "verify() should return an array of 1 exceptions" );
      equals( e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException" );
    }

    ninja.reset();

    // Test potential false positive - undefined

    ninja.giveUp( null );
    try {
      ninja.verify();
      ok( false, "verify() should throw exception when ninja.giveUp() passed actual parameter (null)" );
    } catch ( e ) {
      equals( e.length, 1, "verify() should return an array of 1 exceptions" );
      equals( e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException" );
    }

    ninja.reset();

    // Test potential false positive - falsy 0

    ninja.giveUp( 0 );
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when swing called with actual parameter (Number: 0)");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exceptions");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
    }

    ninja.reset();

    // Test potential false positive - falsy ""

    ninja.giveUp( '' );
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when 'giveUp' called with actual parameter (String: '')");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exceptions");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
    }

    ninja.reset();

    // Test potential false positive - false

    ninja.giveUp( false );
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when 'giveUp' called with actual parameter (Boolean: false)");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exceptions");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
    }

    ninja.reset();

    // Good Exercise

    ninja.giveUp(undefined);
    ok( ninja.verify(), "verify() should pass after 'giveUp' was called once with null type" );

  });

  test("mocked method with single strict parameter - multiple (String: 'foo' | 'bar') expected presentations", function () {

	  expect(25);

	  var ninja = new Mock;
	  ninja
	    .expects(1)
	      .method('swing')
	      .interface(
  	      {accepts: [ 'foo' ]},
  	      {accepts: [ 'bar' ]}
	      );

    // BAD EXERCISES

    // Test no arguments

    ninja.swing();

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter type - (Function: Constructor)

    ninja.swing(String);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (String: Constructor)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter (String: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: Constructor)");
      equals(exception[1].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: Constructor)");
    }

    ninja.reset();

    ninja.swing(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

    // Test invalid parameter type - Primitives

    ninja.swing(1);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Number: 1)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter type (Number: 1)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 1)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 1)");
    }

    ninja.reset();

    ninja.swing(true);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Boolean: true)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: true)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: true)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: true)");
    }

    ninja.reset();

    ninja.swing({});

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: {})");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
    }

    ninja.reset();

    // Test invalid values

    ninja.swing('baz');

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (String: 'bar')");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter value (String: 'bar')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 'bar')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 'bar')");
    }

    ninja.reset();

    ninja.swing('');

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (String: '')");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter value (String: '')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: '')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: '')");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value [1]

    ninja.swing('foo');
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [1] *correct* parameter (String: 'foo')" );

    ninja.reset();

    // Test same parameter type AND expected value [2]

    ninja.swing('bar');
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [2] *correct* parameter (String: 'bar')" );

  });

  test("mocked method with single strict parameter - multiple (Number: 3 | 9) expected presentations", function () {

	  expect(31);

	  var ninja = new Mock;
	  ninja
	    .expects(1)
	      .method('swing')
	      .interface(
  	      {accepts: [ 3 ]},
  	      {accepts: [ 9 ]}
	      );

    // BAD EXERCISES

    // Test no arguments

    ninja.swing();

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter type - (Function: Constructor)

    ninja.swing(Number);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Number: Constructor)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter (Number: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: Constructor)");
      equals(exception[1].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: Constructor)");
    }

    ninja.reset();

    ninja.swing(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

    // Test invalid parameter type - Primitives

    ninja.swing('foo');

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (String: 'foo')");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 'foo')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 'foo')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 'foo')");
    }

    ninja.reset();

    ninja.swing(true);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Boolean: true)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: true)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: true)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: true)");
    }

    ninja.reset();

    ninja.swing({});

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: {})");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
    }

    ninja.reset();

    // Test invalid values

    ninja.swing(0);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: 0)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter value (Number: 0)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 0)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 0)");
    }

    ninja.reset();

    ninja.swing(2);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: 2)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter value (Number: 2)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 2)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 2)");
    }

    ninja.reset();

    ninja.swing(Infinity);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: NaN)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter value (Number: NaN)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: NaN)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: NaN)");
    }

    ninja.reset();


    ninja.swing(NaN);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: Infinity)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter value (Number: Infinity)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: Infinity)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: Infinity)");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value [1]

    ninja.swing(3);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [1] *correct* parameter (Number: 3)" );

    ninja.reset();

    // Test same parameter type AND expected value [2]

    ninja.swing(9);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [2] *correct* parameter (Number: 9)" );

  });

  test("mocked method with single strict parameter - multiple (Boolean: true | false) expected presentations", function () {

    // Note, if you want a typed parameter then use an assertion library (like Assay),
    // that allows for such a declaration
    // aka, it's not advised to list all the possible (acceptable) values!

	  expect(19);

	  var ninja = new Mock;
	  ninja
	    .expects(1)
	      .method('swing')
	      .interface(
  	      {accepts: [ true ]},
  	      {accepts: [ false ]}
	      );

    // BAD EXERCISES

    // Test no arguments

    ninja.swing();

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter type - (Function: Constructor)

    ninja.swing(Boolean);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (Boolean: Constructor)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter (Boolean: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: Constructor)");
      equals(exception[1].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: Constructor)");
    }

    ninja.reset();

    ninja.swing(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

    // Test invalid parameter type - Primitives

    ninja.swing('foo');

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (String: 'foo')");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 'foo')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 'foo')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 'foo')");
    }

    ninja.reset();

    ninja.swing(1);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (Number: 1)");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter type (Number: 1)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 1)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 1)");
    }

    ninja.reset();

    ninja.swing({});

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (Object: {})");
    } catch (exception) {
      equals(exception.length, 2, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value [1]

    ninja.swing(true);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [1] *correct* parameter (Boolean: true)" );

    ninja.reset();

    // Test same parameter type AND expected value [2]

    ninja.swing(false);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [2] *correct* parameter (Boolean: false)" );

  });

  test("mocked method with single strict parameter - multiple (*Natives*) expected presentations", function () {

	  expect(12);

    function fn () {}

	  var ninja = new Mock,
	      re = /foo/;
	      // expectations
    	  ninja
    	    .expects(1)
    	      .method('swing')
    	      .interface(
      	      {accepts: [ 'foo' ]},
      	      {accepts: [ 1 ]},
      	      {accepts: [ true ]},
      	      {accepts: [ new Date (2010) ]},
      	      {accepts: [ re ]},
      	      {accepts: [ fn ]},
      	      {accepts: [ {foo: 'bar'} ]},
      	      {accepts: [ ['foo', 1, true] ]},
      	      {accepts: [ new Custom ]}
    	      );

    // BAD EXERCISES

    // Test no arguments

    ninja.swing();

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter type - (Function: Constructor)

    ninja.swing('bar');

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (String: 'bar')");
    } catch (exception) {
      equals(exception.length, 9, "verify() should return 1 exception when swing() passed incorrect parameter (String: 'bar')");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value [1]

    ninja.swing('foo');
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [1] *correct* parameter (String: 'foo')" );

    ninja.reset();

    // Test same parameter type AND expected value [2]

    ninja.swing(1);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [2] *correct* parameter (Number: 1)" );

    ninja.reset();

    // Test same parameter type AND expected value [3]

    ninja.swing(true);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [3] *correct* parameter (Boolean: true)" );

    ninja.reset();

    // Test same parameter type AND expected value [4]

    ninja.swing(new Date (2010));
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [4] *correct* parameter (Date: 2010)" );

    ninja.reset();

    // Test same parameter type AND expected value [5]

    ninja.swing(re);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [5] *correct* parameter (RegExp: /foo/)" );

    ninja.reset();

    // Test same parameter type AND expected value [6]

    ninja.swing(fn);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [6] *correct* parameter (Function: functionDeclaration [fn])" );

    ninja.reset();

    // Test same parameter type AND expected value [7]

    ninja.swing({foo: 'bar'});
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [7] *correct* parameter (Object: {foo: 'bar'})" );

    ninja.reset();

    // Test same parameter type AND expected value [8]

    ninja.swing(['foo', 1, true]);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [8] *correct* parameter (Array: [foo, 1, true])" );

    ninja.reset();

    // Test same parameter type AND expected value [9]

    ninja.swing(new Custom);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [9] *correct* parameter (Custom: instance)" );

  });

	test("mocked method with multiple strict (*Natives*) parameter expectations - all required", function () {

	  expect(6);

	  var ninja = new Mock;
	  ninja
	    .expects(1)
	      .method("testMultipleParameters")
	      .accepts(1, "foo", true, null, undefined, {}, [], new Date (2010), new Custom )
	      .required(9)  // This is actually implicit... More interesting is the ability to say *some* are required
	      .overload(false);

	  // Bad Exercise

	  // Test no arguments

	  ninja.testMultipleParameters();
	  try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.testMultipleParameters() passed NO parameters");
    } catch (e) {
      equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
    }

	  ninja.reset();

	  // Test too few arguments - method underloading

	  ninja.testMultipleParameters(1, "foo", true, null, undefined, {} );
	  try {
	    ninja.verify();
	    ok(false, "verify() should throw exception when ninja.testMultipleParameters() passed incorrect parameter (Object: [TOO FEW MEMBERS]");
	  } catch (e) {
	    equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	  }

	  ninja.reset();

	  // Test too many arguments - method overloading

	  ninja.testMultipleParameters(1, "foo", true, null, undefined, {}, [], new Date (2010), new Custom, "bar" );
	  try {
	    ninja.verify();
	    ok(false, "verify() should throw exception when ninja.testMultipleParameters() passed incorrect parameter (Object: [TOO MAN MEMBERS])");
	  } catch (e) {
	    equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	  }

	  ninja.reset();

	  // Test incorrect arguments - first two switched

	  ninja.testMultipleParameters("foo", 1, true, null, undefined, {}, [], new Date (2010), new Custom );
    try {
      ninja.verify();
	    ok(false, "verify() should throw exception when ninja.testMultipleParameters() passed incorrect parameter (Object: [INCORRECT MEMBERS])");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 2 exceptions");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
    }

	  ninja.reset();

	  // Good Exercise

	  ninja.testMultipleParameters(1, "foo", true, null, undefined, {}, [], new Date(2010), new Custom );
	  ok(ninja.verify(), "verify() should be true when ninja.testMultipleParameters() passed correct parameter (Object: [MATCHING MEMBERS])");

	});

	test("mocked method with multiple strict (*Natives*) parameter expectations - all optional", function () {

	  expect(12);

    var samurai = new Mock;

	  samurai
	    .expects(1)
	      .method("testMultipleParameters")
	      .accepts(1, "foo", true, null, undefined, {}, [], new Date(2010), new Custom )
	      .required(0); // Overwrite implict required of 10 (fn.length). Note comparison object will still match expectation for each member *if* passed

	  // Bad Exercises

	  // Single incorrect argument
	  samurai.testMultipleParameters("foo");
		try {
			samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions");
			equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}
	  samurai.reset();

	  // Some arguments - first two switched around to be incorrect

	  samurai.testMultipleParameters("foo", 1, true, null, undefined, {});
		try {
		  samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}

	  samurai.reset();

	  // All arguments - last two switched around to be incorrect

	  samurai.testMultipleParameters("foo", 1, true, null, undefined, {}, [], new Custom, new Date(2010))
		try {
		  samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}

	  samurai.reset();

	  // Too many arguments - method overloading - first two switched to be incorrect - overloaded arguments should be ignored

	  samurai.testMultipleParameters("foo", 1, true, null, undefined, {}, [], new Custom, new Date(2010), "bar" );
		try {
		  samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 2 exceptions");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}

	  samurai.reset();

	  // Good Exercises

	  // No Arguments
	  samurai.testMultipleParameters();
	  ok(samurai.verify(), "verify() should be true");

	  samurai.reset();

	  // Some Arguments
	  samurai.testMultipleParameters(1, "foo", true, null, undefined, {});
	  ok(samurai.verify(), "verify() should be true");

	  samurai.reset();

	  // All Arguments - test false positive

	  samurai.testMultipleParameters(1, "foo", true, null, undefined, {}, [], new Date (2010), new Custom );
	  ok(samurai.verify(), "verify() should be true");

	  samurai.reset();

	  // Overloaded method call
	  samurai.testMultipleParameters(1, "foo", true, null, undefined, {}, [], new Date (2010), new Custom, "bar", "baz" );
	  ok(samurai.verify(), "verify() should be true");

	});

	module( "QMock: Return value behaviours" );

	test("mocked method with single strict parameter (String: 'foo') and paired return value (String: 'bar')", function () {

	  expect(5);

	  var ninja = new Mock;
	  ninja
	    .expects(1)
	      .method("swing")
  	      .interface(
  	        {accepts: ['foo'], returns: 'bar'} // Presentation [1]
  	      )
  	      .required(0);

	  // Bad Exercises

	  // No argument type - should just return 'global' / default undefined
	  equals( ninja.swing(), undefined, "ninja.swing() should return 'undefined' when called with NO parameter");

	  ninja.reset();

	  // Argument of right type but wrong value
	  ninja.swing("baz");
	  try {
		  ninja.verify();
		  ok(false, "verify() should throw exception wehn passed parameter (String: 'baz')");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions with Parameter (String: 'baz')");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}

	  ninja.reset();
	  // Argument of right type and matching value
	  equals( ninja.swing("foo") , "bar", "ninja.swing() should return (String: 'bar') when passed parameter (String: 'foo')");
	  ok(ninja.verify(), "verify() should be true");

	  ninja.reset();

	});

	test("mocked method with multiple strict parameter (String: 'foo' | 'far' ) and paired return value (String: 'bar' | 'baz' )", function () {

    expect(7);

	  var ninja = new Mock;
	  ninja
	    .expects(1)
	      .method("swing")
  	      .interface(
  	        {accepts: ['foo'], returns: 'bar'}, // Presentation [1]
  	        {accepts: ['far'], returns: 'baz'} // Presentation [1]
  	      )
  	      .required(0);

	  // Bad Exercises

	  // No argument type - should just return 'global' / default undefined
	  equals( ninja.swing(), undefined, "ninja.swing() should return 'undefined' when called with NO parameter");

	  ninja.reset();

	  // Argument of right type but wrong value
	  ninja.swing("baz");
	  try {
		  ninja.verify();
		  ok(false, "verify() should throw exception wehn passed parameter (String: 'baz')");
		} catch (e) {
		  equals(e.length, 2, "verify() should return an array of 1 exceptions with Parameter (String: 'baz')");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}

	  ninja.reset();

	  // Argument of right type and matching value
	  equals( ninja.swing("foo") , "bar", "ninja.swing() should return (String: 'bar') when passed parameter (String: 'foo')");
	  ok(ninja.verify(), "verify() should be true");

	  ninja.reset();

	  // Argument of right type and matching value
	  equals( ninja.swing("far") , "baz", "ninja.swing() should return (String: 'baz') when passed parameter (String: 'far')");
	  ok(ninja.verify(), "verify() should be true");

	});

	test("mocked method with single strict parameter (String: 'foo') and chained return value", function () {

	  expect(9);

    var $ = new Mock;
    $.accepts(".ninja")
      .expects(2)
        .method('run')
        .accepts('foo')
        .chain();

		// Invalid constructor param

    $(1);
		try {
		  $.verify();
		  ok(false, "verify() should throw exception when ($) passed invalid parameter. expected: (String: Constructor), actual: (Number: 1)");
		} catch (e) {
		  equals(e.length, 2, "verify() should return an array of 2 exceptions: [IncorrectParameterException, IncorrectNumberOfMethodCallsException, IncorrectNumberOfMethodCallsException]");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		  equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
		}

    $.reset();

    // No constructor param

    $().run('foo').run('foo');
		try {
		  $.verify();
		  ok(false, "verify() should throw exception when $ passed NO parameters");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exception: IncorrectNumberOfArgumentsException");
		  equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
		}

    $.reset();

    // Missed call to run

    $(".ninja").run('foo');

		try {
		  $.verify();
		  ok(false, "verify() should throw exception when run() is not invoked twice");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions: [IncorrectNumberOfMethodCallsException]");
		  equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
		}

    $.reset();

	  // Good Exercises

	  // Overloaded constructor param with incorrect parameter values

    $('.ninja').run('foo').run('foo');

	  ok($.verify(), "verify() should be true");

    $.reset();

	  // Example - Mock jQuery with chaining

	  var jQuery = new Mock;

    function wrap() {
	    if ( jQuery.browser.chrome === true ) {
	      jQuery.wrap('<div />').wrap('<div />').wrap('<div />');
	    }
	  }

	  jQuery
	    .accepts(".ninjas")
	      .expects(1)
	        .method('each')
	        .accepts(wrap)
	        .data(this)
	        .chain()
	      .andExpects(3)
	        .method('wrap')
	        .accepts('<div />')
	        .chain()
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
	  jQuery(".ninjas").each(wrap);
	  // Verify
	  ok(jQuery.verify(), "verify() should be true: jQuery is mocked with chaining");

	});

	module( "QMock: Constructor expectations" );

	test("mocked Constructor with single strict parameter (String: '#foo') expectation", function () {

	  expect(6);

	  // Mock jQuery
	  var $ = new Mock ();

	  $.accepts("#foo")
  	  .expects(1)
	    .method('html')
  	    .accepts('<span>blah</span>');

	  // Bad Exercise

	  // Test invalid parameter type

    $(1).html('<span>blah</span>');

    try {
      $.verify();
      ok(false, "verify() should throw exception when $ passed parameter (Number: 1)");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception: IncorrectParameterException");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
    }

	  $.reset();

	  // Test valid parameter type but wrong value
    $("#bar").html('<span>blah</span>');

    try {
      $.verify();
      ok(false, "verify() should throw exception when $ passed parameter (String: #bar)");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception: IncorrectParameterException for parameter (String: #bar)");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
    }

    $.reset();

    // Good Exercise

    $("#foo").html('<span>blah</span>');
    ok($.verify(), "verify() should be true when $ passed (String: '#foo')");

	  // Trigger strict argument checking

	  // Example: Mock the query of the J

	  var jQuery = new Mock;

	  function hide() {
	    if ( jQuery.browser.chrome === true ) {
	      jQuery.wrap('<div />');
	      jQuery.wrap('<div />');
	      jQuery.wrap('<div />');
	    }
	  }

	  jQuery
	    .accepts(".ninjas")
	      .expects(1)
	        .method('each')
	        .accepts(hide)
	        .data({})
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

	  jQuery(".ninjas").each(hide);

	  // Verify

	  ok(jQuery.verify(), "verify() should be true: jQuery is mocked :-)");

	});

	module( "QMock: Ajax behaviours" );

	test("mocked method with callback arguments", function () {

	  expect(5);

	  var $ = new Mock;

		// Invalid callback

		$.expects(1)
		  .method('get')
        .accepts('path/to/resource', function onSuccess() {})
        .data({foo: 'bar'});

    /* JSON equivalent
    new Mock({
      "get": {
        accepts: ['path/to/resource', callback]
        response: {foo: 'bar'}
      }
    });

    new Mock({
      "get": {
        interface: [
          {accepts: ['path/to/resource', callback], response: {foo: 'bar'}}
          {accepts: ['path/to/resource', callback2], response: {far: 'baz'}}
        ]
      }
    });

    */

		$.get('path/to/resource');

		try {
			$.verify();
			ok(false, "verify() should throw exception when $.get not passed (Function: instance)");
		} catch (e) {
			equals(e.length, 1, "verify() should return an array of 1 exception");
			equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
		}

		$.reset();

		// Correct Usage

		var called = false;

		$.get('path/to/resource', function (data) { called = data.foo });

	  equals(called, 'bar', "var called should be set to true when $.get() passed (String: url, Function: callback)");

	  // Test multiple callbacks

	  var $ = new Mock;

    var success = false;

    function onSuccess ( data ) {
      success = data.foo;
    }

    var fail = false;

    function onFail ( data ) {
      fail = data.baz;
    }

    // Suggested syntax for 'cleaner' callbacks
		$.expects(1)
		  .method('get')
		    .interface(
		      {accepts: ['path/to/resource', onSuccess], data: {foo: true}},
		      {accepts: ['path/to/resource', onFail], data: {baz: true}}
		    );

		// Exercise
		// Correct Usage

		var called = false;

		$.get('path/to/resource', onSuccess);
		equals(success, true, "var success should be set to true when $.get() passed (String: url, Function: onSuccess)");

		$.get('path/to/resource', onFail);
    equals(fail, true, "var fail should be set to true when $.get() passed (String: url, Function: onFail)");

	});

  module( "QMock: API" );

	test("[0.1] Constructor and mockedMember object API backward compatibility", function () {

	  expect(3);

	  // Setup - Test support for expectsArguments on mock Constructors
	  var $ = new Mock;
	  $.expectsArguments("foo");

	  // Good Exercise
	  $('foo');
	  ok($.verify(), "verify() should be true: mock supports 'expectsArguments' on mock constructors");

	  // Setup - Test support for withArguments method on mocked methods

	  var mock = new Mock;
	  mock
	    .expects(1)
	      .method("swing")
	      .withArguments(1)
	      .chain()
	    .andExpects(1)
	      .method("run")
	      .withArguments("foo");

	  // Good exercise
	  mock.swing(1).run("foo");
	  // Verify
	  ok(mock.verify(), "verify() should be true: mock supports 'withArguments' setup method on mocked members");

	  // Setup - Test support for withArguments method on mocked methods

	  var mock = new Mock;
	  mock
	    .expects(1)
	      .method("swing")
	      .andReturns(true);
	  // Good exercise & verify
	  equals(mock.swing(), true, "mock.swing() should return true when setting up return value with 'andReturns' (API v 0.1)");

	});

	test("[0.2] Constructor and mockedMember object API backward compatibility", function () {

	  expect(2);

	  // Setup - Test support for andChain method on mocked methods

	  var mock = new Mock;
	  mock
	    .expects(1)
	      .method("swing")
	      .andChain();

	  // Good exercise & verify
	  ok("swing" in (mock.swing()), "mock.swing() should return the mock itself (API v 0.2)");

	  // Setup - Test support for callFunctionWith method on mocked methods

	  var mock = new Mock;
		mock
		  .expects(1).method('get')
        .accepts('path/to/resource', Function)
        .callFunctionWith({foo: 'bar'});

    // Correct Usage

    var called = false;

    mock.get('path/to/resource', function (data) { called = data.foo });

	  // Good exercise & verify
	  equals(called, 'bar', "var called should be set to true when mock.get() passed (String: url, Function: callback)");

	});

})(); // Go Go Inspector Gadget!