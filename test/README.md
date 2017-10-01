# InterCraftLauncher Tests
Tests are powered by [test](https://www.npmjs.com/package/test) unit test runner.

## Setup
Before tests can be executed, you need to setup your environment configuration. Copy `test/env.example.json` to `test/env.json`, and fill out the information. This file is not tracked by Git.

## Run Tests
To run the tests, execute the following command from the root project directory:
```
npm run test
```
The results will be displayed at the end of the tests.

## Create a Test
Tests are located in `test/tests`. Create your new test file in this directory, and add a require statement for your test file to the list of tests in `test/tests.js`

Here is an example test file to get started. This will test the `find_java` utility.
```javascript
// Require `test` unit test runner
const test = require("test");

// Require the module to test
const findJava = require("../../src/utils/find_java");

// Create the test, identified by the key "test <description>"
// If `done` is not in the function arguments, the test will finish upon return.
// Otherwise the test will finish once `done` has been invoked
// This can be used to test asynchronous functions, such as the one below
exports["test Find Java"] = function(assert, done) {

	// Execute the function to test.
    // This function is asynchronous, so it takes a callback
	findJava((err, result) => {
    
    	// Check the result, and display a success message
		assert.equal(err, null, "Java path: " + result);
        
        // Finish the tests
		done();
	});
};
```
More documentation can be located on [test's npm](https://www.npmjs.com/package/test) page