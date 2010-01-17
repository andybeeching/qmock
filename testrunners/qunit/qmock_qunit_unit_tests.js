(function scopeQMockTests () {

  // Closure scoped aliases to internal qMock functions
  var assertObject = Espy.assertObject,
    assertCollection = Espy.assertCollection,
    assertHash = Espy.assertHash,
    //createException = Mock["_createException"].get(),
    createMockFromJSON = Mock["_createMockFromJSON"].get(),
    undefined;

	// Stub to test support for user-defined objects
	function Custom () {};

	// Stub for CSS selector parameter expectation (e.g. mock jQuery)
	var Selector = Mock.Variable;

	/**
	 *
	 * Unit tests for atomic helper methods inside QMock
	 *
	 */

	module("qMock Implementation");

	test("qMock registration and unloading", function () {
	  // ...
	})

	test("assertCollection() - test interface & parameters", function () {

	  expect(5);

		// Test no arguments
	  try {
			assertCollection();
	    ok(false, "assertCollection() should throw exception when passed No parameters");
	  } catch (exception) {
	    equals(exception.type, "MissingParametersException", "assertCollection() exception type should be MissingParametersException for less than two parameters (required). Result");
	  }

	  // Test malformed arguments to interface afforded by assertCollection()
	  try {
			assertCollection( undefined, []	);
	    ok(false, "assertCollection() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "assertCollection() requires the 'expected' and 'actual' parameters to be Array-like objects. Result");
	  }

	  try {
			assertCollection( [], undefined );
	    ok(false, "assertCollection() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "assertCollection() requires the 'expected' and 'actual' parameters to be Array-like objects. Result");
	  }

	  // Test expected and actual collection of objects with different lengths

		equals((function() {
      return assertCollection([1,2], arguments);
    })(1), false, "assertCollection() should return false if the 'expected' and 'actual' objects have mistmatched lengths");

	  // Test passing in an 'arguments' array and returned object is a Boolean
    equals((function() {
      return assertCollection([Boolean], arguments);
    })(true)["constructor"], Boolean, "assertCollection() should allow Array-like objects to be passed-in (e.g arguments collections) AND return a Boolean. Result");

	});

	test("assertCollection() - type checking", function () {

	  expect(33);

	  var mock = new Mock();

	  // Expected false evaluations

	  // Test mis-matched member types

	  equals( assertCollection([10], [""]), false, "assertCollection() should be false with expected: [(Number: 10)] and actual: [(String: '')]. Result");
	  equals( assertCollection([""], [10]), false, "assertCollection() should be false with expected: [(String: '')] and actual: [(Number: 10)]. Result");
	  equals( assertCollection([{test: "one"}], [["test", 1]]), false, "assertCollection() should be false with expected: [(Object: {test: \"one\"})] and actual: [(Object: {test: 1})]. Result");
	  equals( assertCollection([function() {}], []), false, "assertCollection() should be false with expected: [(Function: function() {})] and actual: [undefined]. Result");
	  equals( assertCollection([null], [undefined]), false, "assertCollection() should be false with expected: [(null)] and actual: [(undefined)]. Result");
	  equals( assertCollection([undefined], ["string"]), false, "assertCollection() should be false with expected: [(undefined)] and actual: [(String: 'string')]. Result");
	  equals( assertCollection([/re/], [9]), false, "assertCollection() should be false: [(RegExp: /re/)], [(Number: 9)]. Result");
	  equals( assertCollection([new Custom], [new Number]), false, "assertCollection() should be false: [(Custom: new Custom)], [(Number: new Number)]. Result");

	  // Expected true evaluations

	  // Test matching member types (but mis-matched values)

	  equals( assertCollection([10], [1]), true, "assertCollection() should be true with expected: [(Number: 10)] and actual: [(Number: 1)]. Result");
	  equals( assertCollection([""], ["different string"]), true, "assertCollection() should be true with expected: [(String: '')] and actual: [(String: 'different string')]. Result");
	  equals( assertCollection([true], [false]), true, "assertCollection() should be true with expected: [(Boolean: true)] and actual: [(Boolean: false)]. Result");
	  equals( assertCollection([false], [true]), true, "assertCollection() should be true with expected: [(Boolean: false)] and actual: [(Boolean: true)]. Result");
	  equals( assertCollection([{test: "string"}], [{test: "different string"}]), true, "assertCollection() should be true with expected: [(Object: {test: 'string'})] and actual: [(Object: {test: 'different string'})]. Result");
	  equals( assertCollection([new Date], [new Date(1970)]), true, "assertCollection() should be true with expected: [(Date: new Date)] and actual: [(Date: new Date(1970))]. Result");
	  equals( assertCollection([new Custom], [new Custom]), true, "assertCollection() should be true with expected: [(Custom: new Custom)] and actual: [(Custom: new Custom)]. Result");

	  // Test matching member values
	  equals( assertCollection([10], [10]), true, "assertCollection() should be true with expected: [(Number: 10)] and actual: [(Number: 10)]. Result");
	  equals( assertCollection(["string"], ["string"]), true, "assertCollection() should be true with expected: [(String: 'string')] and actual: [(String: 'string')]. Result");
	  equals( assertCollection([true], [true]), true, "assertCollection() should be true with expected: [(Boolean: true)] and actual: [(Boolean: true)]. Result");
	  equals( assertCollection([[]], [[]]), true, "assertCollection() should be true with expected: [(Array: [])] and actual: [(Array: [])]. Result");
	  equals( assertCollection([{}], [{}]), true, "assertCollection() should be true with expected: [(Object: {})] and actual: [(Object: {})]. Result");
	  equals( assertCollection([{test: "string"}], [{test: "string"}]), true, "assertCollection() should be true with expected: [(Object: {test: 'string'})] and actual: [(Object: {test: 'string'})]. Result");
	  equals( assertCollection([["nested"]], [["nested"]]), true, "assertCollection() should be true with expected: [(Array: [[]])] and actual: [(Array: [[]])]. Result");
	  equals( assertCollection([function() {}], [function() {}]), true, "assertCollection() should be true with expected: [(Function: function(){})] and actual: [(Function: function(){})]. Result");
	  equals( assertCollection([/re/], [/re/]), true, "assertCollection() should be true with expected: [(RegExp: /re/)] and actual: [(RegExp: /re/)]. Result");
	  equals( assertCollection([new Date], [new Date]), true, "assertCollection() should be true with expected: [(Date: new Date)] and actual: [(Date: new Date)]. Result");

	  // Test falsy member values

	  equals( assertCollection([0], [0]), true, "assertCollection() should be true with expected: [(Number: 0)] and actual: [(Number: 0)]. Result");
	  equals( assertCollection([""], [""]), true, "assertCollection() should be true with expected: [(String: '')] and actual: [(String: '')]. Result");
	  equals( assertCollection([false], [false]), true, "assertCollection() should be true with expected: [(Boolean: false)] and actual: [(Boolean: false)]. Result");
	  equals( assertCollection([null], [null]), true, "assertCollection() should be true with expected: [(null)] and actual: [(null)]. Result");
	  equals( assertCollection([undefined], [undefined]), true, "assertCollection() should be true with expected: [(undefined)] and actual: [(undefined)]. Result");
	  equals( assertCollection([0,"string", true, [], {}, function() {}, null, undefined, /re/, new Date], [0,"string", true, [], {}, function() {}, null, undefined, /re/, new Date]), true, "assertCollection() should be true with expected: [ MANY TYPES ] and actual: [ MANY TYPES ]. Result");

	  // Nested

	  equals( assertCollection([[[["test"]]]], [[[["test"]]]]), true, "assertCollection() should be true with expected: [(Array: [[[['test']]]])] with actual: (Array: [[[['test']]]]). Result");
	  equals( assertCollection(["one", ["two", ["three", ["four"]]]], ["one", ["two", ["three", ["four"]]]]), true, "assertCollection() should be true with expected: [ MANY NESTED [] ] and actual: [ MANY NESTED [] ]. Result");

	});

	test("assertCollection() - strict value checking", function () {

	  expect(31)

	  // Strict value checking assertions (Boolean optional param)

	  // Expected false evaluations

	  // Test mis-matched member types

	  equals( assertCollection([10], [""], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(Number: 10)] and actual: [(String: '')]. Result");
	  equals( assertCollection([""], [10], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(String: '')] and actual: [(Number: 10)]. Result");
	  equals( assertCollection([{test: "one"}], [["test", 1]], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(Object: {test: \"one\"})] and actual: [(Object: {test: 1})]. Result");
	  equals( assertCollection([function() {}], [], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(Function: function() {})] and actual: [undefined]. Result");
	  equals( assertCollection([null], [undefined], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(null)] and actual: [(undefined)]. Result");
	  equals( assertCollection([undefined], ["string"], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(undefined)] and actual: [(String: 'string')]. Result");
	  equals( assertCollection([/re/], [9], {strictValueChecking:true}), false, "assertCollection() should be false: [(RegExp: /re/)], [(Number: 9)]. Result");
	  equals( assertCollection([new Custom], [new Number], {strictValueChecking:true}), false, "assertCollection() should be false: [(Custom: new Custom)], [(Number: new Number)]. Result");

	  // Test mis-matched member values

	  equals( assertCollection([10], [1], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(Number: 10)] and actual: [(Number: 1)]. Result");
	  equals( assertCollection([""], ["different string"], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(String: '')] and actual: [(String: 'different string')]. Result");
	  equals( assertCollection([true], [false], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(Boolean: true)] and actual: [(Boolean: false)]. Result");
	  equals( assertCollection([false], [true], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(Boolean: false)] and actual: [(Boolean: true)]. Result");
	  equals( assertCollection([{test: "string"}], [{test: "different string"}], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(Object: {test: 'string'})] and actual: [(Object: {test: 'different string'})]. Result");
	  equals( assertCollection([new Date], [new Date(1970)], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(Date: new Date)] and actual: [(Date: new Date(1970))]. Result");
	  // commented out as revisting equality and identity rules around strict checking
	  //equals( assertCollection([new Custom], [new Custom], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [(Custom: new Custom)] and actual: [(Custom: new Custom)]. Result");
	  equals( assertCollection([0,"string", true, [], {}, function() {}, null, undefined, /re/, new Date], [1,"string", true, [], {}, function() {}, null, undefined, /re/, new Date], {strictValueChecking:true}), false, "assertCollection() should be false with expected: [ MANY TYPES ] and actual: [ MANY TYPES ]");

	  // Expected true evaluations

	  // Test matching member values
	  equals( assertCollection([10], [10], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(Number: 10)] and actual: [(Number: 10)]. Result");
	  equals( assertCollection(["string"], ["string"], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(String: 'string')] and actual: [(String: 'string')]. Result");
	  equals( assertCollection([true], [true], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(Boolean: true)] and actual: [(Boolean: true)]. Result");
	  equals( assertCollection([[]], [[]], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(Array: [])] and actual: [(Array: [])]. Result");
	  equals( assertCollection([{}], [{}], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(Object: {})] and actual: [(Object: {})]. Result");
	  equals( assertCollection([{test: "string"}], [{test: "string"}], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(Object: {test: 'string'})] and actual: [(Object: {test: 'string'})]. Result");
	  equals( assertCollection([["nested"]], [["nested"]], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(Array: [[]])] and actual: [(Array: [[]])]. Result");
	  equals( assertCollection([function() {}], [function() {}], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(Function: function(){})] and actual: [(Function: function(){})]. Result");
	  equals( assertCollection([/re/], [/re/], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(RegExp: /re/)] and actual: [(RegExp: /re/)]. Result");

	  // Test matching member falsy values

	  equals( assertCollection([0], [0], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(Number: 0)] and actual: [(Number: 0)]. Result");
	  equals( assertCollection([""], [""], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(String: '')] and actual: [(String: '')]. Result");
	  equals( assertCollection([false], [false], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(Boolean: false)] and actual: [(Boolean: false)]. Result");
	  equals( assertCollection([null], [null], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(null)] and actual: [(null)]. Result");
	  equals( assertCollection([undefined], [undefined], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(undefined)] and actual: [(undefined)]. Result");

	  // Nested

	  equals( assertCollection([[[["test"]]]], [[[["test"]]]], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [(Array: [[[['test']]]])] with actual: (Array: [[[['test']]]]). Result");
	  equals( assertCollection(["one", ["two", ["three", ["four"]]]], ["one", ["two", ["three", ["four"]]]], {strictValueChecking:true}), true, "assertCollection() should be true with expected: [ MANY NESTED [] ] and actual: [ MANY NESTED [] ]. Result");

	});

	test("assertHash() - test interface & parameters", function () {

    debugger;
		// Expected false evaluations

		// Test no arguments
	  try {
			assertHash();
	    ok(false, "assertHash() should throw exception when passed No parameters");
	  } catch (exception) {
	    equals(exception.type, "MissingParametersException", "assertHash() exception type should be MissingParametersException for less than two parameters (required). Result");
	  }

	  // Test malformed arguments to interface afforded by assertHash() [see test suite for _isHash() for more examples]
	  try {
			assertHash( undefined, {}	);
	    ok(false, "assertHash() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "assertHash() requires the 'expected' and 'actual' parameters to be Hash-like objects. Result");
	  }

	  try {
			assertHash( {}, undefined );
	    ok(false, "assertHash() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "assertHash() requires the 'expected' and 'actual' parameters to be Hash-like objects. Result");
	  }

	  // Expected true evaluations

	  // Test passing in a hash-like objects [see other test groups fopr in-depth examples] and that returned value is a Boolean
    equals((function() {
      return assertHash({}, {});
    })(true)["constructor"], Boolean, "assertCollection() should allow Hash-like objects to be passed-in (e.g composite types and hashes) AND return a Boolean. Result");

	});

	test("_isHash() - black box test", function () {

	  var isHash = assertHash["_isHash"].get();

	  // Expected False Evaluations

	  // Test falsy types and primitive data types

	  equals( isHash( null ), false, "isHash() should be false with 'obj' parameter: (null). Result");
	  equals( isHash( undefined ), false, "isHash() should be false with 'obj' parameter: (undefined). Result");
	  equals( isHash( NaN ), false, "isHash() should be false with 'obj' parameter: (NaN). Result");
	  equals( isHash( 0 ), false, "isHash() should be false with 'obj' parameter: (Number: 0). Result");
	  equals( isHash( 1 ), false, "isHash() should be false with 'obj' parameter: (Number: 1). Result");
	  //equals( isHash( "" ), false, "isHash() should be false with 'obj' parameter: (String: ""). Result");
	  equals( isHash( "string primitive type" ), false, "isHash() should be false with 'obj' parameter: (String: 'string primitive type'). Result");
	  equals( isHash( false ), false, "isHash() should be false with 'obj' parameter: (Boolean: false). Result");
	  equals( isHash( true ), false, "isHash() should be false with 'obj' parameter: (Boolean: true). Result");

	  // Expected True Evalutions

	  // Test native & custom constructors

	  equals( isHash( Number ), true, "isHash() should be true with 'obj' parameter: (Number). Result");
	  equals( isHash( String ), true, "isHash() should be true with 'obj' parameter: (String). Result");
	  equals( isHash( Boolean ), true, "isHash() should be true with 'obj' parameter: (Boolean). Result");
	  equals( isHash( RegExp ), true, "isHash() should be true with 'obj' parameter: (RegExp). Result");
	  equals( isHash( Date ), true, "isHash() should be true with 'obj' parameter: (Date). Result");
	  equals( isHash( Function ), true, "isHash() should be true with 'obj' parameter: (Function). Result");
	  equals( isHash( Math ), true, "isHash() should be true with 'obj' parameter: (Math). Result");
	  equals( isHash( Array ), true, "isHash() should be true with 'obj' parameter: (Array). Result");
	  equals( isHash( Object ), true, "isHash() should be true with 'obj' parameter: (Object). Result");
	  equals( isHash( Custom ), true, "isHash() should be true with 'obj' parameter: (Custom). Result");

	  // Test composite data types

	  equals( isHash( Object(0) ), true, "isHash() should be true with 'obj' parameter: (Number: Object(0)). Result");
	  equals( isHash( Object(1) ), true, "isHash() should be true with 'obj' parameter: (Number: Object(1)). Result");
	  equals( isHash( Object("") ), true, "isHash() should be true with 'obj' parameter: (String: Object('')). Result");
	  equals( isHash( Object('string composite type') ), true, "isHash() should be true with 'obj' parameter: (String: Object('string compositive type')). Result");
	  equals( isHash( Object(false) ), true, "isHash() should be true with 'obj' parameter: (Boolean: false). Result");
	  equals( isHash( Object(true) ), true, "isHash() should be true with 'obj' parameter: (Boolean: true). Result");
	  equals( isHash( /re/ ), true, "isHash() should be true with 'obj' parameter: (RegExp: /re/). Result");
	  equals( isHash( function() {} ), true, "isHash() should be true with 'obj' parameter: (Function: function(){}). Result");
	  equals( isHash( {} ), true, "isHash() should be true with 'obj' parameter: (Object: {}). Result");
	  equals( isHash( [] ), true, "isHash() should be true with 'obj' parameter: (Array: []). Result");
	  equals( isHash( new Date ), true, "isHash() should be true with 'obj' parameter: (Date: new Date). Result");
	  equals( isHash( new Custom ), true, "isHash() should be true with 'obj' parameter: (Custom: new Custom). Result");

	});

	test("assertHash() - type checking", function () {

	  expect(37);

	  var mockErrorHandler = (function () {
	    var errors = [];
	    function handler (errorType, fn, expected, actual) {
	      errors.push({
	        type: errorType,
	        message: 'expected: "' + expected + '", actual: "' + actual + '"'
	      });
	    }
	    handler['reset'] = function () {
	      errors = [];
	    }
	    handler['throwErrors'] = function () {
	      if (errors.length > 0 ) {
	        throw errors;
	      } else {
	        return true;
	      }
	    }
	    return handler;
	  })();

	  /* Authors note - there are many tests and I've strived to use the same ones for both type checking and value checking of member properties between expected and actual 'hashes'.
	  * The as-is also implitly test the object checking callback (assertObject()) invoked within this function, as opposed to just the flow control logic that naively enumerates over hash-like objects, but this should be seen as a secondary concern to this test-suite.
	  * I simply wanted to poke the method a lot to see what it could handle. assertObject() has it's own test-suite available which actually focuses on object type checking and value assertion
	  */

	  // Type checking assertions (default)

	  // Expected false evaluations

	  // Test incomplete 'actual' object (vis-a-vis expected)...

	  // Single missing key
	  try {
	    assertHash({key: 'value'}, {}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "assertHash() should throw exception when passed an 'actual' object missing the 'key' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "assertHash() should raise a 'MissingHashKeyException' with expected: (Object {key: 'value'}) and actual: (Object {}). Error raised was");
	    equals( /expected: "key"/.test(e[0].message), true, "assertHash() should identify 'key' as the missing accessor with expected: (Object {key: 'value'}) and actual: (Object {}). Result");
	  }

	  mockErrorHandler.reset();

	  try {
	    assertHash({key: 'value', key2: 'value2'}, {key: 'value'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "assertHash() should throw exception when passed an 'actual' object missing the 'key2' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "assertHash() should raise a 'MissingHashKeyException' with expected: (Object {key: 'value', key2: 'value2'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key2"/.test(e[0].message), true, "assertHash() should identify 'key2' as the missing accessor with expected: (Object {key: 'value', key2: 'value2'}) and actual: (Object {key: 'value'}). Result");
	  }

    mockErrorHandler.reset();

	  try {
	    assertHash({key: 'value', key2: 'value2', key3: 'value'}, {key: 'value', key2: 'value2'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "assertHash() should throw exception when passed an 'actual' object missing the 'key3' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "assertHash() should raise a 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value', key2: 'value'}). Error raised was");
	    equals( /expected: "key3"/.test(e[0].message), true, "assertHash() should identify 'key3' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value', key2: 'value'}). Result");
	  }

	  mockErrorHandler.reset();

	  // Multiple missing keys
	  try {
	    assertHash({key: 'value', key2: 'value2', key3: 'value'}, {key: 'value'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "assertHash() should throw exception when passed an 'actual' object missing the 'key2' and 'key3' properties");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "assertHash() should raise a 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key2"/.test(e[0].message), true, "assertHash() should identify 'key2' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Result");
	    equals( e[1].type, "MissingHashKeyException", "assertHash() should raise a second 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key3"/.test(e[1].message), true, "assertHash() should identify 'key3' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Result");
	  }

	  mockErrorHandler.reset();

	  // Test mis-matched member types

	  equals( assertHash({Number: 10}, {Number: "string"}), false, "assertHash() should be false with expected: (Object {Number: 10}) and actual: (Object {Number: 'string'}). Result");
	  equals( assertHash({String: "string"}, {String: function() {}}), false, "assertHash() should be false with expected: (Object {String: 'string'}) and actual: (Object {String: function(){}}). Result");
	  equals( assertHash({Array: []}, {Array: {}}), false, "assertHash() should be false with expected: (Object {Array: []}) and actual: (Object {Array: {}}). Result");
	  equals( assertHash({Function: function() {}}, {Function: false}), false, "assertHash() should be false with expected: (Object {Function: function(){}}) and actual: (Object {Function: false}). Result");
	  equals( assertHash({"null": null},{"null": undefined}), false, "assertHash() should be false with expected: (Object {'null': null}) and actual: (Object {'null': undefined}). Result");
	  equals( assertHash({"undefined": undefined},{"undefined": null}), false, "assertHash() should be false with expected: (Object {'undefined': undefined}) and actual: (Object {'undefined': null}). Result");
	  equals( assertHash({RegExp: /re/},{RegExp: "/re/"}), false, "assertHash() should be false with expected: (Object {RegExp: /re/}) and actual: (Object {RegExp: '/re/'}). Result");
	  equals( assertHash({Custom: new Custom},{Custom: new Date}), false, "assertHash() should be false with expected: (Object {Custom: new Custom}) and actual: (Object {Custom: new Date})). Result");

	  // Expected true evaluations
	  // Test matching member types
	  equals( assertHash({Number: 0}, {Number: 0}), true, "assertHash() should be true with expected: (Object {Number: 0}) and actual: (Object {Number: 0}). Result" );
	  equals( assertHash({Number: 10}, {Number: 10}), true, "assertHash() should be true with expected: (Object {Number: 10}) and actual: (Object {Number: 10}). Result" );
	  equals( assertHash({String: ""}, {String: ""}), true, "assertHash() should be true with expected: (Object {String: ''}) and actual: (Object {String: ''}). Result" );
	  equals( assertHash({String: "string"}, {String: "string"}), true, "assertHash() should be true with expected: (Object {String: 'string'}) and actual: (Object {String: 'string'}). Result" );
	  equals( assertHash({Boolean: false}, {Boolean: false}), true, "assertHash() should be true with expected: (Object {Boolean: false}) and actual: (Object {Boolean: false}). Result" );
	  equals( assertHash({Boolean: true}, {Boolean: true}), true, "assertHash() should be true with expected: (Object {Boolean: true}) and actual: (Object {Boolean: true}). Result");
	  equals( assertHash({Array: []}, {Array: []}), true, "assertHash() should be true with expected: (Object {Array: []}) and actual: (Object {Array: []}). Result");
	  equals( assertHash({Array: ["one"]},{Array: ["one"]}), true, "assertHash() should be true with expected: (Object {Array: ['one']}) and actual: (Object {Array: ['one']}). Result");
	  equals( assertHash({Object: {}}, {Object: {}}), true, "assertHash() should be true with expected: (Object {Object: {}}) and actual: (Object {Object: {}}). Result");
	  equals( assertHash({Function: function() {}}, {Function: function() {}}), true, "assertHash() should be true with expected: (Object {Function: function(){}}) and actual: (Object {Function: function(){}}). Result");
	  equals( assertHash({"null": null},{"null": null}), true, "assertHash() should be true with expected: (Object {'null': null}) and actual: (Object {'null': null}). Result");
	  equals( assertHash({"undefined": undefined},{"undefined": undefined}), true, "assertHash() should be true with expected: (Object {'undefined': undefined}) and actual: (Object {'undefined': undefined}). Result");
	  equals( assertHash({RegExp: /re/},{RegExp: /re/}), true, "assertHash() should be true with expected: (Object {RegExp: /re/}) and actual: (Object {RegExp: /re/}). Result");
	  equals( assertHash({RegExp: /re/},{RegExp: /re2/}), true, "assertHash() should be true with expected: (Object {RegExp: /re/}) and actual: (Object {RegExp: /re2/}). Result");
	  equals( assertHash({Date: new Date},{Date: new Date}), true, "assertHash() should be true with expected: (Object {Date: new Date}) and actual: (Object {Date: new Date}). Result");
	  equals( assertHash({Date: new Date},{Date: new Date(1970)}), true, "assertHash() should be true with expected: (Object {Date: new Date}) and actual: (Object {Date: new Date(1970)}). Result");
	  equals( assertHash({Custom: new Custom},{Custom: new Custom}), true, "assertHash() should be true with expected: (Object {Custom: new Custom}) and actual: (Object {Custom: new Custom}). Result");
	  equals( assertHash({Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date}, {Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date}), true, "assertHash() should be true (Many native types). Result");

	  // Test nested object literals
	  equals( assertHash({"one": {"two": {"three": {"four": "value"}}}}, {"one": {"two": {"three": {"four": "value"}}}}), true, "assertHash() should be true with matching nested object literals 4 levels deep. Result");

	  // Test shadowed native keys ({DontEnum} IE bug)
    // ????? meh ???????
  });

  test("assertHash() - strict value checking", function () {

	  expect(46);

	  var mockErrorHandler = (function () {
	    var errors = [];
	    function handler (errorType, fn, expected, actual) {
	      errors.push({
	        type: errorType,
	        message: 'expected: "' + expected + '", actual: "' + actual + '"'
	      });
	    }
	    handler['reset'] = function () {
	      errors = [];
	    }
	    handler['throwErrors'] = function () {
	      if (errors.length > 0 ) {
	        throw errors;
	      } else {
	        return true;
	      }
	    }
	    return handler;
	  })();

	  // Strict value checking assertions (Boolean optional param)

	  // Expected false evaluations

	  // Test mis-matched member types

	  equals( assertHash({Number: 10}, {Number: "string"}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {Number: 10}) and actual: (Object {Number: 'string'}). Result");
	  equals( assertHash({String: "string"}, {String: function() {}}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {String: 'string'}) and actual: (Object {String: function(){}}). Result");
	  equals( assertHash({Array: []}, {Array: {}}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {Array: []}) and actual: (Object {Array: {}}). Result");
	  equals( assertHash({Function: function() {}}, {Function: false}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {Function: function(){}}) and actual: (Object {Function: false}). Result");
	  equals( assertHash({"null": null},{"null": undefined}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {'null': null}) and actual: (Object {'null': undefined}). Result");
	  equals( assertHash({"undefined": undefined},{"undefined": null}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {'undefined': undefined}) and actual: (Object {'undefined': null}). Result");
	  equals( assertHash({RegExp: /re/},{RegExp: "/re/"}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {RegExp: /re/}) and actual: (Object {RegExp: '/re/'}). Result");
	  equals( assertHash({Custom: new Custom},{Custom: new Date}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {Custom: new Custom}) and actual: (Object {Custom: new Date})). Result");

	  // Test mis-matched member values

	  equals( assertHash({String: "string"}, {String: "different string"}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {String: 'string'}) and actual: (Object {String: 'different string'}). Result");
	  equals( assertHash({Boolean: false}, {Boolean: true}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {Boolean: false}) and actual: (Object {Boolean: true}). Result");
	  equals( assertHash({Number: 1}, {Number: 2}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {Number: 1}) and actual: (Object {Number: 2}). Result");
	  equals( assertHash({RegExp: /re/}, {RegExp: /re2/}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {RegExp: /re/}) and actual: (Object {RegExp: /re2/}). Result");
	  equals( assertHash({Array: ["one"]},{Array: ["two"]}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {Array: ['one']}) and actual: (Object {Array: ['two']}). Result");
	  equals( assertHash({Object: {key: "value"}},{Object: {key: "value2"}}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {Object: {key: 'value'}}) and actual: (Object {Object: {key: 'value2'}}). Result");
	  equals( assertHash({"null": null},{"null": undefined}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {'null': null}) and actual: (Object {'null': undefined}). Result");
	  equals( assertHash({"undefined": undefined},{"undefined": null}, {strictValueChecking: true}), false, "assertHash() should be false with expected: (Object {'undefined': undefined}) and actual: (Object {'undefined': null}). Result");
	  equals( assertHash({Date: new Date},{Date: new Date(1970)}, {strictValueChecking: true}), false, "assertHash() should be true with expected: (Object {Date: new Date}) and actual: (Object {Date: new Date(1970)}). Result");
	  equals( assertHash({Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date}, {Number: 1,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date}, {strictValueChecking: true}), false, "assertHash() should be false (Many native types). Result");

	  // Test falsy nested object literals
	  equals( assertHash({"one": {"two": {"three": {"four": "value"}}}}, {"one": {"two": {"three": {"four": "string"}}}}, {strictValueChecking: true}), false, "assertHash() should be false with matching nested object literals 4 levels deep. Result");

	  // Test incomplete 'actual' object (vis-a-vis expected)...

	  // Single missing key
	  try {
	    assertHash({key: 'value'}, {}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "assertHash() should throw exception when passed an 'actual' object missing the 'key' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "assertHash() should raise a 'MissingHashKeyException' with expected: (Object {key: 'value'}) and actual: (Object {}). Error raised was");
	    equals( /expected: "key"/.test(e[0].message), true, "assertHash() should identify 'key' as the missing accessor with expected: (Object {key: 'value'}) and actual: (Object {}). Result");
	  }

	  mockErrorHandler.reset();

	  try {
	    assertHash({key: 'value', key2: 'value2'}, {key: 'value'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "assertHash() should throw exception when passed an 'actual' object missing the 'key2' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "assertHash() should raise a 'MissingHashKeyException' with expected: (Object {key: 'value', key2: 'value2'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key2"/.test(e[0].message), true, "assertHash() should identify 'key2' as the missing accessor with expected: (Object {key: 'value', key2: 'value2'}) and actual: (Object {key: 'value'}). Result");
	  }

	  mockErrorHandler.reset();

	  try {
	    assertHash({key: 'value', key2: 'value2', key3: 'value'}, {key: 'value', key2: 'value2'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "assertHash() should throw exception when passed an 'actual' object missing the 'key3' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "assertHash() should raise a 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value', key2: 'value'}). Error raised was");
	    equals( /expected: "key3"/.test(e[0].message), true, "assertHash() should identify 'key3' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value', key2: 'value'}). Result");
	  }

	  mockErrorHandler.reset();

	  // Multiple missing keys
	  try {
	    assertHash({key: 'value', key2: 'value2', key3: 'value'}, {key: 'value'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "assertHash() should throw exception when passed an 'actual' object missing the 'key2' and 'key3' properties");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "assertHash() should raise a 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key2"/.test(e[0].message), true, "assertHash() should identify 'key2' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Result");
	    equals( e[1].type, "MissingHashKeyException", "assertHash() should raise a second 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key3"/.test(e[1].message), true, "assertHash() should identify 'key3' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Result");
	  }

	  mockErrorHandler.reset();

	  // Expected true evaluations

	  // Test matching member values inc. potential false positives

	  equals( assertHash({Number: 0}, {Number: 0}, true), true, "assertHash() should be true with expected: (Object {Number: 0}) and actual: (Object {Number: 0}). Result" );
	  equals( assertHash({Number: 10}, {Number: 10}, true), true, "assertHash() should be true with expected: (Object {Number: 10}) and actual: (Object {Number: 10}). Result" );
	  equals( assertHash({String: ""}, {String: ""}, true), true, "assertHash() should be true with expected: (Object {String: ''}) and actual: (Object {String: ''}). Result" );
	  equals( assertHash({String: "string"}, {String: "string"}, true), true, "assertHash() should be true with expected: (Object {String: 'string'}) and actual: (Object {String: 'string'}). Result" );
	  equals( assertHash({Boolean: false}, {Boolean: false}, true), true, "assertHash() should be true with expected: (Object {Boolean: false}) and actual: (Object {Boolean: false}). Result" );
	  equals( assertHash({Boolean: true}, {Boolean: true}, true), true, "assertHash() should be true with expected: (Object {Boolean: true}) and actual: (Object {Boolean: true}). Result");
	  equals( assertHash({Array: []}, {Array: []}, true), true, "assertHash() should be true with expected: (Object {Array: []}) and actual: (Object {Array: []}). Result");
	  equals( assertHash({Array: ["one"]},{Array: ["one"]}, true), true, "assertHash() should be true with expected: (Object {Array: ['one']}) and actual: (Object {Array: ['one']}). Result");
	  equals( assertHash({Object: {}}, {Object: {}}, true), true, "assertHash() should be true with expected: (Object {Object: {}}) and actual: (Object {Object: {}}). Result");
	  // Not sure what to do with this one - it's definitely an edge case... for now maybe just defer to a quick type check (if expectedType === Function?)
	  equals( assertHash({Function: function() {}}, {Function: function() {}}, true), true, "assertHash() should be true with expected: (Object {Function: function(){}}) and actual: (Object {Function: function(){}}). Result");
	  equals( assertHash({"null": null},{"null": null}, true), true, "assertHash() should be true with expected: (Object {'null': null}) and actual: (Object {'null': null}). Result");
	  equals( assertHash({"undefined": undefined},{"undefined": undefined}, true), true, "assertHash() should be true with expected: (Object {'undefined': undefined}) and actual: (Object {'undefined': undefined}). Result");
	  equals( assertHash({RegExp: /re/},{RegExp: /re/}, true), true, "assertHash() should be true with expected: (Object {RegExp: /re/}) and actual: (Object {RegExp: /re/}). Result");
	  equals( assertHash({Date: new Date},{Date: new Date}, true), true, "assertHash() should be true with expected: (Object {Date: new Date}) and actual: (Object {Date: new Date}). Result");
	  equals( assertHash({Custom: new Custom},{Custom: new Custom}, true), true, "assertHash() should be true with expected: (Object {Custom: new Custom}) and actual: (Object {Custom: new Custom}). Result");
	  equals( assertHash({Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date}, {Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date}), true, "assertHash() should be true (Many native types). Result");

	  // Test nested object literals
	  equals( assertHash({"one": {"two": {"three": {"four": "value"}}}}, {"one": {"two": {"three": {"four": "value"}}}}, true), true, "assertHash() should be true with matching nested object literals 4 levels deep. Result");

	});

	test("assertHash() - test *interface* assertion use case", function () {

	});

	test("assertObject() - test interface & parameters", function () {

		/*// Test no arguments
	  try {
			assertCollection();
	    ok(false, "assertCollection() should throw exception when passed No parameters");
	  } catch (exception) {
	    equals(exception.type, "MissingParametersException", "assertCollection() exception type should be MissingParametersException for less than two parameters (required)");
	  }

	  // Test malformed arguments to interface afforded by assertCollection()
	  try {
			assertCollection( undefined, []	);
	    ok(false, "assertCollection() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "assertCollection() requires the 'expected' and 'actual' parameters to be Array-like objects");
	  }

	  try {
			assertCollection( [], undefined );
	    ok(false, "assertCollection() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "assertCollection() requires the 'expected' and 'actual' parameters to be Array-like objects");
	  }

	  // Test expected and actual collection of objects with different lengths
		 equals((function() {
          return assertCollection([1,2], arguments);
      })(1), false, "assertCollection() should return false if the 'expected' and 'actual' objects have mistmatched lengths");

	  // Test passing in an 'arguments' array
    equals((function() {
      return assertCollection([Boolean], arguments);
      })(true)["constructor"], Boolean, "assertCollection() should allow Array-like objects to be passed-in (e.g arguments collections) AND return a Boolean");
		*/

	});


	test("assertObject() - (Number: Constructor) primitive - typed checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors
		equals( assertObject(Number, String), false, "assertObject() should return false with expected: (Number) and actual: (String)" );
		equals( assertObject(Number, Boolean), false, "assertObject() should return false with expected: (Number) and actual: (Boolean)" );
		equals( assertObject(Number, Array), false, "assertObject() should return false with expected: (Number) and actual: (Array)" );
		equals( assertObject(Number, Object), false, "assertObject() should return false with expected: (Number) and actual: (Object)" );
		equals( assertObject(Number, Function), false, "assertObject() should return false with expected: (Number) and actual: (Function)" );
		equals( assertObject(Number, RegExp), false, "assertObject() should return false with expected: (Number) and actual: (RegExp)" );
		equals( assertObject(Number, Date), false, "assertObject() should return false with expected: (Number) and actual: (Date)" );
		equals( assertObject(Number, Custom), false, "assertObject() should return false with expected: (Number) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(Number, "string"), false, "assertObject() should return false with expected: (Number) and actual: (String: string)" );
		equals( assertObject(Number, true), false, "assertObject() should return false with expected: (Number) and actual: (Boolean: true)" );
		equals( assertObject(Number, []), false, "assertObject() should return false with expected: (Number) and actual: (Array: [])" );
		equals( assertObject(Number, {}), false, "assertObject() should return false with expected: (Number) and actual: (Object: {})" );
		equals( assertObject(Number, function(){}), false, "assertObject() should return false with expected: (Number) and actual: (Function: function(){})" );
		equals( assertObject(Number, /test/), false, "assertObject() should return false with expected: (Number) and actual: (RegExp: /test/)" );
		equals( assertObject(Number, new Date), false, "assertObject() should return false with expected: (Number) and actual: (Date: new instance)" );
		equals( assertObject(Number, new Custom), false, "assertObject() should return false with expected: (Number) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(Number, null), false, "assertObject() should return false with expected: (Number) and actual: (null)" );
		equals( assertObject(Number, undefined), false, "assertObject() should return false with expected: (Number) and actual: (undefined)" );
		// TRUE ASSERTIONS
		equals( assertObject(Number, Number), true, "assertObject() should return true with expected: (Number) and actual: (Number)" );
		equals( assertObject(Number, 1), true, "assertObject() should return true with expected: (Number) and actual: (Number: 1)" );
		equals( assertObject(Number, 0), true, "assertObject() should return true with expected: (Number) and actual: (Number: 0)" );

	});

	test("assertObject() - (Number: Constructor) primitive - strict value checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors
		equals( assertObject(Number, String, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (String)" );
		equals( assertObject(Number, Boolean, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Boolean)" );
		equals( assertObject(Number, Array, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Array)" );
		equals( assertObject(Number, Object, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Object)" );
		equals( assertObject(Number, Function, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Function)" );
		equals( assertObject(Number, RegExp, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (RegExp)" );
		equals( assertObject(Number, Date, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Date)" );
		equals( assertObject(Number, Custom, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(Number, "string", {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (String: string)" );
		equals( assertObject(Number, true, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Boolean: true)" );
		equals( assertObject(Number, [], {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Array: [])" );
		equals( assertObject(Number, {}, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Object: {})" );
		equals( assertObject(Number, function(){}, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Function: function(){})" );
		equals( assertObject(Number, /test/, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (RegExp: /test/)" );
		equals( assertObject(Number, new Date, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Date: new instance)" );
		equals( assertObject(Number, new Custom, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(Number, null, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (null)" );
		equals( assertObject(Number, undefined, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(Number, Number, {strictValueChecking: true} ), true, "assertObject() should return true with expected: (Number) and actual: (Number)" );
		equals( assertObject(Number, 1, {strictValueChecking: true} ), false, "assertObject() should return true with expected: (Number) and actual: (Number: 1)" );
		equals( assertObject(Number, 0, {strictValueChecking: true} ), false, "assertObject() should return true with expected: (Number) and actual: (Number: 0)" );

	});

	test("assertObject() - (Number: 1) primitive - typed checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(1, String), false, "assertObject() should return false with expected: (Number: 1) and actual: (String)" );
		equals( assertObject(1, Boolean), false, "assertObject() should return false with expected: (Number: 1) and actual: (Boolean)" );
		equals( assertObject(1, Array), false, "assertObject() should return false with expected: (Number: 1) and actual: (Array)" );
		equals( assertObject(1, Object), false, "assertObject() should return false with expected: (Number: 1) and actual: (Object)" );
		equals( assertObject(1, Function), false, "assertObject() should return false with expected: (Number: 1) and actual: (Function)" );
		equals( assertObject(1, RegExp), false, "assertObject() should return false with expected: (Number: 1) and actual: (RegExp)" );
		equals( assertObject(1, Date), false, "assertObject() should return false with expected: (Number: 1) and actual: (Date)" );
		equals( assertObject(1, Custom), false, "assertObject() should return false with expected: (Number: 1) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(1, "string"), false, "assertObject() should return false with expected: (Number: 1) and actual: (String: string)" );
		equals( assertObject(1, true), false, "assertObject() should return false with expected: (Number: 1) and actual: (Boolean: true)" );
		equals( assertObject(1, []), false, "assertObject() should return false with expected: (Number: 1) and actual: (Array: [])" );
		equals( assertObject(1, {}), false, "assertObject() should return false with expected: (Number: 1) and actual: (Object: {})" );
		equals( assertObject(1, function(){}), false, "assertObject() should return false with expected: (Number: 1) and actual: (Function: function(){})" );
		equals( assertObject(1, /test/), false, "assertObject() should return false with expected: (Number: 1) and actual: (RegExp: /test/)" );
		equals( assertObject(1, new Date), false, "assertObject() should return false with expected: (Number: 1) and actual: (Date: new instance)" );
		equals( assertObject(1, new Custom), false, "assertObject() should return false with expected: (Number: 1) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(1, null), false, "assertObject() should return false with expected: (Number: 1) and actual: (null)" );
		equals( assertObject(1, undefined), false, "assertObject() should return false with expected: (Number: 1) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(1, Number), true, "assertObject() should return true with expected: (Number: 1) and actual: (Number)" );
		equals( assertObject(1, 1), true, "assertObject() should return true with expected: (Number: 1) and actual: (Number: 1)" );
		equals( assertObject(1, 0), true, "assertObject() should return true with expected: (Number: 1) and actual: (Number: 0)" );

		// Expect Falsy Value
		equals( assertObject(0, Number ), true, "assertObject() should return true with expected: (Number: 0) and actual: (Number)" );
		equals( assertObject(0, 1 ), true, "assertObject() should return true with expected: (Number: 0) and actual: (Number: 1)" );
		equals( assertObject(0, 0 ), true, "assertObject() should return true with expected: (Number: 0) and actual: (Number: 0)" );

	});

	test("assertObject() - (Number: 1) primitive - strict value checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors
		equals( assertObject(1, String, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (String)" );
		equals( assertObject(1, Boolean, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Boolean)" );
		equals( assertObject(1, Array, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Array)" );
		equals( assertObject(1, Object, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Object)" );
		equals( assertObject(1, Function, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Function)" );
		equals( assertObject(1, RegExp, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (RegExp)" );
		equals( assertObject(1, Date, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Date)" );
		equals( assertObject(1, Custom, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(1, "string", {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (String: string)" );
		equals( assertObject(1, true, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Boolean: true)" );
		equals( assertObject(1, [], {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Array: [])" );
		equals( assertObject(1, {}, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Object: {})" );
		equals( assertObject(1, function(){}, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Function: function(){})" );
		equals( assertObject(1, /test/, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (RegExp: /test/)" );
		equals( assertObject(1, new Date, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Date: new instance)" );
		equals( assertObject(1, new Custom, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values
		equals( assertObject(1, null, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (null)" );
		equals( assertObject(1, undefined, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(1, Number, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Number)" );
		equals( assertObject(1, 1, {strictValueChecking: true} ), true, "assertObject() should return true with expected: (Number: 1) and actual: (Number: 1)" );
		equals( assertObject(1, 0, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 1) and actual: (Number: 0)" );

		// Expect Falsy Value
		equals( assertObject(0, Number, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 0) and actual: (Number)" );
		equals( assertObject(0, 1, {strictValueChecking: true} ), false, "assertObject() should return false with expected: (Number: 0) and actual: (Number: 1)" );
		equals( assertObject(0, 0, {strictValueChecking: true} ), true, "assertObject() should return true with expected: (Number: 0) and actual: (Number: 0)" );

	});

	test("assertObject() - (String: Constructor) primitive - typed checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(String, Number), false, "assertObject() should return false with expected: (String) and actual: (Number)" );
		equals( assertObject(String, Boolean), false, "assertObject() should return false with expected: (String) and actual: (Boolean)" );
		equals( assertObject(String, Array), false, "assertObject() should return false with expected: (String) and actual: (Array)" );
		equals( assertObject(String, Object), false, "assertObject() should return false with expected: (String) and actual: (Object)" );
		equals( assertObject(String, Function), false, "assertObject() should return false with expected: (String) and actual: (Function)" );
		equals( assertObject(String, RegExp), false, "assertObject() should return false with expected: (String) and actual: (RegExp)" );
		equals( assertObject(String, Date), false, "assertObject() should return false with expected: (String) and actual: (Date)" );
		equals( assertObject(String, Custom), false, "assertObject() should return false with expected: (String) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(String, 1), false, "assertObject() should return false with expected: (String) and actual: (Number: 1)" );
		equals( assertObject(String, true), false, "assertObject() should return false with expected: (String) and actual: (Boolean: true)" );
		equals( assertObject(String, []), false, "assertObject() should return false with expected: (String) and actual: (Array: [])" );
		equals( assertObject(String, {}), false, "assertObject() should return false with expected: (String) and actual: (Object: {})" );
		equals( assertObject(String, function(){}), false, "assertObject() should return false with expected: (String) and actual: (Function: function(){})" );
		equals( assertObject(String, /test/), false, "assertObject() should return false with expected: (String) and actual: (RegExp: /test/)" );
		equals( assertObject(String, new Date), false, "assertObject() should return false with expected: (String) and actual: (Date: new instance)" );
		equals( assertObject(String, new Custom), false, "assertObject() should return false with expected: (String) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(String, null), false, "assertObject() should return false with expected: (String) and actual: (null)" );
		equals( assertObject(String, undefined), false, "assertObject() should return false with expected: (String) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(String, String), true, "assertObject() should return true with expected: (String) and actual: (String)" );
		equals( assertObject(String, "string"), true, "assertObject() should return true with expected: (String) and actual: (String: 'string')" );
		equals( assertObject(String, ""), true, "assertObject() should return true with expected: (String) and actual: (String: '')" );

	});

	test("assertObject() - (String: Constructor) primitive - strict value checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(String, Number, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Number)" );
		equals( assertObject(String, Boolean, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Boolean)" );
		equals( assertObject(String, Array, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Array)" );
		equals( assertObject(String, Object, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Object)" );
		equals( assertObject(String, Function, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Function)" );
		equals( assertObject(String, RegExp, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (RegExp)" );
		equals( assertObject(String, Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Date)" );
		equals( assertObject(String, Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(String, 1, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Number: 1)" );
		equals( assertObject(String, true, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Boolean: true)" );
		equals( assertObject(String, [], {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Array: [])" );
		equals( assertObject(String, {}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Object: {})" );
		equals( assertObject(String, function(){}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Function: function(){})" );
		equals( assertObject(String, /test/, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (RegExp: /test/)" );
		equals( assertObject(String, new Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Date: new instance)" );
		equals( assertObject(String, new Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(String, null, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (null)" );
		equals( assertObject(String, undefined, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(String, String, {strictValueChecking: true}), true, "assertObject() should return true with expected: (String) and actual: (String)" );
		equals( assertObject(String, "string", {strictValueChecking: true}), false, "assertObject() should return true with expected: (String) and actual: (String: 'string')" );
		equals( assertObject(String, "", {strictValueChecking: true}), false, "assertObject() should return true with expected: (String) and actual: (String: '')" );

	});

	test("assertObject() - (String: 'string') primitive - typed checking only", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject('string', Number), false, "assertObject() should return false with expected: (String: 'string') and actual: (Number)" );
		equals( assertObject('string', Boolean), false, "assertObject() should return false with expected: (String: 'string') and actual: (Boolean)" );
		equals( assertObject('string', Array), false, "assertObject() should return false with expected: (String: 'string') and actual: (Array)" );
		equals( assertObject('string', Object), false, "assertObject() should return false with expected: (String: 'string') and actual: (Object)" );
		equals( assertObject('string', Function), false, "assertObject() should return false with expected: (String: 'string') and actual: (Function)" );
		equals( assertObject('string', RegExp), false, "assertObject() should return false with expected: (String: 'string') and actual: (RegExp)" );
		equals( assertObject('string', Date), false, "assertObject() should return false with expected: (String: 'string') and actual: (Date)" );
		equals( assertObject('string', Custom), false, "assertObject() should return false with expected: (String: 'string') and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject('string', 1), false, "assertObject() should return false with expected: (String: 'string') and actual: (Number: 1)" );
		equals( assertObject('string', true), false, "assertObject() should return false with expected: (String: 'string') and actual: (Boolean: true)" );
		equals( assertObject('string', []), false, "assertObject() should return false with expected: (String: 'string') and actual: (Array: [])" );
		equals( assertObject('string', {}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Object: {})" );
		equals( assertObject('string', function(){}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Function: function(){})" );
		equals( assertObject('string', /test/), false, "assertObject() should return false with expected: (String: 'string') and actual: (RegExp: /test/)" );
		equals( assertObject('string', new Date), false, "assertObject() should return false with expected: (String: 'string') and actual: (Date: new instance)" );
		equals( assertObject('string', new Custom), false, "assertObject() should return false with expected: (String: 'string') and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject('string', null), false, "assertObject() should return false with expected: (String: 'string') and actual: (null)" );
		equals( assertObject('string', undefined), false, "assertObject() should return false with expected: (String: 'string') and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject('string', String), true, "assertObject() should return true with expected: (String: 'string') and actual: (String)" );
		equals( assertObject('string', "string"), true, "assertObject() should return true with expected: (String: 'string') and actual: (String: 'string')" );
		equals( assertObject('string', ""), true, "assertObject() should return true with expected: (String: 'string') and actual: (String: '')" );

		// Expect Falsy Value
		equals( assertObject('', String), true, "assertObject() should return true with expected: (String: '') and actual: (String)" );
		equals( assertObject('', "string"), true, "assertObject() should return true with expected: (String: '') and actual: (String: 'string')" );
		equals( assertObject('', ""), true, "assertObject() should return true with expected: (String: '') and actual: (String: '')" );

	});

	test("assertObject() - (String: 'string') primitive - strict value checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject('string', Number, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Number)" );
		equals( assertObject('string', Boolean, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Boolean)" );
		equals( assertObject('string', Array, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Array)" );
		equals( assertObject('string', Object, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Object)" );
		equals( assertObject('string', Function, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Function)" );
		equals( assertObject('string', RegExp, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (RegExp)" );
		equals( assertObject('string', Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Date)" );
		equals( assertObject('string', Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject('string', 1, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Number: 1)" );
		equals( assertObject('string', true, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Boolean: true)" );
		equals( assertObject('string', [], {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Array: [])" );
		equals( assertObject('string', {}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Object: {})" );
		equals( assertObject('string', function(){}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Function: function(){})" );
		equals( assertObject('string', /test/, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (RegExp: /test/)" );
		equals( assertObject('string', new Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Date: new instance)" );
		equals( assertObject('string', new Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject('string', null, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (null)" );
		equals( assertObject('string', undefined, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject('string', String, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (String)" );
		equals( assertObject('string', "string", {strictValueChecking: true}), true, "assertObject() should return true with expected: (String: 'string') and actual: (String: 'string')" );
		equals( assertObject('string', "", {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: 'string') and actual: (String: '')" );

		// Expect Falsy Value
		equals( assertObject('', String, {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: '') and actual: (String)" );
		equals( assertObject('', "string", {strictValueChecking: true}), false, "assertObject() should return false with expected: (String: '') and actual: (String: 'string')" );
		equals( assertObject('', "", {strictValueChecking: true}), true, "assertObject() should return true with expected: (String: '') and actual: (String: '')" );

	});

	test("assertObject() - (Boolean: Constructor) primitive - typed checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(Boolean, Number), false, "assertObject() should return false with expected: (Boolean) and actual: (Number)" );
		equals( assertObject(Boolean, String), false, "assertObject() should return false with expected: (Boolean) and actual: (String)" );
		equals( assertObject(Boolean, Array), false, "assertObject() should return false with expected: (Boolean) and actual: (Array)" );
		equals( assertObject(Boolean, Object), false, "assertObject() should return false with expected: (Boolean) and actual: (Object)" );
		equals( assertObject(Boolean, Function), false, "assertObject() should return false with expected: (Boolean) and actual: (Function)" );
		equals( assertObject(Boolean, RegExp), false, "assertObject() should return false with expected: (Boolean) and actual: (RegExp)" );
		equals( assertObject(Boolean, Date), false, "assertObject() should return false with expected: (Boolean) and actual: (Date)" );
		equals( assertObject(Boolean, Custom), false, "assertObject() should return false with expected: (Boolean) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(Boolean, 1), false, "assertObject() should return false with expected: (Boolean) and actual: (Number: 1)" );
		equals( assertObject(Boolean, "string"), false, "assertObject() should return false with expected: (Boolean) and actual: (String: string)" );
		equals( assertObject(Boolean, []), false, "assertObject() should return false with expected: (Boolean) and actual: (Array: [])" );
		equals( assertObject(Boolean, {}), false, "assertObject() should return false with expected: (Boolean) and actual: (Object: {})" );
		equals( assertObject(Boolean, function(){}), false, "assertObject() should return false with expected: (Boolean) and actual: (Function: function(){})" );
		equals( assertObject(Boolean, /test/), false, "assertObject() should return false with expected: (Boolean) and actual: (RegExp: /test/)" );
		equals( assertObject(Boolean, new Date), false, "assertObject() should return false with expected: (Boolean) and actual: (Date: new instance)" );
		equals( assertObject(Boolean, new Custom), false, "assertObject() should return false with expected: (Boolean) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(Boolean, null), false, "assertObject() should return false with expected: (Boolean) and actual: (null)" );
		equals( assertObject(Boolean, undefined), false, "assertObject() should return false with expected: (Boolean) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(Boolean, Boolean), true, "assertObject() should return true with expected: (Boolean) and actual: (Boolean)" );
		equals( assertObject(Boolean, true), true, "assertObject() should return true with expected: (Boolean) and actual: (Boolean: true)" );
		equals( assertObject(Boolean, false), true, "assertObject() should return true with expected: (Boolean) and actual: (Boolean: false)" );

	});

	test("assertObject() - (Boolean: Constructor) primitive - strict value checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(Boolean, Number, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Number)" );
		equals( assertObject(Boolean, String, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (String)" );
		equals( assertObject(Boolean, Array, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Array)" );
		equals( assertObject(Boolean, Object, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Object)" );
		equals( assertObject(Boolean, Function, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Function)" );
		equals( assertObject(Boolean, RegExp, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (RegExp)" );
		equals( assertObject(Boolean, Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Date)" );
		equals( assertObject(Boolean, Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(Boolean, 1, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Number: 1)" );
		equals( assertObject(Boolean, "string", {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (String: string)" );
		equals( assertObject(Boolean, [], {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Array: [])" );
		equals( assertObject(Boolean, {}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Object: {})" );
		equals( assertObject(Boolean, function(){}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Function: function(){})" );
		equals( assertObject(Boolean, /test/, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (RegExp: /test/)" );
		equals( assertObject(Boolean, new Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Date: new instance)" );
		equals( assertObject(Boolean, new Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(Boolean, null, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (null)" );
		equals( assertObject(Boolean, undefined, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(Boolean, Boolean, {strictValueChecking: true}), true, "assertObject() should return true with expected: (Boolean) and actual: (Boolean)" );
		equals( assertObject(Boolean, true, {strictValueChecking: true}), false, "assertObject() should return true with expected: (Boolean) and actual: (Boolean: true)" );
		equals( assertObject(Boolean, false, {strictValueChecking: true}), false, "assertObject() should return true with expected: (Boolean) and actual: (Boolean: false)" );

	});

	test("assertObject() - (Boolean: true) primitive - typed checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(true, Number), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Number)" );
		equals( assertObject(true, String), false, "assertObject() should return false with expected: (Boolean: true) and actual: (String)" );
		equals( assertObject(true, Array), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Array)" );
		equals( assertObject(true, Object), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Object)" );
		equals( assertObject(true, Function), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Function)" );
		equals( assertObject(true, RegExp), false, "assertObject() should return false with expected: (Boolean: true) and actual: (RegExp)" );
		equals( assertObject(true, Date), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Date)" );
		equals( assertObject(true, Custom), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(true, 1), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Number: 1)" );
		equals( assertObject(true, "string"), false, "assertObject() should return false with expected: (Boolean: true) and actual: (String: string)" );
		equals( assertObject(true, []), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Array: [])" );
		equals( assertObject(true, {}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Object: {})" );
		equals( assertObject(true, function(){}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Function: function(){})" );
		equals( assertObject(true, /test/), false, "assertObject() should return false with expected: (Boolean: true) and actual: (RegExp: /test/)" );
		equals( assertObject(true, new Date), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Date: new instance)" );
		equals( assertObject(true, new Custom), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(true, null), false, "assertObject() should return false with expected: (Boolean: true) and actual: (null)" );
		equals( assertObject(true, undefined), false, "assertObject() should return false with expected: (Boolean: true) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(true, Boolean), true, "assertObject() should return true with expected: (Boolean: true) and actual: (Boolean)" );
		equals( assertObject(true, true), true, "assertObject() should return true with expected: (Boolean: true) and actual: (Boolean: true)" );
		equals( assertObject(true, false), true, "assertObject() should return true with expected: (Boolean: true) and actual: (Boolean: false)" );

		// Expect Falsy Value
		equals( assertObject(false, Boolean), true, "assertObject() should return true with expected: (Boolean: false) and actual: (Boolean)" );
		equals( assertObject(false, true), true, "assertObject() should return true with expected: (Boolean: false) and actual: (Boolean: true)" );
		equals( assertObject(false, false), true, "assertObject() should return true with expected: (Boolean: false) and actual: (Boolean: false)" );

	});

	test("assertObject() - (Boolean: true) primitive - strict value checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(true, Number, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Number)" );
		equals( assertObject(true, String, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (String)" );
		equals( assertObject(true, Array, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Array)" );
		equals( assertObject(true, Object, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Object)" );
		equals( assertObject(true, Function, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Function)" );
		equals( assertObject(true, RegExp, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (RegExp)" );
		equals( assertObject(true, Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Date)" );
		equals( assertObject(true, Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(true, 1, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Number: 1)" );
		equals( assertObject(true, "string", {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (String: string)" );
		equals( assertObject(true, [], {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Array: [])" );
		equals( assertObject(true, {}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Object: {})" );
		equals( assertObject(true, function(){}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Function: function(){})" );
		equals( assertObject(true, /test/, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (RegExp: /test/)" );
		equals( assertObject(true, new Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Date: new instance)" );
		equals( assertObject(true, new Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(true, null, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (null)" );
		equals( assertObject(true, undefined, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: true) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(true, Boolean, {strictValueChecking: true}), false, "assertObject() should return true with expected: (Boolean: true) and actual: (Boolean)" );
		equals( assertObject(true, true, {strictValueChecking: true}), true, "assertObject() should return true with expected: (Boolean: true) and actual: (Boolean: true)" );
		equals( assertObject(true, false, {strictValueChecking: true}), false, "assertObject() should return true with expected: (Boolean: true) and actual: (Boolean: false)" );

		// Expect Falsy Value
		equals( assertObject(false, Boolean, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: false) and actual: (Boolean)" );
		equals( assertObject(false, true, {strictValueChecking: true}), false, "assertObject() should return false with expected: (Boolean: false) and actual: (Boolean: true)" );
		equals( assertObject(false, false, {strictValueChecking: true}), true, "assertObject() should return true with expected: (Boolean: false) and actual: (Boolean: false)" );

	});

	test("assertObject() - (RegExp) composite - typed checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(RegExp, Number), false, "assertObject() should return false with expected: (RegExp) and actual: (Number)" );
		equals( assertObject(RegExp, String), false, "assertObject() should return false with expected: (RegExp) and actual: (String)" );
		equals( assertObject(RegExp, Boolean), false, "assertObject() should return false with expected: (RegExp) and actual: (Boolean)" );
		equals( assertObject(RegExp, Array), false, "assertObject() should return false with expected: (RegExp) and actual: (Array)" );
		equals( assertObject(RegExp, Object), false, "assertObject() should return false with expected: (RegExp) and actual: (Object)" );
		equals( assertObject(RegExp, Function), false, "assertObject() should return false with expected: (RegExp) and actual: (Function)" );
		equals( assertObject(RegExp, Date), false, "assertObject() should return false with expected: (RegExp) and actual: (Date)" );
		equals( assertObject(RegExp, Custom), false, "assertObject() should return false with expected: (RegExp) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(RegExp, 1), false, "assertObject() should return false with expected: (RegExp) and actual: (Number: 1)" );
		equals( assertObject(RegExp, "string"), false, "assertObject() should return false with expected: (RegExp) and actual: (String: string)" );
		equals( assertObject(RegExp, true), false, "assertObject() should return false with expected: (RegExp) and actual: (Boolean: true)" );
		equals( assertObject(RegExp, []), false, "assertObject() should return false with expected: (RegExp) and actual: (Array: [])" );
		equals( assertObject(RegExp, {}), false, "assertObject() should return false with expected: (RegExp) and actual: (Object: {})" );
		equals( assertObject(RegExp, function(){}), false, "assertObject() should return false with expected: (RegExp) and actual: (Function: function(){})" );
		equals( assertObject(RegExp, new Date), false, "assertObject() should return false with expected: (RegExp) and actual: (Date: new instance)" );
		equals( assertObject(RegExp, new Custom), false, "assertObject() should return false with expected: (RegExp) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(RegExp, null), false, "assertObject() should return false with expected: (RegExp) and actual: (null)" );
		equals( assertObject(RegExp, undefined), false, "assertObject() should return false with expected: (RegExp) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(RegExp, RegExp), true, "assertObject() should return true with expected: (RegExp) and actual: (RegExp)" );
		equals( assertObject(RegExp, /re/), true, "assertObject() should return true with expected: (RegExp) and actual: (RegExp: /re/)" );
		equals( assertObject(RegExp, new RegExp(/re/)), true, "assertObject() should return true with expected: (RegExp) and actual: (RegExp: new RegExp(/re/))" );

	});

	test("assertObject() - (RegExp) composite - strict 'value' checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(RegExp, Number, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Number)" );
		equals( assertObject(RegExp, String, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (String)" );
		equals( assertObject(RegExp, Boolean, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Boolean)" );
		equals( assertObject(RegExp, Array, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Array)" );
		equals( assertObject(RegExp, Object, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Object)" );
		equals( assertObject(RegExp, Function, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Function)" );
		equals( assertObject(RegExp, Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Date)" );
		equals( assertObject(RegExp, Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(RegExp, 1, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Number: 1)" );
		equals( assertObject(RegExp, "string", {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (String: string)" );
		equals( assertObject(RegExp, true, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Boolean: true)" );
		equals( assertObject(RegExp, [], {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Array: [])" );
		equals( assertObject(RegExp, {}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Object: {})" );
		equals( assertObject(RegExp, function(){}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Function: function(){})" );
		equals( assertObject(RegExp, new Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Date: new instance)" );
		equals( assertObject(RegExp, new Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(RegExp, null, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (null)" );
		equals( assertObject(RegExp, undefined, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(RegExp, RegExp, {strictValueChecking: true}), true, "assertObject() should return true with expected: (RegExp) and actual: (RegExp)" );
		equals( assertObject(RegExp, /re/, {strictValueChecking: true}), false, "assertObject() should return true with expected: (RegExp) and actual: (RegExp: /re/)" );
		equals( assertObject(RegExp, new RegExp(/re/), {strictValueChecking: true}), false, "assertObject() should return true with expected: (RegExp) and actual: (RegExp: new RegExp(/re/))" );

	});


	test("assertObject() - (RegExp: /re/) composite - typed checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(/re/, Number), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Number)" );
		equals( assertObject(/re/, String), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (String)" );
		equals( assertObject(/re/, Boolean), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Boolean)" );
		equals( assertObject(/re/, Array), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Array)" );
		equals( assertObject(/re/, Object), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Object)" );
		equals( assertObject(/re/, Function), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Function)" );
		equals( assertObject(/re/, Date), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Date)" );
		equals( assertObject(/re/, Custom), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(/re/, 1), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Number: 1)" );
		equals( assertObject(/re/, "string"), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (String: string)" );
		equals( assertObject(/re/, true), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Boolean: true)" );
		equals( assertObject(/re/, []), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Array: [])" );
		equals( assertObject(/re/, {}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Object: {})" );
		equals( assertObject(/re/, function(){}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Function: function(){})" );
		equals( assertObject(/re/, new Date), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Date: new instance)" );
		equals( assertObject(/re/, new Custom), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(/re/, null), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (null)" );
		equals( assertObject(/re/, undefined), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(/re/, RegExp), true, "assertObject() should return true with expected: (RegExp: /re/) and actual: (RegExp)" );
		equals( assertObject(/re/, /re/), true, "assertObject() should return true with expected: (RegExp: /re/) and actual: (RegExp: /re/)" );
		equals( assertObject(/re/, new RegExp(/re/)), true, "assertObject() should return true with expected: (RegExp: /re/) and actual: (RegExp: new RegExp(/re/))" );

	});

	test("assertObject() - (RegExp: /re/) composite - strict 'value' checking", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( assertObject(/re/, Number, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Number)" );
		equals( assertObject(/re/, String, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (String)" );
		equals( assertObject(/re/, Boolean, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Boolean)" );
		equals( assertObject(/re/, Array, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Array)" );
		equals( assertObject(/re/, Object, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Object)" );
		equals( assertObject(/re/, Function, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Function)" );
		equals( assertObject(/re/, Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Date)" );
		equals( assertObject(/re/, Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Custom)" );

		// Test invalid argument type - Values (truthy)

		equals( assertObject(/re/, 1, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Number: 1)" );
		equals( assertObject(/re/, "string", {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (String: string)" );
		equals( assertObject(/re/, true, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Boolean: true)" );
		equals( assertObject(/re/, [], {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Array: [])" );
		equals( assertObject(/re/, {}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Object: {})" );
		equals( assertObject(/re/, function(){}, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Function: function(){})" );
		equals( assertObject(/re/, new Date, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Date: new instance)" );
		equals( assertObject(/re/, new Custom, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( assertObject(/re/, null, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (null)" );
		equals( assertObject(/re/, undefined, {strictValueChecking: true}), false, "assertObject() should return false with expected: (RegExp: /re/) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( assertObject(/re/, RegExp, {strictValueChecking: true}), false, "assertObject() should return true with expected: (RegExp: /re/) and actual: (RegExp)" );
		equals( assertObject(/re/, /re/, {strictValueChecking: true}), true, "assertObject() should return true with expected: (RegExp: /re/) and actual: (RegExp: /re/)" );
		equals( assertObject(/re/, new RegExp(/re/), {strictValueChecking: true}), true, "assertObject() should return true with expected: (RegExp: /re/) and actual: (RegExp: new RegExp(/re/))" );

	});

/*
	test("createException()", function() {

	});

	test("createMockFromJSON()", function() {

	});
*/

	/**
	 *
	 * Unit tests for black-boxed qMock interface - asserting against mock API
	 *
	 */

	module("qMock Interface");

	/**
	 * All tests follow this simple process:
	 *
	 *  1. Setup: Instantiate mocks and set expected interactions upon them. Sometimes located in the 'setup' phase of the testrunner before each test block.
	 *  2. Exercise: Execute the relevant collaborator code to interact with the mock object.
	 *  3. Verify: Call the verify method on each mock object to establish if it was interacted with correctly.
	 *  4. Reset: [Optional] Call reset method on the mock to return it's internal state to the end of the setup phase. Sometimes located in the 'teardown' phase of the testrunner after each test phase.
	 *
	 */

	test("w/ API: mock with single parameterless method (explicit execution call total, no return value)", function () {

	  expect(16);
	  var ninja = new Mock();

	  // Test invalid method naming - protect API if using mocked member interface to set methods and properties
	  try {
	    ninja.expects(1).method('expects');
	    ok(false, "mock should detect bad method name 'expects'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown when bad method name 'expects' is used. Actual was");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  var ninja = new Mock();  // Can't call reset as mock is broken, must re-instantiate mock instance.

	  try {
	    ninja.expects(1).method('andExpects');
	    ok(false, "mock should detect bad method name 'andExpects'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  ninja = new Mock(); // Can't call reset as mock is broken, must re-instantiate mock instance.

	  try {
	    ninja.expects(1).method('expectsArguments');
	    ok(false, "mock should detect bad method name 'expectsArguments'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  ninja = new Mock(); // Can't call reset as mock is broken, must re-instantiate mock instance.

	  try {
	    ninja.expects(1).method('reset');
	    ok(false, "mock should detect bad method name 'reset'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  ninja = new Mock(); // Can't call reset as mock is broken, must re-instantiate mock instance.

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
	      "expects" : {
	        // expectations
	      }
	    });
	    ok(false, "mock should detect bad method name 'expects'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  try {
	    // Can't call reset as mock is broken, must re-instantiate mock instance.
	    ninja = new Mock({
	      "andExpects" : {
	        // expectations
	      }
	    });
	    ok(false, "mock should detect bad method name 'andExpects'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  try {
	    // Can't call reset as mock is broken, must re-instantiate mock instance.
	    ninja = new Mock({
	      "expectsArguments" : {
	        // expectations
	      }
	    });
	    ok(false, "mock should detect bad method name 'expectsArguments'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }

	  try {
	    // Can't call reset as mock is broken, must re-instantiate mock instance.
	    ninja = new Mock({
	      "expectsArguments" : {
	        // expectations
	      }
	    });
	    ok(false, "mock should detect bad method name 'reset'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidMethodNameException", "exception type should be InvalidMethodNameException");
	  }
	  // Can't call reset as mock is broken, must re-instantiate mock instance.
	  ninja = new Mock({
	    "swing"  : {
	      // expectations
	      calls : 1
	    }
	  });

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
			ok(false, "verify() should throw exception when swing called too many times (test false positive)");
		} catch (e) {
			equals(e.length, 1, "verify() should return an array of 1 exception");
			equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
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


	test("w/ API: mock with single parameterless method (arbitrary execution call range, no return value)", function() {

	  expect(12);

	  var ninja = new Mock();

	  ninja
	    .expects(1, 3)
	      .method('swing');

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
	        ok(false, "verify() should throw exception when swing out of defined call execution range");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exception");
	        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
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
	        ok(false, "verify() should throw exception when swing out of defined call execution range");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exception");
	        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
	    }

	});

	test("w/ API: mock with multiple parameterless methods", function () {

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
	        ok(false, "verify() should throw exception when no methods called");
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
	        ok(false, "verify() should throw exception when no methods called");
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

	test("w/ API: mock with stubbed properties", function () {

	  expect(15);

	  var ninja = new Mock();

	  // Test invalid property naming
	  try {
	    ninja.expects(1).property('expects');
	    ok(false, "mock should throw 'InvalidPropertyNameException' when trying to set a bad property name of 'expects'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidPropertyNameException", "exception type should be InvalidPropertyNameException");
	  }

	  var ninja = new Mock();

	  ninja
	    .expects()
	      .property("rank")
	      .withValue("apprentice");

	  ok( (ninja.rank === "apprentice") , "ninja mock object should have a property with an identifier 'rank' that has a value of 'apprentice'" );

	  ninja = new Mock();

	  ninja
	    .expects()
	      .property("rank")
	      .withValue("apprentice")
	    .andExpects()
	      .property("master")
	      .withValue("The Chrome");

	  ok( ( (ninja.rank === "apprentice") && (ninja.master === "The Chrome") ) , "ninja mock object should have two properties with the identifiers 'rank' & 'master', and values of 'apprentice' and 'The Chrome' respectively")

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
	      .withValue(new Date(1970))
	    .andExpects()
	      .property("custom object")
	      .withValue(new Custom);

	  // No need to exercise - all stubs
	  ok( assertObject( wizard["number"], 1, true ), "wizard mock object should have a stubbed property of 'number' with a value of (Number: 1)");
	  ok( assertObject( wizard["boolean"], true, true ), "wizard mock object should have a stubbed property of 'number' with a value of (Boolean: true)");
	  ok( assertObject( wizard["null"], null, true ), "wizard mock object should have a stubbed property of 'null' with a value of (null)");
	  ok( assertObject( wizard["function"], function() {}, true ), "wizard mock object should have a stubbed property of 'function' with a value of (Function: function stubbedFunction () {})");
	  ok( assertObject( wizard["object"], {}, true ), "wizard mock object should have a stubbed property of 'object' with a value of (Object: {})");
	  ok( assertObject( wizard["array"], [], true ), "wizard mock object should have a stubbed property of 'array' with a value of (Array: [])");
	  ok( assertObject( wizard["regExp"], /RegExp/, true ), "wizard mock object should have a stubbed property of 'regExp' with a value of (RegExp: /RegExp/)");
	  ok( assertObject( wizard["date"], new Date(1970), true ), "wizard mock object should have a stubbed property of 'date' with a value of (Date: new Date)");
	  ok( assertObject( wizard["custom object"], new Custom, true ), "wizard mock object should have a stubbed property of 'custom object' with a value of (Custom: new Custom)");

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
	        value: Mock.Variable
	      }
	    });
	    ok(false, "mock should detect bad property name 'expects'");
	  } catch (e) {
	    equals(e.length, 1, "array of 1 exception should be thrown");
	    equals(e[0].type, "InvalidPropertyNameException", "exception type should be InvalidPropertyNameException");
	  }

	  ninja = new Mock({
	    "rank": {
	      value: "apprentice"
	    }
	  });

	  ok( (ninja.rank === "apprentice") , "ninja mock object should have a property called 'rank' with correct value" );

	  ninja = new Mock();

	  ninja = new Mock({
	    "rank"  : {
	      value: "apprentice"
	    },
	    "master": {
	      value: "The Chrome"
	    }
	  });

	  ok( ( (ninja.rank === "apprentice") && (ninja.master === "The Chrome") ) , "ninja mock object should have a two properties set correctly");

	  // Composite - Methods and properties mixed
	  samurai = new Mock({
	    "rank"  : {
	      value: "apprentice"
	    },
	    "master": {
	      value: "The Chrome"
	    },
	    "swing"  : {
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
      "number": {value: 1},
      "boolean": {value: true},
      "string": {value: "string"},
      "null": {value: null},
      "function": {value: function stubbedFunction () {}},
      "object": {value: {}},
      "array": {value: []},
      "regExp": {value: /RegExp/},
      "date": {value: new Date(1970)},
      "custom object": {value: new Custom}
    });

	  // No need to exercise - all stubs
	  ok( assertObject( wizard["number"], 1, true ), "wizard mock object should have a stubbed property of 'number' with a value of (Number: 1)");
	  ok( assertObject( wizard["boolean"], true, true ), "wizard mock object should have a stubbed property of 'number' with a value of (Boolean: true)");
	  ok( assertObject( wizard["null"], null, true ), "wizard mock object should have a stubbed property of 'null' with a value of (null)");
	  ok( assertObject( wizard["function"], function() {}, true ), "wizard mock object should have a stubbed property of 'function' with a value of (Function: function stubbedFunction () {})");
	  ok( assertObject( wizard["object"], {}, true ), "wizard mock object should have a stubbed property of 'object' with a value of (Object: {})");
	  ok( assertObject( wizard["array"], [], true ), "wizard mock object should have a stubbed property of 'array' with a value of (Array: [])");
	  ok( assertObject( wizard["regExp"], /RegExp/, true ), "wizard mock object should have a stubbed property of 'regExp' with a value of (RegExp: /RegExp/)");
	  ok( assertObject( wizard["date"], new Date(1970), true ), "wizard mock object should have a stubbed property of 'date' with a value of (Date: new Date)");
	  ok( assertObject( wizard["custom object"], new Custom, true ), "wizard mock object should have a stubbed property of 'custom object' with a value of (Custom: new Custom)");

	});

	test("w/ API: mock with no parameters, return values", function () {

	  expect(14);

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

  	ok( assertObject( mock.getNumericValue(), 10, true ), "getNumericValue() on mock should return (Number: 10)");
    ok( assertObject( mock.getStringValue(), 'data', true ), "getStringValue() on mock should return (String: data)");
    ok( assertObject( mock.getArrayValue(), [ 1, 2, 3 ], true ), "getArrayValue() on mock should return (Array: [ 1, 2, 3 ])");
    ok( assertObject( mock.getFunctionValue()(), 'function', true ), "getFunctionValue() on mock, when invoked, should return (String: 'function')");
    ok( assertObject( mock.getObjectValue(), { id: 5, value: 'value' }, true ), "getObjectValue() on mock should return (Object: {id: 5, value: 'value'})");
    ok( assertObject( mock.getNullValue(), null, true ), "getNullValue() on mock should return (null)");
    ok( assertObject( mock.getUndefinedValue(), undefined, true ), "getUndefinedValue() on mock should return (undefined)");
    ok( assertObject( mock.getEmptyStringValue(), "", true ), "getEmptyStringValue() on mock should return (String '')");
    ok( assertObject( mock.getZeroValue(), 0, true ), "getZeroValue() on mock should return (Number: 0)");
    ok( assertObject( mock.getTrueValue(), true, true ), "getTrueValue() on mock should return (Boolean: true)");
    ok( assertObject( mock.getFalseValue(), false, true ), "getFalseValue() on mock should return (Boolean: false)");
    ok( assertObject( mock.getEmptyArrayValue(), [], true ), "getEmptyArrayValue() on mock should return (Array: [])");
    ok( assertObject( mock.getEmptyObjectValue(), {}, true ), "getEmptyObjectValue() on mock should return (Object: {})");
    ok(mock.verify(), "verify() should be true");

	});

	test("w/ JSON: mock with no parameters, return values", function () {

	  expect(14);

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

  	ok( assertObject( mock.getNumericValue(), 10, true ), "getNumericValue() on mock should return (Number: 10)");
    ok( assertObject( mock.getStringValue(), 'data', true ), "getStringValue() on mock should return (String: data)");
    ok( assertObject( mock.getArrayValue(), [ 1, 2, 3 ], true ), "getArrayValue() on mock should return (Array: [ 1, 2, 3 ])");
    ok( assertObject( mock.getFunctionValue()(), 'function', true ), "getFunctionValue() on mock, when invoked, should return (String: 'function')");
    ok( assertObject( mock.getObjectValue(), { id: 5, value: 'value' }, true ), "getObjectValue() on mock should return (Object: {id: 5, value: 'value'})");
    ok( assertObject( mock.getNullValue(), null, true ), "getNullValue() on mock should return (null)");
    ok( assertObject( mock.getUndefinedValue(), undefined, true ), "getUndefinedValue() on mock should return (undefined)");
    ok( assertObject( mock.getEmptyStringValue(), "", true ), "getEmptyStringValue() on mock should return (String '')");
    ok( assertObject( mock.getZeroValue(), 0, true ), "getZeroValue() on mock should return (Number: 0)");
    ok( assertObject( mock.getTrueValue(), true, true ), "getTrueValue() on mock should return (Boolean: true)");
    ok( assertObject( mock.getFalseValue(), false, true ), "getFalseValue() on mock should return (Boolean: false)");
    ok( assertObject( mock.getEmptyArrayValue(), [], true ), "getEmptyArrayValue() on mock should return (Array: [])");
    ok( assertObject( mock.getEmptyObjectValue(), {}, true ), "getEmptyObjectValue() on mock should return (Object: {})");
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
	    equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String)");
	  }

	  ninja.reset();

	  ninja.swing(Boolean);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Boolean)");
	  }

	  ninja.reset();

	  ninja.swing(Array);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Array)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Array)");
	  }

	  ninja.reset();

	  ninja.swing(Object);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Object)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Object)");
	  }

	  ninja.reset();

	  ninja.swing(Function);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Function)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Function)");
	  }

	  ninja.reset();

	  ninja.swing(RegExp);

	  try {
	    ninja.verify();
      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	  } catch (exception) {
      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (RegExp)");
	  }

	  ninja.reset();

	  // Test invalid argument type - values

	  ninja.swing("string");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: string)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String: string)");
	  }

	  ninja.reset();

	  ninja.swing(false);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: false)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Boolean: false)");
	  }

	  ninja.reset();

	  ninja.swing([]);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Array: [])");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Array: [])");
	  }

	  ninja.reset();

	  ninja.swing({});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Object: {})");
	  }

	  ninja.reset();

	  ninja.swing(function(){});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Function: function(){})");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Function: function(){})");
	  }

	  ninja.reset();

	  ninja.swing(/test/);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (RegExp: /test/)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (RegExp: /test/)");
	  }

	  ninja.reset();

	  // Test false positive

	  ninja.swing("1");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 1)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String: 1)");
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
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String)");
	  }

	  ninja.reset();

	  ninja.swing(Boolean);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Boolean)");
	  }

	  ninja.reset();

	  ninja.swing(Array);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Array)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Array)");
	  }

	  ninja.reset();

	  ninja.swing(Object);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Object)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Object)");
	  }

	  ninja.reset();

	  ninja.swing(Function);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Function)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Function)");
	  }

	  ninja.reset();

	  ninja.swing(RegExp);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (RegExp)");
	  }

	  ninja.reset();

	  // Test invalid argument type - values

	  ninja.swing("string");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: string)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String: string)");
	  }

	  ninja.reset();

	  ninja.swing(false);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: false)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Boolean: false)");
	  }

	  ninja.reset();

	  ninja.swing([]);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Array: [])");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Array: [])");
	  }

	  ninja.reset();

	  ninja.swing({});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Object: {})");
	  }

	  ninja.reset();

	  ninja.swing(function(){});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Function: function(){})");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Function: function(){})");
	  }

	  ninja.reset();

	  ninja.swing(/test/);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (RegExp: /test/)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (RegExp: /test/)");
	  }

	  ninja.reset();

	  // Test false positive

	  ninja.swing("1");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 1)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String: 1)");
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
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String)");
	  }

	  ninja.reset();

	  ninja.swing(Boolean);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Boolean)");
	  }

	  ninja.reset();

	  ninja.swing(Array);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Array)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Array)");
	  }

	  ninja.reset();

	  ninja.swing(Object);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Object)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Object)");
	  }

	  ninja.reset();

	  ninja.swing(Function);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Function)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Function)");
	  }

	  ninja.reset();

	  ninja.swing(RegExp);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (RegExp)");
	  }

	  ninja.reset();

	  // Test invalid argument type - values

	  ninja.swing("string");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: string)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String: string)");
	  }

	  ninja.reset();

	  ninja.swing(false);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: false)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Boolean: false)");
	  }

	  ninja.reset();

	  ninja.swing([]);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Array: [])");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Array: [])");
	  }

	  ninja.reset();

	  ninja.swing({});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Object: {})");
	  }

	  ninja.reset();

	  ninja.swing(function(){});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Function: function(){})");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Function: function(){})");
	  }

	  ninja.reset();

	  ninja.swing(/test/);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (RegExp: /test/)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (RegExp: /test/)");
	  }

	  ninja.reset();

	  // Test false positive

	  ninja.swing("1");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 1)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String: 1)");
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
	      ok(false, "verify() should throw exception when swing() interface passed no parameters");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed no parameters");
	      equals(exception[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException for NO parameters");
	  }

	  ninja.reset();

	  // Test invalid argument type - Constructors

	  ninja.swing(String);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (String)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (String)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String)");
	  }

	  ninja.reset();

	  ninja.swing(Boolean);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Boolean)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Boolean)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Boolean)");
	  }

	  ninja.reset();

	  ninja.swing(Array);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Array)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Array)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Array)");
	  }

	  ninja.reset();

	  ninja.swing(Object);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Object)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Object)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Object)");
	  }

	  ninja.reset();

	  ninja.swing(Function);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (Function)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (Function)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Function)");
	  }

	  ninja.reset();

	  ninja.swing(RegExp);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type [constructor obj: (RegExp)]");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type [constructor obj: (RegExp)]");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (RegExp)");
	  }

	  ninja.reset();

	  // Test invalid argument type - values

	  ninja.swing("string");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: string)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: string)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String: string)");
	  }

	  ninja.reset();

	  ninja.swing(false);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Boolean: false)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Boolean: false)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Boolean: false)");
	  }

	  ninja.reset();

	  ninja.swing([]);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Array: [])");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Array: [])");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Array: [])");
	  }

	  ninja.reset();

	  ninja.swing({});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Object: {})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Object: {})");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Object: {})");
	  }

	  ninja.reset();

	  ninja.swing(function(){});

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (Function: function(){})");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (Function: function(){})");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (Function: function(){})");
	  }

	  ninja.reset();

	  ninja.swing(/test/);

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (RegExp: /test/)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (RegExp: /test/)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (RegExp: /test/)");
	  }

	  ninja.reset();

	  // Test false positive

	  ninja.swing("1");

	  try {
	    ninja.verify();
	      ok(false, "verify() should throw exception when swing() interface passed incorrect parameter type (String: 1)");
	  } catch (exception) {
	      equals(exception.length, 1, "verify() should return 1 exception when swing() passed incorrect parameter type (String: 1)");
	      equals(exception[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException for (String: 1)");
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
       ok(false, "verify() should throw exception when run called with incorrect argument type");
     } catch (e) {
       equals(e.length, 1, "verify() should return an array of 1 exceptions");
       equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
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
       ok(false, "verify() should throw exception when run called with incorrect argument type");
     } catch (e) {
       equals(e.length, 1, "verify() should return an array of 1 exceptions");
       equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
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
      ok(false, "verify() should throw exception when swing called with incorrect argument type");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exceptions");
      equals(e[0].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
    }

	  ninja.reset();

	  // Test invalid argument value

	  ninja.swing(2);
	  try {
       ninja.verify();
       ok(false, "verify() should throw exception when swing called with incorrect argument value");
    } catch (e) {
       equals(e.length, 1, "verify() should return an array of 1 exceptions");
       equals(e[0].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
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
       ok(false, "verify() should throw exception when swing called with incorrect argument type");
    } catch (e) {
       equals(e.length, 1, "verify() should return an array of 1 exceptions");
       equals(e[0].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
    }

	  samurai.reset();

	  // Test invalid argument value

	  samurai.run("slow")

	  try {
	         samurai.verify();
	         ok(false, "verify() should throw exception when swing called with incorrect argument type");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
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
	         ok(false, "verify() should throw exception when swing called with incorrect argument type");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
	     }

	  wizard.reset();

	  // Test invalid argument value

	  wizard.fireball(false)

	  try {
	         wizard.verify();
	         ok(false, "verify() should throw exception when swing called with incorrect argument type");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
	     }

	  wizard.reset();

	  // Good Exercise

	  wizard.fireball(true);

	  ok( wizard.verify(), "verify() should pass after fireball was called once with boolean primitive type" );

	  // Test multiple parameter value expectations, no return value
	  var jedi = new Mock({
	    "setForceLevel" : {
	      calls: 1,
	      interface: [
					{accepts: [3]}, // 1st presentation to interface
					{accepts: [9]} // 2nd presentation to interface
	      ],
	      required: 1
	    }
	  });

	  // Bad Exercises

	  // Test no argument type

	  jedi.setForceLevel();

	  try {
			jedi.verify();
		  ok(false, "verify() should throw exception when 'setForceLevel' called with no arguments");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions");
		  equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
		}

	  jedi.reset();

	  // Test invalid argument types

	  jedi.setForceLevel("one");
	  try {
	     jedi.verify();
	     ok(false, "verify() should throw exception when 'setForceLevel' called with incorrect argument type");
	  } catch (e) {
	     equals(e.length, 2, "verify() should return an array of 2 exceptions correlating with two interface expectations");
	     equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
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
	         ok(false, "verify() should throw exception when 'giveUp' called with incorrect argument type: String");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	     }

	  ninja.reset();

	  // Test potential false positive - undefined

	  ninja.giveUp(undefined);
	  try {
	         ninja.verify();
	         ok(false, "verify() should throw exception when 'givep' called with incorrect argument type: undefined");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	     }

	  ninja.reset();

	  // Test potential false positive - falsy 0

	  ninja.giveUp(undefined);
	  try {
	         ninja.verify();
	         ok(false, "verify() should throw exception when swing called with incorrect argument type: 0");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	     }

	  ninja.reset();

	  // Test potential false positive - falsy ""

	  ninja.giveUp(undefined);
	  try {
	         ninja.verify();
	         ok(false, "verify() should throw exception when 'giveUp' called with incorrect argument type: ''");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	     }

	  ninja.reset();

	  // Test potential false positive - false

	  ninja.giveUp(false);
	  try {
	         ninja.verify();
	         ok(false, "verify() should throw exception when 'giveUp' called with incorrect argument type: false");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
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
	         ok(false, "verify() should throw exception when 'fear' called with incorrect argument type: String");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	     }

	  samurai.reset();

	  // Test potential false positive - null

	  samurai.fear(null);

	  try {
	         samurai.verify();
	         ok(false, "verify() should throw exception when 'fear' called with incorrect argument type: null");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	     }

	  samurai.reset();

	  // Test potential false positive - false

	  samurai.fear(false);

	  try {
	         samurai.verify();
	         ok(false, "verify() should throw exception when 'fear' called with incorrect argument type: String");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
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
	         ok(false, "verify() should throw exception when 'teleport' called with incorrect argument type: String");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	     }

	  wizard.reset();

	  // Test potential false positive - null

	  wizard.teleport(null);

	  try {
	         wizard.verify();
	         ok(false, "verify() should throw exception when 'teleport' called with incorrect argument type: null");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	     }

	  wizard.reset();

	  // Test potential false positive - false

	  wizard.teleport(undefined);

	  try {
	         wizard.verify();
	         ok(false, "verify() should throw exception when 'teleport' called with incorrect argument type: undefined");
	     } catch (e) {
	         equals(e.length, 1, "verify() should return an array of 1 exceptions");
	         equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
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
	    })

	  // Bad Exercise

	  // Test no arguments

    try {
      ninja.verify();
      ok(false, "verify() should throw 'IncorrectNumberOfMethodCallsException' exception when method describe() not invoked");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException when method describe() not invoked");
    }

	  ninja.reset();
	  // Test incomplete arguments
	  ninja.describe('Jet Li');
    try {
      ninja.verify();
      ok(false, "verify() should throw exception when passed a parameter of type (String), and not (Object)");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentsException");
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

	  expect(21);

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
      ok(false, "verify() should throw exception");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
    }

	  ninja.reset();

	  // Test wrong type arguments

	  ninja.describe('Jet Li'); // primitive data type will be flagged

    try {
      ninja.verify();
      ok(false, "verify() should throw exception");
    } catch (e) {
      equals(e.length, 2 , "verify() should return an array of 2 exception");
      equals(e[0].type, "MalformedArgumentsException", "verify()[0] exception type should be MalformedArgumentsException");
      equals(e[1].type, "IncorrectArgumentValueException", "verify()[3] exception type should be IncorrectArgumentValueException");
    }

    ninja.reset()

    ninja.describe({});

    try {
      ninja.verify();
      ok(false, "verify() should throw exception");
    } catch (e) {
      equals(e.length, 4 , "verify() should return an array of 4 exception");
      equals(e[0].type, "MissingHashKeyException", "verify()[0] exception type should be MissingHashKeyException");
      equals(e[1].type, "MissingHashKeyException", "verify()[1] exception type should be MissingHashKeyException");
      equals(e[2].type, "MissingHashKeyException", "verify()[1] exception type should be MissingHashKeyException");
      equals(e[3].type, "IncorrectArgumentValueException", "verify()[3] exception type should be IncorrectArgumentValueException");
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
      ok(false, "verify() should throw exception");
    } catch (e) {
      equals(e.length, 4 , "verify() should return an array of 4 exceptions");
      equals(e[0].type, "IncorrectArgumentValueException", "verify()[0] exception type should be IncorrectArgumentValueException");
      equals(e[1].type, "IncorrectArgumentValueException", "verify()[1] exception type should be IncorrectArgumentValueException");
      equals(e[2].type, "IncorrectArgumentValueException", "verify()[2] exception type should be IncorrectArgumentValueException");
      equals(e[3].type, "IncorrectArgumentValueException", "verify()[3] exception type should be IncorrectArgumentValueException");
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

	  // Test correct argument types - wrong values - assertion recurse through whole object tree

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
      ok(false, "verify() should throw exception");
    } catch (e) {
      equals(e.length, 2 , "verify() should return an array of 1 exceptions");
      equals(e[0].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
      equals(e[1].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
    }

	  samurai.reset();

	  // Test correct argument types - pass-thru values

	  /*samurai.describe({
	    name: "Jet Li",
	    age: Number,
	    'marshal arts': Array,
	    weapon: {
	      damage: String,
	      type: 'sword'
	    }
	  });

	  samurai.getDamage();

    debugger;
    samurai.verify();
	  ok(samurai.verify(), "verify() should be true with constructors as expected");*/

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

	test("mock with composite argument types: array - default type check", function () {

	  expect(5);

	    var ninja = Mock();

	    ninja
	    .expects(1)
	      .method('setSkills')
	        .accepts(['swordplay', 'kung-fu', 'stealth']);

	  // No arg
    try {
      ninja.verify();
      ok(false, "verify() should throw exception");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 2 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
    }

	  ninja.reset();

	  // Invalid arg
	  ninja.setSkills('swordplay', 1, true);
    try {
      ninja.verify();
      ok(false, "verify() should throw exception");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exception");
      equals(e[0].type, "IncorrectArgumentTypeException", "verify()[0] exception type should be IncorrectArgumentsException");
    }

	  ninja.reset();

	  // Correct Usage

	  ninja.setSkills(['accepts', 'any', 'string']);
	  ok(ninja.verify(), "verify() should be true");

	});

	test("w/ API: mock with composite argument types: array - strict value check", function () {

	  expect(5);

	    var ninja = Mock();

	    ninja
	    .expects(1)
	      .method('setSkills')
	        .accepts(['swordplay', 'kung-fu', 'stealth'])
	        .strict();

	  // No arg
    try {
      ninja.verify();
      ok(false, "verify() should throw exception");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 2 exception");
      equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
    }

	  ninja.reset();

	  // Invalid arg
	  ninja.setSkills(['swordplay', 1, true]);
    try {
      ninja.verify();
      ok(false, "verify() should throw exception");
    } catch (e) {
      equals(e.length, 1 , "verify() should return an array of 1 exceptions");
      equals(e[0].type, "IncorrectArgumentValueException", "verify()[0] exception type should be IncorrectArgumentValueException");
    }

	  ninja.reset();

	  // Correct Usage

	  ninja.setSkills(['swordplay', 'kung-fu', 'stealth']);
	  ok(ninja.verify(), "verify() should be true");

	});

	test("mock with composite argument types: Date & RegExp", function () {

	  expect(4)

	  var ninja = new Mock();

	  ninja
	    .expects(1)
	      .method("chooseTarget")
	      .accepts("Jet Li, Bruce Lee, Chuck Norris", /Bruce Lee/)
	      .strict(true);
	  ninja.chooseTarget("Jet Li, Bruce Lee, Chuck Norris", /Bruce Lee/);

	  ok(ninja.verify(), "verify() should be true");

	  var samurai = new Mock();

	  var date = new Date;

	  samurai
	    .expects(1)
	      .method("timeOfFight")
	      .accepts(date)
	      .strict(true);

	    samurai.timeOfFight(new Date(1970));

	  try {
	        samurai.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 1 , "verify() should return an array of 1 exception");
	        equals(e[0].type, "IncorrectArgumentValueException", "verify()[0] exception type should be IncorrectArgumentValueException");
	    }

	  samurai.reset();

	  samurai.timeOfFight(date);

	  ok(samurai.verify(), "verify() should be true");

	});

	test("mock with custom object argument types", function () {

	  var Sword = function Sword() {},
	    Shield = function Shield() {},
	    katana = new Sword,
	    wooden = new Shield;

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
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exception");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	    }

	    ninja.reset();

	  // Try with null types
	  ninja.setSword(null);
	  try {
	        ninja.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exception");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	    }

	    ninja.reset();

	  ninja.setSword(undefined);

	  try {
	        ninja.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exception");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	    }

	    ninja.reset();

	  ninja.setSword(katana);

	  ok(ninja.verify(), "verify() should be true");

	});


	test("mock with pass-through argument types: Selector & Variable", function () {

	  expect(15);

	  var ninja = new Mock();

	  // Allow pass-through argument types (and implicitly values)

	  var ninja = new Mock();

	  ninja
	    .expects(1)
	      .method("hitOpponents")
	      .accepts(Mock.Variable);

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

	  ninja.hitOpponents(new Date);

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

	  ninja.hitOpponents(Mock.Variable);

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

	  var ninja = new Mock();

	  ninja
	    .expects(1)
	      .method("testMultipleParameters")
	      .accepts(1, "string", true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom )
	      .required(11)
	      .overload(false);
	       // Could use same logic for RANGES on call method?

	  // Bad Exercise

	  // Test no arguments

	  ninja.testMultipleParameters();
	  try {
	        ninja.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	    }

	  ninja.reset();

	  // Test too few arguments - method underloading

	  ninja.testMultipleParameters("string", 1, true, null, undefined, {} );
	  try {
	        ninja.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	    }

	  ninja.reset();

	  // Test too many arguments - method overloading

	  ninja.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom, "string" );
	  try {
	        ninja.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	    }

	  ninja.reset();

	  // Test incorrect arguments - first two switched

	  ninja.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom );
	  try {
	        ninja.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 2, "verify() should return an array of 2 exceptions");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	        equals(e[1].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	   }

	  ninja.reset();

	  // Good Exercise

	  ninja.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom );
	  ok(ninja.verify(), "verify() should be true");

	});

	test("w/ JSON: mock with multiple parameters - required total arguments", function () {

	  expect(7);

	  var ninja = new Mock();

	  var ninja = new Mock({
	    "testMultipleParameters": {
	      accepts: [1, "string", true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom],
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
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	    }

	  ninja.reset();

	  // Test too few arguments - method underloading

	  ninja.testMultipleParameters("string", 1, true, null, undefined, {} );
	  try {
	        ninja.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	    }

	  ninja.reset();

	  // Test too many arguments - method overloading

	  ninja.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom, "string" );
	  try {
	        ninja.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	    }

	  ninja.reset();

	  // Test incorrect arguments - first two switched

	  ninja.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom );
	  try {
	        ninja.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 2, "verify() should return an array of 2 exceptions");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	        equals(e[1].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	   }

	  ninja.reset();

	  // Good Exercise

	  ninja.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom );
	  ok(ninja.verify(), "verify() should be true");

	});


	test("mock with multiple parameters - all optional arguments", function () {

	  expect(15);

    var samurai = new Mock();

	  samurai
	    .expects(1)
	      .method("testMultipleParameters")
	      .accepts(1, "string", true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom )
	      .required(0); // Overwrite implict required of 11 (fn.length).

	  // Bad Exercises

	  // Single incorrect argument
	  samurai.testMultipleParameters("string");
		try {
			samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exceptions");
			equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
		}
	  samurai.reset();

	  // Some arguments - first two switched around to be incorrect

	  samurai.testMultipleParameters("string", 1, true, null, undefined, {});
		try {
		  samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 2, "verify() should return an array of 2 exceptions");
		  equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
		  equals(e[1].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
		}

	  samurai.reset();

	  // All arguments - last two switched around to be incorrect

	  samurai.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom )
		try {
		  samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 2, "verify() should return an array of 2 exceptions");
		  equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
		  equals(e[1].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
		}

	  samurai.reset();

	  // Too many arguments - method overloading - first two switched to be incorrect - overloaded arguments should be ignored

	  samurai.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom, null );
		try {
		  samurai.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 2, "verify() should return an array of 2 exceptions");
		  equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
		  equals(e[1].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
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

	  samurai.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom );
	  ok(samurai.verify(), "verify() should be true");

	  samurai.reset();

	  // Overloaded method call
	  samurai.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom, null );
	  ok(samurai.verify(), "verify() should be true");

	});

	test("w/ JSON: mock with multiple parameters - all optional arguments", function () {

	  expect(15);

	  var samurai = new Mock({
	    "testMultipleParameters": {
	      accepts: [1, "string", true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom],
	      calls: 1,
	      required: 0
	    }
	  });

	  // Bad Exercises

	  // Single incorrect argument

	  samurai.testMultipleParameters("string");
	  try {
	        samurai.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exceptions");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	   }

	  samurai.reset();

	  // Some arguments - first two switched around to be incorrect

	  samurai.testMultipleParameters("string", 1, true, null, undefined, {});
	  try {
	        samurai.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 2, "verify() should return an array of 2 exceptions");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	        equals(e[1].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	   }

	  samurai.reset();

	  // All arguments - last two switched around to be incorrect

	  samurai.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom )
	  try {
	        samurai.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 2, "verify() should return an array of 2 exceptions");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	        equals(e[1].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	   }

	  samurai.reset();

	  // Too many arguments - method overloading - first two switched to be incorrect - overloaded arguments should be ignored

	  samurai.testMultipleParameters("string", 1, true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom, null );
	  try {
	        samurai.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 2, "verify() should return an array of 2 exceptions");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	        equals(e[1].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
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

	  samurai.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom );
	  ok(samurai.verify(), "verify() should be true");

	  samurai.reset();

	  // Overloaded method call
	  samurai.testMultipleParameters(1, "string", true, null, undefined, {}, [], new Date, /RegExp/, Selector, new Custom, null );
	  ok(samurai.verify(), "verify() should be true");

	});

	test("mock with single / multiple parameters and matched return values", function () {

	  expect(14);

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
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exceptions");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
	   }

	  ninja.reset();

	  // No argument type - should just return 'global' / default undefined

	  equals( ninja.swing() , undefined, "ninja.swing() should return 'undefined' when called without parameters");
	  try {
	        ninja.verify();
	        ok(false, "verify() should throw exception when called without parameters");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exceptions when called without parameters");
	        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
	   }

	  // Good Exercises

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
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exception: test invalid parameter type");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
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
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exception");
	        equals(e[0].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
	    }

	  $.reset();

	  // Test valid parameter type and value, but invalid argument type to method

	    $("#id").html(true);

	    try {
	        $.verify();
	        ok(false, "verify() should throw exception");
	    } catch (e) {
	        equals(e.length, 1, "verify() should return an array of 1 exception");
	        equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentValueException");
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

	  expect(13);
	    var $ = new Mock();
	    $.accepts(".ninja")
	        .expects(2)
	      .method('run')
	            .accepts(Mock.Variable)
	            .andChain()
	        .expects(1)
	      .method('fight')
	            .accepts('hard')
	            .andChain();

		// Invalid constructor param

    $(1);
		try {
		  $.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 3, "verify() should return an array of 3 exceptions");
		  equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
		  equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
		  equals(e[2].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
		}

    $.reset();

    // No constructor param

    $().run('slow').fight('hard').run('again');
		try {
		  $.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exception");
		  equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
		}

    $.reset();

    // Missed call to fight

    $(".ninja").run('at a canter');

		try {
		  $.verify();
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 2, "verify() should return an array of 2 exception");
		  equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
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
		  ok(false, "verify() should throw exception");
		} catch (e) {
		  equals(e.length, 1 /* should be 2*/, "verify() should return an array of 2 exception");
		  equals(e[0].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
		  // equals(e[1].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
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
			ok(false, "verify() should throw exception");
		} catch (e) {
			equals(e.length, 1, "verify() should return an array of 1 exception");
			equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
		}

		$.reset();

		// Correct Usage

		var called = false;

		$.get('some/url', function (data) { called = true });

	  equals(called, true, "called should be set to true");

	});

	test("QMock version 0.1 Constructor and mockedMember object API backward compatibility", function () {

	  expect(3);

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

	  // Setup - Test support for withArguments method on mocked methods

  	  var mock = new Mock ();
  	  mock
  	    .expects(1)
  	      .method("swing")
  	      .andReturns(true);

  	  // Good exercise & verify
		  equals(mock.swing(), true, "mock.swing() should return true when setting up return value with 'andReturns' (API v 0.1)");

	});

})(); // Go Go Inspector Gadget!