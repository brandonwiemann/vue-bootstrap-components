export default {

	isValidDate(date) {
		if (Object.prototype.toString.call(date) === "[object Date]") {
			if (isNaN(date.getTime())) return false;
			else return true;
		} else {
			return false;
		}
	},

}