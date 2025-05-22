const { createCategory } = require('./category-service');

async function newCategory(req, res) {
  console.log(req.body);
  const { name } = req.body;
  // return res.status(200).json({ message: 'ok' });

  if (!name) {
    return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
  }
  try {
    const result = await createCategory(req.body);

    return res.status(201).json({
      message: 'Categoria criada com sucesso!',
      category: result,
    });
  } catch (error) {
    console.error('Erro ao criar categoria', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

module.exports = { newCategory };
