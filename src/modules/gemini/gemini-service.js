require('dotenv').config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function resumeTransactions(data) {
  try {
    const formattedTransactions = data.transactions.map((t) => {
      return `(${t.date}) ${t.type} de R$${t.value} em "${t.title}" [Categoria: ${t.category.name}]`;
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Resuma as seguintes transações financeiras: ${formattedTransactions.join(
                    ', '
                  )} e forneça um resumo conciso e claro. Foque nos principais pontos, saldo RECEITA - DESPESA, como total gasto, categorias mais frequentes e qualquer padrão notável nas transações.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const result = await response.json();

    const resumo = result.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(resumo);
    return resumo;
  } catch (error) {
    console.error('Erro ao acessar a API Gemini:', error.message);
    return null;
  }
}

module.exports = {
  resumeTransactions,
};
