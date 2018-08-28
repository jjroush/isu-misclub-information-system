const isValidInput = value => Boolean(value && value.trim());

const isValidId = Id => {
	if (!parseInt(Id, 10)) {
		throw new Error(`Event ID: ${Id} is not numeric`);
	}
};

module.exports = {
	isValidInput,
	isValidId
};