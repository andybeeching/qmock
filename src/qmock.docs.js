/** section: QMock
 * QMock.create() -> QMock instance
 *
 *  Factory method for instantiating a new QMock instance with separate
 *  state and copies of private/public members
 *
 *  This is potentially useful for running two versions side-by-side with
 *  custom comparison methods, or modifiying any of the public members.
 *
 *  #### Example
 *
 *  <pre><code>QMock.create(); // Object (API)</code></pre>
 **/

  /**
   * QMock.config
   *  Configuration settings for QMock - can be modified during runtime.
   **/

    /**
     * QMock.config.failslow -> true | Boolean
     *
     *  Allows a developer to specify whether errors built up during a
     *  verify phase should be thrown or suppressed (by default set to
     *  <code>true</code>).
     *
     *  If in 'fail fast' mode (e.g. <code>QMock.config.failslow = false;</code>)
     *  then exceptions are thrown as part of the verify phase, and it is
     *  up to the invoking test runner code to catch and handle them for
     *  assertion.
     *
     *  This can result in scenarios where expected 'good' exercise phase
     *  fails, an exception is thrown, and the testrunner stops due an
     *  unhandled exception.
     *
     *  An alternative (and the default setting) is a 'fail slow' appraoch.
     *  Here, the <code>Mock._getExceptions()</code> method can be called
     *  to see which exceptions were thrown, and inspect their properties.
     *
     *  #### Example
     *
     *  <pre><code>QMock.failslow = true;</code></pre>
     **/

    /**
     * QMock.config.compare -> null | Function
     *
     *  Reference to comparison routine used internally by QMock, and by
     *  <code>QMock.comparePresentation</code>.
     *
     *  Default value is <code>false</code>, and if function not set than an
     *  <code>Error</code> is thrown. This method should override the default
     *  <code>Boolean</code> value, and be set before any tests are run, or
     *  mock instantiated.
     *
     *  #### Example
     *
     *  <pre><code>QMock.config.compare = QUnit.equiv;</code></pre>
     **/

    /**
     * QMock.config.delay -> 100 | Number
     *
     *  Configuration for the delay on Ajax callbacks. This is used to help
     *  simulate asynchronous transactions and the latency of a round-trip
     *  to a server. In turn this encourages developers to developers to
     *  ensure callbacks enact upon the right data or view when executed.
     **/

  /**
   * QMock.utils.is( nativeType, obj ) -> Boolean
   *  - obj (Object): Object to test
   *  - nativeType (String): Native type to test object against
   *
   *  Borrowed from jQuery but main credit to Mark Miller for his
   *  'Miller Device'
   *
   *  Supported Types: <code>String, Number, Boolean, RegExp, Date,
   *  Function, Array, Object</code>
   *
   *  #### Example
   *  <pre>
   *  QMock.Utils.is( "foo", "String"); // true
   *  QMock.Utils.is( 1, "number"); // true 
   *  </pre>
   **/

  /**
   * QMock.utils.enumerate( obj, fn[, scope][, bool] ) -> Object
   *  - obj (Object): Object whose properties to enumerate
   *  - fn (Function): Callback function applied to current property. Passed
   *  three parameters, the current property value, the property
   *  identifier (the key) it's associated by on receiver, and the object
   *  (receiver) it is bound to.
   *  - scope (Object) _optional_: Object to set as execution context on
   *  callback invocation (i.e. <code>this</code> binding). Defaults to the
   *  <code>obj</code> parameter value.
   *  - bool (Boolean) _optional_: Optional flag to determine enumeration
   *  upon inherited (via [[prototype]]) properties. Default is
   *  <code>false</code>.
   *
   *  This is a helper function inspired by the functional programming
   *  syntactic sugar methods on Array.prototype. It's purpose to provide a
   *  simple mechanism for enumerating over an object interface, and
   *  enacting upon it's properties.
   *
   *  It also aims to fix the broken enumeration in browsers (IE6-8) which
   *  fails to enumerate any keys which shadow natively inherited properties
   *  (even where ES3/5 spec states they should indeed be enumerable).
   *
   *  Currently it's really to ensure <code>toString</code> and
   *  <code>valueOf</code> properties are accessible for enactment
   *  (e.g. copying/invoking/overriding).
   *
   *  The esteemed Garrett Smith has the bullet on DHTMLKitchen.
   *
   *    * http://dhtmlkitchen.com/learn/js/enumeration/dontenum.jsp
   *
   *  #### Example
   *
   *  <pre><code>// Enumrate over object
   *  QMock.utils.enumerate({
   *      "toString": "stringify"
   *    },
   *    function ( prop, key, obj ) {
   *      console.log( prop === obj[ key ] ); // true
   *    },
   *    this, // Execution context of callback
   *    true // Enumerate prototypically inherited properties
   *  );
   *  </code></pre>
   **/

  /**
   * QMock.utils.iterate( obj, fn[, scope] ) -> Array || Collection
   *  - obj (Collection): Collection to iterate through, can be any object
   *  with a <code>length</code> property.
   *  - fn (Function): Callback function applied to current item. Passed
   *  three parameters, the current item value, the current index
   *  (identifier) the item corresponds to, and the collection itself.
   *
   *  This basically emulates <code>Array.prototype.forEach</code> but
   *  ensures the order of items is maintained when iterating through a
   *  collection.
   *
   *  Functional programming FTW! 8-)
   *
   *  #### Example
   *
   *  <pre><code>// Iterate through a collection
   *  QMock.utils.iterate([
   *      "foo", "bar", "baz"
   *    ],
   *    function ( item, index, collection ) {
   *      console.log( item === collection[ index ] ); // true
   *    },
   *    this // scope
   *  );
   *  </code></pre>
   **/

  /**
   * QMock.utils.test( mock, presentation[, prop] ) -> Boolean | Object
   *  - mock (Mock): Mock object to which the presentation
   *  is / would be passed
   *  - presentation (Array): Array representing a method/constructor
   *  interface 'presentation' to test (arguments collection or parameter
   *  list)
   *  - key (String) _optional_: Optional key used to lookup (and return) any 
   *  property (e.g. <code>fixture</code> or <code>returns</code> ) on an 
   *  expectation object
   *
   *  Utility method for testing a known parameter list against a mock's
   *  expected parameters.
   *
   *  Can also be used to retrieve associated metadata from an Expectation
   *  instance.
   *
   *  #### Returns
   *
   *  * If optional property name is passed then will use that as key
   *  on any matching expectation objects and return the correlating value.
   *  e.g. Internally QMock uses the method to return canned stubbed
   *  responses during an exercise phase. The method can be used as
   *  standalone to test the Stub interface.
   *  * If no property parameter passed then a Boolean value is returned
   *  depending on match success.
   *
   *  ### Examples
   *  <pre>
   *  var mock = new Mock;
   *  mock.accepts("bar");
   *
   *  // Test - Boolean
   *  QMock.utils.test(mock, ["foo"]) // true;
   *  QMock.utils.test(mock, ["bar"]) // false;
   *
   *  // Augment
   *  mock.receives({accepts:"baz", returns:"fuz"});
   *
   *  // Test
   *  QMock.utils.test(mock, ["foo"], "returns") // undefined;
   *  QMock.utils.test(mock, ["baz"], "returns") // "fuz";
   *  </pre>
   **/

  /* [Private]
   *
   * trimCollection( a, b ) -> Array
   *  - a (Collection): Collection to normalise
   *  - b (Collection): Target collection to normalise against
   *
   *  Utility function to normalise the length of two collections.
   **/

  /* [Private]
   *
   * isCompareSet() -> Boolean | Error
   *
   *  Utility function to assert whether a comparison routine has been set on
   *  QMock namespace.
   **/

  /* [Private]
   *
   * toArray( obj ) -> Array
   *  - obj (Object): Object to nest in array
   *
   *  Function that determines whether an input (aka expectated prameters, or
   *  associated properties like <code>.fixture</code>) need to be normalised 
   *  into an array for the purpose of functional programming / iteration.
   *
   *  Necessary as QMock supports the setting of expected parameters (via
   *  <code>.accepts</code> property), or callback arguments (via 
   *  <code>.fixture</code>) without having to be serialised as arrays where 
   *  there is only one parameter.
   *
   *  ### Examples
   *  <pre>
   *  normaliseToArray( 'foo' ); // ['foo']
   *  </pre>
   **/

  /* [Private]
   *
   * mixin( target, obj[, re ] ) -> Boolean
   *  - target (Object): Receiver object to be extended
   *  - obj (Object): Giver object interface to merge into target
   *  - re (RegExp) _optional_: RegExp to run against interface keys to cache
   *  and execute old method if overwriting.
   *
   *  Function to merge the properties / interface of a target object
   *  with another object. Used for rudimentary inheritance as deep
   *  class hierarchies are not cool. Also used to merge optional config
   *  objects with defaults (a la jQuery).
   *
   *  If optional <code>re</code> parameter passed then runs match on object
   *  keys and partially applies function in a new closure, running it before
   *  the new bound function. This is mainly used when overriding an existing
   *  function through augmented prototypal inheritance. Note the parent
   *  closure delegates both it's execution context and received parameters
   *  to the cached method and override method. Sort of wholesale currying
   *  if you will (work with me here!). Mmm, bacon.
   *
   *  _Note: Using <code>typeof</code> to test property type (and not
   *  <code>QMock.utils.is()</code>) as a bit quicker, and method not
   *  being exposed publically. We (maybe foolishly), trust the input!_
   **/

  /* [Private]
   *
   * bind( fn, scope ) -> Function
   *  - fn (Function): Function to be bound
   *  - scope (Object): Object to bind function to (execution scope)
   *
   *  Utility function to bind a function to a specific execution context.
   *  This only partially implements Function.prototype.bind (as seen in
   *  prototype js and ES5), as haven't required currying arguments yet.
   **/

  /* [Private]
   *
   *  bindInterface( obj, receiver, scope )
   *  - target (Object): Object to copy interface to
   *  - obj (Object): Interface to copy and bind (e.g. Mock.prototype)
   *  - scope (Object): The execution context to bind methods to
   *
   *  Utility function to copy a given object's interface over with bound
   *  function calls to the receiver instance scope (e.g. bind
   *  <code>this</code>).
   **/

  /* [Private]
   * TODO: Define this!
   *  get#methodName(parameters)
   **/

  /* [Private]
   *
   *  createRecorder ( mock, bool ) -> Function
   *  - mock (Mock): mock instance to mutate.
   *  - bool (Boolean): Flag determining if mock is a Spy or Facade
   *
   *  Hat tip to Ben Cherry for constructor safe spying technique:
   *  http://www.adequatelygood.com/2010/5/Spying-Constructors-in-JavaScript
   **/

  // KLASS DEFINITIONS

  /**
   * == Receiver ==
   *
   *  Receiver mock objects are simply pseudo-namespaces for mocked methods
   *  and stubbed properties.
   *
   *  QMock allows receivers to be either plain old object literals, or
   *  functions (aka smart mocks) depending on the requirement to accurately
   *  replicate a given real-world collaborator object interface (with
   *  associated behaviours).
   **/

  /** section: Receiver
   * class Receiver
   *
   *  Receiver is the central superclass in QMock for the simple reason that
   *  Mock objects (aka functions), can also be receiver mock objects. Hence
   *  the Mock klass (and insatnces) implements the Receiver klass interface.
   *
   *  So if one were to define a Constructor akin to jQuery's <code>$</code>,
   *  they can also still attach member methods and properties to that.
   *
   *  The public interface for both klasses act identically no matter which
   *  type the mock is.
   **/

   /**
    * Receiver#method( name ) -> new Mock
    *  - prop (String): Name of the method (and property name on associated 
    *  receiver).
    *  - min (Number) _optional_: Minimum number of calls for method to 
    *  expect. Default is zero.
    *  - max (Number) _optional_: Maximum number of calls for method to 
    *  expect. Default is <code>Infinity</code>.
    *  
    *  When <code>method()</code> is called on a receiver object it is
    *  augmented with a new method bound to the identifier <code>name</code>.
    *
    *  Throws <code>InvalidMethodNameException</code> if member with key
    *  <code>name</code> already exists on receiver.
    *
    *  #### Example
    *
    *  <pre><code>Mock.method('foo');</code></pre>
    **/

   /**
    * Receiver#property( prop, val ) -> Receiver | Mock
    *  - prop (String): Name of the property to attach to receiver object
    *  - val (Object): Value to set on <code>prop</code>.
    *
    *  When <code>method()</code> is called on a receiver object it is
    *  augmented with a new property bound to the identifier
    *  <code>prop</code> with the value <code>val</code>.
    *
    *  Throws <code>InvalidPropertyNameException</code> if member with key
    *  <code>name</code> already exists on receiver.
    *
    *  #### Example
    *
    *  <pre><code>Mock.property('foo', 'bar');
    *  console.log( Mock.foo ); // "bar"</code></pre>
    **/

   /**
    * Receiver#namespace( id [, desc ] ) -> new Receiver
    *  - id (String): Identifer or key for the nested namespace receiver
    *  instance on the Mock. Instance implements all Receiver klass
    *  methods.
    *  - desc (Map) _optional_: Mock Receiver descriptor which works exactly
    *  like those passed to the Mock constructor (see corresponding docs)
    *
    *  #### Example
    *
    *  <pre><code>var mock = new Mock;
    *  // Create a nested namespace with a method called 'bar' on it.
    *  Mock.namespace("foo")
    *    .method("bar");
    *
    *  // With optinal descriptor
    *  Mock.namespace("foo", {
    *    "bar": {
    *      "accepts": "baz"
    *    }
    *  });
    *  </code></pre>
    **/

  /** deprecated
   * Mock#expects( [min = null] [, max = null] ) -> Mock
   * - min (Number): Miniumum number of times mock object should be
   *  invoked. If max parameter not passed then number becomes a 'strict'
   *  invocation expectation (even zero). Default is <code>null</code>.
   * - max (Number) _optional_: Maximum number of times mocked method
   *  should be called. If want 'at least _n_' then just pass
   *  <code>Infinity</code>. Default is <code>null</code>
   *
   *  *DEPRECATED*: Was a factory method for creating new mock objects
   *  (methods / properties) on a receiver object, but mock receiver
   *  object.
   *
   *  Till version 0.5 will be backward compatible, but developers should
   *  use <code>Mock.method( name, min, max )</code>, or
   *  <code>Mock.calls()</code> instead.
   **/

  /**
   * Receiver#verify( [raise] ) -> Boolean
   *
   *  Method recurses through all the child mock object members of a
   *  receiver mock object, verifying their interactions. It delegates
   *  the actual instance verification routine to Mock#verify. It will
   *  returns a Boolean, wher an overall result is determined by whether
   *  the receiver, or any 'leaves' had a negative result.
   *
   *  It will also throw an error if _optional_ <code>raise</code>
   *  parameter is passed. This is thrown if <code>QMock.config.failfast</code>
   *  is set to <code>true</code>. It can also be retrieve by calling
   *  <code>Mock.__getExceptions()</code>.
   *
   *  See <code>Mock#verify</code> for mock object verification
   *  details.
   **/

  /**
   * Receiver#reset() -> Boolean
   *
   *  Resets the Receiver instance internal state machine, and mock
   *  instances that comprise it's interface. Also resets any properties
   *  (set by <code>Mock.property()</code>) to their original value (in
   *  case of mutation) during the exercise phase.
   *
   *  See Mock#property for details on resetting mock function objects.
   **/

   /**
    * Receiver#excise() -> Boolean | Error
    *
    *  Utility method to 'excise' a Mock object interface from itself, to
    *  reduce the chance of errors generated by interactions and
    *  manipulations of the Mock object on behalf collaborator objects
    *  due to existence of the Mock object API.
    *
    *  For example if a controller were to blindly iterate over the keys
    *  of a Mock instance, even with a <code>hasOwnProperty</code> check,
    *  both the mocked interface methods/properties, and the Mock instance
    *  API will be accessible and/or operated upon.
    *
    *  Most often this will not cause issues, but if a true representation
    *  of a collaborator object is required sans extraneous members, then
    *  this method will prune the Mock object interface from the instance.
    *
    *  If the instance needs further augmentation, or simply verification
    *  and resetting, developers can either use
    *  <code>QMock.utils.verify</code>, <code>QMock.utils.reset</code>
    *  static methods, or any method on <code>Mock.prototype</code> while
    *  using <code>.call()</code> to set the execution context to the mock
    *  instance.
    *
    *  #### Example
    *
    *  <pre><code>var mock = new Mock;
    *
    *  // Setup
    *  mock.calls(1);
    *
    *  mock.excise();
    *
    *  // Augmention 'post-excision'
    *  QMock.Mock.prototype.calls(mock, 2)
    *
    *  // Check expectation updated
    *  mock._getState()._minCalls === 2 // true;
    *  </code></pre>
    **/

    // Privileged references for debugging

    /**
     * Receiver#__getExceptions() -> Array
     *
     *  Returns an array of exception objects, used for debugging when
     *  <code>Mock.verify()</code> returns <code>false</code> in 'fail slow'
     *  test runner setups (see Config section).
     **/

    /**
     * Receiver#__getState() -> Object (Mock instance state machine)
     *
     *  Utility method for retrieving the internal state of a mock object
     *  for debugging and inspection
     **/

  /**
   * == Mock ==
   *  #### TODO
   *
   *  # Improve clarity of chaining declaration syntax
   *  
   *  # Public method unit tests (aka verify/reset), with excised mock
   *  # Best practice to look for parent id's if set for errors
   *  # Methodization of Mock interface on public Mock constructor
   *
   **/

  /** section: Mock
   * class Mock < Receiver
   *
   *  // TODO
   *  Chips
   **/

  /* [Private]
   * new Expectation( options )
   *  - options (Map): Descriptor for Expectation object, can contain custom
   *  properties (retrieved by <code>QMock.test()</code>).
   **/

  /**
   * new Mock( desc [, bool] )
   *  - desc (Map): Hash of Mock expectations mapped to Mock object
   *  interface.
   *  - bool (Boolean) _optional_: Flag whether Mock is a function
   *  or an object. N.b. Functions are also receivers (think jQuery).
   *  The default for QMock is <code>true</code>.
   *
   *  Constructor for mock receiver, methods and properties. The returned
   *  object implements either the Receiver, or Mock interface
   *
   *  _Note_: Can be called with or without the <code>new</code> keyword
   *
   *  _Note: If using Mock descriptor mappings for Mock construction
   *  (*recommended!*), then QMock will automatically detect the type (method|
   *  namespace|stub) of property you are setting based on the property value
   *  (be that a top-level, or nested property). Therefore it is best to
   *  avoid using <code>property</code> or <code>namespace</code> as keys in
   *  a descriptor, as this is both cumbersome, and limits their use to a
   *  single instance per mock object._
   *
   *  #### Example
   *
   *  <pre><code>// Via API
   *  var ninja = new Mock();
   *
   *  ninja.method('foo').returns('bar');
   *
   *  // Via descriptor mapping
   *  mock = new Mock({
   *    // method
   *    "foo": {
   *      "id"      : "Descriptor / Identifier"
   *      "accepts" : "bar",
   *      "receives": {"accepts": "foo", fixture: "stub", returns: "bar"}
   *      "returns" : "baz",
   *      "required": 1,
   *      "async"   : true
   *      "overload": true,
   *      "fixture" : "response",
   *      "chain"   : true // arg not used, readability only
   *      "calls"   : 1
   *      // Nested namesapce on 'foo'.
   *      "baz"     : {},
   *      // Single use alternative
   *      "namespace" : ["baz", {
   *        // descriptor object
   *      }],
   *      // Nested property on 'foo'
   *      "key"     : "value"
   *      // Single use alternative
   *      "property": ["key", "value"]
   *    },
   *    // property
   *    "bar": {
   *      "value": "stub"
   *    }
   *  });
   *  </code></pre>
   **/

    /**
     * Mock#id( identifier ) -> Mock
     *  - identifier (String): ID of the mock object
     *
     *  Identifier is used to create more meaningful error messages. By
     *  default it is _"anonymous"_, or the method name (assigned by
     *  <code>Mock.method()</code>).
     *
     *  #### Example
     *
     *  <pre><code>// Without setting the id
     *  var $ = new Mock;
     *  $.method('foo'); // just says function 'foo' in error message
     *  // With id
     *  $.foo.id('$.foo'); // Will now output '$.foo' in error message
     *  </code></pre>
     **/
     
    /**
     * Mock#accepts( parameters ) -> Mock
     *  - parameters (Object...n): Parameter list which mocked method is
     *  expecting.
     *
     *  Method is used to set a single expected parameter list of _n_ length
     *  for a mock object. During verification this is tested against the
     *  actual <code>presentation</code> made to a mock object interface.
     *
     *  When called multiple times on a mock object the last expectation
     *  takes precedent in relation to the number of required arguments. If
     *  multiple expectations are required see the
     *  <code>Mock.receives</code> method.
     *
     *  #### Example
     *
     *  <pre><code>Mock.method("foo").accepts("bar", "baz");</code></pre>
     **/

    /**
     * Mock#receives( expectations ) -> Mock
     *  - expectations (Expectation...n): Expectation object format is:
     *  <pre><code>{accepts: [ parameters ], returns: value, fixture: [ values ]}
     *  </code></pre>
     *
     *  Where the <code>.returns</code> & <code>.fixture</code> properties are
     *  _optional_. For more info on these properties see
     *  <code>Mock.returns</code> and <code>Mock.fixture</code> resepctively.
     *
     *  TODO: Document Expectation interface, and rules of required parameters
     *
     *  Method can be overloaded with as many expectations as required.
     *  During verification each actual <code>presentation</code> made to a
     *  mock object interface is tested against all expectations for a match.
     *
     *  #### Example
     *
     *  <pre><code>Mock.method("foo").receives({
     *    "accepts": ["bar", callback],
     *    "returns": "baz",
     *    "fixture": "stub"
     *  },{
     *    "accepts": "foo"
     *  });</code></pre>
     **/

    /**
     * Mock#returns( obj ) -> Mock
     *  - obj (Object): Object mock object to return
     *
     *  _Note_: This return value simply overrides the default of
     *  <code>undefined</code>. It does not correlate with any particular
     *  parameter expectations. See <code>Mock.interface</code> to bind
     *  return values to an expected parameter list (a
     *  <code>presentation</code>).
     *
     *  By default mock objects return <code>undefined</code> as per ECMA
     *  specification.
     *
     *  #### Example
     *
     *  <pre><code>Mock.method("foo").accepts('bar').returns('baz');</code></pre>
     **/

    /**
     * Mock#required( num ) -> Mock
     *  - num (Number): Number of required parameters
     *
     *  A mock object interface can accept parameters, which can be either
     *  required or optional. By default the number of required parameters
     *  is set by <code>Mock.accepts</code> to the length of the expected
     *  parameter list, but <code>Mock.required</code> can be used to override
     *  this in the case where some parameters are optional.
     *
     *  It is used in conjunction with <code>Mock.overload()</code> to set
     *  parameter expectations on a mock object interface.
     *
     *  #### Example
     *
     *  <pre><code>// All parameters optional, overloading is set to true (by default)
     *  Mock.method('foo').accepts('bar', 'baz').required(0);</code></pre>
     *
     *  Verification of presentations to interface will allow 0, 1, or 2
     *  parameters to be passed (though will still test type/value)
     *
     *  _Note_: In the above example, if method overloading has been set to
     *  false then the verify phase would *only* allow presentations of ZERO
     *  parameters to the mock object interface.
     **/

    /**
     * Mock#overload( bool ) -> Mock
     *  - bool (Boolean): Boolean flag to allow method overloading
     *
     *  This flag determines whether the required number of parameters is a
     *  strict expectation or not.
     *
     *    * If overloading is set to <code>true</code> (default setting) then
     *  the verify phase will pass presentations to the mock object interface
     *  with _at least_ the required number of parameters.
     *    * If overloading is set to <code>false</code> then the verify phase
     *  will only pass presentations to the mock object interface of _exactly_
     *  the required number of parameters.
     *
     *  #### Example
     *
     *  <pre><code>Mock.method('foo').accepts('bar', 'baz').overload(false);</code></pre>
     **/

    /**
     * Mock#fixture() -> Mock
     *  - fixture (Array | Object): Array of values, or single Object, which 
     *  is passed as arguments to a callback function set on a mock object
     *  parameter list expectation
     *
     *  Method allows developer to declare stubbed fixtures (e.g. a web 
     *  service response or DOM elements) to pass to callback functions 
     *  defined passed to the mock object interface in an exercise phase.
     *
     *  This is most commonly done to test asynchronous operations or event
     *  callbacks.
     *
     *  ### Examples
     *  <pre>
     *  // Invoked by the mock object during exercise phase
     *  // Stubbed fixture being passed in at time of invocation
     *  function callback ( str ) { console.log( str ); }
     *
     *  // Single params
     *  Mock.method('foo').accepts(callback).fixture('stub');
     *
     *  // Multiple params
     *  Mock.method('foo').accepts(callback).fixture(['stub', 'another stub']);
     *  </pre>
     **/

    /**
     * Mock#async( bool ) -> Mock
     *  - bool (Boolean): Boolean flag indicating whether callbacks are
     *  executed asynchronously (even with a delay of 0ms - queued on thread)
     *  or synchronously (blocking operation).
     *
     *  Functions can be passed for a variety of reasons, most commonly as
     *  callbacks for Ajax transactions, but also as references in closures
     *  (binding/currying), or as mutators that enact on data structures
     *  ( e.g. arrays and <code>Array.filter()</code>).
     *
     *  Additionally Ajax calls can also be made synchronously (though rarely
     *  done), thus a mock collaborator object should be configurable as to
     *  replicate the behaviour of a real callaborator as closely as possible
     **/

    /**
     * Mock#chain() -> Mock
     *
     *  Tells the mocked method to return the receiver object it is bound
     *  to enable cascading (chained) invocations during the exercise phase.
     *
     *  #### Example
     *
     *  <pre><code>var $ = new Mock;
     *  $.method('foo')
     *    .chain()
     *    .end()
     *  .method('bar');
     *
     *  // Exercise
     *  $.foo().bar();
     *  </code></pre>
     *
     *  _Note_: Can be overwritten if <code>Mock.returns</code> is used
     *  after in Mock declaration (or better, in conjunction to override
     *  it with <code>Mock.interface</code> for specific use cases)
     **/

    /** alias of: Receiver#verify
     * Mock#verify( [raise] ) -> Boolean
     *
     *  Tests actual mock interaction with expected interaction on mock
     *  object and any associated mock objects. Happens in the following
     *  order:
     *
     *    * Verify number of invocations
     *    * Verify number of parameters passed to interface
     *    * Verify all sets of parameters passed to interface
     *
     *  Method will bail as any point the verification is false (fail fast),
     *  and return <code>false</code>.
     *
     *  It will also throw an error if _optional_ <code>raise</code>
     *  parameter is passed.
     *
     *  See <code>Receiver#verify</code> for receiver object verification
     *  details.
     **/

    /**
     * Mock#calls( min [, max = null] ) -> Mock
     *  - min (Number): Minimum number of times mock object should be
     *  invoked. If max parameter not passed then number becomes a 'strict'
     *  invocation expectation (even zero). Default is <code>null</code>.
     *  - max (Number) _optional_: Maximum number of times mocked method
     *  should be called. If want 'at least _N_' then just pass Infinity.
     *  Default is <code>null</code>
     *
     *  This method mainly used to set invocation expectations on
     *  constructors / receiver objects, as conventional usage for mock
     *  methods is to pass parameters to <code>Mock.method()</code>.
     *
     *  However, <code>Mock.calls</code> can be called on an instance of
     *  <code>Mock</code>.
     *
     *  #### Example
     *
     *  <pre><code>// Set expected calls on mock constructor / receiver
     *  Mock.calls(1,5);
     *
     *  // Set calls on mockmethod
     *  Mock.method('foo').calls(1,5);
     *  </code></pre>
     **/

    /**
     * Mock#end() -> Mock
     *
     *  Utility method to end a mock method expectation declaration, or
     *  retrieve the receiver object a mock object is bound to. In other
     *  words it sets the receiver object context for setting new methods,
     *  properties, or namespaces on mock interfaces. It should also be used
     *  as the last item in a mock declaration cascading invocation chain (or
     *  rather wherever the last method is set).
     *
     *  Why? Since functional mocks can also act as receivers / namespaces in
     *  their own right, it allows more fine-grained control over what object
     *  a mock is actually set upon, especially when objects have deep(ish)
     *  hierarchies.
     *
     *  The common use case when setting mocks via cascading invocation is
     *  to set new member mocks on the _same_ receiver, so
     *  <code>mock.end()</code> *must* be used after expectations for a mock
     *  at the same level have been set. This means subsequent mock
     *  declarations are set within the same receiver object context.
     *
     *  Without calling <code>Mock.end()</code> then subsequent mocks are
     *  set on the current mock, and are thus nested at a deeper level.
     *
     *  For this reason it might be less work to set your mocks up by passing
     *  the mock constructor a 'property mapping' (see main Mock docs), and
     *  let the constructor handle the work for you.
     *
     *  _Please note calling <code>Mock.end()</code> does not mean a mock
     *  object cannot be further augmented/manipulated (that would be
     *  <code>Mock.excise()</code>)_.
     *
     *  For the jQuery-conversant, the method acts in part like the
     *  <code>$("..").end()</code> method, which is used to restore the
     *  execution context to a given jQuery 'wrapped set' (thanks Cody!) (as
     *  well as it's original state), post-manipulation (via
     *  $.find()/$.filter()).
     *
     *  #### Example
     *
     *  <pre><code>// Declare nested methods...
     *  var mock = new Mock;
     *  mock.method('foo').method("bar");
     *
     *  // Looks like...
     *  mock = {
     *    foo: { // foo is also a function (functions are first-class citizens too!)
     *      bar: function () {}
     *    }
     *  }
     *
     *  // Declare methods on equal level
     *  // Note last call *required*!! Else mock set to 'bar' mock, not it's
     *  // receiver.
     *  mock.method('foo').end().method("bar").end();
     *
     *  // Looks like...
     *  mock = {
     *    foo: function () {},
     *    bar: function () {}
     *  }
     *  </code></pre>
     **/

    /** alias of: Receiver#reset
     * Mock#reset() -> Mock
     *
     *  Resets the internal state machine of a mock instance.
     *
     *  See <code>Receiver#reset()</code> for details on resetting Receiver
     *  mock objects.
     **/

    /** alias of: Mock#expects, deprecated
     * Mock#andExpects( [min][, max] ) -> Mock
     **/

    /** deprecated
     * Mock#atLeast( num ) -> Mock
     *  - num (Number): Number of times mock object should _at least_ be
     *  invoked.
     *
     *  Utility method (well, syntactic sugar) for setting up invocation
     *  expectations of 'at least _n_ invocations'.
     *
     *  Recommended to use <code>Mock.method()</code> or
     *  <code>Mock.calls()</code> instead.
     **/

    /** deprecated
     * Mock#noMoreThan( num ) -> Mock
     *  - num (Number):
     *
     *  Utility method (well, syntactic sugar) for setting up invocation
     *  expectations of 'no more than _n_ invocations'.
     *
     *  Recommended to use <code>Mock.method()</code> or
     *  <code>Mock.calls()</code> instead.
     **/

    /** alias of: Receiver#excise
     * Mock#excise() -> Object
     **/

    // Inherited methods from Receiver - docs

    /** alias of: Receiver#property
     * Mock#property( prop, value ) -> Receiver | Mock
     **/

    /** alias of: Receiver#namespace
     * Mock#namespace( id, map ) -> new Receiver
     **/

    /** alias of: Receiver#method
     * Mock#method( identifier, min, max) -> new Mock
     **/

    /** alias of: Receiver#__getState
     * Mock#__getState() -> Object (Mock instance State machine)
     **/

    /** alias of: Receiver#__getExceptions
     * Mock#__getExceptions() -> Array (of exception objects)
     **/

  // SETUP PHASE Functions
  // Mainly factory methods that handle instantiation and bindings

  /* [Private]
   * Mock.create( state, fn ) -> Function
   *  state (Mock) _optional_: Mock instance to bind recorder to.
   *  fn (Function) _optional_: Function to Spy on.
   *
   *  Factory method to create a stub function to be attached to a receiver
   *  object, bound to a passed mock instance. Upon invocation within an SUT
   *  the mock state will be mutated, callbacks (sync/async) will be applied
   *  and any corresponding set return values will be retrieved and output.
   *
   *  If an optional function object is passed the recorder will instead
   *  exercise that, but otherwise continue it's normal operation, thus
   *  'spying' on the function interaction.
   **/

  /** section: QMock
   *  QMock.Spy() -> Spy
   *
   *  NOTE: This is exposed as <code>Spy()</code> in the containing scope
   *  as a convenience. Please see the example code below.
   *
   *  The Spy constructor/method allows a developer to record interactions
   *  with a given function, without having to completely stub out it's
   *  behaviour. This is a halfway-house solution for ensuring your
   *  collaborator objects are interacting correctly, meaning that during
   *  an exercise phase, the SUT will still be interacting with *real*
   *  functions/constructors.
   *
   *  Spy objects/functions implement the Mock interface, though since the
   *  Spy actually invokes (exercises) a real function, then any declared
   *  return behaviours are made redunadant. That said, the
   *  <code>Mock.verify()</code> method still tests the interface
   *  constraints, i.e. the number of times an espied function was called,
   *  as well as the arguments received against expectations.
   *
   *  While this is a convenient shortcut to setting up glass-box testing
   *  for any domain/business logic orientated invocation, it should be
   *  noted that the resulting test-suite will be less effective, as the
   *  _UNmocked_ collaborator object constitutes a point of failure (as )
   *  it is an unknown.
   *
   *  For more confidence in your tests, be sure to fully mock out
   *  collaborators with _known_ behaviour, to eliminate them as potential
   *  sources of problems.
   *
   *  #### Example
   *
   *  <pre><code>// SUT
   *  var bar = false;
   *
   *  function foo ( bool ) {
   *    bar = bool;
   *  }
   *
   *  // Setup
   *  foo = Spy(foo).calls(1).accepts(true); // expect one call & true
   *
   *  // Exercise
   *  foo( true );
   *
   *  // verify
   *  bar === true // true
   *  foo.verify() // true
   *
   *  foo.reset();
   *  foo( false );
   *  foo.verify() // false - wrong parameter
   *
   *  foo.reset();
   *  foo(true);
   *  foo(true);
   *  foo.verify() // false - too many calls
   *  </code></pre>
   **/

  /* [Private]
   *
   * bootstrap( mock, desc ) -> Boolean
   *  - mock (Mock): Mock instance to augment
   *  - desc (Map): Hash of Mock expectations mapped to Mock object
   *  API.
   *
   *  Helper method which interprets a JSON formatted map of a desired mock
   *  object interface, and augments a given Mock instance by performing the
   *  set-up cascading invocation for you (i.e. the bootstrap phase).
   *
   *  #### Example
   *
   *  <pre><code>new Mock({
   *    // method
   *    "foo": {
   *      "id"      : "Descriptor / Identifier"
   *      "accepts" : "bar",
   *      "receives": {"accepts": "foo", fixture: "stub", returns: "bar"}
   *      "returns" : "baz",
   *      "required": 1,
   *      "async"   : true
   *      "overload": true,
   *      "fixture" : "response",
   *      "chain"   : true // arg not used, readability only
   *      "calls"   : 1
   *      // Nested namesapce on 'foo'.
   *      "baz"     : {},
   *      // Single use alternative
   *      "namespace" : ["baz", {
   *        // descriptor object
   *      }],
   *      // Nested property on 'foo'
   *      "key"     : "value"
   *      // Single use alternative
   *      "property": ["key", "value"]
   *    },
   *    // property
   *    "bar": {
   *      "value": "stub"
   *    }
   *  })
   *  </code></pre>
   *
   *  _See integration tests or wiki for more in-depth patterns_.
   **/

  /* [Private]
   * new ErrorHandler( mock ) -> Function
   *  - mock ( Mock ): Mock instance to associate error with
   **/

  // EXERCISE PHASE functions

  /* [Private]
   *
   * exerciseMock( mock ) -> Function
   *  - mock (Mock): mock instance to mutate
   *  - presentation (Array): Array(-like) object containing parameters
   *  passed to associated proxy recorder function.
   *
   *  Utility for recording inputs to a given mock and mutating it's internal
   *  state. Instance state is mutated when a stubbed function is invoked as
   *  part of a 'system under test' (SUT) exercise phase.
   *
   *  Has to use <code>this</code> as arguments to recorder consititute a
   *  'presentation' to the mocked member / object interface.
   *
   *  _Returns_: The mapped return value for the presentation made to the
   *  stub interface, or the default mock return (at instantiation is
   *  <code>undefined</code>).
   **/

  /* [Private]
   *
   * exerciseCallbacks(mock, method) -> Boolean
   *  - mock (Mock): mock instance to exercise callbacks on
   *  - presentation (Array): Presentation made / to be made to
   *  mocked method
   *
   *  If the presentation made to the mock object interface contains a
   *  function object, then the presentation is tested for a matching 
   *  <code>fixture</code> expectation on the mocked method instance.
   *
   *  If a match is found then the canned fixture parameters are passed to 
   *  what is assumed to be callback and it is then invoked.
   *
   *  This is mostly used to simulate ajax or event callbacks during an
   *  exercise phase.
   **/

  /* [Private]
   *
   * exerciseReturn(presentation, method) -> Object | undefined
   *  - mock (Mock): mock instance to exercise return on
   *  - presentation (Array): Presentation made / to be made to mocked method
   *
   *  Function tests presentation against mock object interface expectations.
   *
   *  If match found then lookup is made for a corresponding 'returns'
   *  property.
   *
   *  If not found then catch-all 'return' value is returned, which defaults
   *  to <code>undefined</code> (as per spec).
   **/

  // TODO: Either abstract this out or simplify

  /* [Private]
   *
   * createException( actual, expected, exceptionType, identifier ) -> Hash
   *  - actual (Object): The presentation received by the mock interface
   *  - expected (Object): Expectations set on the mock object
   *  - exceptionType (String): Exception type
   *  - identifier (String): Identifier for mock instance
   *
   * _returns_: Hash with pertinent information regarding the error caused.
   **/

  // VERIFY PHASE functions

  /* [Private]
   * QMock.verifyInvocations( mock ) -> Boolean
   * - mock (Mock): mock instance to test
   *
   *  Evaluates if amount of times a mock object (method/constructor) has been
   *  invoked matches expectations
   **/

  /* [Private]
   * QMock.verifyOverloading( mock ) -> Boolean
   *  - mock (Mock): Mock object to test against
   *  - Presentation (Array): Presentation to test
   *  - raise (Function) _optional_: Function
   *
   *  Evaluates if number of parameters passed to mock object falls
   *  below / exceeeds expectations
   **/

  /* [Private]
   * QMock.verifyPresentation( mock, presentation ) -> Boolean
   *  - mock (Mock): Mock object to test against
   *  - presentation (Array): Presentation made / to be made to mock object
   *  interface
   *
   *  Evaluate a single presentation against all mock object interface
   *  expectations. Single match equals true.
   **/

  /* [Private]
   * QMock.verifyInterface( mock [, raise] ) -> Boolean
   *  - mock (Mock): mock object to test
   *  - raise (Function) _optional_: Function to handle false comparison
   *  results
   *
   *  Evaluate *all* presentations made to mock object interface against all
   *  mock interface expectations.
   *
   *  Each presentation must match an expectation.
   *
   *  If no match and optional error handler passed then error raised.
   **/

  // PUBLIC API

  /**
   * QMock
   **/

    /** alias of: Mock
     * QMock.Mock() -> mock receiver / constructor / method / property object
     **/

    /**
     * QMock.utils
     *  Utility methods for use on 'excised' mock instances or testing.
     **/

      /**
       * QMock.utils.verify( receiver [, raise] ) -> Boolean | Exception
       *  - receiver (Mock): mock / receiver object to test
       *  - raise (Function) _optional_: Function to handle false comparison
       *  results
       *
       *  Verifies the receiver object (the parent mock object) first, then
       *  individual members (both methods and nested namespaces).
       *
       *  Only passes if whole object tree passes, else throws exception
       *  or returns <code>false</code> depending on mode (fail slow/fast).
       **/