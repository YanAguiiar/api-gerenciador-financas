const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../../config/data-source');

async function authenticateUser(email) {
  const repository = AppDataSource.getRepository('User');
  const user = await repository.findOne({
    where: { email },
  });
  if (!user) return null;

  const token = jwt.sign({ id: user.id }, 'TESTE', {
    expiresIn: '1h',
  });

  return { user, token };
}

async function registerUser(name, email, password) {
  const repository = AppDataSource.getRepository('User');
  const existingUser = await repository.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const user = repository.create({ name, email, password });
  await repository.save(user);

  return { user };
}

module.exports = { authenticateUser, registerUser };
