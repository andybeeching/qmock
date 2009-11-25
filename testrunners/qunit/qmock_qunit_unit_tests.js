module("QMock");

/**
 * All tests follow this simple process:
 * 
 *  1. Setup: Instantiate mocks and set expected interactions upon them. Sometimes located in the 'setup' phase of the testrunner before each test block.
 *  2. Exercise: Execute the relevant collaborator code to interact with the mock object.
 *  3. Verify: Call the verify method on each mock object to establish if it was interacted with correctly.
 *  4. Reset: [Optional] Call reset method on the mock to return it's internal state to the end of the setup phase. Sometimes located in the 'teardown' phase of the testrunner after each test phase.
 *
 */

test("mock with single parameterless method (explicit execution call total, no return value)", function () {
	
	expect(10);
    
	var ninja = new Mock();
    
	// Test invalid method naming
	try {
		ninja.expects(1).method('expects');
		fail("mock should detect bad method name 'expects'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidMethodNameException", "error type should be InvalidMethodNameException");
	}
	
	ninja = new Mock(); // Can't call reset as mock is broken, must re-instantiate mock instance.
	
	ninja
		.expects(1)
			.method('swing');
    
	// Test Bad Exercise phase - no method call
    try {
        ninja.verify();
        fail("verify() should throw exception when swing not called");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }

	ninja.reset();
	
	// Too many method calls
	ninja.swing();
    ninja.swing();

	try {
        ninja.verify();
        fail("verify() should throw exception when swing called too many times");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
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


test("mock with single parameterless method (arbitrary execution call range, no return value)", function() {
	
	expect(12)
	
	var ninja = new Mock();
	
	ninja
		.expects(1, 3)
			.method('swing');
	
	// Bad Exercise - no swings
	try {
        ninja.verify();
        fail("verify() should throw exception when swing not called");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
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
        fail("verify() should throw exception when swing called too many times");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
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
        fail("verify() should throw exception when swing out of defined call execution range");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
	
});

test("mock with multiple paramterless methods", function () {
   
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
        fail("verify() should throw exception when no methods called");
    } catch (e) {
        equals(e.length, 3, "verify() should return an array of 3 errors");
        equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
    ninja.reset();

    ninja.swing();
    ninja.run();
    ninja.block();

	// Good Exercise
    
	ok(ninja.verify(), "verify() should return true once swing, run and block called");

});

test("mock with stubbed properties", function () {
	
	expect(6);
	
	var ninja = new Mock();
    
	// Test invalid property naming
	try {
		ninja.expects(1).property('expects');
		fail("mock should detect bad property name 'expects'");
	} catch (e) {
		equals(e.length, 1, "array of 1 error should be thrown");
		equals(e[0].type, "InvalidPropertyNameException", "error type should be InvalidPropertyNameException");
	}
	
	var ninja = new Mock();
	
	ninja
		.expects()
			.property("rank")
			.withValue("apprentice");
		
	ok( (ninja.rank === "apprentice") , "ninja mock object should have a property called rank with correct value" );
	
	ninja = new Mock();
	
	ninja
		.expects()
			.property("rank")
			.withValue("apprentice")
		.andExpects()
			.property("master")
			.withValue("The Chrome");
		
	ok( ( (ninja.rank === "apprentice") && (ninja.master === "The Chrome") ) , "ninja mock object should have a two properties set correctly")
	
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
	
});

test("mock with no parameters, return values", function () {
    
	expect(15);
    
    var mock = new Mock();
    
    mock
		.expects(1)
			.method('getNumericValue').andReturn(10)
		.andExpects(1)
			.method('getStringValue').andReturn('data')
		.andExpects(1)
			.method('getArrayValue').andReturn( [ 1, 2, 3] )
		.andExpects(1)
			.method('getFunctionValue').andReturn( function () { return 'function'; } )
		.andExpects(1)
			.method('getObjectValue').andReturn( { id: 5, value: 'value' } )
		.andExpects(1)
			.method('getNullValue').andReturn(null)
		.andExpects(1)
			.method('getUndefinedValue').andReturn(undefined)
		.andExpects(1)
			.method('getEmptyStringValue').andReturn("")
		.andExpects(1)
			.method('getZeroValue').andReturn(0)
		.andExpects(1)
			.method('getTrueValue').andReturn(true)
		.andExpects(1)
			.method('getFalseValue').andReturn(false)
		.andExpects(1)
			.method('getEmptyArrayValue').andReturn([ ])
		.andExpects(1)
			.method('getEmptyObjectValue').andReturn({ });
			
		
	equals(mock.getNumericValue(), 10, "getNumericValue() should return 10");
    equals(mock.getStringValue(), 'data', "getStringValue() should return 'data'");
    ok(Mock._assertArray(mock.getArrayValue(), [ 1, 2, 3 ]), "getArrayValue() should return [ 1, 2, 3 ]");
    equals(mock.getFunctionValue()(), 'function', "getFunctionValue() when invoked should return 'function'");
	
	// Use exposed qMock's exposed assertArray & assertObject helper methods as check contents of array/object, rather than strict checking instance like QUnit.

    ok(Mock._assertObject(mock.getObjectValue(), { id: 5, value: 'value' }), "getObjectValue() should return object");
    equals(mock.getNullValue(), null, "getNullValue() should return null");
    equals(mock.getUndefinedValue(), undefined, "getUndefinedValue() should return undefined");
    equals(mock.getEmptyStringValue(), "", "getEmptyStringValue() should return ''");
    equals(mock.getZeroValue(), 0, "getZeroValue() should return 0");
    equals(mock.getTrueValue(), true, "getTrueValue() should return true");
    equals(mock.getFalseValue(), false, "getFalseValue() should return false");
    ok(Mock._assertArray(mock.getEmptyArrayValue(), [ ]), "getEmptyArrayValue() should return [ ]");
    ok(Mock._assertObject(mock.getEmptyObjectValue(), { }), "getEmptyObjectValue() should return { }");
		
    ok(mock.verify(), "verify() should be true");

	mock = new Mock();
	mock
		.expects(1)
			.method('andReturnTest')
			.andReturn('return')
		.andExpects(1)
			.method('isMethod')
			.withArguments(Variable);
			
	mock.andReturnTest()
	mock.isMethod("test");
	
    ok(mock.verify(), "verify() should be true");		

});

test("mock with primitive argument types", function () {
    
	expect(5);
    
    var ninja = new Mock();
	ninja
		.expects(1)
			.method('swing')
			.withArguments(1);
			
	// Test invalid argument type
			
	ninja.swing("one");
			
	try {
	       ninja.verify();	
	       fail("verify() should throw exception when swing called with incorrect argument type");
	   } catch (e) {	
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
	   }
    
	ninja.reset();
			
	// Good Exercise
			
	ninja.swing(1);
			
	ok( ninja.verify(), "verify() should pass after swing was called once with number primitive type" );
	
	var samurai = new Mock();
	
	samurai
		.expects(1)
			.method('run')
			.withArguments('fast');
			
	samurai.run('fast')
			
	ok( samurai.verify(), "verify() should pass after run was called once with string primitive type" );
	
	var wizard = new Mock();
	
	wizard
		.expects(1)
			.method('fireball')
			.withArguments(true);
			
	wizard.fireball(true);
			
	ok( wizard.verify(), "verify() should pass after fireball was called once with boolean primitive type" );

});

test("mock with falsey (null & undefined) argument types", function () {
    
	expect(6);
    
    var ninja = new Mock();

	ninja
		.expects(1)
			.method('giveUp')
			.withArguments(null);
			
	// Test invalid argument type
			
	ninja.giveUp("ok");
			
	try {
	       ninja.verify();
	       fail("verify() should throw exception when swing called with incorrect argument type");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
	   }
    
	ninja.reset();
			
	// Good Exercise
			
	ninja.giveUp(null);
			
	ok( ninja.verify(), "verify() should pass after giveUp was called once with falsey type" );
	
	var samurai = new Mock();
	
	samurai
		.expects(1)
			.method('fear')
			.withArguments(undefined);
			
	samurai.fear('everything');
			
	try {
	       samurai.verify();
	       fail("verify() should throw exception when fear called with incorrect argument type");
	   } catch (e) {
	       equals(e.length, 1, "verify() should return an array of 1 errors");
	       equals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
	   }
	
	samurai.reset();
	
	samurai.fear(undefined);
	
	ok( samurai.verify(), "verify() should pass after giveUp was called once with falsey type" );

});

test("mock with composite argument types: object (literal)", function () {
    
	expect(10);
    
    var ninja = new Mock();
    
    ninja.expects(1)
		.method('describe')
		.withArguments({
			 name: "Jackie",
			 surname: "Chan",
			 age: 46
		});
    
    try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
	ninja.reset();
	
	// Bad Exercise

	ninja.describe('Jet Li');
    
    try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentException", "verify()[0] error type should be IncorrectArgumentsException");
    }

	ninja.reset();
	
	// Bad exercise - test object comparison
	
	ninja.describe({
		 name: "Jet",
		 surname: "Li",
		 age: 37
	});
	
	// Good Exercise
	
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
			.withArguments({
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
			.andReturn(-30);

	// Exercise - bad (different marshal arts)
	
	samurai.describe({
		name: "Jet Li",
		age: 37,
		'marshal arts': ['karate', 'boxing'],
		weapon: {
			damage: '+2',
			type: 'sword'
		}				
	}); 
	
	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 error");
        equals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
        equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }

	samurai.reset();
	
	// Good Exercise
	
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

test("mock with composite argument types: array", function () {
    
	expect(8);
    
    var ninja = Mock();
    
    ninja
		.expects(1)
			.method('setSkills')
				.withArguments(['swordplay', 'kung-fu', 'stealth']);
    
	// No arg
    try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 2 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
	ninja.reset();

	// Invalid arg
	ninja.setSkills(['swordplay', 'kung-fu', 'noise']);
		
    try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentException", "verify()[0] error type should be IncorrectArgumentsException");
    }

	ninja.reset();

	// Correct Usage
	
	ninja.setSkills(['swordplay', 'kung-fu', 'stealth']);
	ok(ninja.verify(), "verify() should be true");
	
	// Nested object Literals within array
	
	var jedi = new Mock();
	
	jedi
		.expects(0, 1)
			.method('setMasters')
			.withArguments([{
				'mace windu': 'Samual L Jackson'
			},{
				'yoda': 'CGI'
			},{
				'Obi-wan Kenobi': 'Ewan McGregor'
			}]);
			
	
	// Invalid arg
	jedi.setMasters([{
		'mace windu': 'Samual L Jackson'
	},{
		'yoda': 'CGI'
	},{
		'Qui-Gon Jinn': 'Liam Neeson'
	}]);
	
    try {
        jedi.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentException", "verify()[0] error type should be IncorrectArgumentsException");
    }

	jedi.reset();

	// Correct Usage

	jedi.setMasters([{
		'mace windu': 'Samual L Jackson'
	},{
		'yoda': 'CGI'
	},{
		'Obi-wan Kenobi': 'Ewan McGregor'
	}]);
	ok(jedi.verify(), "verify() should be true");
	
});

test("mock with composite argument types: Date & RegExp", function () {
	
	expect(4)
	
	// Not sure how can compare beyond looking at constructors...
	
	var ninja = new Mock();
	
	ninja
		.expects(1)
			.method("chooseTarget")
			.withArguments("Jet Li, Bruce Lee, Chuck Norris", /Bruce Lee/);
		
	ninja.chooseTarget("Jet Li, Bruce Lee, Chuck Norris", /Bruce Lee/);
	
	ok(ninja.verify(), "verify() should be true");
	
	var samurai = new Mock();
	
	var date = new Date();
	
	samurai
		.expects(1)
			.method("timeOfFight")
			.withArguments(date);
		
		samurai.timeOfFight(new Date(1970));

	try {
        samurai.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1 , "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentException", "verify()[0] error type should be IncorrectArgumentsException");
    }

	samurai.reset();
	
	samurai.timeOfFight(date);
	
	ok(samurai.verify(), "verify() should be true");
		
});

test("mock with custom object argument types", function () {
	
	var Sword = function Sword() {},
		Shield = function Shield() {},
		katana = new Sword(),
		wooden = new Shield();
    
	expect(7)
	
	// Use to check strict argument checking
	
	var ninja = new Mock();
	
	ninja
		.expects(1)
			.method("setSword")
			.withArguments(katana);
			
	ninja.setSword(wooden);
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
    }

    ninja.reset();

	// Try with null types
	ninja.setSword(null);
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
    }

    ninja.reset();

	ninja.setSword(undefined);
			
	try {
        ninja.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
    }

    ninja.reset();
		
	ninja.setSword(katana);
	
	ok(ninja.verify(), "verify() should be true");
	
});


test("mock with pass-through argument types: Selector & Variable", function () {
	
	expect(2)
	
	// Use to check strict argument checking
	
	var ninja = new Mock();
	
	ninja
		.expects(1)
			.method("hitOpponents")
			.withArguments(Variable);
		
	ninja.hitOpponents(Variable);
	
	ok(ninja.verify(), "verify() should be true");
	
	var samurai = new Mock();
	
	samurai
		.expects(1)
			.method("findArmour")
			.withArguments(Selector);
			
	samurai.findArmour(Selector);
	
	ok(samurai.verify(), "verify() should be true");
		
});

test("mock with constructor function parameters - i.e. jQuery", function () {
    
	expect(9);
    
    var $ = Mock();
	
	$.expectsArguments("#id")
       .expects(1)
			.method('html')
            .withArguments('<span>blah</span>');
	
    $("#incorrectID").html('<span>blah</span>');
    
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {	
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "InvalidConstructorException", "verify() error type should be InvalidConstructorException");
    }
    
    $.reset();
    
    $("#id").html('<span>blah</span>');
    ok($.verify(), "verify() should be true");
    
    $.reset();
    
    $("#id").html('<span>lahlah</span>');
    
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 1, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
    }
    
    $.reset();
    
    $("#incorrectID").html('<span>lahlah</span>');
    
    try {
        $.verify();
        fail("verify() should throw two exceptions");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 errors");
        equals(e[0].type, "InvalidConstructorException", "verify() error type should be InvalidConstructorException");
        equals(e[1].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
    }

	// Mock the query of the J
	
	var jQuery = new Mock();
	
	jQuery
		.expectsArguments(".ninjas")
			.expects(1)
				.method('each')
				.withArguments(Function)
			.andExpects(3)
				.method('wrap')
				.withArguments('<div />')
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
    
    $.expectsArguments(".ninja")
        .expects(2)
			.method('run')
            .withArguments(Variable)
            .andChain()
        .expects(1)
			.method('fight')
            .withArguments('hard')
            .andChain();
            
    // Invalid constructor param
    
    $(".samarai");
     
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 3, "verify() should return an array of 1 error");
        equals(e[0].type, "InvalidConstructorException", "verify() error type should be InvalidConstructorException");
        equals(e[1].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
        equals(e[2].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
    $.reset();
    
    // No constructor param
    
    $() 
		.run('slow').fight('hard').run('again');
     
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
	//	console.error(e);
        equals(e.length, 2, "verify() should return an array of 2 error");
        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
        equals(e[1].type, "InvalidConstructorException", "verify() error type should be InvalidConstructorException");
    }
    
    $.reset();
    
    // Overloaded constructor param
    
    $('.samauri', '.wizard').run('slow').fight('hard').run('again');
     
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
		equals(e[1].type, "InvalidConstructorException", "verify() error type should be InvalidConstructorException");
    }
    
    $.reset();
            
    // Missed call to fight
    
    $(".ninja").run('at a canter');
     
    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 2 error");
        equals(e[0].type, "IncorrectNumberOfMethodCallsException", "verify() error type should be IncorrectNumberOfMethodCallsException");
    }
    
    $.reset();
    
    // correct usage:
    $(".ninja").run('slow').fight('hard').run('again');

    ok($.verify(), "verify() should be true");

	// Mock jQuery with chaining
	
	var jQuery = new Mock();
	
	jQuery
		.expectsArguments(".ninjas")
			.expects(2)
				.method('each')
				.withArguments(function() {})
				.andChain()
			.andExpects(3)
				.method('wrap')
				.withArguments('<div />')
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

test("Callbacks", function () {
    
	expect(4);
    
	var $ = new Mock();
    
    // Invalid callback
    
    $.expects(1).method('get')
        .withArguments('some/url', Function)
        .callFunctionWith('data response');

    var called = false;
    $.get('some/url');

    try {
        $.verify();
        fail("verify() should throw exception");
    } catch (e) {
        equals(e.length, 2, "verify() should return an array of 1 error");
        equals(e[0].type, "IncorrectNumberOfArgumentsException", "verify() error type should be IncorrectNumberOfArgumentsException");
        equals(e[1].type, "IncorrectArgumentException", "verify() error type should be IncorrectArgumentException");
    }
    
    $.reset();
    
    // Correct Usage

    var called = false;    

    $.get('some/url', function (data) { called = true });
    
	equals(called, true, "called should be set to true");

});

test("private Mock._assertArray method", function () {
		
	expect(31)
	
	var mock = new Mock();
	
	function Custom() {};
	
	// Bad Arguments
	
	ok(!Mock._assertArray(1, 2), "Mock._assertArray should be false");
	
	// Check element type - simple
	
	ok(Mock._assertArray([10], [10]), "Mock._assertArray should be true (number)");
	ok(Mock._assertArray([""], [""]), "Mock._assertArray should be true (empty string)");
	ok(Mock._assertArray(["string"], ["string"]), "Mock._assertArray should be true (string)");
	ok(Mock._assertArray([false], [false]), "Mock._assertArray should be true (false Boolean)");
	ok(Mock._assertArray([true], [true]), "Mock._assertArray should be true (true Boolean)");
	ok(Mock._assertArray([[]], [[]]), "Mock._assertArray should be true (empty array)");
	ok(Mock._assertArray([{}], [{}]), "Mock._assertArray should be true (empty object)");
	ok(Mock._assertArray([{test: "one"}], [{test: "one"}]), "Mock._assertArray should be true (object)");
	ok(Mock._assertArray([["nested"]], [["nested"]]), "Mock._assertArray should be true (nested arrays)");
	ok(Mock._assertArray([function() {}], [function() {}]), "Mock._assertArray should be true (function)");
	ok(Mock._assertArray([null], [null]), "Mock._assertArray should be true (null)");
	ok(Mock._assertArray([undefined], [undefined]), "Mock._assertArray should be true (undefined)");
	ok(Mock._assertArray([/re/], [/re/]), "Mock._assertArray should be true (RegExp)");
	ok(Mock._assertArray([new Date()], [new Date()]), "Mock._assertArray should be true (Date)");
	ok(Mock._assertArray([new Custom()], [new Custom()]), "Mock._assertArray should be true (Custom object)");
	ok(Mock._assertArray([0,"string", true, [], {}, function() {}, null, undefined, /re/, new Date()], [0,"string", true, [], {}, function() {}, null, undefined, /re/, new Date()]), "Mock._assertArray should be true (All types)");
	
	// Falsy 

	ok(!Mock._assertArray([10], [""]), "Mock._assertArray should be false");
	ok(!Mock._assertArray([""], [10]), "Mock._assertArray should be false");
	ok(!Mock._assertArray(["string"], ["different string"]), "Mock._assertArray should be false");
	ok(!Mock._assertArray([false], [true]), "Mock._assertArray should be false");
	ok(!Mock._assertArray([true], [false]), "Mock._assertArray should be false");
	ok(!Mock._assertArray([{test: "one"}], [{test: "two"}]), "Mock._assertArray should be false");
	ok(!Mock._assertArray([function() {}], []), "Mock._assertArray should be false");
	ok(!Mock._assertArray([null], [undefined]), "Mock._assertArray should be false");
	ok(!Mock._assertArray([undefined], ["string"]), "Mock._assertArray should be false");
	ok(!Mock._assertArray([/re/], [9]), "Mock._assertArray should be false");
	ok(!Mock._assertArray([new Date()], [new Date(1970)]), "Mock._assertArray should be false");
	ok(!Mock._assertArray([new Custom()], [new Number()]), "Mock._assertArray should be false (Custom object)");
	
	// Nested
	
	ok(Mock._assertArray([[[["test"]]]], [[[["test"]]]]), "Mock._assertArray should be true (nested array to 4 levels)");
	ok(Mock._assertArray(["one", ["two", ["three", ["four"]]]], ["one", ["two", ["three", ["four"]]]]), "Mock._assertArray should be true (nested array to 4 levels)");	
	
});

test("private Mock._assertObject method", function () {
		
	expect(30)
	
	var mock = new Mock();
	
	function Custom() {};
	
	// Check bad arguments
	
	ok(!Mock._assertObject(undefined, false), "Mock._assertObject should be false");
	
	// Check element type - simple
	
	ok(Mock._assertObject({Number: 10}, {Number: 10}), "Mock._assertObject should be true (number)");
	ok(Mock._assertObject({String: ""}, {String: ""}), "Mock._assertObject should be true (empty string)");
	ok(Mock._assertObject({String: "string"}, {String: "string"}), "Mock._assertObject should be true (string)");
	ok(Mock._assertObject({Boolean: false}, {Boolean: false}), "Mock._assertObject should be true (false Boolean)");
	ok(Mock._assertObject({Boolean: true}, {Boolean: true}), "Mock._assertObject should be true (true Boolean)");
	ok(Mock._assertObject({Array: []}, {Array: []}), "Mock._assertObject should be true (empty array)");
	ok(Mock._assertObject({Object: {}}, {Object: {}}), "Mock._assertObject should be true (empty object)");
	ok(Mock._assertObject({Object: ["one"]},{Object: ["one"]}), "Mock._assertObject should be true (object)");
	ok(Mock._assertObject({Object: {test: "one"}}, {Object: {test: "one"}}), "Mock._assertObject should be true (nested arrays)");
	ok(Mock._assertObject({Function: function() {}}, {Function: function() {}}), "Mock._assertObject should be true (function)");
	ok(Mock._assertObject({"null": null},{"null": null}), "Mock._assertObject should be true (null)");
	ok(Mock._assertObject({"undefined": undefined},{"undefined": undefined}), "Mock._assertObject should be true (undefined)");
	ok(Mock._assertObject({RegExp: /re/},{RegExp: /re/}), "Mock._assertObject should be true (RegExp)");
	ok(Mock._assertObject({Date: new Date()},{Date: new Date()}), "Mock._assertObject should be true (Date)");
	ok(Mock._assertObject({Custom: new Custom()},{Custom: new Custom()}), "Mock._assertObject should be true (Custom object)");
	ok(Mock._assertObject({Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date()}, {Number: 0,String: "string",Boolean: true,Array: [],Object: {},Function: function() {},"null": null,"undefined": undefined,RegExp: /re/,Date: new Date()}), "Mock._assertObject should be true (All types)");
	
	// Falsy 

	ok(!Mock._assertObject({Number: 10}, {Number: "string"}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({String: "string"}, {String: ""}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({String: "string"}, {String: function() {}}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({Array: []}, {Array: {}}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({Boolean: true}, {Boolean: false}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({Object: ["one"]},{Object: false}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({Function: function() {}}, {Function: false}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({"null": null},{"null": undefined}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({"undefined": undefined},{"undefined": 0}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({RegExp: /re/},{RegExp: "/re/"}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({Date: new Date()},{Date: new Date(1970)}), "Mock._assertObject should be false");
	ok(!Mock._assertObject({Custom: new Custom()},{Custom: new Date()}), "Mock._assertObject should be false (Custom object)");
	
	// Nested
	ok(Mock._assertObject({"one": {"two": {"three": {"four": "value"}}}}, {"one": {"two": {"three": {"four": "value"}}}}), "Mock._assertObject should be true (nested object literals to 4 levels)");
	
});