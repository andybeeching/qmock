	// test("Mock.end() [utility] instance method", function () {

	//   expect(1);
	//   var mock = new Mock,
	//       foo  = mock.method('foo').end();

	//   ok((mock === foo), "mock.end() should return the receiver object mock");

	// });
// Browser tests
//
buster.testCase("Qmock interface", {
  "Has Mock#end utility method": function () {
    var mock = new Mock,
        foo  = mock.method('foo').end();

    assert((mock !== foo));
  }
});
