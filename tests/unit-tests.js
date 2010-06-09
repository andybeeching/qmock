(function QMockTests ( undefined ) {

	// Stub to test support for user-defined objects
	function Custom () {};

	/**
	 *
	 * Unit tests for Mock instance interface - asserting with mock.verify()
	 *
	 *  All tests generally follow this simple process:
	 *
	 *  1. Setup: Instantiate mocks and set expected interactions upon them.
	 *     Sometimes located in the 'setup' phase of the testrunner before each test block.
	 *  2. Exercise: Execute the relevant collaborator code to interact with the mock object.
	 *  3. Verify: Call the verify method on each mock object to establish if it was interacted with correctly.
	 *  4. Reset: [Optional] Call reset method on the mock to return it's internal state to the end of the setup phase.
	 *     Sometimes located in the 'teardown' phase of the testrunner after each test case.
	 *
	 */

	module( "QMock: Mock object API");

	test("Mock.end() [utility] instance method", function () {

	  expect(1);
	  var mock = new Mock,
	      foo  = mock.method('foo').end();

	  ok((mock === foo), "mock.end() should return the receiver object mock");

	});

	test("Mock.id() [utility] instance method", function () {

	  expect(1);
	  var mock = new Mock,
	      foo  = mock.method('foo').id('bar');

	  equals(foo.__getState().name, "bar", "mock should have the descriptor 'bar'");

	});

	test("Mock.namespace() [core] instance method", function () {

	  expect(8);
	  var mock = new Mock,
	      foo  = mock.namespace("foo");

	  // Check doesn't implement mock interface via duck typing
	  ok( typeof foo.accepts === "undefined", "mock namespace/receiver 'foo' doesn't implement the accepts() method (part of Mock stub interface)" )
	  ok( typeof foo.calls === "undefined", "mock namespace/receiver 'foo' doesn't implement the calls() method (part of Mock stub interface)" )

    // Check can actually set methods and properties on the nested mock namespace and use them!
    mock.foo
      .method("bar")
        .accepts("baz")
        .end()
      .property("faz", true);

    // Exercise
    mock.foo.bar("baz");
    mock.foo.faz = false;
    // Verify whole mock
	  ok( mock.verify(), "The mock 'mock' should be true [mock.verify()]");
	  // Verify just the namespace
	  ok( mock.foo.verify(), "The namespace 'mock.foo' should be true [mock.foo.verify()]");
    // Verify just the mock stub method
    ok( mock.foo.bar.verify(), "The method 'mock.foo.bar()' should be true [mock.foo.bar.verify()]");
	  // Check the property was changed
	  equals( mock.foo.faz, false, "'mock.foo.faz' should equal false");

	  // Reset from namespace
	  mock.foo.reset();
	  // Check the property is back to setup value
	  equals( mock.foo.faz, true, "'mock.foo.faz' should equal true");

	  // Change the property again
	  mock.foo.faz = false;

	  // Reset from parent mock
	  mock.reset();
	  // Check the property is back to setup value
	  equals( mock.foo.faz, true, "'mock.foo.faz' should equal true");

	});

	test("Mock.excise() [utility] instance method", function () {

	  var mock = new Mock(null, false), // plain namespace/receiver
	      result = true,
	      i;

    // Excise mock completely
	  mock.excise();

	  // Verify by testing no properties on mock (if a function stub then will have a prototype property)
	  for (var i in mock) {
      result = false; break;
	  }
    ok(result, "excised mock shouldn't have any properties on itself");

    // setup with some customproperties
    mock = new Mock({
      // method called foo
      "foo": {
        "id"        : "foobarbaz",
        "accepts"   : "foo",
        "receives"  : {"accepts": "foo", fixture: "stub", returns: "bar"},
        "returns"   : "bar",
        "required"  : 1,
        // nested namespace on 'foo'
        "faz"       : {},
        "overload"  : true,
        "fixture"   : "response",
        "async"     : true,
        "chain"     : {},
        "calls"     : [1,2],
        // nested property on 'foo'
        "key"       : true
      },
      // property called 'bar'
      "bar": "stub",
      // namespace called 'buz' with method
      "buz": {
        // Test method setup
        "baz": {
          "accepts": "test"
        },
        // Test property setup
        "daz": "stub",
        // Test nested namspace setup
        "gaz": {}
      }
    }, false);

    // excise all mocks
    mock.excise();

    function verifyMock ( obj, keys ) {
      var result = true, key;
      for (var key in mock ) {
        if ( obj.hasOwnProperty( key ) && !keys.exec( key )[0] ) {
          result = false;
          break;
        }
      }
      return result;
    }

    // verify
    ok(typeof mock == "object", "The mock should be a plain receiver and not a function.");
    ok(verifyMock( mock, /foo|bar|buz|/ ), "The parent mock receiver should only have the properties ('foo', 'bar', 'buz') set upon it.");
    ok(verifyMock( mock.foo, /faz|key/ ), "The mock function 'mock.foo()' should only have the properties ('faz', 'key') set upon it.");
    ok(verifyMock( mock.buz, /baz|daz|gaz/ ), "The mock receiver 'mock.buz' should only have the properties ('baz', 'daz', 'gaz') set upon it.");

	});

	/**
	 *  Following tests (until QMock API test groups) are using Mock.verify() to assert
	 *  rather than inspecting the internal state of each mock instance (most of the methods
	 *  on mock objects tend to mutate this to set up expectations, verify, or reset the state)
	 *
	 *  This is slightly against the TDD way of atomic method assertion (poke / assert),
	 *  instead relying on verify() to function correctly, but the approach has been deemed
	 *  optimal since there would be a lot of duplication if separate tests were written against
	 *  the methods and then every permutation of expectations that might be desired.
	 */

	module( "QMock: Mock behaviour (properties & methods)" );

 	test("mock with multiple stubbed properties", function () {

 	  expect(14);

 	  var ninja = new Mock;

 	  // Test invalid property naming
 	  try {
 	    ninja.property('expects');
 	    ok(false, "mock should throw 'InvalidPropertyNameException' when trying to set a bad property name of 'expects'");
 	  } catch (e) {
 	    equals(e.type, "InvalidPropertyNameException", "exception type should be InvalidPropertyNameException");
 	  }

 	  var ninja = (new Mock)
      .property("rank", "apprentice");

 	  ok( (ninja.rank === "apprentice") , "ninja mock object should have a property with an identifier 'rank' that has a value of 'apprentice'" );

 	  ninja = (new Mock) // with 'new' keyword
     .property("rank", "apprentice")
     .property("master", "The Chrome");

 	  ok( ( (ninja.rank === "apprentice") && (ninja.master === "The Chrome") ) , "ninja mock object should have two properties with the identifiers 'rank' & 'master', and values of 'apprentice' and 'The Chrome' respectively")

 	  // Composite
 	  var samurai = Mock() // without new
 	    .property("rank", "apprentice")
      .method("swing")
 	      .end()
 	    .property("master", "The Chrome");

 	  // Good Exercise
 	  samurai.swing();
 	  ok( samurai.verify(), "verify() should pass after swing was called once" );
 	  ok( ( (samurai.rank === "apprentice") && (samurai.master === "The Chrome") ) , "ninja mock object should have a two properties set correctly")

 	  // Test all object types can be stored on property

 	  function Custom () {};

 	  var wizard = (new Mock)
      .property("number", 1)
      .property("boolean", true)
      .property("string", "foo")
      .property("null", null)
      .property("undefined", undefined)
      .property("function", function stubbedFunction () {})
      .property("object", {})
      .property("array", [])
      .property("regExp", /RegExp/)
      .property("date", new Date(1970))
      .property("custom object", new Custom);

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
    var mock = Mock()
      .method('getNumericValue', 1).returns(10).end()
      .method('getStringValue', 1).returns('foo').end()
      .method('getArrayValue', 1).returns([ 1, 2, 3]).end()
      .method('getFunctionValue', 1).returns(function () { return 'function'; }).end()
      .method('getObjectValue', 1).returns({ id: 5, value: 'value' }).end()
      .method('getNullValue', 1).returns(null).end()
      .method('getUndefinedValue', 1).returns(undefined).end()
      .method('getEmptyStringValue', 1).returns("").end()
      .method('getZeroValue', 1).returns(0).end()
      .method('getTrueValue', 1).returns(true).end()
      .method('getFalseValue', 1).returns(false).end()
      .method('getEmptyArrayValue', 1).returns([]).end()
      .method('getEmptyObjectValue', 1).returns({}).end(); // Note we call end() here to ensure mock var set to receiver!

      equals( mock.getNumericValue(), 10, "getNumericValue() on mock should return (Number: 10)");
      equals( mock.getStringValue(), 'foo', "getStringValue() on mock should return (String: 'foo')");
      equals( mock.getArrayValue().constructor, Array, "getArrayValue() on mock should return (Array: [ 1, 2, 3 ])");
      equals( mock.getFunctionValue()(), 'function', "getFunctionValue() on mock, when invoked, should return a (Function)");
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

	module( "QMock: Mock behaviour (invocation expectations)" );

	test("mocked method with explicit invocation call expectation", function () {

	  expect(12);
	  var ninja = new Mock;

	  // Test invalid method naming - protect API if using mocked member interface to set methods and properties
	  try {
	    ninja.method('expects', 1);
	    ok(false, "mock should detect bad method name 'expects'");
	  } catch (e) {
	    equals(e.type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  var ninja = new Mock;  // Can't call reset as mock is broken, must re-instantiate mock instance.

	  try {
	    ninja.method('andExpects', 1);
	    ok(false, "mock should detect bad method name 'andExpects'");
	  } catch (e) {
	    equals(e.type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  ninja = new Mock; // Can't call reset as mock is broken, must re-instantiate mock instance.

	  try {
	    ninja.method('expectsArguments', 1);
	    ok(false, "mock should detect bad method name 'expectsArguments'");
	  } catch (e) {
	    equals(e.type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  ninja = new Mock; // Can't call reset as mock is broken, must re-instantiate mock instance.

	  try {
	    ninja.method('reset', 1);
	    ok(false, "mock should detect bad method name 'reset'");
	  } catch (e) {
	    equals(e.type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

    // Can't call reset as mock is broken, must re-instantiate mock instance.
	  ninja = (new Mock).method('swing', 1).end();

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
	  var samurai = (new Mock).method('swing', 0);

		ok(samurai.verify(), "verify() should pass if swing not called");

	  // Lots of calls

	  var wizard = (new Mock).method('sendFireball', 2000).end();

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

	  // Test __getState for mockedMembers.
	  equals(ninja.swing.__getState().called, 0, "verify() should be true. Result");

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

	  for(var i = 0; i < 50; i++) {
	    samurai.swing();
	  }

	  ok(samurai.verify(), "verify() should pass after swing was called 50 times");

	  // Range of calls

	  var wizard = new Mock;

	  wizard
	    .expects()
	      .method('sendFireball')
	      .calls(100, 250);

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

    var ninja = (new Mock)
      .method('swing', 1).end()
      .method('run', 1).end()
      .method('block', 1).end()

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

	module( "QMock: Mock behaviour (parameter expectations)" );

  test("mocked method with single strict (String: 'foo') parameter expectation", function () {

    // Test single parameter value expectations, no return value
    var ninja = ( new Mock )
        .method( "swing", 1 )
        .accepts( "foo" )
        .end();

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
	  // ...snip...
	  // (7.4) For all other Object pairs, including Array objects, equivalence is determined by having
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

	  var ninja = (new Mock)
	      .method( 'giveUp', 1 )
  	      .accepts( null )
  	      .end();

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

	  var ninja = (new Mock)
	      .method( 'giveUp', 1 )
  	      .accepts( undefined )
  	      .end();

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

	  expect(18);
	  var ninja = (new Mock)
	      .method('swing', 1)
  	      .receives({accepts: 'foo'}, {accepts: 'bar'})
  	      .end();

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

    ninja.swing('baz');

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

    // Test same parameter type AND expected value [1]

    ninja.swing('foo');
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [1] *correct* parameter (String: 'foo')" );

    ninja.reset();

    // Test same parameter type AND expected value [2]

    ninja.swing('bar');
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [2] *correct* parameter (String: 'bar')" );

  });

  test("mocked method with single strict parameter - multiple (Number: 3 | 9) expected presentations", function () {

	  expect(22);

	  var ninja = (new Mock)
        .method('swing', 1)
  	      .receives({accepts: 3}, {accepts: 9})
  	      .end();

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

    ninja.swing('foo');

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (String: 'foo')");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 'foo')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 'foo')");
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
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: NaN)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (Number: NaN)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: NaN)");
    }

    ninja.reset();


    ninja.swing(NaN);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: Infinity)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter value (Number: Infinity)");
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
    // aka, it's not advised to list all the possible (acceptable) values like true || false || etc...

	  expect(14);
	  var ninja = (new Mock)
	      .method('swing', 1)
	        .receives({accepts: true}, {accepts: false})
	        .end();

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
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Boolean: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: Constructor)");
    }

    ninja.reset();

    ninja.swing(Object);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (Object: Constructor)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (Object: Constructor)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: Constructor)");
    }

    ninja.reset();

    // Test invalid parameter type - Primitives

    ninja.swing('foo');

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (String: 'foo')");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 'foo')");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 'foo')");
    }

    ninja.reset();

    ninja.swing(1);

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (Number: 1)");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Number: 1)");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Number: 1)");
    }

    ninja.reset();

    ninja.swing({});

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (Object: {})");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
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

	  var re = /foo/,
	      ninja = (new Mock)
  	      // expectations
  	      .method('swing', 1)
    	      .receives(
      	      {accepts: 'foo'},
      	      {accepts: 1},
      	      {accepts: true},
      	      {accepts: new Date (2010)},
      	      {accepts: re},
      	      {accepts: fn},
      	      {accepts: {foo: 'bar'}},
      	      {accepts: [['foo', 1, true]]}, // Note: nesting multiple expected params in array literal required
      	      {accepts: new Custom}
    	      )
    	      .end();

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

    // Test invalid parameter value - (Function: Constructor)

    ninja.swing('bar');

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (String: 'bar')");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (String: 'bar')");
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
	  var ninja = (new Mock)
	      .method("testMultipleParameters", 1)
	        .accepts(1, "foo", true, null, undefined, {}, [], new Date (2010), new Custom )
	        .required(9)  // This is actually implicit... More interesting is the ability to say *some* are required
	        .overload(false)
	        .end();

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

    var samurai = (new Mock)
	      .method("testMultipleParameters", 1)
	        .accepts(1, "foo", true, null, undefined, {}, [], new Date(2010), new Custom )
	        .required(0) // Overwrite implict required of 10 (fn.length). Note comparison object will still match expectation for each member *if* passed
          .end();

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

	module( "QMock: Mock behaviour (return values)" );

	test("mocked method with single strict parameter (String: 'foo') and paired return value (String: 'bar')", function () {

	  expect(5);

	  var ninja = (new Mock)
	      .method("swing", 1)
  	      .receives({accepts: 'foo', returns: 'bar'}) // Presentation [1]
  	      .required(0)
  	      .end();

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

	  var ninja = (new Mock)
	      .method("swing",1)
  	      .receives(
  	        {accepts: 'foo', returns: 'bar'}, // Presentation [1]
  	        {accepts: 'far', returns: 'baz'} // Presentation [1]
  	      )
  	      .required(0)
  	      .end();

	  // Bad Exercises

	  // No argument type - should just return 'global' / default undefined
	  equals( ninja.swing(), undefined, "ninja.swing() should return 'undefined' when called with NO parameter");

	  ninja.reset();

	  // Argument of right type but wrong value
	  ninja.swing("baz");
	  try {
		  ninja.verify();
		  ok(false, "verify() should throw exception when passed parameter (String: 'baz')");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions with Parameter (String: 'baz')");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}

	  ninja.reset();

	  // Argument of right type and matching value [1]
	  equals( ninja.swing("foo") , "bar", "ninja.swing() should return (String: 'bar') when passed parameter (String: 'foo')");
	  ok(ninja.verify(), "verify() should be true");

	  ninja.reset();
	  // Argument of right type and matching value [2]
	  equals( ninja.swing("far") , "baz", "ninja.swing() should return (String: 'baz') when passed parameter (String: 'far')");
	  ok(ninja.verify(), "verify() should be true");

	});

	module( "QMock: Mock behaviour (ajax)" );

	test("mocked method with callback arguments", function () {

	  expect(5);

	  var $ = (new Mock)
		    // Invalid callback
		    .method('get', 1)
          .accepts('path/to/resource', function onSuccess() {})
          .fixture({foo: 'bar'})
          .end();

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

		stop();

		$.get('path/to/resource', function (fixture) { called = fixture.foo; });

		setTimeout(function() {
      // continue the test
      equals(called, 'bar', "var called should be set to true when $.get() passed (String: url, Function: callback)");
    }, QMock.config.delay);

	  // Test multiple callbacks

	  var $ = new Mock;

    var success = false;

    function onSuccess ( fixture ) {
      success = fixture.foo;
    }

    var fail = false;

    function onFail ( fixture ) {
      fail = fixture.baz;
    }

    // Suggested syntax for 'cleaner' callbacks
		$.method('get', 1)
		  .receives(
		    {accepts: ['path/to/resource', onSuccess], fixture: {foo: true}},
		    {accepts: ['path/to/resource', onFail], fixture: {baz: true}}
		  );

		// Exercise
		// Correct Usage

		var called = false;

		stop();
		$.get('path/to/resource', onSuccess);

		setTimeout(function() {
      // continue the test
  		equals(success, true, "var success should be set to true when $.get() passed (String: url, Function: onSuccess)");
    }, QMock.config.delay);

		$.get('path/to/resource', onFail);

		setTimeout(function() {
      // continue the test
      equals(fail, true, "var fail should be set to true when $.get() passed (String: url, Function: onFail)");
      start();
    }, QMock.config.delay);

	});

	module( "QMock: Mock behaviour (constructors)" );

	test("mocked constructor with explicit invocation call expectation", function () {

	  expect(5);

	  var ninja = (new Mock).calls(1);

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
	  ninja();
	  ninja();

	  try {
	    ninja.verify();
	    ok(false, "verify() should throw exception when swing called too many times");
	  } catch (e) {
	    equals(e.length, 1, "verify() should return an array of 1 exception");
	    equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
	  }

	  ninja.reset();

	  // False Positive, expect ZERO calls
	  var samurai = new Mock;

	  samurai.calls(0);

		ok(samurai.verify(), "verify() should pass if swing not called");

	});

	test("mocked constructor with single strict parameter (String: '#foo') expectation", function () {

	  expect(6);

	  // Mock jQuery
	  var $ = (new Mock)
	      .accepts("#foo")
	      .method('html')
  	      .accepts('<span>blah</span>')
  	      .end();

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
	  var jQuery = (new Mock)
	    .accepts(".ninjas")
      .method('each', 1)
	      .accepts(hide)
	      .fixture({})
	      .async(false)
	      .end()
	    .method('wrap', 3)
	      .accepts('<div />')
	      .end()
      .property('browser', {
        ie: false,
        mozilla: false,
        safari: false,
        opera: false,
        chrome: true
      }); // Don't need an end() call here as .property() returns receiver object (i.e. $)

	  function hide() {
	    if ( jQuery.browser.chrome === true ) {
	      jQuery.wrap('<div />');
	      jQuery.wrap('<div />');
	      jQuery.wrap('<div />');
	    }
	  }

	  // Exercise

	  jQuery(".ninjas").each(hide);

	  // Verify

	  ok(jQuery.verify(), "verify() should be true: jQuery-esque chaining is mockable");

	});

	test("mocked constructor with single strict parameter - multiple (*Natives*) expected presentations", function () {

	  expect(12);
    function fn () {}
	  var ninja = new Mock,
	      re = /foo/;
	      // expectations
    	  ninja
    	    .calls(1)
  	      .receives(
    	      {accepts: 'foo'},
    	      {accepts: 1},
    	      {accepts: true},
    	      {accepts: new Date (2010)},
    	      {accepts: re},
    	      {accepts: fn},
    	      {accepts: {foo: 'bar'}},
    	      {accepts: [['foo', 1, true]]},
    	      {accepts: new Custom}
  	      );

    // BAD EXERCISES

    // Test no arguments

    ninja();

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() is passed NO parameters");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when ninja.swing() passed NO parameters");
      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
    }

    ninja.reset();

    // Test invalid parameter value - (Function: Constructor)

    ninja('bar');

    try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.swing() passed incorrect parameter (String: 'bar')");
    } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter (String: 'bar')");
    }

    ninja.reset();

    // GOOD Exercises

    // Test same parameter type AND expected value [1]

    ninja('foo');
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [1] *correct* parameter (String: 'foo')" );

    ninja.reset();

    // Test same parameter type AND expected value [2]

    ninja(1);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [2] *correct* parameter (Number: 1)" );

    ninja.reset();

    // Test same parameter type AND expected value [3]

    ninja(true);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [3] *correct* parameter (Boolean: true)" );

    ninja.reset();

    // Test same parameter type AND expected value [4]

    ninja(new Date (2010));
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [4] *correct* parameter (Date: 2010)" );

    ninja.reset();

    // Test same parameter type AND expected value [5]

    ninja(re);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [5] *correct* parameter (RegExp: /foo/)" );

    ninja.reset();

    // Test same parameter type AND expected value [6]

    ninja(fn);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [6] *correct* parameter (Function: functionDeclaration [fn])" );

    ninja.reset();

    // Test same parameter type AND expected value [7]

    ninja({foo: 'bar'});
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [7] *correct* parameter (Object: {foo: 'bar'})" );

    ninja.reset();

    // Test same parameter type AND expected value [8]
    ninja(['foo', 1, true]);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [8] *correct* parameter (Array: [foo, 1, true])" );

    ninja.reset();

    // Test same parameter type AND expected value [9]

    ninja(new Custom);
    ok( ninja.verify(), "verify() should pass after ninja.swing() passed [9] *correct* parameter (Custom: instance)" );

  });

  test("mocked constructor with multiple strict (*Natives*) parameter expectations - all required", function () {

	  expect(6);

	  var ninja = new Mock;
	  ninja
	    .calls(1)
      .accepts(1, "foo", true, null, undefined, {}, [], new Date (2010), new Custom )
      .required(9)  // This is actually implicit... More interesting is the ability to say *some* are required
      .overload(false);

	  // Bad Exercise

	  // Test no arguments

	  ninja();
	  try {
      ninja.verify();
      ok(false, "verify() should throw exception when ninja.testMultipleParameters() passed NO parameters");
    } catch (e) {
      equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
    }

	  ninja.reset();

	  // Test too few arguments - method underloading

	  ninja(1, "foo", true, null, undefined, {} );
	  try {
	    ninja.verify();
	    ok(false, "verify() should throw exception when ninja.testMultipleParameters() passed incorrect parameter (Object: [TOO FEW MEMBERS]");
	  } catch (e) {
	    equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	  }

	  ninja.reset();

	  // Test too many arguments - method overloading

	  ninja(1, "foo", true, null, undefined, {}, [], new Date (2010), new Custom, "bar" );
	  try {
	    ninja.verify();
	    ok(false, "verify() should throw exception when ninja.testMultipleParameters() passed incorrect parameter (Object: [TOO MAN MEMBERS])");
	  } catch (e) {
	    equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	  }

	  ninja.reset();

	  // Test incorrect arguments - first two switched

	  ninja("foo", 1, true, null, undefined, {}, [], new Date (2010), new Custom );
    try {
      ninja.verify();
	    ok(false, "verify() should throw exception when ninja.testMultipleParameters() passed incorrect parameter (Object: [INCORRECT MEMBERS])");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 2 exceptions");
      equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
    }

	  ninja.reset();

	  // Good Exercise

	  ninja(1, "foo", true, null, undefined, {}, [], new Date(2010), new Custom );
	  ok(ninja.verify(), "verify() should be true when ninja.testMultipleParameters() passed correct parameter (Object: [MATCHING MEMBERS])");

	});

	test("mocked method with multiple strict (*Natives*) parameter expectations - all optional", function () {

	  expect(12);

    var samurai = (new Mock)
	      .calls(1)
        .accepts(1, "foo", true, null, undefined, {}, [], new Date(2010), new Custom )
        .required(0); // Overwrite implict required of 10 (fn.length). Note comparison object will still match expectation for each member *if* passed

	  // Bad Exercises

	  // Single incorrect argument
	  samurai("foo");
		try {
			samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions");
			equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}
	  samurai.reset();

	  // Some arguments - first two switched around to be incorrect

	  samurai("foo", 1, true, null, undefined, {});
		try {
		  samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}

	  samurai.reset();

	  // All arguments - last two switched around to be incorrect

	  samurai("foo", 1, true, null, undefined, {}, [], new Custom, new Date(2010))
		try {
		  samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}

	  samurai.reset();

	  // Too many arguments - method overloading - first two switched to be incorrect - overloaded arguments should be ignored

	  samurai("foo", 1, true, null, undefined, {}, [], new Custom, new Date(2010), "bar" );
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
	  samurai();
	  ok(samurai.verify(), "verify() should be true");

	  samurai.reset();

	  // Some Arguments
	  samurai(1, "foo", true, null, undefined, {});
	  ok(samurai.verify(), "verify() should be true");

	  samurai.reset();

	  // All Arguments - test false positive

	  samurai(1, "foo", true, null, undefined, {}, [], new Date (2010), new Custom );
	  ok(samurai.verify(), "verify() should be true");

	  samurai.reset();

	  // Overloaded method call
	  samurai(1, "foo", true, null, undefined, {}, [], new Date (2010), new Custom, "bar", "baz" );
	  ok(samurai.verify(), "verify() should be true");

	});

	test("mocked constructor with single strict parameter (String: 'foo') and chained return value", function () {

	  expect(9);
    var $ = (new Mock)
      .accepts(".ninja")
      .method('run', 2)
        .accepts('foo')
        .chain()
        .end();

		// Invalid constructor param
    $(1);
		try {
		  $.verify();
		  ok(false, "verify() should throw exception when ($) passed invalid parameter. expected: (String: Constructor), actual: (Number: 1)");
		} catch (e) {
		  equals(e.length, 2, "verify() should return an array of 2 exceptions: [IncorrectParameterException, IncorrectNumberOfMethodCallsException]");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		  equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException since ninja.run not exercised");
		}

    $.reset();

    // No constructor param
    $().run('foo').run('foo');
		try {
		  $.verify();
		  ok(false, "verify() should throw IncorrectNumberOfArgumentsException when $ passed NO parameters");
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

	  ok($.verify(), "verify() should be true when $ constructor overloaded with incorrect parameter values");

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
      .method('each', 1)
        .accepts(wrap)
        .fixture(this)
        .chain()
        .async(false)
        .end()
      .method('wrap', 3)
        .accepts('<div />')
        .chain()
        .end()
      .property('browser', {
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

	test("mocked constructor with multiple strict parameter (String: 'foo' | 'far' ) and paired return value (String: 'bar' | 'baz' )", function () {

    expect(7);
	  var ninja = (new Mock)
	      .calls(1)
	      .returns(undefined)
        .receives(
          {accepts: 'foo', returns: 'bar'}, // Presentation [1]
          {accepts: 'far', returns: 'baz'}  // Presentation [1]
        )
        .required(0);

	  // Bad Exercises
	  // No argument type - should just return 'global' / default undefined
	  equals( ninja(), undefined, "ninja.swing() should return 'undefined' when called with NO parameter");

	  ninja.reset();

	  // Argument of right type but wrong value
	  ninja("baz");
	  try {
		  ninja.verify();
		  ok(false, "verify() should throw exception when passed parameter (String: 'baz')");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions with Parameter (String: 'baz')");
		  equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
		}

	  ninja.reset();

	  // Argument of right type and matching value [1]
	  equals( ninja("foo") , "bar", "ninja.swing() should return (String: 'bar') when passed parameter (String: 'foo')");
	  ok(ninja.verify(), "verify() should be true");

	  ninja.reset();
	  // Argument of right type and matching value [2]
	  equals( ninja("far") , "baz", "ninja.swing() should return (String: 'baz') when passed parameter (String: 'far')");
	  ok(ninja.verify(), "verify() should be true");

	});

	test("mocked constructor with callback arguments", function () {

	  expect(2);

	  // Test multiple callbacks

	  var $ = (new Mock)
	      .calls(1)
	      .receives(
	        {accepts: ['path/to/resource', onSuccess], fixture: {foo: true}},
	        {accepts: ['path/to/resource', onFail], fixture: {baz: true}}
	      );

    var success = false;

    function onSuccess ( fixture ) {
      success = fixture.foo;
    }

    var fail = false;

    function onFail ( fixture ) {
      fail = fixture.baz;
    }

		// Exercise
		// Correct Usage

		var called = false;
		$('path/to/resource', onSuccess);

		stop();

		// Simulate round-trip ajax transaction
		setTimeout(function () {
		  equals(success, true, "var success should be set to true when $.get() passed (String: url, Function: onSuccess)");
		}, QMock.config.delay);

		$('path/to/resource', onFail);

		setTimeout(function () {
      equals(fail, true, "var fail should be set to true when $.get() passed (String: url, Function: onFail)");
  		start();
		}, QMock.config.delay);

	});

	module( "QMock: Public API" );

	test("QMock.config.failslow setting", function () {

	  expect(2);

	  // By default QMock instance is set to 'fail slow'
	  var app = QMock.create(),
	      mock = new app.Mock;

	  // Prep dummy expectations
	  mock.method('foo',1).end();
	  // No exercise, just verify, should error
	  equals(mock.verify(), false, "mock.verify should return 'false', and NOT throw an error when in 'fail slow' mode");

	  // Check exception was actually thrown but suppressed for debugging
	  equals(mock.foo.__getExceptions()[0].type, "IncorrectNumberOfMethodCallsException", "mock.verify() should have raised an 'IncorrectNumberOfMethodCallsException' object");

	});

	test("QMock.config.compare setting", function () {

    expect(1);

    function stub () {}

    // Private QMock instance
    var app = QMock.create();

    app.config.compare = stub;

    equals(app.config.compare, stub, "Qmock instances should allow the setting of their compare configuration property")

	});

	test("QMock.Mock constructor (aliased as global Mock variable)", function () {

    var mock = new QMock.Mock;
    // Actual mock object constructor isn't exposed (for an instanceof check) so duck type the interface
    // Since we haven't specified the type of object a receiver should be it returns a mixin function
    // That implements both the (internal) Receiver & Mock klass interfaces
    ok(!!(mock.accepts && mock.calls && mock.verify && mock.reset), "Default instantiation of QMock.Mock should implement the Mock klass interface");
    ok(!!(mock.method && mock.property), "Default instantiation of QMock.Mock should implement the Receiver klass interface");

    // Try without new keyword
    mock = QMock.Mock();
    ok(!!(mock.accepts && mock.calls && mock.verify && mock.reset), "Default instantiation of QMock.Mock (without new keyword) should implement the Mock klass interface");
    ok(!!(mock.method && mock.property), "Default instantiation of QMock.Mock (without new keyword) should implement the Receiver klass interface");

    // Try specifying receiver should just be an object (so acts as namespace)
    var receiver = QMock.Mock({}, false);
    // Note plain receiver *shouldn't* 'inherit' methods of Mock if not a function
    ok(!!(typeof receiver.accepts === "undefined" && typeof receiver.accepts === "undefined"), "Instantitation of QMock.Mock with Boolean flag 'false' for function should return object that doesn't implement Mock klass interface")
    // But should still implement Receiver klass interface
    ok(!!(receiver.method && receiver.property && receiver.verify && receiver.reset), "Instantitation of QMock.Mock with Boolean flag 'false' for function should return object that implements Receiver klass interface")

    // Try without new keyword
    receiver = QMock.Mock({}, false);
    // Note plain receiver *shouldn't* 'inherit' methods of Mock if not a function
    ok(!!(typeof receiver.accepts === "undefined" && typeof receiver.accepts === "undefined"), "Instantitation of QMock.Mock with Boolean flag 'false' for function should return object (without new keyword) that doesn't implement Mock klass interface")
    // But should still implement Receiver klass interface
    ok(!!(receiver.method && receiver.property && receiver.verify && receiver.reset), "Instantitation of QMock.Mock with Boolean flag 'false' for function should return object (without new keyword) that implements Receiver klass interface")

    // Setup
    // Try attaching methods / props to 'receiver', exercising, and verifying (same tests used for Mock.receiver() unit tests)
    receiver
      .method("bar")
        .accepts("baz")
        .end()
      .property("faz", true);

    // Exercise
    receiver.bar("baz");
    receiver.faz = false;

    // Verify whole mock
	  ok( receiver.verify(), "The mock 'mock' should be true [receiver.verify()]");
	  // Verify just the namespace
	  ok( receiver.verify(), "The namespace 'mock.foo' should be true [receiver.verify()]");
    // Verify just the mock stub method
    ok( receiver.bar.verify(), "The method 'receiver.bar()' should be true [receiver.bar.verify()]");
	  // Check the property was changed
	  equals( receiver.faz, false, "'receiver.faz' should equal false");
	  // Reset from namespace
	  receiver.reset();
	  // Check the property is back to setup value
	  equals( receiver.faz, true, "'receiver.faz' should equal true");

	  // Change the property again
	  receiver.faz = false;

	  // Reset from parent mock
	  receiver.reset();
	  // Check the property is back to setup value
	  equals( receiver.faz, true, "'receiver.faz' should equal true");

	});

	test("QMock.create() factory method", function () {

	  expect(4);

	  // Test two instances are NOT equal
	  var a = QMock.create(),
	      b = QMock.create();

	  // Mutate the state - let's just set a custom property on the QMock receiver
	  a.isA = true;
	  b.isB = true;

	  ok( (a !== b), "QMock 'a' is NOT the same instance as QMock 'b'" );
	  ok( (typeof a.isB === "undefined"), "QMock 'a' does not have a property 'isB' set" );
	  ok( (typeof b.isA === "undefined"), "QMock 'b' does not have a property 'isA' set" );
	  ok( a.isA === b.isB, "QMock 'a' and QMock 'b' DO have custom properties set and are equal to each other (Boolean: true)" )

	});

	test("QMock.utils.is() utility method", function () {

	  var SUT = QMock.utils.is;

	  equals( SUT(1, "Number"), true, "QMock.utils.is() should return true for (Number: 1, String: 'Number')");
	  equals( SUT("foo", "String"), true, "QMock.utils.is() should return true for (Number: 1, String: 'String')");
	  equals( SUT(true, "Boolean"), true, "QMock.utils.is() should return true for (Number: 1, String: 'Boolean')");
	  equals( SUT([], "Array"), true, "QMock.utils.is() should return true for (Array: [], String: 'Array')");
	  equals( SUT({}, "Object"), true, "QMock.utils.is() should return true for (Object: {}, String: 'Object')");
	  equals( SUT(new Date, "Date"), true, "QMock.utils.is() should return true for (Date: new, String: 'Date')");
	  equals( SUT(new RegExp, "RegExp"), true, "QMock.utils.is() should return true for (RegExp: new, String: 'RegExp')");
	  equals( SUT(function () {}, "Function"), true, "QMock.utils.is() should return true for (Function: new, String: 'Function')");

	  // Try some false positives
	  equals( SUT("1", "Number"), false, "QMock.utils.is() should return false for (String: '1', String: 'Number')");
	  equals( SUT("", "String"), true, "QMock.utils.is() should return true for (String: '', String: 'String')");
	  equals( SUT(false, "Boolean"), true, "QMock.utils.is() should return true for (Boolean: false, String: 'Boolean')");
	  equals( SUT(0, "String"), false, "QMock.utils.is() should return false for (Number: 0, String: 'String')");
    equals( SUT(true, "String"), false, "QMock.utils.is() should return false for (Boolean: true, String: 'String')");

  });

  test("QMock.Utils.verify() utility method", function () {
    var mock = new Mock;

    // Setup
    mock.accepts("foo").calls(1);

    // Exercise / Verify / Reset
    mock();
    try {
      QMock.utils.verify(mock);
	    ok(false, "QMock.utils.verify() should throw a 'IncorrectNumberOfArgumentsException' error when mock NOT invoked");
    } catch (e) {
      equals(e[0].type, "IncorrectNumberOfArgumentsException", "QMock.utils.verify() should throw a 'IncorrectNumberOfArgumentsException' error when mock NOT invoked")
    }
    mock.reset();

    mock("foo");
    equals( QMock.utils.verify(mock), true, "QMock.utils.verify() should return true when mock passed (String: 'foo')")
    mock.reset();


    mock("foo");
    mock("foo");
    try {
      QMock.utils.verify(mock);
	    ok(false, "QMock.utils.verify() should throw a 'IncorrectNumberOfMethodCallsException' error when mock invoked too many times");
    } catch (e) {
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "QMock.utils.verify() should throw a 'IncorrectNumberOfArgumentsException' error when mock invoked too many times")
    }
    mock.reset();

  });

  test("QMock.utils.reset() utility method", function () {

    var mock = new Mock;

    // Setup
    mock.accepts("foo").calls(1);
    mock.expects().property("bar", "baz")

    // Exercise
    mock("foo");
    mock.bar = "fuz";

    // Time of writing this info on standalone mocks pseudo-private
    // Check state was updated
    equals( mock.__getState().called, 1, "mock should have 1 invocation registered");
    equals( mock.__getState().received.length, 1, "mock should have one presentation to 'foo' interface registered");

    // Reset
    QMock.utils.reset(mock);
    // Check state has been reset
    equals( mock.__getState().called, 0, "mock should have 0 invocations registered");
    equals( mock.__getState().received.length, 0, "mock should have NO presentations to 'foo' interface registered");
    equals( mock.bar, "baz", "mock should have a property 'bar' with a value of 'baz'");

  });

  test("QMock.utils.test() utility method", function () {

    var mock = new Mock;

    // Setup
    mock.expects().method("foo").accepts("bar").receives({accepts:["buz"], returns:"fuz"});

    // Test
    equals( QMock.utils.test( mock.foo, ["bar"]), true, "QMock.utils.test() should return true with (Mock: instance, Array: ['bar'])");
    equals( QMock.utils.test( mock.foo, ["baz"]), false, "QMock.utils.test() should return false with (Mock: instance, Array: ['baz'])");
    equals( QMock.utils.test( mock.foo, ["bar"], "returns"), undefined, "QMock.utils.test() should return true with (Mock: instance, Array: ['foo'], String: 'returns')");
    equals( QMock.utils.test( mock.foo, ["buz"], "returns"), "fuz", "QMock.utils.test() should return true with (Mock: instance, Array: ['buz']), String: 'returns'");

  });

	test("[0.1] Constructor and mockedMember object API backward compatibility", function () {

	  expect(3);

	  // Setup - Test support for expectsArguments on mock Constructors
	  var $ = new Mock;
	  $.expectsArguments("foo");

	  // Good Exercise
	  $('foo');
	  ok($.verify(), "verify() should be true: mock supports 'expectsArguments' on mock constructors");

	  // Setup - Test support for withArguments method on mocked methods

	  var mock = (new Mock)
        .method("swing", 1)
	        .withArguments(1)
	        .chain()
	        .end()
        .method("run", 1)
	        .withArguments("foo")
	        .end();

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

	  expect(5);

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
    mock.get('path/to/resource', function (fixture) { called = fixture.foo });

    stop();

    setTimeout(function() {
      // Good exercise & verify
  	  equals(called, 'bar', "var called should be set to true when mock.get() passed (String: url, Function: callback)");
  	  start();
    }, QMock.config.delay);

	  // Setup - Test support for atLeast & noMoreThan method on mocked methods

	  var mock = new Mock;
		mock
		  .expects()
		    .method('foo')
		    .atLeast(1)
		    .noMoreThan(3);

    // Correct Usage

	  for(var i = 0; i < 2; i++) {
	    mock.foo();
	  }

	  // Good exercise & verify
	  ok(mock.verify(), "verify() should pass if foo called a random amount of times between a specified range");

	  // Setup - Test support for expects() instantiating member instance method

 	  var mock = new Mock;
 	  mock
 	    .expects()
 	      .property("foo", "bar")
 	    .expects(1,2)
 	      .method("baz");

	  equals(mock.foo, "bar", "mock should have a property 'foo' with a value 'bar'");
	  equals(typeof mock.baz, "function", "mock should have a method 'baz'");

	});

	/**
	 * Integration tests for Mock factory method domain logic - asserting with mock.verify()
	 *
	 *  Bit meta, using QMock to mock a mock instance interface. #eatsowndogfood
	 */

	module('QMock: Integration tests');

	test("__bootstrap() private factory method", function () {

	  function verifyMetaMock ( mock, type ) {
	    // For methods we just test interaction with mock object interface by __createMock()
      try {
        for ( var k in mock ) {
          if ( mock[ k ].verify ) {
            ok(mock[ k ].verify(), "mock." + k + ".verify() should pass if interacted as expected by __bootstrap() helper method [" + type + " mock]");
            mock[ k ].verify();
            mock[ k ].reset(); // reset for mock constructor test
          }
        }
      } catch (e) {
        console.log(e)
        throw e;
      }
    }

    // Mock a mock object interface (as in an instantiated mock)
    // This is used by the __createMock factory method
    // it is thus also expectations of interactions based on a known mock definition
    // Since we are using individual mocks for each method (otherwise QMock would
    // throw API collison) errors, use name() method to help debugging in case of error on verify
    var mock = {

      "id": (function(fn) {
        return fn
          .id("mock.name")
          .calls(1)
          .accepts("foobarbaz")
      })(new Mock),

      "method": (function(fn) {
        return fn
          .id("mock.method")
          .calls(1)
          .receives({accepts: "foo"});
      })(new Mock),

      "receives": (function(fn) {
        return fn
          .id("mock.receives")
          .calls(1)
          .accepts({"accepts": "foo", fixture: "stub", returns: "bar"});
      })(new Mock),

      "accepts": (function(fn) {
        return fn
          .id("mock.accepts")
          .calls(1)
          .receives({accepts: "foo"});
      })(new Mock),

      "returns": (function(fn) {
        return fn
          .id("mock.returns")
          .calls(1)
          .accepts("bar")
      })(new Mock),

      "required": (function(fn) {
        return fn
          .id("mock.required")
          .calls(1)
          .accepts(1);
      })(new Mock),

      "namespace": (function(fn) {
        return fn
          .id("mock.namespace")
          .calls(2)
          .receives({accepts: "faz"}, {accepts: "buz"});
      })(new Mock),

      "overload": (function(fn) {
        return fn
          .id("mock.overload")
          .calls(1)
          .accepts(true);
      })(new Mock),

      "fixture": (function(fn) {
        return fn
          .id("mock.fixture")
          .calls(1)
          .accepts("response")
      })(new Mock),

      "async": (function(fn) {
        return fn
          .id("mock.async")
          .calls(1)
          .accepts(true)
      })(new Mock),

      "chain": (function(fn) {
        return fn
          .id("mock.chain")
          .calls(1);
      })(new Mock),

      "calls": (function(fn) {
        return fn
          .id("mock.calls")
          .calls(1)
          .accepts(1, 2)
      })(new Mock),

      "expects": (function(fn) {
        return fn
          .id("mock.expects")
          .calls(0); // since deprecated
      })(new Mock),

      "property": (function(fn) {
        return fn
          .id("mock.property")
          .calls(1)
          .receives({accepts: ["bar", "stub"]}, {accepts: ["daz", "stub"]});
      })(new Mock)

    };

    // Setup return chaining since not actually using a receiver mock object to do this for us
    // __bootstrap simply emulates a manual cascading invocation mock declaration
    for (var k in mock) {
      if (mock[ k ].returns) {
        mock[ k ].returns( mock );
      }
    }

    // Mock Definition
    var descriptor = {
      // method called foo
      "foo": {
        "id"       : "foobarbaz",
        "accepts"  : "foo",
        "receives" : {"accepts": "foo", fixture: "stub", returns: "bar"},
        "returns"  : "bar",
        "required" : 1,
        "faz"      : {},
        "overload" : true,
        "fixture"  : "response",
        "async"    : true,
        "chain"    : {},
        "calls"    : [1,2]
      },
      // property called 'bar'
      "bar": "stub",
      // namespace called 'buz' with method
      "buz": {
        // Test method setup
        "baz": {
          "accepts": "test"
        },
        // Test property setup
        "daz": "stub",
        // Test nested namspace setup
        "gaz": {}
      }
    };

    // Exercise
    // Expect ONE method & ONE Property created on mock
    QMock.__bootstrap( mock, descriptor );

    // Verify
    verifyMetaMock( mock, "receiver" );

    // Test Standalone constructor definition via __createMock()

    // Setup - adjust some expectations for constructor only declaration
    mock.method.calls(0);
    mock.property.calls(0);
    mock.namespace.calls(1);

    // Exercise - use previous method definition as constructor definition
    QMock.__bootstrap(mock, descriptor.foo);

    // Verify
    verifyMetaMock(mock, "constructor");

	});

	module( "QMock: Spy Function Behaviours");

	test("Spying on functions and constructors", function () {
	  var called = false;

	  // Test expected result for normal function invocation
	  function foo ( bool ) {
	    called = bool;
	  }

	  // setup
	  var foo = Spy( foo ).calls(1).accepts(true); // or Spy(foo).calls(1);

	  // exercise
	  foo( true );

	  // and verify...
	  ok( called === true, "When the Spy 'foo' is invoked, the variable called should be set to true" );
	  ok( foo.verify(), "foo.verify should be return true as it was invoked once" );

	  // false positive test
	  foo( true );
	  try {
	    foo.verify();
	    fail("foo.verify() should throw an error");
	  } catch (e) {
	    equals( e[0].type, "IncorrectNumberOfMethodCallsException", "The Spy 'foo' should throw an IncorrectNumberOfMethodCallsException");
	  }

	  foo.reset();

	  foo( "bar" );
	  try {
	    foo.verify();
	    fail("foo.verify() should throw an error");
	  } catch (e) {
	    equals( e[0].type, "IncorrectParameterException", "The Spy 'foo' should throw an IncorrectNumberOfMethodCallsException");
	  }

	  // Test constructor-safe functionality of recorder
	  var baz = new foo;
	  ok ( baz instanceof foo, "baz should be an instance of the Spy foo (or rather the function being espied upon" );

	  // Inspired by http://www.adequatelygood.com/2010/5/Spying-Constructors-in-JavaScript
    // TODO: Test expected scoping for invocations and return values
    function bar ( key, value ) {
      this[ key ] = value;
    }

    var obj = {};

    var bar = Spy(bar);

    // exercise
    bar.call(obj, "taz", "gaz");
    bar.apply(obj, [ "raz", "paz" ]);

    // verify scoping
    equals ( obj.taz, "gaz", "var obj should have a property of 'taz', with a value of 'gaz' when using .call()" );
    equals ( obj.raz, "paz", "var obj should have a property of 'raz', with a value of 'paz' when using .apply()" );

	});

})(); // Run forest, run!