const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "budgets.json");

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

async function insert(budget) {
  const all = await readFileSafe();
  all.push(budget);
  await writeFileSafe(all);
  return budget;
}


async function findByUserAndMonth(userId, month) {
  const all = await readFileSafe();
  return all.find(
    (b) => b.userId === userId && b.month === month
  ) || null;
}


async function updateBudget(userId, month, patch) {
  const all = await readFileSafe();
  const index = all.findIndex(
    (b) => b.userId === userId && b.month === month
  );

  if (index === -1) return null;

  all[index] = { ...all[index], ...patch };
  await writeFileSafe(all);

  return all[index];
}

module.exports = {
  insert,
  findByUserAndMonth,
  updateBudget
};
