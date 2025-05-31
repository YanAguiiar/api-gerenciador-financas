require('dotenv').config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function resumeTransactions(data) {
  try {
    const formattedTransactions = data.transactions.map((t) => {
      return `(${t.date}) ${t.type} de R$${t.value} em "${t.title}" [Categoria: ${t.category.name}]`;
    });

    console.log(formattedTransactions);

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
                  text: `Analise as seguintes transações financeiras:

${formattedTransactions.join(', ')}

Forneça um resumo conciso destacando os principais padrões observados: tipos de transações mais recorrentes, categorias mais frequentes, hábitos de consumo e qualquer comportamento financeiro notável.

**Importante:**  
- Traga o resultado **exclusivamente em elementos HTML** (H1, H2, H3 e p etc).  
- **Não repita o título fora das tags HTML.**  
- Evite qualquer caractere ou texto fora da estrutura HTML.  
`,
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
