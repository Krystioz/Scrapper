/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
	let xPrior = x + "";
	let reversed = x.toString().split("").reverse().join("");
	parseInt(xPrior);
	parseInt(reversed);
	if (xPrior == reversed) {
		return true;
	} else {
		return false;
	}
};

isPalindrome(11);
