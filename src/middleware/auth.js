const jwtUtil = require('../utils/jwt');
const userService = require('../services/userService');

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = auth.slice(7).trim();
    const payload = jwtUtil.verify(token);
    if (!payload || !payload.id) return res.status(401).json({ error: 'Invalid token' });

    const user = await userService.getUserById(payload.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    // attach safe user (omit password)
    const { password, ...safe } = user;
    req.user = safe;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', details: err.message });
  }
};
