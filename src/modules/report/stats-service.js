const { AppDataSource } = require('../../config/data-source');
const { Between, LessThanOrEqual } = require('typeorm');

const userRepository = AppDataSource.getRepository('User');
const categoryRepository = AppDataSource.getRepository('Category');
const transactionRepository = AppDataSource.getRepository('Transaction');

function getPreviousMonthDates() {
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  
  return {
    currentMonthStart: currentMonth,
    previousMonthStart: previousMonth,
    currentMonthEnd: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    previousMonthEnd: new Date(today.getFullYear(), today.getMonth(), 0)
  };
}

function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number(((current - previous) / previous * 100).toFixed(1));
}

async function getFinancialStats(userId) {
  try {
    const userExists = await userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    const dates = getPreviousMonthDates();

    // Buscar transações do mês atual
    const currentMonthTransactions = await transactionRepository.find({
      where: {
        user: { id: userId },
        date: Between(dates.currentMonthStart, dates.currentMonthEnd)
      },
      relations: ['category']
    });

    // Buscar transações do mês anterior
    const previousMonthTransactions = await transactionRepository.find({
      where: {
        user: { id: userId },
        date: Between(dates.previousMonthStart, dates.previousMonthEnd)
      },
      relations: ['category']
    });

    // Calcular totais do mês atual
    const currentMonthTotals = currentMonthTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'RECEITA') {
        acc.receitas += Number(transaction.value);
      } else {
        acc.despesas += Number(transaction.value);
      }
      return acc;
    }, { receitas: 0, despesas: 0 });

    // Calcular totais do mês anterior
    const previousMonthTotals = previousMonthTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'RECEITA') {
        acc.receitas += Number(transaction.value);
      } else {
        acc.despesas += Number(transaction.value);
      }
      return acc;
    }, { receitas: 0, despesas: 0 });

    // Calcular variações percentuais
    const variacaoReceitas = calculatePercentageChange(currentMonthTotals.receitas, previousMonthTotals.receitas);
    const variacaoDespesas = calculatePercentageChange(currentMonthTotals.despesas, previousMonthTotals.despesas);
    const saldoAtual = currentMonthTotals.receitas - currentMonthTotals.despesas;
    const saldoAnterior = previousMonthTotals.receitas - previousMonthTotals.despesas;
    const variacaoSaldo = calculatePercentageChange(saldoAtual, saldoAnterior);

    // Calcular maiores despesas
    const maioresDespesas = currentMonthTransactions
      .filter(t => t.type === 'DESPESA')
      .sort((a, b) => Number(b.value) - Number(a.value))
      .slice(0, 4)
      .map(t => ({
        nome: t.title,
        valor: Number(t.value)
      }));

    // Calcular categorias principais
    const categoriasPrincipais = currentMonthTransactions.reduce((acc, transaction) => {
      const categoria = transaction.category.name;
      if (!acc[categoria]) {
        acc[categoria] = 0;
      }
      acc[categoria] += Number(transaction.value);
      return acc;
    }, {});

    // Calcular percentuais das categorias
    const totalTransacoes = Object.values(categoriasPrincipais).reduce((a, b) => a + b, 0);
    const categoriasComPercentual = Object.entries(categoriasPrincipais)
      .map(([categoria, valor]) => ({
        categoria,
        percentual: Number(((valor / totalTransacoes) * 100).toFixed(1))
      }))
      .sort((a, b) => b.percentual - a.percentual)
      .slice(0, 5);

    // Simulação de metas financeiras (como exemplo)
    const metasFinanceiras = [
      {
        nome: "Fundo de Emergência",
        percentual: 50
      },
      {
        nome: "Viagem de Férias",
        percentual: 50
      },
      {
        nome: "Novo Notebook",
        percentual: 75
      }
    ];

    return {
      resumoFinanceiro: {
        totalReceitas: Number(currentMonthTotals.receitas.toFixed(2)),
        totalDespesas: Number(currentMonthTotals.despesas.toFixed(2)),
        saldoFinal: Number(saldoAtual.toFixed(2)),
        variacoes: {
          receitas: variacaoReceitas,
          despesas: variacaoDespesas,
          saldo: variacaoSaldo
        }
      },
      maioresDespesas,
      categoriasPrincipais: categoriasComPercentual,
      metasFinanceiras
    };
  } catch (error) {
    throw new Error(`Erro ao gerar estatísticas: ${error.message}`);
  }
}

module.exports = {
  getFinancialStats
}; 