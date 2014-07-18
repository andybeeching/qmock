(function() {

    var extensions = {

        assert: function assert (a, msg) {
            YAHOO.util.Assert.isTrue(a, msg);
        },
        assertEquals: function assertEquals (actual, expected, message) {
            YAHOO.util.Assert.areSame(actual, expected, message);
        },
        fail: function fail (msg) {
			YAHOO.util.Assert.isTrue(false, message);
        }

    };

    for(var fn in extensions) {
        this[fn] = this[fn] || extensions[fn];// this === global scope
    }

})();