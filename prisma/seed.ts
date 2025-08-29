// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. LIMPAR TODAS AS TABELAS NA ORDEM CORRETA
    await prisma.transaction.deleteMany();
    await prisma.financialGoal.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Dados antigos removidos');

    // 2. CRIAR USUÁRIO
    const user = await prisma.user.create({
      data: {
        email: 'teste@email.com',
        name: 'Usuário Teste',
        password: 'senha123',
      },
    });
    console.log('✅ Usuário criado:', user.id);

    // 3. CRIAR CATEGORIAS
    const categoriaMercado = await prisma.category.create({
      data: { name: 'Mercado', type: 'expense', color: '#33FF57', userId: user.id }
    });
    const categoriaBiscoitos = await prisma.category.create({
      data: { name: 'Biscoitos', type: 'expense', color: '#3357FF', userId: user.id }
    });
    const categoriaLimpeza = await prisma.category.create({
      data: { name: 'Limpeza', type: 'expense', color: '#F333FF', userId: user.id }
    });
    const categoriaSalario = await prisma.category.create({
      data: { name: 'Salário', type: 'income', color: '#33FFF3', userId: user.id }
    });
    const categoriaTransporte = await prisma.category.create({
      data: { name: 'Transporte', type: 'expense', color: '#FF33A1', userId: user.id }
    });
    console.log('✅ Categorias criadas');

    // 4. CRIAR TRANSAÇÕES
    await prisma.transaction.createMany({
      data: [
        { description: 'Feijão', amount: 18.75, type: 'expense', date: new Date(), categoryId: categoriaMercado.id, userId: user.id },
        { description: 'Macarrão', amount: 14.75, type: 'expense', date: new Date(), categoryId: categoriaMercado.id, userId: user.id },
        { description: 'Biscoito Negresco', amount: 2.75, type: 'expense', date: new Date(), categoryId: categoriaBiscoitos.id, userId: user.id },
        { description: 'Papel Higiênico', amount: 8.25, type: 'expense', date: new Date(), categoryId: categoriaLimpeza.id, userId: user.id },
        { description: 'Salário Mensal', amount: 2500.00, type: 'income', date: new Date(), categoryId: categoriaSalario.id, userId: user.id },
        { description: 'Ônibus', amount: 4.50, type: 'expense', date: new Date(), categoryId: categoriaTransporte.id, userId: user.id },
      ],
    });
    console.log('✅ Transações criadas');

    console.log('🎉 Seed completo executado com sucesso!');

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();