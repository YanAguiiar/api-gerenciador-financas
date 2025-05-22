const { AppDataSource } = require('../../config/data-source');

async function createCategory(data) {
  const { name, user } = data;

  if (!name) {
    throw new Error('Nome da categoria é obrigatório');
  }

  try {
    const repository = AppDataSource.getRepository('Category');
    const userRepository = AppDataSource.getRepository('User');
    const userExists = await userRepository.findOne({
      where: { id: user },
    });
    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }
    console.log(userExists);
    const existingCategory = await repository.findOne({
      where: { name, user: { id: user } },
    });

    if (existingCategory) {
      throw new Error('Categoria já existe');
    }

    const category = repository.create({ name, user: { id: user } });
    await repository.save(category);

    return { id: category.id, name: category.name };
  } catch (error) {
    throw new Error('Erro ao criar categoria');
  }
}

module.exports = { createCategory };
