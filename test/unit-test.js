/*global buster, assert*/
(function (global, undefined) {

  "use strict";

  var buster = global.buster || require( "buster" );
  var QMock = global.QMock || require( "../src/qmock" );

  // Assertion aliases for brevity
  var equals = assert.equals;
  var fail = buster.assertions.fail;

  // Assign comparison function
  QMock.config.compare = buster.assertions.deepEqual;

  buster.testCase( "QMock: Mock Object API", {

    "Mock#end [utility] method": function () {
      var mock = new Mock,
          foo  = mock.method("foo").end();

      assert((mock === foo), "Mock#end should return the mock receiver object")
    },

    "Mock#id [utility] method": function () {
      var mock = new Mock,
          foo  = mock.method('foo').id('bar');

      assert(foo.__getState().name, "bar");
    },

    "Mock#namespace [core] method": function () {
      var mock = new Mock,
          foo  = mock.namespace("foo");

      // Check doesn't implement mock interface via duck typing
      // Could use a pass-through for in check?
      assert( typeof foo.accepts === "undefined" );
      assert( typeof foo.calls === "undefined" );

      // Check can actually set methods and properties on the nested mock namespace and use them!
      mock.foo
        .method("bar")
          .accepts("baz")
          .end()
        .property("faz", true);

      // EXERCISE
      mock.foo.bar("baz");
      mock.foo.faz = false;

      // VERIFY
      assert( mock.verify() );
      // VERIFY: namespace
      assert( mock.foo.verify() );
      // VERIFY: Mocked Method
      assert( mock.foo.bar.verify() );
      // VERIFY: Property
      refute( mock.foo.faz );

      // Reset from namespace
      mock.foo.reset();
      // Check the property is back to setup value
      equals( mock.foo.faz, true );

      // Change the property again
      mock.foo.faz = false;

      // Reset from parent mock
      mock.reset();
      // Check the property is back to setup value
      equals( mock.foo.faz, true );
    },

    "Mock#excise [utility] method": function () {
      var mock = new Mock(null, false); // plain namespace/receiver

      // EXERCISE
      mock.excise();

      // VERIFY: Plain object (i.e. a namespace, not a fn obj)
      var result = true;
      for (var i in mock) {
        result = false; break;
      }
      assert(result, "excised mock shouldn't have any properties on itself");

      // SETUP - Custom Properties
      // Object with a method 'foo', property 'bar', and namespace 'buz'
      mock = new Mock({
        // method foo()
        "foo": {
          "id"        : "foobarbaz",
          "accepts"   : "foo",
          "receives"  : {"accepts": "foo", fixture: "stub", returns: "bar"},
          "returns"   : "bar",
          "required"  : 1,
          // nested namespace "faz"
          "faz"       : {},
          "overload"  : true,
          "fixture"   : "response",
          "async"     : true,
          "chain"     : {},
          "calls"     : [1,2],
          // nested property "key"
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
      assert(typeof mock == "object", "The mock should be a plain receiver and not a function.");
      assert(verifyMock( mock, /foo|bar|buz|/ ), "The parent mock receiver should only have the properties ('foo', 'bar', 'buz') set upon it.");
      assert(verifyMock( mock.foo, /faz|key/ ), "The mock function 'mock.foo()' should only have the properties ('faz', 'key') set upon it.");
      assert(verifyMock( mock.buz, /baz|daz|gaz/ ), "The mock receiver 'mock.buz' should only have the properties ('baz', 'daz', 'gaz') set upon it.");

    }

  });

  /*
   * The following tests use Mock#verify to produce a result to assert,
   * rather than inspecting the internal state of each mock instance (which)
   * would make the tests brittle and violate the Law of Demeter.???
   * Although this approach differs from the usual TDD style of atomic method
   * assertions, (invoke a method and assert on some returned object, or
   * associated state), it has been deemed more pragmatic than testing every
   * combination of expectations that might be desired.
   */

  buster.testCase("QMock: Mock behaviour (properties & methods)", {

    "multiple stubbed properties": function () {

      // SETUP
      var ninja = new Mock;

      // TC: Negative - invalid property naming (shadow QMock API)
      // EXERCISE & VERIFY
      function callback () {
        ninja.property('expects')
      }
      assert.exception(function () {
        ninja.property('expects');
      }, "InvalidPropertyNameException");

      // TC: Positive - Test all object types can be stored
      // SETUP
      function Custom () {}; /* stub constructor fn */

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

      // VERIFY
      assert.isNumber(wizard["number"]);
      assert.isBoolean(wizard["boolean"]);
      assert.isNull(wizard["null"]);
      assert.isFunction(wizard["function"]);
      assert.isObject(wizard["object"]);
      assert.isArray(wizard["array"]);
      equals(wizard["regExp"].constructor, RegExp);
      equals(wizard["date"].constructor, Date);
      equals(wizard["custom object"].constructor, Custom);

    },

    "multiple mocked methods with defined return values": function () {

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

      // Can return truthy values
      assert.isNumber(mock.getNumericValue());
      assert.isString( mock.getStringValue(), 'foo');
      assert.isArray(mock.getArrayValue());
      assert.isFunction(mock.getFunctionValue());
      assert.isObject(mock.getObjectValue());
      assert.isNull(mock.getNullValue());

      // Can return falsy values
      equals(mock.getUndefinedValue(), undefined);
      equals(mock.getEmptyStringValue(), "");
      equals(mock.getZeroValue(), 0);
      assert.isFalse(mock.getFalseValue());

    }

  });

  buster.testCase( "QMock: Mock behaviour (invocation expectations)", {

    "mocked method with explicit invocation call expectation": function () {

      // SETUP
      var ninja = new Mock;

      // TC: Negative - protect shadowing QMock API
      assert.exception(function () {
        ninja.method('expects', "foo");
      }, "InvalidMethodNameException");

      // TC: Negative - no method call when expected
      // SETUP & VERIFY
      ninja = (new Mock).method('swing', 1).end();
      assert.exception(ninja.verify, "IncorrectNumberOfMethodCallsException");

      // TC: Negative - too many method calls than expected
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      ninja.swing();
      ninja.swing();
      assert.exception(ninja.verify, "IncorrectNumberOfMethodCallsException");

      ninja.reset();

      // TC: Positive - Assert expected exercise phase
      //  - undefined is return value (default behaviour)
      //  - expectation should pass when swing only executed once
      // TODO: WHERE DOES THIS BELONG??
      equals(ninja.swing(), undefined); // default behaviour
      assert(ninja.verify());

      // TC: Positive - Expect ZERO calls
      // SETUP & VERIFY
      var samurai = (new Mock).method('swing', 0);
      assert(samurai.verify());

    },

    "mocked method with arbitrary invocation call expectation": function () {

      // SETUP
      var ninja = (new Mock);
      ninja
        .expects(1, 3)
        .method('swing');

      // TC: Negative - No swings
      assert.exception(ninja.verify, "IncorrectNumberOfMethodCallsException");

      ninja.reset();

      // TC: True Positive - One exercise
      // EXERCISE & VERIFY
      ninja.swing();
      assert(ninja.verify());

      // TC: True Positive - Two exercises
      // EXERCISE & VERIFY
      ninja.swing();
      assert(ninja.verify());

      // TC: True Positive - Three exercises
      // EXERCISE & VERIFY
      ninja.swing();
      assert(ninja.verify());

      // TC: True Negative - Four exercises
      // EXERCISE & VERIFY
      ninja.swing();
      assert.exception(ninja.verify, "IncorrectNumberOfMethodCallsException")

      // SETUP
      var samurai = new Mock;
      samurai
        .expects(1, Infinity)
          .method('swing');

      // TC: True Positive - One..N exercises
      // EXERCISE & VERIFY
      samurai.swing();
      assert(samurai.verify());

      samurai.swing();
      assert(samurai.verify());

      // SETUP
      var wizard = new Mock;
      wizard
        .expects(2, 3)
        .method('swing');

      // TC: Negative - No swings
      assert.exception(wizard.verify, "IncorrectNumberOfMethodCallsException");

      wizard.reset();

      // TC: Negative - One swing
      wizard.swing();
      assert.exception(wizard.verify, "IncorrectNumberOfMethodCallsException");

      wizard.reset();

      // TC: True Positive - Two & Three exercise
      // EXERCISE & VERIFY
      wizard.swing();
      wizard.swing();
      assert(wizard.verify());
      wizard.swing();
      assert(wizard.verify());

      // TC: True Negative - Four exercise
      // EXERCISE & VERIFY
      wizard.swing();
      assert.exception(wizard.verify, "IncorrectNumberOfMethodCallsException");

    }
  });

  // buster.testCase("QMock: Mock behaviour (parameter expectations)", {

  //   "mocked method with single strict (Number: 1) parameter expectation": function () {

  //     // Test single parameter value expectations, no return value
  //     var ninja = new Mock;
  //         // expectations
  //         ninja
  //           .expects( 1 )
  //           .method( 'swing' )
  //             .accepts( 1 );

  //     // BAD EXERCISES

  //     // Test no arguments

  //     ninja.swing();

  //     try {
  //       ninja.verify();
  //       fail("verify() should throw exception when ninja.swing() is passed NO parameters");
  //     } catch (exception) {
  //       // equals(exception.length, 1);
  //       // equals(exception[0].type, "IncorrectNumberOfArgumentsException");
  //     }

  //     ninja.reset();

  //     // Test invalid parameter type - (Function: Constructor)

  //     ninja.swing(Number);

  //     try {
  //       ninja.verify();
  //       fail(false, "verify() should throw exception when ninja.swing() passed incorrect parameter type (Number: Constructor)");
  //     } catch (exception) {
  //       equals(exception.length, 1);
  //       equals(exception[0].type, "IncorrectParameterException");
  //     }

  //     ninja.reset();

  //     ninja.swing(Object);

  //     try {
  //       ninja.verify();
  //       fail("verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: Constructor)");
  //     } catch (exception) {
  //       equals(exception.length, 1);
  //       equals(exception[0].type, "IncorrectParameterException");
  //     }

  //     ninja.reset();

  //     // Test invalid parameter type - Primitives

  //     // ninja.swing("1");

  //     // try {
  //     //   ninja.verify();
  //     //   fail("verify() should throw exception when ninja.swing() passed incorrect parameter type (String: '1')");
  //     // } catch (exception) {
  //     //   equals(exception.length, 1);
  //     //   equals(exception[0].type, "IncorrectParameterException");
  //     // }

  //     ninja.reset();

  //     ninja.swing(false);

  //     try {
  //       ninja.verify();
  //       fail("verify() should throw exception when ninja.swing() passed incorrect parameter type (Boolean: false)");
  //     } catch (exception) {
  //       equals(exception.length, 1);
  //       equals(exception[0].type, "IncorrectParameterException");
  //     }

  //     ninja.reset();

  //     ninja.swing({});

  //     try {
  //       ninja.verify();
  //       fail("verify() should throw exception when ninja.swing() passed incorrect parameter type (Object: {})");
  //     } catch (exception) {
  //       equals(exception.length, 1);
  //       equals(exception[0].type, "IncorrectParameterException");
  //     }

  //     ninja.reset();

  //     // Test invalid values

  //     ninja.swing(0);

  //     try {
  //       ninja.verify();
  //       fail("verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: 0)");
  //     } catch (exception) {
  //       equals(exception.length, 1);
  //       equals(exception[0].type, "IncorrectParameterException");
  //     }

  //     ninja.reset();

  //     ninja.swing(2);

  //     try {
  //       ninja.verify();
  //       fail("verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: 2)");
  //     } catch (exception) {
  //       equals(exception.length, 1);
  //       equals(exception[0].type, "IncorrectParameterException");
  //     }

  //     ninja.reset();

  //     ninja.swing(Infinity);

  //     try {
  //       ninja.verify();
  //       fail("verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: Infinity)");
  //     } catch (exception) {
  //       equals(exception.length, 1);
  //       equals(exception[0].type, "IncorrectParameterException");
  //     }

  //     ninja.reset();

  //     ninja.swing(NaN);

  //     try {
  //       ninja.verify();
  //       fail("verify() should throw exception when ninja.swing() passed incorrect parameter value (Number: NaN)");
  //     } catch (exception) {
  //       equals(exception.length, 1);
  //       equals(exception[0].type, "IncorrectParameterException");
  //     }

  //     ninja.reset();

  //     // GOOD Exercises

  //     // Test same parameter type AND expected value

  //     ninja.swing(1);
  //     assert( ninja.verify() );

  //   }

  // });

  buster.testCase("QMock overloading behaviour", {

    "Test overloading mock guard": function () {

      // SETUP
      var ninja = (new Mock)
          .method("testMultipleParameters", 1)
            .accepts(1, "foo", true)
            .required(3)  // Default behaviour
            .overload(false)
            .end();

      // TC: True Negative - underloaded method (no args)
      // EXERCISE & VERIFY
      ninja.testMultipleParameters();
      assert.exception(ninja.verify, "IncorrectNumberOfArgumentsException");

      // TC: True Negative - underloaded method (too few args)
      // SETUP
      ninja.reset();

      // EXERCISE & VERIFY
      ninja.testMultipleParameters(1, "foo");
      assert.exception(ninja.verify, "IncorrectNumberOfArgumentsException");

      // TC: True Negative - overloaded method (too many args)
      // SETUP
      ninja.reset();

      // EXERCISE & VERIFY
      ninja.testMultipleParameters(1, "foo", true, null);
      assert.exception(ninja.verify, "IncorrectNumberOfArgumentsException");

      // TC: True Negative - Incorrect arguments
      // SETUP
      ninja.reset();

      // EXERCISE & VERIFY
      ninja.testMultipleParameters("foo", 1, true);
      assert.exception(ninja.verify, "IncorrectParameterException");

      // TC: True Positive
      // SETUP
      ninja.reset();

      // EXERCISE & VERIFY
      ninja.testMultipleParameters(1, "foo", true);
      assert(ninja.verify());

    }
  });

  buster.testCase("Parameter Expectations", {

    "test single parameter expectations": function () {

      var ninja = (new Mock)
          .method('swing', 1)
            .accepts("foo")
            .end();

      // TC: Negative - No arguments
      // EXERCISE & VERIFY
      ninja.swing();
      assert.exception(ninja.verify, "IncorrectNumberOfArgumentsException");

      // TC: Negative - Invalid argument
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      ninja.swing(0);
      assert.exception(ninja.verify, "IncorrectParameterException");

      // TC: Positive - Pass expected value (3)
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      ninja.swing("foo");
      assert(ninja.verify());

    },

    "test multiple parameter expectations": function () {

      var ninja = (new Mock)
          .method('swing', 1)
            .receives({accepts: 3}, {accepts: 9})
            .end();

      // TC: Negative - No arguments
      // EXERCISE & VERIFY
      ninja.swing();
      assert.exception(ninja.verify, "IncorrectNumberOfArgumentsException");

      // TC: Negative - Invalid argument
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      ninja.swing(0);
      assert.exception(ninja.verify, "IncorrectParameterException");

      // TC: Positive - Pass expected value (3)
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      ninja.swing(3);
      assert(ninja.verify());

      // TC: Positive - Pass expected value (9)
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      ninja.swing(9);
      assert(ninja.verify());

    }

  });

  buster.testCase("QMock: Mock behaviour (return values)", {

    "strict parameter mapping and paired return value": function () {

      var ninja = (new Mock)
          .method("swing", 1)
            .receives({accepts: 'foo', returns: 'bar'}) // Presentation [1]
            .required(0)
            .end();

      // TC: Positive - No required args returns undefined (default behaviour)
      // EXERCISE & VERIFY
      equals( ninja.swing(), undefined);

      // TC: Negative - IF param passed has strict expectations of "foo"
      //                Test incorrect param value
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      ninja.swing("baz");
      assert.exception(ninja.verify, "IncorrectParameterException");

      // TC: Positive - Pass expected value and receive mapped return value
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      equals(ninja.swing("foo") , "bar");
      assert(ninja.verify());

    },

    "Method with multiple strict parameters AND mapped returns": function () {

      var ninja = (new Mock)
        .method("swing",1)
          .receives(
            {accepts: 'foo', returns: 'bar'}, // Presentation [1]
            {accepts: 'far', returns: 'baz'} // Presentation [1]
          )
          .required(0)
          .end();

      // TC: Positive - No required args returns undefined (default behaviour)
      // EXERCISE & VERIFY
      equals( ninja.swing(), undefined);

      // TC: Negative - IF param passed has strict expectations of "foo"
      //                Test incorrect param value
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      ninja.swing("baz");
      assert.exception(ninja.verify, "IncorrectParameterException");

      // TC: Positive - Pass expected value 1 and receive mapped return value
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      equals(ninja.swing("foo"), "bar");
      assert(ninja.verify());

      // TC: Positive - Pass expected value 2 and receive mapped return value
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      equals(ninja.swing("far"), "baz");
      assert(ninja.verify());

    }

  });

  buster.testCase("QMock: Mock behaviour (ajax)", {

    "setUp": function() {
      this.clock = this.useFakeTimers();
    },

    "mocked method with callback arguments": function () {

      var $ = (new Mock)
          // Invalid callback
          .method('get', 1)
            .accepts('path/to/resource', function onSuccess() {})
            .fixture({foo: 'bar'})
            .end();

      // TC: Positive - Callback is executed with stub data
      // SETUP
      var called = false;

      // EXERCISE
      $.get('path/to/resource', function (fixture) { called = fixture.foo; });

      // VERIFY (pause the runner for an appropriate amount of time)
      this.clock.tick(QMock.config.delay);
      equals(called, 'bar');

      // TC: Positive - multiple expected callbacks
      // SETUP
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

      var called = false;

      // EXERCISE
      $.get('path/to/resource', onSuccess);

      // VERIFY (pause the runner for an appropriate amount of time)
      this.clock.tick(QMock.config.delay);
      assert(success);

      // EXERCISE
      $.get('path/to/resource', onFail);

      // VERIFY (pause the runner for an appropriate amount of time)
      this.clock.tick(QMock.config.delay);
      assert(fail);

    },

    "tearDown": function () {
      this.clock.restore();
    }

  });

  buster.testCase("Mocked constructors", {

    "mocked constructor with explicit invocation call expectation": function () {
      var ninja = (new Mock).calls(1);

      // TC: Negative - no method call
      // VERIFY
      assert.exception(ninja.verify, "IncorrectNumberOfMethodCallsException");

      // TC: Negative - too many calls
      // SETUP, EXERCISE & VERIFY
      ninja.reset();
      ninja();
      ninja();
      assert.exception(ninja.verify, "IncorrectNumberOfMethodCallsException");

      // TC: Positive - expect ZERO calls
      // SETUP & VERIFY
      var samurai = (new Mock).calls(0);
      assert(samurai.verify());

    }

  });

  buster.testCase("Public API", {

    "QMock.config.compare setting": function () {

      // TC: Positive - Try setting the compare function
      // SETUP
      function stub () {}
      var app = QMock.create();

      // EXERCISE & VERIFY
      app.config.compare = stub;
      equals(app.config.compare, stub);

    },

    "QMock.create() factory method": function () {

      // TC: Test creation of standalone instances
      // SETUP
      var a = QMock.create(),
          b = QMock.create();

      // Mutate the state for asserting
      a.isA = true;
      b.isB = true;

      // VERIFY
      assert((a !== b));
      assert((typeof a.isB === "undefined"));
      assert((typeof b.isA === "undefined"));

    },

    "QMock.utils.is() utility method": function () {

      var is = QMock.utils.is;

      // TC: Negative - false positives
      refute( is("1", "Number") );
      refute( is("", "Boolean") );
      refute( is(0, "Boolean") );

      // TC: Positive
      assert( is(1, "Number") );
      assert( is("foo", "String") );
      assert( is(true, "Boolean") );
      assert( is([], "Array") );
      assert( is({}, "Object") );
      assert( is(new Date, "Date") );
      assert( is(new RegExp, "RegExp") );
      assert( is(function () {}, "Function") );

    },

    "QMock.Utils.verify() utility method": function () {

      var mock = new Mock,
          verify = QMock.utils.verify;

      // TC: Negative - expect IncorrectNumberOfArguments Ex
      // SETUP, EXERCISE & VERIFY
      mock.accepts("foo").calls(1);
      mock();
      assert.exception(function() {
        verify(mock);
      },"IncorrectNumberOfArgumentsException");

      // TC: Positive
      // SETUP, EXERCISE, VERIFY
      mock.reset();
      mock("foo");
      assert(verify(mock));

      // TC: Negative - expect IncorrectNumberOfMethodCalls Ex
      // SETUP, EXERCISE, VERIFY
      mock.reset();
      mock("foo");
      mock("foo");
      assert.exception(function () {
        verify(mock);
      },"IncorrectNumberOfMethodCallsException")

    }

    // "QMock.config.failslow setting": function () {
    //   // SETUP - create a standalone QMock instance (independent from SUT)
    //   // By default QMock instance is set to 'fail slow'
    //   var app = QMock.create(),
    //       mock = new app.Mock;

    //   // Prep dummy expectations
    //   mock.method('foo',1).end();
    //   // No exercise, just verify, should error
    //   equals(mock.verify(), false, "mock.verify should return 'false', and NOT throw an error when in 'fail slow' mode");

    //   // Check exception was actually thrown but suppressed for debugging
    //   equals(mock.foo.__getExceptions()[0].type, "IncorrectNumberOfMethodCallsException", "mock.verify() should have raised an 'IncorrectNumberOfMethodCallsException' object");
  });

  buster.testCase("QMock: Spy Function Behaviours", {

    "Spying on functions and constructors": function () {

      var called = false;

      function foo ( bool ) {
        called = bool;
      }

      // First do some normal exercise and verification runs
      // Demonstrates Spy has no 'observer effect' on ops

      // TC: Positive
      // SETUP, EXERCISE & VERIFY
      var foo = Spy(foo).calls(1).accepts(true); // accepts optional
      foo(true);
      assert(called);
      assert(foo.verify());

      // TC: Negative - false positive test
      // EXERCISE & VERIFY
      foo(true);
      assert.exception(foo.verify, "IncorrectNumberOfMethodCallsException");

      // TC: Positive - Assert Spy is constructor-safe
      var baz = new foo;
      assert(baz instanceof foo);

      // Inspired by http://www.adequatelygood.com/2010/5/Spying-Constructors-in-JavaScript
      // TODO: Test expected scoping for invocations and return values
      // TC: Positive - Assert recorder captures
      // SETUP
      var obj = {};
      function fn ( key, value ) {
        this[ key ] = value;
      }

      var bar = Spy(fn);

      // EXERCISE
      bar.call(obj, "taz", "gaz");
      bar.apply(obj, [ "raz", "paz" ]);

      // VERIFY
      equals(obj.taz, "gaz");
      equals(obj.raz, "paz");

    }

  });

}(this));
