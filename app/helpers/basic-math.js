import Ember from 'ember';

//
//						params[0]	params[1]	params[2]
//							1		"+"			2
//						return 3
export function basicMath(params/*, hash*/) {
	let value1 = parseFloat(params[0]);
	let value2 = parseFloat(params[2]);
	let operator = params[1];
	return {
		"+": value1 + value2,
		"-": value1 - value2,
		"*": value1 * value2,
		"/": value1 / value2,
		"%": value1 % value2,
	}[operator];
}

export default Ember.Helper.helper(basicMath);
