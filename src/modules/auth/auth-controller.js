const { authenticateUser, registerUser } = require('./auth-service');

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Usuário e senha são obrigatórios' });
  }

  try {
    const result = await authenticateUser(email);

    if (!result) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const { user, token } = result;

    return res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user: { id: user.id, name: user.name },
    });
  } catch (err) {
    console.error('Erro ao autenticar usuário', err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Nome, email e senha são obrigatórios' });
  }

  try {
    const result = await registerUser(name, email, password);
    if (!result) {
      return res.status(400).json({ message: 'Erro ao registrar usuário' });
    }
    const { user } = result;
    return res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: { id: user.id, name: user.name },
    });
  } catch (error) {
    console.error('Erro ao registrar usuário', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

module.exports = { login, register };
