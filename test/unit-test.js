/*global buster, assert*/
(function (global) {

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

      var ninja = new Mock;
      // EXERCISE - invalid property naming (shadow QMock API)
      try {
        ninja.property('expects');
        fail("Expected 'InvalidPropertyNameException'");
      } catch (e) {
        equals(e.type, "InvalidPropertyNameException");
      }

      var ninja = (new Mock)
                    .property("rank", "apprentice");

      equals( ninja.rank, "apprentice" )

      ninja = (new Mock) // with 'new' keyword
                .property("rank", "apprentice")
                .property("master", "The Chrome");

      equals(ninja.rank, "apprentice");
      equals(ninja.master, "The Chrome");

    // Composite
    var samurai = Mock() // without new
                    .property("rank", "apprentice")
                    .method("swing")
                  .end()
                    .property("master", "The Chrome");

    // EXERCISE
    samurai.swing();

    // VERIFY
    assert( samurai.verify() );
    equals(ninja.rank, "apprentice");
    equals(ninja.master, "The Chrome");

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
      assert(mock.verify(), "verify() should be true");

    }

  });

}(this));
