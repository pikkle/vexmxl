import * as registerSuite from "intern!object";
import * as assert from "intern/chai!assert";

registerSuite({
	"name": "Test Intern",
	"default data"() {
		assert.strictEqual(1, 1, "lol");
	},
});
