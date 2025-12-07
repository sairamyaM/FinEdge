const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

async function readData() {
	try {
		const raw = await fs.readFile(dataPath, 'utf8');
		return JSON.parse(raw || '[]');
	} catch (err) {
		if (err && err.code === 'ENOENT') return [];
		throw err;
	}
}

async function writeData(data) {
	await fs.mkdir(path.dirname(dataPath), { recursive: true });
	await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

exports.findAll = async () => {
	return readData();
};

exports.findById = async (id) => {
	const items = await readData();
	return items.find((i) => String(i.id) === String(id)) || null;
};

exports.findByEmail = async (email) => {
	if (!email) return null;
	const items = await readData();
	return items.find((i) => i.email === String(email).toLowerCase()) || null;
};

exports.create = async (obj) => {
	const items = await readData();
	items.push(obj);
	await writeData(items);
	return obj;
};

