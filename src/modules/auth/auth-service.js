const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../../config/data-source');
require('dotenv').config();
const bcrypt = require('bcrypt');

async function authenticateUser(email, passwordClient) {
  const repository = AppDataSource.getRepository('User');
  const user = await repository.findOne({
    where: { email },
  });
  if (!user) return null;

  const isPasswordCorrect = await bcrypt.compare(passwordClient, user.password);
  if (!isPasswordCorrect) {
    throw new Error('Senha incorreta');
  }

  const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
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
  const saltsRounds = parseInt(process.env.BCRYPT_SALT);
  const hashedPassword = await bcrypt.hash(password, saltsRounds);
  if (!hashedPassword) {
    throw new Error('Erro ao criptografar a senha');
  }

  const user = repository.create({ name, email, password: hashedPassword });
  await repository.save(user);

  return { user };
}

async function createDefaultCategories(userId) {
  const categoryRepository = AppDataSource.getRepository('Category');
  const userRepository = AppDataSource.getRepository('User');
  const user = await userRepository.findOne({
    where: { id: userId },
  });
  const defaultCategories = [
    { name: 'Alimentação', userId },
    { name: 'Transporte', userId },
    { name: 'Salário', userId },
    { name: 'Outros', userId },
  ];

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  for (const category of defaultCategories) {
    const existingCategory = await categoryRepository.findOne({
      where: { name: category.name, user: { id: user.id } },
      relations: ['user'],
    });
    if (!existingCategory) {
      const newCategory = categoryRepository.create({
        name: category.name,
        user: user,
      });
      await categoryRepository.save(newCategory);
    }
  }
}
module.exports = { authenticateUser, registerUser, createDefaultCategories };
