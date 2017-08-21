const data = require("./data/MOCK_DATA");

function getUsers() {
	return data;
}

function getByID(id) {
	const foundUser = data.find(user => Number(id) === user.id);
	return foundUser;
}

function getByName(uName) {
	const foundUser = data.find(user => uName === user.user_name);
	console.log(foundUser);
	return foundUser;
}

module.exports = {
	getUsers: getUsers,
	getByID: getByID,
	getByName: getByName
};
