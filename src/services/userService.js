const userModel = require('../models/userModel');

exports.getAllUsers = async () => {
	return userModel.findAll();
};

exports.getUserById = async (id) => {
	return userModel.findById(id);
};

exports.findByEmail = async (email) => {
	return userModel.findByEmail(email);
};

exports.createUser = async (data) => {
	return userModel.create(data);
};

