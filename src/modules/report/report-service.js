const { resumeTransactions } = require('../gemini/gemini-service');
const { AppDataSource } = require('../../config/data-source');
require('dotenv').config();

const userRepository = AppDataSource.getRepository('User');
const categoryRepository = AppDataSource.getRepository('Category');
const transactionRepository = AppDataSource.getRepository('Transaction');

async function getResume(data) {
  const { userId } = data;

  try {
    const userExists = await userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    const transactions = await transactionRepository.find({
      where: { user: { id: userId } },
      relations: ['category'],
    });

    if (transactions.length === 0) {
      throw new Error('Nenhuma transação encontrada para o usuário');
    }

    const totalPorTipo = transactions.reduce((acc, item) => {
      const value = Number(item.value);
      acc[item.type] = (acc[item.type] || 0) + value;
      return acc;
    }, {});

    const totalReceita = totalPorTipo.RECEITA || 0;
    const totalDespesa = totalPorTipo.DESPESA || 0;
    const saldoFinal = Number((totalReceita - totalDespesa).toFixed(2));

    return {
      totalReceita,
      totalDespesa,
      saldoFinal,
    };
  } catch (error) {
    throw new Error('Erro ao gerar resumo das transações');
  }
}

async function getResumeIA(data) {
  const { userId } = data;

  try {
    const userExists = await userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    const transactions = await transactionRepository.find({
      where: { user: { id: userId } },
      relations: ['category'],
    });

    if (transactions.length === 0) {
      throw new Error('Nenhuma transação encontrada para o usuário');
    }

    const resumoIA = await resumeTransactions({ transactions });

    return resumoIA;
  } catch (error) {
    throw new Error('Erro ao gerar resumo das transações com IA');
  }
}

module.exports = { getResume, getResumeIA };
