const { getResume } = require('./report-service');

async function resumeTransactions(req, res) {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  try {
    const resume = await getResume(req.query);

    return res.status(200).json({
      message: 'Resumo das transações obtido com sucesso!',
      resume,
    });
  } catch (error) {
    console.error('Erro ao obter resumo das transações', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

module.exports = { resumeTransactions };
