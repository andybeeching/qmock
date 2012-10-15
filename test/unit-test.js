/*global buster, assert*/
(function (global) {

  "use strict";

  var buster = global.buster || require( "buster" );
  var QMock = global.QMock || require( "../src/qmock" );

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
      assert.equals( mock.foo.faz, true );

      // Change the property again
      mock.foo.faz = false;

      // Reset from parent mock
      mock.reset();
      // Check the property is back to setup value
      assert.equals( mock.foo.faz, true );

    }
  });

}(this));
