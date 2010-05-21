(function QMockTestsExtended () {

  // Closure scoped aliases to internal QMock functions
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

	module( "QMock: Typed parameters" );

	test("mocked method interface with single (Number) typed parameter expectation", function () {

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
	  var ninja = new Mock;
	  ninja
	    .expects(1)
	      .method("swing")
	      .accepts(Number);

	  // BAD EXERCISES

	  ninja.swing(); // Test no arguments

	  try {
	    ninja.verify();
	    ok(false, "verify() should throw exception when swing() interface passed No parameters");
	  } catch (exception) {
	    equals(exception.length, 1, "verify() should return 1 exception when swing() passed no parameters");
	    equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for (String)");
	  }

	  ninja.reset();

	  // Test invalid argument type - Constructors

	  ninja.swing(String);

	  try {
	    ninja.verify();
	    ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (String)]");
	  } catch (exception) {
	    equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (String)]");
	    equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String)");
	  }

	  ninja.reset();

	  ninja.swing(Boolean);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean)");
	  }

	  ninja.reset();

	  ninja.swing(Array);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Array)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Array)");
	  }

	  ninja.reset();

	  ninja.swing(Object);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Object)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object)");
	  }

	  ninja.reset();

	  ninja.swing(Function);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Function)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Function)");
	  }

	  ninja.reset();

	  ninja.swing(RegExp);

	  try {
	    ninja.verify();
      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	  } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (RegExp)");
	  }

	  ninja.reset();

	  // Test invalid argument type - values

	  ninja.swing("string");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: string)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: string)");
	  }

	  ninja.reset();

	  ninja.swing(false);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: false)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: false)");
	  }

	  ninja.reset();

	  ninja.swing([]);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Array: [])");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Array: [])");
	  }

	  ninja.reset();

	  ninja.swing({});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
	  }

	  ninja.reset();

	  ninja.swing(function(){});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Function: function(){})");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Function: function(){})");
	  }

	  ninja.reset();

	  ninja.swing(/test/);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (RegExp: /test/)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (RegExp: /test/)");
	  }

	  ninja.reset();

	  // Test false positive

	  ninja.swing("1");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 1)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 1)");
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

		var ninja = new Mock;
	  ninja
	    .expects(1)
	      .method('swing')
	      .accepts(1);

	  // BAD EXERCISES

	  ninja.swing(); // Test no arguments

	  try {
	    ninja.verify();
	    ok(false, "verify() should throw exception when swing() interface passed no parameters");
	  } catch (exception) {
	    equals(exception.length, 1, "verify() should return 1 exception when swing() passed no parameters");
	    equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for (String)");
	  }

	  ninja.reset();

	  // Test invalid argument type - Constructors

	  ninja.swing(String);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (String)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (String)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String)");
	  }

	  ninja.reset();

	  ninja.swing(Boolean);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean)");
	  }

	  ninja.reset();

	  ninja.swing(Array);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Array)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Array)");
	  }

	  ninja.reset();

	  ninja.swing(Object);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Object)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object)");
	  }

	  ninja.reset();

	  ninja.swing(Function);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Function)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Function)");
	  }

	  ninja.reset();

	  ninja.swing(RegExp);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (RegExp)");
	  }

	  ninja.reset();

	  // Test invalid argument type - values

	  ninja.swing("string");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: string)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: string)");
	  }

	  ninja.reset();

	  ninja.swing(false);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: false)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: false)");
	  }

	  ninja.reset();

	  ninja.swing([]);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Array: [])");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Array: [])");
	  }

	  ninja.reset();

	  ninja.swing({});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
	  }

	  ninja.reset();

	  ninja.swing(function(){});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Function: function(){})");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Function: function(){})");
	  }

	  ninja.reset();

	  ninja.swing(/test/);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (RegExp: /test/)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (RegExp: /test/)");
	  }

	  ninja.reset();

	  // Test false positive

	  ninja.swing("1");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 1)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 1)");
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
	  var ninja = new Mock;
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
	      ok(false, "verify() should throw exception when swing() interface passed no parameters");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed no parameters");
	      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for (String)");
	  }

	  ninja.reset();

	  // Test invalid argument type - Constructors

	  ninja.swing(String);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (String)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (String)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String)");
	  }

	  ninja.reset();

	  ninja.swing(Boolean);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean)");
	  }

	  ninja.reset();

	  ninja.swing(Array);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Array)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Array)");
	  }

	  ninja.reset();

	  ninja.swing(Object);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Object)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object)");
	  }

	  ninja.reset();

	  ninja.swing(Function);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Function)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Function)");
	  }

	  ninja.reset();

	  ninja.swing(RegExp);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (RegExp)");
	  }

	  ninja.reset();

	  // Test invalid argument type - values

	  ninja.swing("string");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: string)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: string)");
	  }

	  ninja.reset();

	  ninja.swing(false);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: false)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Boolean: false)");
	  }

	  ninja.reset();

	  ninja.swing([]);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Array: [])");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Array: [])");
	  }

	  ninja.reset();

	  ninja.swing({});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Object: {})");
	  }

	  ninja.reset();

	  ninja.swing(function(){});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Function: function(){})");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (Function: function(){})");
	  }

	  ninja.reset();

	  ninja.swing(/test/);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (RegExp: /test/)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (RegExp: /test/)");
	  }

	  ninja.reset();

	  // Test false positive

	  ninja.swing("1");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 1)");
	      equals(exception[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException for (String: 1)");
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

	test("mock with single (String) type parameter expectation", function () {

	  // Test String primitive

	  var samurai = new Mock;

	  samurai
	    .expects(1)
	      .method('run')
	      .accepts(String);

	  // Bad exercise

	  // Test invalid argument type

	  samurai.run(1);
	  try {
       samurai.verify();
       ok(false, "verify() should throw exception when run called with incorrect argument type");
     } catch (e) {
       equals(e.length, 1, "verify() should return an array of 1 exceptions");
       equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
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

	test("mock with single (Boolean) type parameter expectation", function () {

	  // Test Boolean primitive

	  var wizard = new Mock;

	  wizard
	    .expects(1)
	      .method('fireball')
	      .accepts(Boolean);

	  // Bad Exercise

	  // Test invalid argument type

	  wizard.fireball("true");

	  try {
       wizard.verify();
       ok(false, "verify() should throw exception when run called with incorrect argument type");
     } catch (e) {
       equals(e.length, 1, "verify() should return an array of 1 exceptions");
       equals(e[0].type, "IncorrectParameterException", "verify() exception type should be IncorrectParameterException");
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

})(); // Go Go Inspector Gadget!