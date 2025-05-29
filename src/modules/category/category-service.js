const { AppDataSource } = require('../../config/data-source');

const repository = AppDataSource.getRepository('Category');
const userRepository = AppDataSource.getRepository('User');

async function createCategories(data) {
  const { name, user } = data;

  if (!name) {
    throw new Error('Nome da categoria é obrigatório');
  }

  try {
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

async function getCategories(data) {
  const { id } = data;
  try {
    const userExists = await userRepository.findOne({
      where: { id },
    });
    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }
    const categories = await repository.find({
      where: { user: { id } },
    });

    return categories;
  } catch (error) {
    throw new Error('Erro ao buscar categorias');
  }
}

async function updateCategories(data) {
  const { id, name, user } = data;
  if (!user) {
    throw new Error('Usuário não encontrado');
  }
  try {
    const userExists = await userRepository.findOne({
      where: { id: user },
    });
    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }
    const category = await repository.findOne({
      where: { id, user: { id: user } },
    });

    if (!category) {
      throw new Error('Categoria não encontrada');
    }

    category.name = name;

    await repository.save(category);

    return category;
  } catch (error) {
    throw new Error('Erro ao atualizar categoria');
  }
}

async function deleteCategories(data) {
  //deletar apenas usando o id da categoria
  const { id, userId } = data;
  if (!id) {
    throw new Error('ID da categoria é obrigatório');
  }
  try {
    const category = await repository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!category) {
      throw new Error('Categoria não encontrada');
    }

    await repository.remove(category);

    return { message: 'Categoria deletada com sucesso' };
  } catch (error) {
    throw new Error('Erro ao deletar categoria');
  }
}

module.exports = {
  createCategories,
  getCategories,
  updateCategories,
  deleteCategories,
};
