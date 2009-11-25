(function qUnitExtensions (_scope) {

    var extensions = {

        assert: function assert(a, msg) {
            ok(a, msg);
        },
        assertEquals: function assertEquals(actual, expected, message) {
            equals(actual, expected, message);
        },
		assertArray: function assertArray(actual, expected, message) {
			ok(Mock._assertArray(expected, actual), message)
		},
		assertObject: function assertObject(actual, expected, message) {
			ok(Mock._assertObject(expected, actual), message)
		},		
        fail: function fail(msg) {
            ok(false, msg);
        }

    };

	// Register Public API
	for (var method in extensions) {
		_scope[method] = extensions[method]
	}
        
})(window);