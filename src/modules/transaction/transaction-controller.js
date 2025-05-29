const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require('./transaction-service');

async function newTransaction(req, res) {
  const { title, value, type, date, category } = req.body;
  const userId = req.user.id;

  if (!title || !value || !type || !date || !userId || !category) {
    return res
      .status(400)
      .json({ message: 'Todos os campos são obrigatórios' });
  }
  try {
    const result = await createTransaction({
      title,
      value,
      type,
      date,
      userId,
      category,
    });

    return res.status(201).json({
      message: 'Transação criada com sucesso',
      transaction: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro ao criar transação', error: error.message });
  }
}

async function getTransaction(req, res) {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }
  try {
    const result = await getTransactions(userId);
    return res.status(200).json({
      message: 'Transações obtidas com sucesso',
      transactions: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro ao obter transações', error: error.message });
  }
}

async function updateTransctions(req, res) {
  const { id, title, value, type, date, category } = req.body;
  const userId = req.user.id;

  if (!id || !title || !value || !type || !date || !userId || !category) {
    return res
      .status(400)
      .json({ message: 'Todos os campos são obrigatórios' });
  }
  try {
    const result = await updateTransaction({
      id,
      title,
      value,
      type,
      date,
      userId,
      category,
    });
    return res.status(200).json({
      message: 'Transação atualizada com sucesso',
      transaction: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro ao atualizar transação', error: error.message });
  }
}

async function deleteTransactions(req, res) {
  const { id } = req.query;
  const userId = req.user.id;

  if (!id) {
    return res.status(400).json({ message: 'ID da transação não encontrado' });
  }
  try {
    const result = await deleteTransaction(id, userId);
    return res.status(200).json({
      message: 'Transação deletada com sucesso',
      result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro ao deletar transação', error: error.message });
  }
}

module.exports = {
  newTransaction,
  getTransaction,
  updateTransctions,
  deleteTransactions,
};
