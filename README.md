# API Gerenciador de Finanças Pessoais

API REST para gerenciamento de finanças pessoais, desenvolvida com Node.js, Express e PostgreSQL.

## 📋 Funcionalidades

- Autenticação de usuários (login/registro)
- Gerenciamento de categorias
- Controle de transações (receitas e despesas)
- Relatórios financeiros
- Estatísticas e análises financeiras
- Integração com IA para análise de gastos

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- TypeORM
- JWT para autenticação
- CORS

## 📦 Pré-requisitos

- Node.js
- PostgreSQL
- NPM ou Yarn

## 🛠️ Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco
JWT_SECRET_KEY=sua_chave_secreta
BCRYPT_SALT=10
```

4. Inicie o servidor
```bash
npm start
```

O servidor iniciará na porta 3001.

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
  - Body: `{ "email": "string", "password": "string" }`
- `POST /api/auth/register` - Registro de novo usuário
  - Body: `{ "name": "string", "email": "string", "password": "string" }`

### Categorias
> Requer autenticação

- `GET /api/categories` - Lista todas as categorias
- `POST /api/categories` - Cria nova categoria
  - Body: `{ "name": "string" }`
- `PUT /api/categories` - Atualiza categoria
  - Body: `{ "id": "number", "name": "string" }`
- `DELETE /api/categories/:id` - Remove categoria

### Transações
> Requer autenticação

- `GET /api/transactions` - Lista todas as transações
- `POST /api/transactions` - Cria nova transação
  - Body: `{ "title": "string", "value": number, "type": "RECEITA|DESPESA", "date": "date", "category": "number" }`
- `PUT /api/transactions` - Atualiza transação
  - Body: `{ "id": "number", "title": "string", "value": number, "type": "string", "date": "date", "category": "number" }`
- `DELETE /api/transactions?id=:id` - Remove transação

### Relatórios
> Requer autenticação

- `GET /api/report` - Obtém resumo das transações
- `GET /api/report/ia` - Obtém análise inteligente das transações

## 🔒 Autenticação

A API utiliza JWT (JSON Web Token) para autenticação. Para acessar endpoints protegidos, inclua o token no header da requisição:

```
Authorization: Bearer seu_token_jwt
```

## 📊 Respostas da API

A API retorna respostas no seguinte formato:

### Sucesso
```json
{
  "message": "Mensagem de sucesso",
  "data": { ... }
}
```

### Erro
```json
{
  "message": "Mensagem de erro"
}
```