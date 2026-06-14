const jwt = require('jsonwebtoken');

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    points: user.points,
    is_active: user.is_active
  };
}

module.exports = { signToken, publicUser };
