const {
  createCategories,
  getCategories,
  updateCategories,
  deleteCategories,
} = require('./category-service');

async function newCategory(req, res) {
  console.log(req.body);
  const { name } = req.body;
  // return res.status(200).json({ message: 'ok' });

  if (!name) {
    return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
  }
  try {
    const result = await createCategories(req.body);

    return res.status(201).json({
      message: 'Categoria criada com sucesso!',
      category: result,
    });
  } catch (error) {
    console.error('Erro ao criar categoria', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

// Obter Categorias
async function getCategory(req, res) {
  const { user } = req.query;
  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }
  try {
    const categories = await getCategories(req.query);

    return res.status(200).json({
      message: 'Categorias obtidas com sucesso!',
      categories,
    });
  } catch (error) {
    console.error('Erro ao obter categorias', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function updateCategory(req, res) {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({ message: 'ID e nome são obrigatórios' });
  }
  try {
    const result = await updateCategories(req.body);

    return res.status(200).json({
      message: 'Categoria atualizada com sucesso!',
      category: result,
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function deleteCategory(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'ID é obrigatório' });
  }
  try {
    const result = await deleteCategories(req.params);

    return res.status(200).json({
      message: true,
      category: result,
    });
  } catch (error) {
    console.error('Erro ao deletar categoria', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

module.exports = { newCategory, getCategory, updateCategory, deleteCategory };
