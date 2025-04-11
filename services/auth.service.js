const jwt = require('jsonwebtoken');
const { users, divisions } = require('../models');

exports.login = async (email, password) => {
  const user = await users.findOne({ where: { email } });
  if (!user || !user.validPassword(password)) {
    throw new Error('Invalid username or password');
  }

  const userDivision = await divisions.findOne({ where: { id: user.division_id } });

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      division: userDivision ? userDivision.name : null,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token };
};