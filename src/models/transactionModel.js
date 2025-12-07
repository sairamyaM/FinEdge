const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "transactions.json");

async function readFileSafe() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeFileSafe(content) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2), "utf8");
}

async function insert(tx) {
  const all = await readFileSafe();
  all.push(tx);
  await writeFileSafe(all);
  return tx;
}

async function find(filters = {}) {
  const all = await readFileSafe();
  let result = all;

  if (filters.type) result = result.filter((item) => item.type === filters.type);
  if (filters.category) result = result.filter((item) => item.category === filters.category);
  if (filters.from) result = result.filter((item) => item.date >= filters.from);
  if (filters.to) result = result.filter((item) => item.date <= filters.to);

  return result;
}

async function findById(id) {
  const all = await readFileSafe();
  return all.find((tx) => tx.id === id) || null;
}

async function update(id, patch) {
  const all = await readFileSafe();
  const index = all.findIndex((tx) => tx.id === id);
  if (index === -1) return null;

  all[index] = { ...all[index], ...patch };
  await writeFileSafe(all);
  return all[index];
}

async function remove(id) {
  const all = await readFileSafe();
  const index = all.findIndex((tx) => tx.id === id);
  if (index === -1) return false;

  all.splice(index, 1);
  await writeFileSafe(all);
  return true;
}

module.exports = { insert, find, findById, update, remove };
