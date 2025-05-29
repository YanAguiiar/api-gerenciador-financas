const { AppDataSource } = require('../../config/data-source');

const repository = AppDataSource.getRepository('Transaction');
const userRepository = AppDataSource.getRepository('User');
const categoryRepository = AppDataSource.getRepository('Category');

async function createTransaction(data) {
  const { title, value, type, date, userId, category } = data;

  if (!title || !value || !type || !date || !userId || !category) {
    throw new Error('Todos os campos são obrigatórios');
  }

  try {
    const userExists = await userRepository.findOne({
      where: { id: userId },
    });
    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    const categoryExists = await categoryRepository.findOne({
      where: { id: category },
    });
    if (!categoryExists) {
      throw new Error('Categoria não encontrada');
    }

    const transaction = repository.create({
      title,
      value,
      type,
      date,
      user: { id: userId },
      category: { id: category },
    });
    await repository.save(transaction);

    return {
      id: transaction.id,
      title: transaction.title,
      value: transaction.value,
      type: transaction.type,
      date: transaction.date,
    };
  } catch (error) {
    throw new Error('Erro ao criar transação ' + error.message);
  }
}

async function getTransactions(data) {
  const { userId } = data;
  try {
    const userExists = await userRepository.findOne({
      where: { id: userId },
    });
    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }
    const transactions = await repository.find({
      where: { user: { id: userId } },
      relations: ['category'],
    });

    return transactions;
  } catch (error) {
    throw new Error('Erro ao buscar transações');
  }
}

async function updateTransaction(data) {
  const { id, title, value, type, date, userId, category } = data;
  try {
    const userExists = await userRepository.findOne({
      where: { id: userId },
    });
    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    const categoryExists = await categoryRepository.findOne({
      where: { id: category },
    });
    if (!categoryExists) {
      throw new Error('Categoria não encontrada');
    }

    const transaction = await repository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada');
    }
    transaction.title = title;
    transaction.value = value;
    transaction.type = type;
    transaction.date = date;
    transaction.category = { id: category };
    await repository.save(transaction);
    return {
      id: transaction.id,
      title: transaction.title,
      value: transaction.value,
      type: transaction.type,
      date: transaction.date,
    };
  } catch (error) {
    throw new Error('Erro ao atualizar transação ' + error.message);
  }
}

async function deleteTransaction(data) {
  const { id, userId } = data;

  try {
    const userExists = await userRepository.findOne({
      where: { id: userId },
    });
    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    const transaction = await repository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!transaction) {
      throw new Error('Transação não encontrada');
    }
    await repository.remove(transaction);
    return {
      transaction,
    };
  } catch (error) {
    throw new Error('Erro ao deletar transação ' + error.message);
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
