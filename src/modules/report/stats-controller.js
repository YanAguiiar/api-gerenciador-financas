const { getFinancialStats } = require('./stats-service');

async function getStats(req, res) {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  try {
    const stats = await getFinancialStats(userId);
    return res.status(200).json(stats);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro ao obter estatísticas', error: error.message });
  }
}

module.exports = {
  getStats,
}; 