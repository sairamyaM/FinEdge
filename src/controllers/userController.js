const userService = require('../services/userService');
const crypto = require('crypto');
const jwtUtil = require('../utils/jwt');

function hashPassword(password) {
	return crypto.createHash('sha256').update(String(password)).digest('hex');
}

exports.register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body || {};

		if (!name || !email || !password) {
			return res.status(400).json({ error: 'name, email and password are required' });
		}

		const lowerEmail = String(email).toLowerCase();
		const existing = await userService.findByEmail(lowerEmail);
		if (existing) {
			return res.status(409).json({ error: 'User with this email already exists' });
		}

		const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
		const user = {
			id,
			name,
			email: lowerEmail,
			password: hashPassword(password),
			createdAt: new Date().toISOString(),
		};

		await userService.createUser(user);

		// sign token
		const token = jwtUtil.sign({ id: user.id, email: user.email });

		const { password: _p, ...safe } = user;
		return res.status(201).json({ user: safe, token });
	} catch (err) {
		return next(err);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

		const lowerEmail = String(email).toLowerCase();
		const user = await userService.findByEmail(lowerEmail);
		if (!user) return res.status(401).json({ error: 'Invalid credentials' });

		const hashed = hashPassword(password);
		if (hashed !== user.password) return res.status(401).json({ error: 'Invalid credentials' });

		const token = jwtUtil.sign({ id: user.id, email: user.email });
		const { password: _pw, ...safe } = user;
		return res.json({ user: safe, token });
	} catch (err) {
		return next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const users = await userService.getAllUsers();
		// strip passwords
		const safe = users.map(({ password, ...u }) => u);
		return res.json(safe);
	} catch (err) {
		return next(err);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const id = req.params.id;
		const user = await userService.getUserById(id);
		if (!user) return res.status(404).json({ error: 'User not found' });
		const { password, ...safe } = user;
		return res.json(safe);
	} catch (err) {
		return next(err);
	}
};

