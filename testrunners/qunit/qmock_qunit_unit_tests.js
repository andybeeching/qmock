(function scopeQMockTests () {

  // Closure scoped aliases to internal qMock functions
  var undefined;

	// Stub to test support for user-defined objects
	function Custom () {};

	function Named () {}


	// Stub for CSS selector parameter expectation (e.g. mock jQuery)
	var Selector = Mock.Variable;

	/**
	 *
	 * Assay Unit tests
	 *
	 */

	module("Assay lib // Bootstrap", {

	  setup: function () {
	    this.expectedAssayInterface = {
        "version": String,
        "collection": Function,
        "object": Function,
        "hash": Function,
        "type": Function,
        "Variable": Function,
        "Utils" : {
          "expose": Function,
          "getFunctionName": Function,
          "isHash": Function,
          "isNativeType": Function
        }
      };
	  },

	  teardown: function () {
	    delete this.expectedAssayInterface;
	  }

	});

	test("Setup & teardown", function () {

	  expect( 2 );
	  var container = {};

	  // Exercise inititaliser as common use case
    container[ "Assay" ] = initAssay();
    // Test interface
    equals( Assay.hash( this.expectedAssayInterface, container[ "Assay" ], {typed: true} ), true, "initAssay() should return an Assay instance interface registered with the identifier 'Assay' on container" );

    // Unload Assay from container
    delete container[ "Assay" ];
    // Test successful removal
    ok( Assay.object( undefined, container.Assay ), "Assay should be unloaded, and the associated identifier 'Assay' should not exist on container" );

	});

	module("Assay lib // Interface unit test");

	test("Assay.Utils.expose() method - test parameter requirements", function () {

	  expect( 1 );

    // Test no arguments
	  try {
			Assay.Utils.expose();
	    ok(false, "Assay.exposeObject() should throw exception when passed No parameters");
	  } catch (exception) {
	    equals(exception.type, "MissingParametersException", "Assay.exposeObject() exception type should be MissingParametersException for less than three parameters (required). Result");
	  }

	});

	test("Assay.Utils.expose() method - exercises", function () {

	  expect( 12 );

    var container = {},
        privateObj = "foo";

	  // Test three required params with filter (6 permutations)
	  Assay.Utils.expose( privateObj, "_test", container, {get: true} );
	  ok( Assay.hash( {"get": Function}, container[ "_test" ] ), "exposeObject() should expose get() accessor for privateObj on container" );
	  ok( Assay.object( undefined, container[ "_test" ].set ), "exposeObject() should not expose set() mutator for privateObj on container" );
	  ok( Assay.object( undefined, container[ "_test" ].restore ), "exposeObject() should not expose restore() mutator for privateObj on container" );

    // etc...
	  Assay.Utils.expose( privateObj, "_test", container, {set: true} );
	  ok( Assay.hash( {"set": Function}, container[ "_test" ] ), "exposeObject() should expose only set() mutator for privateObj on container" );

	  Assay.Utils.expose( privateObj, "_test", container, {restore: true} );
	  ok( Assay.hash( {"restore": Function}, container[ "_test" ] ), "exposeObject() should expose only restore() mutator for privateObj on container" );

	  Assay.Utils.expose( privateObj, "_test", container, {get: true, set: true} );
	  ok( Assay.hash( {"get": Function, "set": Function}, container[ "_test" ] ), "exposeObject() should expose get() and set() accessors and mutators for privateObj on container" );

	  Assay.Utils.expose( privateObj, "_test", container, {set: true, restore: true} );
	  ok( Assay.hash( {"set": Function, "restore": Function}, container[ "_test" ] ), "exposeObject() should expose set() and restore() mutators for privateObj on container" );

	  Assay.Utils.expose( privateObj, "_test", container, {get: true, restore: true} );
	  ok( Assay.hash( {"get": Function, "restore": Function}, container[ "_test" ] ), "exposeObject() should expose get() and restore() accessors and mutators for privateObj on container" );

	  // Exercise with all options [default]
	  Assay.Utils.expose( privateObj, "_test", container );
	  ok( Assay.hash( {"get": Function, "set": Function, "restore": Function}, container[ "_test" ] ), "exposeObject() should expose accessors and mutators for privateObj on container" );
    equals("foo", container._test.get(), "container._test.get() should return 'foo'. Result");

		// Mutate value of privateObj
		container._test.set("bar");
    equals("bar", container._test.get(), "container._test.get() should return 'bar'. Result");

    // Restore value of privateObj
		container._test.restore();
    equals("foo", container._test.get(), "container._test.get() should return 'foo'. Result");

	});

	test("Assay.Utils.isHash() - exercises", function () {

	  var isHash = Assay.Utils.isHash;

	  // Expected False Evaluations

	  // Test falsy types and primitive data types

	  equals( isHash( null ), false, "isHash() should be false with 'obj' parameter: (null). Result");
	  equals( isHash( undefined ), false, "isHash() should be false with 'obj' parameter: (undefined). Result");
	  equals( isHash( NaN ), false, "isHash() should be false with 'obj' parameter: (NaN). Result");
	  equals( isHash( 0 ), false, "isHash() should be false with 'obj' parameter: (Number: 0). Result");
	  equals( isHash( 1 ), false, "isHash() should be false with 'obj' parameter: (Number: 1). Result");
	  equals( isHash( "" ), false, "isHash() should be false with 'obj' parameter: (String: ''). Result");
	  equals( isHash( "string primitive type" ), false, "isHash() should be false with 'obj' parameter: (String: 'string primitive type'). Result");
	  equals( isHash( false ), false, "isHash() should be false with 'obj' parameter: (Boolean: false). Result");
	  equals( isHash( true ), false, "isHash() should be false with 'obj' parameter: (Boolean: true). Result");

	  // Expected True Evalutions

	  // Test native & custom constructors / objects

	  equals( isHash( Number ), true, "isHash() should be true with 'obj' parameter: (Number: Constructor). Result");
	  equals( isHash( String ), true, "isHash() should be true with 'obj' parameter: (String: Constructor). Result");
	  equals( isHash( Boolean ), true, "isHash() should be true with 'obj' parameter: (Boolean: Constructor). Result");
	  equals( isHash( RegExp ), true, "isHash() should be true with 'obj' parameter: (RegExp: Constructor). Result");
	  equals( isHash( Date ), true, "isHash() should be true with 'obj' parameter: (Date: Constructor). Result");
	  equals( isHash( Function ), true, "isHash() should be true with 'obj' parameter: (Function: Constructor). Result");
	  equals( isHash( Math ), true, "isHash() should be true with 'obj' parameter: (Math). Result");
	  equals( isHash( Array ), true, "isHash() should be true with 'obj' parameter: (Array: Constructor). Result");
	  equals( isHash( Object ), true, "isHash() should be true with 'obj' parameter: (Object: Constructor). Result");
	  equals( isHash( Custom ), true, "isHash() should be true with 'obj' parameter: (Custom: Constructor). Result");
	  equals( isHash( Error ), true, "isHash() should be true with 'obj' parameter: (Error: Constructor). Result");

	  // Test composite data types

	  equals( isHash( Object(0) ), true, "isHash() should be true with 'obj' parameter: (Number: Object(0)). Result");
	  equals( isHash( Object(1) ), true, "isHash() should be true with 'obj' parameter: (Number: Object(1)). Result");
	  equals( isHash( Object("") ), true, "isHash() should be true with 'obj' parameter: (String: Object('')). Result");
	  equals( isHash( Object('string composite type') ), true, "isHash() should be true with 'obj' parameter: (String: Object('string compositive type')). Result");
	  equals( isHash( Object(false) ), true, "isHash() should be true with 'obj' parameter: (Boolean: false). Result");
	  equals( isHash( Object(true) ), true, "isHash() should be true with 'obj' parameter: (Boolean: true). Result");
	  equals( isHash( /foo/ ), true, "isHash() should be true with 'obj' parameter: (RegExp: /foo/). Result");
	  equals( isHash( function() {} ), true, "isHash() should be true with 'obj' parameter: (Function: function(){}). Result");
	  equals( isHash( {} ), true, "isHash() should be true with 'obj' parameter: (Object: {}). Result");
	  equals( isHash( [] ), true, "isHash() should be true with 'obj' parameter: (Array: []). Result");
	  equals( isHash( new Date ), true, "isHash() should be true with 'obj' parameter: (Date: new Date). Result");
	  equals( isHash( new Custom ), true, "isHash() should be true with 'obj' parameter: (Custom: new Custom). Result");

	});

	/*test("Assay.Utils.isNativeType() - exercises", function () {

	  var isNativeType = Assay.Utils.isNativeType;

    function augmentNative ( obj ) {
      obj.prototype[ "foo" ] = "bar";
      return obj;
    }

    function cleanNatives () {
      for (
        var i = 0,
            types = [Number, String, Boolean, RegExp, Date, Function, Array, Object, Error],
            len = types.length;
          i < len;
          i++ ) {
        delete types[ i ][ "prototype" ][ "foo" ];
      }
    }

    expect( 44 );

	  // Expected False Evaluations

	  // Test falsy types and primitive data types

	  equals( isNativeType( NaN ), false, "isNativeType() should be false with 'obj' parameter: (NaN). Result");
	  equals( isNativeType( Infinity ), false, "isNativeType() should be false with 'obj' parameter: (NaN). Result");
	  equals( isNativeType( 0 ), false, "isNativeType() should be false with 'obj' parameter: (Number: 0). Result");
	  equals( isNativeType( 1 ), false, "isNativeType() should be false with 'obj' parameter: (Number: 1). Result");
	  equals( isNativeType( "" ), false, "isNativeType() should be false with 'obj' parameter: (String: ''). Result");
	  equals( isNativeType( "string primitive type" ), false, "isNativeType() should be false with 'obj' parameter: (String: 'string primitive type'). Result");
	  equals( isNativeType( false ), false, "isNativeType() should be false with 'obj' parameter: (Boolean: false). Result");
	  equals( isNativeType( true ), false, "isNativeType() should be false with 'obj' parameter: (Boolean: true). Result");

	  // Test composite data types
	  equals( isNativeType( Object(0) ), false, "isNativeType() should be false with 'obj' parameter: (Number: Object(0)). Result");
	  equals( isNativeType( Object(1) ), false, "isNativeType() should be false with 'obj' parameter: (Number: Object(1)). Result");
	  equals( isNativeType( Object("") ), false, "isNativeType() should be false with 'obj' parameter: (String: Object('')). Result");
	  equals( isNativeType( Object('string composite type') ), false, "isNativeType() should be false with 'obj' parameter: (String: Object('string compositive type')). Result");
	  equals( isNativeType( Object(false) ), false, "isNativeType() should be false with 'obj' parameter: (Boolean: false). Result");
	  equals( isNativeType( Object(true) ), false, "isNativeType() should be false with 'obj' parameter: (Boolean: true). Result");
	  equals( isNativeType( /foo/ ), false, "isNativeType() should be false with 'obj' parameter: (RegExp: /foo/). Result");
	  // debugger;
	  equals( isNativeType( Named), false, "isNativeType() should be false with 'obj' parameter: (Function: function(){}). Result");
	  equals( isNativeType( {} ), false, "isNativeType() should be false with 'obj' parameter: (Object: {}). Result");
	  equals( isNativeType( [] ), false, "isNativeType() should be false with 'obj' parameter: (Array: []). Result");
	  equals( isNativeType( new Date ), false, "isNativeType() should be false with 'obj' parameter: (Date: new Date). Result");
	  equals( isNativeType( new Custom ), false, "isNativeType() should be false with 'obj' parameter: (Custom: new Custom). Result");

	  // Native / Host Objects
	  // Math is not a Type but a native object
	  equals( isNativeType( Math ), false, "isNativeType() should be false with 'obj' parameter: (Math). Result");
	  // need check for DOM / BOM before executing these (mainly for ssjs)
	  equals( isNativeType( document ), false, "isNativeType() should be false with 'obj' parameter: (HostObject: document). Result");

	  // Custom Objects
	  // debugger;
	  equals( isNativeType( Custom ), false, "isNativeType() should be false with 'obj' parameter: (Custom). Result");
	  equals( isNativeType( focus ), false, "isNativeType() should be false with 'obj' parameter: (Event: focus). Result");

	  // Expected True Evalutions

	  // Test native objects
    equals( isNativeType( null ), true, "isNativeType() should be true with 'obj' parameter: (null). Result");
	  equals( isNativeType( undefined ), true, "isNativeType() should be true with 'obj' parameter: (undefined). Result");
	  equals( isNativeType( Number ), true, "isNativeType() should be true with 'obj' parameter: (Number). Result");
	  equals( isNativeType( String ), true, "isNativeType() should be true with 'obj' parameter: (String). Result");
	  equals( isNativeType( Boolean ), true, "isNativeType() should be true with 'obj' parameter: (Boolean). Result");
	  equals( isNativeType( RegExp ), true, "isNativeType() should be true with 'obj' parameter: (RegExp). Result");
	  equals( isNativeType( Date ), true, "isNativeType() should be true with 'obj' parameter: (Date). Result");
	  equals( isNativeType( Function ), true, "isNativeType() should be true with 'obj' parameter: (Function). Result");
	  equals( isNativeType( Array ), true, "isNativeType() should be true with 'obj' parameter: (Array). Result");
	  equals( isNativeType( Object ), true, "isNativeType() should be true with 'obj' parameter: (Object). Result");
	  equals( isNativeType( Error ), true, "isNativeType() should be true with 'obj' parameter: (Object). Result");

	  // Test native objects - augmented

	  equals( isNativeType( augmentNative( Number ) ), true, "isNativeType() should be true with 'obj' parameter: (Number [augmented]). Result");
	  equals( isNativeType( augmentNative( String ) ), true, "isNativeType() should be true with 'obj' parameter: (String [augmented]). Result");
	  equals( isNativeType( augmentNative( Boolean ) ), true, "isNativeType() should be true with 'obj' parameter: (Boolean [augmented]). Result");
	  equals( isNativeType( augmentNative( RegExp ) ), true, "isNativeType() should be true with 'obj' parameter: (RegExp [augmented]). Result");
	  equals( isNativeType( augmentNative( Date ) ), true, "isNativeType() should be true with 'obj' parameter: (Date [augmented]). Result");
	  equals( isNativeType( augmentNative( Function ) ), true, "isNativeType() should be true with 'obj' parameter: (Function [augmented]). Result");
	  equals( isNativeType( augmentNative( Array ) ), true, "isNativeType() should be true with 'obj' parameter: (Array [augmented]). Result");
	  equals( isNativeType( augmentNative( Object ) ), true, "isNativeType() should be true with 'obj' parameter: (Object [augmented]). Result");
	  equals( isNativeType( augmentNative( Error ) ), true, "isNativeType() should be true with 'obj' parameter: (Error [augmented]). Result");

    // Clean-up so as not to mitigate false positive/negatives in other tests
    cleanNatives();

	});*/

	test("Assay.Utils.getFunctionName() - exercises", function () {

	  var getFunctionName = Assay.Utils.getFunctionName;

	  // Expected False Evaluations

	  // Test non-function objects, primitive and composite types

	  equals( getFunctionName( null ), false, "getFunctionName() should be false with 'obj' parameter: (null). Result");
	  equals( getFunctionName( undefined ), false, "getFunctionName() should be false with 'obj' parameter: (undefined). Result");
	  equals( getFunctionName( NaN ), false, "getFunctionName() should be false with 'obj' parameter: (NaN). Result");
	  equals( getFunctionName( 0 ), false, "getFunctionName() should be false with 'obj' parameter: (Number: 0). Result");
	  equals( getFunctionName( 1 ), false, "getFunctionName() should be false with 'obj' parameter: (Number: 1). Result");
	  equals( getFunctionName( "" ), false, "getFunctionName() should be false with 'obj' parameter: (String: ''). Result");
	  equals( getFunctionName( "foo" ), false, "getFunctionName() should be false with 'obj' parameter: (String: 'foo'). Result");
	  equals( getFunctionName( false ), false, "getFunctionName() should be false with 'obj' parameter: (Boolean: false). Result");
	  equals( getFunctionName( true ), false, "getFunctionName() should be false with 'obj' parameter: (Boolean: true). Result");
	  equals( getFunctionName( Object(1) ), false, "getFunctionName() should be false with 'obj' parameter: (Number: Object(1)). Result");
	  equals( getFunctionName( Object("foo") ), false, "getFunctionName() should be false with 'obj' parameter: (String: Object('foo'')). Result");
	  equals( getFunctionName( Object(true) ), false, "getFunctionName() should be false with 'obj' parameter: (Boolean: true). Result");
	  equals( getFunctionName( /foo/ ), false, "getFunctionName() should be false with 'obj' parameter: (RegExp: /foo/). Result");
	  equals( getFunctionName( {} ), false, "getFunctionName() should be false with 'obj' parameter: (Object: {}). Result");
	  equals( getFunctionName( [] ), false, "getFunctionName() should be false with 'obj' parameter: (Array: []). Result");
	  equals( getFunctionName( new Date ), false, "getFunctionName() should be false with 'obj' parameter: (Date: new Date). Result");
	  equals( getFunctionName( Math ), false, "getFunctionName() should be true with 'obj' parameter: (Math). Result");

	  // Expected True Evalutions

	  // Test various function constructs

	  function functionDeclaration () {};

	  equals( getFunctionName( functionDeclaration ), "functionDeclaration", "getFunctionName() should be true with 'obj' parameter: (Function: functionDeclaration). Result");
	  equals( getFunctionName( function functionExpression () {} ), "functionExpression", "getFunctionName() should be true with 'obj' parameter: (Function: functionExpression). Result");
	  equals( getFunctionName( function () {} ), "anonymous", "getFunctionName() should be true with 'obj' parameter: (Function: anonymous). Result");
    // Test for event callback functions - varies across browsers whether this is named or not (e.g. FF/Y, CH/N)
	  /*if ( focus ) {
	    equals( getFunctionName( focus ), "focus", "getFunctionName() should be true with 'obj' parameter: (focus). Result");
	  }*/

    // Native & Custom Cnstructors

	  equals( getFunctionName( Number ), "Number", "getFunctionName() should be true with 'obj' parameter: (Number: Constructor). Result");
	  equals( getFunctionName( String ), "String", "getFunctionName() should be true with 'obj' parameter: (String: Constructor). Result");
	  equals( getFunctionName( Boolean ), "Boolean", "getFunctionName() should be true with 'obj' parameter: (Boolean: Constructor). Result");
	  equals( getFunctionName( RegExp ), "RegExp", "getFunctionName() should be true with 'obj' parameter: (RegExp: Constructor). Result");
	  equals( getFunctionName( Date ), "Date", "getFunctionName() should be true with 'obj' parameter: (Date: Constructor). Result");
	  equals( getFunctionName( Function ), "Function", "getFunctionName() should be true with 'obj' parameter: (Function: Constructor). Result");
	  equals( getFunctionName( Array ), "Array", "getFunctionName() should be true with 'obj' parameter: (Array: Constructor). Result");
	  equals( getFunctionName( Object ), "Object", "getFunctionName() should be true with 'obj' parameter: (Object: Constructor). Result");
	  equals( getFunctionName( Error ), "Error", "getFunctionName() should be true with 'obj' parameter: (Error: Constructor). Result");
	  equals( getFunctionName( Custom ), "Custom", "getFunctionName() should be true with 'obj' parameter: (Custom: Constructor). Result");

	});

	test("Assay.collection() method - test parameter requirements", function () {

	  expect( 5 );

		// Test no arguments
	  try {
			Assay.collection();
	    ok(false, "Assay.collection() should throw exception when passed No parameters");
	  } catch (exception) {
	    equals(exception.type, "MissingParametersException", "Assay.collection() exception type should be MissingParametersException for less than two parameters (required). Result");
	  }

	  // Test malformed arguments to interface afforded by Assay.collection()
	  try {
			Assay.collection( undefined, []	);
	    ok(false, "Assay.collection() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "Assay.collection() requires the 'expected' and 'actual' parameters to be Array-like objects. Result");
	  }

	  try {
			Assay.collection( [], undefined );
	    ok(false, "Assay.collection() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "Assay.collection() requires the 'expected' and 'actual' parameters to be Array-like objects. Result");
	  }

	  // Test expected and actual collection of objects with different lengths
		equals((function() {
      return Assay.collection([1,2], arguments);
    })(1), false, "Assay.collection() should return false if the 'expected' and 'actual' objects have mistmatched lengths");

	  // Test passing in an 'arguments' array and returned object is a Boolean
    equals((function() {
      return Assay.collection([Boolean], arguments);
    })(true)["constructor"], Boolean, "Assay.collection() should allow Array-like objects to be passed-in (e.g arguments collections) AND return a Boolean. Result");

	});

	test("Assay.collection() exercises [default type check mode]", function () {

	  expect(33);

	  var mock = new Mock();

	  // Expected false evaluations

	  // Test mis-matched member types

	  equals( Assay.collection([10], [""]), false, "Assay.collection() should be false with expected: [(Number: 10)] and actual: [(String: '')]. Result");
	  equals( Assay.collection([""], [10]), false, "Assay.collection() should be false with expected: [(String: '')] and actual: [(Number: 10)]. Result");
	  equals( Assay.collection([{test: "foo"}], [["test", 1]]), false, "Assay.collection() should be false with expected: [(Object: {test: 'foo'})] and actual: [(Object: {test: 1})]. Result");
	  equals( Assay.collection([function() {}], []), false, "Assay.collection() should be false with expected: [(Function: function() {})] and actual: [undefined]. Result");
	  equals( Assay.collection([null], [undefined]), false, "Assay.collection() should be false with expected: [(null)] and actual: [(undefined)]. Result");
	  equals( Assay.collection([undefined], ["foo"]), false, "Assay.collection() should be false with expected: [(undefined)] and actual: [(String: 'foo')]. Result");
	  equals( Assay.collection([/foo/], [9]), false, "Assay.collection() should be false: [(RegExp: /foo/)], [(Number: 9)]. Result");
	  equals( Assay.collection([new Custom], [new Number]), false, "Assay.collection() should be false: [(Custom: new Custom)], [(Number: new Number)]. Result");

	  // Expected true evaluations

	  // Test matching member types (but mis-matched values)

	  equals( Assay.collection([10], [1]), true, "Assay.collection() should be true with expected: [(Number: 10)] and actual: [(Number: 1)]. Result");
	  equals( Assay.collection([""], ["bar"]), true, "Assay.collection() should be true with expected: [(String: '')] and actual: [(String: 'bar')]. Result");
	  equals( Assay.collection([true], [false]), true, "Assay.collection() should be true with expected: [(Boolean: true)] and actual: [(Boolean: false)]. Result");
	  equals( Assay.collection([false], [true]), true, "Assay.collection() should be true with expected: [(Boolean: false)] and actual: [(Boolean: true)]. Result");
	  equals( Assay.collection([{test: "foo"}], [{test: "different string"}]), true, "Assay.collection() should be true with expected: [(Object: {test: 'foo'})] and actual: [(Object: {test: 'different string'})]. Result");
	  equals( Assay.collection([new Date], [new Date(1970)]), true, "Assay.collection() should be true with expected: [(Date: new Date)] and actual: [(Date: new Date(1970))]. Result");
	  equals( Assay.collection([new Custom], [new Custom]), true, "Assay.collection() should be true with expected: [(Custom: new Custom)] and actual: [(Custom: new Custom)]. Result");

	  // Test matching member values
	  equals( Assay.collection([10], [10]), true, "Assay.collection() should be true with expected: [(Number: 10)] and actual: [(Number: 10)]. Result");
	  equals( Assay.collection(["foo"], ["foo"]), true, "Assay.collection() should be true with expected: [(String: 'foo')] and actual: [(String: 'foo')]. Result");
	  equals( Assay.collection([true], [true]), true, "Assay.collection() should be true with expected: [(Boolean: true)] and actual: [(Boolean: true)]. Result");
	  equals( Assay.collection([[]], [[]]), true, "Assay.collection() should be true with expected: [(Array: [])] and actual: [(Array: [])]. Result");
	  equals( Assay.collection([{}], [{}]), true, "Assay.collection() should be true with expected: [(Object: {})] and actual: [(Object: {})]. Result");
	  equals( Assay.collection([{test: "foo"}], [{test: "foo"}]), true, "Assay.collection() should be true with expected: [(Object: {test: 'foo'})] and actual: [(Object: {test: 'foo'})]. Result");
	  equals( Assay.collection([["foo"]], [["foo"]]), true, "Assay.collection() should be true with expected: [(Array: [[]])] and actual: [(Array: [[]])]. Result");
	  equals( Assay.collection([function() {}], [function() {}]), true, "Assay.collection() should be true with expected: [(Function: function(){})] and actual: [(Function: function(){})]. Result");
	  equals( Assay.collection([/foo/], [/foo/]), true, "Assay.collection() should be true with expected: [(RegExp: /foo/)] and actual: [(RegExp: /foo/)]. Result");
	  equals( Assay.collection([new Date], [new Date]), true, "Assay.collection() should be true with expected: [(Date: new Date)] and actual: [(Date: new Date)]. Result");

	  // Test falsy member values

	  equals( Assay.collection([0], [0]), true, "Assay.collection() should be true with expected: [(Number: 0)] and actual: [(Number: 0)]. Result");
	  equals( Assay.collection([""], [""]), true, "Assay.collection() should be true with expected: [(String: '')] and actual: [(String: '')]. Result");
	  equals( Assay.collection([false], [false]), true, "Assay.collection() should be true with expected: [(Boolean: false)] and actual: [(Boolean: false)]. Result");
	  equals( Assay.collection([null], [null]), true, "Assay.collection() should be true with expected: [(null)] and actual: [(null)]. Result");
	  equals( Assay.collection([undefined], [undefined]), true, "Assay.collection() should be true with expected: [(undefined)] and actual: [(undefined)]. Result");
	  equals( Assay.collection([0,"foo", true, [], {}, function() {}, null, undefined, /foo/, new Date], [0,"foo", true, [], {}, function() {}, null, undefined, /foo/, new Date]), true, "Assay.collection() should be true with expected: [ MANY TYPES ] and actual: [ MANY TYPES ]. Result");

	  // Nested

	  equals( Assay.collection([[[["foo"]]]], [[[["foo"]]]]), true, "Assay.collection() should be true with expected: [(Array: [[[['foo']]]])] with actual: (Array: [[[['foo']]]]). Result");
	  equals( Assay.collection(["foo", ["bar", ["baz", ["biz"]]]], ["foo", ["bar", ["baz", ["biz"]]]]), true, "Assay.collection() should be true with expected: [ MANY NESTED [] ] and actual: [ MANY NESTED [] ]. Result");

	});

	test("Assay.collection() exercises [strict mode", function () {

	  expect(31)

	  // Strict value checking assertions (Boolean optional param)

	  // Expected false evaluations

	  // Test mis-matched member types

	  equals( Assay.collection([10], [""], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(Number: 10)] and actual: [(String: '')]. Result");
	  equals( Assay.collection([""], [10], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(String: '')] and actual: [(Number: 10)]. Result");
	  equals( Assay.collection([{test: "foo"}], [["test", 1]], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(Object: {test: 'foo'})] and actual: [(Object: {test: 1})]. Result");
	  equals( Assay.collection([function() {}], [], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(Function: function() {})] and actual: [undefined]. Result");
	  equals( Assay.collection([null], [undefined], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(null)] and actual: [(undefined)]. Result");
	  equals( Assay.collection([undefined], ["foo"], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(undefined)] and actual: [(String: 'foo')]. Result");
	  equals( Assay.collection([/foo/], [9], {strictValueChecking:true}), false, "Assay.collection() should be false: [(RegExp: /foo/)], [(Number: 9)]. Result");
	  equals( Assay.collection([new Custom], [new Number], {strictValueChecking:true}), false, "Assay.collection() should be false: [(Custom: new Custom)], [(Number: new Number)]. Result");

	  // Test mis-matched member values

	  equals( Assay.collection([10], [1], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(Number: 10)] and actual: [(Number: 1)]. Result");
	  equals( Assay.collection([""], ["bar"], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(String: '')] and actual: [(String: 'different string')]. Result");
	  equals( Assay.collection([true], [false], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(Boolean: true)] and actual: [(Boolean: false)]. Result");
	  equals( Assay.collection([false], [true], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(Boolean: false)] and actual: [(Boolean: true)]. Result");
	  equals( Assay.collection([{test: "foo"}], [{test: "bar"}], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(Object: {test: 'foo'})] and actual: [(Object: {test: 'bar'})]. Result");
	  equals( Assay.collection([function() {}], [function() {}], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(Function: function(){})] and actual: [(Function: function(){})]. Result");
	  equals( Assay.collection([new Date], [new Date(1970)], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(Date: new Date)] and actual: [(Date: new Date(1970))]. Result");
	  // commented out as revisting equality and identity rules around strict checking
	  //equals( Assay.collection([new Custom], [new Custom], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [(Custom: new Custom)] and actual: [(Custom: new Custom)]. Result");
	  equals( Assay.collection([0,"foo", true, [], {}, function() {}, null, undefined, /foo/, new Date], [1,"string", true, [], {}, function() {}, null, undefined, /foo/, new Date], {strictValueChecking:true}), false, "Assay.collection() should be false with expected: [ MANY TYPES ] and actual: [ MANY TYPES ]");

	  // Expected true evaluations

	  // Test matching member values
	  equals( Assay.collection([10], [10], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(Number: 10)] and actual: [(Number: 10)]. Result");
	  equals( Assay.collection(["foo"], ["foo"], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(String: 'foo')] and actual: [(String: 'foo')]. Result");
	  equals( Assay.collection([true], [true], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(Boolean: true)] and actual: [(Boolean: true)]. Result");
	  equals( Assay.collection([[]], [[]], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(Array: [])] and actual: [(Array: [])]. Result");
	  equals( Assay.collection([{}], [{}], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(Object: {})] and actual: [(Object: {})]. Result");
	  equals( Assay.collection([{test: "foo"}], [{test: "foo"}], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(Object: {test: 'foo'})] and actual: [(Object: {test: 'foo'})]. Result");
	  equals( Assay.collection([["foo"]], [["foo"]], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(Array: [[]])] and actual: [(Array: [[]])]. Result");
	  equals( Assay.collection([/foo/], [/foo/], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(RegExp: /foo/)] and actual: [(RegExp: /foo/)]. Result");

	  // Test matching member falsy values

	  equals( Assay.collection([0], [0], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(Number: 0)] and actual: [(Number: 0)]. Result");
	  equals( Assay.collection([""], [""], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(String: '')] and actual: [(String: '')]. Result");
	  equals( Assay.collection([false], [false], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(Boolean: false)] and actual: [(Boolean: false)]. Result");
	 debugger; equals( Assay.collection([null], [null], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(null)] and actual: [(null)]. Result");
	  equals( Assay.collection([undefined], [undefined], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(undefined)] and actual: [(undefined)]. Result");

	  // Nested

	  equals( Assay.collection([[[["foo"]]]], [[[["foo"]]]], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [(Array: [[[['test']]]])] with actual: (Array: [[[['test']]]]). Result");
	  equals( Assay.collection(["foo", ["bar", ["baz", ["biz"]]]], ["foo", ["bar", ["baz", ["biz"]]]], {strictValueChecking:true}), true, "Assay.collection() should be true with expected: [ MANY NESTED [] ] and actual: [ MANY NESTED [] ]. Result");

	});

	test("Assay.hash() method - test parameter requirements", function () {

		// Expected false evaluations

		// Test no arguments
	  try {
			Assay.hash();
	    ok(false, "Assay.hash() should throw exception when passed No parameters");
	  } catch (exception) {
	    equals(exception.type, "MissingParametersException", "Assay.hash() exception type should be MissingParametersException for less than two parameters (required). Result");
	  }

	  // Test malformed arguments to interface afforded by Assay.hash() [see test suite for _isHash() for more examples]
	  try {
			Assay.hash( undefined, {}	);
	    ok(false, "Assay.hash() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "Assay.hash() requires the 'expected' and 'actual' parameters to be Hash-like objects. Result");
	  }

	  try {
			Assay.hash( {}, undefined );
	    ok(false, "Assay.hash() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "Assay.hash() requires the 'expected' and 'actual' parameters to be Hash-like objects. Result");
	  }

	  // Expected true evaluations

	  // Test passing in a hash-like objects [see other test groups fopr in-depth examples] and that returned value is a Boolean
    equals((function() {
      return Assay.hash({}, {});
    })(true)["constructor"], Boolean, "Assay.collection() should allow Hash-like objects to be passed-in (e.g composite types and hashes) AND return a Boolean. Result");

	});

	test("Assay.hash() method - type checking exercises", function () {

	  expect(37);

	  var mockErrorHandler = (function () {
	    var errors = [];
	    function handler ( expected, actual, errorType, fn ) {
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
	  * The as-is also implitly test the object checking callback (Assay.object()) invoked within this function, as opposed to just the flow control logic that naively enumerates over hash-like objects, but this should be seen as a secondary concern to this test-suite.
	  * I simply wanted to poke the method a lot to see what it could handle. Assay.object() has it's own test-suite available which actually focuses on object type checking and value assertion
	  */

	  // Type checking assertions (default)

	  // Expected false evaluations

	  // Test incomplete 'actual' object (vis-a-vis expected)...

	  // Single missing key
	  try {
	    Assay.hash({key: 'value'}, {}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "Assay.hash() should throw exception when passed an 'actual' object missing the 'key' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "Assay.hash() should raise a 'MissingHashKeyException' with expected: (Object {key: 'value'}) and actual: (Object {}). Error raised was");
	    equals( /expected: "key"/.test(e[0].message), true, "Assay.hash() should identify 'key' as the missing accessor with expected: (Object {key: 'value'}) and actual: (Object {}). Result");
	  }

	  mockErrorHandler.reset();

	  try {
	    Assay.hash({key: 'value', key2: 'value2'}, {key: 'value'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "Assay.hash() should throw exception when passed an 'actual' object missing the 'key2' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "Assay.hash() should raise a 'MissingHashKeyException' with expected: (Object {key: 'value', key2: 'value2'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key2"/.test(e[0].message), true, "Assay.hash() should identify 'key2' as the missing accessor with expected: (Object {key: 'value', key2: 'value2'}) and actual: (Object {key: 'value'}). Result");
	  }

    mockErrorHandler.reset();

	  try {
	    Assay.hash({key: 'value', key2: 'value2', key3: 'value'}, {key: 'value', key2: 'value2'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "Assay.hash() should throw exception when passed an 'actual' object missing the 'key3' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "Assay.hash() should raise a 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value', key2: 'value'}). Error raised was");
	    equals( /expected: "key3"/.test(e[0].message), true, "Assay.hash() should identify 'key3' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value', key2: 'value'}). Result");
	  }

	  mockErrorHandler.reset();

	  // Multiple missing keys
	  try {
	    Assay.hash({key: 'value', key2: 'value2', key3: 'value'}, {key: 'value'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "Assay.hash() should throw exception when passed an 'actual' object missing the 'key2' and 'key3' properties");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "Assay.hash() should raise a 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key2"/.test(e[0].message), true, "Assay.hash() should identify 'key2' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Result");
	    equals( e[1].type, "MissingHashKeyException", "Assay.hash() should raise a second 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key3"/.test(e[1].message), true, "Assay.hash() should identify 'key3' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Result");
	  }

	  mockErrorHandler.reset();

	  // Test mis-matched member types

	  equals( Assay.hash({Number: 10}, {Number: "string"}), false, "Assay.hash() should be false with expected: (Object {Number: 10}) and actual: (Object {Number: 'foo'}). Result");
	  equals( Assay.hash({String: "string"}, {String: function() {}}), false, "Assay.hash() should be false with expected: (Object {String: 'foo'}) and actual: (Object {String: function(){}}). Result");
	  equals( Assay.hash({Array: []}, {Array: {}}), false, "Assay.hash() should be false with expected: (Object {Array: []}) and actual: (Object {Array: {}}). Result");
	  equals( Assay.hash({Function: function() {}}, {Function: false}), false, "Assay.hash() should be false with expected: (Object {Function: function(){}}) and actual: (Object {Function: false}). Result");
	  equals( Assay.hash({"null": null},{"null": undefined}), false, "Assay.hash() should be false with expected: (Object {'null': null}) and actual: (Object {'null': undefined}). Result");
	  equals( Assay.hash({"undefined": undefined},{"undefined": null}), false, "Assay.hash() should be false with expected: (Object {'undefined': undefined}) and actual: (Object {'undefined': null}). Result");
	  equals( Assay.hash({RegExp: /foo/},{RegExp: "/foo/"}), false, "Assay.hash() should be false with expected: (Object {RegExp: /foo/}) and actual: (Object {RegExp: '/foo/'}). Result");
	  equals( Assay.hash({Custom: new Custom},{Custom: new Date}), false, "Assay.hash() should be false with expected: (Object {Custom: new Custom}) and actual: (Object {Custom: new Date})). Result");

	  // Expected true evaluations
	  // Test matching member types
	  equals( Assay.hash({Number: 0}, {Number: 0}), true, "Assay.hash() should be true with expected: (Object {Number: 0}) and actual: (Object {Number: 0}). Result" );
	  equals( Assay.hash({Number: 10}, {Number: 10}), true, "Assay.hash() should be true with expected: (Object {Number: 10}) and actual: (Object {Number: 10}). Result" );
	  equals( Assay.hash({String: ""}, {String: ""}), true, "Assay.hash() should be true with expected: (Object {String: ''}) and actual: (Object {String: ''}). Result" );
	  equals( Assay.hash({String: "string"}, {String: "string"}), true, "Assay.hash() should be true with expected: (Object {String: 'foo'}) and actual: (Object {String: 'foo'}). Result" );
	  equals( Assay.hash({Boolean: false}, {Boolean: false}), true, "Assay.hash() should be true with expected: (Object {Boolean: false}) and actual: (Object {Boolean: false}). Result" );
	  equals( Assay.hash({Boolean: true}, {Boolean: true}), true, "Assay.hash() should be true with expected: (Object {Boolean: true}) and actual: (Object {Boolean: true}). Result");
	  equals( Assay.hash({Array: []}, {Array: []}), true, "Assay.hash() should be true with expected: (Object {Array: []}) and actual: (Object {Array: []}). Result");
	  equals( Assay.hash({Array: ["one"]},{Array: ["one"]}), true, "Assay.hash() should be true with expected: (Object {Array: ['one']}) and actual: (Object {Array: ['one']}). Result");
	  equals( Assay.hash({Object: {}}, {Object: {}}), true, "Assay.hash() should be true with expected: (Object {Object: {}}) and actual: (Object {Object: {}}). Result");
	  equals( Assay.hash({Function: function() {}}, {Function: function() {}}), true, "Assay.hash() should be true with expected: (Object {Function: function(){}}) and actual: (Object {Function: function(){}}). Result");
	  equals( Assay.hash({"null": null},{"null": null}), true, "Assay.hash() should be true with expected: (Object {'null': null}) and actual: (Object {'null': null}). Result");
	  equals( Assay.hash({"undefined": undefined},{"undefined": undefined}), true, "Assay.hash() should be true with expected: (Object {'undefined': undefined}) and actual: (Object {'undefined': undefined}). Result");
	  equals( Assay.hash({RegExp: /foo/},{RegExp: /foo/}), true, "Assay.hash() should be true with expected: (Object {RegExp: /foo/}) and actual: (Object {RegExp: /foo/}). Result");
	  equals( Assay.hash({RegExp: /foo/},{RegExp: /bar/}), true, "Assay.hash() should be true with expected: (Object {RegExp: /foo/}) and actual: (Object {RegExp: /bar/}). Result");
	  equals( Assay.hash({Date: new Date},{Date: new Date}), true, "Assay.hash() should be true with expected: (Object {Date: new Date}) and actual: (Object {Date: new Date}). Result");
	  equals( Assay.hash({Date: new Date},{Date: new Date(1970)}), true, "Assay.hash() should be true with expected: (Object {Date: new Date}) and actual: (Object {Date: new Date(1970)}). Result");
	  equals( Assay.hash({Custom: new Custom},{Custom: new Custom}), true, "Assay.hash() should be true with expected: (Object {Custom: new Custom}) and actual: (Object {Custom: new Custom}). Result");
	  equals( Assay.hash({Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /foo/,Date: new Date}, {Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /foo/,Date: new Date}), true, "Assay.hash() should be true (Many native types). Result");

	  // Test nested object literals
	  equals( Assay.hash({"one": {"two": {"three": {"four": "value"}}}}, {"one": {"two": {"three": {"four": "value"}}}}), true, "Assay.hash() should be true with matching nested object literals 4 levels deep. Result");

	  // Test shadowed native keys ({DontEnum} IE bug)
    // ????? meh ???????
  });

  test("Assay.hash() method - strict value checking exercises", function () {

	  expect(46);

	  var mockErrorHandler = (function () {
	    var errors = [];
	    function handler ( expected, actual, errorType, fn ) {
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

	  equals( Assay.hash({Number: 10}, {Number: "string"}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {Number: 10}) and actual: (Object {Number: 'foo'}). Result");
	  equals( Assay.hash({String: "string"}, {String: function() {}}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {String: 'foo'}) and actual: (Object {String: function(){}}). Result");
	  equals( Assay.hash({Array: []}, {Array: {}}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {Array: []}) and actual: (Object {Array: {}}). Result");
	  equals( Assay.hash({Function: function() {}}, {Function: false}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {Function: function(){}}) and actual: (Object {Function: false}). Result");
	  equals( Assay.hash({"null": null},{"null": undefined}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {'null': null}) and actual: (Object {'null': undefined}). Result");
	  equals( Assay.hash({"undefined": undefined},{"undefined": null}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {'undefined': undefined}) and actual: (Object {'undefined': null}). Result");
	  equals( Assay.hash({RegExp: /foo/},{RegExp: "/foo/"}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {RegExp: /foo/}) and actual: (Object {RegExp: '/foo/'}). Result");
	  equals( Assay.hash({Custom: new Custom},{Custom: new Date}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {Custom: new Custom}) and actual: (Object {Custom: new Date})). Result");

	  // Test mis-matched member values

	  equals( Assay.hash({String: "string"}, {String: "different string"}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {String: 'foo'}) and actual: (Object {String: 'different string'}). Result");
	  equals( Assay.hash({Boolean: false}, {Boolean: true}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {Boolean: false}) and actual: (Object {Boolean: true}). Result");
	  equals( Assay.hash({Number: 1}, {Number: 2}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {Number: 1}) and actual: (Object {Number: 2}). Result");
	  equals( Assay.hash({RegExp: /foo/}, {RegExp: /bar/}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {RegExp: /foo/}) and actual: (Object {RegExp: /bar/}). Result");
	  equals( Assay.hash({Array: ["one"]},{Array: ["two"]}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {Array: ['one']}) and actual: (Object {Array: ['two']}). Result");
	  equals( Assay.hash({Object: {key: "value"}},{Object: {key: "value2"}}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {Object: {key: 'value'}}) and actual: (Object {Object: {key: 'value2'}}). Result");
	  equals( Assay.hash({"null": null},{"null": undefined}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {'null': null}) and actual: (Object {'null': undefined}). Result");
	  equals( Assay.hash({"undefined": undefined},{"undefined": null}, {strictValueChecking: true}), false, "Assay.hash() should be false with expected: (Object {'undefined': undefined}) and actual: (Object {'undefined': null}). Result");
	  equals( Assay.hash({Date: new Date},{Date: new Date(1970)}, {strictValueChecking: true}), false, "Assay.hash() should be true with expected: (Object {Date: new Date}) and actual: (Object {Date: new Date(1970)}). Result");
	  equals( Assay.hash({Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /foo/,Date: new Date}, {Number: 1,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /foo/,Date: new Date}, {strictValueChecking: true}), false, "Assay.hash() should be false (Many native types). Result");

	  // Test falsy nested object literals
	  equals( Assay.hash({"one": {"two": {"three": {"four": "value"}}}}, {"one": {"two": {"three": {"four": "string"}}}}, {strictValueChecking: true}), false, "Assay.hash() should be false with matching nested object literals 4 levels deep. Result");

	  // Test incomplete 'actual' object (vis-a-vis expected)...

	  // Single missing key
	  try {
	    Assay.hash({key: 'value'}, {}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "Assay.hash() should throw exception when passed an 'actual' object missing the 'key' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "Assay.hash() should raise a 'MissingHashKeyException' with expected: (Object {key: 'value'}) and actual: (Object {}). Error raised was");
	    equals( /expected: "key"/.test(e[0].message), true, "Assay.hash() should identify 'key' as the missing accessor with expected: (Object {key: 'value'}) and actual: (Object {}). Result");
	  }

	  mockErrorHandler.reset();

	  try {
	    Assay.hash({key: 'value', key2: 'value2'}, {key: 'value'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "Assay.hash() should throw exception when passed an 'actual' object missing the 'key2' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "Assay.hash() should raise a 'MissingHashKeyException' with expected: (Object {key: 'value', key2: 'value2'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key2"/.test(e[0].message), true, "Assay.hash() should identify 'key2' as the missing accessor with expected: (Object {key: 'value', key2: 'value2'}) and actual: (Object {key: 'value'}). Result");
	  }

	  mockErrorHandler.reset();

	  try {
	    Assay.hash({key: 'value', key2: 'value2', key3: 'value'}, {key: 'value', key2: 'value2'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "Assay.hash() should throw exception when passed an 'actual' object missing the 'key3' property");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "Assay.hash() should raise a 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value', key2: 'value'}). Error raised was");
	    equals( /expected: "key3"/.test(e[0].message), true, "Assay.hash() should identify 'key3' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value', key2: 'value'}). Result");
	  }

	  mockErrorHandler.reset();

	  // Multiple missing keys
	  try {
	    Assay.hash({key: 'value', key2: 'value2', key3: 'value'}, {key: 'value'}, {exceptionHandler: mockErrorHandler});
	    mockErrorHandler.throwErrors();
	    ok(false, "Assay.hash() should throw exception when passed an 'actual' object missing the 'key2' and 'key3' properties");
	  } catch (e) {
	    equals( e[0].type, "MissingHashKeyException", "Assay.hash() should raise a 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key2"/.test(e[0].message), true, "Assay.hash() should identify 'key2' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Result");
	    equals( e[1].type, "MissingHashKeyException", "Assay.hash() should raise a second 'MissingHashKeyException' be false with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Error raised was");
	    equals( /expected: "key3"/.test(e[1].message), true, "Assay.hash() should identify 'key3' as the missing accessor with expected: (Object {key: 'value', key2: 'value2', key3: 'value'}) and actual: (Object {key: 'value'}). Result");
	  }

	  mockErrorHandler.reset();

	  // Expected true evaluations

	  // Test matching member values inc. potential false positives

	  equals( Assay.hash({Number: 0}, {Number: 0}, true), true, "Assay.hash() should be true with expected: (Object {Number: 0}) and actual: (Object {Number: 0}). Result" );
	  equals( Assay.hash({Number: 10}, {Number: 10}, true), true, "Assay.hash() should be true with expected: (Object {Number: 10}) and actual: (Object {Number: 10}). Result" );
	  equals( Assay.hash({String: ""}, {String: ""}, true), true, "Assay.hash() should be true with expected: (Object {String: ''}) and actual: (Object {String: ''}). Result" );
	  equals( Assay.hash({String: "string"}, {String: "string"}, true), true, "Assay.hash() should be true with expected: (Object {String: 'foo'}) and actual: (Object {String: 'foo'}). Result" );
	  equals( Assay.hash({Boolean: false}, {Boolean: false}, true), true, "Assay.hash() should be true with expected: (Object {Boolean: false}) and actual: (Object {Boolean: false}). Result" );
	  equals( Assay.hash({Boolean: true}, {Boolean: true}, true), true, "Assay.hash() should be true with expected: (Object {Boolean: true}) and actual: (Object {Boolean: true}). Result");
	  equals( Assay.hash({Array: []}, {Array: []}, true), true, "Assay.hash() should be true with expected: (Object {Array: []}) and actual: (Object {Array: []}). Result");
	  equals( Assay.hash({Array: ["one"]},{Array: ["one"]}, true), true, "Assay.hash() should be true with expected: (Object {Array: ['one']}) and actual: (Object {Array: ['one']}). Result");
	  equals( Assay.hash({Object: {}}, {Object: {}}, true), true, "Assay.hash() should be true with expected: (Object {Object: {}}) and actual: (Object {Object: {}}). Result");
	  // Not sure what to do with this one - it's definitely an edge case... for now maybe just defer to a quick type check (if expectedType === Function?)
	  equals( Assay.hash({Function: function() {}}, {Function: function() {}}, true), true, "Assay.hash() should be true with expected: (Object {Function: function(){}}) and actual: (Object {Function: function(){}}). Result");
	  equals( Assay.hash({"null": null},{"null": null}, true), true, "Assay.hash() should be true with expected: (Object {'null': null}) and actual: (Object {'null': null}). Result");
	  equals( Assay.hash({"undefined": undefined},{"undefined": undefined}, true), true, "Assay.hash() should be true with expected: (Object {'undefined': undefined}) and actual: (Object {'undefined': undefined}). Result");
	  equals( Assay.hash({RegExp: /foo/},{RegExp: /foo/}, true), true, "Assay.hash() should be true with expected: (Object {RegExp: /foo/}) and actual: (Object {RegExp: /foo/}). Result");
	  equals( Assay.hash({Date: new Date},{Date: new Date}, true), true, "Assay.hash() should be true with expected: (Object {Date: new Date}) and actual: (Object {Date: new Date}). Result");
	  equals( Assay.hash({Custom: new Custom},{Custom: new Custom}, true), true, "Assay.hash() should be true with expected: (Object {Custom: new Custom}) and actual: (Object {Custom: new Custom}). Result");
	  equals( Assay.hash({Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /foo/,Date: new Date}, {Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /foo/,Date: new Date}), true, "Assay.hash() should be true (Many native types). Result");

	  // Test nested object literals
	  equals( Assay.hash({"one": {"two": {"three": {"four": "value"}}}}, {"one": {"two": {"three": {"four": "value"}}}}, true), true, "Assay.hash() should be true with matching nested object literals 4 levels deep. Result");

	});

	/*test("Assay.hash() - test *interface* assertion use case", function () {

	});*/

	test("Assay.object() method - test parameter requirements", function () {

		/*// Test no arguments
	  try {
			Assay.collection();
	    ok(false, "Assay.collection() should throw exception when passed No parameters");
	  } catch (exception) {
	    equals(exception.type, "MissingParametersException", "Assay.collection() exception type should be MissingParametersException for less than two parameters (required)");
	  }

	  // Test malformed arguments to interface afforded by Assay.collection()
	  try {
			Assay.collection( undefined, []	);
	    ok(false, "Assay.collection() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "Assay.collection() requires the 'expected' and 'actual' parameters to be Array-like objects");
	  }

	  try {
			Assay.collection( [], undefined );
	    ok(false, "Assay.collection() should throw exception when passed incorrectly formatted parameters");
	  } catch (exception) {
	    equals(exception.type, "MalformedArgumentsException", "Assay.collection() requires the 'expected' and 'actual' parameters to be Array-like objects");
	  }

	  // Test expected and actual collection of objects with different lengths
		 equals((function() {
          return Assay.collection([1,2], arguments);
      })(1), false, "Assay.collection() should return false if the 'expected' and 'actual' objects have mistmatched lengths");

	  // Test passing in an 'arguments' array
    equals((function() {
      return Assay.collection([Boolean], arguments);
      })(true)["constructor"], Boolean, "Assay.collection() should allow Array-like objects to be passed-in (e.g arguments collections) AND return a Boolean");
		*/

	});

	test("Assay.object() exercises - (Number: Constructor) primitive [default type check mode]", function() {

	  // FALSE ASSERTIONS

		// Test invalid argument type - Values (truthy)
		equals( Assay.object(Number, 1), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(Number, 0), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Number: 0)" );
		equals( Assay.object(Number, "string"), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (String: string)" );
		equals( Assay.object(Number, true), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(Number, []), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Array: [])" );
		equals( Assay.object(Number, {}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Object: {})" );
		equals( Assay.object(Number, /test/), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (RegExp: /test/)" );
		equals( Assay.object(Number, new Date), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Date: new instance)" );
		equals( Assay.object(Number, new Custom), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Custom: new instance)" );
		equals( Assay.object(Number, null), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (null)" );
		equals( Assay.object(Number, undefined), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (undefined)" );

		// TRUE ASSERTIONS

		// Test Functions
		equals( Assay.object(Number, function(){}), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(Number, Number), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Number: Constructor)" );
		equals( Assay.object(Number, String), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (String: Constructor)" );
		equals( Assay.object(Number, Boolean), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Boolean: Constructor)" );
		equals( Assay.object(Number, Array), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Array: Constructor)" );
		equals( Assay.object(Number, Object), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Object: Constructor)" );
		equals( Assay.object(Number, Function), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Function: Constructor)" );
		equals( Assay.object(Number, RegExp), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (RegExp: Constructor)" );
		equals( Assay.object(Number, Date), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Date: Constructor)" );
		equals( Assay.object(Number, Error), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Error: Constructor)" );
		equals( Assay.object(Number, Custom), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Custom: Constructor)" );

	});

	test("Assay.object() exercises - (Number: Constructor) primitive [strict mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors
		equals( Assay.object(Number, String, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (String: Constructor)" );
		equals( Assay.object(Number, Boolean, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Boolean: Constructor)" );
		equals( Assay.object(Number, Array, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Array: Constructor)" );
		equals( Assay.object(Number, Object, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Object: Constructor)" );
		equals( Assay.object(Number, Function, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Function: Constructor)" );
		equals( Assay.object(Number, RegExp, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (RegExp: Constructor)" );
		equals( Assay.object(Number, Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Date: Constructor)" );
		equals( Assay.object(Number, Error, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Error: Constructor)" );
		equals( Assay.object(Number, Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)
		equals( Assay.object(Number, 1, {strictValueChecking: true}), false, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(Number, 0, {strictValueChecking: true}), false, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Number: 0)" );
		equals( Assay.object(Number, "string", {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (String: string)" );
		equals( Assay.object(Number, true, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(Number, [], {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Array: [])" );
		equals( Assay.object(Number, {}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Object: {})" );
		equals( Assay.object(Number, function(){}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(Number, /test/, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (RegExp: /test/)" );
		equals( Assay.object(Number, new Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Date: new instance)" );
		equals( Assay.object(Number, new Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values
		equals( Assay.object(Number, null, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (null)" );
		equals( Assay.object(Number, undefined, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: Constructor) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(Number, Number, {strictValueChecking: true}), true, "Assay.object() should return true with expected: (Number: Constructor) and actual: (Number: Constructor)" );

	});

	test("Assay.object() exercises - (Number: 1) primitive [default type check mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors
	  equals( Assay.object(1, Number), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Number: Constructor)" );
		equals( Assay.object(1, String), false, "Assay.object() should return false with expected: (Number: 1) and actual: (String: Constructor)" );
		equals( Assay.object(1, Boolean), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Boolean: Constructor)" );
		equals( Assay.object(1, Array), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Array: Constructor)" );
		equals( Assay.object(1, Object), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Object: Constructor)" );
		equals( Assay.object(1, Function), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Function: Constructor)" );
		equals( Assay.object(1, RegExp), false, "Assay.object() should return false with expected: (Number: 1) and actual: (RegExp: Constructor)" );
		equals( Assay.object(1, Date), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Date: Constructor)" );
		equals( Assay.object(1, Error), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Error: Constructor)" );
		equals( Assay.object(1, Custom), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)

		equals( Assay.object(1, "string"), false, "Assay.object() should return false with expected: (Number: 1) and actual: (String: string)" );
		equals( Assay.object(1, true), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Boolean: true)" );
		equals( Assay.object(1, []), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Array: [])" );
		equals( Assay.object(1, {}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Object: {})" );
		equals( Assay.object(1, function(){}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Function: function(){})" );
		equals( Assay.object(1, /test/), false, "Assay.object() should return false with expected: (Number: 1) and actual: (RegExp: /test/)" );
		equals( Assay.object(1, new Date), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Date: new instance)" );
		equals( Assay.object(1, new Custom), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( Assay.object(1, null), false, "Assay.object() should return false with expected: (Number: 1) and actual: (null)" );
		equals( Assay.object(1, undefined), false, "Assay.object() should return false with expected: (Number: 1) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(1, 1), true, "Assay.object() should return true with expected: (Number: 1) and actual: (Number: 1)" );
		equals( Assay.object(1, 0), true, "Assay.object() should return true with expected: (Number: 1) and actual: (Number: 0)" );

		// Expect Falsy Value
		equals( Assay.object(0, 1 ), true, "Assay.object() should return true with expected: (Number: 0) and actual: (Number: 1)" );
		equals( Assay.object(0, 0 ), true, "Assay.object() should return true with expected: (Number: 0) and actual: (Number: 0)" );

	});

	test("Assay.object() exercises - (Number: 1) primitive [strict mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors
	  equals( Assay.object(0, Number, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 0) and actual: (Number: Constructor)" );
		equals( Assay.object(1, String, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (String: Constructor)" );
		equals( Assay.object(1, Boolean, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Boolean: Constructor)" );
		equals( Assay.object(1, Array, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Array: Constructor)" );
		equals( Assay.object(1, Object, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Object: Constructor)" );
		equals( Assay.object(1, Function, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Function: Constructor)" );
		equals( Assay.object(1, RegExp, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (RegExp: Constructor)" );
		equals( Assay.object(1, Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Date: Constructor)" );
		equals( Assay.object(1, Error, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Error: Constructor)" );
		equals( Assay.object(1, Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)

		equals( Assay.object(1, "foo", {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (String: 'foo')" );
		equals( Assay.object(1, true, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Boolean: true)" );
		equals( Assay.object(1, [], {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Array: [])" );
		equals( Assay.object(1, {}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Object: {})" );
		equals( Assay.object(1, function(){}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Function: function(){})" );
		equals( Assay.object(1, /test/, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (RegExp: /test/)" );
		equals( Assay.object(1, new Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Date: new instance)" );
		equals( Assay.object(1, new Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values
		equals( Assay.object(1, null, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (null)" );
		equals( Assay.object(1, undefined, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (undefined)" );

		// Unequal values
		equals( Assay.object(1, 0, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 1) and actual: (Number: 0)" );
		equals( Assay.object(0, 1, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Number: 0) and actual: (Number: 1)" );

		// TRUE ASSERTIONS
		equals( Assay.object(1, 1, {strictValueChecking: true}), true, "Assay.object() should return true with expected: (Number: 1) and actual: (Number: 1)" );
		equals( Assay.object(0, 0, {strictValueChecking: true}), true, "Assay.object() should return true with expected: (Number: 0) and actual: (Number: 0)" );

	});

	test("Assay.object() exercises - (String: Constructor) primitive [default type check mode]", function() {

	  // FALSE ASSERTIONS

		// Test invalid argument type - Values (truthy)
		equals( Assay.object(String, "foo"), false, "Assay.object() should return true with expected: (String: Constructor) and actual: (String: 'foo')" );
		equals( Assay.object(String, ""), false, "Assay.object() should return true with expected: (String: Constructor) and actual: (String: '')" );
		equals( Assay.object(String, 1), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(String, true), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(String, []), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Array: [])" );
		equals( Assay.object(String, {}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Object: {})" );
		equals( Assay.object(String, /test/), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (RegExp: /test/)" );
		equals( Assay.object(String, new Date), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Date: new instance)" );
		equals( Assay.object(String, new Custom), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values
		equals( Assay.object(String, null), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (null)" );
		equals( Assay.object(String, undefined), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (undefined)" );

		// TRUE ASSERTIONS

		// Test Constructors
		equals( Assay.object(String, function(){}), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(String, String), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (String: Constructor)" );
		equals( Assay.object(String, Number), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Number: Constructor)" );
		equals( Assay.object(String, Boolean), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Boolean: Constructor)" );
		equals( Assay.object(String, Array), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Array: Constructor)" );
		equals( Assay.object(String, Object), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Object: Constructor)" );
		equals( Assay.object(String, Function), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Function: Constructor)" );
		equals( Assay.object(String, RegExp), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (RegExp: Constructor)" );
		equals( Assay.object(String, Date), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Date: Constructor)" );
		equals( Assay.object(String, Error), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Error: Constructor)" );
		equals( Assay.object(String, Custom), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Custom: Constructor)" );

	});

	test("Assay.object() exercises - (String: Constructor) primitive [strict mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors
		equals( Assay.object(String, Number, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Number: Constructor)" );
		equals( Assay.object(String, Boolean, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Boolean: Constructor)" );
		equals( Assay.object(String, Array, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Array: Constructor)" );
		equals( Assay.object(String, Object, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Object: Constructor)" );
		equals( Assay.object(String, Function, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Function: Constructor)" );
		equals( Assay.object(String, RegExp, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (RegExp: Constructor)" );
		equals( Assay.object(String, Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Date: Constructor)" );
		equals( Assay.object(String, Error, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Error: Constructor)" );
		equals( Assay.object(String, Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)
		equals( Assay.object(String, "string", {strictValueChecking: true}), false, "Assay.object() should return true with expected: (String: Constructor) and actual: (String: 'foo')" );
		equals( Assay.object(String, "", {strictValueChecking: true}), false, "Assay.object() should return true with expected: (String: Constructor) and actual: (String: '')" );
		equals( Assay.object(String, 1, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(String, true, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(String, [], {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Array: [])" );
		equals( Assay.object(String, {}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Object: {})" );
		equals( Assay.object(String, function(){}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(String, /test/, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (RegExp: /test/)" );
		equals( Assay.object(String, new Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Date: new instance)" );
		equals( Assay.object(String, new Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values
		equals( Assay.object(String, null, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (null)" );
		equals( Assay.object(String, undefined, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(String, String, {strictValueChecking: true}), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (String: Constructor)" );

	});

	test("Assay.object() exercises - (String: 'foo') primitive [default type check mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors
		equals( Assay.object('foo', String), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (String: Constructor)" );
		equals( Assay.object('foo', Number), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Number: Constructor)" );
		equals( Assay.object('foo', Boolean), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Boolean: Constructor)" );
		equals( Assay.object('foo', Array), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Array: Constructor)" );
		equals( Assay.object('foo', Object), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Object: Constructor)" );
		equals( Assay.object('foo', Function), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Function: Constructor)" );
		equals( Assay.object('foo', RegExp), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (RegExp: Constructor)" );
		equals( Assay.object('foo', Date), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Date: Constructor)" );
		equals( Assay.object('foo', Custom), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Custom: Constructor)" );
		equals( Assay.object('foo', Error), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Error: Constructor)" );
		equals( Assay.object('', String), false, "Assay.object() should return false with expected: (String: '') and actual: (String: Constructor)" );

		// Test invalid argument type - Values (truthy)

		equals( Assay.object('foo', 1), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Number: 1)" );
		equals( Assay.object('foo', true), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Boolean: true)" );
		equals( Assay.object('foo', []), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Array: [])" );
		equals( Assay.object('foo', {}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Object: {})" );
		equals( Assay.object('foo', function(){}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Function: function(){})" );
		equals( Assay.object('foo', /test/), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (RegExp: /test/)" );
		equals( Assay.object('foo', new Date), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Date: new instance)" );
		equals( Assay.object('foo', new Custom), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( Assay.object('foo', null), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (null)" );
		equals( Assay.object('foo', undefined), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (undefined)" );

		// TRUE ASSERTIONS
	  equals( Assay.object('foo', 'foo'), true, "Assay.object() should return true with expected: (String: 'foo') and actual: (String: 'foo')" );
		equals( Assay.object('foo', ''), true, "Assay.object() should return true with expected: (String: 'foo') and actual: (String: '')" );

		// Expect Falsy Value
		equals( Assay.object('', "foo"), true, "Assay.object() should return true with expected: (String: '') and actual: (String: 'foo')" );
		equals( Assay.object('', ''), true, "Assay.object() should return true with expected: (String: '') and actual: (String: '')" );

	});

	test("Assay.object() exercises - (String: 'foo') primitive [strict mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors
		equals( Assay.object('', String, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: '') and actual: (String: Constructor)" );
		equals( Assay.object('foo', String, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (String: Constructor)" );
		equals( Assay.object('foo', Number, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Number: Constructor)" );
		equals( Assay.object('foo', Boolean, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Boolean: Constructor)" );
		equals( Assay.object('foo', Array, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Array: Constructor)" );
		equals( Assay.object('foo', Object, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Object: Constructor)" );
		equals( Assay.object('foo', Function, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Function: Constructor)" );
		equals( Assay.object('foo', RegExp, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (RegExp: Constructor)" );
		equals( Assay.object('foo', Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Date: Constructor)" );
		equals( Assay.object('foo', Error, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Error: Constructor)" );
		equals( Assay.object('foo', Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)
		equals( Assay.object('foo', 'bar', {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (String: 'bar')" );
		equals( Assay.object('bar', 'foo', {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'bar') and actual: (String: 'foo')" );
		equals( Assay.object('foo', 1, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Number: 1)" );
		equals( Assay.object('foo', true, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Boolean: true)" );
		equals( Assay.object('foo', [], {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Array: [])" );
		equals( Assay.object('foo', {}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Object: {})" );
		equals( Assay.object('foo', function(){}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Function: function(){})" );
		equals( Assay.object('foo', /test/, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (RegExp: /test/)" );
		equals( Assay.object('foo', new Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Date: new instance)" );
		equals( Assay.object('foo', new Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( Assay.object('foo', null, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (null)" );
		equals( Assay.object('foo', undefined, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (String: 'foo') and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object('foo', 'foo', {strictValueChecking: true}), true, "Assay.object() should return true with expected: (String: 'foo') and actual: (String: 'foo')" );
		equals( Assay.object('', '', {strictValueChecking: true}), true, "Assay.object() should return true with expected: (String: '') and actual: (String: '')" );

	});

	test("Assay.object() exercises - (Boolean: Constructor) primitive [default type check mode]", function() {

	  // FALSE ASSERTIONS

		// Test invalid argument type - Values (truthy)

		equals( Assay.object(Boolean, 1), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(Boolean, "foo"), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (String: 'foo')" );
		equals( Assay.object(Boolean, true), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(Boolean, false), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Boolean: false)" );
		equals( Assay.object(Boolean, []), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Array: [])" );
		equals( Assay.object(Boolean, {}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Object: {})" );
		equals( Assay.object(Boolean, /test/), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (RegExp: /test/)" );
		equals( Assay.object(Boolean, new Date), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Date: new instance)" );
		equals( Assay.object(Boolean, new Custom), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( Assay.object(Boolean, null), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (null)" );
		equals( Assay.object(Boolean, undefined), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(Boolean, function(){}), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(Boolean, Boolean), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (Boolean: Constructor)" );
		equals( Assay.object(Boolean, Number), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (Number: Constructor)" );
		equals( Assay.object(Boolean, String), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (String: Constructor)" );
		equals( Assay.object(Boolean, Array), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (Array: Constructor)" );
		equals( Assay.object(Boolean, Object), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (Object: Constructor)" );
		equals( Assay.object(Boolean, Function), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (Function: Constructor)" );
		equals( Assay.object(Boolean, RegExp), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (RegExp: Constructor)" );
		equals( Assay.object(Boolean, Date), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (Date: Constructor)" );
		equals( Assay.object(Boolean, Error), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (Error: Constructor)" );
		equals( Assay.object(Boolean, Custom), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (Custom: Constructor)" );

	});

	test("Assay.object() exercises - (Boolean: Constructor) primitive [strict mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( Assay.object(Boolean, Number, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Number: Constructor)" );
		equals( Assay.object(Boolean, String, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (String: Constructor)" );
		equals( Assay.object(Boolean, Array, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Array: Constructor)" );
		equals( Assay.object(Boolean, Object, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Object: Constructor)" );
		equals( Assay.object(Boolean, Function, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Function: Constructor)" );
		equals( Assay.object(Boolean, RegExp, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (RegExp: Constructor)" );
		equals( Assay.object(Boolean, Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Date: Constructor)" );
		equals( Assay.object(Boolean, Error, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Error: Constructor)" );
		equals( Assay.object(Boolean, Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)

		equals( Assay.object(Boolean, 1, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(Boolean, "foo", {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (String: 'foo')" );
		equals( Assay.object(Boolean, true, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(Boolean, false, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Boolean: false)" );
		equals( Assay.object(Boolean, [], {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Array: [])" );
		equals( Assay.object(Boolean, {}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Object: {})" );
		equals( Assay.object(Boolean, function(){}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(Boolean, /test/, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (RegExp: /test/)" );
		equals( Assay.object(Boolean, new Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Date: new instance)" );
		equals( Assay.object(Boolean, new Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( Assay.object(Boolean, null, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (null)" );
		equals( Assay.object(Boolean, undefined, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: Constructor) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(Boolean, Boolean, {strictValueChecking: true}), true, "Assay.object() should return true with expected: (Boolean: Constructor) and actual: (Boolean: Constructor)" );

	});

	test("Assay.object() exercises - (Boolean: true) primitive [default type check mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( Assay.object(true, Number), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Number: Constructor)" );
		equals( Assay.object(true, String), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (String: Constructor)" );
		equals( Assay.object(false, Boolean), false, "Assay.object() should return false with expected: (Boolean: false) and actual: (Boolean: Constructor)" );
		equals( Assay.object(true, Boolean), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Boolean: Constructor)" );
		equals( Assay.object(true, Array), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Array: Constructor)" );
		equals( Assay.object(true, Object), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Object: Constructor)" );
		equals( Assay.object(true, Function), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Function: Constructor)" );
		equals( Assay.object(true, RegExp), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (RegExp: Constructor)" );
		equals( Assay.object(true, Date), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Date: Constructor)" );
		equals( Assay.object(true, Error), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Error: Constructor)" );
		equals( Assay.object(true, Custom), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)

		equals( Assay.object(true, 1), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Number: 1)" );
		equals( Assay.object(true, "foo"), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (String: 'foo')" );
		equals( Assay.object(true, []), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Array: [])" );
		equals( Assay.object(true, {}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Object: {})" );
		equals( Assay.object(true, function(){}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Function: function(){})" );
		equals( Assay.object(true, /test/), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (RegExp: /test/)" );
		equals( Assay.object(true, new Date), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Date: new instance)" );
		equals( Assay.object(true, new Custom), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( Assay.object(true, null), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (null)" );
		equals( Assay.object(true, undefined), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(true, true), true, "Assay.object() should return true with expected: (Boolean: true) and actual: (Boolean: true)" );
		equals( Assay.object(true, false), true, "Assay.object() should return true with expected: (Boolean: true) and actual: (Boolean: false)" );

		// Expect Falsy Value
		equals( Assay.object(false, true), true, "Assay.object() should return true with expected: (Boolean: false) and actual: (Boolean: true)" );
		equals( Assay.object(false, false), true, "Assay.object() should return true with expected: (Boolean: false) and actual: (Boolean: false)" );

	});

	test("Assay.object() exercises - (Boolean: true) primitive [strict mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( Assay.object(true, Number, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Number: Constructor)" );
		equals( Assay.object(true, String, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (String: Constructor)" );
		equals( Assay.object(true, Boolean, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Boolean: Constructor)" );
		equals( Assay.object(false, Boolean, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: false) and actual: (Boolean: Constructor)" );
		equals( Assay.object(true, Array, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Array: Constructor)" );
		equals( Assay.object(true, Object, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Object: Constructor)" );
		equals( Assay.object(true, Function, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Function: Constructor)" );
		equals( Assay.object(true, RegExp, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (RegExp: Constructor)" );
		equals( Assay.object(true, Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Date: Constructor)" );
		equals( Assay.object(true, Error, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Error: Constructor)" );
		equals( Assay.object(true, Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)

		equals( Assay.object(true, 1, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Number: 1)" );
		equals( Assay.object(true, "foo", {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (String: 'foo')" );
		equals( Assay.object(true, false, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Boolean: false)" );
		equals( Assay.object(false, true, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: false) and actual: (Boolean: true)" );
		equals( Assay.object(true, [], {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Array: [])" );
		equals( Assay.object(true, {}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Object: {})" );
		equals( Assay.object(true, function(){}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Function: function(){})" );
		equals( Assay.object(true, /test/, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (RegExp: /test/)" );
		equals( Assay.object(true, new Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Date: new instance)" );
		equals( Assay.object(true, new Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( Assay.object(true, null, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (null)" );
		equals( Assay.object(true, undefined, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Boolean: true) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(true, true, {strictValueChecking: true}), true, "Assay.object() should return true with expected: (Boolean: true) and actual: (Boolean: true)" );
		equals( Assay.object(false, false, {strictValueChecking: true}), true, "Assay.object() should return true with expected: (Boolean: false) and actual: (Boolean: false)" );

	});

	test("Assay.object() exercises - (RegExp) composite [default type check mode]", function() {

	  // FALSE ASSERTIONS

		// Test invalid argument type - Values (truthy)

		equals( Assay.object(RegExp, 1), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(RegExp, "foo"), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (String: foo)" );
		equals( Assay.object(RegExp, true), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(RegExp, []), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Array: [])" );
		equals( Assay.object(RegExp, {}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Object: {})" );
		equals( Assay.object(RegExp, new Date), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Date: new instance)" );
		equals( Assay.object(RegExp, new Custom), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Custom: new instance)" );
		equals( Assay.object(RegExp, /foo/), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (RegExp: /foo/)" );
		equals( Assay.object(RegExp, new RegExp(/foo/)), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (RegExp: new RegExp(/foo/))" );

	  // Test invalid argument types - false values

		equals( Assay.object(RegExp, null), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (null)" );
		equals( Assay.object(RegExp, undefined), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(RegExp, function(){}), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(RegExp, Number), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (Number: Constructor)" );
		equals( Assay.object(RegExp, String), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (String: Constructor)" );
		equals( Assay.object(RegExp, Boolean), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (Boolean: Constructor)" );
		equals( Assay.object(RegExp, Array), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (Array: Constructor)" );
		equals( Assay.object(RegExp, Object), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (Object: Constructor)" );
		equals( Assay.object(RegExp, RegExp), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (RegExp: Constructor)" );
		equals( Assay.object(RegExp, Function), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (Function: Constructor)" );
		equals( Assay.object(RegExp, Date), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (Date: Constructor)" );
		equals( Assay.object(RegExp, Error), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (Error: Constructor)" );
		equals( Assay.object(RegExp, Custom), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (Custom: Constructor)" );

	});

	test("Assay.object() exercises - (RegExp) composite [strict mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( Assay.object(RegExp, Number, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Number: Constructor)" );
		equals( Assay.object(RegExp, String, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (String: Constructor)" );
		equals( Assay.object(RegExp, Boolean, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Boolean: Constructor)" );
		equals( Assay.object(RegExp, Array, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Array: Constructor)" );
		equals( Assay.object(RegExp, Object, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Object: Constructor)" );
		equals( Assay.object(RegExp, Function, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Function: Constructor)" );
		equals( Assay.object(RegExp, Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Date: Constructor)" );
		equals( Assay.object(RegExp, Error, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Error: Constructor)" );
		equals( Assay.object(RegExp, Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)

		equals( Assay.object(RegExp, 1, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(RegExp, "string", {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (String: string)" );
		equals( Assay.object(RegExp, true, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(RegExp, [], {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Array: [])" );
		equals( Assay.object(RegExp, {}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Object: {})" );
		equals( Assay.object(RegExp, function(){}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(RegExp, new Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Date: new instance)" );
		equals( Assay.object(RegExp, new Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (Custom: new instance)" );
		equals( Assay.object(RegExp, /foo/, {strictValueChecking: true}), false, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (RegExp: /foo/)" );
		equals( Assay.object(RegExp, new RegExp(/foo/), {strictValueChecking: true}), false, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (RegExp: new RegExp(/foo/))" );

	  // Test invalid argument types - false values

		equals( Assay.object(RegExp, null, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (null)" );
		equals( Assay.object(RegExp, undefined, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: Constructor) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(RegExp, RegExp, {strictValueChecking: true}), true, "Assay.object() should return true with expected: (RegExp: Constructor) and actual: (RegExp: Constructor)" );

	});


	test("Assay.object() exercises - (RegExp: /foo/) composite [default type check mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( Assay.object(/foo/, Number), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Number: Constructor)" );
		equals( Assay.object(/foo/, String), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (String: Constructor)" );
		equals( Assay.object(/foo/, Boolean), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Boolean: Constructor)" );
		equals( Assay.object(/foo/, Array), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Array: Constructor)" );
		equals( Assay.object(/foo/, Object), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Object: Constructor)" );
		equals( Assay.object(/foo/, Function), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Function: Constructor)" );
		equals( Assay.object(/foo/, RegExp), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (RegExp: Constructor)" );
		equals( Assay.object(/foo/, Date), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Date: Constructor)" );
		equals( Assay.object(/foo/, Error), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Error: Constructor)" );
		equals( Assay.object(/foo/, Custom), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)

		equals( Assay.object(/foo/, 1), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Number: 1)" );
		equals( Assay.object(/foo/, 'foo'), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (String: 'foo')" );
		equals( Assay.object(/foo/, true), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Boolean: true)" );
		equals( Assay.object(/foo/, []), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Array: [])" );
		equals( Assay.object(/foo/, {}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Object: {})" );
		equals( Assay.object(/foo/, function(){}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Function: function(){})" );
		equals( Assay.object(/foo/, new Date), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Date: new instance)" );
		equals( Assay.object(/foo/, new Custom), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( Assay.object(/foo/, null), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (null)" );
		equals( Assay.object(/foo/, undefined), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(/foo/, /foo/), true, "Assay.object() should return true with expected: (RegExp: /foo/) and actual: (RegExp: /foo/)" );
		equals( Assay.object(/foo/, new RegExp(/foo/)), true, "Assay.object() should return true with expected: (RegExp: /foo/) and actual: (RegExp: new RegExp(/foo/))" );
		equals( Assay.object(/foo/, /bar/), true, "Assay.object() should return true with expected: (RegExp: /foo/) and actual: (RegExp: /bar/)" );

	});

	test("Assay.object() exercises - (RegExp: /foo/) composite [strict mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors

		equals( Assay.object(/foo/, Number, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Number: Constructor)" );
		equals( Assay.object(/foo/, String, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (String: Constructor)" );
		equals( Assay.object(/foo/, Boolean, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Boolean: Constructor)" );
		equals( Assay.object(/foo/, Array, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Array: Constructor)" );
		equals( Assay.object(/foo/, Object, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Object: Constructor)" );
		equals( Assay.object(/foo/, RegExp, {strictValueChecking: true}), false, "Assay.object() should return true with expected: (RegExp: /foo/) and actual: (RegExp: Constructor)" );
		equals( Assay.object(/foo/, Function, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Function: Constructor)" );
		equals( Assay.object(/foo/, Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Date: Constructor)" );
		equals( Assay.object(/foo/, Error, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Error: Constructor)" );
		equals( Assay.object(/foo/, Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)

		equals( Assay.object(/foo/, 1, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Number: 1)" );
		equals( Assay.object(/foo/, 'foo', {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (String: 'foo')" );
		equals( Assay.object(/foo/, true, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Boolean: true)" );
		equals( Assay.object(/foo/, [], {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Array: [])" );
		equals( Assay.object(/foo/, {}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Object: {})" );
		equals( Assay.object(/foo/, /bar/, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (RegExp: /bar/)" );
		equals( Assay.object(/foo/, function(){}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Function: function(){})" );
		equals( Assay.object(/foo/, new Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Date: new instance)" );
		equals( Assay.object(/foo/, new Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values

		equals( Assay.object(/foo/, null, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (null)" );
		equals( Assay.object(/foo/, undefined, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (RegExp: /foo/) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(/foo/, /foo/, {strictValueChecking: true}), true, "Assay.object() should return true with expected: (RegExp: /foo/) and actual: (RegExp: /foo/)" );
		equals( Assay.object(/foo/, new RegExp(/foo/), {strictValueChecking: true}), true, "Assay.object() should return true with expected: (RegExp: /foo/) and actual: (RegExp: new RegExp(/foo/))" );

	});

	test("Assay.object() exercises - (Object: Constructor) primitive [default type check mode]", function() {

	  // FALSE ASSERTIONS

		// Test invalid argument type - Values (truthy)
		equals( Assay.object(Object, "foo"), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (String: 'foo')" );
		equals( Assay.object(Object, ""), false, "Assay.object() should return true with expected: (String: Constructor) and actual: (String: '')" );
		equals( Assay.object(Object, 1), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(Object, true), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(Object, []), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Array: [])" );
		equals( Assay.object(Object, {}), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Object: {})" );
		equals( Assay.object(Object, /test/), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (RegExp: /test/)" );
		equals( Assay.object(Object, new Date), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Date: new instance)" );
		equals( Assay.object(Object, new Custom), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values
		equals( Assay.object(Object, null), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (null)" );
		equals( Assay.object(Object, undefined), false, "Assay.object() should return false with expected: (String: Constructor) and actual: (undefined)" );

		// TRUE ASSERTIONS

		// Test Constructors
		equals( Assay.object(Object, function(){}), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(Object, String), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (String: Constructor)" );
		equals( Assay.object(Object, Number), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Number: Constructor)" );
		equals( Assay.object(Object, Boolean), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Boolean: Constructor)" );
		equals( Assay.object(Object, Array), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Array: Constructor)" );
		equals( Assay.object(Object, Object), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Object: Constructor)" );
		equals( Assay.object(Object, Function), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Function: Constructor)" );
		equals( Assay.object(Object, RegExp), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (RegExp: Constructor)" );
		equals( Assay.object(Object, Date), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Date: Constructor)" );
		equals( Assay.object(Object, Error), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Error: Constructor)" );
		equals( Assay.object(Object, Custom), true, "Assay.object() should return true with expected: (String: Constructor) and actual: (Custom: Constructor)" );

	});

	test("Assay.object() exercises - (Object: Constructor) conmposite [strict mode]", function() {

	  // FALSE ASSERTIONS

	  // Test invalid argument type - Constructors
		equals( Assay.object(Object, Number, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Number: Constructor)" );
		equals( Assay.object(Object, String, {strictValueChecking: true}), false, "Assay.object() should return true with expected: (Object: Constructor) and actual: (String: Constructor)" );
		equals( Assay.object(Object, Boolean, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Boolean: Constructor)" );
		equals( Assay.object(Object, Array, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Array: Constructor)" );
		equals( Assay.object(Object, Function, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Function: Constructor)" );
		equals( Assay.object(Object, RegExp, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (RegExp: Constructor)" );
		equals( Assay.object(Object, Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Date: Constructor)" );
		equals( Assay.object(Object, Error, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Error: Constructor)" );
		equals( Assay.object(Object, Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Custom: Constructor)" );

		// Test invalid argument type - Values (truthy)
		equals( Assay.object(Object, "string", {strictValueChecking: true}), false, "Assay.object() should return true with expected: (Object: Constructor) and actual: (String: 'foo')" );
		equals( Assay.object(Object, "", {strictValueChecking: true}), false, "Assay.object() should return true with expected: (Object: Constructor) and actual: (String: '')" );
		equals( Assay.object(Object, 1, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(Object, true, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(Object, [], {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Array: [])" );
		equals( Assay.object(Object, {}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Object: {})" );
		equals( Assay.object(Object, function(){}, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(Object, /test/, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (RegExp: /test/)" );
		equals( Assay.object(Object, new Date, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Date: new instance)" );
		equals( Assay.object(Object, new Custom, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (Custom: new instance)" );

	  // Test invalid argument types - false values
		equals( Assay.object(Object, null, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (null)" );
		equals( Assay.object(Object, undefined, {strictValueChecking: true}), false, "Assay.object() should return false with expected: (Object: Constructor) and actual: (undefined)" );

		// TRUE ASSERTIONS
		equals( Assay.object(Object, Object, {strictValueChecking: true}), true, "Assay.object() should return true with expected: (Object: Constructor) and actual: (Object: Constructor)" );

	});

	test("Assay.object() [type binding on] exercises - (ALL TYPES) [default type check mode]", function () {

    // Number
		equals( Assay.object(Number, 1, {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(Number, 0, {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: Constructor) and actual: (Number: 0)" );
		// Functions - Number is a function type TBD: Ban functions from matching...? mmmmm
		equals( Assay.object(Number, function() {}, {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Number: Constructor) and actual: (Function: function(){})" );
		// Ensure no false positives
		equals( Assay.object(Number, 'foo', {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Number: Constructor) and actual: (String: 'foo')" );
		equals( Assay.object(Number, true, {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Number: Constructor) and actual: (Boolean: true)" );
		// Test default mode (type inference) works
		equals( Assay.object(1, 1, {typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: 1) and actual: (Number: 1)" );
		equals( Assay.object(1, 0, {typed:true}), true, "Assay.object() in 'typed' mode  should return true with expected: (Number: 1) and actual: (Number: 0)" );
		equals( Assay.object(0, 1, {typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: 0) and actual: (Number: 1)" );
		equals( Assay.object(0, 0, {typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: 0) and actual: (Number: 0)" );

		// String
		equals( Assay.object(String, "foo", {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (String: Constructor) and actual: (String: 'foo')" );
		equals( Assay.object(String, "", {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (String: Constructor) and actual: (String: '')" );
		// Test default mode (type inference) works
	  equals( Assay.object('foo', 'foo', {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (String: 'foo') and actual: (String: 'foo')" );
		equals( Assay.object('foo', '', {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (String: 'foo') and actual: (String: '')" );
		equals( Assay.object('', "foo", {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (String: '') and actual: (String: 'foo')" );
		equals( Assay.object('', '', {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (String: '') and actual: (String: '')" );

    // Boolean
    equals( Assay.object(Boolean, true, {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Boolean: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(Boolean, false, {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Boolean: Constructor) and actual: (Boolean: false)" );
		// Test default mode (type inference) works
		equals( Assay.object(true, true, {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Boolean: true) and actual: (Boolean: true)" );
		equals( Assay.object(true, false, {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Boolean: true) and actual: (Boolean: false)" );
		equals( Assay.object(false, true, {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Boolean: false) and actual: (Boolean: true)" );
		equals( Assay.object(false, false, {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Boolean: false) and actual: (Boolean: false)" );

    // RegExp
    equals( Assay.object(RegExp, /foo/, {typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (RegExp: Constructor) and actual: (RegExp: /foo/)" );
		equals( Assay.object(RegExp, new RegExp(/foo/), {typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (RegExp: Constructor) and actual: (RegExp: new RegExp(/foo/))" );
		// Test default mode (type inference) works
		equals( Assay.object(/foo/, /foo/, {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (RegExp: /foo/) and actual: (RegExp: /foo/)" );
		equals( Assay.object(/foo/, new RegExp(/foo/), {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (RegExp: /foo/) and actual: (RegExp: new RegExp(/foo/))" );
		equals( Assay.object(/foo/, /bar/, {typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (RegExp: /foo/) and actual: (RegExp: /bar/)" );

    // Object
    equals( Assay.object(Object, {}, {typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (Object: Constructor) and actual: (Object: {})" );
		// Ensure no false positives
		debugger;
		equals( Assay.object(Object, 'foo', {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Object: Constructor) and actual: (String: 'foo')" );
		equals( Assay.object(Object, 1, {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Object: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(Object, true, {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Object: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(Object, /foo/, {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Object: Constructor) and actual: (RegExp: /re/)" );
		equals( Assay.object(Object, [], {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Object: Constructor) and actual: (Array: [])" );
		equals( Assay.object(Object, new Date, {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Object: Constructor) and actual: (Date: new Date)" );
		equals( Assay.object(Object, function() {}, {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Object: Constructor) and actual: (Function: function(){})" );
		equals( Assay.object(Object, new Custom, {typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Object: Constructor) and actual: (Custom: new Date)" );
		// Test default mode (type inference) works
    equals( Assay.object({}, {}, {typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (Object: {}) and actual: (Object: {})" );
    equals( Assay.object({foo: "bar"}, {}, {typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (Object: {foo:'bar'}) and actual: (Object: {})" );

	});

	test("Assay.object() [type binding on] exercises - (ALL TYPES) [strict mode]", function () {

    // Number
    equals( Assay.object(Number, 1, {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(Number, 0, {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: Constructor) and actual: (Number: 0)" );
		equals( Assay.object(1, 0, {strictValueChecking: true, typed:true}), false, "Assay.object() in 'typed' mode  should return false with expected: (Number: 1) and actual: (Number: 0)" );
		equals( Assay.object(0, 1, {strictValueChecking: true, typed:true}), false, "Assay.object() in 'typed' mode should return false with expected: (Number: 0) and actual: (Number: 1)" );
		equals( Assay.object(1, 1, {strictValueChecking: true, typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: 1) and actual: (Number: 1)" );
		equals( Assay.object(0, 0, {strictValueChecking: true, typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: 0) and actual: (Number: 0)" );

    // String
		equals( Assay.object(String, "foo", {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (String: Constructor) and actual: (String: 'foo')" );
		equals( Assay.object(String, "", {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (String: Constructor) and actual: (String: '')" );
		equals( Assay.object('foo', 'bar', {strictValueChecking: true, typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (String: 'foo') and actual: (String: 'bar')" );
		equals( Assay.object('bar', "foo", {strictValueChecking: true,typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (String: 'bar') and actual: (String: 'foo')" );
	  equals( Assay.object('foo', 'foo', {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (String: 'foo') and actual: (String: 'foo')" );
		equals( Assay.object('', '', {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (String: '') and actual: (String: '')" );

    // Boolean
    equals( Assay.object(Boolean, true, {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Boolean: Constructor) and actual: (Boolean: true)" );
		equals( Assay.object(Boolean, false, {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Boolean: Constructor) and actual: (Boolean: false)" );
		equals( Assay.object(true, false, {strictValueChecking: true, typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Boolean: true) and actual: (Boolean: false)" );
		equals( Assay.object(false, true, {strictValueChecking: true, typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (Boolean: false) and actual: (Boolean: true)" );
		equals( Assay.object(true, true, {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Boolean: true) and actual: (Boolean: true)" );
		equals( Assay.object(false, false, {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Boolean: false) and actual: (Boolean: false)" );

    // RegExp
    equals( Assay.object(RegExp, /foo/, {strictValueChecking: true, typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (RegExp: Constructor) and actual: (RegExp: /foo/)" );
		equals( Assay.object(RegExp, new RegExp(/foo/), {strictValueChecking: true, typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (RegExp: Constructor) and actual: (RegExp: new RegExp(/foo/))" );
		equals( Assay.object(/foo/, /bar/, {strictValueChecking: true, typed: true}), false, "Assay.object() in 'typed' mode should return false with expected: (RegExp: /foo/) and actual: (RegExp: /bar/)" );
		equals( Assay.object(/foo/, /foo/, {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (RegExp: /foo/) and actual: (RegExp: /foo/)" );
		equals( Assay.object(/foo/, new RegExp(/foo/), {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (RegExp: /foo/) and actual: (RegExp: new RegExp(/foo/))" );

    // Object
    equals( Assay.object(Object, {}, {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Object: Constructor) and actual: (Number: 1)" );
		equals( Assay.object(Object, {}, {strictValueChecking: true, typed: true}), true, "Assay.object() in 'typed' mode should return true with expected: (Object: Constructor) and actual: (Number: 0)" );
		/*equals( Assay.object(1, 0, {strictValueChecking: true, typed:true}), false, "Assay.object() in 'typed' mode  should return false with expected: (Number: 1) and actual: (Number: 0)" );
		equals( Assay.object(0, 1, {strictValueChecking: true, typed:true}), false, "Assay.object() in 'typed' mode should return false with expected: (Number: 0) and actual: (Number: 1)" );
		equals( Assay.object(1, 1, {strictValueChecking: true, typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: 1) and actual: (Number: 1)" );
		equals( Assay.object(0, 0, {strictValueChecking: true, typed:true}), true, "Assay.object() in 'typed' mode should return true with expected: (Number: 0) and actual: (Number: 0)" );
    */

	});

	test("Assay.type() - exercises", function () {

	  // Expected True Evalutions

	  // Test falsy types and primitive data types

	  equals( Assay.type( null ), "null", "Assay.type() should return 'null' with 'obj' parameter: (null). Result");
	  equals( Assay.type( undefined ), "undefined", "Assay.type() should return 'undefined' with 'obj' parameter: (undefined). Result");
	  equals( Assay.type( NaN ), "number", "Assay.type() should return 'Number' with 'obj' parameter: (NaN). Result");
	  equals( Assay.type( Infinity ), "number", "Assay.type() should return 'Number' with 'obj' parameter: (NaN). Result");
	  equals( Assay.type( 0 ), "number", "Assay.type() should return 'Number' with 'obj' parameter: (Number: 0). Result");
	  equals( Assay.type( 1 ), "number", "Assay.type() should return 'Number' with 'obj' parameter: (Number: 1). Result");
	  equals( Assay.type( "" ), "string", "Assay.type() should return 'foo' with 'obj' parameter: (String: \"\"). Result");
	  equals( Assay.type( "foo" ), "string", "Assay.type() should return 'foo' with 'obj' parameter: (String: 'string primitive type'). Result");
	  equals( Assay.type( false ), "boolean", "Assay.type() should return 'Boolean' with 'obj' parameter: (Boolean: false). Result");
	  equals( Assay.type( true ), "boolean", "Assay.type() should return 'Boolean' with 'obj' parameter: (Boolean: true). Result");

	  // Test composite data types

	  equals( Assay.type( Object(0) ), "number", "Assay.type() should return 'Number' with 'obj' parameter: (Number: Object(0)). Result");
	  equals( Assay.type( Object(1) ), "number", "Assay.type() should return 'Number' with 'obj' parameter: (Number: Object(1)). Result");
	  equals( Assay.type( Object("") ), "string", "Assay.type() should return 'foo' with 'obj' parameter: (String: Object('')). Result");
	  equals( Assay.type( Object("foo") ), "string", "Assay.type() should return 'foo' with 'obj' parameter: (String: Object('string compositive type')). Result");
	  equals( Assay.type( Object(false) ), "boolean", "Assay.type() should return 'Boolean' with 'obj' parameter: (Boolean: false). Result");
	  equals( Assay.type( Object(true) ), "boolean", "Assay.type() should return 'Boolean' with 'obj' parameter: (Boolean: true). Result");
	  equals( Assay.type( /foo/ ), "regexp", "Assay.type() should return 'RegExp' with 'obj' parameter: (RegExp: /foo/). Result");
	  equals( Assay.type( function() {} ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Function: function(){}). Result");
	  equals( Assay.type( {} ), "object", "Assay.type() should return 'Object' with 'obj' parameter: (Object: {}). Result");
	  equals( Assay.type( [] ), "array", "Assay.type() should return 'Array' with 'obj' parameter: (Array: []). Result");
	  equals( Assay.type( new Date ), "date", "Assay.type() should return 'Date' with 'obj' parameter: (Date: new Date). Result");
	  equals( Assay.type( new Custom ), "object", "Assay.type() should return 'Object' with 'obj' parameter: (Custom: new Custom). Result");

	  // Test native & custom constructors

	  equals( Assay.type( Number ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Number). Result");
	  equals( Assay.type( String ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (String). Result");
	  equals( Assay.type( Boolean ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Boolean). Result");
	  equals( Assay.type( RegExp ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (RegExp). Result");
	  equals( Assay.type( Date ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Date). Result");
	  equals( Assay.type( Function ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Function). Result");
	  equals( Assay.type( Array ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Array). Result");
	  equals( Assay.type( Object ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Object). Result");
	  equals( Assay.type( Custom ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Custom). Result");
	  equals( Assay.type( Custom.prototype ), "object", "Assay.type() should return 'Function' with 'obj' parameter: (Custom.prototype). Result");
	  equals( Assay.type( Custom.constructor ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Custom.constructor). Result");
	  // Valid test for interpreters that expose an object's [[Prototype]]
	  if ( Custom.__proto__ ) {
	    equals( Assay.type( Custom.__proto__ ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Custom.__proto__). Result");
	  }

	  // Test native / host objects

	  equals( Assay.type( Math ), "object", "Assay.type() should return 'Object' with 'obj' parameter: (Math). Result");
	  equals( Assay.type( focus ), "function", "Assay.type() should return 'Function' with 'obj' parameter: (Event: focus). Result");

	});

	/**
	 *
	 * Unit tests for black-boxed qMock interface - asserting against mock API
	 *
	 */


	//module( "qMock Internal Integration Test" );

	/*

  	test("createMockFromJSON()", function() {

  	});

  */


	module("QMock lib // Bootstrap", {

	  setup: function () {
	    this.expectedQMockInterface = {
        "version": String
      };
	  },

	  teardown: function () {
	    delete this.expectedQMockInterface;
	  }

	});

	test("Setup & teardown [normal mode]", function () {

	  expect( 5 );

	  var container = {},
	    // private Assay instance
	      __Assay = initAssay();

	  // Expected false results

	  // initialise QMock without required parameters
	  try {
	    container[ "QMock" ] = initQMock();
	  } catch (e) {
	    equals( e && e.type, "DependencyUnavailableException", "initQmock() should throw a 'DependencyUnavailableException' if the required parameter 'assert' is not passed to the constructor initQmock()" );
	  }

	  // initialise QMock with incorrect parameter type
	  try {
	    container[ "QMock" ] = initQMock( "assert" );
	  } catch (e) {
	    equals( e && e.type, "DependencyUnavailableException", "initQmock() should throw a 'DependencyUnavailableException' if a function is not passed as the required parameter 'assert' to the constructor initQmock()" );
	  }

	  // Exercise inititaliser as common use case
    container[ "QMock" ] = initQMock( __Assay && __Assay.object, { "expose": __Assay && __Assay.exposeObject } );

    // Test interface
    equals( Assay.hash( this.expectedQMockInterface, container[ "QMock" ] ), true, "initQmock() should return a Qmock instance interface registered to the identifier 'QMock' on container" );

    // Test private methods NOT exposed
    ok( Assay.object( undefined, container.QMock[ "_createMockFromJSON" ] ), "initQmock() without optional param should not expose the private method _createMockFromJSON()" );

    // Unload Assay from container
    delete container[ "QMock" ];

    // Test successful removal
    ok( Assay.object( undefined, container.QMock ), "QMock should be unloaded, and the associated identifier 'Qmock' should not exist on container" );

	});

	test("Setup & teardown [exposed mode]", function () {

	  expect( 3 );

	  var container = {},
  	    // private Assay instance
	      __Assay = initAssay();

    // Exercise inititaliser in exposed mode
    container[ "QMock" ] = initQMock( __Assay && __Assay.object, { "isTest": true, "expose": __Assay && __Assay.Utils.expose } );

    // Test interface
    equals( Assay.hash( this.expectedQMockInterface, container[ "QMock" ] ), true, "initQMock() should return a Qmock instance interface registered to the identifier 'Qmock' on container" );

    // Test private methods exposed
    ok( Assay.hash( {"get": Function, "set": Function, "restore": Function}, container.QMock[ "_createMockFromJSON" ] ), "initQMock( {isTest: true} ) should expose accessors and mutators for the private function _createMockFromJSON() on container.QMock" );

    // Unload Assay from container
    delete container[ "QMock" ];

    // Test successful removal
    ok( Assay.object( undefined, container.QMock ), "QMock should be unloaded, and the associated identifier 'Qmock' should not exist on container" );

	});

	/**
	 * All tests follow this simple process:
	 *
	 *  1. Setup: Instantiate mocks and set expected interactions upon them. Sometimes located in the 'setup' phase of the testrunner before each test block.
	 *  2. Exercise: Execute the relevant collaborator code to interact with the mock object.
	 *  3. Verify: Call the verify method on each mock object to establish if it was interacted with correctly.
	 *  4. Reset: [Optional] Call reset method on the mock to return it's internal state to the end of the setup phase. Sometimes located in the 'teardown' phase of the testrunner after each test phase.
	 *
	 */

	module( "QMock lib // Interface unit test" );

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

	  expect(13);

	  var ninja = new Mock();

	  ninja
	    .expects(1, 3)
	      .method('swing');

	  // Test _getState for mockedMembers.
	  var state = ninja.swing._getState();
	  equals(state.actualCalls, 0, "verify() should be true. Result");

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
	  ok( Assay.object( wizard["number"], 1, true ), "wizard mock object should have a stubbed property of 'number' with a value of (Number: 1)");
	  ok( Assay.object( wizard["boolean"], true, true ), "wizard mock object should have a stubbed property of 'number' with a value of (Boolean: true)");
	  ok( Assay.object( wizard["null"], null, true ), "wizard mock object should have a stubbed property of 'null' with a value of (null)");
	  ok( Assay.object( wizard["function"], function() {}, true ), "wizard mock object should have a stubbed property of 'function' with a value of (Function: function stubbedFunction () {})");
	  ok( Assay.object( wizard["object"], {}, true ), "wizard mock object should have a stubbed property of 'object' with a value of (Object: {})");
	  ok( Assay.object( wizard["array"], [], true ), "wizard mock object should have a stubbed property of 'array' with a value of (Array: [])");
	  ok( Assay.object( wizard["regExp"], /RegExp/, true ), "wizard mock object should have a stubbed property of 'regExp' with a value of (RegExp: /RegExp/)");
	  ok( Assay.object( wizard["date"], new Date(1970), true ), "wizard mock object should have a stubbed property of 'date' with a value of (Date: new Date)");
	  ok( Assay.object( wizard["custom object"], new Custom, true ), "wizard mock object should have a stubbed property of 'custom object' with a value of (Custom: new Custom)");

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
	  ok( Assay.object( wizard["number"], 1, true ), "wizard mock object should have a stubbed property of 'number' with a value of (Number: 1)");
	  ok( Assay.object( wizard["boolean"], true, true ), "wizard mock object should have a stubbed property of 'number' with a value of (Boolean: true)");
	  ok( Assay.object( wizard["null"], null, true ), "wizard mock object should have a stubbed property of 'null' with a value of (null)");
	  ok( Assay.object( wizard["function"], function() {}, true ), "wizard mock object should have a stubbed property of 'function' with a value of (Function: function stubbedFunction () {})");
	  ok( Assay.object( wizard["object"], {}, true ), "wizard mock object should have a stubbed property of 'object' with a value of (Object: {})");
	  ok( Assay.object( wizard["array"], [], true ), "wizard mock object should have a stubbed property of 'array' with a value of (Array: [])");
	  ok( Assay.object( wizard["regExp"], /RegExp/, true ), "wizard mock object should have a stubbed property of 'regExp' with a value of (RegExp: /RegExp/)");
	  ok( Assay.object( wizard["date"], new Date(1970), true ), "wizard mock object should have a stubbed property of 'date' with a value of (Date: new Date)");
	  ok( Assay.object( wizard["custom object"], new Custom, true ), "wizard mock object should have a stubbed property of 'custom object' with a value of (Custom: new Custom)");

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

  	ok( Assay.object( mock.getNumericValue(), 10, true ), "getNumericValue() on mock should return (Number: 10)");
    ok( Assay.object( mock.getStringValue(), 'data', true ), "getStringValue() on mock should return (String: data)");
    ok( Assay.object( mock.getArrayValue(), [ 1, 2, 3 ], true ), "getArrayValue() on mock should return (Array: [ 1, 2, 3 ])");
    ok( Assay.object( mock.getFunctionValue()(), 'function', true ), "getFunctionValue() on mock, when invoked, should return (String: 'function')");
    ok( Assay.object( mock.getObjectValue(), { id: 5, value: 'value' }, true ), "getObjectValue() on mock should return (Object: {id: 5, value: 'value'})");
    ok( Assay.object( mock.getNullValue(), null, true ), "getNullValue() on mock should return (null)");
    ok( Assay.object( mock.getUndefinedValue(), undefined, true ), "getUndefinedValue() on mock should return (undefined)");
    ok( Assay.object( mock.getEmptyStringValue(), "", true ), "getEmptyStringValue() on mock should return (String '')");
    ok( Assay.object( mock.getZeroValue(), 0, true ), "getZeroValue() on mock should return (Number: 0)");
    ok( Assay.object( mock.getTrueValue(), true, true ), "getTrueValue() on mock should return (Boolean: true)");
    ok( Assay.object( mock.getFalseValue(), false, true ), "getFalseValue() on mock should return (Boolean: false)");
    ok( Assay.object( mock.getEmptyArrayValue(), [], true ), "getEmptyArrayValue() on mock should return (Array: [])");
    ok( Assay.object( mock.getEmptyObjectValue(), {}, true ), "getEmptyObjectValue() on mock should return (Object: {})");
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

  	ok( Assay.object( mock.getNumericValue(), 10, true ), "getNumericValue() on mock should return (Number: 10)");
    ok( Assay.object( mock.getStringValue(), 'data', true ), "getStringValue() on mock should return (String: data)");
    ok( Assay.object( mock.getArrayValue(), [ 1, 2, 3 ], true ), "getArrayValue() on mock should return (Array: [ 1, 2, 3 ])");
    ok( Assay.object( mock.getFunctionValue()(), 'function', true ), "getFunctionValue() on mock, when invoked, should return (String: 'function')");
    ok( Assay.object( mock.getObjectValue(), { id: 5, value: 'value' }, true ), "getObjectValue() on mock should return (Object: {id: 5, value: 'value'})");
    ok( Assay.object( mock.getNullValue(), null, true ), "getNullValue() on mock should return (null)");
    ok( Assay.object( mock.getUndefinedValue(), undefined, true ), "getUndefinedValue() on mock should return (undefined)");
    ok( Assay.object( mock.getEmptyStringValue(), "", true ), "getEmptyStringValue() on mock should return (String '')");
    ok( Assay.object( mock.getZeroValue(), 0, true ), "getZeroValue() on mock should return (Number: 0)");
    ok( Assay.object( mock.getTrueValue(), true, true ), "getTrueValue() on mock should return (Boolean: true)");
    ok( Assay.object( mock.getFalseValue(), false, true ), "getFalseValue() on mock should return (Boolean: false)");
    ok( Assay.object( mock.getEmptyArrayValue(), [], true ), "getEmptyArrayValue() on mock should return (Array: [])");
    ok( Assay.object( mock.getEmptyObjectValue(), {}, true ), "getEmptyObjectValue() on mock should return (Object: {})");
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

	  ninja.setSkills(['accepts', 'any', 'foo']);
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

	test("w/ API: mock with multiple parameters - required total arguments", function () {

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
	    ok(false, "verify() should throw exception an array of 2 exceptions");
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

	  expect(9);

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
      ok(false, "verify() should throw exception when ($) passed invalid parameter type. expected: (String: Constructor), Actual: (Number: 1)");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception: [IncorrectArgumentTypeException]");
      equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
    }

	  $.reset();

	  // Test valid parameter type but wrong value

    $("#customid").html('<span>blah</span>');
    ok($.verify(), "verify() should be true when ($) passed correct parameter type: (String: #customid)");

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
      ok(false, "verify() should throw exception when ($) passed invalid parameter value. Expected: (String: #id), actual: (String: #customid)");
    } catch (e) {
      equals(e.length, 1, "verify() should return an array of 1 exception: [IncorrectArgumentValueException]");
      equals(e[0].type, "IncorrectArgumentValueException", "verify() exception type should be IncorrectArgumentValueException");
    }

	  $.reset();

	  // Test valid parameter type and value, but invalid argument type to method

    $("#id").html(true);

    try {
        $.verify();
        ok(false, "verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 exception: [IncorrectArgumentTypeException]");
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

	  expect(14);
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
		  ok(false, "verify() should throw exception when ($) passed invalid parameter. expected: (String: Constructor), actual: (Number: 1)");
		} catch (e) {
		  equals(e.length, 3, "verify() should return an array of 3 exceptions: [IncorrectArgumentTypeException, IncorrectNumberOfMethodCallsException, IncorrectNumberOfMethodCallsException]");
		  equals(e[0].type, "IncorrectArgumentTypeException", "verify() exception type should be IncorrectArgumentTypeException");
		  equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
		  equals(e[2].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
		}

    $.reset();

    // No constructor param

    $().run('slow').fight('hard').run('again');
		try {
		  $.verify();
		  ok(false, "verify() should throw exception when passed NO parameters. expected: (String: Constructor), Actual: (N/A)");
		} catch (e) {
		  equals(e.length, 1, "verify() should return an array of 1 exception: IncorrectNumberOfArgumentsException");
		  equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() exception type should be IncorrectNumberOfArgumentsException");
		}

    $.reset();

    // Missed call to fight

    $(".ninja").run('at a canter');

		try {
		  $.verify();
		  ok(false, "verify() should throw exception when fight() is not invoked once, and run() twice");
		} catch (e) {
		  equals(e.length, 2, "verify() should return an array of 2 exceptions: [IncorrectNumberOfMethodCallsException, IncorrectNumberOfMethodCallsException]");
		  equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
		  equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() exception type should be IncorrectNumberOfMethodCallsException");
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

	test("Juice Framework Tests & Patterns", function () {

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

    // Test global 'returnValue'
	  fileMock = ["object","array"]
    // ["object", "array"]
    var mock = new Mock({ rawOpen: { accepts: ['templates/index.tash'], returns: fileMock, calls: 1 } });
    equals( mock.rawOpen('templates/index.tash')[0], "object", "mock.rawOpen('templates/index.tash') should return ['object','array']" );
    equals( mock.rawOpen('templates/index.ta sh')[0], "object", "mock.rawOpen('templates/index.ta sh') should return ['object','array']" );
    // strict mode
    var mock = new Mock({ rawOpen: { accepts: ['templates/index.tash'], returns: fileMock, calls: 1, strict: true } });
    equals( mock.rawOpen('templates/index.tash')[0], "object", "mock.rawOpen('templates/index.tash') should return ['object','array']" );
    equals( mock.rawOpen('templates/index.ta sh')[0], "object", "mock.rawOpen('templates/index.ta sh') should return ['object','array']" );

    // Test direct manipulation of expectedArgs - but also logic to matchAll or not...
    var app = new Mock;

    var fn = app.expects().method("controller");

    fn.expectedArgs.push(
      { accepts: [ "foo", "r"], returns: 2 }
    );
    app.controller( "foo", "r" );
    ok(app.verify(), "verify() should be true");
      //print( JSON.stringify( e, 0, 4 ) );
      //print( JSON.stringify( fn, 0, 4 ) );

    // output:
    /*
    e == [{
            "type":"IncorrectArgumentTypeException",
            "message":"'getClass()' expected: undefined, actual was: foo"
        }
    ]
    fn.expectedArgs == {
        "name":"controller",
        "expectedCalls":false,
        "maxCalls":false,
        "actualCalls":1,
        "expectedArgs":[{
                "accepts":[undefined
                ]
            },
            {
                "accepts":["foo",
                    "r"
                ],
                "returns":2
            }
        ],
        "actualArgs":[["foo"
            ]
        ],
        "callbackArgs":[],
        "requiredNumberofArguments":false,
        "allowOverload":true,
        "strictValueChecking":false
    }*/

	})

})(); // Go Go Inspector Gadget!