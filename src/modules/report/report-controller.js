const { getResume, getResumeIA } = require('./report-service');

async function resumeTransactions(req, res) {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  try {
    const resume = await getResume(userId);

    return res.status(200).json({
      message: 'Resumo das transações obtido com sucesso!',
      resume,
    });
  } catch (error) {
    console.error('Erro ao obter resumo das transações', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function resumeIA(req, res) {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  try {
    // Aqui você pode implementar a lógica para obter o resumo usando IA
    // Por enquanto, vamos simular uma resposta
    const resume = await getResumeIA(userId);

    return res.status(200).json({
      message: 'Resumo das transações obtido com sucesso!',
      resume: resume.replace(/^```html.*\n?|\n?```$/g, '').trim(), // Remove a marcação de código
    });
  } catch (error) {
    console.error('Erro ao obter resumo das transações com IA', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

module.exports = { resumeTransactions, resumeIA };
